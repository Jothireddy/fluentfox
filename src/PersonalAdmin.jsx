import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ffLogin, ffLogout, ffGetMe, fetchDashboard, fetchAllUsers, setUserCredits,
  fetchAllPlans, createPlan, updatePlan, deactivatePlan, fetchAllPayments,
  fetchPersonalUsers, fetchTodayUsers, fetchSettings, updateSetting,
  updateDefaultCommission, fetchAllAffiliates, updateAffiliateCommission,
  toggleAffiliate, approveAffiliatePayout, fetchAffiliatePayouts,
} from "./api3";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (same system as UserDashboard)
───────────────────────────────────────────── */
const C = {
  orange:       "#ff4b00",
  orangeSoft:   "rgba(255,75,0,0.08)",
  orangeBorder: "rgba(255,75,0,0.18)",
  green:        "#16a34a",
  blue:         "#2563eb",
  yellow:       "#d97706",
  red:          "#dc2626",
  bg:           "#f9fafb",
  surface:      "#ffffff",
  border:       "#e5e7eb",
  text:         "#111827",
  textMid:      "#374151",
  textMuted:    "#6b7280",
  textFaint:    "#9ca3af",
};

const TABS = [
  { id: "dashboard",  label: "Dashboard",  icon: "◈" },
  { id: "visitors",   label: "Visitors",   icon: "◉" },
  { id: "plans",      label: "Plans",      icon: "◎" },
  { id: "payments",   label: "Payments",   icon: "↻" },
  { id: "users",      label: "Users",      icon: "⊙" },
  { id: "affiliates", label: "Affiliates", icon: "⟐" },
  { id: "settings",   label: "Settings",   icon: "⚙" },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function normalizeList(data, keys = []) {
  if (Array.isArray(data)) return data;
  for (const k of [...keys, "data", "items"]) {
    if (Array.isArray(data?.[k])) return data[k];
  }
  return [];
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function money(v) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

function normalizePlan(p, i = 0) {
  return {
    id:          p.id || p._id || `plan-${i}`,
    name:        p.name || p.title || `Plan ${i + 1}`,
    description: p.description || p.desc || "",
    price_inr:   p.price_inr ?? p.price ?? p.amount_inr ?? p.amount ?? null,
    credits:     p.credits ?? p.sessions ?? null,
    popular:     Boolean(p.popular || p.is_popular || p.featured || i === 1),
    active:      p.active !== false && p.is_active !== false,
  };
}

function normalizeSettingEntries(s) {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  if (typeof s !== "object") return [];
  return Object.entries(s);
}

/* ─────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────── */
function Spinner({ size = 18, color = C.orange }) {
  return (
    <span style={{ width: size, height: size, border: "2px solid rgba(0,0,0,0.08)",
      borderTopColor: color, borderRadius: "50%", animation: "spin .7s linear infinite",
      display: "inline-block", flexShrink: 0 }} />
  );
}

function Tag({ children, color = C.orange }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10,
      fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
      color, background: `${color}14`, borderRadius: 6, padding: "3px 8px",
      whiteSpace: "nowrap", border: `1px solid ${color}28` }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, loading, fullWidth, size = "md", type = "button" }) {
  const s = {
    primary: { bg: C.orange,  color: "#fff",      border: "none" },
    ghost:   { bg: "transparent", color: C.textMid, border: `1px solid ${C.border}` },
    danger:  { bg: "transparent", color: C.red,    border: `1px solid rgba(220,38,38,.25)` },
    green:   { bg: C.green,   color: "#fff",      border: "none" },
    blue:    { bg: C.blue,    color: "#fff",       border: "none" },
  }[variant] || { bg: C.orange, color: "#fff", border: "none" };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{ padding: size === "sm" ? "7px 14px" : "10px 18px",
        borderRadius: 8, border: s.border, background: s.bg, color: s.color,
        fontSize: size === "sm" ? 11 : 12, fontWeight: 700, letterSpacing: ".06em",
        textTransform: "uppercase", cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1, width: fullWidth ? "100%" : undefined,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 7, transition: "all .14s ease", whiteSpace: "nowrap", fontFamily: "inherit" }}
      onMouseEnter={e => { if (!disabled && !loading) { e.currentTarget.style.opacity = ".82"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
      {loading && <Spinner size={13} color={variant === "primary" || variant === "green" || variant === "blue" ? "#fff" : C.orange} />}
      {children}
    </button>
  );
}

function Notice({ type = "error", children, onClose }) {
  const map = {
    error:   { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" },
    success: { bg: "#f0fdf4", border: "#86efac", color: "#166534" },
    info:    { bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" },
    warn:    { bg: "#fffbeb", border: "#fcd34d", color: "#92400e" },
  };
  const t = map[type] || map.error;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: t.bg,
      border: `1px solid ${t.border}`, borderRadius: 10, padding: "11px 14px",
      fontSize: 13, color: t.color, marginBottom: 16, lineHeight: 1.55 }}>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose && <button onClick={onClose} style={{ background: "none", border: "none",
        cursor: "pointer", color: t.color, fontSize: 14, padding: 0, opacity: .6 }}>✕</button>}
    </div>
  );
}

function StatBox({ label, value, sub, color = C.orange }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "18px 20px", borderLeft: `3px solid ${color}` }}>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
        textTransform: "uppercase", color: C.textFaint }}>{label}</p>
      <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.text, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "5px 0 0", fontSize: 12, color: C.textMuted }}>{sub}</p>}
    </div>
  );
}

function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.text,
          fontFamily: "'Fraunces',serif", lineHeight: 1.1 }}>{title}</h2>
        {sub && <p style={{ margin: "5px 0 0", fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Empty({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", background: C.surface,
      border: `1px solid ${C.border}`, borderRadius: 12 }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: C.text }}>{title}</p>
      {sub && <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>{sub}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto",
        background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
        boxShadow: "0 24px 64px rgba(0,0,0,.22)", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text,
            fontFamily: "'Fraunces',serif" }}>{title}</h3>
          <Btn onClick={onClose} variant="ghost" size="sm">✕</Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FIELD (form input with label)
───────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
        textTransform: "uppercase", color: C.textMuted, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 8, padding: "10px 13px", color: C.text, fontSize: 13,
  outline: "none", fontFamily: "inherit",
};

/* ─────────────────────────────────────────────
   TABLE
───────────────────────────────────────────── */
function Table({ cols, rows, renderRow }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: C.bg }}>
            {cols.map(c => (
              <th key={c} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10,
                fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                color: C.textFaint, borderBottom: `1px solid ${C.border}`,
                whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding: "28px 16px",
              color: C.textMuted, textAlign: "center", fontSize: 13 }}>No data</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
              background: i % 2 === 0 ? C.surface : "#fafafa" }}>
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Td({ children, mono }) {
  return (
    <td style={{ padding: "12px 16px", color: C.text, verticalAlign: "middle",
      fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 12 : 13,
      whiteSpace: "nowrap" }}>
      {children}
    </td>
  );
}

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [email, setPwd]      = useState("");
  const [password, setPass]  = useState("");
  const [err, setErr]        = useState("");
  const [loading, setLoad]   = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setLoad(true);
    try {
      const u = await ffLogin(email, password);
      if (u.role !== "personal_admin") { ffLogout(); setErr("Access denied. Personal admin only."); }
      else onLogin(u);
    } catch(e) { setErr(e.message || "Login failed."); }
    finally    { setLoad(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
      fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg);}}
        input:focus{outline:2px solid ${C.orange};outline-offset:1px;}
        input::placeholder{color:${C.textFaint};}
      `}</style>

      <div style={{ width: "100%", maxWidth: 400, background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: 16, padding: 32,
        boxShadow: "0 20px 48px rgba(0,0,0,.10)" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <img src="/company_logo.webp" alt="FluentFox"
            onError={e => { e.currentTarget.style.display = "none"; }}
            style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.text, letterSpacing: ".04em" }}>FluentFox</p>
            <p style={{ margin: 0, fontSize: 11, color: C.textFaint }}>Personal Admin</p>
          </div>
        </div>

        <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 900, color: C.text,
          fontFamily: "'Fraunces',serif" }}>Sign in</h1>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
          Manage plans, users, payments, and affiliates.
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Email">
            <input type="email" value={email} onChange={e => setPwd(e.target.value)}
              placeholder="admin@fluentfox.ai" required style={inputStyle} />
          </Field>
          <Field label="Password">
            <input type="password" value={password} onChange={e => setPass(e.target.value)}
              placeholder="••••••••" required style={inputStyle} />
          </Field>
          {err && <Notice type="error">{err}</Notice>}
          <Btn type="submit" loading={loading} fullWidth>
            {loading ? "Signing in…" : "Sign in"}
          </Btn>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD TAB
───────────────────────────────────────────── */
function DashboardTab() {
  const [data, setData] = useState(null);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    let live = true;
    fetchDashboard().then(r => { if (live) setData(r); }).catch(console.error).finally(() => live && setLoad(false));
    return () => { live = false; };
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;
  if (!data)   return <Notice type="error">Failed to load dashboard.</Notice>;

  return (
    <div>
      <SectionHead title="Dashboard" sub="Overview of FluentFox activity." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatBox label="Total Users"        value={data.total_users ?? 0}            color={C.orange} />
        <StatBox label="Revenue"            value={`₹${data.total_revenue_inr ?? 0}`} color={C.green}  />
        <StatBox label="Affiliates"         value={data.total_affiliates ?? 0}        color={C.blue}   />
        <StatBox label="Pending Payouts"    value={`₹${data.total_pending_payout ?? 0}`} color={C.yellow} />
        <StatBox label="Tracked Visitors"   value={data.total_tracked_visitors ?? 0} color="#7c3aed"  />
        <StatBox label="Today's Logins"     value={data.today_logins ?? 0}            color={C.green}  />
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: C.text }}>Quick tips</p>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.textMuted, fontSize: 13, lineHeight: 2.1 }}>
          <li>Use the Plans tab to edit pricing and credit counts.</li>
          <li>Use Affiliates to approve pending payouts when ready.</li>
          <li><strong style={{ color: C.text }}>TEST_MODE=true</strong> means credits are added instantly without Razorpay.</li>
          <li>Switch to live payments once Razorpay keys are configured.</li>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VISITORS TAB
───────────────────────────────────────────── */
function VisitorsTab() {
  const [allData, setAll]   = useState(null);
  const [todayData, setToday] = useState([]);
  const [loading, setLoad]  = useState(true);
  const [view, setView]     = useState("all");

  useEffect(() => {
    let live = true;
    Promise.all([fetchPersonalUsers({ limit: 250 }), fetchTodayUsers()])
      .then(([a, t]) => { if (live) { setAll(a); setToday(normalizeList(t, ["users"])); }})
      .catch(console.error).finally(() => live && setLoad(false));
    return () => { live = false; };
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;

  const users = view === "today" ? todayData : normalizeList(allData, ["users"]);
  const stats = allData?.stats || allData?.summary || null;

  return (
    <div>
      <SectionHead title="Visitors & Logins" sub="Track signups, logins, and returning users."
        action={
          <div style={{ display: "flex", gap: 6 }}>
            {["all","today"].map(v => (
              <Btn key={v} onClick={() => setView(v)} variant={view === v ? "primary" : "ghost"} size="sm">
                {v === "all" ? "All" : "Today"}
              </Btn>
            ))}
          </div>
        } />

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
          <StatBox label="Total Visitors" value={stats.total_visitors ?? 0}  color={C.orange} />
          <StatBox label="New Users"      value={stats.new_users ?? 0}       color={C.green}  />
          <StatBox label="Returning"      value={stats.returning_users ?? 0} color={C.blue}   />
          <StatBox label="Google Logins"  value={stats.google_logins ?? 0}   color={C.yellow} />
          <StatBox label="Email Logins"   value={stats.email_logins ?? 0}    color="#7c3aed"  />
          <StatBox label="Signups"        value={stats.signups ?? 0}         color={C.green}  />
        </div>
      )}

      <Table cols={["Name","Email","Method","First Seen","Last Seen","Sessions","Type"]} rows={users}
        renderRow={r => (<>
          <Td>{r.name || "—"}</Td>
          <Td>{r.email || "—"}</Td>
          <Td><Tag color={r.login_method === "google" ? C.blue : C.orange}>{r.login_method || "—"}</Tag></Td>
          <Td>{formatDate(r.logged_in_at)}</Td>
          <Td>{r.last_seen_at ? new Date(r.last_seen_at).toLocaleString("en-IN") : "—"}</Td>
          <Td>{r.session_count ?? 0}</Td>
          <Td><Tag color={r.is_returning ? C.green : C.orange}>{r.is_returning ? "Returning" : "New"}</Tag></Td>
        </>)} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PLANS TAB
───────────────────────────────────────────── */
function PlansTab() {
  const [plans, setPlans]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState({ name:"", description:"", price_inr:"", credits:"" });
  const [saving, setSave]   = useState(false);
  const [msg, setMsg]       = useState(null);

  const load = useCallback(async () => {
    try {
      setLoad(true);
      const r = await fetchAllPlans();
      setPlans(normalizeList(r, ["plans"]).map(normalizePlan));
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed to load plans." }); }
    finally    { setLoad(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setForm({ name:"", description:"", price_inr:"", credits:"" }); setModal("create"); setMsg(null); }
  function openEdit(p)  { setForm({ name: p.name, description: p.description, price_inr: p.price_inr ?? "", credits: p.credits ?? "" }); setModal(p); setMsg(null); }

  async function handleSave() {
    setSave(true); setMsg(null);
    try {
      const payload = { name: form.name, description: form.description,
        price_inr: Number(form.price_inr), credits: Number(form.credits) };
      modal === "create" ? await createPlan(payload) : await updatePlan(modal.id, payload);
      await load(); setModal(null);
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed to save." }); }
    finally    { setSave(false); }
  }

  async function handleDeactivate(p) {
    if (!window.confirm(`Deactivate "${p.name}"?`)) return;
    await deactivatePlan(p.id); load();
  }

  async function handleReactivate(p) {
    await updatePlan(p.id, { is_active: true }); load();
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;

  return (
    <div>
      <SectionHead title="Plans" sub="Create, edit, and manage pricing plans."
        action={<Btn onClick={openCreate}>+ New plan</Btn>} />

      {plans.length === 0 ? (
        <Empty icon="💳" title="No plans yet" sub="Create your first plan above." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {plans.map(p => (
            <div key={p.id} style={{ background: C.surface, border: `1px solid ${p.popular ? C.orangeBorder : C.border}`,
              borderTop: `3px solid ${p.popular ? C.orange : C.blue}`, borderRadius: 14, padding: 22,
              opacity: p.active ? 1 : .65, position: "relative" }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  background: C.orange, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: ".12em",
                  textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  Most popular
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Tag color={p.active ? C.green : C.textFaint}>{p.active ? "Active" : "Inactive"}</Tag>
                <span style={{ fontSize: 11, color: C.textFaint }}>#{p.id}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, color: C.text,
                fontFamily: "'Fraunces',serif" }}>{p.name}</p>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
                {p.description || "—"}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                    textTransform: "uppercase", color: C.textFaint }}>Price</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.orange }}>{money(p.price_inr)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                    textTransform: "uppercase", color: C.textFaint }}>Credits</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.blue }}>{p.credits ?? "—"}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => openEdit(p)} variant="ghost" size="sm" fullWidth>Edit</Btn>
                {p.active
                  ? <Btn onClick={() => handleDeactivate(p)} variant="danger" size="sm" fullWidth>Deactivate</Btn>
                  : <Btn onClick={() => handleReactivate(p)} variant="blue"   size="sm" fullWidth>Reactivate</Btn>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "Create plan" : `Edit — ${modal.name}`} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label:"Plan name",      key:"name",        type:"text",   ph:"e.g. Pro" },
              { label:"Description",    key:"description", type:"text",   ph:"e.g. 5 interview sessions" },
              { label:"Price (₹ INR)",  key:"price_inr",   type:"number", ph:"e.g. 799" },
              { label:"Credits",        key:"credits",     type:"number", ph:"e.g. 5" },
            ].map(({ label, key, type, ph }) => (
              <Field key={key} label={label}>
                <input type={type} value={form[key]} placeholder={ph}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={inputStyle} />
              </Field>
            ))}
            {msg && <Notice type={msg.type}>{msg.text}</Notice>}
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setModal(null)} variant="ghost" fullWidth>Cancel</Btn>
              <Btn onClick={handleSave} loading={saving} fullWidth>Save plan</Btn>
            </div>
          </div>
        </Modal>
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
    fetchAllPayments().then(r => { if (live) setPay(normalizeList(r, ["payments"])); })
      .catch(console.error).finally(() => live && setLoad(false));
    return () => { live = false; };
  }, []);

  const ok    = payments.filter(p => p.status === "success");
  const total = ok.reduce((s,p) => s + Number(p.amount_inr||0), 0);
  const creds = ok.reduce((s,p) => s + Number(p.credits_added||0), 0);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;

  return (
    <div>
      <SectionHead title="Payments" sub="All payment records across the platform." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatBox label="Total Revenue"  value={`₹${total}`}           color={C.green}  />
        <StatBox label="Credits Sold"   value={creds}                  color={C.blue}   />
        <StatBox label="Transactions"   value={ok.length}              color={C.orange} />
        <StatBox label="Pending"        value={payments.filter(p=>p.status==="pending").length} color={C.yellow} />
      </div>
      <Table
        cols={["User","Plan","Amount","Credits","Status","Affiliate","Commission","Date"]}
        rows={payments}
        renderRow={p => (<>
          <Td>
            <span style={{ fontWeight: 700 }}>{p.user_name || "—"}</span>
            <br /><span style={{ fontSize: 11, color: C.textFaint }}>{p.user_email || ""}</span>
          </Td>
          <Td>{p.plan_name || "—"}</Td>
          <Td>₹{Number(p.amount_inr||0)}</Td>
          <Td>{Number(p.credits_added||0)}</Td>
          <Td>
            <Tag color={p.status==="success"?C.green:p.status==="pending"?C.yellow:C.red}>
              {p.status||"—"}
            </Tag>
          </Td>
          <Td mono>{p.affiliate_code || "—"}</Td>
          <Td>{Number(p.commission_amount||0)>0 ? `₹${p.commission_amount} (${p.commission_percent}%)` : "—"}</Td>
          <Td>{formatDate(p.created_at)}</Td>
        </>)} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   USERS TAB
───────────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [editUser, setEdit] = useState(null);
  const [credits, setCreds] = useState("");
  const [saving, setSave]   = useState(false);
  const [msg, setMsg]       = useState(null);

  const load = useCallback(async () => {
    try {
      setLoad(true);
      const r = await fetchAllUsers();
      setUsers(normalizeList(r, ["users"]));
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed to load users." }); }
    finally    { setLoad(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSave(true); setMsg(null);
    try {
      await setUserCredits(editUser.id, Number(credits));
      await load(); setEdit(null);
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed to update." }); }
    finally    { setSave(false); }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;

  return (
    <div>
      <SectionHead title="Registered Users" sub="All accounts in the system." />
      {msg && <Notice type={msg.type} onClose={() => setMsg(null)}>{msg.text}</Notice>}
      <Table cols={["Name","Email","Role","Credits","Joined","Actions"]} rows={users}
        renderRow={u => (<>
          <Td><span style={{ fontWeight: 700 }}>{u.name || "—"}</span></Td>
          <Td>{u.email || "—"}</Td>
          <Td><Tag color={u.role==="personal_admin"?C.orange:u.role==="admin"?C.blue:C.textFaint}>{u.role||"user"}</Tag></Td>
          <Td><strong>{u.credits ?? 0}</strong></Td>
          <Td>{formatDate(u.created_at)}</Td>
          <Td>
            <Btn size="sm" variant="ghost" onClick={() => { setEdit(u); setCreds(String(u.credits??0)); setMsg(null); }}>
              Set credits
            </Btn>
          </Td>
        </>)} />

      {editUser && (
        <Modal title={`Set credits — ${editUser.name || editUser.email}`} onClose={() => setEdit(null)}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textMuted }}>
            Current balance: <strong style={{ color: C.text }}>{editUser.credits ?? 0} credits</strong>
          </p>
          <Field label="New credit amount">
            <input type="number" min="0" value={credits} onChange={e => setCreds(e.target.value)} style={inputStyle} />
          </Field>
          {msg && <div style={{ marginTop: 12 }}><Notice type={msg.type}>{msg.text}</Notice></div>}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={() => setEdit(null)} variant="ghost" fullWidth>Cancel</Btn>
            <Btn onClick={handleSave} loading={saving} fullWidth>Update credits</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AFFILIATES TAB
───────────────────────────────────────────── */
function AffiliatesTab() {
  const [affiliates, setAff]   = useState([]);
  const [loading, setLoad]     = useState(true);
  const [commModal, setCommM]  = useState(null);
  const [newComm, setNewComm]  = useState("");
  const [payoutModal, setPayM] = useState(null);
  const [payouts, setPayouts]  = useState([]);
  const [payoutNote, setNote]  = useState("");
  const [saving, setSave]      = useState(false);
  const [msg, setMsg]          = useState(null);
  const [defComm, setDefComm]  = useState("");
  const [savingDef, setSaveDef]= useState(false);

  const load = useCallback(async () => {
    try {
      setLoad(true);
      const r = await fetchAllAffiliates();
      setAff(normalizeList(r, ["affiliates"]));
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed to load." }); }
    finally    { setLoad(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleUpdateComm() {
    setSave(true); setMsg(null);
    try { await updateAffiliateCommission(commModal.id, Number(newComm)); await load(); setCommM(null); }
    catch(e) { setMsg({ type:"error", text: e.message || "Failed." }); }
    finally  { setSave(false); }
  }

  async function handleToggle(a) { await toggleAffiliate(a.id); load(); }

  async function handleApprovePayout() {
    setSave(true); setMsg(null);
    try { await approveAffiliatePayout(payoutModal.id, payoutNote); await load(); setPayM(null); setNote(""); }
    catch(e) { setMsg({ type:"error", text: e.message || "Failed." }); }
    finally  { setSave(false); }
  }

  async function openPayouts(a) {
    setPayM(a); setNote(""); setMsg(null);
    const h = await fetchAffiliatePayouts(a.id).catch(() => []);
    setPayouts(normalizeList(h, ["payouts"]));
  }

  async function handleDefComm() {
    setSaveDef(true);
    try { await updateDefaultCommission(Number(defComm)); setMsg({ type:"success", text: "Default commission updated." }); setTimeout(() => setMsg(null), 2500); }
    catch(e) { setMsg({ type:"error", text: e.message || "Failed." }); }
    finally  { setSaveDef(false); }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;

  const totalPending = affiliates.reduce((s,a) => s + Number(a.pending_payout||0), 0);
  const totalEarned  = affiliates.reduce((s,a) => s + Number(a.total_earned||0), 0);

  return (
    <div>
      <SectionHead title="Affiliates" sub="Manage commissions and approve payouts." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: 12, marginBottom: 20 }}>
        <StatBox label="Affiliates"       value={affiliates.length}                             color={C.orange} />
        <StatBox label="Total Earned"     value={`₹${totalEarned}`}                             color={C.green}  />
        <StatBox label="Pending Payouts"  value={`₹${totalPending}`}                            color={C.yellow} />
        <StatBox label="Active"           value={affiliates.filter(a=>a.is_active).length}      color={C.blue}   />
      </div>

      {/* Default commission row */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center",
        gap: 16, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: C.text }}>Default commission %</p>
          <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>Applied when a new affiliate joins</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="number" min="0" max="100" value={defComm}
            onChange={e => setDefComm(e.target.value)} placeholder="e.g. 10"
            style={{ ...inputStyle, width: 100 }} />
          <Btn onClick={handleDefComm} loading={savingDef} size="sm">Update</Btn>
        </div>
      </div>

      {msg && <Notice type={msg.type} onClose={() => setMsg(null)}>{msg.text}</Notice>}

      <Table
        cols={["User","Code","Commission","Earned","Pending","Paid Out","Referrals","Status","Actions"]}
        rows={affiliates}
        renderRow={a => (<>
          <Td>
            <span style={{ fontWeight: 700 }}>{a.user_name || "—"}</span>
            <br /><span style={{ fontSize: 11, color: C.textFaint }}>{a.user_email || ""}</span>
          </Td>
          <Td mono>{a.code || "—"}</Td>
          <Td>{a.commission_percent ?? 0}%</Td>
          <Td>₹{Number(a.total_earned||0)}</Td>
          <Td><span style={{ color: Number(a.pending_payout||0)>0 ? C.yellow : C.textMuted }}>₹{Number(a.pending_payout||0)}</span></Td>
          <Td>₹{Number(a.total_paid_out||0)}</Td>
          <Td>{Number(a.total_referrals||0)}</Td>
          <Td><Tag color={a.is_active ? C.green : C.textFaint}>{a.is_active?"Active":"Inactive"}</Tag></Td>
          <Td>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn size="sm" variant="ghost" onClick={() => { setCommM(a); setNewComm(String(a.commission_percent??0)); setMsg(null); }}>
                Commission
              </Btn>
              <Btn size="sm" variant={a.is_active?"danger":"blue"} onClick={() => handleToggle(a)}>
                {a.is_active ? "Disable" : "Enable"}
              </Btn>
              <Btn size="sm" variant={Number(a.pending_payout||0)>0?"primary":"ghost"} onClick={() => openPayouts(a)}>
                Payouts
              </Btn>
            </div>
          </Td>
        </>)} />

      {/* Commission modal */}
      {commModal && (
        <Modal title={`Commission — ${commModal.user_name||commModal.code}`} onClose={() => setCommM(null)}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: C.textMuted }}>
            Current: <strong style={{ color: C.text }}>{commModal.commission_percent}%</strong>
          </p>
          <Field label="New commission %">
            <input type="number" min="0" max="100" value={newComm}
              onChange={e => setNewComm(e.target.value)} style={inputStyle} />
          </Field>
          {msg && <div style={{ marginTop: 12 }}><Notice type={msg.type}>{msg.text}</Notice></div>}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={() => setCommM(null)} variant="ghost" fullWidth>Cancel</Btn>
            <Btn onClick={handleUpdateComm} loading={saving} fullWidth>Update</Btn>
          </div>
        </Modal>
      )}

      {/* Payout modal */}
      {payoutModal && (
        <Modal title={`Payouts — ${payoutModal.user_name||payoutModal.code}`}
          onClose={() => { setPayM(null); setMsg(null); }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <StatBox label="Pending"    value={`₹${Number(payoutModal.pending_payout||0)}`}  color={C.yellow} />
            <StatBox label="Paid out"   value={`₹${Number(payoutModal.total_paid_out||0)}`}  color={C.green}  />
          </div>

          {Number(payoutModal.pending_payout||0) > 0 && (
            <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10,
              padding: 16, marginBottom: 16 }}>
              <Field label="Payout note (optional)">
                <input value={payoutNote} onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Bank transfer done" style={inputStyle} />
              </Field>
              {msg && <div style={{ marginTop: 10 }}><Notice type={msg.type}>{msg.text}</Notice></div>}
              <div style={{ marginTop: 12 }}>
                <Btn onClick={handleApprovePayout} loading={saving} fullWidth>
                  Approve ₹{Number(payoutModal.pending_payout||0)} payout
                </Btn>
              </div>
            </div>
          )}

          <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
            textTransform: "uppercase", color: C.textFaint }}>Payout history</p>
          {payouts.length === 0 ? (
            <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", padding: "16px 0" }}>No payouts yet.</p>
          ) : payouts.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: 12,
              padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
              <div>
                <span style={{ fontWeight: 700, color: C.green }}>₹{p.amount}</span>
                <span style={{ color: C.textMuted, marginLeft: 10 }}>by {p.approved_by_name||"admin"}</span>
                {p.note && <span style={{ color: C.textMuted, marginLeft: 10 }}>· {p.note}</span>}
              </div>
              <span style={{ color: C.textFaint }}>{formatDate(p.approved_at)}</span>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SETTINGS TAB
───────────────────────────────────────────── */
function SettingsTab() {
  const [settings, setSettings] = useState({});
  const [loading, setLoad]      = useState(true);
  const [editKey, setEditKey]   = useState("");
  const [editVal, setEditVal]   = useState("");
  const [saving, setSave]       = useState(false);
  const [msg, setMsg]           = useState(null);

  const load = useCallback(async () => {
    try {
      setLoad(true);
      const r = await fetchSettings();
      setSettings(r?.settings || r || {});
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed." }); }
    finally    { setLoad(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    if (!editKey) return;
    setSave(true); setMsg(null);
    try {
      await updateSetting(editKey, editVal);
      await load(); setMsg({ type:"success", text: "Setting updated." });
      setTimeout(() => setMsg(null), 2500);
    } catch(e) { setMsg({ type:"error", text: e.message || "Failed." }); }
    finally    { setSave(false); }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Spinner size={28} /></div>;

  const entries = normalizeSettingEntries(settings);

  return (
    <div>
      <SectionHead title="App Settings" sub="Global configuration for FluentFox." />
      {msg && <Notice type={msg.type} onClose={() => setMsg(null)}>{msg.text}</Notice>}

      {entries.length === 0 ? (
        <Empty icon="⚙️" title="No settings found" />
      ) : (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {entries.map(([key, value], i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 16, padding: "16px 20px", flexWrap: "wrap",
              borderBottom: i < entries.length - 1 ? `1px solid ${C.border}` : "none",
              background: i % 2 === 0 ? C.surface : "#fafafa" }}>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, letterSpacing: ".1em",
                  textTransform: "uppercase", color: C.textFaint }}>{key}</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text,
                  fontFamily: "monospace", wordBreak: "break-word" }}>{String(value)}</p>
              </div>
              <Btn size="sm" variant="ghost" onClick={() => { setEditKey(key); setEditVal(String(value)); setMsg(null); }}>
                Edit
              </Btn>
            </div>
          ))}
        </div>
      )}

      {editKey && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`,
          borderTop: `3px solid ${C.blue}`, borderRadius: 12, padding: 20, marginTop: 16 }}>
          <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: C.text }}>
            Editing: <span style={{ color: C.orange, fontFamily: "monospace" }}>{editKey}</span>
          </p>
          <Field label="Value">
            <input value={editVal} onChange={e => setEditVal(e.target.value)} style={inputStyle} />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn onClick={() => setEditKey("")} variant="ghost">Cancel</Btn>
            <Btn onClick={handleSave} loading={saving}>Save setting</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHELL
───────────────────────────────────────────── */
function AdminShell({ user, onLogout }) {
  const [tab, setTab] = useState("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .tab-content{animation:fadeIn .2s ease both;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:99px;}
        input,button{font-family:inherit;}
        input:focus{outline:2px solid ${C.orange};outline-offset:1px;}
        input::placeholder{color:${C.textFaint};}
        .nav-btn{transition:all .13s ease;}
        .nav-btn:hover{background:#fff5f2 !important;color:${C.orange} !important;}
        .nav-btn.active{background:#fff5f2 !important;color:${C.orange} !important;
          font-weight:800;border-left:3px solid ${C.orange} !important;}
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>

        {/* ── Sidebar ── */}
        <aside style={{ background: C.surface, borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>

          {/* Logo */}
          <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/company_logo.webp" alt="FluentFox"
                onError={e => { e.currentTarget.style.display = "none"; }}
                style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: C.text, letterSpacing: ".04em" }}>FluentFox</p>
                <p style={{ margin: 0, fontSize: 11, color: C.textFaint }}>Admin</p>
              </div>
            </div>
          </div>

          {/* Admin info */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
            <p style={{ margin: "0 0 1px", fontSize: 13, fontWeight: 700, color: C.text,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name || "Admin"}
            </p>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: C.textMuted,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email || ""}
            </p>
            <Tag color={C.orange}>Personal admin</Tag>
          </div>

          {/* Nav */}
          <nav style={{ padding: "10px 12px", flex: 1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`nav-btn${tab === t.id ? " active" : ""}`}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, border: "1px solid transparent",
                  background: "transparent", cursor: "pointer", textAlign: "left",
                  marginBottom: 2, color: tab === t.id ? C.orange : C.textMid,
                  fontSize: 13, fontWeight: tab === t.id ? 800 : 600,
                  borderLeft: tab === t.id ? `3px solid ${C.orange}` : "3px solid transparent" }}>
                <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", gap: 6 }}>
            <button onClick={() => window.open("/", "_self")}
              style={{ background: "none", border: "none", cursor: "pointer",
                textAlign: "left", fontSize: 12, fontWeight: 600, color: C.textMuted, padding: "6px 4px" }}>
              ← Back to site
            </button>
            <button onClick={onLogout}
              style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8,
                cursor: "pointer", fontSize: 12, fontWeight: 700, color: C.red,
                padding: "9px 14px", textAlign: "center", fontFamily: "inherit" }}>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ padding: 28, overflowY: "auto", minWidth: 0 }}>
          <div className="tab-content" key={tab}>
            {tab === "dashboard"  && <DashboardTab />}
            {tab === "visitors"   && <VisitorsTab />}
            {tab === "plans"      && <PlansTab />}
            {tab === "payments"   && <PaymentsTab />}
            {tab === "users"      && <UsersTab />}
            {tab === "affiliates" && <AffiliatesTab />}
            {tab === "settings"   && <SettingsTab />}
          </div>
        </main>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function PersonalAdmin() {
  const [user, setUser]       = useState(null);
  const [checking, setCheck]  = useState(true);

  useEffect(() => {
    ffGetMe()
      .then(u => { if (u?.role === "personal_admin") setUser(u); else ffLogout(); })
      .catch(() => {})
      .finally(() => setCheck(false));
  }, []);

  function handleLogout() { ffLogout(); setUser(null); }

  if (checking) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <Spinner size={32} />
    </div>
  );

  if (!user) return <LoginPage onLogin={setUser} />;
  return <AdminShell user={user} onLogout={handleLogout} />;
}