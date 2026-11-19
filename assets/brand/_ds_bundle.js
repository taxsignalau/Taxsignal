/* @ds-bundle: {"format":3,"namespace":"LegalWorksDesignSystem_fbaf45","components":[{"name":"Differentiator","sourcePath":"components/content/Differentiator.jsx"},{"name":"InsightCard","sourcePath":"components/content/InsightCard.jsx"},{"name":"ServiceCard","sourcePath":"components/content/ServiceCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"NavLink","sourcePath":"components/core/NavLink.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/content/Differentiator.jsx":"1c6db6d8fad1","components/content/InsightCard.jsx":"444ef0e915cb","components/content/ServiceCard.jsx":"7a469cd74249","components/core/Button.jsx":"05d97b6c2e37","components/core/NavLink.jsx":"4a8392ab949b","components/core/Tag.jsx":"efd6eea01859","ui_kits/website/Hero.jsx":"94eeabceac5b","ui_kits/website/Sections.jsx":"9ce5a76f1860","ui_kits/website/SiteFooter.jsx":"eb3a40dc0493","ui_kits/website/SiteNav.jsx":"7facb7bf1281"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LegalWorksDesignSystem_fbaf45 = window.LegalWorksDesignSystem_fbaf45 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Differentiator.jsx
try { (() => {
/**
 * Numbered differentiator — used in the dark navy horizontal strip.
 * Small royal-blue serif number, bold title, one-line description.
 */
function Differentiator({
  number,
  title,
  description
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--lw-on-navy-rule)',
      paddingTop: '22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '17px',
      color: 'var(--accent-hover)',
      letterSpacing: '0.04em',
      marginBottom: '16px'
    }
  }, number), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '20px',
      color: '#fff',
      letterSpacing: '-0.01em',
      margin: '0 0 10px',
      lineHeight: 1.2
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontSize: '14px',
      lineHeight: 1.6,
      color: 'var(--lw-on-navy-dim)',
      margin: 0
    }
  }, description));
}
Object.assign(__ds_scope, { Differentiator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Differentiator.jsx", error: String((e && e.message) || e) }); }

// components/content/InsightCard.jsx
try { (() => {
/**
 * Insight / article card. Full-bleed image with the brand dark-navy
 * overlay, category tag, serif title, date, and a "Read more →" link.
 * No shadow; image zooms slightly and the card lifts on hover.
 */
function InsightCard({
  image,
  tag,
  title,
  date,
  href = '#'
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        .lw-insight { display: block; text-decoration: none; transition: transform var(--dur) var(--ease-out); }
        .lw-insight:hover { transform: translateY(var(--lift)); }
        .lw-insight__media { position: relative; overflow: hidden; aspect-ratio: 3 / 2; background: var(--lw-navy); }
        .lw-insight__media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 600ms var(--ease-out); }
        .lw-insight:hover .lw-insight__media img { transform: scale(1.05); }
        .lw-insight__media::after { content: ""; position: absolute; inset: 0; background: var(--img-overlay); }
        .lw-insight__body { padding: 22px 2px 0; }
        .lw-insight__tag { font-family: var(--font-ui); font-weight: 600; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); }
        .lw-insight__title { font-family: var(--font-display); font-weight: 700; font-size: 21px; line-height: 1.25; letter-spacing: -0.01em; color: var(--lw-ink); margin: 12px 0 12px; }
        .lw-insight:hover .lw-insight__title { color: var(--accent); }
        .lw-insight__meta { display: flex; align-items: center; justify-content: space-between; }
        .lw-insight__date { font-family: var(--font-ui); font-size: 13px; color: var(--lw-gray); }
        .lw-insight__more { font-family: var(--font-ui); font-weight: 600; font-size: 13px; color: var(--accent); }
      `), /*#__PURE__*/React.createElement("a", {
    className: "lw-insight",
    href: href
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-insight__media"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title
  })), /*#__PURE__*/React.createElement("div", {
    className: "lw-insight__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lw-insight__tag"
  }, tag), /*#__PURE__*/React.createElement("h3", {
    className: "lw-insight__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "lw-insight__meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lw-insight__date"
  }, date), /*#__PURE__*/React.createElement("span", {
    className: "lw-insight__more"
  }, "Read more \u2192")))));
}
Object.assign(__ds_scope, { InsightCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/InsightCard.jsx", error: String((e && e.message) || e) }); }

// components/content/ServiceCard.jsx
try { (() => {
/**
 * Practice-area card. No border, no shadow. On hover: 4px lift +
 * a royal-blue bottom accent rule grows in. Thin Lucide line icon on top.
 */
function ServiceCard({
  icon = 'scale',
  title,
  description,
  href = '#'
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        .lw-service {
          position: relative;
          display: block;
          background: transparent;
          padding: 32px 28px 36px;
          text-decoration: none;
          border-bottom: 1px solid var(--lw-rule);
          transition: transform var(--dur) var(--ease-out);
        }
        .lw-service::after {
          content: ""; position: absolute; left: 0; bottom: -1px;
          height: 3px; width: 0; background: var(--accent);
          transition: width var(--dur) var(--ease-out);
        }
        .lw-service:hover { transform: translateY(var(--lift)); }
        .lw-service:hover::after { width: 100%; }
        .lw-service__icon { color: var(--accent); margin-bottom: 22px; }
        .lw-service__icon svg { width: 30px; height: 30px; stroke-width: 1.5; }
        .lw-service__title { font-family: var(--font-display); font-weight: 700; font-size: 21px; letter-spacing: -0.01em; color: var(--lw-ink); margin: 0 0 10px; line-height: 1.2; }
        .lw-service__desc { font-family: var(--font-ui); font-size: 15px; line-height: 1.6; color: var(--lw-gray); margin: 0 0 20px; }
        .lw-service__more { font-family: var(--font-ui); font-weight: 600; font-size: 13px; letter-spacing: 0.04em; color: var(--accent); display: inline-flex; gap: 7px; align-items: center; }
        .lw-service:hover .lw-service__more span { transform: translateX(4px); }
        .lw-service__more span { transition: transform var(--dur) var(--ease-out); }
      `), /*#__PURE__*/React.createElement("a", {
    className: "lw-service",
    href: href
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-service__icon"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon
  })), /*#__PURE__*/React.createElement("h3", {
    className: "lw-service__title"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "lw-service__desc"
  }, description), /*#__PURE__*/React.createElement("span", {
    className: "lw-service__more"
  }, "Learn more ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LegalWorks Button — sharp corners, no radius, no shadow.
 * Authority through solid royal fill or a crisp outline.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onDark = false,
  type = 'button',
  ...rest
}) {
  const pad = size === 'lg' ? '16px 32px' : size === 'sm' ? '9px 18px' : '13px 26px';
  const fontSize = size === 'sm' ? '12px' : '13px';
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: pad,
    border: '1px solid transparent',
    borderRadius: 0,
    cursor: 'pointer',
    textDecoration: 'none',
    lineHeight: 1,
    transition: 'background var(--dur) var(--ease-standard), color var(--dur) var(--ease-standard), border-color var(--dur) var(--ease-standard)',
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      borderColor: 'var(--accent)'
    },
    outline: onDark ? {
      background: 'transparent',
      color: '#fff',
      borderColor: 'rgba(255,255,255,0.55)'
    } : {
      background: 'transparent',
      color: 'var(--accent)',
      borderColor: 'var(--accent)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent)',
      borderColor: 'transparent',
      padding: 0,
      letterSpacing: '0.04em',
      textTransform: 'none'
    }
  };
  const cls = `lw-btn lw-btn--${variant}${onDark ? ' lw-btn--ondark' : ''}`;
  const style = {
    ...base,
    ...variants[variant]
  };
  const Tag = href ? 'a' : 'button';
  const tagProps = href ? {
    href
  } : {
    type
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        .lw-btn--primary:hover { background: var(--accent-hover) !important; border-color: var(--accent-hover) !important; }
        .lw-btn--primary:active { background: var(--accent-press) !important; border-color: var(--accent-press) !important; }
        .lw-btn--outline:hover { background: var(--accent); color: #fff !important; border-color: var(--accent) !important; }
        .lw-btn--outline.lw-btn--ondark:hover { background: #fff; color: var(--lw-navy) !important; border-color: #fff !important; }
        .lw-btn--ghost:hover { color: var(--accent-hover) !important; }
      `), /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    style: style
  }, tagProps, rest), children, variant === 'ghost' ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192") : null));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/NavLink.jsx
try { (() => {
/**
 * Nav link with a 2px royal-blue underline that slides in from the left
 * on hover. Used in the sticky navigation bar.
 */
function NavLink({
  children,
  href = '#',
  onDark = false,
  active = false
}) {
  const cls = `lw-navlink${onDark ? ' lw-navlink--ondark' : ''}${active ? ' is-active' : ''}`;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        .lw-navlink {
          position: relative;
          font-family: var(--font-ui);
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--lw-ink);
          text-decoration: none;
          padding: 6px 0;
          transition: color var(--dur) var(--ease-standard);
        }
        .lw-navlink--ondark { color: rgba(255,255,255,0.82); }
        .lw-navlink::after {
          content: "";
          position: absolute;
          left: 0; bottom: 0;
          height: 2px; width: 100%;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--dur) var(--ease-out);
        }
        .lw-navlink:hover, .lw-navlink.is-active { color: var(--accent); }
        .lw-navlink--ondark:hover { color: #fff; }
        .lw-navlink:hover::after, .lw-navlink.is-active::after { transform: scaleX(1); }
      `), /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: href
  }, children));
}
Object.assign(__ds_scope, { NavLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/NavLink.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/**
 * Uppercase tag / label. Two roles:
 *  - eyebrow: section label (royal blue, on light)
 *  - tag: small category chip used on insight cards
 */
function Tag({
  children,
  variant = 'eyebrow',
  onDark = false
}) {
  const base = {
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    lineHeight: 1,
    display: 'inline-block'
  };
  const styles = {
    eyebrow: {
      ...base,
      color: onDark ? 'rgba(255,255,255,0.7)' : 'var(--accent)'
    },
    tag: {
      ...base,
      fontSize: '11px',
      letterSpacing: '0.14em',
      color: 'var(--accent)',
      padding: '6px 10px',
      border: '1px solid var(--lw-rule)'
    },
    number: {
      ...base,
      fontFamily: 'var(--font-display)',
      fontSize: '15px',
      letterSpacing: '0.04em',
      color: 'var(--accent)',
      textTransform: 'none'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: styles[variant]
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
/* global React */
const {
  Button,
  Tag
} = window.LegalWorksDesignSystem_fbaf45;
function Hero() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        .lw-hero { position: relative; background: var(--lw-navy); color: #fff; overflow: hidden; }
        .lw-hero__inner { max-width: var(--container-max); margin-inline: auto; padding: 132px 24px 120px;
          display: grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: center; position: relative; z-index: 2; }
        .lw-hero__watermark { position: absolute; right: -60px; top: 50%; transform: translateY(-50%);
          height: 150%; width: auto; opacity: 0.05; filter: brightness(0) invert(1); pointer-events: none; z-index: 1; }
        .lw-hero__label { margin-bottom: 28px; }
        .lw-hero h1 { font-family: var(--font-serif); font-weight: 700; font-size: var(--fs-hero);
          line-height: 1.05; letter-spacing: -0.025em; color: #fff; margin: 0 0 26px; }
        .lw-hero__sub { font-family: var(--font-ui); font-size: 19px; line-height: 1.65;
          color: var(--lw-on-navy-dim); max-width: 520px; margin: 0 0 40px; }
        .lw-hero__cta { display: flex; gap: 16px; flex-wrap: wrap; }
        .lw-hero__art { position: relative; aspect-ratio: 3 / 4; }
        .lw-hero__art img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .lw-hero__art::after { content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,15,30,0.45), rgba(12,77,162,0.35)); }
        .lw-hero__lines { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
        .lw-hero__rule { height: 3px; background: var(--accent); width: 100%; }
        .reveal { opacity: 0; transform: translateY(18px); animation: lwUp 0.7s var(--ease-out) forwards; }
        .reveal-1 { animation-delay: .05s; }
        .reveal-2 { animation-delay: .2s; }
        .reveal-3 { animation-delay: .35s; }
        .reveal-4 { animation-delay: .5s; }
        @keyframes lwUp { to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; animation: none; } }
        @media (max-width: 900px) {
          .lw-hero__inner { grid-template-columns: 1fr; padding: 90px 24px 80px; }
          .lw-hero__art { display: none; }
        }
      `), /*#__PURE__*/React.createElement("section", {
    className: "lw-hero",
    id: "top"
  }, /*#__PURE__*/React.createElement("img", {
    className: "lw-hero__watermark",
    src: "../../assets/legalworks-logo.png",
    alt: "",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lw-hero__inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lw-hero__label reveal reveal-1"
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "eyebrow",
    onDark: true
  }, "LegalWorks \xB7 Islamabad")), /*#__PURE__*/React.createElement("h1", {
    className: "reveal reveal-2"
  }, "Precision.", /*#__PURE__*/React.createElement("br", null), "Integrity.", /*#__PURE__*/React.createElement("br", null), "Results."), /*#__PURE__*/React.createElement("p", {
    className: "lw-hero__sub reveal reveal-3"
  }, "Expert legal counsel for corporate, commercial, and regulatory matters across Pakistan."), /*#__PURE__*/React.createElement("div", {
    className: "lw-hero__cta reveal reveal-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onDark: true,
    href: "#services"
  }, "Our Services"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    href: "#about"
  }, "Meet the Team"))), /*#__PURE__*/React.createElement("div", {
    className: "lw-hero__art reveal reveal-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://picsum.photos/seed/lwhero/700/900",
    alt: "Islamabad skyline"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lw-hero__rule"
  })));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
/* global React */
const {
  useEffect,
  useRef,
  useState
} = React;
const {
  ServiceCard,
  InsightCard,
  Differentiator,
  Tag,
  Button
} = window.LegalWorksDesignSystem_fbaf45;

/* Reveal-on-scroll wrapper (slide-in-from-left for labels, fade-up for blocks) */
function Reveal({
  children,
  variant = 'up',
  className = ''
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.18
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: `lw-rev lw-rev--${variant}${shown ? ' is-in' : ''} ${className}`
  }, children);
}
function useCountUp(target, run) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf, start;
    const dur = 1200;
    const tick = t => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return n;
}
const SERVICES = [['scale', 'Corporate & Commercial Law', 'Structuring, governance and transactions for companies of every size.'], ['file-signature', 'Contract Drafting & Review', 'Watertight agreements, negotiated and reviewed with rigour.'], ['shield-check', 'Regulatory Compliance', 'Staying ahead of SECP, SBP and sector-specific regulators.'], ['gavel', 'Dispute Resolution', 'Litigation, arbitration and mediation, handled decisively.'], ['building-2', 'Real Estate & Property', 'Due diligence, conveyancing and development advisory.'], ['users', 'Employment & Labour Law', 'Policies, contracts and disputes across the workplace.']];
function Services() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lw-sec",
    id: "services"
  }, /*#__PURE__*/React.createElement("style", null, `
        .lw-sec { padding: 120px 0; }
        .lw-sec__head { max-width: var(--container-max); margin: 0 auto 56px; padding: 0 24px; }
        .lw-sec__head h2 { font-family: var(--font-serif); font-weight: 700; font-size: var(--fs-h2);
          letter-spacing: -0.02em; margin: 16px 0 0; max-width: 640px; }
        .lw-svc-grid { max-width: var(--container-max); margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 40px; border-top: 1px solid var(--lw-rule); }
        .lw-rev { opacity: 0; transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
        .lw-rev--up { transform: translateY(22px); }
        .lw-rev--left { transform: translateX(-26px); }
        .lw-rev.is-in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .lw-rev { opacity: 1; transform: none; } }
        @media (max-width: 900px) { .lw-svc-grid { grid-template-columns: 1fr 1fr; } .lw-sec { padding: 80px 0; } }
        @media (max-width: 600px) { .lw-svc-grid { grid-template-columns: 1fr; } }
      `), /*#__PURE__*/React.createElement("div", {
    className: "lw-sec__head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "left"
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "eyebrow"
  }, "What We Do")), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h2", null, "Comprehensive Legal Solutions"))), /*#__PURE__*/React.createElement("div", {
    className: "lw-svc-grid"
  }, SERVICES.map(([icon, title, desc], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i
  }, /*#__PURE__*/React.createElement(ServiceCard, {
    icon: icon,
    title: title,
    description: desc
  })))));
}
function About() {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setRun(true);
        io.disconnect();
      }
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const year = useCountUp(2020, run);
  return /*#__PURE__*/React.createElement("section", {
    className: "lw-about",
    id: "about",
    ref: ref
  }, /*#__PURE__*/React.createElement("style", null, `
        .lw-about { background: var(--lw-surface-alt); padding: 120px 0; }
        .lw-about__inner { max-width: var(--container-max); margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: center; }
        .lw-about__body p { font-size: 17px; line-height: 1.75; color: var(--lw-gray); margin: 0 0 24px; max-width: 460px; }
        .lw-about__stats { display: flex; gap: 56px; margin-top: 36px; }
        .lw-about__stat .num { font-family: var(--font-serif); font-weight: 700; font-size: 34px; color: var(--lw-ink); letter-spacing: -0.02em; }
        .lw-about__stat .lab { display: block; font: 600 11px/1.4 var(--font-ui); letter-spacing: .14em; text-transform: uppercase; color: var(--lw-gray); margin-top: 8px; }
        @media (max-width: 900px) { .lw-about__inner { grid-template-columns: 1fr; gap: 40px; } .lw-about { padding: 80px 0; } }
      `), /*#__PURE__*/React.createElement("div", {
    className: "lw-about__inner"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("hr", {
    className: "lw-rule-accent",
    style: {
      marginBottom: 28
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "lw-quote"
  }, "\"We combine deep local knowledge with the rigour of international legal practice.\"")), /*#__PURE__*/React.createElement(Reveal, {
    className: "lw-about__body"
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "eyebrow"
  }, "The Firm"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 16
    }
  }, "LegalWorks is an Islamabad-based consultancy advising businesses, institutions and individuals on the matters that shape their future. We pair the responsiveness of a boutique with the discipline of an international practice."), /*#__PURE__*/React.createElement("div", {
    className: "lw-about__stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-about__stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "Est. ", year), /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Founded")), /*#__PURE__*/React.createElement("div", {
    className: "lw-about__stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "Islamabad"), /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "Pakistan"))))));
}
const DIFFS = [['01', 'Client-First Approach', 'Tailored strategies for every matter.'], ['02', 'Transparent Pricing', 'No surprises, ever.'], ['03', 'Speed & Precision', 'Fast turnarounds without compromising quality.'], ['04', 'Trusted Locally', "Deep roots in Pakistan's legal ecosystem."]];
function WhyUs() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lw-why"
  }, /*#__PURE__*/React.createElement("style", null, `
        .lw-why { background: var(--lw-navy); padding: 110px 0; }
        .lw-why__inner { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; }
        .lw-why__head { margin-bottom: 56px; }
        .lw-why__head h2 { font-family: var(--font-serif); font-weight: 700; font-size: var(--fs-h2); color: #fff; letter-spacing: -0.02em; margin: 16px 0 0; }
        .lw-why__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px; }
        @media (max-width: 900px) { .lw-why__grid { grid-template-columns: 1fr 1fr; gap: 32px; } .lw-why { padding: 80px 0; } }
        @media (max-width: 560px) { .lw-why__grid { grid-template-columns: 1fr; } }
      `), /*#__PURE__*/React.createElement("div", {
    className: "lw-why__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-why__head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "left"
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "eyebrow",
    onDark: true
  }, "Why LegalWorks")), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h2", null, "Built on trust, run with precision."))), /*#__PURE__*/React.createElement("div", {
    className: "lw-why__grid"
  }, DIFFS.map(([n, t, d], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i
  }, /*#__PURE__*/React.createElement(Differentiator, {
    number: n,
    title: t,
    description: d
  }))))));
}
const INSIGHTS = [['lw1', 'Corporate Law', 'Pakistan\u2019s New Companies Regime: What Boards Should Know', 'May 2025'], ['lw2', 'Compliance', 'SECP\u2019s Digital Filing Push and the Cost of Falling Behind', 'April 2025'], ['lw3', 'Dispute Resolution', 'Arbitration in Pakistan: A Faster Path to Resolution', 'March 2025']];
function Insights() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lw-sec",
    id: "insights"
  }, /*#__PURE__*/React.createElement("style", null, `
        .lw-ins-grid { max-width: var(--container-max); margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .lw-ins-foot { max-width: var(--container-max); margin: 48px auto 0; padding: 0 24px; }
        @media (max-width: 900px) { .lw-ins-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .lw-ins-grid { grid-template-columns: 1fr; } }
      `), /*#__PURE__*/React.createElement("div", {
    className: "lw-sec__head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    variant: "left"
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "eyebrow"
  }, "Insights")), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h2", null, "Legal Thinking for a Changing World"))), /*#__PURE__*/React.createElement("div", {
    className: "lw-ins-grid"
  }, INSIGHTS.map(([seed, tag, title, date], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i
  }, /*#__PURE__*/React.createElement(InsightCard, {
    image: `https://picsum.photos/seed/${seed}/600/400`,
    tag: tag,
    title: title,
    date: date
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lw-ins-foot"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    href: "#insights"
  }, "View all insights")));
}
function ContactBanner() {
  return /*#__PURE__*/React.createElement("section", {
    className: "lw-cta",
    id: "contact"
  }, /*#__PURE__*/React.createElement("style", null, `
        .lw-cta { background: var(--accent); color: #fff; padding: 96px 0; }
        .lw-cta__inner { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; text-align: center; }
        .lw-cta h2 { font-family: var(--font-serif); font-weight: 700; font-size: var(--fs-h1); color: #fff; letter-spacing: -0.02em; margin: 0 0 16px; }
        .lw-cta__sub { font-size: 18px; color: rgba(255,255,255,0.82); max-width: 540px; margin: 0 auto 36px; }
        .lw-cta__btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 44px; }
        .lw-cta__details { display: flex; gap: 32px; justify-content: center; flex-wrap: wrap;
          font: 500 14px/1.5 var(--font-ui); color: rgba(255,255,255,0.9); border-top: 1px solid rgba(255,255,255,0.22); padding-top: 28px; }
        .lw-cta__details a { color: #fff; display: inline-flex; align-items: center; gap: 8px; }
        .lw-cta__details i { width: 16px; height: 16px; }
      `), /*#__PURE__*/React.createElement("div", {
    className: "lw-cta__inner"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("h2", null, "Ready to work with us?")), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("p", {
    className: "lw-cta__sub"
  }, "Tell us about your matter and we'll respond within one business day.")), /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    className: "lw-cta__btns"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    href: "mailto:dauddogar@outlook.com",
    style: {
      background: '#fff',
      color: 'var(--accent)',
      borderColor: '#fff'
    }
  }, "Contact Us"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onDark: true,
    href: "tel:+923062221710"
  }, "Call Now"))), /*#__PURE__*/React.createElement("div", {
    className: "lw-cta__details"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://maps.google.com/?q=39+Street+39+I-8/2+Islamabad",
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  }), "39, Street No. 39, I-8/2, Islamabad"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+923062221710"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "phone"
  }), "+92 306 2221710"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:dauddogar@outlook.com"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "mail"
  }), "dauddogar@outlook.com"))));
}
window.Services = Services;
window.About = About;
window.WhyUs = WhyUs;
window.Insights = Insights;
window.ContactBanner = ContactBanner;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
/* global React */
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "lw-foot"
  }, /*#__PURE__*/React.createElement("style", null, `
        .lw-foot { background: var(--lw-navy); color: #fff; padding: 80px 0 0; }
        .lw-foot__inner { max-width: var(--container-max); margin: 0 auto; padding: 0 24px; }
        .lw-foot__top { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.2fr; gap: 48px; padding-bottom: 56px; }
        .lw-foot__logo { height: 26px; width: auto; display: block; filter: brightness(0) invert(1); margin-bottom: 20px; }
        .lw-foot__tag { font-family: var(--font-serif); font-style: italic; font-size: 16px; color: rgba(255,255,255,0.7); max-width: 260px; line-height: 1.5; }
        .lw-foot__col h4 { font: 600 11px/1 var(--font-ui); letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0 0 18px; font-family: var(--font-ui); }
        .lw-foot__col ul { list-style: none; margin: 0; padding: 0; }
        .lw-foot__col li { margin-bottom: 12px; }
        .lw-foot__col a, .lw-foot__col span { font: 400 14px/1.5 var(--font-ui); color: rgba(255,255,255,0.78); }
        .lw-foot__col a:hover { color: #fff; }
        .lw-foot__contact span { display: block; }
        .lw-foot__bar { border-top: 1px solid var(--lw-on-navy-rule); padding: 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .lw-foot__copy { font: 400 13px/1.4 var(--font-ui); color: rgba(255,255,255,0.55); }
        .lw-foot__legal { display: flex; align-items: center; gap: 24px; }
        .lw-foot__legal a { font: 500 13px/1 var(--font-ui); color: rgba(255,255,255,0.7); }
        .lw-foot__social { display: flex; gap: 14px; }
        .lw-foot__social a { color: rgba(255,255,255,0.7); display: inline-flex; }
        .lw-foot__social a:hover { color: #fff; }
        @media (max-width: 900px) { .lw-foot__top { grid-template-columns: 1fr 1fr; gap: 36px; } }
        @media (max-width: 560px) { .lw-foot__top { grid-template-columns: 1fr; } }
      `), /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    className: "lw-foot__logo",
    src: "../../assets/legalworks-logo.png",
    alt: "LegalWorks"
  }), /*#__PURE__*/React.createElement("p", {
    className: "lw-foot__tag"
  }, "Expert Legal Counsel. Trusted Results.")), /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__col"
  }, /*#__PURE__*/React.createElement("h4", null, "Services"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#services"
  }, "Corporate & Commercial")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#services"
  }, "Contract Drafting")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#services"
  }, "Regulatory Compliance")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#services"
  }, "Dispute Resolution")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#services"
  }, "Real Estate")))), /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__col"
  }, /*#__PURE__*/React.createElement("h4", null, "Company"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#about"
  }, "About")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#insights"
  }, "Insights")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#contact"
  }, "Contact")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#contact"
  }, "Careers")))), /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__col lw-foot__contact"
  }, /*#__PURE__*/React.createElement("h4", null, "Contact"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", null, "39, Street No. 39, I-8/2,", /*#__PURE__*/React.createElement("br", null), "Islamabad, Pakistan")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "tel:+923062221710"
  }, "+92 306 2221710")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:dauddogar@outlook.com"
  }, "dauddogar@outlook.com"))))), /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lw-foot__copy"
  }, "\xA9 2025 LEGALWORKS (SMC-Private) Limited. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    className: "lw-foot__legal"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Legal Notice"), /*#__PURE__*/React.createElement("span", {
    className: "lw-foot__social"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "LinkedIn"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "linkedin"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "WhatsApp"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "message-circle"
  })))))));
}
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteNav.jsx
try { (() => {
/* global React */
const {
  useState,
  useEffect
} = React;
const {
  Button,
  NavLink
} = window.LegalWorksDesignSystem_fbaf45;
const LINKS = [['Services', '#services'], ['Practice Areas', '#services'], ['About', '#about'], ['Insights', '#insights'], ['Contact', '#contact']];
function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
        .lw-nav { position: sticky; top: 0; z-index: 50; background: #fff;
          border-bottom: 1px solid var(--lw-rule);
          transition: box-shadow var(--dur) var(--ease-standard); }
        .lw-nav.is-scrolled { box-shadow: var(--shadow-nav); }
        .lw-nav__inner { max-width: var(--container-max); margin-inline: auto;
          padding: 0 24px; height: 74px; display: flex; align-items: center; justify-content: space-between; }
        .lw-nav__logo { height: 26px; width: auto; display: block; }
        .lw-nav__links { display: flex; align-items: center; gap: 30px; }
        .lw-nav__right { display: flex; align-items: center; gap: 26px; }
        .lw-nav__burger { display: none; background: none; border: 0; cursor: pointer; color: var(--lw-ink); }
        .lw-nav__mobile { display: none; }
        @media (max-width: 900px) {
          .lw-nav__links, .lw-nav__right .lw-btn { display: none; }
          .lw-nav__burger { display: inline-flex; }
          .lw-nav__mobile { display: block; border-top: 1px solid var(--lw-rule); background: #fff; padding: 8px 24px 20px; }
          .lw-nav__mobile a { display: block; padding: 12px 0; font: 600 13px/1 var(--font-ui); letter-spacing: .08em; text-transform: uppercase; color: var(--lw-ink); border-bottom: 1px solid var(--lw-rule); }
        }
      `), /*#__PURE__*/React.createElement("nav", {
    className: `lw-nav${scrolled ? ' is-scrolled' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "lw-nav__inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top"
  }, /*#__PURE__*/React.createElement("img", {
    className: "lw-nav__logo",
    src: "../../assets/legalworks-logo.png",
    alt: "LegalWorks"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lw-nav__links"
  }, LINKS.slice(0, 5).map(([label, href], i) => /*#__PURE__*/React.createElement(NavLink, {
    key: i,
    href: href
  }, label))), /*#__PURE__*/React.createElement("div", {
    className: "lw-nav__right"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    href: "#contact"
  }, "Get in Touch"), /*#__PURE__*/React.createElement("button", {
    className: "lw-nav__burger",
    "aria-label": "Menu",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": open ? 'x' : 'menu'
  })))), open && /*#__PURE__*/React.createElement("div", {
    className: "lw-nav__mobile"
  }, LINKS.slice(0, 5).map(([label, href], i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: href,
    onClick: () => setOpen(false)
  }, label)))));
}
window.SiteNav = SiteNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteNav.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Differentiator = __ds_scope.Differentiator;

__ds_ns.InsightCard = __ds_scope.InsightCard;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.NavLink = __ds_scope.NavLink;

__ds_ns.Tag = __ds_scope.Tag;

})();
