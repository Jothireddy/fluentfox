// UserAuth.jsx — Login/Signup modal using /ff/auth/* routes
// Never touches original users table
// ⚠️ Replace GOOGLE_CLIENT_ID with your real one from Google Cloud Console

import React, { useState, useEffect, useRef } from "react";
import { ffLogin, ffSignup, ffGoogleLogin, ffGetMe, setFFToken, clearFFToken, getFFToken } from "./api3";

// ─── REPLACE WITH YOUR GOOGLE OAUTH CLIENT ID ────────────────────────────────
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";
// ─────────────────────────────────────────────────────────────────────────────

// ─── TOKEN HELPERS (re-exported for App.jsx to use) ──────────────────────────
export function getUserToken() { return getFFToken(); }
export function clearUserToken() { clearFFToken(); }
export async function apiGetMe() { return ffGetMe(); }

// ─── LOAD GOOGLE GSI SCRIPT ───────────────────────────────────────────────────
function loadGoogleScript() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) { resolve(); return; }
    if (document.getElementById("ff-gsi-script")) {
      const iv = setInterval(() => { if (window.google?.accounts?.id) { clearInterval(iv); resolve(); } }, 100);
      return;
    }
    const s = document.createElement("script");
    s.id = "ff-gsi-script";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true; s.onload = resolve;
    document.head.appendChild(s);
  });
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const FF = {
  orange: "#ff4b00",
  dark3: "#18181f",
  border: "rgba(255,255,255,0.09)",
  muted: "rgba(255,255,255,0.42)",
  text: "#f0f0f8",
};

const baseInput = {
  width: "100%", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
  padding: "12px 16px", color: FF.text, fontSize: 14,
  outline: "none", transition: "border 0.2s, box-shadow 0.2s", boxSizing: "border-box",
};

// ─── GOOGLE BUTTON ────────────────────────────────────────────────────────────
function GoogleSignInButton({ onSuccess, onError, disabled }) {
  const containerRef = useRef(null);
  const [gLoaded, setGLoaded] = useState(false);
  const [gError, setGError] = useState("");
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    loadGoogleScript().then(() => {
      if (!window.google?.accounts?.id) { setGError("Google Sign-In unavailable"); return; }
      if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
        setGError("Set GOOGLE_CLIENT_ID in UserAuth.jsx");
        return;
      }
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response.credential) { onError?.("No credential returned"); return; }
            setGLoading(true);
            try {
              const user = await ffGoogleLogin(response.credential);
              onSuccess?.(user);
            } catch (err) {
              onError?.(err.message || "Google login failed");
            } finally {
              setGLoading(false);
            }
          },
        });
        setGLoaded(true);
      } catch { setGError("Failed to init Google Sign-In"); }
    });
  }, []);

  function handleClick() {
    if (!gLoaded || !window.google?.accounts?.id) return;
    window.google.accounts.id.prompt((n) => {
      if (n.isNotDisplayed() || n.isSkippedMoment()) {
        if (containerRef.current) {
          window.google.accounts.id.renderButton(containerRef.current, { type: "standard", theme: "outline", size: "large" });
          containerRef.current.querySelector("div[role=button]")?.click();
        }
      }
    });
  }

  if (gError) return (
    <div style={{ textAlign: "center", fontSize: 11, color: FF.muted, padding: "8px 0" }}>{gError}</div>
  );

  return (
    <div>
      <div ref={containerRef} style={{ display: "none" }} />
      <button
        type="button" onClick={handleClick}
        disabled={disabled || gLoading || !gLoaded}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          padding: "12px 20px", background: "#fff", border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12, fontSize: 13, fontWeight: 700, color: "#1a1a1a",
          cursor: (disabled || gLoading || !gLoaded) ? "not-allowed" : "pointer",
          opacity: (disabled || gLoading || !gLoaded) ? 0.65 : 1,
          transition: "box-shadow 0.15s, transform 0.12s", boxSizing: "border-box",
        }}
        onMouseEnter={e => { if (!disabled && !gLoading) { e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.18)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {gLoading
          ? <div style={{ width: 18, height: 18, border: "2px solid #ddd", borderTopColor: "#4285f4", borderRadius: "50%", animation: "ffGSpin 0.7s linear infinite" }} />
          : (
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
          )
        }
        {gLoading ? "Signing in…" : "Continue with Google"}
      </button>
    </div>
  );
}

function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      <span style={{ fontSize: 11, color: FF.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────
export default function UserAuth({ onSuccess, onClose }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  function reset() { setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setError(""); }
  function switchMode(m) { setMode(m); reset(); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (mode === "signup") {
      if (password !== confirmPassword) { setError("Passwords don't match"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    }
    setLoading(true);
    try {
      const user = mode === "login"
        ? await ffLogin(email, password)
        : await ffSignup(name, email, password);
      onSuccess?.(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inp = (field) => ({
    ...baseInput,
    borderColor: focused === field ? FF.orange : "rgba(255,255,255,0.12)",
    boxShadow: focused === field ? `0 0 0 3px ${FF.orange}22` : "none",
  });

  return (
    <>
      <style>{`
        @keyframes ffModalIn { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes ffOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes ffGSpin { to{transform:rotate(360deg)} }
        .ffai::placeholder{color:rgba(255,255,255,.22)}
        .ffai:focus{border-color:#ff4b00!important;box-shadow:0 0 0 3px rgba(255,75,0,.18)!important;outline:none}
        .fftab{background:none;border:none;cursor:pointer;transition:all .18s}
        .fftab:hover{color:#fff!important}
        .ffsbtn{width:100%;padding:13px;border:none;border-radius:12px;background:#ff4b00;color:#fff;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:background .18s,transform .12s}
        .ffsbtn:hover:not(:disabled){background:#e04200;transform:translateY(-1px)}
        .ffsbtn:disabled{opacity:.55;cursor:not-allowed}
      `}</style>

      {/* Overlay */}
      <div onClick={onClose} style={{
        position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(6px)",
        zIndex:900,animation:"ffOverlayIn .2s ease",
        display:"flex",alignItems:"center",justifyContent:"center",padding:20,
      }}>
        {/* Modal */}
        <div onClick={e => e.stopPropagation()} style={{
          width:"100%",maxWidth:430,background:FF.dark3,border:`1px solid ${FF.border}`,
          borderRadius:24,boxShadow:"0 40px 100px rgba(0,0,0,.7)",
          animation:"ffModalIn .3s cubic-bezier(.34,1.56,.64,1)",
          overflow:"hidden",maxHeight:"90vh",overflowY:"auto",
        }}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#ff4b00dd,#ff7a24cc)", padding:"22px 28px 18px", position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>🦊</div>
              <div>
                <p style={{ margin:0,fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.7)" }}>FluentFox</p>
                <p style={{ margin:0,fontSize:16,fontWeight:900,color:"#fff" }}>{mode==="login"?"Welcome back":"Get started"}</p>
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display:"inline-flex",background:"rgba(0,0,0,.25)",borderRadius:999,padding:3,gap:2 }}>
              {[["login","Sign In"],["signup","Create Account"]].map(([m,label]) => (
                <button key={m} className="fftab" onClick={() => switchMode(m)} style={{
                  padding:"6px 14px",borderRadius:999,fontSize:11,fontWeight:700,
                  letterSpacing:".1em",textTransform:"uppercase",
                  background:mode===m?"#fff":"transparent",
                  color:mode===m?FF.orange:"rgba(255,255,255,.7)",
                }}>{label}</button>
              ))}
            </div>
            {onClose && (
              <button onClick={onClose} style={{
                position:"absolute",top:14,right:14,background:"rgba(0,0,0,.25)",border:"none",
                borderRadius:999,width:28,height:28,color:"#fff",fontSize:14,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>✕</button>
            )}
          </div>

          {/* Body */}
          <div style={{ padding:"22px 28px 28px",display:"flex",flexDirection:"column",gap:14 }}>
            <GoogleSignInButton
              onSuccess={user => onSuccess?.(user)}
              onError={msg => setError(msg || "Google sign-in failed")}
              disabled={loading}
            />
            <OrDivider />

            <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:13 }}>
              {mode==="signup" && (
                <div>
                  <label style={{ display:"block",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:FF.muted,marginBottom:7 }}>Full Name</label>
                  <input className="ffai" style={inp("name")} type="text" value={name} placeholder="Your name"
                    onChange={e=>setName(e.target.value)} onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} required />
                </div>
              )}
              <div>
                <label style={{ display:"block",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:FF.muted,marginBottom:7 }}>Email</label>
                <input className="ffai" style={inp("email")} type="email" value={email} placeholder="you@email.com"
                  onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} required />
              </div>
              <div>
                <label style={{ display:"block",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:FF.muted,marginBottom:7 }}>Password</label>
                <input className="ffai" style={inp("password")} type="password" value={password} placeholder="••••••••"
                  onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocused("password")} onBlur={()=>setFocused(null)} required />
              </div>
              {mode==="signup" && (
                <div>
                  <label style={{ display:"block",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:FF.muted,marginBottom:7 }}>Confirm Password</label>
                  <input className="ffai" style={inp("confirm")} type="password" value={confirmPassword} placeholder="••••••••"
                    onChange={e=>setConfirmPassword(e.target.value)} onFocus={()=>setFocused("confirm")} onBlur={()=>setFocused(null)} required />
                </div>
              )}
              {error && (
                <div style={{ background:"rgba(192,57,43,.15)",border:"1px solid rgba(192,57,43,.4)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#ff6b6b" }}>
                  {error}
                </div>
              )}
              <button className="ffsbtn" type="submit" disabled={loading} style={{ marginTop:2 }}>
                {loading
                  ? (mode==="login"?"Signing in…":"Creating account…")
                  : (mode==="login"?"Sign In with Email →":"Create Account →")
                }
              </button>
            </form>

            <p style={{ textAlign:"center",fontSize:11,color:FF.muted,margin:0 }}>
              {mode==="login"?"No account? ":"Already have one? "}
              <button className="fftab" onClick={() => switchMode(mode==="login"?"signup":"login")}
                style={{ color:FF.orange,fontWeight:700,fontSize:11,padding:0 }}>
                {mode==="login"?"Create one free":"Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}