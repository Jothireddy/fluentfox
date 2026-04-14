// UserDashboard.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ffGetMe, ffLogout, fetchActivePlans, testAddCredits,
  generateUserKey, fetchMyKeys,
  fetchMyPaymentHistory, joinAffiliate, fetchMyAffiliateStats,
  fetchMyReferrals, createPaymentOrder, verifyPayment,
} from "./api3";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  orange:      "#ff4b00",
  orangeSoft:  "rgba(255,75,0,0.08)",
  orangeBorder:"rgba(255,75,0,0.18)",
  green:       "#16a34a",
  greenSoft:   "rgba(22,163,74,0.08)",
  blue:        "#2563eb",
  blueSoft:    "rgba(37,99,235,0.08)",
  yellow:      "#d97706",
  yellowSoft:  "rgba(217,119,6,0.08)",
  red:         "#dc2626",
  bg:          "#f9fafb",
  surface:     "#ffffff",
  border:      "#e5e7eb",
  borderStrong:"#d1d5db",
  text:        "#111827",
  textMid:     "#374151",
  textMuted:   "#6b7280",
  textFaint:   "#9ca3af",
};

const TABS = [
  { id: "overview",  label: "Overview",       icon: "◈" },
  { id: "credits",   label: "Credits & Plans", icon: "◎" },
  { id: "keys",      label: "Interview Keys",  icon: "⌥" },
  { id: "payments",  label: "Payments",        icon: "↻" },
  { id: "affiliate", label: "Affiliate",       icon: "⟐" },
];

/* ─────────────────────────────────────────────
   FALLBACK & HELPERS
───────────────────────────────────────────── */
const FALLBACK_PLANS = [
  { id:"starter", name:"Starter", description:"Perfect for one interview", price_inr:299, credits:5,  popular:false, active:true },
  { id:"pro",     name:"Pro",     description:"Best for active job seekers", price_inr:799, credits:20, popular:true,  active:true },
  { id:"team",    name:"Team",    description:"Bulk sessions for groups", price_inr:1499, credits:50, popular:false, active:true },
];

function isActiveKey(k) {
  if (!k) return false;
  const exp = k.expires_at ? new Date(k.expires_at) : null;
  return !k.used && !k.revoked && (!exp || exp > new Date());
}

function money(v) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

function timeLeft(expiresAt) {
  if (!expiresAt) return "";
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  for (const key of ["plans","payments","keys","referrals","data"]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

function normalizePlan(p, i = 0) {
  return {
    id:          p.id || p._id || `plan-${i}`,
    name:        p.name || p.title || `Plan ${i+1}`,
    description: p.description || p.desc || "A flexible plan for interview access.",
    price_inr:   p.price_inr ?? p.price ?? p.amount_inr ?? p.amount ?? null,
    credits:     p.credits ?? p.sessions ?? 1,
    popular:     Boolean(p.popular || p.is_popular || p.featured || i === 1),
    active:      p.active !== false,
  };
}

/* ─────────────────────────────────────────────
   PRIMITIVE COMPONENTS
───────────────────────────────────────────── */
function Spinner({ size = 16, color = C.orange }) {
  return (
    <span style={{ width:size, height:size, border:`2px solid rgba(0,0,0,0.08)`,
      borderTopColor:color, borderRadius:"50%", animation:"spin .7s linear infinite",
      display:"inline-block", flexShrink:0 }} />
  );
}

function Tag({ children, color = C.orange, bg }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:700,
      letterSpacing:".1em", textTransform:"uppercase", color,
      background: bg || `${color}14`, borderRadius:6,
      padding:"3px 8px", whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant="primary", disabled, loading, fullWidth, size="md" }) {
  const styles = {
    primary: { bg: C.orange,  color:"#fff", border:"none" },
    ghost:   { bg:"transparent", color:C.textMid, border:`1px solid ${C.border}` },
    danger:  { bg:"transparent", color:C.red,  border:`1px solid rgba(220,38,38,.25)` },
    green:   { bg: C.green,   color:"#fff", border:"none" },
  };
  const s = styles[variant] || styles.primary;
  const pad = size === "sm" ? "7px 14px" : "10px 20px";
  const fs  = size === "sm" ? 11 : 12;
  return (
    <button onClick={onClick} disabled={disabled||loading}
      style={{ padding:pad, borderRadius:8, border:s.border, background:s.bg, color:s.color,
        fontSize:fs, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase",
        cursor:disabled||loading?"not-allowed":"pointer", opacity:disabled||loading?.6:1,
        width:fullWidth?"100%":undefined, display:"inline-flex", alignItems:"center",
        justifyContent:"center", gap:7, transition:"all .14s ease", whiteSpace:"nowrap",
        fontFamily:"inherit" }}
      onMouseEnter={e=>{ if(!disabled&&!loading){ e.currentTarget.style.opacity=".82"; e.currentTarget.style.transform="translateY(-1px)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="none"; }}>
      {loading && <Spinner size={13} color={variant==="primary"?"#fff":C.orange} />}
      {children}
    </button>
  );
}

function Notice({ type="error", children, onClose }) {
  const map = {
    error:   { bg:"#fef2f2", border:"#fca5a5", color:"#991b1b", icon:"✕" },
    success: { bg:"#f0fdf4", border:"#86efac", color:"#166534", icon:"✓" },
    info:    { bg:"#eff6ff", border:"#93c5fd", color:"#1d4ed8", icon:"ℹ" },
  };
  const t = map[type] || map.error;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:t.bg,
      border:`1px solid ${t.border}`, borderRadius:10, padding:"12px 14px",
      fontSize:13, color:t.color, marginBottom:16, lineHeight:1.55 }}>
      <span style={{ fontWeight:900, flexShrink:0, marginTop:1 }}>{t.icon}</span>
      <span style={{ flex:1 }}>{children}</span>
      {onClose && <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer",
        color:t.color, fontSize:14, padding:0, lineHeight:1, opacity:.6 }}>✕</button>}
    </div>
  );
}

function StatBox({ label, value, sub, color = C.orange }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
      padding:"18px 20px", borderLeft:`3px solid ${color}` }}>
      <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, letterSpacing:".1em",
        textTransform:"uppercase", color:C.textFaint }}>{label}</p>
      <p style={{ margin:0, fontSize:26, fontWeight:900, color:C.text, lineHeight:1 }}>{value}</p>
      {sub && <p style={{ margin:"5px 0 0", fontSize:12, color:C.textMuted }}>{sub}</p>}
    </div>
  );
}

function Empty({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign:"center", padding:"40px 20px", background:C.surface,
      border:`1px solid ${C.border}`, borderRadius:12 }}>
      <div style={{ fontSize:36, marginBottom:10 }}>{icon}</div>
      <p style={{ margin:"0 0 4px", fontSize:14, fontWeight:700, color:C.text }}>{title}</p>
      {sub  && <p style={{ margin:"0 0 16px", fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{sub}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

function Row({ children, style={} }) {
  return <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", ...style }}>{children}</div>;
}

function Divider({ margin = "20px 0" }) {
  return <div style={{ height:1, background:C.border, margin }} />;
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
      gap:12, marginBottom:20, flexWrap:"wrap" }}>
      <div>
        <h2 style={{ margin:0, fontSize:20, fontWeight:900, color:C.text,
          fontFamily:"'Fraunces',serif", lineHeight:1.1 }}>{title}</h2>
        {sub && <p style={{ margin:"5px 0 0", fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW TAB
───────────────────────────────────────────── */
function OverviewTab({ user, metrics, onTab, lastPayment, lastKey, affiliate }) {
  const credits = Number(user?.credits ?? 0);
  return (
    <div>
      {/* Welcome strip */}
      <div style={{ background:`linear-gradient(120deg,${C.orange},#ff7a24)`,
        borderRadius:14, padding:"24px 28px", marginBottom:20, color:"#fff",
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:160, height:160,
          borderRadius:"50%", background:"rgba(255,255,255,.07)", pointerEvents:"none" }} />
        <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:700, letterSpacing:".14em",
          textTransform:"uppercase", opacity:.75 }}>Welcome back</p>
        <h2 style={{ margin:"0 0 4px", fontSize:28, fontWeight:900,
          fontFamily:"'Fraunces',serif", lineHeight:1.05 }}>{user?.name || "User"}</h2>
        <p style={{ margin:"0 0 16px", fontSize:13, opacity:.8 }}>{user?.email}</p>
        <Row>
          <Tag color="#fff" bg="rgba(255,255,255,.18)">{credits} credits</Tag>
          <Tag color="#fff" bg="rgba(255,255,255,.18)">{user?.role || "USER"}</Tag>
          {affiliate?.code && <Tag color="#fff" bg="rgba(255,255,255,.18)">Affiliate active</Tag>}
        </Row>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatBox label="Credits" value={metrics.credits} sub="1 credit = 1 session" color={C.orange} />
        <StatBox label="Active keys" value={metrics.activeKeys} sub="Ready to use" color={C.green} />
        <StatBox label="Payments" value={metrics.payments} sub="Successful" color={C.blue} />
        <StatBox label="Affiliate earned" value={money(metrics.affiliateEarned)} sub={affiliate?.code ? `${affiliate.commission_percent||0}% commission` : "Join to earn"} color={C.yellow} />
      </div>

      {/* Quick nav */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {/* Latest payment */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
          <Row style={{ marginBottom:14, justifyContent:"space-between" }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.text }}>Latest payment</p>
            <Btn onClick={() => onTab("payments")} variant="ghost" size="sm">View all</Btn>
          </Row>
          {lastPayment ? (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <p style={{ margin:"0 0 3px", fontSize:13, fontWeight:700, color:C.text }}>{lastPayment.plan_name || "Plan"}</p>
                <p style={{ margin:0, fontSize:12, color:C.textMuted }}>{formatDate(lastPayment.created_at)}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ margin:"0 0 3px", fontSize:15, fontWeight:900, color:C.text }}>{money(lastPayment.amount_inr)}</p>
                <Tag color={C.green}>+{lastPayment.credits_added||0} credits</Tag>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"16px 0" }}>
              <p style={{ margin:"0 0 10px", fontSize:13, color:C.textMuted }}>No payments yet.</p>
              <Btn onClick={() => onTab("credits")} size="sm">Buy credits</Btn>
            </div>
          )}
        </div>

        {/* Latest key */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
          <Row style={{ marginBottom:14, justifyContent:"space-between" }}>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:C.text }}>Latest key</p>
            <Btn onClick={() => onTab("keys")} variant="ghost" size="sm">View all</Btn>
          </Row>
          {lastKey ? (
            <div>
              <Tag color={isActiveKey(lastKey) ? C.green : C.textFaint} style={{ marginBottom:8 }}>
                {isActiveKey(lastKey) ? "Active" : "Inactive"}
              </Tag>
              <p style={{ margin:"8px 0 4px", fontSize:13, fontWeight:700, color:C.text,
                letterSpacing:".06em", fontFamily:"monospace", wordBreak:"break-all" }}>{lastKey.key}</p>
              <p style={{ margin:0, fontSize:12, color:C.textMuted }}>
                Expires {formatDate(lastKey.expires_at)}
                {isActiveKey(lastKey) && ` · ${timeLeft(lastKey.expires_at)}`}
              </p>
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"16px 0" }}>
              <p style={{ margin:"0 0 10px", fontSize:13, color:C.textMuted }}>No keys generated yet.</p>
              <Btn onClick={() => onTab("keys")} size="sm">Generate key</Btn>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
        <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:C.text }}>Quick actions</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[
            { label:"Buy credits",      sub:"Add sessions to your account",  tab:"credits",   icon:"◎" },
            { label:"Generate key",     sub:"Start a live interview session", tab:"keys",      icon:"⌥" },
            { label:"Affiliate program",sub:"Earn from referrals",            tab:"affiliate", icon:"⟐" },
          ].map(a => (
            <button key={a.tab} onClick={() => onTab(a.tab)}
              style={{ border:`1px solid ${C.border}`, background:C.bg, borderRadius:10,
                padding:"14px 16px", textAlign:"left", cursor:"pointer",
                transition:"border-color .15s, background .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.background="#fff"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg; }}>
              <p style={{ margin:"0 0 4px", fontSize:16 }}>{a.icon}</p>
              <p style={{ margin:"0 0 3px", fontSize:13, fontWeight:700, color:C.text }}>{a.label}</p>
              <p style={{ margin:0, fontSize:12, color:C.textMuted }}>{a.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CREDITS TAB
───────────────────────────────────────────── */
function CreditsTab({ user, onRefresh, onTab }) {
  const [plans, setPlans]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [buying, setBuying] = useState(null);
  const [msg, setMsg]       = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await fetchActivePlans();
        const list = normalizeList(data).map(normalizePlan).filter(p => p.active !== false);
        if (live) setPlans(list.length ? list : FALLBACK_PLANS);
      } catch { if (live) setPlans(FALLBACK_PLANS); }
      finally   { if (live) setLoad(false); }
    })();
    return () => { live = false; };
  }, []);

  async function buyPlan(plan) {
    setBuying(plan.id); setMsg(null);
    const isTest = false;
    if (isTest) {
      try {
        const r = await testAddCredits(plan.id);
        setMsg({ type:"success", text:`${r?.credits_added ?? plan.credits} credits added. Balance: ${r?.credits_balance ?? "—"}.` });
        onRefresh?.();
      } catch(e) { setMsg({ type:"error", text:e.message||"Failed." }); }
      finally    { setBuying(null); }
      return;
    }
    try {
      const order = await createPaymentOrder(plan.id);
      if (order.free_order) {
        setMsg({ type:"success", text:`Free plan applied! ${order.credits_added} credits added.` });
        onRefresh?.(); setBuying(null); return;
      }
      await new Promise((res, rej) => {
        const rzp = new window.Razorpay({
          key:order.key_id, amount:order.amount, currency:order.currency||"INR",
          order_id:order.order_id, name:"FluentFox",
          description:`${plan.name} — ${plan.credits} session${plan.credits>1?"s":""}`,
          handler: async (rsp) => {
            try {
              let result = await verifyPayment(rsp.razorpay_order_id, rsp.razorpay_payment_id, rsp.razorpay_signature);
              if (result?.retry) {
                await new Promise(r=>setTimeout(r,2500));
                result = await verifyPayment(rsp.razorpay_order_id, rsp.razorpay_payment_id, rsp.razorpay_signature);
              }
              setMsg({ type:"success", text:`Payment done! ${result.credits_added} credits added. Balance: ${result.credits_balance}.` });
              onRefresh?.(); res();
            } catch(e) { setMsg({ type:"error", text:e.message||"Verification failed. Contact support." }); rej(e); }
          },
          modal:{ ondismiss:() => { setMsg({ type:"info", text:"Payment cancelled." }); res(); }},
          prefill:{ email:user?.email||"", name:user?.name||"" },
          theme:{ color:"#ff4b00" },
        });
        rzp.open();
      });
    } catch(e) { setMsg({ type:"error", text:e.message||"Failed to initiate payment." }); }
    finally    { setBuying(null); }
  }

  const sorted = [...plans].sort((a,b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return  1;
    return Number(a.price_inr||0) - Number(b.price_inr||0);
  });

  return (
    <div>
      <SectionHead title="Credits & Plans" sub="Buy session credits. 1 credit = 1 live interview session."
        action={<Btn onClick={()=>onTab("keys")} variant="ghost" size="sm">My keys →</Btn>} />

      {/* Balance card */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
        padding:24, marginBottom:20, display:"flex", alignItems:"center",
        justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
        <div>
          <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:700, letterSpacing:".1em",
            textTransform:"uppercase", color:C.textFaint }}>Your balance</p>
          <p style={{ margin:0, fontSize:48, fontWeight:900, color:C.orange, lineHeight:1 }}>
            {user?.credits ?? 0}
            <span style={{ fontSize:16, fontWeight:600, color:C.textMuted, marginLeft:8 }}>credits</span>
          </p>
        </div>
        <Btn onClick={() => onTab("keys")} size="sm">Generate session key</Btn>
      </div>

      {msg && <Notice type={msg.type} onClose={()=>setMsg(null)}>{msg.text}</Notice>}

      <p style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:C.text }}>Choose a plan</p>

      {loading ? (
        <div style={{ textAlign:"center", padding:40 }}><Spinner size={28} /></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {sorted.map((plan, i) => {
            const pop = plan.popular;
            const per = plan.credits > 1 ? Math.round(Number(plan.price_inr)/plan.credits) : null;
            return (
              <div key={plan.id} style={{
                background: pop ? C.text : C.surface,
                border: pop ? `2px solid ${C.text}` : `1px solid ${C.border}`,
                borderRadius:14, padding:24, position:"relative",
                display:"flex", flexDirection:"column",
                boxShadow: pop ? "0 20px 40px rgba(0,0,0,.14)" : "none",
              }}>
                {pop && (
                  <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
                    background:C.orange, color:"#fff", fontSize:9, fontWeight:800,
                    letterSpacing:".12em", textTransform:"uppercase",
                    padding:"4px 12px", borderRadius:999, whiteSpace:"nowrap" }}>
                    Most popular
                  </div>
                )}

                <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:800, letterSpacing:".12em",
                  textTransform:"uppercase", color: pop?"rgba(255,255,255,.5)":C.textFaint }}>{plan.name}</p>

                <div style={{ display:"flex", alignItems:"baseline", gap:4, margin:"8px 0 4px" }}>
                  <span style={{ fontFamily:"'Fraunces',serif", fontSize:40, fontWeight:900, lineHeight:1,
                    color: pop?"#fff":C.text }}>₹{Number(plan.price_inr).toLocaleString("en-IN")}</span>
                </div>

                {per && <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700,
                  color: pop?"rgba(255,255,255,.55)":C.textMuted }}>₹{per} per session</p>}

                <p style={{ margin:"0 0 16px", fontSize:13, lineHeight:1.65, flex:1,
                  color: pop?"rgba(255,255,255,.72)":C.textMuted }}>{plan.description}</p>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18 }}>
                  {[`${plan.credits} session${plan.credits>1?"s":""}`, "Instant access", "Private audio"].map(f => (
                    <span key={f} style={{ fontSize:11, fontWeight:600,
                      color: pop?"rgba(255,255,255,.6)":C.textMuted,
                      background: pop?"rgba(255,255,255,.08)":"#f3f4f6",
                      border: pop?"1px solid rgba(255,255,255,.1)":"1px solid #e5e7eb",
                      padding:"5px 10px", borderRadius:6 }}>{f}</span>
                  ))}
                </div>

                <Btn onClick={() => buyPlan(plan)} variant={pop ? "primary" : "ghost"}
                  loading={buying===plan.id} fullWidth>
                  {buying===plan.id ? "Processing…" : "Buy now"}
                </Btn>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ margin:"16px 0 0", fontSize:12, color:C.textFaint, textAlign:"center" }}>
        Payments via Razorpay · Credits added instantly · No subscriptions
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   KEYS TAB
───────────────────────────────────────────── */
function KeysTab({ user, onRefresh, onTab }) {
  const [keys, setKeys]           = useState([]);
  const [loading, setLoad]        = useState(true);
  const [generating, setGen]      = useState(false);
  const [newKey, setNewKey]       = useState(null);
  const [copied, setCopied]       = useState(null);
  const [msg, setMsg]             = useState(null);

  const loadKeys = useCallback(async () => {
    try { setLoad(true); const r = await fetchMyKeys(); setKeys(normalizeList(r)); }
    catch(e) { setMsg({ type:"error", text:e.message||"Could not load keys." }); }
    finally  { setLoad(false); }
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  async function handleGenerate() {
    if ((user?.credits ?? 0) < 1) {
      setMsg({ type:"error", text:"No credits left. Buy a plan first." }); return;
    }
    setGen(true); setMsg(null); setNewKey(null);
    try {
      const r = await generateUserKey();
      setNewKey(r); if (!r?.reused) onRefresh?.();
      await loadKeys();
    } catch(e) {
      setMsg({ type:"error", text:e.message||"Failed to generate key." });
    } finally { setGen(false); }
  }

  async function copy(k, id) {
    await navigator.clipboard.writeText(k);
    setCopied(id); setTimeout(() => setCopied(null), 1600);
  }

  const activeKeys = useMemo(() => keys.filter(isActiveKey), [keys]);

  return (
    <div>
      <SectionHead title="Interview Keys"
        sub="Generate a key to start a live interview session. Each key uses 1 credit."
        action={<Btn onClick={()=>onTab("credits")} variant="ghost" size="sm">Buy credits</Btn>} />

      {msg && <Notice type={msg.type} onClose={()=>setMsg(null)}>{msg.text}</Notice>}

      {/* Generate key — full width */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
        padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:20, flexWrap:"wrap" }}>
          <div>
            <p style={{ margin:"0 0 4px", fontSize:14, fontWeight:700, color:C.text }}>Generate a key</p>
            <p style={{ margin:0, fontSize:13, color:C.textMuted, lineHeight:1.6 }}>
              Uses 1 credit · Valid for 6 hours · Auto-refunded if unused
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px",
              background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
              <span style={{ fontSize:11, fontWeight:700, color:C.textFaint }}>BALANCE</span>
              <span style={{ fontSize:14, fontWeight:900, color:C.text }}>{user?.credits ?? 0} credits</span>
            </div>
            <Btn onClick={handleGenerate} loading={generating}>
              Generate key — use 1 credit
            </Btn>
          </div>
        </div>
      </div>

      {/* New key display */}
      {newKey && (
        <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:12,
          padding:20, marginBottom:20 }}>
          <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, letterSpacing:".1em",
            textTransform:"uppercase", color:C.green }}>
            {newKey.reused ? "Existing key" : "Key generated ✓"}
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <code style={{ fontSize:15, fontWeight:800, color:C.green, letterSpacing:".1em",
              flex:1, wordBreak:"break-all" }}>{newKey.key}</code>
            <Btn onClick={() => copy(newKey.key, "new")} variant="ghost" size="sm">
              {copied==="new" ? "Copied ✓" : "Copy"}
            </Btn>
          </div>
          {newKey.expires_at && (
            <p style={{ margin:"8px 0 0", fontSize:12, color:"#166534" }}>
              Expires {new Date(newKey.expires_at).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      )}

      {/* Keys list */}
      <p style={{ margin:"0 0 12px", fontSize:14, fontWeight:700, color:C.text }}>
        All keys
        {activeKeys.length > 0 && (
          <Tag color={C.green} style={{ marginLeft:8 }}>{activeKeys.length} active</Tag>
        )}
      </p>

      {loading ? (
        <div style={{ textAlign:"center", padding:32 }}><Spinner size={24} /></div>
      ) : keys.length === 0 ? (
        <Empty icon="🗝️" title="No keys yet" sub="Generate your first key above."
          action={<Btn onClick={handleGenerate} size="sm">Generate key</Btn>} />
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {keys.map(k => {
            const active   = isActiveKey(k);
            const status   = active ? "Active" : k.refunded ? "Refunded" : k.revoked ? "Revoked" : k.used ? "Used" : "Expired";
            const sColor   = active ? C.green : k.refunded ? C.yellow : C.textFaint;
            return (
              <div key={k.id||k.key} style={{ background:C.surface, border:`1px solid ${active?C.green+"44":C.border}`,
                borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center",
                gap:14, flexWrap:"wrap" }}>
                <code style={{ flex:1, fontSize:13, fontWeight:700, color:active?C.green:C.textMuted,
                  letterSpacing:".06em", wordBreak:"break-all" }}>{k.key}</code>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <Tag color={sColor}>{status}</Tag>
                  {active && <span style={{ fontSize:11, color:C.textFaint }}>{timeLeft(k.expires_at)}</span>}
                  <span style={{ fontSize:11, color:C.textFaint }}>{formatDate(k.created_at)}</span>
                </div>
                {active && (
                  <Btn onClick={() => copy(k.key, k.id||k.key)} variant="ghost" size="sm">
                    {copied===( k.id||k.key) ? "Copied ✓" : "Copy"}
                  </Btn>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAYMENTS TAB
───────────────────────────────────────────── */
function PaymentsTab() {
  const [payments, setPay] = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try { const d = await fetchMyPaymentHistory(); if (live) setPay(normalizeList(d)); }
      catch(e) { console.error(e); }
      finally  { if (live) setLoad(false); }
    })();
    return () => { live = false; };
  }, []);

  const ok     = payments.filter(p => p.status==="success");
  const spent  = ok.reduce((s,p) => s+Number(p.amount_inr||0), 0);
  const bought = ok.reduce((s,p) => s+Number(p.credits_added||0), 0);

  return (
    <div>
      <SectionHead title="Payment history" sub="All purchases and credits added to your account." />

      {ok.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          <StatBox label="Total spent" value={money(spent)} sub="Successful payments only" color={C.green} />
          <StatBox label="Credits purchased" value={bought} sub="Across all payments" color={C.blue} />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:"center", padding:40 }}><Spinner size={24} /></div>
      ) : payments.length===0 ? (
        <Empty icon="💳" title="No payments yet" sub="Buy a plan to add credits to your account." />
      ) : (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
          {payments.map((p,i) => {
            const success = p.status==="success";
            return (
              <div key={p.id||i} style={{
                display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
                borderBottom: i<payments.length-1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ width:38, height:38, borderRadius:10, flexShrink:0,
                  background:success?"#f0fdf4":"#fefce8",
                  border:`1px solid ${success?"#86efac":"#fde68a"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, color:success?C.green:C.yellow }}>
                  {success ? "✓" : "⏳"}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:C.text }}>{p.plan_name||"Plan"}</p>
                  <p style={{ margin:0, fontSize:12, color:C.textMuted }}>{formatDate(p.created_at)}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ margin:"0 0 2px", fontSize:14, fontWeight:800, color:C.text }}>{money(p.amount_inr)}</p>
                  <p style={{ margin:0, fontSize:12, color:C.green }}>+{p.credits_added||0} credits</p>
                </div>
                <Tag color={success?C.green:p.status==="pending"?C.yellow:C.red}>
                  {p.status||"unknown"}
                </Tag>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AFFILIATE TAB
───────────────────────────────────────────── */
function AffiliateTab({ onRefresh }) {
  const [aff, setAff]         = useState(null);
  const [refs, setRefs]       = useState([]);
  const [loading, setLoad]    = useState(true);
  const [joining, setJoining] = useState(false);
  const [notAff, setNotAff]   = useState(false);
  const [copied, setCopied]   = useState(false);
  const [err, setErr]         = useState("");

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const [a, r] = await Promise.all([fetchMyAffiliateStats(), fetchMyReferrals().catch(()=>[])]);
      setAff(a); setRefs(normalizeList(r)); setNotAff(false);
    } catch { setNotAff(true); }
    finally  { setLoad(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleJoin() {
    setJoining(true); setErr("");
    try { await joinAffiliate(); await load(); onRefresh?.(); }
    catch(e) { setErr(e?.message||"Failed to join affiliate program."); }
    finally  { setJoining(false); }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(aff?.code||"");
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  if (loading) return <div style={{ textAlign:"center", padding:60 }}><Spinner size={28} /></div>;

  if (notAff) {
    return (
      <div>
        <SectionHead title="Affiliate program" sub="Earn commission by referring friends to FluentFox." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          {[
            { icon:"🔗", t:"Get your code",    b:"A unique code that tracks your referrals." },
            { icon:"📤", t:"Share it",          b:"Friends use your code when buying a plan." },
            { icon:"💰", t:"Earn commission",   b:"Get paid a share of every sale from your code." },
          ].map(item => (
            <div key={item.t} style={{ background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:12, padding:"20px", textAlign:"center" }}>
              <p style={{ fontSize:28, margin:"0 0 10px" }}>{item.icon}</p>
              <p style={{ margin:"0 0 6px", fontSize:13, fontWeight:700, color:C.text }}>{item.t}</p>
              <p style={{ margin:0, fontSize:12, color:C.textMuted, lineHeight:1.65 }}>{item.b}</p>
            </div>
          ))}
        </div>
        {err && <Notice type="error">{err}</Notice>}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
          padding:28, textAlign:"center" }}>
          <p style={{ margin:"0 0 6px", fontSize:18, fontWeight:900, color:C.text,
            fontFamily:"'Fraunces',serif" }}>Ready to join?</p>
          <p style={{ margin:"0 0 20px", fontSize:13, color:C.textMuted }}>Free to join · Instant commission on every referral</p>
          <Btn onClick={handleJoin} loading={joining}>Join affiliate program</Btn>
        </div>
      </div>
    );
  }

  const earned  = Number(aff?.total_earned   ?? 0);
  const pending = Number(aff?.pending_payout ?? 0);
  const paidOut = Number(aff?.total_paid_out ?? 0);
  const total   = Number(aff?.total_referrals?? 0);

  return (
    <div>
      <SectionHead title="Affiliate dashboard" sub="Track referrals, earnings, and payouts."
        action={<Tag color={aff?.is_active?C.green:C.textFaint}>{aff?.is_active?"Active":"Inactive"}</Tag>} />

      {/* Code card */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
        padding:24, marginBottom:20 }}>
        <p style={{ margin:"0 0 14px", fontSize:13, fontWeight:700, color:C.text }}>Your referral code</p>
        <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <div style={{ flex:1, background:"#fff8f5", border:`1px solid ${C.orangeBorder}`,
            borderRadius:10, padding:"16px 20px", textAlign:"center" }}>
            <p style={{ margin:0, fontSize:32, fontWeight:900, color:C.orange,
              letterSpacing:".2em", fontFamily:"monospace" }}>{aff?.code||"—"}</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
            <Btn onClick={copyCode}>{copied ? "Copied ✓" : "Copy code"}</Btn>
            <p style={{ margin:0, fontSize:12, color:C.textMuted, textAlign:"center" }}>
              {aff?.commission_percent||0}% commission
            </p>
          </div>
        </div>
        <p style={{ margin:"12px 0 0", fontSize:12, color:C.textMuted, lineHeight:1.7 }}>
          When someone buys a plan using your code, you earn commission automatically.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatBox label="Total earned"   value={money(earned)}  sub="All approved referrals" color={C.green}  />
        <StatBox label="Pending payout" value={money(pending)} sub="Awaiting approval"       color={C.yellow} />
        <StatBox label="Total paid out" value={money(paidOut)} sub="Already processed"       color={C.blue}   />
        <StatBox label="Referrals"      value={total}          sub="Successful"               color={C.orange} />
      </div>

      {/* Referral list */}
      <p style={{ margin:"0 0 12px", fontSize:14, fontWeight:700, color:C.text }}>Referral history</p>
      {refs.length===0 ? (
        <Empty icon="📊" title="No referrals yet" sub="Share your code to start earning." />
      ) : (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
          {refs.map((r,i) => (
            <div key={r.id||i} style={{
              display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
              borderBottom: i<refs.length-1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, background:"#f0fdf4",
                border:"1px solid #86efac", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:16 }}>💸</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:C.text }}>{r.plan_name||"Plan"}</p>
                <p style={{ margin:0, fontSize:12, color:C.textMuted }}>{formatDate(r.created_at)}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ margin:"0 0 2px", fontSize:13, fontWeight:700, color:C.text }}>{money(r.amount_inr)}</p>
                <p style={{ margin:0, fontSize:12, color:C.green }}>+{money(r.commission_amount)} earned</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHELL / ROOT
───────────────────────────────────────────── */
export default function UserDashboard({ onLogout }) {
  const nav = useNavigate();
  const [user, setUser]       = useState(null);
  const [affiliate, setAff]   = useState(null);
  const [loading, setLoad]    = useState(true);
  const [tab, setTab]         = useState("overview");
  const [metrics, setMetrics] = useState({ credits:0, activeKeys:0, payments:0, affiliateEarned:0 });
  const [lastPayment, setLP]  = useState(null);
  const [lastKey, setLK]      = useState(null);

  const refreshAll = useCallback(async () => {
    try {
      const [me, pRes, kRes, aRes] = await Promise.all([
        ffGetMe(),
        fetchMyPaymentHistory().catch(()=>[]),
        fetchMyKeys().catch(()=>[]),
        fetchMyAffiliateStats().catch(()=>null),
      ]);
      const pays = normalizeList(pRes);
      const keys = normalizeList(kRes);
      setUser(me); setAff(aRes);
      setMetrics({
        credits:        Number(me?.credits??0),
        activeKeys:     keys.filter(isActiveKey).length,
        payments:       pays.filter(p=>p.status==="success").length,
        affiliateEarned:Number(aRes?.total_earned??0),
      });
      setLP(pays.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).find(p=>p.status==="success")||null);
      setLK(keys.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0]||null);
    } catch(e) { console.error(e); }
  }, []);

  useEffect(() => {
    let live = true;
    (async () => {
      try { const me = await ffGetMe(); if (live) setUser(me); }
      catch { ffLogout(); onLogout?.(); }
      finally { if (live) setLoad(false); }
    })();
    return () => { live = false; };
  }, [onLogout]);

  useEffect(() => { if (user) refreshAll(); }, [user, refreshAll]);

  function handleLogout() { ffLogout(); onLogout?.(); nav("/"); }

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:C.bg }}>
      <Spinner size={32} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text,
      fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .tab-content { animation: fadeIn .2s ease both; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,.12); border-radius:99px; }
        input, button { font-family:inherit; }
        input:focus { outline:2px solid ${C.orange}; outline-offset:1px; border-color:transparent !important; }
        .nav-btn:hover { background:#fff5f2 !important; color:${C.orange} !important; }
        .nav-btn.active { background:#fff5f2 !important; color:${C.orange} !important; font-weight:800; border-left:3px solid ${C.orange} !important; }
      `}</style>

      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", minHeight:"100vh" }}>

        {/* ── Sidebar ── */}
        <aside style={{ background:C.surface, borderRight:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>

          {/* Logo */}
          <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <img src="/company_logo.webp" alt="FluentFox"
                onError={e=>{ e.currentTarget.style.display="none"; }}
                style={{ width:32, height:32, objectFit:"contain", flexShrink:0 }} />
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:900, color:C.text, letterSpacing:".04em" }}>FluentFox</p>
                <p style={{ margin:0, fontSize:11, color:C.textFaint }}>Dashboard</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
            <p style={{ margin:"0 0 1px", fontSize:13, fontWeight:700, color:C.text,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {user?.name || "User"}
            </p>
            <p style={{ margin:"0 0 8px", fontSize:12, color:C.textMuted,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {user?.email || ""}
            </p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <Tag color={C.orange}>{user?.credits??0} credits</Tag>
              <Tag color={C.textMuted}>{user?.role||"USER"}</Tag>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding:"10px 12px", flex:1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`nav-btn${tab===t.id?" active":""}`}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"10px 12px", borderRadius:8, border:`1px solid transparent`,
                  background:"transparent", cursor:"pointer", textAlign:"left",
                  marginBottom:2, color: tab===t.id?C.orange:C.textMid,
                  fontSize:13, fontWeight: tab===t.id?800:600,
                  borderLeft: tab===t.id?`3px solid ${C.orange}`:"3px solid transparent",
                  transition:"all .13s ease" }}>
                <span style={{ fontSize:14, width:18, textAlign:"center", flexShrink:0 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`,
            display:"flex", flexDirection:"column", gap:6 }}>
            <button onClick={() => nav("/")}
              style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left",
                fontSize:12, fontWeight:600, color:C.textMuted, padding:"6px 4px" }}>
              ← Back to site
            </button>
            <button onClick={handleLogout}
              style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8,
                cursor:"pointer", fontSize:12, fontWeight:700, color:C.red,
                padding:"9px 14px", textAlign:"center" }}>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ padding:28, overflowY:"auto", minWidth:0 }}>
          <div className="tab-content" key={tab}>
            {tab==="overview"  && <OverviewTab  user={user} metrics={metrics} onTab={setTab} lastPayment={lastPayment} lastKey={lastKey} affiliate={affiliate} />}
            {tab==="credits"   && <CreditsTab   user={user} onRefresh={refreshAll} onTab={setTab} />}
            {tab==="keys"      && <KeysTab      user={user} onRefresh={refreshAll} onTab={setTab} />}
            {tab==="payments"  && <PaymentsTab  />}
            {tab==="affiliate" && <AffiliateTab onRefresh={refreshAll} />}
          </div>
        </main>

      </div>
    </div>
  );
}