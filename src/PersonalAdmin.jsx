import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ffLogin,
  ffLogout,
  ffGetMe,
  fetchDashboard,
  fetchAllUsers,
  setUserCredits,
  fetchAllPlans,
  createPlan,
  updatePlan,
  deactivatePlan,
  fetchAllPayments,
  fetchPersonalUsers,
  fetchTodayUsers,
  fetchSettings,
  updateSetting,
  updateDefaultCommission,
  fetchAllAffiliates,
  updateAffiliateCommission,
  toggleAffiliate,
  approveAffiliatePayout,
  fetchAffiliatePayouts,
} from "./api3";

const C = {
  orange: "#ff4b00",
  orangeLight: "#ff7a24",
  orangePale: "#fff5e6",
  blue: "#0077ff",
  dark: "#0a0a0f",
  dark2: "#111116",
  dark3: "#16161d",
  light: "#fffdf9",
  white: "#ffffff",
  card: "#ffffff",
  cardSoft: "#fff8f2",
  border: "rgba(0,0,0,0.08)",
  borderDark: "rgba(255,255,255,0.08)",
  muted: "#6a6a73",
  mutedDark: "rgba(255,255,255,0.42)",
  text: "#111",
  textDark: "#f4f4fb",
  green: "#16c784",
  yellow: "#f5a623",
  red: "#c0392b",
};

const PAGE_BG =
  "linear-gradient(180deg, #fff4e7 0%, #fffdf9 20%, #fff 52%, #fff7ef 100%)";

const pill = (active) => ({
  padding: "7px 16px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  border: "none",
  background: active ? C.orange : "rgba(255,255,255,0.08)",
  color: active ? "#fff" : C.muted,
  transition: "all 0.18s ease",
});

const btn = (variant = "primary") => ({
  padding: "10px 18px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  border:
    variant === "ghost"
      ? "1px solid rgba(0,0,0,0.08)"
      : variant === "dark"
      ? "none"
      : "none",
  background:
    variant === "primary"
      ? C.orange
      : variant === "blue"
      ? C.blue
      : variant === "ghost"
      ? "#fff"
      : variant === "danger"
      ? C.red
      : variant === "green"
      ? C.green
      : C.dark,
  color:
    variant === "ghost" ? C.text : "#fff",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap",
  boxShadow:
    variant === "ghost"
      ? "0 10px 24px rgba(0,0,0,.03)"
      : "0 12px 24px rgba(0,0,0,.08)",
});

const input = {
  width: "100%",
  background: "#fff",
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "11px 14px",
  color: C.text,
  fontSize: 13,
  outline: "none",
  boxShadow: "0 10px 18px rgba(0,0,0,.03)",
};

function Badge({ label, color = C.orange, light = false }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: light ? `${color}14` : `${color}18`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, accent = C.orange, light = false }) {
  return (
    <div
      style={{
        background: light ? C.white : "linear-gradient(180deg,#1b1b22,#111116)",
        border: `1px solid ${light ? C.border : C.borderDark}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 20,
        padding: "18px 20px",
        boxShadow: light
          ? "0 14px 28px rgba(0,0,0,.05)"
          : "0 14px 28px rgba(0,0,0,.18)",
      }}
    >
      <p
        style={{
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: light ? C.muted : C.mutedDark,
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: light ? C.text : C.textDark,
          lineHeight: 1,
          margin: 0,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: 11,
            color: light ? C.muted : C.mutedDark,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ title, sub, dark = false, right }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
        marginBottom: 18,
        flexWrap: "wrap",
      }}
    >
      <div>
        <span
          style={{
            display: "inline-block",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: dark ? "rgba(255,255,255,.10)" : "rgba(255,75,0,.08)",
            color: dark ? "#ffcfbf" : C.orange,
            borderRadius: 999,
            padding: "4px 12px",
            marginBottom: 12,
          }}
        >
          FluentFox Admin
        </span>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 26,
            margin: 0,
            color: dark ? C.textDark : C.text,
            lineHeight: 1.05,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p
            style={{
              fontSize: 13,
              color: dark ? C.mutedDark : C.muted,
              marginTop: 8,
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        border: "2px solid rgba(255,255,255,.14)",
        borderTopColor: C.orange,
        borderRadius: "50%",
        animation: "ffSpin .7s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

function Card({ children, accent, light = false, style = {} }) {
  return (
    <div
      style={{
        background: light
          ? C.white
          : "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))",
        border: `1px solid ${light ? C.border : C.borderDark}`,
        borderTop: accent ? `3px solid ${accent}` : undefined,
        borderRadius: 20,
        padding: "20px 22px",
        boxShadow: light
          ? "0 16px 34px rgba(0,0,0,.05)"
          : "0 18px 40px rgba(0,0,0,.16)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({ icon, text, dark = false }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "42px 18px",
        background: dark ? "rgba(255,255,255,.03)" : C.white,
        border: `1px solid ${dark ? C.borderDark : C.border}`,
        borderRadius: 18,
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <p
        style={{
          fontSize: 13,
          color: dark ? C.mutedDark : C.muted,
          margin: 0,
          lineHeight: 1.7,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Alert({ type = "error", children }) {
  const map = {
    error: ["#c0392b", "#ff8a8a"],
    info: [C.blue, "#8cbcff"],
    success: [C.green, "#7ee0b6"],
    warn: [C.yellow, "#ffd77d"],
  };
  const [bg, fg] = map[type] || map.error;

  return (
    <div
      style={{
        background: `${bg}18`,
        border: `1px solid ${bg}44`,
        color: fg,
        borderRadius: 14,
        padding: "11px 14px",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.66)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "86vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #fff, #fffaf5)",
          borderRadius: 22,
          border: "1px solid rgba(0,0,0,.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,.35)",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "'Fraunces', serif",
              fontSize: 22,
              color: C.text,
            }}
          >
            {title}
          </h3>
          <button onClick={onClose} style={{ ...btn("ghost"), padding: "6px 10px" }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Table({ cols, rows, renderRow, dark = false }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  padding: "12px 14px",
                  textAlign: "left",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: dark ? C.mutedDark : C.muted,
                  borderBottom: `1px solid ${dark ? C.borderDark : C.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={cols.length}
                style={{
                  padding: "24px 14px",
                  color: dark ? C.mutedDark : C.muted,
                  textAlign: "center",
                }}
              >
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${dark ? C.borderDark : C.border}`,
                }}
              >
                {renderRow(row)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Td({ children, mono, dark = false }) {
  return (
    <td
      style={{
        padding: "12px 14px",
        color: dark ? C.textDark : C.text,
        fontFamily: mono ? "monospace" : "inherit",
        fontSize: mono ? 11 : 12,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */
function normalizeList(data, keys = []) {
  if (Array.isArray(data)) return data;
  for (const k of keys) {
    if (Array.isArray(data?.[k])) return data[k];
  }
  return [];
}

function formatDate(dateLike) {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeLeft(expiresAt) {
  if (!expiresAt) return "—";
  const diff = new Date(expiresAt) - new Date();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

function money(v) {
  if (v === null || v === undefined || v === "") return "Contact us";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

function normalizePlan(p, index = 0) {
  return {
    id: p.id || p._id || p.plan_id || p.planId || `plan-${index}`,
    name: p.name || p.title || `Plan ${index + 1}`,
    description:
      p.description ||
      p.desc ||
      "A flexible plan for interview practice and access.",
    price_inr:
      p.price_inr ??
      p.price ??
      p.amount_inr ??
      p.amount ??
      p.monthly_price ??
      p.cost ??
      null,
    credits:
      p.credits ??
      p.credit_count ??
      p.sessions ??
      p.session_credits ??
      null,
    interval: p.interval || p.billing_cycle || p.period || "",
    popular: Boolean(p.popular || p.is_popular || p.featured || index === 1),
    active: p.active !== false && p.is_active !== false,
    raw: p,
  };
}

function normalizeSettingEntries(settings) {
  if (!settings) return [];
  if (Array.isArray(settings)) return settings;
  if (typeof settings !== "object") return [];
  return Object.entries(settings);
}

/* ─── LOGIN PAGE ─────────────────────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await ffLogin(email, password);
      if (user.role !== "personal_admin") {
        ffLogout();
        setError("Access denied. Personal admin only.");
      } else {
        onLogin(user);
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top, rgba(255,75,0,.14), transparent 32%), ${PAGE_BG}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        * { box-sizing: border-box; }
        @keyframes glow { 0%,100%{opacity:.55} 50%{opacity:1} }
        input::placeholder { color: rgba(0,0,0,0.28); }
        input:focus { border-color: ${C.orange} !important; box-shadow: 0 0 0 3px ${C.orange}22; }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.orange}18 0%, transparent 70%)`,
            animation: "glow 5s ease-in-out infinite",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          background: "linear-gradient(180deg, #fff, #fffaf5)",
          border: `1px solid rgba(0,0,0,.08)`,
          borderRadius: 26,
          padding: 34,
          boxShadow: "0 30px 80px rgba(0,0,0,0.14)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 54,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})`,
              marginBottom: 12,
              boxShadow: "0 16px 30px rgba(255,75,0,.22)",
            }}
          >
            <span style={{ fontSize: 24 }}>🦊</span>
          </div>
          <span
            style={{
              display: "block",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 6,
            }}
          >
            FluentFox
          </span>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              margin: 0,
              color: C.text,
            }}
          >
            Personal Admin
          </h1>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
            Sign in to manage plans, users, payments, visitors, and affiliates.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                display: "block",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fluentfox.ai"
              required
              style={input}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                display: "block",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={input}
            />
          </div>

          {error && <Alert type="error">{error}</Alert>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...btn("primary"),
              width: "100%",
              padding: "13px 20px",
              fontSize: 12,
              marginTop: 4,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Badge label="Secure access" color={C.green} light />
          <Badge label="Personal admin" color={C.orange} light />
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD TAB ───────────────────────────────────────────────────────── */
function DashboardTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchDashboard()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <Alert type="error">Failed to load dashboard data.</Alert>;

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        sub="Overview of FluentFox activity and business performance."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <StatCard label="Total Users" value={data.total_users ?? 0} accent={C.orange} light />
        <StatCard label="Revenue (INR)" value={`₹${data.total_revenue_inr ?? 0}`} accent={C.green} light />
        <StatCard label="Affiliates" value={data.total_affiliates ?? 0} accent={C.blue} light />
        <StatCard label="Pending Payouts" value={`₹${data.total_pending_payout ?? 0}`} accent={C.yellow} light />
        <StatCard label="Tracked Visitors" value={data.total_tracked_visitors ?? 0} accent="#8b5cf6" light />
        <StatCard label="Today's Logins" value={data.today_logins ?? 0} accent="#16c784" light />
      </div>

      <Card light accent={C.orange}>
        <p
          style={{
            fontSize: 11,
            color: C.muted,
            margin: 0,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Quick Tips
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 2, color: C.text, fontSize: 13 }}>
          <li>Use the Plans tab to edit pricing and credits.</li>
          <li>Use the Affiliates tab to approve payouts when ready.</li>
          <li>
            <strong>TEST_MODE=true</strong> means payments are instant in this panel.
          </li>
          <li>Switch to real payments later after adding Razorpay keys.</li>
        </ul>
      </Card>
    </div>
  );
}

/* ─── VISITORS TAB ────────────────────────────────────────────────────────── */
function VisitorsTab() {
  const [allData, setAllData] = useState(null);
  const [todayData, setTodayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all");

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchPersonalUsers({ limit: 250 }), fetchTodayUsers()])
      .then(([all, today]) => {
        if (!mounted) return;
        setAllData(all);
        setTodayData(normalizeList(today, ["users", "data", "items"]));
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Spinner />;

  const users = view === "today"
    ? todayData
    : normalizeList(allData, ["users", "data", "items"]);

  const stats = allData?.stats || allData?.summary || null;

  return (
    <div>
      <SectionHeader
        title="Visitors & Logins"
        sub="Track signups, logins, and returning users."
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <button style={pill(view === "all")} onClick={() => setView("all")}>
              All
            </button>
            <button style={pill(view === "today")} onClick={() => setView("today")}>
              Today
            </button>
          </div>
        }
      />

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <StatCard label="Total Visitors" value={stats.total_visitors ?? 0} accent={C.orange} light />
          <StatCard label="New Users" value={stats.new_users ?? 0} accent={C.green} light />
          <StatCard label="Returning" value={stats.returning_users ?? 0} accent={C.blue} light />
          <StatCard label="Google Logins" value={stats.google_logins ?? 0} accent={C.yellow} light />
          <StatCard label="Email Logins" value={stats.email_logins ?? 0} accent="#8b5cf6" light />
          <StatCard label="Signups" value={stats.signups ?? 0} accent="#16c784" light />
        </div>
      )}

      <Card light>
        <Table
          cols={["User", "Email", "Method", "First Seen", "Last Seen", "Sessions", "Type"]}
          rows={users}
          renderRow={(r) => (
            <>
              <Td>{r.name || "—"}</Td>
              <Td>{r.email || "—"}</Td>
              <Td>
                <Badge
                  label={r.login_method || "unknown"}
                  color={r.login_method === "google" ? C.blue : C.orange}
                  light
                />
              </Td>
              <Td>{r.logged_in_at ? formatDate(r.logged_in_at) : "—"}</Td>
              <Td>{r.last_seen_at ? new Date(r.last_seen_at).toLocaleString() : "—"}</Td>
              <Td>{r.session_count ?? 0}</Td>
              <Td>
                <Badge
                  label={r.is_returning ? "Returning" : "New"}
                  color={r.is_returning ? C.green : C.orange}
                  light
                />
              </Td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

/* ─── PLANS TAB ───────────────────────────────────────────────────────────── */
function PlansTab() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // "create" | plan object | null
  const [form, setForm] = useState({
    name: "",
    description: "",
    price_inr: "",
    credits: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllPlans();
      const list = normalizeList(res, ["plans", "data", "items"]).map(normalizePlan);
      setPlans(list);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Failed to load plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm({ name: "", description: "", price_inr: "", credits: "" });
    setModal("create");
    setMsg("");
  }

  function openEdit(plan) {
    setForm({
      name: plan.name || "",
      description: plan.description || "",
      price_inr: plan.price_inr ?? "",
      credits: plan.credits ?? "",
    });
    setModal(plan);
    setMsg("");
  }

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price_inr: Number(form.price_inr),
        credits: Number(form.credits),
      };

      if (modal === "create") {
        await createPlan(payload);
      } else {
        await updatePlan(modal.id, payload);
      }

      await load();
      setModal(null);
    } catch (err) {
      setMsg(err.message || "Failed to save plan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(plan) {
    if (!window.confirm(`Deactivate "${plan.name}"?`)) return;
    await deactivatePlan(plan.id);
    load();
  }

  async function handleReactivate(plan) {
    await updatePlan(plan.id, { is_active: true });
    load();
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Plans"
        sub="Create, edit, activate, or deactivate subscription plans."
        right={<button style={btn("primary")} onClick={openCreate}>+ New Plan</button>}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 14,
        }}
      >
        {plans.map((plan, i) => {
          const isPopular = plan.popular || i === 1;
          return (
            <div
              key={plan.id}
              style={{
                background: isPopular
                  ? "linear-gradient(180deg, #fff7f2, #ffffff)"
                  : "#fff",
                border: `1px solid ${isPopular ? "rgba(255,75,0,.18)" : C.border}`,
                borderTop: `3px solid ${isPopular ? C.orange : C.blue}`,
                borderRadius: 20,
                padding: 22,
                boxShadow: "0 16px 34px rgba(0,0,0,.05)",
                opacity: plan.active ? 1 : 0.68,
                position: "relative",
              }}
            >
              {isPopular && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: C.orange,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: 999,
                  }}
                >
                  Most popular
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Badge
                  label={plan.active ? "Active" : "Inactive"}
                  color={plan.active ? C.green : C.muted}
                  light
                />
                <span style={{ fontSize: 10, color: C.muted }}>#{plan.id}</span>
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                  fontFamily: "'Fraunces', serif",
                  fontSize: 22,
                  color: C.text,
                }}
              >
                {plan.name}
              </h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 14px" }}>
                {plan.description || "—"}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  gap: 14,
                }}
              >
                <div>
                  <p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                    Price
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: C.orange, margin: 0 }}>
                    {money(plan.price_inr)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                    Credits
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: C.blue, margin: 0 }}>
                    {plan.credits ?? "—"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={{ ...btn("ghost"), flex: 1 }} onClick={() => openEdit(plan)}>
                  Edit
                </button>
                {plan.active ? (
                  <button style={{ ...btn("danger"), flex: 1 }} onClick={() => handleDeactivate(plan)}>
                    Deactivate
                  </button>
                ) : (
                  <button style={{ ...btn("blue"), flex: 1 }} onClick={() => handleReactivate(plan)}>
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal
          title={modal === "create" ? "Create Plan" : `Edit Plan — ${modal.name}`}
          onClose={() => setModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Plan Name", key: "name", placeholder: "e.g. Pro" },
              { label: "Description", key: "description", placeholder: "e.g. 5 interview sessions" },
              { label: "Price (₹ INR)", key: "price_inr", placeholder: "e.g. 799", type: "number" },
              { label: "Credits", key: "credits", placeholder: "e.g. 5", type: "number" },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.muted,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </label>
                <input
                  type={type || "text"}
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  style={input}
                />
              </div>
            ))}

            {msg && <Alert type="error">{msg}</Alert>}

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...btn("ghost"), flex: 1 }} onClick={() => setModal(null)}>
                Cancel
              </button>
              <button style={{ ...btn("primary"), flex: 1 }} onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Plan"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── PAYMENTS TAB ─────────────────────────────────────────────────────────── */
function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAllPayments()
      .then((res) => {
        if (!mounted) return;
        setPayments(normalizeList(res, ["payments", "data", "items"]));
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const successful = payments.filter((p) => p.status === "success");
  const totalSpent = successful.reduce((s, p) => s + Number(p.amount_inr || 0), 0);
  const totalCredits = successful.reduce((s, p) => s + Number(p.credits_added || 0), 0);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Payments"
        sub="All payment records across the platform."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard label="Total Revenue" value={`₹${totalSpent}`} accent={C.green} light />
        <StatCard label="Credits Sold" value={totalCredits} accent={C.blue} light />
        <StatCard label="Transactions" value={successful.length} accent={C.orange} light />
        <StatCard
          label="Pending"
          value={payments.filter((p) => p.status === "pending").length}
          accent={C.yellow}
          light
        />
      </div>

      <Card light>
        <Table
          cols={["User", "Plan", "Amount", "Credits", "Status", "Affiliate", "Commission", "Date"]}
          rows={payments}
          renderRow={(p) => (
            <>
              <Td>
                {p.user_name || "—"}
                <br />
                <span style={{ fontSize: 10, color: C.muted }}>{p.user_email || ""}</span>
              </Td>
              <Td>{p.plan_name || "—"}</Td>
              <Td>₹{Number(p.amount_inr || 0)}</Td>
              <Td>{Number(p.credits_added || 0)}</Td>
              <Td>
                <Badge
                  label={p.status || "unknown"}
                  color={
                    p.status === "success"
                      ? C.green
                      : p.status === "pending"
                      ? C.yellow
                      : C.red
                  }
                  light
                />
              </Td>
              <Td mono>{p.affiliate_code || "—"}</Td>
              <Td>
                {Number(p.commission_amount || 0) > 0
                  ? `₹${p.commission_amount} (${p.commission_percent}%)`
                  : "—"}
              </Td>
              <Td>{p.created_at ? formatDate(p.created_at) : "—"}</Td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

/* ─── USERS TAB ───────────────────────────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [newCredits, setNewCredits] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers();
      setUsers(normalizeList(res, ["users", "data", "items"]));
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveCredits() {
    if (!editUser) return;
    setSaving(true);
    setMsg("");
    try {
      await setUserCredits(editUser.id, Number(newCredits));
      await load();
      setEditUser(null);
    } catch (err) {
      setMsg(err.message || "Failed to update credits.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Registered Users" sub="All accounts in the system." />

      <Card light>
        <Table
          cols={["Name", "Email", "Role", "Credits", "Joined", "Actions"]}
          rows={users}
          renderRow={(u) => (
            <>
              <Td>{u.name || "—"}</Td>
              <Td>{u.email || "—"}</Td>
              <Td>
                <Badge
                  label={u.role || "user"}
                  color={
                    u.role === "personal_admin"
                      ? C.orange
                      : u.role === "admin"
                      ? C.blue
                      : C.muted
                  }
                  light
                />
              </Td>
              <Td>{u.credits ?? 0}</Td>
              <Td>{u.created_at ? formatDate(u.created_at) : "—"}</Td>
              <Td>
                <button
                  style={{ ...btn("ghost"), fontSize: 10, padding: "6px 12px" }}
                  onClick={() => {
                    setEditUser(u);
                    setNewCredits(String(u.credits ?? 0));
                    setMsg("");
                  }}
                >
                  Set Credits
                </button>
              </Td>
            </>
          )}
        />
      </Card>

      {editUser && (
        <Modal title={`Set Credits — ${editUser.name || editUser.email}`} onClose={() => setEditUser(null)}>
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.6 }}>
            Current: <strong style={{ color: C.text }}>{editUser.credits ?? 0}</strong> credits
          </p>

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                display: "block",
                marginBottom: 6,
              }}
            >
              New Credit Amount
            </label>
            <input
              type="number"
              min="0"
              value={newCredits}
              onChange={(e) => setNewCredits(e.target.value)}
              style={input}
            />
          </div>

          {msg && <Alert type="error">{msg}</Alert>}

          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...btn("ghost"), flex: 1 }} onClick={() => setEditUser(null)}>
              Cancel
            </button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleSaveCredits} disabled={saving}>
              {saving ? "Saving…" : "Update Credits"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── AFFILIATES TAB ──────────────────────────────────────────────────────── */
function AffiliatesTab() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commModal, setCommModal] = useState(null);
  const [newComm, setNewComm] = useState("");
  const [payoutModal, setPayoutModal] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [payoutNote, setPayoutNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [defaultComm, setDefaultComm] = useState("");
  const [savingDefault, setSavingDefault] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllAffiliates();
      setAffiliates(normalizeList(res, ["affiliates", "data", "items"]));
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Failed to load affiliates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdateComm() {
    if (!commModal) return;
    setSaving(true);
    setMsg("");
    try {
      await updateAffiliateCommission(commModal.id, Number(newComm));
      await load();
      setCommModal(null);
    } catch (err) {
      setMsg(err.message || "Failed to update commission.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(aff) {
    await toggleAffiliate(aff.id);
    load();
  }

  async function handleApprovePayout(aff) {
    setSaving(true);
    setMsg("");
    try {
      await approveAffiliatePayout(aff.id, payoutNote);
      await load();
      setPayoutModal(null);
      setPayoutNote("");
    } catch (err) {
      setMsg(err.message || "Failed to approve payout.");
    } finally {
      setSaving(false);
    }
  }

  async function openPayouts(aff) {
    setPayoutModal(aff);
    setMsg("");
    setPayoutNote("");
    const history = await fetchAffiliatePayouts(aff.id).catch(() => []);
    setPayouts(normalizeList(history, ["payouts", "data", "items"]));
  }

  async function handleDefaultComm() {
    setSavingDefault(true);
    try {
      await updateDefaultCommission(Number(defaultComm));
      setMsg("Default commission updated.");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      setMsg(err.message || "Failed to update default commission.");
    } finally {
      setSavingDefault(false);
    }
  }

  if (loading) return <Spinner />;

  const totalPending = affiliates.reduce((s, a) => s + Number(a.pending_payout || 0), 0);
  const totalEarned = affiliates.reduce((s, a) => s + Number(a.total_earned || 0), 0);

  return (
    <div>
      <SectionHeader title="Affiliates" sub="Manage affiliate commissions and payouts." />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard label="Total Affiliates" value={affiliates.length} accent={C.orange} light />
        <StatCard label="Total Earned" value={`₹${totalEarned}`} accent={C.green} light />
        <StatCard label="Pending Payouts" value={`₹${totalPending}`} accent={C.yellow} light />
        <StatCard
          label="Active"
          value={affiliates.filter((a) => a.is_active).length}
          accent={C.blue}
          light
        />
      </div>

      <Card light style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                margin: 0,
                marginBottom: 6,
              }}
            >
              Default commission % for new affiliates
            </p>
            <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              Set the commission rate used when a new affiliate joins.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="number"
              min="0"
              max="100"
              value={defaultComm}
              onChange={(e) => setDefaultComm(e.target.value)}
              placeholder="10"
              style={{ ...input, width: 110 }}
            />
            <button style={btn("primary")} onClick={handleDefaultComm} disabled={savingDefault}>
              {savingDefault ? "…" : "Update"}
            </button>
          </div>
        </div>
      </Card>

      {msg && <Alert type={msg.includes("updated") ? "success" : "error"}>{msg}</Alert>}

      <Card light>
        <Table
          cols={[
            "User",
            "Code",
            "Commission %",
            "Total Earned",
            "Pending",
            "Paid Out",
            "Referrals",
            "Status",
            "Actions",
          ]}
          rows={affiliates}
          renderRow={(a) => (
            <>
              <Td>
                {a.user_name || "—"}
                <br />
                <span style={{ fontSize: 10, color: C.muted }}>{a.user_email || ""}</span>
              </Td>
              <Td mono>{a.code || "—"}</Td>
              <Td>{a.commission_percent ?? 0}%</Td>
              <Td>₹{Number(a.total_earned || 0)}</Td>
              <Td style={{ color: Number(a.pending_payout || 0) > 0 ? C.yellow : C.muted }}>
                ₹{Number(a.pending_payout || 0)}
              </Td>
              <Td>₹{Number(a.total_paid_out || 0)}</Td>
              <Td>{Number(a.total_referrals || 0)}</Td>
              <Td>
                <Badge
                  label={a.is_active ? "Active" : "Inactive"}
                  color={a.is_active ? C.green : C.muted}
                  light
                />
              </Td>
              <Td>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    style={{ ...btn("ghost"), fontSize: 10, padding: "5px 10px" }}
                    onClick={() => {
                      setCommModal(a);
                      setNewComm(String(a.commission_percent ?? 0));
                      setMsg("");
                    }}
                  >
                    Commission
                  </button>
                  <button
                    style={{ ...btn(a.is_active ? "danger" : "blue"), fontSize: 10, padding: "5px 10px" }}
                    onClick={() => handleToggle(a)}
                  >
                    {a.is_active ? "Disable" : "Enable"}
                  </button>
                  <button
                    style={{
                      ...btn(Number(a.pending_payout || 0) > 0 ? "primary" : "ghost"),
                      fontSize: 10,
                      padding: "5px 10px",
                    }}
                    onClick={() => openPayouts(a)}
                  >
                    Payouts
                  </button>
                </div>
              </Td>
            </>
          )}
        />
      </Card>

      {commModal && (
        <Modal
          title={`Commission — ${commModal.user_name || commModal.code}`}
          onClose={() => setCommModal(null)}
        >
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>
            Current: <strong style={{ color: C.text }}>{commModal.commission_percent}%</strong>
          </p>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                display: "block",
                marginBottom: 6,
              }}
            >
              New Commission %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={newComm}
              onChange={(e) => setNewComm(e.target.value)}
              style={input}
            />
          </div>

          {msg && <Alert type="error">{msg}</Alert>}

          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...btn("ghost"), flex: 1 }} onClick={() => setCommModal(null)}>
              Cancel
            </button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleUpdateComm} disabled={saving}>
              {saving ? "Saving…" : "Update"}
            </button>
          </div>
        </Modal>
      )}

      {payoutModal && (
        <Modal
          title={`Payouts — ${payoutModal.user_name || payoutModal.code}`}
          onClose={() => {
            setPayoutModal(null);
            setMsg("");
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <StatCard
                label="Pending Payout"
                value={`₹${Number(payoutModal.pending_payout || 0)}`}
                accent={C.yellow}
                light
              />
              <StatCard
                label="Total Paid Out"
                value={`₹${Number(payoutModal.total_paid_out || 0)}`}
                accent={C.green}
                light
              />
            </div>

            {Number(payoutModal.pending_payout || 0) > 0 && (
              <Card light style={{ background: "#fff8ee" }}>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.muted,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Payout Note (optional)
                </label>
                <input
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  placeholder="e.g. Bank transfer done"
                  style={input}
                />
                {msg && (
                  <p style={{ color: C.red, fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                    {msg}
                  </p>
                )}
                <button
                  style={{ ...btn("primary"), width: "100%", marginTop: 12 }}
                  onClick={() => handleApprovePayout(payoutModal)}
                  disabled={saving}
                >
                  {saving ? "Processing…" : `✓ Approve ₹${Number(payoutModal.pending_payout || 0)} Payout`}
                </button>
              </Card>
            )}
          </div>

          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 10,
            }}
          >
            Payout History
          </p>

          {payouts.length === 0 ? (
            <EmptyState icon="📭" text="No payouts yet." dark={false} />
          ) : (
            payouts.map((p) => (
              <div
                key={p.id}
                style={{
                  borderBottom: `1px solid ${C.border}`,
                  padding: "10px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  fontSize: 12,
                }}
              >
                <div>
                  <span style={{ color: C.green, fontWeight: 800 }}>₹{p.amount}</span>
                  <span style={{ color: C.muted, marginLeft: 10 }}>
                    by {p.approved_by_name || "admin"}
                  </span>
                  {p.note && <span style={{ color: C.muted, marginLeft: 10 }}>· {p.note}</span>}
                </div>
                <span style={{ color: C.muted }}>{formatDate(p.approved_at)}</span>
              </div>
            ))
          )}
        </Modal>
      )}
    </div>
  );
}

/* ─── SETTINGS TAB ───────────────────────────────────────────────────────── */
function SettingsTab() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState("");
  const [editVal, setEditVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSettings();
      setSettings(res?.settings || res || {});
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    if (!editKey) return;
    setSaving(true);
    setMsg("");
    try {
      await updateSetting(editKey, editVal);
      await load();
      setMsg("Setting updated!");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      setMsg(err.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  const entries = normalizeSettingEntries(settings);

  return (
    <div>
      <SectionHeader
        title="App Settings"
        sub="Global configuration for FluentFox."
      />

      <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
        {entries.length === 0 ? (
          <EmptyState icon="⚙️" text="No settings found." dark={false} />
        ) : (
          entries.map(([key, value]) => (
            <Card key={key} light>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: C.muted,
                      margin: 0,
                      marginBottom: 4,
                    }}
                  >
                    {key}
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.text,
                      fontFamily: "monospace",
                      margin: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    {String(value)}
                  </p>
                </div>
                <button
                  style={{ ...btn("ghost"), fontSize: 10 }}
                  onClick={() => {
                    setEditKey(key);
                    setEditVal(String(value));
                    setMsg("");
                  }}
                >
                  Edit
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {editKey && (
        <Card light style={{ borderTop: `3px solid ${C.blue}` }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: C.text, marginBottom: 14 }}>
            Editing:{" "}
            <span style={{ color: C.orange, fontFamily: "monospace" }}>{editKey}</span>
          </p>
          <div style={{ marginBottom: 14 }}>
            <input value={editVal} onChange={(e) => setEditVal(e.target.value)} style={input} />
          </div>
          {msg && (
            <p
              style={{
                fontSize: 12,
                color: msg.includes("updated") ? C.green : C.red,
                marginBottom: 10,
              }}
            >
              {msg}
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...btn("ghost") }} onClick={() => setEditKey("")}>
              Cancel
            </button>
            <button style={{ ...btn("primary") }} onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Setting"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── MAIN DASHBOARD SHELL ───────────────────────────────────────────────── */
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "visitors", label: "Visitors", icon: "👥" },
  { id: "plans", label: "Plans", icon: "💳" },
  { id: "payments", label: "Payments", icon: "📄" },
  { id: "users", label: "Users", icon: "🧑‍💻" },
  { id: "affiliates", label: "Affiliates", icon: "🤝" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function DashboardShell({ user, onLogout }) {
  const [tab, setTab] = useState("dashboard");

  const tabContent = useMemo(
    () => ({
      dashboard: <DashboardTab />,
      visitors: <VisitorsTab />,
      plans: <PlansTab />,
      payments: <PaymentsTab />,
      users: <UsersTab />,
      affiliates: <AffiliatesTab />,
      settings: <SettingsTab />,
    }),
    []
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PAGE_BG,
        color: C.text,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: ${C.orange}; color: #fff; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 999px; }
        input::placeholder { color: rgba(0,0,0,.28); }
        input:focus { border-color: ${C.orange} !important; box-shadow: 0 0 0 3px ${C.orange}22; outline: none; }
        @keyframes ffSpin { to { transform: rotate(360deg); } }
        @keyframes ffFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* hero strip */}
      <div
        style={{
          position: "relative",
          background: `linear-gradient(135deg, #e63c00 0%, ${C.orange} 45%, #ff6a1a 100%)`,
          color: "#fff",
          overflow: "hidden",
          boxShadow: "0 18px 44px rgba(255,75,0,.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -70,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(0,0,0,.08)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "28px 20px 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🦊
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  FluentFox
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 13, opacity: 0.88 }}>
                  Personal Admin Dashboard
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,.14)",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 999,
                  padding: "6px 14px",
                }}
              >
                <span style={{ fontSize: 14 }}>🎯</span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>{user?.credits ?? 0}</span>
                <span style={{ fontSize: 10, opacity: 0.82 }}>credits</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,.14)",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 999,
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.18)",
                    border: "1px solid rgba(255,255,255,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    maxWidth: 170,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name || user?.email || "User"}
                </span>
              </div>

              <button style={btn("ghost")} onClick={() => window.open("/", "_self")}>
                Home
              </button>
              <button style={btn("ghost")} onClick={() => window.open("/access-pricing", "_self")}>
                Pricing
              </button>
              <button
                style={btn("ghost")}
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,.10)",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 18,
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
                  {user?.credits ?? 0}
                </p>
                <span style={{ fontSize: 12, opacity: 0.8 }}>credits available</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.10)",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 18,
                padding: "16px 18px",
              }}
            >
              <p style={{ margin: 0, fontSize: 12, opacity: 0.85, marginBottom: 4 }}>
                Fast access
              </p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
                Buy a plan, generate a key, start a session
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,.10)",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 18,
                padding: "16px 18px",
              }}
            >
              <p style={{ margin: 0, fontSize: 12, opacity: 0.85, marginBottom: 4 }}>
                Current account
              </p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
                {user?.name || user?.email || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* tab bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,.72)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: 2,
            overflowX: "auto",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "15px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: tab === t.id ? C.orange : C.muted,
                borderBottom: `2px solid ${tab === t.id ? C.orange : "transparent"}`,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "28px 20px 64px",
        }}
      >
        <div
          style={{
            animation: "ffFadeIn .25s ease",
          }}
        >
          {tabContent[tab]}
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function PersonalAdmin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    ffGetMe()
      .then((u) => {
        if (u?.role === "personal_admin") setUser(u);
        else ffLogout();
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  function handleLogout() {
    ffLogout();
    setUser(null);
  }

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: PAGE_BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.muted,
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={setUser} />;
  return <DashboardShell user={user} onLogout={handleLogout} />;
}