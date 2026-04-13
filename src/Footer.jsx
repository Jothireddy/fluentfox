import React from "react";
import { useNavigate } from "react-router-dom";

const O = "#ff4b00";

export default function Footer() {
  const nav = useNavigate();
  const year = new Date().getFullYear();

  const legal = [
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy",     path: "/privacy" },
    { label: "Refund Policy",      path: "/refund" },
    { label: "Delivery Policy",    path: "/delivery" },
    { label: "Contact Us",         path: "/contact" },
  ];

  const product = [
    { label: "How it works",    path: "/#how" },
    { label: "Who it's for",    path: "/#who" },
    { label: "Pricing",         path: "/#pricing-sec" },
    { label: "FAQ",             path: "/#faq" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
    .footer { background: #0d0d0d; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
    .footer-main { max-width: 1200px; margin: 0 auto; padding: clamp(52px,7vw,80px) clamp(20px,5vw,52px) clamp(36px,5vw,52px); display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 52px; }
    @media(max-width:860px){ .footer-main { grid-template-columns: 1fr 1fr; gap: 36px; } }
    @media(max-width:540px){ .footer-main { grid-template-columns: 1fr; gap: 32px; } }
    .footer-brand { display: flex; flex-direction: column; gap: 16px; }
    .footer-logo { height: 34px; object-fit: contain; }
    .footer-tagline { font-size: 14px; color: rgba(255,255,255,.45); line-height: 1.72; max-width: 280px; }
    .footer-ig { display: inline-flex; align-items: center; gap: 9px; background: rgba(255,255,255,.06); border: 0.5px solid rgba(255,255,255,.1); border-radius: 999px; padding: 9px 16px; font-size: 12px; font-weight: 700; color: rgba(255,255,255,.65); text-decoration: none; transition: background .18s, color .18s, border-color .18s; width: fit-content; margin-top: 4px; }
    .footer-ig:hover { background: rgba(255,75,0,0.12); border-color: rgba(255,75,0,0.3); color: #fff; }
    .footer-col-title { font-size: 10px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.28); margin-bottom: 18px; }
    .footer-links { display: flex; flex-direction: column; gap: 11px; }
    .footer-link { font-size: 14px; color: rgba(255,255,255,.55); text-decoration: none; background: none; border: none; cursor: pointer; text-align: left; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; transition: color .15s; }
    .footer-link:hover { color: #fff; }
    .footer-divider { height: 0.5px; background: rgba(255,255,255,.07); margin: 0 clamp(20px,5vw,52px); }
    .footer-bottom { max-width: 1200px; margin: 0 auto; padding: 22px clamp(20px,5vw,52px); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .footer-copy { font-size: 12px; color: rgba(255,255,255,.28); }
    .footer-bottom-links { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .footer-bottom-link { font-size: 12px; color: rgba(255,255,255,.28); text-decoration: none; background: none; border: none; cursor: pointer; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; transition: color .15s; }
    .footer-bottom-link:hover { color: rgba(255,255,255,.7); }
    .footer-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,.2); }
    .footer-status { display: inline-flex; align-items: center; gap: 7px; background: rgba(34,197,94,0.1); border: 0.5px solid rgba(34,197,94,0.22); border-radius: 999px; padding: 5px 12px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,.55); }
    .footer-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: fpulse 2s ease-in-out infinite; flex-shrink: 0; }
    @keyframes fpulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  `;

  const handleNav = (path) => {
    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    nav(path);
  };

  return (
    <footer className="footer">
      <style>{css}</style>
      <div className="footer-main">
        {/* Brand col */}
        <div className="footer-brand">
          <img
            src="/company-logo.webp"
            alt="FluentFox"
            className="footer-logo"
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span style={{ display: "none", fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900, color: "#fff" }}>
            FluentFox
          </span>
          <p className="footer-tagline">
            AI-powered real-time interview assistant. Speak confidently. Land the job.
          </p>
          <div className="footer-status">
            <span className="footer-status-dot" />
            All systems operational
          </div>
          <a
            href="https://instagram.com/fluentfox"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-ig"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @fluentfox
          </a>
        </div>

        {/* Product col */}
        <div>
          <p className="footer-col-title">Product</p>
          <div className="footer-links">
            {product.map((l) => (
              <button key={l.label} className="footer-link" onClick={() => handleNav(l.path)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legal col */}
        <div>
          <p className="footer-col-title">Legal</p>
          <div className="footer-links">
            {legal.map((l) => (
              <button key={l.label} className="footer-link" onClick={() => nav(l.path)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copy">© {year} FluentFox. All rights reserved.</p>
        <div className="footer-bottom-links">
          {[
            { label: "Privacy", path: "/privacy" },
            { label: "Terms", path: "/terms" },
            { label: "Refund", path: "/refund" },
            { label: "Contact", path: "/contact" },
          ].map((l, i, arr) => (
            <React.Fragment key={l.label}>
              <button className="footer-bottom-link" onClick={() => nav(l.path)}>{l.label}</button>
              {i < arr.length - 1 && <span className="footer-dot" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}