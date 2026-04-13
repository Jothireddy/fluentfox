import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const O = "#ff4b00";
const CREAM = "#fdf8f0";

export default function ContactPage() {
  const nav = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("rahul@fluentfox.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .cp { font-family: 'Plus Jakarta Sans', sans-serif; background: ${CREAM}; min-height: 100vh; }
    .cp-hero { background: ${O}; padding: clamp(52px,7vw,80px) clamp(20px,5vw,52px) clamp(40px,5vw,60px); }
    .cp-hero-inner { max-width: 860px; margin: 0 auto; }
    .cp-back { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,.6); letter-spacing: .08em; text-transform: uppercase; background: none; border: none; cursor: pointer; margin-bottom: 28px; padding: 0; transition: color .15s; }
    .cp-back:hover { color: #fff; }
    .cp-body { max-width: 860px; margin: 0 auto; padding: clamp(40px,6vw,72px) clamp(20px,5vw,52px); }
    .cp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
    @media(max-width:640px){ .cp-grid { grid-template-columns: 1fr; } }
    .cp-card { background: #fff; border: 0.5px solid rgba(0,0,0,.08); border-radius: 18px; padding: 24px; transition: transform .2s, box-shadow .2s; }
    .cp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.08); }
    .cp-card-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,75,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
    .cp-card-label { font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #aaa; margin-bottom: 8px; }
    .cp-card-val { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: #111; margin-bottom: 6px; }
    .cp-card-sub { font-size: 13px; color: #777; line-height: 1.6; }
    .cp-email-box { background: #fff8f5; border: 1px solid rgba(255,75,0,0.2); border-radius: 18px; padding: 32px; margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
    .cp-email-addr { font-family: 'Fraunces', serif; font-size: clamp(1.2rem, 3vw, 1.7rem); font-weight: 700; color: #111; }
    .cp-copy-btn { display: inline-flex; align-items: center; gap: 8px; background: ${O}; color: #fff; border: none; border-radius: 999px; padding: 12px 24px; font-family: 'Plus Jakarta Sans',sans-serif; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; transition: opacity .15s, transform .12s; white-space: nowrap; }
    .cp-copy-btn:hover { opacity: .88; transform: scale(1.03); }
    .cp-include { background: #fff; border: 0.5px solid rgba(0,0,0,.08); border-radius: 18px; padding: 28px; margin-bottom: 40px; }
    .cp-include-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: #111; margin-bottom: 18px; }
    .cp-include-list { display: flex; flex-direction: column; gap: 12px; }
    .cp-include-item { display: flex; align-items: flex-start; gap: 14px; font-size: 14px; color: #444; line-height: 1.65; }
    .cp-steps { background: #fff; border: 0.5px solid rgba(0,0,0,.08); border-radius: 18px; padding: 28px; }
    .cp-steps-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: #111; margin-bottom: 18px; }
    .cp-step-item { display: flex; align-items: flex-start; gap: 14px; font-size: 14px; color: #444; line-height: 1.65; padding: 12px 0; border-bottom: 0.5px solid #f0ede8; }
    .cp-step-item:last-child { border-bottom: none; padding-bottom: 0; }
    .cp-step-num { font-family: 'Fraunces', serif; font-size: 13px; font-weight: 700; color: ${O}; min-width: 24px; padding-top: 1px; }
  `;

  return (
    <div className="cp">
      <style>{css}</style>
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <button className="cp-back" onClick={() => nav(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 2L3.5 7L8.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 14 }}>Support</p>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>We're here to help.</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.7)", lineHeight: 1.7, maxWidth: 520 }}>
            Questions about plans, technical issues, billing, or anything else — the FluentFox team typically responds within 24–48 hours on business days.
          </p>
        </div>
      </div>

      <div className="cp-body">
        {/* Info cards */}
        <div className="cp-grid">
          {[
            { icon: "🕐", label: "Live support hours", val: "Mon–Fri, 9 AM–6 PM IST", sub: "Email responses within 24–48 hours on business days." },
            { icon: "🌐", label: "Platform availability", val: "24 / 7", sub: "FluentFox is always on — access your account any time." },
            { icon: "💳", label: "Billing queries", val: "Billing & Refunds", sub: 'Email with subject "Refund Request" for fastest response.' },
            { icon: "⚙️", label: "Technical support", val: "Platform Issues", sub: "Include your registered email and a description of the issue." },
          ].map((c) => (
            <div key={c.label} className="cp-card">
              <div className="cp-card-icon">{c.icon}</div>
              <p className="cp-card-label">{c.label}</p>
              <p className="cp-card-val">{c.val}</p>
              <p className="cp-card-sub">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Email CTA */}
        <div className="cp-email-box">
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#aaa", marginBottom: 8 }}>Email us directly</p>
            <p className="cp-email-addr">rahul@fluentfox.in</p>
          </div>
          <button className="cp-copy-btn" onClick={copyEmail}>
            {copied ? "✓ Copied" : "Copy email"}
          </button>
        </div>

        {/* What to include */}
        <div className="cp-include">
          <p className="cp-include-title">What to include in your message</p>
          <div className="cp-include-list">
            {[
              "Your registered email address.",
              "A clear description of your issue or question.",
              "Your transaction ID or purchase date (for billing or refund queries).",
              "Screenshots or supporting documents, if applicable.",
            ].map((item, i) => (
              <div key={i} className="cp-include-item">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: O, flexShrink: 0, marginTop: 7 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Technical steps */}
        <div className="cp-steps">
          <p className="cp-steps-title">Having trouble accessing the platform?</p>
          <p style={{ fontSize: 14, color: "#777", marginBottom: 18, lineHeight: 1.7 }}>Try these steps before reaching out — they fix most access issues in under a minute.</p>
          {[
            "Check your internet connection and try refreshing the page.",
            "Clear your browser cache and cookies, then sign back in.",
            "Try a different browser or device.",
            "If the issue persists, email us at rahul@fluentfox.in with your registered email and a description of the problem.",
          ].map((step, i) => (
            <div key={i} className="cp-step-item">
              <span className="cp-step-num">{String(i + 1).padStart(2, "0")}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}