import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActivePlans } from "./api3";

const ORANGE = "#ff4b00";
const CREAM  = "#fdf8f0";
const DARK   = "#0d0d0d";
const FLUENTFOX_LOGO = "/company_logo.webp";

// ── Colorful brand logos: omit color param = simpleicons uses each brand's official HEX color
const SIMPLEICONS_COLOR = (slug) => `https://cdn.simpleicons.org/${slug}`;

// ── Company ticker — brand bg colors so logos always show on the dark ticker
const companies = [
  { name: "Google",     slug: "google",     bg: "#fff",    size: 20 },
  { name: "Amazon",     slug: "amazon",     bg: "#fff",    size: 20 },
  { name: "Microsoft",  slug: "microsoft",  bg: "#fff",    size: 20 },
  { name: "Meta",       slug: "meta",       bg: "#fff",    size: 20 },
  { name: "Apple",      slug: "apple",      bg: "#1d1d1f", size: 18 },
  { name: "Netflix",    slug: "netflix",    bg: "#141414", size: 20 },
  { name: "Stripe",     slug: "stripe",     bg: "#fff",    size: 20 },
  { name: "Shopify",    slug: "shopify",    bg: "#fff",    size: 20 },
  { name: "Adobe",      slug: "adobe",      bg: "#fff",    size: 20 },
  { name: "Uber",       slug: "uber",       bg: "#000",    size: 18 },
  { name: "Notion",     slug: "notion",     bg: "#fff",    size: 18 },
  { name: "Airbnb",     slug: "airbnb",     bg: "#fff",    size: 20 },
  { name: "Figma",      slug: "figma",      bg: "#fff",    size: 18 },
  { name: "Atlassian",  slug: "atlassian",  bg: "#fff",    size: 20 },
  { name: "Salesforce", slug: "salesforce", bg: "#fff",    size: 20 },
  { name: "LinkedIn",   slug: "linkedin",   bg: "#fff",    size: 20 },
];

// ── Platform data with simpleicons slugs + brand colors
const platforms = [
  { name: "Zoom",            slug: "zoom",           bg: "#2D8CFF" },
  { name: "Google Meet",     slug: "googlemeet",     bg: "#00AC47" },
  { name: "Microsoft Teams", slug: "microsoftteams", bg: "#6264A7" },
  { name: "Webex",           slug: "webex",          bg: "#00B140" },
  { name: "Phone calls",     slug: null,             bg: "#22c55e" },
  { name: "Amazon Chime",    slug: "amazonaws",      bg: "#FF9900" },
];

// ── Indian testimonials with pravatar.cc photo IDs
const testimonials = [
  { name: "Ananya Mehta",    handle: "@ananya_pm",      role: "Product Analyst · Bangalore",    img: "https://i.pravatar.cc/80?img=47", text: "The real-time preview stopped me freezing completely. It felt like having a calm second brain that never panics — even when I do. Two offers in under a month.",  stars: 5 },
  { name: "Rohan Verma",     handle: "@rohan_codes",    role: "Software Engineer · Pune",        img: "https://i.pravatar.cc/80?img=68", text: "Before this, I could answer technical questions in my head but never under pressure. FluentFox gave me structure instantly — I sounded clear, sharp, and composed.", stars: 5 },
  { name: "Priya Sharma",    handle: "@priya_ux",       role: "UX Designer → PM · Mumbai",       img: "https://i.pravatar.cc/80?img=49", text: "Switching careers usually made me sound defensive. This made my story feel deliberate and confident. The best part was how naturally it matched the job description.", stars: 5 },
  { name: "Arjun Nair",      handle: "@arjun_dev",      role: "Frontend Engineer · Hyderabad",   img: "https://i.pravatar.cc/80?img=65", text: "I used to ramble when a technical question got difficult. Now the answer appears fast enough that I stay in rhythm and actually finish with a clear point.",       stars: 5 },
  { name: "Kavya Reddy",     handle: "@kavya_designs",  role: "UI Designer · Chennai",           img: "https://i.pravatar.cc/80?img=44", text: "The experience feels premium end-to-end. The interface is calm, the prompts are clear, and the answers sound like me — only better organized.",                    stars: 5 },
  { name: "Vikram Singh",    handle: "@vikram_pm",      role: "Program Manager · Delhi",         img: "https://i.pravatar.cc/80?img=60", text: "What surprised me most was how role-aware it felt. I changed the job description and immediately got different examples, tone, and framing. Incredible tool.",       stars: 5 },
  { name: "Ishaan Kapoor",   handle: "@ishaan_ai",      role: "ML Engineer · Gurgaon",           img: "https://i.pravatar.cc/80?img=57", text: "I usually blank out on behavioral questions. This gave me clean STAR answers I could speak confidently — never felt like I was reading something robotic.",          stars: 5 },
  { name: "Meera Iyer",      handle: "@meera_ui",       role: "Full Stack Dev · Kochi",          img: "https://i.pravatar.cc/80?img=45", text: "The speed is the real difference. A slow assistant breaks your flow, but this stayed fast enough that I kept eye contact, breathed, and sounded calm throughout.",  stars: 5 },
  { name: "Aditya Joshi",    handle: "@aditya_eng",     role: "Data Engineer · Ahmedabad",       img: "https://i.pravatar.cc/80?img=62", text: "It does not feel like a gimmick. It feels like a serious product with a serious workflow. My answers felt concise and well-thought-out every single time.",           stars: 5 },
];

const faqs = [
  { q: "How does FluentFox work during a live interview?",  a: "FluentFox runs beside your call and listens through your microphone. It detects questions in real time and turns them into structured answers fast enough to keep the conversation moving naturally." },
  { q: "Is my audio stored or shared anywhere?",            a: "No. Session audio is processed in real time and never stored on our servers. It is not shared with third parties and is not used for training." },
  { q: "What if my session ends before 10 minutes?",        a: "Your credit is refunded automatically if the session ends early. No support ticket or manual request is needed." },
  { q: "Can I customise it for different roles?",           a: "Yes. Upload a different resume or job description for each session and the answer style adapts to that exact role, company, and seniority." },
  { q: "Which platforms does it work with?",                a: "It works alongside any call platform because it runs in a separate window. Zoom, Google Meet, Microsoft Teams, Webex, phone calls, and more are supported." },
  { q: "What interview types does it cover?",               a: "It handles behavioral, competency-based, technical, situational, and open-ended interview questions across roles and industries." },
];

/* ═══════════════════════════════════════════════════════
   GLOBAL CSS — keyframes + layout grid classes
═══════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0d0d0d; font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes wordPop   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes riseUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes floatHero { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes softGlow  { 0%,100%{box-shadow:0 0 0 rgba(255,255,255,0)} 50%{box-shadow:0 0 0 8px rgba(255,255,255,.02)} }
  @keyframes bgPulse   { 0%,100%{opacity:.65} 50%{opacity:1} }
  @keyframes softPulse { 0%,100%{transform:scale(1);opacity:.72} 50%{transform:scale(1.03);opacity:1} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes tick      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes skeleton  { 0%,100%{opacity:.35} 50%{opacity:.75} }
  @keyframes shimmer   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes pricePulse{ 0%,100%{box-shadow:0 0 0 0 rgba(255,75,0,0)} 50%{box-shadow:0 0 32px 0 rgba(255,75,0,.18)} }

  .ff-word       { display:inline-block; animation:wordPop .32s ease forwards; }
  .ff-rise       { animation:riseUp .75s ease both; }
  .ff-float-hero { animation:floatHero 6s ease-in-out infinite; }
  .ff-float-card { animation:floatCard 5s ease-in-out infinite; }
  .ff-glow       { animation:softGlow 4.2s ease-in-out infinite; }
  .ff-live-dot   { animation:blink 1.8s ease-in-out infinite; }
  .ff-ticker     { animation:tick 34s linear infinite; }
  .ff-ticker:hover { animation-play-state:paused; }
  .ff-skeleton   { animation:skeleton 1.4s ease-in-out infinite; }
  .ff-sp1        { animation:softPulse 8s ease-in-out infinite; }
  .ff-sp2        { animation:softPulse 10s ease-in-out infinite; }
  .ff-price-pulse{ animation:pricePulse 3s ease-in-out infinite; }

  .ff-bg::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(circle at 18% 15%,rgba(255,255,255,.08),transparent 26%),
      radial-gradient(circle at 82% 12%,rgba(255,255,255,.06),transparent 22%),
      radial-gradient(circle at 72% 84%,rgba(0,0,0,.10),transparent 26%);
    animation:bgPulse 12s ease-in-out infinite;
  }

  .hero-grid    { display:grid; grid-template-columns:1fr 1.02fr; gap:36px; align-items:center; }
  .sh-grid      { display:grid; grid-template-columns:1fr 1.2fr;  gap:22px; align-items:end; margin-bottom:28px; }
  .steps-grid   { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
  .w4-grid      { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .ba3-grid     { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .review-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; align-items:start; }
  .stats-grid   { display:grid; grid-template-columns:repeat(4,1fr); }
  .cta2-grid    { display:grid; grid-template-columns:2fr 1.35fr; gap:34px; align-items:center; }
  .plans-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  .plans-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:22px; }
  .plans-grid-1 { display:grid; grid-template-columns:1fr; gap:22px; max-width:480px; margin:0 auto; }

  @media(max-width:900px){
    .hero-grid  { grid-template-columns:1fr; gap:26px; }
    .steps-grid { grid-template-columns:repeat(2,1fr); }
    .w4-grid    { grid-template-columns:repeat(2,1fr); }
    .plans-grid-3 { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:820px){ .review-grid  { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:800px){ .cta2-grid    { grid-template-columns:1fr; gap:24px; } }
  @media(max-width:780px){ .sh-grid      { grid-template-columns:1fr; gap:12px; } }
  @media(max-width:720px){ .ba3-grid     { grid-template-columns:1fr; } }
  @media(max-width:680px){
    .stats-grid   { grid-template-columns:repeat(2,1fr); }
    .review-grid  { grid-template-columns:1fr; }
    .plans-grid-2 { grid-template-columns:1fr; }
    .plans-grid-3 { grid-template-columns:1fr; }
  }
  @media(max-width:480px){
    .steps-grid { grid-template-columns:1fr; }
    .w4-grid    { grid-template-columns:1fr; }
  }

  /* ticker logo background pill */
  .ticker-logo-bg {
    width:34px; height:34px; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
    transition: transform .2s, box-shadow .2s;
    overflow: hidden;
  }
  .ticker-item:hover .ticker-logo-bg {
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(0,0,0,.35);
  }
  .ticker-item:hover span { color: #fff !important; }

  /* Platform pill hover */
  .plat-pill { transition:transform .18s ease, box-shadow .18s ease, background .18s ease; }
  .plat-pill:hover { transform:translateY(-3px); box-shadow:0 10px 24px rgba(0,0,0,.12); }

  /* Pricing card shimmer on hover */
  .price-shimmer { position:relative; overflow:hidden; }
  .price-shimmer::after {
    content:''; position:absolute; top:0; left:0; right:0; bottom:0;
    background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.08) 50%,transparent 60%);
    transform:translateX(-100%); transition:transform .4s ease; pointer-events:none;
  }
  .price-shimmer:hover::after { transform:translateX(100%); }

  /* Review card */
  .review-card { transition: transform .22s ease, box-shadow .22s ease; }
  .review-card:hover { transform:translateY(-5px); box-shadow:0 20px 40px rgba(0,0,0,.16); }

  /* Avatar ring */
  .avatar-img {
    width:52px; height:52px; border-radius:50%; object-fit:cover;
    border:2px solid rgba(255,75,0,.25);
    box-shadow:0 0 0 3px rgba(255,75,0,.08);
    flex-shrink:0;
  }
`;

/* ─── Pill badge ─── */
function Pill({ children, bg = "rgba(255,75,0,0.12)", color = ORANGE }) {
  return (
    <span style={{ display:"inline-block", fontSize:10, fontWeight:800, letterSpacing:"0.14em",
      textTransform:"uppercase", background:bg, color, borderRadius:999,
      padding:"4px 12px", marginBottom:14 }}>
      {children}
    </span>
  );
}

/* ─── Brand logo with fallback ─── */
function BrandLogo({ src, name, size = 28, invert = false }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:Math.max(8, size*0.45), fontWeight:800, color:"rgba(255,255,255,.6)" }}>
        {name[0]}
      </span>
    );
  }
  return (
    <img src={src} alt={name} loading="lazy" decoding="async"
      onError={() => setFailed(true)}
      style={{ width:size, height:size, objectFit:"contain", flexShrink:0, display:"block",
        filter: invert ? "brightness(0) invert(1)" : "none" }} />
  );
}

/* ─── Phone icon SVG ─── */
function PhoneIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.13 1 .38 1.98.72 2.94a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.14-1.14a2 2 0 012.11-.45c.96.34 1.94.59 2.94.72A2 2 0 0122 14.92z"/>
    </svg>
  );
}

/* ════════════════════════════════════════════
   PRICING CARD — redesigned
════════════════════════════════════════════ */
function PricingCard({ plan, highlight, index }) {
  const nav    = useNavigate();
  const price  = Number(plan?.price_inr ?? 0);
  const credits = Number(plan?.credits ?? 1);
  const perSession = credits > 0 ? Math.round(price / credits) : null;

  return (
    <div className={`ff-float-card price-shimmer ${highlight ? "ff-price-pulse" : ""}`}
      style={{
        background: highlight
          ? "linear-gradient(145deg,#ffffff,#fff8f5)"
          : "rgba(255,255,255,0.07)",
        border: highlight ? "2px solid rgba(255,255,255,.95)" : "1px solid rgba(255,255,255,.14)",
        borderRadius: 28, padding: highlight ? "40px 32px 32px" : "34px 28px 28px",
        position: "relative",
        transition: "transform .22s ease",
        animationDelay: `${index * 0.15}s`,
        boxShadow: highlight ? "0 24px 60px rgba(0,0,0,.2)" : "0 4px 20px rgba(0,0,0,.1)",
        minHeight: highlight ? 480 : 420,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>

      {highlight && (
        <>
          {/* Decorative top gradient bar */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:4,
            background:"linear-gradient(90deg,#ff4b00,#ff8c00,#ff4b00)",
            borderRadius:"24px 24px 0 0" }} />
          <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)",
            background:"linear-gradient(135deg,#ff4b00,#ff7a2f)",
            color:"#fff", fontSize:9, fontWeight:800, letterSpacing:".14em",
            textTransform:"uppercase", borderRadius:999, padding:"5px 16px",
            whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(255,75,0,.4)" }}>
            ✦ Best value
          </div>
        </>
      )}

      {/* Plan name */}
      <p style={{ fontSize:10, fontWeight:800, letterSpacing:".16em", textTransform:"uppercase",
        color: highlight ? ORANGE : "rgba(255,255,255,.45)", marginBottom:12 }}>
        {plan?.name ?? "Plan"}
      </p>

      {/* Price */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:3, marginBottom:4 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:900,
          color:highlight?"#999":"rgba(255,255,255,.5)", marginTop:12 }}>₹</span>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:68, fontWeight:900, lineHeight:1,
          color:highlight?"#111":"#fff", letterSpacing:"-0.02em" }}>
          {price.toLocaleString()}
        </span>
      </div>

      {/* Sessions */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
        <span style={{ fontSize:13, fontWeight:700,
          color:highlight?"#555":"rgba(255,255,255,.6)" }}>
          {credits} session{credits > 1 ? "s" : ""}
        </span>
        {perSession != null && (
          <span style={{ background: highlight ? "rgba(255,75,0,.1)" : "rgba(255,255,255,.1)",
            color: highlight ? ORANGE : "#ffb78a", fontWeight:800, fontSize:11,
            borderRadius:999, padding:"3px 10px", letterSpacing:".04em" }}>
            ₹{perSession}/session
          </span>
        )}
      </div>

      <p style={{ fontSize:12, lineHeight:1.65,
        color:highlight?"#777":"rgba(255,255,255,.42)", marginBottom:22, marginTop:8 }}>
        {plan?.description || "Pay only when you need interview support. No subscription, no long-term commitment."}
      </p>

      {/* Features list for highlighted card */}
      {highlight && (
        <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
          {["Real-time structured answers","Resume & JD personalised","Any interview platform","Auto-refund guarantee"].map(f => (
            <li key={f} style={{ display:"flex", alignItems:"center", gap:8,
              fontSize:12, color:"#444" }}>
              <span style={{ width:16, height:16, borderRadius:"50%",
                background:"linear-gradient(135deg,#ff4b00,#ff7a2f)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:8, color:"#fff", flexShrink:0, fontWeight:800 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => nav("/access-pricing")}
        style={{ width:"100%", border:"none", borderRadius:16, padding: highlight?"17px 0":"15px 0",
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800,
          letterSpacing:".08em", textTransform:"uppercase", cursor:"pointer",
          background: highlight
            ? "linear-gradient(135deg,#ff4b00,#ff7a2f)"
            : "rgba(255,255,255,.12)",
          color:"#fff",
          boxShadow: highlight ? "0 8px 24px rgba(255,75,0,.4)" : "none",
          transition:"all .18s ease" }}
        onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
        {highlight ? "Get started →" : "Get started"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   HOMEPAGE
════════════════════════════════════════════ */
export default function Homepage() {
  const nav = useNavigate();
  const words = useMemo(() => ["confident", "clear", "calm"], []);
  const [wi, setWi]               = useState(0);
  const [faq, setFaq]             = useState(-1);
  const [mode, setMode]           = useState("before");
  const [plans, setPlans]         = useState([]);
  const [plansLoading, setPL]     = useState(true);
  const [heroShift, setHeroShift] = useState({ x:0, y:0 });
  const doubledCompanies          = useMemo(() => [...companies, ...companies], []);

  useEffect(() => {
    const t = setInterval(() => setWi(i => (i+1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);

  useEffect(() => {
    let live = true;
    setPL(true);
    fetchActivePlans()
      .then(d => { if (live) setPlans(Array.isArray(d) ? d : []); })
      .catch(() => { if (live) setPlans([]); })
      .finally(() => { if (live) setPL(false); });
    return () => { live = false; };
  }, []);

  const fraunces = { fontFamily:"'Fraunces',serif" };
  const jakarta  = { fontFamily:"'Plus Jakarta Sans',sans-serif" };
  const sec      = { padding:"clamp(48px,6vw,72px) clamp(18px,4vw,40px)" };
  const inner    = { maxWidth:1160, margin:"0 auto" };
  const h2style  = { ...fraunces, fontSize:"clamp(1.7rem,3.2vw,2.6rem)", fontWeight:900, lineHeight:1.06, letterSpacing:"-0.02em" };

  const beforeCards = [
    { label:"Mid-answer",     t:"Trailing off, losing the thread",   b:"You start strong but drift. The answer becomes long, unfocused, and difficult to rescue once the pressure rises." },
    { label:"Under pressure", t:"Brain empties completely",           b:"The harder the question, the blanker you get. You hear yourself apologizing and asking for the question to be repeated." },
    { label:"Walking out",    t:"Replaying every mistake",            b:"You leave the call reconstructing what you should have said instead of feeling proud of what you actually said." },
  ];
  const afterCards = [
    { label:"Mid-answer",     t:"On point, landing cleanly",          b:"There is structure. You know where the answer is going. You know when to stop. The interviewer nods. It works." },
    { label:"Under pressure", t:"Calm, grounded, in control",          b:"The answer is always there. Your nervous system stays quiet. Your voice stays steady. You keep going." },
    { label:"Walking out",    t:"You know you nailed it",              b:"Specific, confident, memorable answers — the kind that stick in an interviewer's mind for days." },
  ];
  const shiftCards = mode === "before" ? beforeCards : afterCards;

  const plansGridClass = plans.length >= 3 ? "plans-grid-3" : plans.length === 2 ? "plans-grid-2" : "plans-grid-1";

  return (
    <div className="ff-bg"
      style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:ORANGE,
        color:"#fff", overflowX:"hidden", position:"relative" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center",
          padding:"clamp(44px,6vw,72px) clamp(18px,4vw,40px)" }}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          setHeroShift({ x:((e.clientX-r.left)/r.width-0.5)*8, y:((e.clientY-r.top)/r.height-0.5)*8 });
        }}
        onMouseLeave={() => setHeroShift({ x:0, y:0 })}>
        <div className="hero-grid" style={{ maxWidth:1160, margin:"0 auto", width:"100%" }}>
          {/* Left */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
                width:38, height:38, borderRadius:12, background:"rgba(255,255,255,.12)",
                border:"1px solid rgba(255,255,255,.14)", overflow:"hidden" }}>
                <img src={FLUENTFOX_LOGO} alt="FluentFox"
                  style={{ width:30, height:30, objectFit:"contain" }}
                  onError={e=>{ e.currentTarget.style.display="none"; }} />
              </span>
              <div>
                <div style={{ fontSize:12, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase" }}>FluentFox</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.55)", marginTop:2 }}>Real-time AI interview assistant</div>
              </div>
            </div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase",
              color:"rgba(255,255,255,.52)", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ display:"inline-block", width:22, height:1.5, background:"rgba(255,255,255,.35)" }} />
              Real-time AI interview assistant
            </p>
            <h1 style={{ ...fraunces, fontSize:"clamp(2.1rem,4.8vw,4rem)", fontWeight:900, lineHeight:1.06, letterSpacing:"-0.02em" }}>
              Speak{" "}
              <span key={words[wi]} className="ff-word" style={{ background:"rgba(255,255,255,.13)", borderRadius:8, padding:"2px 10px" }}>
                {words[wi]}
              </span>{" "}
              in every interview.
            </h1>
            <p style={{ fontSize:15, color:"rgba(255,255,255,.76)", lineHeight:1.7, margin:"18px 0 22px", maxWidth:510 }}>
              FluentFox listens to your interview in real time and shows you a structured, personalised
              answer in under 0.2 seconds — so you never freeze, ramble, or lose your place again.
            </p>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
              {["Answers tailored to your actual resume and the specific role.",
                "Runs silently beside any video or phone interview.",
                "Audio never stored, never shared — completely private."].map(t => (
                <li key={t} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:"rgba(255,255,255,.82)", lineHeight:1.5 }}>
                  <span style={{ marginTop:7, width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,.55)", flexShrink:0, boxShadow:"0 0 0 4px rgba(255,255,255,.05)" }} />
                  {t}
                </li>
              ))}
            </ul>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={() => nav("/access-pricing")}
                style={{ ...jakarta, background:"#fff", color:ORANGE, fontSize:12, fontWeight:800,
                  letterSpacing:".08em", textTransform:"uppercase", border:"none", borderRadius:999,
                  padding:"13px 28px", cursor:"pointer", boxShadow:"0 0 0 5px rgba(255,255,255,.15)",
                  transition:"all .18s ease" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#ffe9dd"; e.currentTarget.style.transform="translateY(-1px) scale(1.015)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.transform="none"; }}>
                Get started
              </button>
              <button onClick={() => document.getElementById("pricing-sec")?.scrollIntoView({ behavior:"smooth" })}
                style={{ ...jakarta, background:"transparent", color:"#fff", fontSize:12, fontWeight:700,
                  letterSpacing:".06em", border:"1.5px solid rgba(255,255,255,.38)", borderRadius:999,
                  padding:"12px 22px", cursor:"pointer", transition:"all .15s ease" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="#fff"; e.currentTarget.style.background="rgba(255,255,255,.07)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,.38)"; e.currentTarget.style.background="transparent"; e.currentTarget.style.transform="none"; }}>
                See pricing ↓
              </button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:18, paddingTop:18,
              borderTop:"0.5px solid rgba(255,255,255,.12)", flexWrap:"wrap" }}>
              <div style={{ display:"flex" }}>
                {testimonials.slice(0,4).map((t, x) => (
                  <img key={x} src={t.img} alt={t.name}
                    style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover",
                      border:"2px solid rgba(255,75,0,.8)", marginLeft:x===0?0:-9, flexShrink:0 }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>1 lakh+ candidates</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.48)", marginTop:2 }}>
                  <span style={{ color:"#f59e0b" }}>★★★★★</span> 4.9 avg · 40k+ reviews
                </div>
              </div>
              <div style={{ marginLeft:"auto", background:"rgba(255,255,255,.1)",
                border:"0.5px solid rgba(255,255,255,.17)", borderRadius:999,
                padding:"5px 14px", fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase" }}>
                40,000+ sessions
              </div>
            </div>
          </div>

          {/* Hero card */}
          <div className="ff-float-hero"
            style={{ background:"rgba(6,6,12,.84)", backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)",
              border:"0.5px solid rgba(255,255,255,.1)", borderRadius:24, overflow:"hidden",
              boxShadow:"0 30px 56px rgba(0,0,0,.48)",
              transform:`translate3d(${heroShift.x}px,${heroShift.y}px,0)`,
              transition:"transform .2s ease" }}>
            <div style={{ padding:"12px 18px", borderBottom:"0.5px solid rgba(255,255,255,.07)",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <img src={FLUENTFOX_LOGO} alt="" style={{ height:18, width:18, objectFit:"contain" }}
                  onError={e=>{ e.currentTarget.style.display="none"; }} />
                <span style={{ fontSize:10, letterSpacing:".16em", textTransform:"uppercase", color:"rgba(255,255,255,.33)" }}>live session</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:10, color:"rgba(255,255,255,.58)" }}>
                <span className="ff-live-dot" style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 0 6px rgba(34,197,94,.08)" }} />
                Active
              </div>
            </div>
            <div style={{ padding:18, display:"grid", gridTemplateColumns:"1.45fr 1fr", gap:14 }}>
              <div>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.3)", marginBottom:8 }}>Interviewer question</p>
                <div className="ff-glow" style={{ background:"rgba(255,255,255,.05)", border:"0.5px solid rgba(255,255,255,.08)", borderRadius:14, padding:"13px 15px", fontSize:13, lineHeight:1.55, color:"rgba(255,255,255,.8)", marginBottom:12 }}>
                  Tell me about a time you delivered results under tight pressure.
                </div>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.3)", marginBottom:8 }}>FluentFox answer</p>
                <div style={{ background:"#fff", borderRadius:14, padding:"13px 15px", boxShadow:"0 10px 24px rgba(0,0,0,.10)" }}>
                  <p style={{ fontSize:9, fontWeight:800, letterSpacing:".16em", textTransform:"uppercase", color:ORANGE, marginBottom:7 }}>STAR · Role-aligned · 45s</p>
                  <p style={{ fontSize:12, lineHeight:1.65, color:"#222" }}>At my last role, our product launch was moved up by three weeks. I re-scoped the sprint, got stakeholder sign-off on what to cut, and we shipped on time with zero P1 bugs — driving a 22% spike in weekly active users in the first month.</p>
                </div>
              </div>
              <div>
                <div style={{ background:"rgba(255,255,255,.04)", border:"0.5px solid rgba(255,255,255,.07)", borderRadius:14, padding:"13px 14px", marginBottom:10, transition:"transform .2s ease, background .2s ease" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.background="rgba(255,255,255,.06)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.background="rgba(255,255,255,.04)"; }}>
                  <p style={{ fontSize:9, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.3)", marginBottom:7 }}>Session context</p>
                  <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:6, marginTop:7, fontSize:12, color:"rgba(255,255,255,.58)" }}>
                    <li>◈ Resume loaded</li><li>◈ JD loaded</li><li>◈ Role: Product Manager</li>
                  </ul>
                </div>
                <div style={{ background:"rgba(255,255,255,.04)", border:"0.5px solid rgba(255,255,255,.07)", borderRadius:14, padding:"13px 14px", transition:"transform .2s ease, background .2s ease" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.background="rgba(255,255,255,.06)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.background="rgba(255,255,255,.04)"; }}>
                  <p style={{ fontSize:9, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.3)", marginBottom:5 }}>Response time</p>
                  <p style={{ ...fraunces, fontSize:30, fontWeight:900, lineHeight:1, marginBottom:4 }}>0.2s</p>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,.34)", lineHeight:1.45 }}>Average — never breaks your flow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TICKER — colorful logos ═══════════════════ */}
      <div style={{ background:"#111", borderTop:"0.5px solid rgba(255,255,255,.06)",
        height:66, display:"flex", alignItems:"center", gap:0, overflow:"hidden",
        padding:"0 clamp(18px,4vw,40px)" }}>
        <span style={{ fontSize:10, fontWeight:800, letterSpacing:".18em", textTransform:"uppercase",
          color:"#fff", whiteSpace:"nowrap", flexShrink:0, paddingRight:20,
          borderRight:"0.5px solid rgba(255,255,255,.12)", marginRight:24 }}>
          Candidates targeting
        </span>
        <div style={{ flex:1, overflow:"hidden",
          maskImage:"linear-gradient(to right,transparent,black 8%,black 92%,transparent)",
          WebkitMaskImage:"linear-gradient(to right,transparent,black 8%,black 92%,transparent)" }}>
          <div className="ff-ticker" style={{ display:"flex" }}>
            {doubledCompanies.map((c,i) => (
              <div key={`${c.name}-${i}`} className="ticker-item"
                style={{ flexShrink:0, display:"inline-flex", alignItems:"center", gap:10,
                  padding:"0 22px", height:66, borderRight:"0.5px solid rgba(255,255,255,.06)",
                  transition:"background .2s ease", cursor:"default" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,.04)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
                <div className="ticker-logo-bg" style={{ background: c.bg }}>
                  <BrandLogo src={SIMPLEICONS_COLOR(c.slug)} name={c.name} size={c.size ?? 18} />
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.75)",
                  letterSpacing:".02em", whiteSpace:"nowrap",
                  transition:"color .2s ease" }}>
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section style={{ background:CREAM }}>
        <div style={inner}>
          <div className="stats-grid">
            {[{ n:"1 lakh+", l:"Candidates prepared" },{ n:"0.2s", l:"Avg. answer speed" },
              { n:"40,000+", l:"Live sessions run" },{ n:"4.9★", l:"User rating" }
            ].map((s,i,arr) => (
              <div key={s.n} style={{ padding:"28px 24px", borderRight:i<arr.length-1?"0.5px solid rgba(0,0,0,.07)":"none" }}>
                <div style={{ ...fraunces, fontSize:"2.4rem", fontWeight:900, lineHeight:1, color:ORANGE, marginBottom:8 }}>{s.n}</div>
                <div style={{ fontSize:13, fontWeight:500, color:"#444", lineHeight:1.45 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section id="how" style={{ background:CREAM, color:"#111111", ...sec }}>
        <div style={inner}>
          <div className="sh-grid">
            <div className="ff-rise">
              <Pill>How it works</Pill>
              <h2 style={h2style}>From setup to first live answer in under two minutes.</h2>
            </div>
            <div className="ff-rise" style={{ animationDelay:".08s" }}>
              <p style={{ fontSize:14, color:"#444", lineHeight:1.65 }}>
                Upload your resume and job description before the call. Start the session. FluentFox
                listens and responds automatically while you focus entirely on speaking well.
              </p>
            </div>
          </div>
          <div className="steps-grid">
            {[
              { n:"01", t:"Upload your resume",      b:"FluentFox reads your actual experience so every answer references your real background, projects, and wins." },
              { n:"02", t:"Add the job description",  b:"Answers adapt to the exact company, role, and level so they never feel generic." },
              { n:"03", t:"Start the live session",   b:"Open FluentFox alongside your video call. It listens automatically with no clicking or typing while you're talking." },
              { n:"04", t:"Read and speak naturally", b:"A structured answer appears in under 0.2 seconds. Speak it naturally and keep eye contact." },
              { n:"05", t:"Stop when you're done",   b:"End the session after the call. If it ran under 10 minutes, your credit is refunded automatically." },
            ].map((s,idx) => (
              <div key={s.n} className="ff-rise"
                style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,.06)", borderRadius:16,
                  padding:"18px 16px", transition:"transform .22s ease, box-shadow .22s ease, border-color .22s ease",
                  animationDelay:`${idx*70}ms` }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 14px 30px rgba(0,0,0,.08)"; e.currentTarget.style.borderColor="rgba(255,75,0,.28)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="rgba(0,0,0,.06)"; }}>
                <p style={{ fontSize:10, fontWeight:800, letterSpacing:".14em", textTransform:"uppercase", color:ORANGE, marginBottom:10 }}>Step {s.n}</p>
                <p style={{ ...fraunces, fontSize:15, fontWeight:700, color:"#111", marginBottom:8, lineHeight:1.25 }}>{s.t}</p>
                <p style={{ fontSize:12, color:"#555", lineHeight:1.55 }}>{s.b}</p>
              </div>
            ))}
          </div>

          <div style={{ height:0.5, background:"rgba(0,0,0,.07)", margin:"28px 0" }} />
          <Pill bg="rgba(0,0,0,.06)" color="#444">Works alongside any platform</Pill>

          {/* Platform pills with logos */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:18 }}>
            {platforms.map((p) => (
              <div key={p.name} className="plat-pill"
                style={{ display:"flex", alignItems:"center", gap:9, background:"#fff",
                  border:"0.5px solid rgba(0,0,0,.07)", borderRadius:999, padding:"8px 16px 8px 10px",
                  cursor:"default" }}>
                {/* Logo circle with brand color bg */}
                <span style={{ width:28, height:28, borderRadius:"50%", background:p.bg,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  boxShadow:`0 2px 8px ${p.bg}55` }}>
                  {p.slug
                    ? <img src={SIMPLEICONS_COLOR(p.slug)} alt={p.name}
                        style={{ width:14, height:14, objectFit:"contain", filter:"brightness(0) invert(1)" }} />
                    : <PhoneIcon size={14} />
                  }
                </span>
                <span style={{ fontSize:12, fontWeight:700, color:"#111" }}>{p.name}</span>
                <span style={{ fontSize:10, color:"#22c55e", fontWeight:800, background:"rgba(34,197,94,.1)",
                  borderRadius:999, padding:"2px 8px" }}>Live</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHO IT HELPS ═══════════════════ */}
      <section style={{ background:"#fff", color:"#111111", ...sec }}>
        <div style={inner}>
          <div className="sh-grid">
            <div className="ff-rise">
              <Pill>Who it helps</Pill>
              <h2 style={h2style}>If interviews make you nervous, this is built for you.</h2>
            </div>
            <div className="ff-rise" style={{ animationDelay:".08s" }}>
              <p style={{ fontSize:14, color:"#444", lineHeight:1.65 }}>
                Anxiety does not care how qualified you are. It hits first-timers and experienced professionals alike.
                FluentFox makes the nerves irrelevant because the answer is there when you need it.
              </p>
            </div>
          </div>
          <div className="w4-grid">
            {[
              { label:"Students & freshers", t:"No work history? No problem.",        b:"Practice real examples and frame internships or projects the way interviewers expect." },
              { label:"Active job seekers",  t:"You know it. Now say it well.",        b:"Bridge the gap between knowing the answer and delivering it clearly under pressure." },
              { label:"Career switchers",    t:"Your past looks different on paper.",   b:"Turn your transition into a confident story instead of an awkward explanation." },
              { label:"Anyone who blanks",   t:"The empty mind ends today.",           b:"When your brain goes blank mid-answer, FluentFox already has the next line on screen." },
            ].map((c,idx) => (
              <div key={c.label} className="ff-rise"
                style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,.08)", borderRadius:16,
                  padding:18, transition:"transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                  animationDelay:`${idx*80}ms` }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 10px 26px rgba(0,0,0,.08)"; e.currentTarget.style.borderColor="rgba(255,75,0,.22)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="rgba(0,0,0,.08)"; }}>
                <p style={{ fontSize:9, fontWeight:800, letterSpacing:".14em", textTransform:"uppercase", color:"#aaa", marginBottom:9 }}>{c.label}</p>
                <p style={{ ...fraunces, fontSize:16, fontWeight:700, color:"#111", marginBottom:8, lineHeight:1.28 }}>{c.t}</p>
                <p style={{ fontSize:12, color:"#555", lineHeight:1.55 }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ THE SHIFT ═══════════════════ */}
      <section style={{ background:DARK, color:"#fff", ...sec }}>
        <div style={inner}>
          <div className="sh-grid">
            <div className="ff-rise">
              <Pill bg="rgba(255,183,138,0.14)" color="#ffb78a">The shift</Pill>
              <h2 style={h2style}>Same interview. Completely different outcome.</h2>
            </div>
            <div className="ff-rise" style={{ animationDelay:".08s" }}>
              <p style={{ fontSize:14, color:"#fff", lineHeight:1.65 }}>
                It is not about reading off a script — it is about having a safety net that stops the panic.
                Once the anxiety is gone, everything else falls into place.
              </p>
            </div>
          </div>
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,.07)",
            border:"0.5px solid rgba(255,255,255,.13)", borderRadius:999, padding:3, gap:3, marginBottom:20 }}>
            {[{ key:"before", label:"Without FluentFox" },{ key:"after", label:"With FluentFox" }].map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                style={{ ...jakarta, fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase",
                  border:"none", borderRadius:999, padding:"8px 18px", cursor:"pointer",
                  transition:"background .18s ease, color .18s ease, transform .18s ease",
                  background:mode===m.key?"#fff":"transparent",
                  color:mode===m.key?"#111":"rgba(255,255,255,.36)" }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; }}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="ba3-grid">
            {shiftCards.map((c,idx) => (
              <div key={c.label} className="ff-rise"
                style={{ background:"rgba(255,255,255,.05)", border:"0.5px solid rgba(255,255,255,.08)",
                  borderRadius:16, padding:18, transition:"transform .2s ease, background .2s ease",
                  animationDelay:`${idx*80}ms` }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.background="rgba(255,255,255,.07)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.background="rgba(255,255,255,.05)"; }}>
                <p style={{ fontSize:9, fontWeight:800, letterSpacing:".18em", textTransform:"uppercase", color:"#ffb78a", marginBottom:10 }}>{c.label}</p>
                <p style={{ ...fraunces, fontSize:16, fontWeight:700, marginBottom:8 }}>{c.t}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,.64)", lineHeight:1.6 }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ REVIEWS ═══════════════════ */}
      <section style={{ background:"#0b0b10", color:"#fff", ...sec }}>
        <div style={inner}>
          <div className="sh-grid">
            <div className="ff-rise">
              <Pill bg="rgba(255,183,138,0.13)" color="#ffb78a">Real results</Pill>
              <h2 style={h2style}>From the people who actually used it.</h2>
            </div>
            <div className="ff-rise" style={{ animationDelay:".08s" }}>
              <p style={{ fontSize:14, color:"#fff", lineHeight:1.65 }}>
                These are the outcomes we see across everyday candidates — not the handpicked best case, the regular case.
              </p>
            </div>
          </div>

          <div className="review-grid">
            {testimonials.map((r,idx) => (
              <div key={`${r.name}-${idx}`} className="ff-rise review-card"
                style={{
                  background: idx % 3 === 1
                    ? "linear-gradient(145deg,#1e1208,#1a1008)"
                    : "linear-gradient(145deg,#161616,#121212)",
                  borderRadius:22, padding:"26px 22px 22px",
                  border: idx % 3 === 1
                    ? "1px solid rgba(255,75,0,.2)"
                    : "1px solid rgba(255,255,255,.07)",
                  position:"relative", overflow:"hidden",
                  animationDelay:`${idx*55}ms`,
                  boxShadow: idx % 3 === 1
                    ? "0 8px 32px rgba(255,75,0,.08)"
                    : "0 4px 20px rgba(0,0,0,.3)",
                }}>
                {/* Top accent line */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background: idx % 3 === 1
                    ? "linear-gradient(90deg,#ff4b00,#ff8c00)"
                    : "linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)",
                  borderRadius:"22px 22px 0 0" }} />

                {/* Large decorative quote mark */}
                <div style={{ position:"absolute", bottom:-10, right:16,
                  fontFamily:"'Fraunces',serif", fontSize:88, fontWeight:900, lineHeight:1,
                  color: idx % 3 === 1 ? "rgba(255,75,0,.09)" : "rgba(255,255,255,.04)",
                  userSelect:"none", pointerEvents:"none" }}>"</div>

                {/* Stars + Verified row */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ color:"#f59e0b", fontSize:13, letterSpacing:3 }}>{"★".repeat(r.stars)}</div>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase",
                    color: idx % 3 === 1 ? "rgba(255,75,0,.8)" : "rgba(34,197,94,.7)",
                    background: idx % 3 === 1 ? "rgba(255,75,0,.1)" : "rgba(34,197,94,.08)",
                    borderRadius:999, padding:"3px 10px",
                    border: idx % 3 === 1 ? "0.5px solid rgba(255,75,0,.2)" : "0.5px solid rgba(34,197,94,.2)" }}>
                    Verified ✓
                  </span>
                </div>

                {/* Review text */}
                <p style={{ fontSize:13.5, lineHeight:1.78, color:"rgba(255,255,255,.85)",
                  marginBottom:20, position:"relative", zIndex:1,
                  fontStyle:"italic", letterSpacing:".01em" }}>
                  "{r.text}"
                </p>

                {/* Divider */}
                <div style={{ height:"0.5px",
                  background: idx % 3 === 1
                    ? "linear-gradient(90deg,rgba(255,75,0,.25),transparent)"
                    : "rgba(255,255,255,.08)",
                  marginBottom:16 }} />

                {/* Author */}
                <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative", zIndex:1 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <img src={r.img} alt={r.name}
                      style={{ width:46, height:46, borderRadius:"50%", objectFit:"cover", display:"block",
                        border: idx % 3 === 1 ? "2px solid rgba(255,75,0,.5)" : "2px solid rgba(255,255,255,.15)",
                        boxShadow: idx % 3 === 1 ? "0 0 0 4px rgba(255,75,0,.08)" : "0 0 0 4px rgba(255,255,255,.04)" }}
                      onError={e=>{ e.currentTarget.style.display="none"; }} />
                    <div style={{ position:"absolute", bottom:1, right:1, width:10, height:10,
                      borderRadius:"50%", background:"#22c55e", border:"2px solid #121212" }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:800, color:"#fff",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.name}</p>
                    <p style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:1 }}>{r.handle}</p>
                    <p style={{ fontSize:11, marginTop:2, fontWeight:600,
                      color: idx % 3 === 1 ? "rgba(255,75,0,.8)" : "rgba(255,183,138,.7)" }}>{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate stats bar */}
          <div style={{ marginTop:32, display:"flex", alignItems:"center", justifyContent:"center",
            gap:32, flexWrap:"wrap", padding:"22px 28px",
            background:"rgba(255,255,255,.03)", border:"0.5px solid rgba(255,255,255,.07)", borderRadius:18 }}>
            {[
              { val:"4.9", sub:"Avg. rating", suffix:"★★★★★", suffixColor:"#f59e0b", valColor:"#fff" },
              { val:"340+", sub:"Verified reviews", suffix:null, valColor:ORANGE },
              { val:"1L+", sub:"Candidates helped", suffix:null, valColor:"#fff" },
              { val:"93%", sub:"Got follow-up rounds", suffix:null, valColor:"#22c55e" },
            ].map((s, i, arr) => (
              <React.Fragment key={s.sub}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ ...fraunces, fontSize:34, fontWeight:900, color:s.valColor, lineHeight:1 }}>{s.val}</div>
                  {s.suffix && <div style={{ color:s.suffixColor, fontSize:12, letterSpacing:2, marginTop:4 }}>{s.suffix}</div>}
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:s.suffix?2:8 }}>{s.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width:"0.5px", height:48, background:"rgba(255,255,255,.1)", flexShrink:0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING — redesigned ═══════════════════ */}
      <section id="pricing-sec" style={{ background:"#0d0d0d", color:"#fff", ...sec, position:"relative", overflow:"hidden" }}>
        {/* Background decoration */}
        <div style={{ position:"absolute", top:-120, left:"50%", transform:"translateX(-50%)",
          width:700, height:700, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,75,0,.07) 0%,transparent 70%)",
          pointerEvents:"none" }} />

        <div style={{ ...inner, position:"relative", zIndex:1 }}>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <Pill bg="rgba(255,75,0,0.15)" color="#ff7a2f">Pricing</Pill>
            <h2 style={{ ...h2style, marginBottom:14 }}>Pay per session. No subscriptions.</h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,.5)", maxWidth:520, margin:"0 auto", lineHeight:1.72 }}>
              Buy credits when you have interviews coming up. Use them whenever you need support.
              Credits never expire.
            </p>
          </div>

          {/* Guarantee strip above cards */}
          <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center",
            marginBottom:32, padding:"14px 24px", background:"rgba(255,255,255,.04)",
            border:"0.5px solid rgba(255,255,255,.09)", borderRadius:16 }}>
            {[
              { icon:"🔁", label:"Auto-refund under 10 mins" },
              { icon:"🔒", label:"Audio never stored" },
              { icon:"✓", label:"No subscription" },
              { icon:"📱", label:"Any platform" },
            ].map(g => (
              <div key={g.label} style={{ display:"flex", alignItems:"center", gap:7,
                fontSize:12, color:"rgba(255,255,255,.62)", fontWeight:600 }}>
                <span style={{ fontSize:14 }}>{g.icon}</span>
                {g.label}
              </div>
            ))}
          </div>

          {/* Plans */}
          {plansLoading ? (
            <div className="plans-grid-3">
              {[1,2,3].map(i => (
                <div key={i} className="ff-skeleton"
                  style={{ background:"rgba(255,255,255,.06)", borderRadius:24, minHeight:320 }} />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px",
              background:"rgba(255,255,255,.04)", borderRadius:20, border:"0.5px solid rgba(255,255,255,.1)" }}>
              <p style={{ fontSize:32, marginBottom:12 }}>🚀</p>
              <p style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Plans launching soon</p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginBottom:20 }}>
                We're putting the finishing touches on our pricing. Get notified when we launch.
              </p>
              <button onClick={() => nav("/access-pricing")}
                style={{ ...jakarta, background:ORANGE, color:"#fff", border:"none",
                  borderRadius:999, padding:"12px 28px", fontWeight:800, fontSize:12,
                  cursor:"pointer", letterSpacing:".08em", textTransform:"uppercase",
                  boxShadow:"0 8px 24px rgba(255,75,0,.4)" }}>
                Get notified →
              </button>
            </div>
          ) : (
            <div className={plansGridClass}>
              {plans.map((plan,idx) => (
                <PricingCard key={plan.id??idx} plan={plan}
                  highlight={plans.length===1?true:idx===Math.floor(plans.length/2)}
                  index={idx} />
              ))}
            </div>
          )}

          {/* Bottom note */}
          <p style={{ textAlign:"center", fontSize:12, color:"rgba(255,255,255,.3)",
            marginTop:24, lineHeight:1.6 }}>
            All major payment methods accepted · Instant activation · No hidden fees
          </p>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section id="faq" style={{ background:CREAM, color:"#111111", ...sec }}>
        <div style={inner}>
          <div className="sh-grid" style={{ marginBottom:26 }}>
            <div className="ff-rise">
              <Pill>Questions</Pill>
              <h2 style={h2style}>Straight answers.</h2>
            </div>
            <div className="ff-rise" style={{ animationDelay:".08s" }}>
              <p style={{ fontSize:14, color:"#444", lineHeight:1.65 }}>
                No marketing copy. Just direct answers about how FluentFox actually works, what it costs,
                and what to expect the first time you use it in a real interview.
              </p>
            </div>
          </div>
          <div style={{ background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 6px 24px rgba(0,0,0,.08)" }}>
            {faqs.map((item,idx) => {
              const open = faq === idx;
              return (
                <div key={item.q} style={{ borderBottom:idx<faqs.length-1?"0.5px solid #f0ede8":"none" }}>
                  <button onClick={() => setFaq(p => p===idx?-1:idx)}
                    style={{ width:"100%", display:"grid", gridTemplateColumns:"50px 1fr",
                      textAlign:"left", background:open?"#fff9f6":"transparent",
                      border:"none", cursor:"pointer", transition:"background .15s ease" }}
                    onMouseEnter={e=>{ if(!open) e.currentTarget.style.background="#fafaf8"; }}
                    onMouseLeave={e=>{ if(!open) e.currentTarget.style.background="transparent"; }}>
                    <div style={{ background:ORANGE, color:"#fff", display:"flex", alignItems:"center",
                      justifyContent:"center", ...fraunces, fontSize:14, fontWeight:700 }}>
                      {String(idx+1).padStart(2,"0")}
                    </div>
                    <div style={{ padding:"16px 16px" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                        <p style={{ ...fraunces, fontSize:14, fontWeight:700, color:"#111", lineHeight:1.35 }}>{item.q}</p>
                        {/* Perfect-center SVG plus/cross */}
                        <span style={{
                          width:28, height:28, borderRadius:"50%", flexShrink:0,
                          border: open ? `1.5px solid ${ORANGE}` : "1.5px solid #ddd",
                          display:"inline-flex", alignItems:"center", justifyContent:"center",
                          background: open ? ORANGE : "transparent",
                          transform: open ? "rotate(45deg)" : "none",
                          transition:"transform .22s ease, background .15s ease, border-color .15s ease",
                          cursor:"pointer",
                        }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <line x1="5" y1="1" x2="5" y2="9" stroke={open?"#fff":"#999"} strokeWidth="1.8" strokeLinecap="round"/>
                            <line x1="1" y1="5" x2="9" y2="5" stroke={open?"#fff":"#999"} strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                        </span>
                      </div>
                      <div style={{ maxHeight:open?260:0, overflow:"hidden",
                        transition:"max-height .32s ease, opacity .28s ease", opacity:open?1:0 }}>
                        <p style={{ fontSize:12, color:"#555", lineHeight:1.65, paddingTop:10 }}>{item.a}</p>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA BOTTOM ═══════════════════ */}
      <section style={{ background:"linear-gradient(135deg,#d43800,#ff4b00 55%,#ff6620)",
        color:"#fff", position:"relative", overflow:"hidden", ...sec }}>
        <div className="ff-sp1" style={{ position:"absolute", right:-60, top:-60, width:220, height:220,
          borderRadius:"50%", background:"rgba(255,255,255,.06)", pointerEvents:"none" }} />
        <div className="ff-sp2" style={{ position:"absolute", left:-80, bottom:-40, width:240, height:240,
          borderRadius:"50%", background:"rgba(0,0,0,.1)", pointerEvents:"none" }} />
        <div style={{ ...inner, position:"relative", zIndex:1 }}>
          <div className="cta2-grid">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
                  width:36, height:36, borderRadius:12, background:"rgba(255,255,255,.12)",
                  border:"1px solid rgba(255,255,255,.14)", overflow:"hidden" }}>
                  <img src={FLUENTFOX_LOGO} alt="FluentFox" style={{ width:28, height:28, objectFit:"contain" }}
                    onError={e=>{ e.currentTarget.style.display="none"; }} />
                </span>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase" }}>FluentFox</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.55)", marginTop:2 }}>Premium AI interview assistant</div>
                </div>
              </div>
              <h2 style={{ ...h2style, marginBottom:14 }}>Your next interview could be your best one yet.</h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,.76)", lineHeight:1.72, marginBottom:24, maxWidth:480 }}>
                Sign up, buy one credit, and start your first session in under five minutes. If it does not
                work within the first ten minutes, your credit comes back automatically.
              </p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => nav("/access-pricing")}
                  style={{ ...jakarta, background:"#111", color:"#fff", fontSize:12, fontWeight:800,
                    letterSpacing:".08em", textTransform:"uppercase", border:"none", borderRadius:999,
                    padding:"13px 28px", cursor:"pointer", transition:"transform .18s ease, opacity .18s ease" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.opacity=".92"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.opacity="1"; }}>
                  Get started
                </button>
                <button onClick={() => document.getElementById("pricing-sec")?.scrollIntoView({ behavior:"smooth" })}
                  style={{ ...jakarta, background:"transparent", color:"#fff", fontSize:12, fontWeight:700,
                    letterSpacing:".06em", border:"1.5px solid rgba(255,255,255,.38)", borderRadius:999,
                    padding:"12px 22px", cursor:"pointer", transition:"transform .18s ease, background .18s ease" }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.background="rgba(255,255,255,.07)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.background="transparent"; }}>
                  See pricing
                </button>
              </div>
            </div>
            <div style={{ background:"rgba(0,0,0,.2)", border:"0.5px solid rgba(255,255,255,.18)", borderRadius:18, padding:20 }}>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:".18em", textTransform:"uppercase", color:"rgba(255,255,255,.42)", marginBottom:6 }}>What you get</p>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:11, marginTop:14 }}>
                {["Real-time answers matched to your resume and the specific role.",
                  "Structured responses for behavioural, technical, and situational questions.",
                  "Complete privacy — audio stays on your device, never transmitted.",
                  "Auto-refund if session ends before 10 minutes, no questions asked.",
                  "Works on Zoom, Meet, Teams, phone calls, and any other platform.",
                ].map(item => (
                  <li key={item} style={{ display:"flex", alignItems:"flex-start", gap:10,
                    fontSize:13, lineHeight:1.52, color:"rgba(255,255,255,.84)" }}>
                    <span style={{ marginTop:6, width:7, height:7, borderRadius:"50%",
                      background:"#22c55e", flexShrink:0, boxShadow:"0 0 0 5px rgba(34,197,94,.08)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}