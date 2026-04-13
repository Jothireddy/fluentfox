import React from "react";
import { useNavigate } from "react-router-dom";

const O = "#ff4b00";

export default function LegalLayout({ title, subtitle, updated, children }) {
  const nav = useNavigate();

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .legal-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: #fdf8f0; min-height: 100vh; }
    .legal-hero { background: ${O}; padding: clamp(52px,7vw,80px) clamp(20px,5vw,52px) clamp(40px,5vw,60px); }
    .legal-hero-inner { max-width: 860px; margin: 0 auto; }
    .legal-back { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,.6); letter-spacing: .08em; text-transform: uppercase; background: none; border: none; cursor: pointer; margin-bottom: 28px; padding: 0; transition: color .15s; }
    .legal-back:hover { color: #fff; }
    .legal-back svg { transition: transform .15s; }
    .legal-back:hover svg { transform: translateX(-3px); }
    .legal-eyebrow { font-size: 10px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.5); margin-bottom: 14px; }
    .legal-title { font-family: 'Fraunces', serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 14px; }
    .legal-subtitle { font-size: 15px; color: rgba(255,255,255,.7); line-height: 1.7; max-width: 560px; margin-bottom: 20px; }
    .legal-meta { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.12); border: 0.5px solid rgba(255,255,255,.2); border-radius: 999px; padding: 6px 16px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.7); letter-spacing: .06em; }
    .legal-body { max-width: 860px; margin: 0 auto; padding: clamp(40px,6vw,72px) clamp(20px,5vw,52px); }
    .legal-divider { height: 0.5px; background: rgba(0,0,0,.08); margin: 36px 0; }
  `;

  return (
    <div className="legal-wrap">
      <style>{css}</style>
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <button className="legal-back" onClick={() => nav(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 2L3.5 7L8.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">{title}</h1>
          {subtitle && <p className="legal-subtitle">{subtitle}</p>}
          <div className="legal-meta">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            Last updated: {updated}
          </div>
        </div>
      </div>
      <div className="legal-body">
        {children}
      </div>
    </div>
  );
}