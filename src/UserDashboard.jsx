// UserDashboard.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ffGetMe,
  ffLogout,
  fetchActivePlans,
  testAddCredits,
  generateUserKey,
  fetchMyKeys,
  startSession,
  stopSession,
  fetchMyPaymentHistory,
  joinAffiliate,
  fetchMyAffiliateStats,
  fetchMyReferrals,
  createPaymentOrder,
  verifyPayment,
} from "./api3";

const FF = {
  orange: "#ff4b00",
  orangeLight: "#ff7a24",
  orangePale: "#fff5e6",
  blue: "#0077ff",
  dark: "#0b0b10",
  dark2: "#111118",
  dark3: "#18181f",
  card: "#15151d",
  card2: "#ffffff",
  borderDark: "rgba(255,255,255,0.08)",
  borderLight: "rgba(0,0,0,0.08)",
  mutedDark: "rgba(255,255,255,0.42)",
  mutedLight: "#667085",
  textDark: "#eef2ff",
  textLight: "#111111",
  green: "#16c784",
  yellow: "#f5a623",
  red: "#ef4444",
};

const TABS = [
  { id: "overview", label: "Overview", icon: "▣" },
  { id: "credits", label: "Credits & Plans", icon: "💳" },
  { id: "keys", label: "Interview Keys", icon: "🗝️" },
  { id: "payments", label: "Payments", icon: "📄" },
  { id: "affiliate", label: "Affiliate", icon: "🤝" },
];

const FALLBACK_PLANS = [
  {
    id: "standard",
    name: "Standard",
    description: "Unlimited sessions · Private audio · Resume & JD upload",
    price_inr: 499,
    credits: 20,
    popular: false,
    active: true,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Everything in Standard + coaching tools, feedback & mock sessions",
    price_inr: 999,
    credits: 50,
    popular: true,
    active: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For cohorts, colleges, and hiring teams that need bundled access",
    price_inr: 1999,
    credits: 100,
    popular: false,
    active: true,
  },
];

function isActiveKey(k) {
  if (!k) return false;
  const exp = k.expires_at ? new Date(k.expires_at) : null;
  return !k.used && !k.revoked && (!exp || exp > new Date());
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

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.plans)) return data.plans;
  if (Array.isArray(data?.payments)) return data.payments;
  if (Array.isArray(data?.keys)) return data.keys;
  if (Array.isArray(data?.referrals)) return data.referrals;
  if (Array.isArray(data?.data)) return data.data;
  return [];
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
    credits: p.credits ?? p.credit_count ?? p.sessions ?? p.session_credits ?? 1,
    interval: p.interval || p.billing_cycle || p.period || "",
    popular: Boolean(p.popular || p.is_popular || p.featured || index === 1),
    active: p.active !== false,
  };
}

function Spinner() {
  return (
    <span
      style={{
        width: 18,
        height: 18,
        border: "2px solid rgba(255,255,255,0.16)",
        borderTopColor: FF.orange,
        borderRadius: "50%",
        animation: "ffSpin 0.75s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

function Pill({ children, bg = "rgba(255,75,0,0.1)", color = FF.orange }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        background: bg,
        color,
        borderRadius: 999,
        padding: "4px 12px",
        marginBottom: 12,
      }}
    >
      {children}
    </span>
  );
}

function SLabel({ children, light = false }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: light ? "#666" : "rgba(255,255,255,0.55)",
        margin: "0 0 10px",
      }}
    >
      {children}
    </p>
  );
}

function Badge({ label, color = FF.orange, dark = false }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: dark ? `${color}1f` : `${color}14`,
        color,
        border: `1px solid ${color}44`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Card({ children, accent, dark = true, style = {} }) {
  return (
    <div
      style={{
        background: dark
          ? "linear-gradient(180deg, rgba(26,26,34,0.98), rgba(16,16,24,0.98))"
          : "#fff",
        border: dark ? `1px solid ${FF.borderDark}` : `1px solid ${FF.borderLight}`,
        borderRadius: 20,
        padding: "18px 20px",
        borderTop: accent ? `3px solid ${accent}` : undefined,
        boxShadow: dark ? "0 14px 34px rgba(0,0,0,.18)" : "0 14px 34px rgba(0,0,0,.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Alert({ type = "error", children }) {
  const colors = {
    error: ["#c0392b", "#ffb3b3"],
    info: [FF.blue, "#bddcff"],
    success: [FF.green, "#b7f0d7"],
  };
  const [bg, fg] = colors[type] || colors.error;

  return (
    <div
      style={{
        background: `${bg}18`,
        border: `1px solid ${bg}44`,
        borderRadius: 14,
        padding: "11px 14px",
        fontSize: 12,
        color: fg,
        marginBottom: 12,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

function ActionBtn({
  onClick,
  children,
  variant = "primary",
  disabled,
  loading,
  fullWidth,
  small,
}) {
  const bg = {
    primary: FF.orange,
    blue: FF.blue,
    ghost: "rgba(255,255,255,0.06)",
    green: FF.green,
    danger: FF.red,
  };

  const border = {
    primary: "none",
    blue: "none",
    ghost: "1px solid rgba(255,255,255,0.12)",
    green: "none",
    danger: "none",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: small ? "7px 12px" : "11px 16px",
        borderRadius: 999,
        border: border[variant] || "none",
        background: bg[variant] || bg.primary,
        color: "#fff",
        fontSize: small ? 11 : 12,
        fontWeight: 800,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? "100%" : undefined,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "transform 0.12s, opacity 0.15s, background 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 16,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 24,
            margin: 0,
            color: "#111",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p style={{ fontSize: 13, color: "#555", margin: "6px 0 0", lineHeight: 1.65 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action || null}
    </div>
  );
}

function EmptyState({ icon, text, action, dark = false }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "34px 18px",
        background: dark ? "rgba(255,255,255,0.03)" : "#fff",
        border: `1px solid ${dark ? FF.borderDark : FF.borderLight}`,
        borderRadius: 18,
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 10 }}>{icon}</div>
      <p style={{ fontSize: 13, color: dark ? FF.mutedDark : FF.mutedLight, margin: 0, lineHeight: 1.6 }}>
        {text}
      </p>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}

function Stat({ label, value, hint, color = FF.orange }) {
  return (
    <Card dark={false} accent={color} style={{ minHeight: 112 }}>
      <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888" }}>
        {label}
      </p>
      <p style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 900, color: "#111", lineHeight: 1 }}>
        {value}
      </p>
      {hint ? <p style={{ margin: 0, fontSize: 11, color: "#666", lineHeight: 1.6 }}>{hint}</p> : null}
    </Card>
  );
}

function normalizeAffiliateError(err) {
  if (!err) return "Unknown affiliate error.";
  return err.message || "Unknown affiliate error.";
}

function OverviewTab({ user, metrics, onSwitchTab, lastPayment, lastKey, affiliate }) {
  const balance = Number(user?.credits ?? 0);
  const hasAffiliate = Boolean(affiliate?.code);

  return (
    <div style={{ animation: "ffFadeIn 0.25s ease" }}>
      <SectionTitle
        title="Dashboard overview"
        subtitle="Everything you need is one click away. No centered card layout, no wasted whitespace."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr 0.95fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <Card accent={FF.orange} style={{ background: "linear-gradient(135deg, #171720 0%, #101019 100%)" }}>
          <Pill bg="rgba(255,75,0,0.16)" color="#ffb78a">
            Welcome back
          </Pill>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 30, margin: "0 0 6px", color: "#fff", lineHeight: 1.05 }}>
                {user?.name || "User"}
              </h3>
              <p style={{ margin: 0, color: FF.mutedDark, lineHeight: 1.6, fontSize: 13 }}>
                {user?.email || "No email loaded"}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                <Badge label={user?.role || "USER"} color="#ffb78a" dark />
                <Badge label={`${balance} credits`} color={FF.green} dark />
                <Badge label={hasAffiliate ? "affiliate active" : "affiliate off"} color={hasAffiliate ? FF.green : FF.mutedDark} dark />
              </div>
            </div>

            <div
              style={{
                width: 82,
                height: 82,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,75,0,.34), transparent 68%)",
                border: `2px solid ${FF.orange}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                flexShrink: 0,
              }}
            >
              🦊
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 18,
              paddingTop: 18,
              borderTop: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <ActionBtn onClick={() => onSwitchTab("credits")} variant="primary">
              Buy credits
            </ActionBtn>
            <ActionBtn onClick={() => onSwitchTab("keys")} variant="ghost">
              Generate key
            </ActionBtn>
            <ActionBtn onClick={() => onSwitchTab("payments")} variant="ghost">
              View payments
            </ActionBtn>
          </div>
        </Card>

        <Card dark={false}>
          <Pill bg="rgba(255,75,0,0.1)" color={FF.orange}>
            Quick actions
          </Pill>
          <div style={{ display: "grid", gap: 10 }}>
            <button
              onClick={() => onSwitchTab("keys")}
              style={{
                border: "1px solid #ececf2",
                background: "#fff",
                borderRadius: 16,
                padding: "13px 14px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Generate an interview key</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Use 1 credit and open a session instantly.</div>
            </button>

            <button
              onClick={() => onSwitchTab("affiliate")}
              style={{
                border: "1px solid #ececf2",
                background: "#fff",
                borderRadius: 16,
                padding: "13px 14px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Affiliate program</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Track referral earnings and payout status.</div>
            </button>

            <button
              onClick={() => onSwitchTab("payments")}
              style={{
                border: "1px solid #ececf2",
                background: "#fff",
                borderRadius: 16,
                padding: "13px 14px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>Payment history</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>See your last purchases and added credits.</div>
            </button>
          </div>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <Stat
          label="Credits"
          value={metrics.credits}
          hint="1 credit = 1 session"
          color={FF.orange}
        />
        <Stat
          label="Keys"
          value={metrics.activeKeys}
          hint="Currently usable keys"
          color={FF.green}
        />
        <Stat
          label="Payments"
          value={metrics.payments}
          hint="Successful purchases"
          color={FF.blue}
        />
        <Stat
          label="Affiliate earnings"
          value={money(metrics.affiliateEarned)}
          hint={affiliate?.code ? `${affiliate.commission_percent || 0}% commission` : "Join affiliate to earn"}
          color={FF.yellow}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr .8fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <Card dark={false} accent={FF.blue}>
          <SectionTitle
            title="Latest payment"
            subtitle="Your newest successful transaction."
            action={
              <ActionBtn onClick={() => onSwitchTab("payments")} variant="ghost" small>
                Open payments
              </ActionBtn>
            }
          />
          {lastPayment ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                background: "#fff",
                border: "1px solid #ececf2",
                borderRadius: 16,
                padding: "14px 16px",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>{lastPayment.plan_name || "Plan"}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{formatDate(lastPayment.created_at)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#111" }}>{money(lastPayment.amount_inr)}</div>
                <div style={{ fontSize: 11, color: FF.green, marginTop: 4 }}>+{lastPayment.credits_added || 0} credits</div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon="💳"
              dark={false}
              text="No successful payments yet. Buy a plan to add credits."
              action={<ActionBtn onClick={() => onSwitchTab("credits")}>Buy credits</ActionBtn>}
            />
          )}
        </Card>

        <Card dark={false} accent={FF.orange}>
          <SectionTitle
            title="Latest key"
            subtitle="Generate a session key from the Keys tab."
            action={<ActionBtn onClick={() => onSwitchTab("keys")} variant="ghost" small>Open keys</ActionBtn>}
          />
          {lastKey ? (
            <div
              style={{
                border: "1px solid #ececf2",
                borderRadius: 16,
                background: "#fff",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: isActiveKey(lastKey) ? FF.green : FF.mutedLight, letterSpacing: "0.08em" }}>
                {isActiveKey(lastKey) ? "ACTIVE" : "INACTIVE"}
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#111", marginTop: 8, letterSpacing: "0.08em", wordBreak: "break-all" }}>
                {lastKey.key}
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 8 }}>
                Expires: {formatDate(lastKey.expires_at)} · {timeLeft(lastKey.expires_at)}
              </div>
            </div>
          ) : (
            <EmptyState
              icon="🗝️"
              dark={false}
              text="No keys yet. Generate one when you are ready to start a live session."
              action={<ActionBtn onClick={() => onSwitchTab("keys")}>Generate key</ActionBtn>}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

// Replace the entire CreditsTab function in UserDashboard.jsx with this

function CreditsTab({ user, onRefresh, onSwitchTab }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchActivePlans();
        const list = normalizeList(data).map(normalizePlan).filter((p) => p.active !== false);
        if (mounted) setPlans(list.length ? list : FALLBACK_PLANS);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setPlans(FALLBACK_PLANS);
          setMsg({ type: "info", text: "Using fallback plans — plans API was unavailable." });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function buyPlan(plan) {
    setBuying(plan.id);
    setMsg(null);

    // ── TEST MODE: instant credits, no Razorpay ──
    const isTestMode = false; // ← set to false once Razorpay keys are live

    if (isTestMode) {
      try {
        const result = await testAddCredits(plan.id);
        const added = result?.credits_added ?? plan.credits ?? "—";
        const bal   = result?.credits_balance ?? "—";
        setMsg({ type: "success", text: `${added} credits added. New balance: ${bal}.` });
        onRefresh?.();
      } catch (err) {
        setMsg({ type: "error", text: err.message || "Failed to add credits." });
      } finally {
        setBuying(null);
      }
      return;
    }

    // ── LIVE MODE: Razorpay checkout ──
    // Make sure Razorpay script is loaded in index.html:
    // <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    try {
      // Step 1: create order on backend
      const order = await createPaymentOrder(plan.id);

      // 100% coupon — already credited, no popup needed
      if (order.free_order) {
        setMsg({ type: "success", text: `Free plan applied! ${order.credits_added} credits added.` });
        onRefresh?.();
        setBuying(null);
        return;
      }

      // Step 2: open Razorpay checkout
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         order.key_id,
          amount:      order.amount,
          currency:    order.currency || "INR",
          order_id:    order.order_id,
          name:        "FluentFox",
          description: `${plan.name} — ${plan.credits} credit${plan.credits > 1 ? "s" : ""}`,
          handler: async (response) => {
            try {
              // Step 3: verify with backend
              let result = await verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
              );

              // If webhook is mid-processing, retry once after 2.5s
              if (result?.retry) {
                await new Promise(r => setTimeout(r, 2500));
                result = await verifyPayment(
                  response.razorpay_order_id,
                  response.razorpay_payment_id,
                  response.razorpay_signature,
                );
              }

              setMsg({
                type: "success",
                text: `Payment successful! ${result.credits_added} credits added. Balance: ${result.credits_balance}.`,
              });
              onRefresh?.();
              resolve();
            } catch (err) {
              setMsg({ type: "error", text: err.message || "Payment verification failed. Contact support." });
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setMsg({ type: "info", text: "Payment cancelled." });
              resolve();
            },
          },
          prefill: {
            email: user?.email || "",
            name:  user?.name  || "",
          },
          theme: { color: "#ff4b00" },
        });
        rzp.open();
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to initiate payment." });
    } finally {
      setBuying(null);
    }
  }

  const sortedPlans = [...plans].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return Number(a.price_inr || 0) - Number(b.price_inr || 0);
  });

  return (
    <div style={{ animation: "ffFadeIn 0.25s ease" }}>
      <SectionTitle
        title="Credits & Plans"
        subtitle="Add credits to your account. 1 credit = 1 live interview session."
        action={
          <ActionBtn onClick={() => onSwitchTab("keys")} variant="ghost" small>
            Go to keys
          </ActionBtn>
        }
      />

      {msg ? <Alert type={msg.type}>{msg.text}</Alert> : null}

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 14, marginBottom: 14 }}>
        <Card accent={FF.orange} style={{ background: "linear-gradient(135deg, #171720 0%, #101019 100%)" }}>
          <Pill bg="rgba(255,75,0,0.16)" color="#ffb78a">Credit balance</Pill>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <p style={{ fontSize: 54, fontWeight: 900, color: FF.orange, margin: "0 0 2px", lineHeight: 1 }}>
                  {user?.credits ?? 0}
                </p>
                <span style={{ fontSize: 16, color: FF.mutedDark, fontWeight: 700 }}>credits</span>
              </div>
              <p style={{ fontSize: 12, color: FF.mutedDark, margin: "6px 0 0", lineHeight: 1.6 }}>
                1 credit = 1 live interview session
              </p>
            </div>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,75,0,.34), transparent 68%)",
              border: `2px solid ${FF.orange}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, flexShrink: 0,
            }}>🎯</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <ActionBtn onClick={() => onSwitchTab("keys")} variant="primary">Generate key</ActionBtn>
            <ActionBtn onClick={() => onSwitchTab("payments")} variant="ghost">Payment history</ActionBtn>
          </div>
        </Card>

        <Card dark={false}>
          <Pill bg="rgba(255,75,0,0.1)" color={FF.orange}>Quick guide</Pill>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Buy a plan below to add credits to your account.",
              "Generate an interview key when you're ready to start a session.",
              "Keys expire after 6 hours if unused — credit is refunded.",
              "Sessions under 10 minutes are automatically refunded.",
            ].map((line) => (
              <div key={line} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#444", lineHeight: 1.6 }}>
                <span style={{ color: FF.green, marginTop: 2 }}>●</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <SectionTitle title="Choose a plan" subtitle="Credits are added to your account immediately after payment." />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Spinner /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {sortedPlans.map((plan, index) => {
            const popular = plan.popular || index === 1;
            const perSession = plan.credits > 1
              ? `₹${Math.round(Number(plan.price_inr) / plan.credits)}/session`
              : null;

            return (
              <div key={plan.id} style={{
                background: popular
                  ? "linear-gradient(180deg, #1d1622 0%, #111118 100%)"
                  : "#fff",
                color: popular ? FF.textDark : FF.textLight,
                border: `1px solid ${popular ? "rgba(255,75,0,.25)" : FF.borderLight}`,
                borderRadius: 20,
                padding: "20px",
                position: "relative",
                boxShadow: popular ? "0 18px 36px rgba(255,75,0,.08)" : "0 12px 28px rgba(0,0,0,.05)",
                display: "flex",
                flexDirection: "column",
              }}>
                {popular ? (
                  <div style={{
                    position: "absolute", top: -10, left: "50%",
                    transform: "translateX(-50%)",
                    background: FF.orange, color: "#fff",
                    fontSize: 9, fontWeight: 900, letterSpacing: "0.16em",
                    textTransform: "uppercase", padding: "4px 12px", borderRadius: 999,
                  }}>Most popular</div>
                ) : null}

                <Badge label={plan.name} color={popular ? "#ffb78a" : FF.orange} dark={popular} />

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "8px 0 4px" }}>
                  <p style={{
                    fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900,
                    margin: 0, color: popular ? "#fff" : "#111",
                  }}>
                    ₹{Number(plan.price_inr).toLocaleString("en-IN")}
                  </p>
                </div>

                {perSession && (
                  <p style={{ fontSize: 11, fontWeight: 700, color: popular ? "#ffb78a" : FF.orange, margin: "0 0 8px" }}>
                    {perSession}
                  </p>
                )}

                <p style={{ fontSize: 13, color: popular ? FF.mutedDark : "#555", lineHeight: 1.65, margin: "0 0 16px" }}>
                  {plan.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {[`${plan.credits} session${plan.credits > 1 ? "s" : ""}`, "Instant access", "Private audio"].map((f) => (
                    <span key={f} style={{
                      background: popular ? "rgba(255,255,255,.06)" : "#f6f6f7",
                      border: `1px solid ${popular ? "rgba(255,255,255,.08)" : "#ececf2"}`,
                      color: popular ? "#dcdce8" : "#444",
                      padding: "7px 11px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700,
                    }}>{f}</span>
                  ))}
                </div>

                <ActionBtn
                  onClick={() => buyPlan(plan)}
                  variant={popular ? "primary" : "ghost"}
                  loading={buying === plan.id}
                  fullWidth
                >
                  {buying === plan.id ? "Processing…" : "Buy now"}
                </ActionBtn>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Alert type="info">
          💳 Payments are processed securely via Razorpay. Credits appear in your account immediately after payment confirmation.
        </Alert>
      </div>
    </div>
  );
}

function KeysTab({ user, onRefresh, onSwitchTab }) {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState(null);
  const [sessionKey, setSessionKey] = useState("");
  const [startingSession, setStartingSession] = useState(false);
  const [stoppingSession, setStoppingSession] = useState(false);
  const [sessionNote, setSessionNote] = useState(null);

  const loadKeys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchMyKeys();
      setKeys(normalizeList(res));
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: err.message || "Failed to load keys." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  async function handleGenerate() {
    if ((user?.credits ?? 0) < 1) {
      setMsg({ type: "error", text: "You have 0 credits. Go to Credits & Plans first." });
      return;
    }

    setGenerating(true);
    setMsg(null);
    setNewKey(null);

    try {
      const result = await generateUserKey();
      setNewKey(result);
      if (!result?.reused) onRefresh?.();
      await loadKeys();
    } catch (err) {
      if (err.code === "NO_CREDITS" || err.status === 403) {
        setMsg({ type: "error", text: "No credits available. Please buy a plan first." });
      } else {
        setMsg({ type: "error", text: err.message || "Failed to generate key." });
      }
    } finally {
      setGenerating(false);
    }
  }

  async function copyKey(k) {
    await navigator.clipboard.writeText(k);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function handleStartSession() {
    if (!sessionKey.trim()) {
      setSessionNote({ type: "error", text: "Paste a key first." });
      return;
    }
    setStartingSession(true);
    setSessionNote(null);
    try {
      const result = await startSession(sessionKey.trim());
      setSessionNote({
        type: "success",
        text: result?.reused ? "Session resumed using an existing key." : "Session started successfully.",
      });
      await loadKeys();
      onRefresh?.();
    } catch (err) {
      setSessionNote({ type: "error", text: err.message || "Failed to start session." });
    } finally {
      setStartingSession(false);
    }
  }

  async function handleStopSession() {
    setStoppingSession(true);
    setSessionNote(null);
    try {
      const result = await stopSession();
      setSessionNote({
        type: "success",
        text: result?.message || "Session stopped.",
      });
      await loadKeys();
      onRefresh?.();
    } catch (err) {
      setSessionNote({ type: "error", text: err.message || "Failed to stop session." });
    } finally {
      setStoppingSession(false);
    }
  }

  const activeKeys = useMemo(() => keys.filter(isActiveKey), [keys]);

  return (
    <div style={{ animation: "ffFadeIn 0.25s ease" }}>
      <SectionTitle
        title="Interview Keys"
        subtitle="Generate a key, start a session, or stop the current session from one place."
        action={
          <ActionBtn onClick={() => onSwitchTab("credits")} variant="ghost" small>
            Buy credits
          </ActionBtn>
        }
      />

      {msg ? <Alert type={msg.type}>{msg.text}</Alert> : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 0.9fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <Card accent={FF.orange} style={{ background: "linear-gradient(135deg, #16161f 0%, #111118 100%)" }}>
          <Pill bg="rgba(255,75,0,0.16)" color="#ffb78a">
            Key generator
          </Pill>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, margin: "0 0 8px", color: "#fff" }}>
            Create a session key
          </h3>
          <p style={{ fontSize: 13, color: FF.mutedDark, margin: 0, lineHeight: 1.7 }}>
            Costs 1 credit. Keys expire in 6 hours if unused. Copy the key and paste it into your interview flow.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <ActionBtn onClick={handleGenerate} loading={generating} variant="primary">
              Generate key
            </ActionBtn>
            <ActionBtn onClick={() => onSwitchTab("credits")} variant="ghost">
              Buy credits
            </ActionBtn>
            <ActionBtn onClick={handleStopSession} loading={stoppingSession} variant="danger">
              Stop session
            </ActionBtn>
          </div>
        </Card>

        <Card dark={false}>
          <SLabel light>Session control</SLabel>
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666" }}>
                Paste key
              </span>
              <input
                value={sessionKey}
                onChange={(e) => setSessionKey(e.target.value)}
                placeholder="FF-XXXXX-XXXXX"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #e6e8ef",
                  background: "#fff",
                  padding: "12px 14px",
                  fontSize: 14,
                  outline: "none",
                  boxShadow: "0 10px 24px rgba(0,0,0,.03)",
                }}
              />
            </label>

            <ActionBtn onClick={handleStartSession} loading={startingSession} variant="blue" fullWidth>
              Start session
            </ActionBtn>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                border: "1px solid #ececf2",
                borderRadius: 14,
                padding: "12px 14px",
              }}
            >
              <span style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Available credits</span>
              <Badge label={`${user?.credits ?? 0}`} color={FF.green} dark={false} />
            </div>
          </div>
        </Card>
      </div>

      {sessionNote ? <Alert type={sessionNote.type}>{sessionNote.text}</Alert> : null}

      {newKey ? (
        <Card accent={FF.green} style={{ marginBottom: 14 }}>
          <SLabel>{newKey.reused ? "Existing active key" : "New key generated"}</SLabel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              background: "rgba(22,199,132,0.08)",
              border: "1px solid rgba(22,199,132,0.18)",
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <code
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: FF.green,
                letterSpacing: "0.12em",
                flex: 1,
                wordBreak: "break-all",
              }}
            >
              {newKey.key}
            </code>
            <ActionBtn onClick={() => copyKey(newKey.key)} variant="ghost" small>
              {copied ? "✓ Copied" : "Copy"}
            </ActionBtn>
          </div>
          <p style={{ fontSize: 11, color: FF.mutedDark, margin: 0 }}>
            Expires: {newKey.expires_at ? new Date(newKey.expires_at).toLocaleString("en-IN") : "—"}
          </p>
        </Card>
      ) : null}

      <SectionTitle
        title="Your keys"
        subtitle="Active keys are highlighted. Inactive keys remain in the list for history."
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spinner />
        </div>
      ) : keys.length === 0 ? (
        <EmptyState
          icon="🗝️"
          text="No keys yet. Generate your first key above."
          dark={false}
          action={<ActionBtn onClick={handleGenerate}>Generate key</ActionBtn>}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {keys.map((k) => {
            const active = isActiveKey(k);
            const statusColor = active ? FF.green : k.refunded ? FF.yellow : FF.mutedLight;
            const statusLabel = active
              ? "Active"
              : k.refunded
              ? "Refunded"
              : k.revoked
              ? "Revoked"
              : k.used
              ? "Used"
              : "Expired";

            return (
              <div
                key={k.id || k.key}
                style={{
                  background: "#fff",
                  border: "1px solid #ececf2",
                  borderRadius: 16,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                  boxShadow: "0 10px 22px rgba(0,0,0,.04)",
                }}
              >
                <code
                  style={{
                    fontSize: 12,
                    color: active ? FF.green : "#666",
                    flex: 1,
                    letterSpacing: "0.1em",
                    wordBreak: "break-all",
                  }}
                >
                  {k.key}
                </code>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <Badge label={statusLabel} color={statusColor} dark={false} />
                  {active ? <span style={{ fontSize: 10, color: "#888" }}>{timeLeft(k.expires_at)}</span> : null}
                  <span style={{ fontSize: 10, color: "#888" }}>{formatDate(k.created_at)}</span>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {active ? (
                    <ActionBtn onClick={() => copyKey(k.key)} variant="ghost" small>
                      Copy
                    </ActionBtn>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchMyPaymentHistory();
        const list = normalizeList(data);
        if (mounted) setPayments(list);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const successful = payments.filter((p) => p.status === "success");
  const totalSpent = successful.reduce((sum, p) => sum + Number(p.amount_inr || 0), 0);
  const totalCredits = successful.reduce((sum, p) => sum + Number(p.credits_added || 0), 0);

  return (
    <div style={{ animation: "ffFadeIn 0.25s ease" }}>
      <SectionTitle
        title="Payment history"
        subtitle="Track your purchases and the credits added to your account."
      />

      {successful.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Stat label="Total spent" value={money(totalSpent)} hint="Successful payments only" color={FF.green} />
          <Stat label="Credits purchased" value={totalCredits} hint="Across successful payments" color={FF.blue} />
        </div>
      ) : null}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spinner />
        </div>
      ) : payments.length === 0 ? (
        <EmptyState icon="💳" text="No payments yet. Buy a plan to get started." dark={false} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {payments.map((p, idx) => {
            const success = p.status === "success";
            return (
              <div
                key={p.id || idx}
                style={{
                  background: "#fff",
                  border: "1px solid #ececf2",
                  borderRadius: 16,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                  boxShadow: "0 10px 22px rgba(0,0,0,.04)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: success ? `${FF.green}18` : `${FF.yellow}18`,
                    border: `1px solid ${success ? `${FF.green}44` : `${FF.yellow}44`}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {success ? "✓" : "⏳"}
                </div>

                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111" }}>
                    {p.plan_name || "Plan"}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "#666" }}>
                    {formatDate(p.created_at)}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111" }}>
                    {money(p.amount_inr)}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: FF.green }}>
                    +{Number(p.credits_added || 0)} credits
                  </p>
                </div>

                <Badge
                  label={p.status || "unknown"}
                  color={success ? FF.green : p.status === "pending" ? FF.yellow : FF.red}
                  dark={false}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AffiliateTab({ onRefresh }) {
  const [affiliate, setAffiliate] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [notAffiliate, setNotAffiliate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [aff, refs] = await Promise.all([
        fetchMyAffiliateStats(),
        fetchMyReferrals().catch(() => []),
      ]);
      setAffiliate(aff);
      setReferrals(normalizeList(refs));
      setNotAffiliate(false);
    } catch {
      setNotAffiliate(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleJoin() {
    setJoining(true);
    setError("");
    try {
      await joinAffiliate();
      await load();
      onRefresh?.();
    } catch (err) {
      setError(normalizeAffiliateError(err));
    } finally {
      setJoining(false);
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(affiliate?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <Spinner />
      </div>
    );
  }

  if (notAffiliate) {
    return (
      <div style={{ animation: "ffFadeIn 0.25s ease" }}>
        <SectionTitle
          title="Affiliate program"
          subtitle="Earn commissions by referring friends to FluentFox."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 16,
          }}
        >
          {[
            {
              icon: "🔗",
              title: "Get your code",
              body: "A unique code that tracks your referrals.",
            },
            {
              icon: "📤",
              title: "Share it",
              body: "Friends enter your code when they buy a plan.",
            },
            {
              icon: "💰",
              title: "Earn commission",
              body: "Get a share of every sale from your code.",
            },
          ].map((item) => (
            <Card key={item.title} dark={false} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#111", margin: "0 0 6px" }}>
                {item.title}
              </p>
              <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.65 }}>{item.body}</p>
            </Card>
          ))}
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        <Card dark={false} accent={FF.orange} style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🦊</p>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: "#111", margin: "0 0 8px" }}>
            Join the affiliate program
          </h3>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 18 }}>
            Free to join · Instant commission on every referral
          </p>
          <ActionBtn onClick={handleJoin} loading={joining} fullWidth>
            Join now — get my code
          </ActionBtn>
        </Card>
      </div>
    );
  }

  const totalEarned = Number(affiliate?.total_earned ?? 0);
  const pendingPayout = Number(affiliate?.pending_payout ?? 0);
  const totalPaidOut = Number(affiliate?.total_paid_out ?? 0);
  const totalReferrals = Number(affiliate?.total_referrals ?? 0);

  return (
    <div style={{ animation: "ffFadeIn 0.25s ease" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: 0, color: "#111" }}>
            Affiliate dashboard
          </h3>
          <p style={{ fontSize: 13, color: "#555", margin: "6px 0 0" }}>
            Track referrals, earnings, and payouts.
          </p>
        </div>
        <Badge
          label={affiliate?.is_active ? "Active" : "Inactive"}
          color={affiliate?.is_active ? FF.green : FF.mutedLight}
          dark={false}
        />
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}

      <Card dark={false} accent={FF.orange} style={{ marginBottom: 16 }}>
        <SLabel light>Your affiliate code</SLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(255,75,0,0.07)",
              border: `1px solid ${FF.orange}44`,
              borderRadius: 14,
              padding: "16px 18px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 900,
                color: FF.orange,
                letterSpacing: "0.22em",
                fontFamily: "monospace",
              }}
            >
              {affiliate?.code || "—"}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionBtn onClick={copyCode} variant="primary">
              {copied ? "✓ Copied!" : "Copy code"}
            </ActionBtn>
            <p style={{ fontSize: 10, color: "#666", textAlign: "center", margin: 0 }}>
              {affiliate?.commission_percent || 0}% commission
            </p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#666", marginTop: 12, lineHeight: 1.7 }}>
          Share this code with friends. When they buy a plan using your code, you earn commission automatically.
        </p>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Stat label="Total earned" value={money(totalEarned)} hint="Across all approved referrals" color={FF.green} />
        <Stat label="Pending payout" value={money(pendingPayout)} hint="Awaiting approval" color={FF.yellow} />
        <Stat label="Total paid out" value={money(totalPaidOut)} hint="Already processed" color={FF.blue} />
        <Stat label="Total referrals" value={totalReferrals} hint="Successful referral count" color={FF.orange} />
      </div>

      <SectionTitle
        title="Referral history"
        subtitle="Each row shows a sale tracked from your code."
      />

      {referrals.length === 0 ? (
        <EmptyState icon="📊" text="No referrals yet. Share your code to start earning!" dark={false} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {referrals.map((r, idx) => (
            <div
              key={r.id || idx}
              style={{
                background: "#fff",
                border: "1px solid #ececf2",
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                boxShadow: "0 10px 22px rgba(0,0,0,.04)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: `${FF.green}18`,
                  border: `1px solid ${FF.green}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                💸
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111" }}>
                  {r.plan_name || "Plan"}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: "#666" }}>
                  {formatDate(r.created_at)}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111" }}>
                  {money(r.amount_inr)}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: FF.green }}>
                  +{money(r.commission_amount)} earned
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ALL_TABS = {
  overview: OverviewTab,
  credits: CreditsTab,
  keys: KeysTab,
  payments: PaymentsTab,
  affiliate: AffiliateTab,
};

export default function UserDashboard({ onLogout }) {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [metrics, setMetrics] = useState({
    credits: 0,
    activeKeys: 0,
    payments: 0,
    affiliateEarned: 0,
  });
  const [lastPayment, setLastPayment] = useState(null);
  const [lastKey, setLastKey] = useState(null);

  const refreshAll = useCallback(async () => {
    try {
      const [me, paymentsRes, keysRes, affRes, refsRes] = await Promise.all([
        ffGetMe(),
        fetchMyPaymentHistory().catch(() => []),
        fetchMyKeys().catch(() => []),
        fetchMyAffiliateStats().catch(() => null),
        fetchMyReferrals().catch(() => []),
      ]);

      const payments = normalizeList(paymentsRes);
      const keys = normalizeList(keysRes);
      const affiliateStats = affRes || null;
      const referrals = normalizeList(refsRes);

      setUser(me);
      setAffiliate(affiliateStats);

      setMetrics({
        credits: Number(me?.credits ?? 0),
        activeKeys: keys.filter(isActiveKey).length,
        payments: payments.filter((p) => p.status === "success").length,
        affiliateEarned: Number(affiliateStats?.total_earned ?? 0),
      });

      setLastPayment(
        payments
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .find((p) => p.status === "success") || null
      );

      setLastKey(
        keys
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null
      );

      if (referrals?.length === 0 && affiliateStats) {
        // no-op
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const me = await ffGetMe();
        if (!mounted) return;
        setUser(me);
      } catch {
        ffLogout();
        onLogout?.();
        return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [onLogout]);

  useEffect(() => {
    if (!user) return;
    refreshAll();
  }, [user, refreshAll]);

  function handleLogout() {
    ffLogout();
    onLogout?.();
    nav("/");
  }

  const ActiveTab = ALL_TABS[tab] || OverviewTab;

  const shellStyles = {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${FF.orangePale} 0%, #fff 24%, #f6f1e8 100%)`,
    color: FF.textLight,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflowX: "hidden",
  };

  if (loading) {
    return (
      <div style={{ ...shellStyles, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={shellStyles}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
        * { box-sizing: border-box; }
        @keyframes ffSpin { to { transform: rotate(360deg); } }
        @keyframes ffFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 999px; }
        input::placeholder { color: rgba(0,0,0,0.28); }
        button:focus-visible, input:focus-visible {
          outline: 2px solid ${FF.orange};
          outline-offset: 2px;
        }
        .dashboard-shell {
          display: grid;
          grid-template-columns: 278px minmax(0, 1fr);
          min-height: 100vh;
          width: 100%;
        }
        .dashboard-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: auto;
          border-right: 1px solid rgba(0,0,0,.06);
          background: rgba(255,255,255,.7);
          backdrop-filter: blur(16px);
        }
        .dashboard-main {
          min-width: 0;
          height: 100vh;
          overflow: auto;
        }
        @media (max-width: 980px) {
          .dashboard-shell {
            grid-template-columns: 1fr;
          }
          .dashboard-sidebar {
            position: relative;
            height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0,0,0,.06);
          }
          .dashboard-main {
            height: auto;
          }
        }
      `}</style>

      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div
            style={{
              position: "relative",
              background: `linear-gradient(135deg, #e63c00 0%, ${FF.orange} 42%, #ff6a1a 100%)`,
              color: "#fff",
              overflow: "hidden",
              boxShadow: "0 18px 40px rgba(255,75,0,.18)",
              minHeight: 240,
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -60,
                top: -60,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "rgba(255,255,255,.08)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -80,
                bottom: -60,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "rgba(0,0,0,.08)",
                pointerEvents: "none",
              }}
            />

            <div style={{ padding: 18, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: "rgba(255,255,255,.16)",
                    border: "1px solid rgba(255,255,255,.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/company-logo.webp"
                    alt="FluentFox"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>
                    FluentFox
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.68)", marginTop: 3 }}>
                    User dashboard
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,.62)", textTransform: "uppercase", letterSpacing: ".16em" }}>
                  Signed in as
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 20, fontWeight: 900, lineHeight: 1.2 }}>
                  {user?.name || "User"}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,.76)", lineHeight: 1.6 }}>
                  {user?.email || "No email loaded"}
                </p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  <Badge label={`${user?.credits ?? 0} credits`} color="#fff" dark />
                  <Badge label={user?.role || "USER"} color="#fff" dark />
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: 14 }}>
            <Card dark={false} style={{ padding: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TABS.map((item) => {
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      style={{
                        border: "1px solid " + (active ? `${FF.orange}44` : "#ececf2"),
                        background: active ? `${FF.orange}10` : "#fff",
                        color: "#111",
                        borderRadius: 16,
                        padding: "12px 12px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "transform .15s ease, background .15s ease, border-color .15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        boxShadow: active ? "0 12px 24px rgba(255,75,0,.08)" : "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: active ? `${FF.orange}18` : "#f5f6f8",
                          color: active ? FF.orange : "#666",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.04em" }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card dark={false} style={{ padding: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", margin: "0 0 10px" }}>
                Session snapshot
              </p>

              <div style={{ display: "grid", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    border: "1px solid #ececf2",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Credits</span>
                  <Badge label={`${user?.credits ?? 0}`} color={FF.green} dark={false} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    border: "1px solid #ececf2",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Active keys</span>
                  <Badge label={`${metrics.activeKeys}`} color={FF.blue} dark={false} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    border: "1px solid #ececf2",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Payments</span>
                  <Badge label={`${metrics.payments}`} color={FF.orange} dark={false} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <ActionBtn onClick={() => nav("/")} variant="ghost" small>
                  Home
                </ActionBtn>
                <ActionBtn onClick={() => nav("/access-pricing")} variant="ghost" small>
                  Pricing
                </ActionBtn>
                <ActionBtn onClick={handleLogout} variant="danger" small>
                  Logout
                </ActionBtn>
              </div>
            </Card>
          </div>
        </aside>

        <main className="dashboard-main">
          <div style={{ padding: 14 }}>
            <Card dark={false} style={{ padding: 16, minHeight: "calc(100vh - 28px)" }}>
              {tab === "overview" ? (
                <OverviewTab
                  user={user}
                  metrics={metrics}
                  onSwitchTab={setTab}
                  lastPayment={lastPayment}
                  lastKey={lastKey}
                  affiliate={affiliate}
                />
              ) : null}

              {tab === "credits" ? (
                <CreditsTab user={user} onRefresh={refreshAll} onSwitchTab={setTab} />
              ) : null}

              {tab === "keys" ? (
                <KeysTab user={user} onRefresh={refreshAll} onSwitchTab={setTab} />
              ) : null}

              {tab === "payments" ? <PaymentsTab /> : null}

              {tab === "affiliate" ? (
                <AffiliateTab onRefresh={refreshAll} />
              ) : null}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}