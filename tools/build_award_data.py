#!/usr/bin/env python3
"""
TaxSignal award data builder.

Turns the Fair Work Commission Modern Awards Pay Database (MAPD) Excel extracts
into the small JSON files the "Am I Being Underpaid?" page loads.

Every July (or whenever the FWC updates the extracts):
  1. Download the five extracts from
     https://www.fwc.gov.au/work-conditions/awards/modern-awards-pay-database
     (award, classification, penalty, wage allowance, expense allowance).
  2. Put them in one folder, for example  data/fwc-source/
  3. Run, from the repo root:
        pip install openpyxl
        python3 tools/build_award_data.py data/fwc-source
  4. Commit the changed files in data/awards/ and push.

The script only copies figures from the spreadsheets. It never calculates or
guesses a rate: every dollar amount in the output is a value that appears in
the FWC extracts.
"""
import glob
import json
import os
import re
import sys
from collections import Counter, OrderedDict
from datetime import datetime

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl is needed: pip install openpyxl")

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "awards")

FILES = {
    "award": "*award-export*.xlsx",
    "cls": "*classification-export*.xlsx",
    "pen": "*penalty-export*.xlsx",
    "wa": "*wage-allowance-export*.xlsx",
    "ea": "*expense-allowance-export*.xlsx",
}

# Extra search words so people can type everyday job names.
SYNONYMS = {
    "MA000003": "fast food takeaway burger pizza kfc mcdonalds hungry jacks crew",
    "MA000004": "retail shop store supermarket checkout sales assistant shelf",
    "MA000009": "hospitality hotel pub bar bartender waiter waitress barista chef cook kitchen hand housekeeping club",
    "MA000119": "restaurant cafe waiter waitress barista chef cook kitchen hand",
    "MA000022": "cleaner cleaning janitor commercial cleaning",
    "MA000034": "nurse nursing rn enrolled nurse aged care nurse",
    "MA000018": "aged care carer personal care worker",
    "MA000100": "disability support worker social community home care ndis schads",
    "MA000002": "clerk admin administration receptionist office",
    "MA000010": "manufacturing factory process worker",
    "MA000020": "construction building labourer",
    "MA000038": "truck driver transport logistics delivery driver",
    "MA000084": "warehouse storeperson forklift",
    "MA000016": "security guard",
    "MA000005": "hair beauty hairdresser barber beautician nail",
    "MA000012": "pharmacy pharmacist chemist",
    "MA000120": "childcare early childhood educator",
    "MA000106": "real estate property agent",
    "MA000081": "live performance theatre music actor crew",
    "MA000028": "horticulture farm fruit picking",
    "MA000035": "pastoral farm hand station",
    "MA000080": "amusement events cinema",
}


def load(folder, key):
    matches = glob.glob(os.path.join(folder, FILES[key]))
    if not matches:
        sys.exit("Missing the %s extract (%s) in %s" % (key, FILES[key], folder))
    ws = openpyxl.load_workbook(matches[0], read_only=True, data_only=True).worksheets[0]
    rows = ws.iter_rows(values_only=True)
    header = [str(h).strip() if h is not None else "" for h in next(rows)]
    out = []
    for r in rows:
        if r is None or all(v is None for v in r):
            continue
        out.append(dict(zip(header, r)))
    print("  %-6s %6d rows  (%s)" % (key, len(out), os.path.basename(matches[0])))
    return out


def d(v):
    if v is None or v == "":
        return None
    if isinstance(v, datetime):
        return v.strftime("%Y-%m-%d")
    s = str(v).strip()
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass
    return s[:10]


def num(v):
    if v is None or v == "":
        return None
    try:
        return round(float(v), 4)
    except (TypeError, ValueError):
        return None


def clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip()


def get(row, *names):
    for n in names:
        if n in row:
            return row[n]
    lower = {k.lower(): k for k in row}
    for n in names:
        if n.lower() in lower:
            return row[lower[n.lower()]]
    return None


CATEGORY = {"AD": "adult", "CA": "adult", "JN": "junior", "AP": "apprentice", "AA": "apprentice", "TN": "trainee", "XT": "other"}


def main(folder):
    print("Reading FWC extracts from", folder)
    data = {k: load(folder, k) for k in FILES}
    os.makedirs(OUT_DIR, exist_ok=True)

    awards = OrderedDict()
    for a in data["award"]:
        code = clean(get(a, "awardCode"))
        if code:
            awards[code] = clean(get(a, "name"))

    pen_by, cls_by, wa_by, ea_by = {}, {}, {}, {}
    for r in data["pen"]:
        pen_by.setdefault(clean(get(r, "awardCode")), []).append(r)
    for r in data["cls"]:
        cls_by.setdefault(clean(get(r, "awardCode")), []).append(r)
    for r in data["wa"]:
        wa_by.setdefault(clean(get(r, "awardCode")), []).append(r)
    for r in data["ea"]:
        ea_by.setdefault(clean(get(r, "awardCode")), []).append(r)

    froms = Counter()
    index = []
    year = None
    for code, name in awards.items():
        dates = []

        def di(v):
            v = d(v)
            if v is None:
                return -1
            if v not in dates:
                dates.append(v)
            return dates.index(v)

        groups, gkey, clss, ckey, pens, pkey, rows = [], {}, [], {}, [], {}, []
        for r in pen_by.get(code, []):
            if get(r, "isHeading") in (1, "1", True):
                continue
            rtype = clean(get(r, "employeeRateTypeCode"))
            val = num(get(r, "penaltyCalculatedValue"))
            if not rtype or val is None:
                continue
            year = year or get(r, "publishedYear")
            desc = clean(get(r, "clauseDescription"))
            if desc not in gkey:
                gkey[desc] = len(groups)
                groups.append({"d": desc, "cl": clean(get(r, "clauses")), "types": Counter()})
            g = gkey[desc]
            groups[g]["types"][rtype] += 1
            ck = (clean(get(r, "parentClassificationName")), clean(get(r, "classification")))
            if ck not in ckey:
                ckey[ck] = len(clss)
                clss.append([ck[0], ck[1]])
            pk = clean(get(r, "penaltyDescription"))
            if pk not in pkey:
                pkey[pk] = len(pens)
                pens.append(pk)
            f = get(r, "operativeFrom")
            froms[d(f)] += 1
            rows.append([g, ckey[ck], pkey[pk], val, num(get(r, "rate")), di(f), di(get(r, "operativeTo"))])

        out_groups = []
        for g in groups:
            t = g["types"].most_common(1)[0][0]
            low = g["d"].lower()
            casual = "casual" in low
            perm = bool(re.search(r"full[- ]time|part[- ]?time|permanent|weekly employees", low))
            out_groups.append({
                "d": g["d"], "cl": g["cl"], "cat": CATEGORY.get(t, "other"),
                "emp": "casual" if casual and not perm else ("perm" if perm and not casual else "any"),
                "ot": "overtime" in low,
            })

        # Minimum hourly rates from the classification extract, used for awards
        # that have no penalty data in the database.
        base = []
        for r in cls_by.get(code, []):
            if get(r, "isHeading") in (1, "1", True) or clean(get(r, "type")) != "Detail":
                continue
            rtype = clean(get(r, "employeeRateTypeCode"))
            if not rtype:
                continue
            hourly = None
            if clean(get(r, "calculatedRateType")).lower() == "hourly":
                hourly = num(get(r, "calculatedRate"))
            elif clean(get(r, "baseRateType")).lower() == "hourly":
                hourly = num(get(r, "baseRate"))
            if hourly is None:
                continue
            base.append([clean(get(r, "parentClassificationName")), clean(get(r, "classification")),
                         CATEGORY.get(rtype, "other"), hourly, di(get(r, "operativeFrom")), di(get(r, "operativeTo"))])

        def allowances(src, amount_key):
            out = []
            for r in src:
                if get(r, "isHeading") in (1, "1", True) or clean(get(r, "type")) != "Detail":
                    continue
                if d(get(r, "operativeTo", "OperativeTo")):
                    continue
                amt = num(get(r, amount_key))
                if amt is None:
                    continue
                out.append([clean(get(r, "allowance")), amt, clean(get(r, "paymentFrequency")), clean(get(r, "clauses"))])
            return out

        doc = {
            "code": code, "name": name, "dates": dates, "groups": out_groups,
            "cls": clss, "pens": pens, "rows": rows, "base": base,
            "wa": allowances(wa_by.get(code, []), "allowanceAmount"),
            "ea": allowances(ea_by.get(code, []), "allowanceAmount"),
        }
        with open(os.path.join(OUT_DIR, code + ".json"), "w", encoding="utf-8") as fh:
            json.dump(doc, fh, ensure_ascii=False, separators=(",", ":"))

        words = set(re.findall(r"[a-z]+", name.lower()))
        for _, c in clss:
            words |= set(re.findall(r"[a-z]{3,}", c.lower()))
        for c in base:
            words |= set(re.findall(r"[a-z]{3,}", (c[0] + " " + c[1]).lower()))
        entry = {"c": code, "n": name, "k": " ".join(sorted(words))[:900], "p": 1 if rows else 0}
        if SYNONYMS.get(code):
            entry["s"] = SYNONYMS[code]
        index.append(entry)

    effective = sorted([k for k in froms if k], key=lambda k: -froms[k])
    meta = {
        "built": datetime.now().strftime("%Y-%m-%d"),
        "year": year,
        "effective": effective[0] if effective else None,
        "changes": sorted(k for k in froms if k and effective and k > effective[0]),
        "source": "Fair Work Commission Modern Awards Pay Database",
    }
    with open(os.path.join(OUT_DIR, "index.json"), "w", encoding="utf-8") as fh:
        json.dump({"meta": meta, "awards": index}, fh, ensure_ascii=False, separators=(",", ":"))
    print("Wrote %d awards to %s" % (len(index), os.path.relpath(OUT_DIR)))
    print("Rates effective %s; later changes on %s" % (meta["effective"], ", ".join(meta["changes"]) or "none"))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/fwc-source")
