// UserAuth.jsx — Login/Signup modal
// ⚠️ Replace GOOGLE_CLIENT_ID with your real one from Google Cloud Console

import React, { useState, useEffect, useRef } from "react";
import { ffLogin, ffSignup, ffGoogleLogin, ffGetMe, setFFToken, clearFFToken, getFFToken } from "./api3";

// ─── REPLACE THIS ─────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";
// ─────────────────────────────────────────────────────────────────────────────

export function getUserToken()  { return getFFToken(); }
export function clearUserToken(){ clearFFToken(); }
export async function apiGetMe(){ return ffGetMe(); }

/* ─── load Google GSI script once ─── */
function loadGoogleScript() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) { resolve(); return; }
    if (document.getElementById("ff-gsi")) {
      const iv = setInterval(() => { if (window.google?.accounts?.id) { clearInterval(iv); resolve(); } }, 100);
      return;
    }
    const s = document.createElement("script");
    s.id = "ff-gsi"; s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true; s.onload = resolve;
    document.head.appendChild(s);
  });
}

/* ─── design tokens ─── */
const C = {
  orange:      "#ff4b00",
  orangeSoft:  "rgba(255,75,0,0.07)",
  text:        "#111827",
  textMid:     "#374151",
  textMuted:   "#6b7280",
  textFaint:   "#9ca3af",
  border:      "#e5e7eb",
  borderFocus: "#ff4b00",
  bg:          "#f9fafb",
  surface:     "#ffffff",
  red:         "#dc2626",
  redSoft:     "#fef2f2",
  redBorder:   "#fca5a5",
};

/* ─── Google button ─── */
function GoogleBtn({ onSuccess, onError, disabled }) {
  const ref = useRef(null);
  const [ready, setReady]   = useState(false);
  const [busy, setBusy]     = useState(false);
  const [gErr, setGErr]     = useState("");

  useEffect(() => {
    loadGoogleScript().then(() => {
      if (!window.google?.accounts?.id) { setGErr("Google Sign-In unavailable"); return; }
      if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
        setGErr("Set GOOGLE_CLIENT_ID in UserAuth.jsx"); return;
      }
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (res) => {
            if (!res.credential) { onError?.("No credential returned"); return; }
            setBusy(true);
            try   { onSuccess?.(await ffGoogleLogin(res.credential)); }
            catch (e) { onError?.(e.message || "Google login failed"); }
            finally   { setBusy(false); }
          },
        });
        setReady(true);
      } catch { setGErr("Failed to init Google Sign-In"); }
    });
  }, []);

  function handleClick() {
    if (!ready || !window.google?.accounts?.id) return;
    window.google.accounts.id.prompt(n => {
      if ((n.isNotDisplayed() || n.isSkippedMoment()) && ref.current) {
        window.google.accounts.id.renderButton(ref.current, { type:"standard", theme:"outline", size:"large" });
        ref.current.querySelector("div[role=button]")?.click();
      }
    });
  }

  if (gErr) return (
    <p style={{ textAlign:"center", fontSize:12, color:C.textFaint, padding:"6px 0" }}>{gErr}</p>
  );

  const off = disabled || busy || !ready;
  return (
    <>
      <div ref={ref} style={{ display:"none" }} />
      <button type="button" onClick={handleClick} disabled={off}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          padding:"11px 20px", background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:9, fontSize:13, fontWeight:600, color:C.text,
          cursor: off ? "not-allowed" : "pointer", opacity: off ? .6 : 1,
          transition:"all .14s ease", fontFamily:"inherit" }}
        onMouseEnter={e=>{ if(!off){ e.currentTarget.style.borderColor="#d1d5db"; e.currentTarget.style.background="#f9fafb"; }}}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface; }}>
        {busy ? (
          <span style={{ width:17, height:17, border:"2px solid #e5e7eb",
            borderTopColor:"#4285f4", borderRadius:"50%", animation:"spin .7s linear infinite",
            display:"inline-block" }} />
        ) : (
          <svg width="17" height="17" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </g>
          </svg>
        )}
        {busy ? "Signing in…" : "Continue with Google"}
      </button>
    </>
  );
}

/* ─── divider ─── */
function Divider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ flex:1, height:1, background:C.border }} />
      <span style={{ fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:".08em", textTransform:"uppercase" }}>or</span>
      <div style={{ flex:1, height:1, background:C.border }} />
    </div>
  );
}

/* ─── input field ─── */
function Input({ label, type="text", value, onChange, placeholder, required, autoFocus }) {
  const [focused, setFocus] = useState(false);
  return (
    <div>
      <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em",
        textTransform:"uppercase", color:C.textMuted, marginBottom:6 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        required={required} autoFocus={autoFocus}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ width:"100%", background:C.surface, border:`1px solid ${focused ? C.borderFocus : C.border}`,
          borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14,
          outline: focused ? `2px solid ${C.orange}22` : "none",
          outlineOffset:1, transition:"border-color .15s, outline .15s",
          boxSizing:"border-box", fontFamily:"inherit" }} />
    </div>
  );
}

/* ─── main modal ─── */
export default function UserAuth({ onSuccess, onClose }) {
  const [mode, setMode]     = useState("login");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [pw, setPw]         = useState("");
  const [pw2, setPw2]       = useState("");
  const [err, setErr]       = useState("");
  const [loading, setLoad]  = useState(false);

  function reset() { setName(""); setEmail(""); setPw(""); setPw2(""); setErr(""); }
  function switchMode(m) { setMode(m); reset(); }

  async function handleSubmit(e) {
    e.preventDefault(); setErr("");
    if (mode === "signup") {
      if (pw !== pw2)   { setErr("Passwords don't match."); return; }
      if (pw.length < 6){ setErr("Password must be at least 6 characters."); return; }
    }
    setLoad(true);
    try {
      const user = mode === "login"
        ? await ffLogin(email, pw)
        : await ffSignup(name, email, pw);
      onSuccess?.(user);
    } catch(e) { setErr(e.message || "Something went wrong."); }
    finally    { setLoad(false); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn   { from{opacity:0;transform:translateY(18px) scale(.98)} to{opacity:1;transform:none} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        .ff-auth input::placeholder{color:#d1d5db;}
        .ff-auth button:focus-visible{outline:2px solid #ff4b00;outline-offset:2px;}
      `}</style>

      {/* Overlay */}
      <div onClick={onClose}
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.48)",
          backdropFilter:"blur(8px)", zIndex:900, display:"flex",
          alignItems:"center", justifyContent:"center", padding:16,
          animation:"overlayIn .2s ease", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Card */}
        <div className="ff-auth" onClick={e => e.stopPropagation()}
          style={{ width:"100%", maxWidth:420, background:C.surface,
            border:`1px solid ${C.border}`, borderRadius:18,
            boxShadow:"0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.06)",
            animation:"modalIn .28s cubic-bezier(.34,1.4,.64,1)",
            overflow:"hidden", maxHeight:"90vh", overflowY:"auto" }}>

          {/* Top bar — logo + close */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"20px 24px 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <img src="/company_logo.webp" alt="FluentFox"
                onError={e => { e.currentTarget.style.display="none"; }}
                style={{ width:28, height:28, objectFit:"contain", flexShrink:0 }} />
              <span style={{ fontSize:13, fontWeight:900, color:C.text, letterSpacing:".04em" }}>FluentFox</span>
            </div>
            {onClose && (
              <button onClick={onClose}
                style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:7,
                  width:30, height:30, cursor:"pointer", fontSize:14, color:C.textMuted,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .13s ease", fontFamily:"inherit" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.bg; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=C.textMuted; }}>
                ✕
              </button>
            )}
          </div>

          {/* Heading */}
          <div style={{ padding:"18px 24px 0" }}>
            <h2 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.text,
              fontFamily:"'Fraunces',serif", lineHeight:1.1 }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ margin:"0 0 20px", fontSize:13, color:C.textMuted, lineHeight:1.6 }}>
              {mode === "login"
                ? "Sign in to access your credits and sessions."
                : "Get started — it takes less than a minute."}
            </p>

            {/* Tab switcher */}
            <div style={{ display:"inline-flex", background:C.bg, border:`1px solid ${C.border}`,
              borderRadius:9, padding:3, gap:2, marginBottom:20 }}>
              {[["login","Sign in"],["signup","Create account"]].map(([m,label]) => (
                <button key={m} onClick={() => switchMode(m)}
                  style={{ padding:"7px 14px", borderRadius:7, border:"none", fontSize:12,
                    fontWeight:700, letterSpacing:".05em", textTransform:"uppercase",
                    cursor:"pointer", transition:"all .15s ease", fontFamily:"inherit",
                    background: mode===m ? C.surface : "transparent",
                    color: mode===m ? C.text : C.textFaint,
                    boxShadow: mode===m ? "0 1px 4px rgba(0,0,0,.08)" : "none" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding:"0 24px 28px", display:"flex", flexDirection:"column", gap:14 }}>

            {/* Google */}
            <GoogleBtn
              onSuccess={u => onSuccess?.(u)}
              onError={m => setErr(m || "Google sign-in failed.")}
              disabled={loading} />

            <Divider />

            {/* Email form */}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {mode === "signup" && (
                <Input label="Full name" value={name} onChange={e=>setName(e.target.value)}
                  placeholder="Your name" required autoFocus />
              )}
              <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@email.com" required autoFocus={mode==="login"} />
              <Input label="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)}
                placeholder="••••••••" required />
              {mode === "signup" && (
                <Input label="Confirm password" type="password" value={pw2} onChange={e=>setPw2(e.target.value)}
                  placeholder="••••••••" required />
              )}

              {/* Error */}
              {err && (
                <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:C.redSoft,
                  border:`1px solid ${C.redBorder}`, borderRadius:8, padding:"10px 14px",
                  fontSize:13, color:"#991b1b", lineHeight:1.55 }}>
                  <span style={{ fontWeight:700, flexShrink:0 }}>✕</span>
                  <span>{err}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{ width:"100%", padding:"12px", borderRadius:9, border:"none",
                  background:C.orange, color:"#fff", fontSize:13, fontWeight:800,
                  letterSpacing:".07em", textTransform:"uppercase", cursor: loading ? "not-allowed":"pointer",
                  opacity: loading ? .65 : 1, display:"flex", alignItems:"center",
                  justifyContent:"center", gap:8, transition:"all .15s ease",
                  fontFamily:"inherit", marginTop:2 }}
                onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.background="#e04200"; e.currentTarget.style.transform="translateY(-1px)"; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.orange; e.currentTarget.style.transform="none"; }}>
                {loading ? (
                  <span style={{ width:15, height:15, border:"2px solid rgba(255,255,255,.35)",
                    borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite",
                    display:"inline-block" }} />
                ) : null}
                {loading
                  ? (mode==="login" ? "Signing in…" : "Creating account…")
                  : (mode==="login" ? "Sign in with email" : "Create account")}
              </button>
            </form>

            {/* Switch mode link */}
            <p style={{ textAlign:"center", fontSize:12, color:C.textMuted, margin:0 }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => switchMode(mode==="login"?"signup":"login")}
                style={{ background:"none", border:"none", cursor:"pointer", color:C.orange,
                  fontWeight:700, fontSize:12, padding:0, fontFamily:"inherit" }}>
                {mode === "login" ? "Create one free" : "Sign in"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}