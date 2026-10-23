import React, { useEffect, useRef, useState } from "react";

/* =====================================================================
   FluentFox — Graphite Glass (web dashboards)
   Chartreuse (primary) · Lavender (secondary) · Tomato (danger/emphasis)
   ===================================================================== */

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=JetBrains+Mono:wght@400..600&display=swap");

.ff-root{
  --lime:#c8f04a; --lime-hi:#d4f75e; --lav:#c7b8f5; --lav-hi:#e4dcff; --tomato:#ff6347;
  --fg:#f4f2f7; --fg2:#c4c0cf; --fg3:#8d889b; --fg4:#5f5a6e;
  --line:rgba(255,255,255,.08); --line2:rgba(255,255,255,.14);
  --ease:cubic-bezier(.22,1,.36,1);
  position:relative; min-height:100vh; isolation:isolate; overflow-x:hidden;
  background:#0b0a0e; color:var(--fg);
  font-family:"Plus Jakarta Sans",Inter,system-ui,-apple-system,sans-serif; font-size:14px;
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
}
.ff-root *{box-sizing:border-box}
.ff-root ::selection{background:rgba(199,184,245,.35);color:#fff}
.ff-root :focus-visible{outline:2px solid rgba(199,184,245,.7);outline-offset:2px}
.ff-root ::-webkit-scrollbar{width:10px;height:10px}
.ff-root ::-webkit-scrollbar-track{background:transparent}
.ff-root ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border:3px solid transparent;border-radius:99px;background-clip:padding-box}
.ff-root ::-webkit-scrollbar-thumb:hover{background:rgba(199,184,245,.5);background-clip:padding-box}

/* Background haze + grain */
.ff-aurora{position:fixed;inset:0;z-index:-2;overflow:hidden;pointer-events:none}
.ff-aurora span{position:absolute;border-radius:9999px;filter:blur(120px);animation:ff-drift 40s ease-in-out infinite alternate}
.ff-aurora span:nth-child(1){width:640px;height:520px;top:-260px;left:-200px;background:var(--lav);opacity:.18}
.ff-aurora span:nth-child(2){width:480px;height:480px;bottom:-260px;right:-180px;background:var(--tomato);opacity:.11;animation-delay:-12s}
.ff-aurora span:nth-child(3){width:320px;height:320px;top:45%;left:55%;background:var(--lime);opacity:.06;animation-delay:-24s}
.ff-grain{position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:.05;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}

/* Text helpers */
.ff-fg{color:var(--fg)} .ff-fg2{color:var(--fg2)} .ff-fg3{color:var(--fg3)} .ff-fg4{color:var(--fg4)}
.ff-lime{color:var(--lime)} .ff-lav{color:var(--lav)} .ff-tomato{color:var(--tomato)}
.ff-mono{font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
.ff-eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--fg3)}
.ff-kpi{font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums;color:var(--fg)}
.ff-hl{position:relative;color:var(--lime);white-space:nowrap}
.ff-hl::after{content:"";position:absolute;left:0;right:0;bottom:-5px;height:3px;border-radius:99px;background:var(--tomato);opacity:.85;transform-origin:left;animation:ff-grow .8s .45s var(--ease) both}

/* Glass */
.ff-glass{background:rgba(255,255,255,.045);-webkit-backdrop-filter:blur(20px) saturate(140%);backdrop-filter:blur(20px) saturate(140%);
  border:1px solid var(--line);border-radius:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 14px 36px -18px rgba(0,0,0,.75)}
.ff-glass-strong{background:rgba(24,23,31,.86);-webkit-backdrop-filter:blur(28px) saturate(150%);backdrop-filter:blur(28px) saturate(150%);
  border:1px solid var(--line2);border-radius:22px;box-shadow:0 40px 100px -24px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.09)}
.ff-lift{transition:transform .25s var(--ease),border-color .25s ease,background .25s ease}
.ff-lift:hover{transform:translateY(-2px);border-color:rgba(199,184,245,.25);background:rgba(255,255,255,.06)}
.ff-header{position:sticky;top:0;z-index:30;background:rgba(11,10,14,.62);-webkit-backdrop-filter:blur(20px) saturate(150%);backdrop-filter:blur(20px) saturate(150%);border-bottom:1px solid var(--line)}
.ff-pill{background:rgba(255,255,255,.04);border:1px solid var(--line)}

/* Brand */
.ff-brand-dot{width:10px;height:10px;border-radius:3px;background:var(--lime);transform:rotate(45deg);box-shadow:0 0 0 3px rgba(200,240,74,.15)}

/* Inputs */
.ff-input{width:100%;height:42px;padding:0 14px;border-radius:12px;background:rgba(0,0,0,.25);border:1px solid var(--line);color:var(--fg);
  font:inherit;font-size:13.5px;outline:none;transition:border-color .18s,box-shadow .2s,background .18s}
.ff-input::placeholder{color:var(--fg4)}
.ff-input:hover{border-color:var(--line2)}
.ff-input:focus{border-color:rgba(199,184,245,.55);box-shadow:0 0 0 3px rgba(199,184,245,.12);background:rgba(0,0,0,.32)}
.ff-input.ff-has-icon{padding-left:40px}

/* Buttons */
.ff-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;font-weight:650;white-space:nowrap;
  border:1px solid transparent;cursor:pointer;overflow:hidden;isolation:isolate;
  transition:background .18s,border-color .18s,color .18s,transform .18s var(--ease),opacity .18s}
.ff-btn:active:not(:disabled){transform:scale(.98)}
.ff-btn:disabled{opacity:.4;cursor:not-allowed}
.ff-btn-sm{height:30px;padding:0 12px;font-size:12px;border-radius:9px}
.ff-btn-md{height:38px;padding:0 16px;font-size:13px;border-radius:11px}
.ff-btn-lg{height:44px;padding:0 20px;font-size:13.5px;border-radius:12px}
.ff-btn svg{transition:transform .22s var(--ease)}
.ff-btn-primary{background:var(--lime);color:#14150c;box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -2px 0 rgba(0,0,0,.12),0 8px 20px -10px rgba(0,0,0,.8)}
.ff-btn-primary:hover:not(:disabled){background:var(--lime-hi);transform:translateY(-1px)}
.ff-btn-primary:hover:not(:disabled) svg:last-child{transform:translateX(2px)}
.ff-btn-primary::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-130%) skewX(-20deg)}
.ff-btn-primary:hover:not(:disabled)::after{animation:ff-shine .75s ease}
.ff-btn-soft{background:rgba(255,255,255,.06);border-color:var(--line);color:var(--fg)}
.ff-btn-soft:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:var(--line2)}
.ff-btn-ghost{background:transparent;color:var(--fg2)}
.ff-btn-ghost:hover:not(:disabled){background:rgba(255,255,255,.07);color:var(--fg)}
.ff-btn-danger{background:rgba(255,99,71,.1);border-color:rgba(255,99,71,.3);color:#ffa592}
.ff-btn-danger:hover:not(:disabled){background:rgba(255,99,71,.2);border-color:rgba(255,99,71,.5);color:#fff}
.ff-btn-danger-solid{background:#ee5236;color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),inset 0 -2px 0 rgba(0,0,0,.15)}
.ff-btn-danger-solid:hover:not(:disabled){background:var(--tomato);transform:translateY(-1px)}
.ff-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;color:var(--fg3);
  background:transparent;border:1px solid transparent;cursor:pointer;transition:all .16s ease}
.ff-icon-btn:hover{color:var(--fg);background:rgba(255,255,255,.08);border-color:var(--line)}
.ff-icon-btn:active{transform:scale(.92)}

/* Copy */
.ff-copy{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border-radius:8px;font-family:inherit;font-size:11px;font-weight:600;
  color:var(--fg3);background:rgba(255,255,255,.04);border:1px solid var(--line);cursor:pointer;transition:all .18s ease;flex-shrink:0}
.ff-copy:hover{color:var(--fg);border-color:var(--line2)}
.ff-copy.is-done{color:var(--lime);border-color:rgba(200,240,74,.35);background:rgba(200,240,74,.08)}
.ff-code{display:inline-block;max-width:210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle;
  font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11.5px;color:var(--fg2);background:rgba(0,0,0,.3);border:1px solid var(--line);border-radius:7px;padding:3px 8px}

/* Badges / tiles / avatar */
.ff-badge{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 9px;border-radius:999px;font-size:11px;font-weight:600;border:1px solid;white-space:nowrap}
.ff-badge-lime{color:var(--lime);background:rgba(200,240,74,.1);border-color:rgba(200,240,74,.3)}
.ff-badge-lav{color:var(--lav);background:rgba(199,184,245,.1);border-color:rgba(199,184,245,.3)}
.ff-badge-tomato{color:#ff8a70;background:rgba(255,99,71,.1);border-color:rgba(255,99,71,.3)}
.ff-badge-muted{color:var(--fg3);background:rgba(255,255,255,.04);border-color:var(--line)}
.ff-dot{position:relative;width:6px;height:6px;border-radius:99px;background:currentColor;flex-shrink:0}
.ff-dot-live::after{content:"";position:absolute;inset:0;border-radius:inherit;background:currentColor;animation:ff-ring 1.6s var(--ease) infinite}
.ff-tile{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid}
.ff-tile-lime{color:var(--lime);background:rgba(200,240,74,.1);border-color:rgba(200,240,74,.25)}
.ff-tile-lav{color:var(--lav);background:rgba(199,184,245,.1);border-color:rgba(199,184,245,.25)}
.ff-tile-tomato{color:#ff8a70;background:rgba(255,99,71,.1);border-color:rgba(255,99,71,.25)}
.ff-tile-muted{color:var(--fg3);background:rgba(255,255,255,.04);border-color:var(--line)}
.ff-avatar{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:999px;flex-shrink:0;
  font-size:11.5px;font-weight:700;background:var(--lav);color:#16131f}

/* Tabs */
.ff-tabs{position:relative;display:grid;grid-template-columns:1fr 1fr;padding:4px;border-radius:12px;background:rgba(0,0,0,.3);border:1px solid var(--line)}
.ff-tab-ind{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:9px;background:rgba(255,255,255,.08);border:1px solid var(--line2);transition:transform .35s var(--ease)}
.ff-tab{position:relative;z-index:1;height:34px;font-family:inherit;font-size:12.5px;font-weight:600;color:var(--fg3);background:none;border:0;cursor:pointer;transition:color .2s}
.ff-tab[data-on="true"]{color:var(--fg)}

/* Chips */
.ff-chip{display:inline-flex;align-items:center;height:28px;padding:0 11px;border-radius:999px;font-family:inherit;font-size:11.5px;font-weight:600;
  color:var(--fg3);background:transparent;border:1px solid var(--line);cursor:pointer;transition:all .18s ease}
.ff-chip:hover{color:var(--fg);border-color:var(--line2)}
.ff-chip[data-on="true"]{color:#14150c;background:var(--lime);border-color:var(--lime)}
.ff-chip-n{margin-left:6px;opacity:.65;font-variant-numeric:tabular-nums}

/* Progress */
.ff-bar{width:96px;height:3px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden}
.ff-bar > i{display:block;height:100%;border-radius:inherit;background:var(--lime);transition:width 1s linear}

/* Table */
.ff-table-wrap{overflow-x:auto;margin:0 -4px}
.ff-table{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}
.ff-table th{text-align:left;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--fg4);
  padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.ff-table td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.05);color:var(--fg2);vertical-align:middle;white-space:nowrap}
.ff-table tbody tr{transition:background .18s ease;animation:ff-fade-up .4s var(--ease) backwards}
.ff-table tbody tr:hover{background:rgba(255,255,255,.03)}
.ff-table tbody tr:last-child td{border-bottom:0}

/* Rows (super admin lists) */
.ff-row{border-radius:12px;transition:background .18s ease;animation:ff-fade-up .4s var(--ease) backwards}
.ff-row:hover{background:rgba(255,255,255,.035)}

/* Stepper */
.ff-stepper{display:inline-flex;align-items:center;height:32px;border-radius:10px;border:1px solid var(--line);background:rgba(0,0,0,.25);overflow:hidden;transition:border-color .18s,box-shadow .18s}
.ff-stepper:focus-within{border-color:rgba(199,184,245,.55);box-shadow:0 0 0 3px rgba(199,184,245,.12)}
.ff-stepper button{display:flex;align-items:center;justify-content:center;width:28px;height:100%;color:var(--fg3);background:none;border:0;cursor:pointer;transition:all .15s ease}
.ff-stepper button:hover{color:var(--fg);background:rgba(255,255,255,.06)}
.ff-stepper button:active{transform:scale(.9)}
.ff-stepper input{width:48px;height:100%;text-align:center;background:none;border:0;outline:none;color:var(--fg);font:inherit;font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;-moz-appearance:textfield}
.ff-stepper input::-webkit-outer-spin-button,.ff-stepper input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}

/* Alerts, empty states */
.ff-alert{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:12px;font-size:12.5px;line-height:1.5;
  border:1px solid rgba(255,99,71,.3);background:rgba(255,99,71,.08);color:#ffb3a3;animation:ff-fade-up .3s var(--ease) both}
.ff-empty{display:flex;flex-direction:column;align-items:center;text-align:center;padding:36px 16px;border:1px dashed rgba(255,255,255,.1);border-radius:14px;background:rgba(0,0,0,.15)}

/* Modal + toast */
.ff-backdrop{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:20px;
  background:rgba(11,10,14,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:ff-fade .2s ease both}
.ff-modal{width:100%;padding:22px;animation:ff-pop .34s var(--ease) both}
.ff-toast-wrap{position:fixed;right:20px;bottom:20px;z-index:70}
.ff-toast{display:flex;align-items:flex-start;gap:10px;min-width:280px;max-width:380px;padding:10px 8px 10px 10px;border-radius:16px;
  background:rgba(24,23,31,.9);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);border:1px solid var(--line2);
  box-shadow:0 24px 60px -20px rgba(0,0,0,.9);animation:ff-toast-in .42s var(--ease) both}

/* Motion */
.ff-in{animation:ff-fade-up .55s var(--ease) backwards}
.ff-spin{animation:ff-spin .7s linear infinite}
.ff-float{animation:ff-float 7s ease-in-out infinite}
@keyframes ff-fade-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes ff-fade{from{opacity:0}to{opacity:1}}
@keyframes ff-pop{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:none}}
@keyframes ff-toast-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
@keyframes ff-shine{from{transform:translateX(-130%) skewX(-20deg)}to{transform:translateX(260%) skewX(-20deg)}}
@keyframes ff-spin{to{transform:rotate(360deg)}}
@keyframes ff-drift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(40px,30px) scale(1.06)}}
@keyframes ff-ring{0%{transform:scale(.8);opacity:.7}100%{transform:scale(2.4);opacity:0}}
@keyframes ff-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ff-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

@media (prefers-reduced-motion: reduce){
  .ff-root *,.ff-root *::before,.ff-root *::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}
}
`;

/* ------------------------------------------------------------------ */
/* Icons (inline, stroke style)                                        */
/* ------------------------------------------------------------------ */
const ICONS = {
  plus: ["M12 5v14", "M5 12h14"],
  minus: ["M5 12h14"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  copy: [
    "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z",
    "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  ],
  check: ["M20 6 9 17l-5-5"],
  key: ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"],
  alert: ["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  arrow: ["M5 12h14", "M12 5l7 7-7 7"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  users: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  refund: ["M1 4v6h6", "M3.51 15a9 9 0 1 0 2.13-9.36L1 10"],
  x: ["M18 6 6 18", "M6 6l12 12"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  ban: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M4.93 4.93l14.14 14.14"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 16v-4", "M12 8h.01"],
  mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  inbox: [
    "M22 12h-6l-2 3h-4l-2-3H2",
    "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  ],
};

export function Icon({ name, size = 16, className = "", strokeWidth = 2 }) {
  const paths = ICONS[name] || [];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */
export function Shell({ children }) {
  return (
    <div className="ff-root">
      <style>{CSS}</style>
      <div className="ff-aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="ff-grain" aria-hidden />
      {children}
    </div>
  );
}

export function Spinner({ size = 16, className = "" }) {
  return (
    <span
      aria-hidden
      className={`ff-spin inline-block shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        border: `${Math.max(1.5, size / 9)}px solid currentColor`,
        borderTopColor: "transparent",
      }}
    />
  );
}

export function Brand({ tag }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="ff-brand-dot" />
      <span className="ff-fg text-[15px] font-extrabold tracking-[-0.02em]">FluentFox</span>
      {tag && <span className="ff-badge ff-badge-lav">{tag}</span>}
    </div>
  );
}

export function Button({
  variant = "soft",
  size = "md",
  icon,
  iconRight,
  loading = false,
  className = "",
  type = "button",
  children,
  ...props
}) {
  const s = size === "sm" ? 13 : 15;
  return (
    <button
      type={type}
      {...props}
      disabled={props.disabled || loading}
      className={`ff-btn ff-btn-${size} ff-btn-${variant} ${className}`}
    >
      {loading ? <Spinner size={13} /> : icon ? <Icon name={icon} size={s} /> : null}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={s} />}
    </button>
  );
}

export function Field({ label, right, icon, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {(label || right) && (
        <span className="mb-1.5 flex items-center justify-between">
          <span className="ff-fg2 text-[12px] font-semibold">{label}</span>
          {right && <span className="ff-fg4 text-[11px]">{right}</span>}
        </span>
      )}
      <span className="relative block">
        {icon && (
          <span className="ff-fg4 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
            <Icon name={icon} size={15} />
          </span>
        )}
        <input {...props} className={`ff-input ${icon ? "ff-has-icon" : ""}`} />
      </span>
    </label>
  );
}

export function Badge({ tone = "muted", dot = false, live = false, className = "", children }) {
  return (
    <span className={`ff-badge ff-badge-${tone} ${className}`}>
      {(dot || live) && <span className={`ff-dot ${live ? "ff-dot-live" : ""}`} />}
      {children}
    </span>
  );
}

export function Tile({ icon, tone = "lime", size = 36 }) {
  return (
    <span
      className={`ff-tile ff-tile-${tone}`}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.32) }}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </span>
  );
}

export function StatCard({ label, value, icon, tone = "lime", hint, delay = 0 }) {
  return (
    <div className="ff-in" style={{ animationDelay: `${delay}s` }}>
      <div className="ff-glass ff-lift h-full p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="ff-eyebrow">{label}</span>
          <Tile icon={icon} tone={tone} size={30} />
        </div>
        <div className="ff-kpi mt-3">
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </div>
        {hint && <div className="ff-fg4 mt-1.5 text-[11.5px]">{hint}</div>}
      </div>
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <button type="button" onClick={copy} className={`ff-copy ${copied ? "is-done" : ""}`} title="Copy">
      <Icon name={copied ? "check" : "copy"} size={12} />
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

export function Empty({ icon = "inbox", title, text, action }) {
  return (
    <div className="ff-empty">
      <Tile icon={icon} tone="muted" size={40} />
      <div className="ff-fg mt-3 text-[13.5px] font-semibold">{title}</div>
      {text && <p className="ff-fg4 mt-1 max-w-xs text-[12px] leading-relaxed">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Toast({ toast, onClose }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => closeRef.current?.(), 4500);
    return () => clearTimeout(id);
  }, [toast]);

  if (!toast) return null;

  const tone = toast.type === "success" ? "lime" : toast.type === "error" ? "tomato" : "lav";
  const icon = toast.type === "success" ? "check" : toast.type === "error" ? "alert" : "info";

  return (
    <div className="ff-toast-wrap">
      <div key={toast.message} className="ff-toast" role="status">
        <Tile icon={icon} tone={tone} size={28} />
        <p className="ff-fg flex-1 pt-[5px] text-[13px] leading-snug">{toast.message}</p>
        <button type="button" className="ff-icon-btn" onClick={onClose} aria-label="Dismiss">
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, width = 420, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ff-backdrop" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="ff-glass-strong ff-modal"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function LoadingScreen({ text }) {
  return (
    <Shell>
      <div className="flex min-h-screen flex-col items-center justify-center gap-5">
        <div className="ff-in">
          <Brand />
        </div>
        <Spinner size={22} className="ff-lime" />
        <p className="ff-fg3 ff-in text-[12.5px]" style={{ animationDelay: ".1s" }}>
          {text}
        </p>
      </div>
    </Shell>
  );
}