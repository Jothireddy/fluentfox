import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActivePlans } from "./api3";

const ORANGE = "#ff4b00";
const CREAM = "#fdf8f0";
const DARK = "#0d0d0d";
const TEXT = "#111111";
const FLUENTFOX_LOGO = "public/company_logo.webp";
const SIMPLEICONS = (slug) => `https://cdn.simpleicons.org/${slug}/FFFFFF`;

const companies = [
  { name: "Google", slug: "google" },
  { name: "Amazon", slug: "amazon" },
  { name: "Microsoft", slug: "microsoft" },
  { name: "Meta", slug: "meta" },
  { name: "Apple", slug: "apple" },
  { name: "Netflix", slug: "netflix" },
  { name: "Stripe", slug: "stripe" },
  { name: "Shopify", slug: "shopify" },
  { name: "Adobe", slug: "adobe" },
  { name: "Uber", slug: "uber" },
  { name: "Notion", slug: "notion" },
  { name: "Airbnb", slug: "airbnb" },
  { name: "Figma", slug: "figma" },
  { name: "Atlassian", slug: "atlassian" },
  { name: "Salesforce", slug: "salesforce" },
  { name: "LinkedIn", slug: "linkedin" },
];

const testimonials = [
  {
    name: "Ananya M.",
    handle: "@ananya_pm",
    role: "Product Analyst · Bangalore",
    initials: "AM",
    accent: "#fff3ee",
    text: "The real-time preview stopped me freezing completely. It felt like having a calm second brain that never panics — even when I do. Two offers in under a month.",
  },
  {
    name: "James K.",
    handle: "@james_dev",
    role: "Software Engineer · London",
    initials: "JK",
    accent: "#f0f4ff",
    text: "Before this, I could answer the question in my head but not under pressure. FluentFox gave me structure instantly, so I sounded clear, sharp, and composed.",
  },
  {
    name: "Sara L.",
    handle: "@sara_ux",
    role: "UX Designer → PM · Dubai",
    initials: "SL",
    accent: "#fff3ee",
    text: "Switching careers usually made me sound defensive. This made my story feel deliberate and confident. The best part was how naturally it fit my resume and the role.",
  },
  {
    name: "Rahul V.",
    handle: "@rahul_codes",
    role: "Frontend Engineer · Hyderabad",
    initials: "RV",
    accent: "#eefbf2",
    text: "I used to ramble when a technical question got difficult. Now the answer appears fast enough that I stay in rhythm and actually finish with a point.",
  },
  {
    name: "Priya S.",
    handle: "@priya_designs",
    role: "Designer · Pune",
    initials: "PS",
    accent: "#fff7e8",
    text: "The experience feels premium end-to-end. The interface is calm, the prompts are clear, and the answers sound like me — only better organized.",
  },
  {
    name: "David L.",
    handle: "@david_pm",
    role: "Program Manager · Toronto",
    initials: "DL",
    accent: "#f8f0ff",
    text: "What surprised me most was how role-aware it felt. I changed the job description and immediately got different examples, tone, and framing.",
  },
  {
    name: "Kiran R.",
    handle: "@kiran_ai",
    role: "AI Student · Chennai",
    initials: "KR",
    accent: "#ecfbff",
    text: "I usually blank out on behavioral questions. This gave me clean STAR answers I could speak confidently, and I never felt like I was reading something robotic.",
  },
  {
    name: "Meera T.",
    handle: "@meera_ui",
    role: "UI Engineer · Mumbai",
    initials: "MT",
    accent: "#fff0f0",
    text: "The speed is the real difference. A slow assistant breaks your flow, but this stayed fast enough that I could keep eye contact, breathe, and sound composed.",
  },
  {
    name: "Alex B.",
    handle: "@alex_eng",
    role: "Data Engineer · Berlin",
    initials: "AB",
    accent: "#eef6ff",
    text: "It does not feel like a gimmick. It feels like a serious product with a serious workflow. My answers felt concise and well thought out.",
  },
];

const faqs = [
  {
    q: "How does FluentFox work during a live interview?",
    a: "FluentFox runs beside your call and listens through your microphone. It detects questions in real time and turns them into structured answers fast enough to keep the conversation moving naturally.",
  },
  {
    q: "Is my audio stored or shared anywhere?",
    a: "No. Session audio is processed in real time and never stored on our servers. It is not shared with third parties and is not used for training.",
  },
  {
    q: "What if my session ends before 10 minutes?",
    a: "Your credit is refunded automatically if the session ends early. No support ticket or manual request is needed.",
  },
  {
    q: "Can I customise it for different roles?",
    a: "Yes. Upload a different resume or job description for each session and the answer style adapts to that exact role, company, and seniority.",
  },
  {
    q: "Which platforms does it work with?",
    a: "It works alongside any call platform because it runs in a separate window. Zoom, Google Meet, Microsoft Teams, Webex, phone calls, and more are supported.",
  },
  {
    q: "What interview types does it cover?",
    a: "It handles behavioral, competency-based, technical, situational, and open-ended interview questions across roles and industries.",
  },
];

const platforms = ["Zoom", "Google Meet", "Microsoft Teams", "Webex", "Phone calls", "Amazon Chime"];
const paymentMethods = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay", "UPI", "PhonePe", "Razorpay"];

const Pill = ({ children, bg = "rgba(255,75,0,0.12)", color = ORANGE }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      background: bg,
      color,
      borderRadius: 999,
      padding: "4px 12px",
      marginBottom: 14,
    }}
  >
    {children}
  </span>
);

function BrandLogo({ src, name, size = 28, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        flexShrink: 0,
        display: "block",
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,.12))",
      }}
    />
  );
}

function PricingCard({ plan, highlight, index }) {
  const nav = useNavigate();
  const price = Number(plan?.price_inr ?? 0);
  const credits = Number(plan?.credits ?? 1);
  const perSession = credits > 0 ? Math.round(price / credits) : null;

  return (
    <div
      style={{
        background: highlight ? "#fff" : "rgba(255,255,255,0.08)",
        border: `${highlight ? "2px" : "0.5px"} solid ${highlight ? "#fff" : "rgba(255,255,255,0.18)"}`,
        borderRadius: 22,
        padding: "24px 22px",
        position: "relative",
        transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
        boxShadow: highlight ? "0 18px 45px rgba(0,0,0,0.14)" : "none",
        animation: "floatCard 5s ease-in-out infinite",
        animationDelay: `${index * 0.15}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 24px 50px rgba(0,0,0,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = highlight ? "0 18px 45px rgba(0,0,0,0.14)" : "none";
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: DARK,
            color: "#fff",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            borderRadius: 999,
            padding: "5px 14px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          }}
        >
          Best value
        </div>
      )}

      <p
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: highlight ? "#999" : "rgba(255,255,255,0.45)",
          marginBottom: 10,
        }}
      >
        {plan?.name ?? "Plan"}
      </p>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, marginBottom: 5 }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 42, fontWeight: 900, lineHeight: 1, color: highlight ? "#111" : "#fff" }}>
          ₹{price.toLocaleString()}
        </span>
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: highlight ? "#777" : "rgba(255,255,255,0.58)", marginBottom: 4 }}>
        {credits} session{credits > 1 ? "s" : ""}
        {perSession != null && <span style={{ color: highlight ? ORANGE : "#ffb78a", fontWeight: 700 }}> · ₹{perSession}/session</span>}
      </p>

      <p style={{ fontSize: 13, lineHeight: 1.65, color: highlight ? "#888" : "rgba(255,255,255,0.44)", marginBottom: 20, marginTop: 10 }}>
        {plan?.description || "Pay only when you need interview support. No subscription, no long-term commitment."}
      </p>

      <button
        onClick={() => nav("/access-pricing")}
        style={{
          width: "100%",
          border: "none",
          borderRadius: 999,
          padding: "13px 0",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: ".09em",
          textTransform: "uppercase",
          cursor: "pointer",
          background: highlight ? ORANGE : "rgba(255,255,255,0.15)",
          color: "#fff",
          transition: "opacity .15s ease, transform .15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = ".84";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Get started
      </button>
    </div>
  );
}

function SectionReveal({ children, delay = 0, className = "" }) {
  return (
    <div className={className} style={{ animation: `riseUp .75s ease both`, animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export default function Homepage() {
  const nav = useNavigate();
  const words = useMemo(() => ["confident", "clear", "calm"], []);
  const [wi, setWi] = useState(0);
  const [faq, setFaq] = useState(-1);
  const [mode, setMode] = useState("before");
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [heroShift, setHeroShift] = useState({ x: 0, y: 0 });

  const doubledCompanies = useMemo(() => [...companies, ...companies], []);

  useEffect(() => {
    const t = window.setInterval(() => setWi((i) => (i + 1) % words.length), 2200);
    return () => window.clearInterval(t);
  }, [words.length]);

  useEffect(() => {
    let mounted = true;
    setPlansLoading(true);
    fetchActivePlans()
      .then((data) => {
        if (!mounted) return;
        if (process.env.NODE_ENV !== "production") console.log("Plans fetched:", data);
        setPlans(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") console.error("Error fetching plans:", err);
        if (mounted) setPlans([]);
      })
      .finally(() => {
        if (mounted) setPlansLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${DARK}; }
    .hp {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: ${ORANGE};
      color: #fff;
      overflow-x: hidden;
      position: relative;
    }
    .hp::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at 18% 15%, rgba(255,255,255,.08), transparent 26%),
        radial-gradient(circle at 82% 12%, rgba(255,255,255,.06), transparent 22%),
        radial-gradient(circle at 72% 84%, rgba(0,0,0,.10), transparent 26%);
      pointer-events: none;
      z-index: 0;
      animation: bgPulse 12s ease-in-out infinite;
    }
    .hp > * { position: relative; z-index: 1; }
    .hp h1, .hp h2 { font-family: 'Fraunces', serif; font-weight: 900; line-height: 1.06; letter-spacing: -0.02em; }
    .hp h1 { font-size: clamp(2.1rem, 4.8vw, 4rem); }
    .hp h2 { font-size: clamp(1.7rem, 3.2vw, 2.6rem); }

    .sec { padding: clamp(48px, 6vw, 72px) clamp(18px, 4vw, 40px); }
    .inner { max-width: 1160px; margin: 0 auto; }
    .sh { display: grid; grid-template-columns: 1fr 1.2fr; gap: 22px; align-items: end; margin-bottom: 28px; }
    @media (max-width: 780px) { .sh { grid-template-columns: 1fr; gap: 12px; } }

    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: clamp(44px, 6vw, 72px) clamp(18px, 4vw, 40px);
    }
    .hero-g {
      max-width: 1160px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1.02fr;
      gap: 36px;
      align-items: center;
    }
    @media (max-width: 900px) { .hero-g { grid-template-columns: 1fr; gap: 26px; } }
    .hero-eye { font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.52); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
    .hero-eye::before { content: ''; display: inline-block; width: 22px; height: 1.5px; background: rgba(255,255,255,.35); }
    .hero-desc { font-size: 15px; color: rgba(255,255,255,.76); line-height: 1.7; margin: 18px 0 22px; max-width: 510px; }
    .hero-bul { list-style: none; display: flex; flex-direction: column; gap: 9px; margin-bottom: 24px; }
    .hero-bul li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: rgba(255,255,255,.82); line-height: 1.5; }
    .bdot { margin-top: 7px; width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.55); flex-shrink: 0; box-shadow: 0 0 0 4px rgba(255,255,255,.05); }
    .btn-p { background: #fff; color: ${ORANGE}; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; border: none; border-radius: 999px; padding: 13px 28px; cursor: pointer; box-shadow: 0 0 0 5px rgba(255,255,255,.15); transition: all .18s ease; }
    .btn-p:hover { background: #ffe9dd; transform: translateY(-1px) scale(1.015); }
    .btn-g { background: transparent; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .06em; border: 1.5px solid rgba(255,255,255,.38); border-radius: 999px; padding: 12px 22px; cursor: pointer; transition: all .15s ease; }
    .btn-g:hover { border-color: #fff; background: rgba(255,255,255,.07); transform: translateY(-1px); }
    .sp-row { display: flex; align-items: center; gap: 14px; margin-top: 18px; padding-top: 18px; border-top: 0.5px solid rgba(255,255,255,.12); flex-wrap: wrap; }
    .avs { display: flex; }
    .av { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,.2); border: 2px solid rgba(255,75,0,.8); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; margin-left: -9px; }
    .av:first-child { margin-left: 0; }

    .hcard {
      background: rgba(6,6,12,.84);
      backdrop-filter: blur(26px);
      -webkit-backdrop-filter: blur(26px);
      border: 0.5px solid rgba(255,255,255,.1);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 30px 56px rgba(0,0,0,.48);
      transform: translate3d(${heroShift.x}px, ${heroShift.y}px, 0);
      transition: transform .2s ease;
      animation: floatHero 6s ease-in-out infinite;
    }
    .hcard-top { padding: 12px 18px; border-bottom: 0.5px solid rgba(255,255,255,.07); display: flex; justify-content: space-between; align-items: center; }
    .hcard-top-left { display: flex; align-items: center; gap: 8px; }
    .hcard-top-left span { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.33); }
    .live-row { display: flex; align-items: center; gap: 7px; font-size: 10px; color: rgba(255,255,255,.58); }
    .ldot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: bl 1.8s ease-in-out infinite; box-shadow: 0 0 0 6px rgba(34,197,94,.08); }
    @keyframes bl { 0%,100% { opacity: 1 } 50% { opacity: .3 } }
    .hcard-body { padding: 18px; display: grid; grid-template-columns: 1.45fr 1fr; gap: 14px; }
    @media (max-width: 560px) { .hcard-body { grid-template-columns: 1fr; } }
    .ql { font-size: 9px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.3); margin-bottom: 8px; }
    .qbx {
      background: rgba(255,255,255,.05);
      border: 0.5px solid rgba(255,255,255,.08);
      border-radius: 14px;
      padding: 13px 15px;
      font-size: 13px;
      line-height: 1.55;
      color: rgba(255,255,255,.8);
      margin-bottom: 12px;
      animation: softGlow 4.2s ease-in-out infinite;
    }
    .abx { background: #fff; border-radius: 14px; padding: 13px 15px; box-shadow: 0 10px 24px rgba(0,0,0,.10); }
    .atag { font-size: 9px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${ORANGE}; margin-bottom: 7px; }
    .atxt { font-size: 12px; line-height: 1.65; color: #222; }
    .scard { background: rgba(255,255,255,.04); border: 0.5px solid rgba(255,255,255,.07); border-radius: 14px; padding: 13px 14px; margin-bottom: 10px; transition: transform .2s ease, background .2s ease; }
    .scard:hover { transform: translateY(-2px); background: rgba(255,255,255,.06); }
    .snum { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 900; line-height: 1; margin-bottom: 4px; }
    .ssub { font-size: 10px; color: rgba(255,255,255,.34); line-height: 1.45; }
    .slist { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-top: 7px; font-size: 12px; color: rgba(255,255,255,.58); }

    .ticker-wrap { background: #111; border-top: 0.5px solid rgba(255,255,255,.06); height: 66px; display: flex; align-items: center; gap: 24px; overflow: hidden; padding: 0 clamp(18px, 4vw, 40px); }
    .ticker-label { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.24); white-space: nowrap; flex-shrink: 0; }
    .ticker-track { flex: 1; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); }
    .ticker-inner { display: flex; animation: tick 34s linear infinite; }
    .ticker-inner:hover { animation-play-state: paused; }
    @keyframes tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    .ticker-item {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 22px;
      height: 66px;
      border-right: 0.5px solid rgba(255,255,255,.06);
      transition: background .2s ease, transform .2s ease;
    }
    .ticker-item:hover { background: rgba(255,255,255,.04); transform: translateY(-1px); }
    .ticker-item span { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.42); letter-spacing: .02em; transition: color .2s ease; white-space: nowrap; }
    .ticker-item:hover span { color: rgba(255,255,255,.82); }

    .stats { display: grid; grid-template-columns: repeat(4,1fr); background: ${CREAM}; }
    @media (max-width: 680px) { .stats { grid-template-columns: repeat(2,1fr); } }
    .stat { padding: 28px 24px; border-right: 0.5px solid rgba(0,0,0,.07); }
    .stat:last-child { border-right: none; }
    .stat-n { font-family: 'Fraunces', serif; font-size: 2.4rem; font-weight: 900; line-height: 1; color: ${ORANGE}; margin-bottom: 8px; }
    .stat-l { font-size: 13px; font-weight: 500; color: #444; line-height: 1.45; }

    .steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
    @media (max-width: 900px) { .steps { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 480px) { .steps { grid-template-columns: 1fr; } }
    .step {
      background: #fff;
      border: 0.5px solid rgba(0,0,0,.06);
      border-radius: 16px;
      padding: 18px 16px;
      transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
      animation: riseUp .7s ease both;
    }
    .step:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(0,0,0,.08); border-color: rgba(255,75,0,.28); }
    .step-n { font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${ORANGE}; margin-bottom: 10px; }
    .step-t { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: #111; margin-bottom: 8px; line-height: 1.25; }
    .step-b { font-size: 12px; color: #555; line-height: 1.55; }
    .plats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
    .plat { display: flex; align-items: center; gap: 8px; background: #fff; border: 0.5px solid rgba(0,0,0,.07); border-radius: 999px; padding: 7px 14px; font-size: 11px; font-weight: 600; color: #111; transition: transform .18s ease, box-shadow .18s ease; }
    .plat:hover { transform: translateY(-2px); box-shadow: 0 10px 16px rgba(0,0,0,.07); }
    .plat-ok { font-size: 10px; color: #22c55e; font-weight: 700; }
    .div7 { height: 0.5px; background: rgba(0,0,0,.07); margin: 28px 0; }

    .w4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
    @media (max-width: 900px) { .w4 { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 480px) { .w4 { grid-template-columns: 1fr; } }
    .wc {
      background: #fff;
      border: 0.5px solid rgba(0,0,0,.08);
      border-radius: 16px;
      padding: 18px;
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
      animation: riseUp .7s ease both;
    }
    .wc:hover { transform: translateY(-4px); box-shadow: 0 10px 26px rgba(0,0,0,.08); border-color: rgba(255,75,0,.22); }
    .wc-l { font-size: 9px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #aaa; margin-bottom: 9px; }
    .wc-t { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: #111; margin-bottom: 8px; line-height: 1.28; }
    .wc-b { font-size: 12px; color: #555; line-height: 1.55; }

    .toggle { display: inline-flex; background: rgba(255,255,255,.07); border: 0.5px solid rgba(255,255,255,.13); border-radius: 999px; padding: 3px; gap: 3px; margin-bottom: 20px; }
    .tbtn { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; border: none; border-radius: 999px; padding: 8px 18px; cursor: pointer; transition: background .18s ease, color .18s ease, transform .18s ease; }
    .tbtn:hover { transform: translateY(-1px); }
    .tbtn.on { background: #fff; color: #111; }
    .tbtn.off { background: transparent; color: rgba(255,255,255,.36); }
    .ba3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
    @media (max-width: 720px) { .ba3 { grid-template-columns: 1fr; } }
    .bac { background: rgba(255,255,255,.05); border: 0.5px solid rgba(255,255,255,.08); border-radius: 16px; padding: 18px; transition: transform .2s ease, background .2s ease; animation: riseUp .7s ease both; }
    .bac:hover { transform: translateY(-3px); background: rgba(255,255,255,.07); }
    .ba-l { font-size: 9px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #ffb78a; margin-bottom: 10px; }
    .ba-t { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
    .ba-b { font-size: 12px; color: rgba(255,255,255,.64); line-height: 1.6; }

    .review-g { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
    @media (max-width: 820px) { .review-g { grid-template-columns: 1fr; } }
    .rcard {
      background: #fff;
      border-radius: 16px;
      padding: 16px 16px 14px;
      box-shadow: 0 8px 22px rgba(0,0,0,.1);
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
      border: 1px solid rgba(0,0,0,.04);
      animation: riseUp .72s ease both;
      position: relative;
      overflow: hidden;
    }
    .rcard::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,75,0,.03), transparent 30%, transparent 70%, rgba(255,75,0,.02));
      pointer-events: none;
    }
    .rcard:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,.12); }
    .rhead { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; position: relative; z-index: 1; }
    .rav { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); }
    .rname { font-size: 14px; font-weight: 800; color: #111; }
    .rrole { font-size: 11px; color: #999; margin-top: 2px; }
    .handle { font-size: 12px; color: #777; margin-top: 1px; }
    .stars { color: #f59e0b; font-size: 13px; letter-spacing: 2px; margin-bottom: 8px; position: relative; z-index: 1; }
    .rtext { font-size: 13px; line-height: 1.68; color: #333; position: relative; z-index: 1; }
    .rdate { font-size: 11px; color: #c5c5c5; margin-top: 12px; font-weight: 600; position: relative; z-index: 1; }

    .pgrid { display: grid; gap: 14px; margin-bottom: 18px; }
    .plan-sk { background: rgba(255,255,255,.08); border-radius: 20px; min-height: 210px; animation: sk 1.4s ease-in-out infinite; }
    @keyframes sk { 0%,100% { opacity: .35 } 50% { opacity: .75 } }
    .guarantee { display: flex; gap: 18px; flex-wrap: wrap; align-items: center; background: rgba(255,255,255,.07); border: 0.5px solid rgba(255,255,255,.12); border-radius: 14px; padding: 14px 18px; font-size: 13px; color: rgba(255,255,255,.72); }
    .gi { display: flex; align-items: center; gap: 8px; }
    .pay-row { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 12px; }
    .pay-chip { background: rgba(255,255,255,.1); border: 0.5px solid rgba(255,255,255,.17); border-radius: 9px; padding: 6px 12px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.62); }

    .faq-list { background: #fff; border-radius: 18px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,.08); }
    .faq-item { border-bottom: 0.5px solid #f0ede8; }
    .faq-item:last-child { border-bottom: none; }
    .faq-btn { width: 100%; display: grid; grid-template-columns: 50px 1fr; text-align: left; background: none; border: none; cursor: pointer; transition: background .15s ease; }
    .faq-btn:hover { background: #fafaf8; }
    .faq-btn.open { background: #fff9f6; }
    .faq-num { background: ${ORANGE}; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; }
    .faq-inner { padding: 16px 16px; }
    .faq-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .faq-q { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #111; line-height: 1.35; }
    .faq-ic { width: 25px; height: 25px; border-radius: 50%; border: 0.5px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #999; flex-shrink: 0; transition: transform .22s ease, background .15s ease, color .15s ease; }
    .faq-ic.open { transform: rotate(45deg); background: ${ORANGE}; color: #fff; border-color: ${ORANGE}; }
    .faq-a { font-size: 12px; color: #555; line-height: 1.65; padding-top: 10px; }

    .cta2 { display: grid; grid-template-columns: 2fr 1.35fr; gap: 34px; align-items: center; }
    @media (max-width: 800px) { .cta2 { grid-template-columns: 1fr; gap: 24px; } }
    .what-box { background: rgba(0,0,0,.2); border: 0.5px solid rgba(255,255,255,.18); border-radius: 18px; padding: 20px; }
    .chk { list-style: none; display: flex; flex-direction: column; gap: 11px; margin-top: 14px; }
    .chk li { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.52; color: rgba(255,255,255,.84); }
    .cdot { margin-top: 6px; width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; box-shadow: 0 0 0 5px rgba(34,197,94,.08); }

    @keyframes wp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
    @keyframes riseUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes floatCard { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
    @keyframes floatHero { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    @keyframes softGlow { 0%,100% { box-shadow: 0 0 0 rgba(255,255,255,0) } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,.02) } }
    @keyframes bgPulse { 0%,100% { opacity: .65 } 50% { opacity: 1 } }
    @keyframes softPulse { 0%,100% { transform: scale(1); opacity: .72; } 50% { transform: scale(1.03); opacity: 1; } }
    .word { display: inline-block; animation: wp .32s ease forwards; }
    @media (max-width: 500px) { .ticker-wrap { height: auto; padding: 12px 18px; flex-direction: column; gap: 10px; } }
    .section-label { font-size: 14px; color: #444; line-height: 1.65; }
    .logo-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .logo-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; overflow: hidden; box-shadow: 0 14px 30px rgba(0,0,0,.12); }
    .logo-badge img { display: block; width: 100%; height: 100%; object-fit: contain; }
  `;

  return (
    <div className="hp">
      <style>{css}</style>

      <section
        className="hero"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
          setHeroShift({ x, y });
        }}
        onMouseLeave={() => setHeroShift({ x: 0, y: 0 })}
      >
        <div className="hero-g">
          <div>
            <div className="logo-row" style={{ marginBottom: 18 }}>
              <span className="logo-badge" style={{ width: 38, height: 38, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.14)" }}>
                <img src={FLUENTFOX_LOGO} alt="FluentFox" style={{ width: 30, height: 30, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>FluentFox</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 2 }}>Real-time AI interview assistant</div>
              </div>
            </div>

            <p className="hero-eye">Real-time AI interview assistant</p>
            <h1>
              Speak{" "}
              <span key={words[wi]} className="word" style={{ background: "rgba(255,255,255,.13)", borderRadius: 8, padding: "2px 10px" }}>
                {words[wi]}
              </span>{" "}
              in every interview.
            </h1>
            <p className="hero-desc">
              FluentFox listens to your interview in real time and shows you a structured, personalised answer in under 0.2 seconds — so you never freeze, ramble, or lose your place again.
            </p>
            <ul className="hero-bul">
              {[
                "Answers tailored to your actual resume and the specific role.",
                "Runs silently beside any video or phone interview.",
                "Audio never stored, never shared — completely private.",
              ].map((t) => (
                <li key={t}>
                  <span className="bdot" />
                  {t}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn-p" onClick={() => nav("/access-pricing")}>Get started</button>
              <button className="btn-g" onClick={() => document.getElementById("pricing-sec")?.scrollIntoView({ behavior: "smooth" })}>See pricing ↓</button>
            </div>
            <div className="sp-row">
              <div className="avs">
                {["AM", "JK", "SL", "RV"].map((i, x) => (
                  <div key={x} className="av">{i}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>1 lakh+ candidates</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.48)", marginTop: 2 }}>
                  <span style={{ color: "#f59e0b" }}>★★★★★</span> 4.9 avg · 340+ reviews
                </div>
              </div>
              <div style={{ marginLeft: "auto", background: "rgba(255,255,255,.1)", border: "0.5px solid rgba(255,255,255,.17)", borderRadius: 999, padding: "5px 14px", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                40,000+ sessions
              </div>
            </div>
          </div>

          <div className="hcard">
            <div className="hcard-top">
              <div className="hcard-top-left">
                <img src={FLUENTFOX_LOGO} alt="" style={{ height: 18, width: 18, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <span>live session</span>
              </div>
              <div className="live-row"><span className="ldot" />Active</div>
            </div>
            <div className="hcard-body">
              <div>
                <p className="ql">Interviewer question</p>
                <div className="qbx">Tell me about a time you delivered results under tight pressure.</div>
                <p className="ql">FluentFox answer</p>
                <div className="abx">
                  <p className="atag">STAR · Role-aligned · 45s</p>
                  <p className="atxt">At my last role, our product launch was moved up by three weeks. I re-scoped the sprint, got stakeholder sign-off on what to cut, and we shipped on time with zero P1 bugs — driving a 22% spike in weekly active users in the first month.</p>
                </div>
              </div>
              <div>
                <div className="scard">
                  <p className="ql" style={{ marginBottom: 7 }}>Session context</p>
                  <ul className="slist">
                    <li>◈ Resume loaded</li>
                    <li>◈ JD loaded</li>
                    <li>◈ Role: Product Manager</li>
                  </ul>
                </div>
                <div className="scard">
                  <p className="ql" style={{ marginBottom: 5 }}>Response time</p>
                  <p className="snum">0.2s</p>
                  <p className="ssub">Average — never breaks your flow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-wrap">
        <span className="ticker-label">Candidates targeting</span>
        <div className="ticker-track">
          <div className="ticker-inner">
            {doubledCompanies.map((c, i) => (
              <div key={`${c.name}-${i}`} className="ticker-item">
                <BrandLogo src={SIMPLEICONS(c.slug)} name={c.name} size={24} />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section style={{ background: CREAM }}>
        <div className="inner">
          <div className="stats">
            {[
              { n: "1 lakh+", l: "Candidates prepared" },
              { n: "0.2s", l: "Avg. answer speed" },
              { n: "40,000+", l: "Live sessions run" },
              { n: "4.9★", l: "User rating" },
            ].map((s) => (
              <div key={s.n} className="stat">
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="how" style={{ background: CREAM, color: TEXT }}>
        <div className="inner">
          <div className="sh">
            <SectionReveal delay={0.02}>
              <Pill>How it works</Pill>
              <h2>From setup to first live answer in under two minutes.</h2>
            </SectionReveal>
            <SectionReveal delay={0.08}>
              <p className="section-label">Upload your resume and job description before the call. Start the session. FluentFox listens and responds automatically while you focus entirely on speaking well.</p>
            </SectionReveal>
          </div>
          <div className="steps">
            {[
              { n: "01", t: "Upload your resume", b: "FluentFox reads your actual experience so every answer references your real background, projects, and wins." },
              { n: "02", t: "Add the job description", b: "Answers adapt to the exact company, role, and level so they never feel generic." },
              { n: "03", t: "Start the live session", b: "Open FluentFox alongside your video call. It listens automatically with no clicking or typing while you're talking." },
              { n: "04", t: "Read and speak naturally", b: "A structured answer appears in under 0.2 seconds. Speak it naturally and keep eye contact." },
              { n: "05", t: "Stop when you're done", b: "End the session after the call. If it ran under 10 minutes, your credit is refunded automatically." },
            ].map((s, idx) => (
              <div key={s.n} className="step" style={{ animationDelay: `${idx * 70}ms` }}>
                <p className="step-n">Step {s.n}</p>
                <p className="step-t">{s.t}</p>
                <p className="step-b">{s.b}</p>
              </div>
            ))}
          </div>
          <div className="div7" />
          <Pill bg="rgba(0,0,0,.06)" color="#444">Works alongside any platform</Pill>
          <div className="plats">
            {platforms.map((p, idx) => (
              <div key={p} className="plat" style={{ animationDelay: `${idx * 40}ms` }}>
                <span className="plat-ok">●</span>
                {p}
                <span className="plat-ok">Live</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "#fff", color: TEXT }}>
        <div className="inner">
          <div className="sh">
            <SectionReveal delay={0.02}>
              <Pill>Who it helps</Pill>
              <h2>If interviews make you nervous, this is built for you.</h2>
            </SectionReveal>
            <SectionReveal delay={0.08}>
              <p className="section-label">Anxiety does not care how qualified you are. It hits first-timers and experienced professionals alike. FluentFox makes the nerves irrelevant because the answer is there when you need it.</p>
            </SectionReveal>
          </div>
          <div className="w4">
            {[
              { label: "Students & freshers", t: "No work history? No problem.", b: "Practice real examples and frame internships or projects the way interviewers expect." },
              { label: "Active job seekers", t: "You know it. Now say it well.", b: "Bridge the gap between knowing the answer and delivering it clearly under pressure." },
              { label: "Career switchers", t: "Your past looks different on paper.", b: "Turn your transition into a confident story instead of an awkward explanation." },
              { label: "Anyone who blanks", t: "The empty mind ends today.", b: "When your brain goes blank mid-answer, FluentFox already has the next line on screen." },
            ].map((c, idx) => (
              <div key={c.label} className="wc" style={{ animationDelay: `${idx * 80}ms` }}>
                <p className="wc-l">{c.label}</p>
                <p className="wc-t">{c.t}</p>
                <p className="wc-b">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: DARK, color: "#fff" }}>
        <div className="inner">
          <div className="sh">
            <SectionReveal delay={0.02}>
              <Pill bg="rgba(255,183,138,0.14)" color="#ffb78a">The shift</Pill>
              <h2>Same interview. Completely different outcome.</h2>
            </SectionReveal>
            <SectionReveal delay={0.08}>
              <p className="section-label" style={{ color: "rgba(255,255,255,.5)" }}>It is not about reading off a script — it is about having a safety net that stops the panic. Once the anxiety is gone, everything else falls into place.</p>
            </SectionReveal>
          </div>
          <div className="toggle">
            {[
              { key: "before", label: "Without FluentFox" },
              { key: "after", label: "With FluentFox" },
            ].map((m) => (
              <button key={m.key} className={`tbtn ${mode === m.key ? "on" : "off"}`} onClick={() => setMode(m.key)}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="ba3">
            {(
              mode === "before"
                ? [
                    { label: "Mid-answer", t: "Trailing off, losing the thread", b: "You start strong but drift. The answer becomes long, unfocused, and difficult to rescue once the pressure rises." },
                    { label: "Under pressure", t: "Brain empties completely", b: "The harder the question, the blanker you get. You hear yourself apologizing and asking for the question to be repeated." },
                    { label: "Walking out", t: "Replaying every mistake", b: "You leave the call reconstructing what you should have said instead of feeling proud of what you actually said." },
                  ]
                : [
                    { label: "Mid-answer", t: "On point, landing cleanly", b: "There is structure. You know where the answer is going. You know when to stop. The interviewer nods. It works." },
                    { label: "Under pressure", t: "Calm, grounded, in control", b: "The answer is always there. Your nervous system stays quiet. Your voice stays steady. You keep going." },
                    { label: "Walking out", t: "You know you nailed it", b: "Specific, confident, memorable answers — the kind that stick in an interviewer’s mind for days." },
                  ]
            ).map((c, idx) => (
              <div key={c.label} className="bac" style={{ animationDelay: `${idx * 80}ms` }}>
                <p className="ba-l">{c.label}</p>
                <p className="ba-t">{c.t}</p>
                <p className="ba-b">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: "#0b0b10", color: "#fff" }}>
        <div className="inner">
          <div className="sh">
            <SectionReveal delay={0.02}>
              <Pill bg="rgba(255,183,138,0.13)" color="#ffb78a">Real results</Pill>
              <h2>From the people who actually used it.</h2>
            </SectionReveal>
            <SectionReveal delay={0.08}>
              <p className="section-label" style={{ color: "rgba(255,255,255,.42)" }}>These are the outcomes we see across everyday candidates — not the handpicked best case, the regular case.</p>
            </SectionReveal>
          </div>
          <div className="review-g">
            {testimonials.map((r, idx) => (
              <div key={`${r.name}-${idx}`} className="rcard" style={{ animationDelay: `${idx * 65}ms` }}>
                <div className="rhead">
                  <div className="rav" style={{ background: r.accent }}>{r.initials}</div>
                  <div>
                    <p className="rname">{r.name}</p>
                    <p className="handle">{r.handle}</p>
                    <p className="rrole">{r.role}</p>
                  </div>
                </div>
                <div className="stars">★★★★★</div>
                <p className="rtext">“{r.text}”</p>
                <p className="rdate">Verified session feedback</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="pricing-sec" style={{ background: ORANGE, color: "#fff" }}>
        <div className="inner">
          <div className="sh" style={{ marginBottom: 28 }}>
            <SectionReveal delay={0.02}>
              <Pill bg="rgba(255,255,255,.15)" color="#fff">Pricing</Pill>
              <h2>Pay per session. No subscriptions.</h2>
            </SectionReveal>
            <SectionReveal delay={0.08}>
              <p className="section-label" style={{ color: "rgba(255,255,255,.68)" }}>Buy credits when you have interviews. Use them when you need them. If a session ends before 10 minutes for any reason, your credit comes back automatically.</p>
            </SectionReveal>
          </div>

          {plansLoading ? (
            <div className="pgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              {[1, 2, 3].map((i) => <div key={i} className="plan-sk" />)}
            </div>
          ) : plans.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 18, padding: "28px", textAlign: "center" }}>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,.55)", marginBottom: 14 }}>Plans coming soon.</p>
              <button onClick={() => nav("/access-pricing")} style={{ background: "#fff", color: ORANGE, border: "none", borderRadius: 999, padding: "11px 24px", fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: ".08em", textTransform: "uppercase" }}>
                Contact us
              </button>
            </div>
          ) : (
            <div className="pgrid" style={{ gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)` }}>
              {plans.map((plan, idx) => (
                <PricingCard key={plan.id ?? idx} plan={plan} highlight={plans.length === 1 ? true : idx === Math.floor(plans.length / 2)} index={idx} />
              ))}
            </div>
          )}

          <div className="guarantee">
            {["Auto-refund under 10 mins", "Credits only — no subscription", "Audio never stored", "Any platform"].map((g) => (
              <div key={g} className="gi"><span style={{ color: "#22c55e", fontWeight: 900 }}>●</span><span>{g}</span></div>
            ))}
          </div>
          <div className="pay-row">
            {paymentMethods.map((p) => <span key={p} className="pay-chip">{p}</span>)}
          </div>
        </div>
      </section>

      <section className="sec" id="faq" style={{ background: CREAM, color: TEXT }}>
        <div className="inner">
          <div className="sh" style={{ marginBottom: 26 }}>
            <SectionReveal delay={0.02}><Pill>Questions</Pill><h2>Straight answers.</h2></SectionReveal>
            <SectionReveal delay={0.08}><p className="section-label">No marketing copy. Just direct answers about how FluentFox actually works, what it costs, and what to expect the first time you use it in a real interview.</p></SectionReveal>
          </div>
          <div className="faq-list">
            {faqs.map((item, idx) => {
              const open = faq === idx;
              return (
                <div key={item.q} className="faq-item">
                  <button className={`faq-btn ${open ? "open" : ""}`} onClick={() => setFaq((p) => (p === idx ? -1 : idx))}>
                    <div className="faq-num">{String(idx + 1).padStart(2, "0")}</div>
                    <div className="faq-inner">
                      <div className="faq-row">
                        <p className="faq-q">{item.q}</p>
                        <span className={`faq-ic ${open ? "open" : ""}`}>+</span>
                      </div>
                      <div style={{ maxHeight: open ? 260 : 0, overflow: "hidden", transition: "max-height .32s ease, opacity .28s ease", opacity: open ? 1 : 0 }}>
                        <p className="faq-a">{item.a}</p>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec" style={{ background: `linear-gradient(135deg, #d43800, ${ORANGE} 55%, #ff6620)`, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none", animation: "softPulse 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", left: -80, bottom: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(0,0,0,.1)", pointerEvents: "none", animation: "softPulse 10s ease-in-out infinite" }} />
        <div className="inner" style={{ position: "relative", zIndex: 1 }}>
          <div className="cta2">
            <div>
              <div className="logo-row" style={{ marginBottom: 18 }}>
                <span className="logo-badge" style={{ width: 36, height: 36, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.14)" }}>
                  <img src={FLUENTFOX_LOGO} alt="FluentFox" style={{ width: 28, height: 28, objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>FluentFox</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", marginTop: 2 }}>Premium AI interview assistant</div>
                </div>
              </div>
              <h2 style={{ marginBottom: 14 }}>Your next interview could be your best one yet.</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.76)", lineHeight: 1.72, marginBottom: 24, maxWidth: 480 }}>
                Sign up, buy one credit, and start your first session in under five minutes. If it does not work within the first ten minutes, your credit comes back automatically.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={() => nav("/access-pricing")} style={{ background: "#111", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", border: "none", borderRadius: 999, padding: "13px 28px", cursor: "pointer", transition: "transform .18s ease, opacity .18s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.opacity = ".92"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}>
                  Get started
                </button>
                <button onClick={() => document.getElementById("pricing-sec")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: ".06em", border: "1.5px solid rgba(255,255,255,.38)", borderRadius: 999, padding: "12px 22px", cursor: "pointer", transition: "transform .18s ease, background .18s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "rgba(255,255,255,.07)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "transparent"; }}>
                  See pricing
                </button>
              </div>
            </div>
            <div className="what-box">
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.42)", marginBottom: 6 }}>What you get</p>
              <ul className="chk">
                {[
                  "Real-time answers matched to your resume and the specific role.",
                  "Structured responses for behavioural, technical, and situational questions.",
                  "Complete privacy — audio stays on your device, never transmitted.",
                  "Auto-refund if session ends before 10 minutes, no questions asked.",
                  "Works on Zoom, Meet, Teams, phone calls, and any other platform.",
                ].map((item) => (
                  <li key={item}><span className="cdot" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
