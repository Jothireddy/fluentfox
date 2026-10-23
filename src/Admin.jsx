import React, { useEffect, useState } from "react";
import {
  login,
  adminSignup,
  getMe,
  setToken,
  fetchClientKeys,
  createClientKey,
  fetchSessionLogs,
  revokeClientKey,
} from "./api1";
import {
  Shell,
  Brand,
  Button,
  Field,
  Badge,
  Tile,
  StatCard,
  Toast,
  Modal,
  CopyButton,
  Empty,
  LoadingScreen,
  Icon,
} from "./AdminTheme";

const KEY_FILTERS = [
  ["all", "All"],
  ["active", "Active"],
  ["used", "Used"],
  ["revoked", "Revoked"],
  ["expired", "Expired"],
];

function keyStatus(k, now) {
  const diff = new Date(k.expiresAt).getTime() - now;
  if (k.revoked || k.refunded) {
    return { label: k.refunded ? "Revoked · refunded" : "Revoked", tone: "tomato", group: "revoked", diff };
  }
  if (k.used) return { label: "Used", tone: "lav", group: "used", diff };
  if (diff <= 0) return { label: "Expired", tone: "muted", group: "expired", diff };
  return { label: "Active", tone: "lime", group: "active", diff };
}

function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(s = "") {
  const p = s.trim().split(/[\s@._-]+/).filter(Boolean);
  return ((p[0]?.[0] || "A") + (p[1]?.[0] || "")).toUpperCase();
}

const Admin = () => {
  const [view, setView] = useState("loading");
  const [authMode, setAuthMode] = useState("login");

  const [me, setMe] = useState(null);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupKey, setSignupKey] = useState("");

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [keys, setKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [, setNowTick] = useState(Date.now()); // live timers

  const [toast, setToast] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [keyFilter, setKeyFilter] = useState("all");

  // Auto-login if token exists
  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem("admin_token");
      if (!stored) {
        setView("auth");
        return;
      }
      try {
        const u = await getMe();
        if (u.role !== "admin") throw new Error("Not admin");
        setMe(u);
        await loadData();
        setView("dashboard");
      } catch {
        setToken(null);
        setView("auth");
      }
    })();
  }, []);

  // Countdown refresh
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  async function loadData() {
    const [k, l] = await Promise.all([fetchClientKeys(), fetchSessionLogs()]);
    setKeys(k);
    setLogs(l);
  }

  // ---------- LOGIN ----------
  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const u = await login(loginEmail, loginPassword);
      if (u.role !== "admin") {
        setToken(null);
        throw new Error("This account is not an admin");
      }
      setMe(u);
      await loadData();
      setView("dashboard");
    } catch (err) {
      setAuthError(err?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  // ---------- SIGNUP ----------
  async function handleSignup(e) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const u = await adminSignup(signupEmail, signupPassword, signupName, signupKey);
      if (u.role !== "admin") {
        setToken(null);
        throw new Error("Signup did not create an admin account");
      }
      setMe(u);
      await loadData();
      setView("dashboard");
    } catch (err) {
      setAuthError(err?.message || "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setMe(null);
    setView("auth");
  }

  // ---------- CREATE KEY ----------
  async function handleCreateKey() {
    setToast(null);
    setCreating(true);
    try {
      const trimmedName = newKeyName.trim() || undefined;
      const result = await createClientKey(trimmedName);
      setKeys((prev) => [result.key, ...prev]);
      setMe((m) => (m ? { ...m, credits: result.remainingCredits } : m));
      setNewKeyName("");
      setToast({
        type: "success",
        message: `Client key #${result.key.id} created${result.key.name ? ` (${result.key.name})` : ""}.`,
      });
    } catch (err) {
      setToast({ type: "error", message: err?.message || "Failed to create key" });
    } finally {
      setCreating(false);
    }
  }

  // ---------- REVOKE KEY ----------
  function openRevokeConfirm(key) {
    setRevokeTarget(key);
  }

  async function confirmRevoke() {
    if (!revokeTarget) return;
    setRevokeLoading(true);
    setToast(null);
    try {
      const res = await revokeClientKey(revokeTarget.id);
      const [u, k] = await Promise.all([getMe(), fetchClientKeys()]);
      setMe(u);
      setKeys(k);
      setToast({ type: "success", message: res.message || "Key revoked" });
    } catch (err) {
      setToast({ type: "error", message: err?.message || "Failed to revoke key" });
    } finally {
      setRevokeLoading(false);
      setRevokeTarget(null);
    }
  }

  // ---------- LOADING ----------
  if (view === "loading") {
    return <LoadingScreen text="Preparing your admin space…" />;
  }

  // ---------- AUTH ----------
  if (view === "auth") {
    const isLogin = authMode === "login";

    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center px-5 py-12">
          <div className="grid w-full max-w-5xl items-center gap-14 md:grid-cols-[1.1fr_1fr]">
            {/* Hero */}
            <div className="hidden md:block">
              <div className="ff-in">
                <Brand tag="Admin" />
              </div>

              <h1
                className="ff-in ff-fg mt-8 text-[42px] font-extrabold leading-[1.08] tracking-[-0.035em]"
                style={{ animationDelay: ".06s" }}
              >
                Run every client
                <br />
                interview with <span className="ff-hl">secure keys.</span>
              </h1>

              <p
                className="ff-in ff-fg3 mt-5 max-w-md text-[14.5px] leading-relaxed"
                style={{ animationDelay: ".12s" }}
              >
                Sign in, or join with a referral key from your Super Admin. Generate time-limited
                client keys and track every session from one place.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  ["clock", "lime", "6-hour, single-use keys", "Unused keys are refunded automatically."],
                  ["refund", "lav", "Fair refunds", "Your credit returns if an interview ends under 10 minutes."],
                  ["activity", "tomato", "Full session logs", "Start, end and duration for every key you issue."],
                ].map(([icon, tone, title, text], i) => (
                  <div
                    key={title}
                    className="ff-in flex items-start gap-3.5"
                    style={{ animationDelay: `${0.18 + i * 0.06}s` }}
                  >
                    <Tile icon={icon} tone={tone} size={36} />
                    <div className="pt-0.5">
                      <div className="ff-fg text-[13.5px] font-semibold">{title}</div>
                      <div className="ff-fg3 mt-0.5 text-[12.5px]">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card */}
            <div className="ff-in" style={{ animationDelay: ".1s" }}>
              <div className="mb-6 md:hidden">
                <Brand tag="Admin" />
              </div>

              <div className="ff-glass-strong p-7">
                <div className="ff-tabs">
                  <span
                    className="ff-tab-ind"
                    style={{ transform: isLogin ? "none" : "translateX(100%)" }}
                  />
                  <button
                    type="button"
                    className="ff-tab"
                    data-on={isLogin}
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="ff-tab"
                    data-on={!isLogin}
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthError("");
                    }}
                  >
                    Sign up
                  </button>
                </div>

                <div key={authMode} className="ff-in mt-6">
                  <h2 className="ff-fg text-[19px] font-bold tracking-[-0.02em]">
                    {isLogin ? "Welcome back" : "Create your admin account"}
                  </h2>
                  <p className="ff-fg3 mt-1 text-[12.5px]">
                    {isLogin
                      ? "Use your admin credentials to access keys and logs."
                      : "You'll need a referral key from your Super Admin."}
                  </p>

                  {authError && (
                    <div className="ff-alert mt-5">
                      <Icon name="alert" size={15} className="mt-[2px] shrink-0" />
                      <p>{authError}</p>
                    </div>
                  )}

                  {isLogin ? (
                    <form onSubmit={handleLogin} className="mt-5 space-y-4">
                      <Field
                        label="Email"
                        icon="mail"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                      />
                      <Field
                        label="Password"
                        right="Admin accounts only"
                        icon="lock"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        iconRight="arrow"
                        loading={authLoading}
                        className="!mt-6 w-full"
                      >
                        Login as admin
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="mt-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Name"
                          icon="user"
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                          placeholder="Your full name"
                        />
                        <Field
                          label="Email"
                          icon="mail"
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          autoComplete="email"
                          required
                          placeholder="you@company.com"
                        />
                      </div>
                      <Field
                        label="Password"
                        icon="lock"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        placeholder="Choose a strong password"
                      />
                      <div>
                        <Field
                          label="Referral key"
                          right="From your Super Admin"
                          icon="key"
                          type="text"
                          value={signupKey}
                          onChange={(e) => setSignupKey(e.target.value)}
                          required
                          placeholder="Paste the admin invite key"
                        />
                        <p className="ff-fg4 mt-1.5 text-[11.5px]">
                          Links your account to the Super Admin who issued the key.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        iconRight="arrow"
                        loading={authLoading}
                        className="!mt-6 w-full"
                      >
                        Create admin account
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              <p className="ff-fg4 mt-5 text-center text-[11.5px]">© 2026 FluentFox · Admin access only</p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ---------- DASHBOARD ----------
  const nowTs = Date.now();
  const withStatus = keys.map((k) => ({ k, s: keyStatus(k, nowTs) }));
  const counts = withStatus.reduce((acc, { s }) => {
    acc[s.group] = (acc[s.group] || 0) + 1;
    return acc;
  }, {});

  const totalKeys = keys.length;
  const activeKeys = counts.active || 0;
  const usedKeys = counts.used || 0;
  const revokedKeys = counts.revoked || 0;
  const totalSessions = logs.length;
  const credits = me?.credits ?? 0;

  const visibleKeys =
    keyFilter === "all" ? withStatus : withStatus.filter(({ s }) => s.group === keyFilter);

  const firstName = (me?.name || "").trim().split(/\s+/)[0];

  return (
    <Shell>
      {/* Header */}
      <header className="ff-header">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Brand tag="Admin" />

          <div className="flex items-center gap-2.5">
            <div className="ff-pill hidden h-9 items-center gap-2 rounded-full pl-3.5 pr-1.5 sm:flex">
              <span className="ff-fg3 text-[12px]">Credits</span>
              <Badge tone="lime">
                <Icon name="zap" size={11} />
                {credits.toLocaleString()}
              </Badge>
            </div>

            <div className="hidden items-center gap-2.5 pl-1 md:flex">
              <span className="ff-avatar">{initials(me?.name || me?.email)}</span>
              <div className="leading-tight">
                <div className="ff-fg max-w-[180px] truncate text-[12.5px] font-semibold">
                  {me?.name || me?.email}
                </div>
                <div className="ff-fg4 max-w-[180px] truncate text-[11px]">{me?.email}</div>
              </div>
            </div>

            <Button variant="ghost" size="sm" icon="logout" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
        {/* Greeting */}
        <div className="ff-in">
          <div className="ff-eyebrow">Dashboard</div>
          <h1 className="ff-fg mt-1.5 text-[28px] font-extrabold tracking-[-0.03em]">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="ff-fg3 mt-1 text-[13.5px]">
            Generate client keys and keep track of every interview session.
          </p>
        </div>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Credits" value={credits} icon="zap" tone="lime" hint="1 credit per key" delay={0.05} />
          <StatCard
            label="Client keys"
            value={totalKeys}
            icon="key"
            tone="lav"
            hint={`${usedKeys} used · ${revokedKeys} revoked`}
            delay={0.1}
          />
          <StatCard label="Active keys" value={activeKeys} icon="activity" tone="lime" hint="Ready to use" delay={0.15} />
          <StatCard label="Sessions" value={totalSessions} icon="clock" tone="tomato" hint="All time" delay={0.2} />
        </section>

        {/* Generate + how it works */}
        <section className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="ff-in" style={{ animationDelay: ".24s" }}>
            <div className="ff-glass h-full p-5">
              <div className="flex items-start gap-3.5">
                <Tile icon="plus" tone="lime" size={38} />
                <div className="min-w-0">
                  <h2 className="ff-fg text-[15px] font-bold">Generate a client key</h2>
                  <p className="ff-fg3 mt-1 text-[12.5px] leading-relaxed">
                    Each key costs <b className="ff-fg">1 credit</b> and stays valid for{" "}
                    <b className="ff-fg">6 hours</b>. Your client uses it to log in and gets{" "}
                    <b className="ff-fg">1 interview credit</b>.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateKey();
                }}
                className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <Field
                  className="flex-1"
                  label="Key name"
                  right="Optional"
                  icon="user"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. John Doe – Frontend role"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon="plus"
                  loading={creating}
                  disabled={credits <= 0}
                >
                  Generate key
                </Button>
              </form>

              {credits <= 0 ? (
                <p className="ff-tomato mt-2.5 flex items-center gap-1.5 text-[12px]">
                  <Icon name="alert" size={13} /> You're out of credits. Ask your Super Admin for more.
                </p>
              ) : (
                <p className="ff-fg4 mt-2.5 text-[11.5px]">
                  The name shows in your keys list and session logs.
                </p>
              )}
            </div>
          </div>

          <div className="ff-in" style={{ animationDelay: ".3s" }}>
            <div className="ff-glass h-full p-5">
              <h3 className="ff-fg text-[14px] font-bold">How keys work</h3>
              <div className="mt-4 space-y-3.5">
                {[
                  ["users", "lime", "Share each key with one client only. It expires after 6 hours or once used."],
                  ["refund", "lav", "If an interview stops before 10 minutes, your credit is refunded and the key is revoked."],
                  ["ban", "tomato", "Revoke keys that haven't been fully used. Credits are refunded when eligible."],
                ].map(([icon, tone, text]) => (
                  <div key={icon} className="flex items-start gap-3">
                    <Tile icon={icon} tone={tone} size={28} />
                    <p className="ff-fg3 pt-0.5 text-[12.5px] leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Keys */}
        <section className="ff-in" style={{ animationDelay: ".34s" }}>
          <div className="ff-glass p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="ff-fg text-[15px] font-bold">Client keys</h2>
                <p className="ff-fg4 mt-0.5 text-[12px]">
                  {totalKeys === 0
                    ? "No keys generated yet"
                    : `${activeKeys} active · ${usedKeys} used · ${revokedKeys} revoked`}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {KEY_FILTERS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className="ff-chip"
                    data-on={keyFilter === id}
                    onClick={() => setKeyFilter(id)}
                  >
                    {label}
                    <span className="ff-chip-n">{id === "all" ? totalKeys : counts[id] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              {visibleKeys.length === 0 ? (
                <Empty
                  icon="key"
                  title={totalKeys === 0 ? "No keys yet" : "Nothing here"}
                  text={
                    totalKeys === 0
                      ? "Generate your first client key above to get started."
                      : "No keys match this filter."
                  }
                />
              ) : (
                <div className="ff-table-wrap">
                  <table className="ff-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Key</th>
                        <th>Status</th>
                        <th>Expires in</th>
                        <th>Created</th>
                        <th>Used</th>
                        <th className="!text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleKeys.map(({ k, s }, i) => (
                        <KeyRow
                          key={k.id}
                          keyData={k}
                          status={s}
                          index={i}
                          onRevoke={() => openRevokeConfirm(k)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Session logs */}
        <section className="ff-in" style={{ animationDelay: ".4s" }}>
          <div className="ff-glass p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="ff-fg text-[15px] font-bold">Session logs</h2>
                <p className="ff-fg4 mt-0.5 text-[12px]">
                  {logs.length === 0 ? "No sessions recorded yet" : `${logs.length} sessions from your keys`}
                </p>
              </div>
            </div>

            <div className="mt-4">
              {logs.length === 0 ? (
                <Empty
                  icon="activity"
                  title="No sessions yet"
                  text="Sessions appear here as soon as a client starts an interview."
                />
              ) : (
                <div className="ff-table-wrap">
                  <table className="ff-table">
                    <thead>
                      <tr>
                        <th>Client key</th>
                        <th>Session</th>
                        <th>Started</th>
                        <th>Ended</th>
                        <th className="!text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, i) => (
                        <tr key={log.sessionId} style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}>
                          <td className="ff-fg font-semibold">{log.label}</td>
                          <td>
                            <span className="ff-mono ff-fg3 text-[12px]">#{log.sessionId}</span>
                          </td>
                          <td>{fmtDate(log.startedAt)}</td>
                          <td>
                            {log.endedAt ? (
                              fmtDate(log.endedAt)
                            ) : (
                              <Badge tone="lime" live>
                                Live / unknown
                              </Badge>
                            )}
                          </td>
                          <td className="!text-right">
                            {log.durationMinutes != null ? (
                              <span className="ff-fg font-semibold tabular-nums">
                                {log.durationMinutes}
                                <span className="ff-fg4 ml-1 font-normal">min</span>
                              </span>
                            ) : (
                              <span className="ff-fg4">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Revoke confirmation */}
      <Modal open={Boolean(revokeTarget)} onClose={() => !revokeLoading && setRevokeTarget(null)}>
        {revokeTarget && (
          <>
            <div className="flex items-start gap-4">
              <Tile icon="ban" tone="tomato" size={42} />
              <div className="min-w-0 pt-0.5">
                <h3 className="ff-fg text-[16px] font-bold">
                  Revoke key #{revokeTarget.id}
                  {revokeTarget.name ? ` · ${revokeTarget.name}` : ""}?
                </h3>
                <p className="ff-fg3 mt-1.5 text-[12.5px] leading-relaxed">
                  The key will stop working immediately. If the interview ran under 10 minutes, or never
                  started, your credit is refunded.
                </p>
              </div>
            </div>

            <div className="ff-mono ff-fg2 mt-4 break-all rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[11.5px]">
              {revokeTarget.key}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRevokeTarget(null)} disabled={revokeLoading}>
                Cancel
              </Button>
              <Button variant="danger-solid" icon="ban" onClick={confirmRevoke} loading={revokeLoading}>
                {revokeLoading ? "Revoking…" : "Revoke key"}
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Shell>
  );
};

const KeyRow = ({ keyData, status, index, onRevoke }) => {
  const total = Math.max(
    1,
    new Date(keyData.expiresAt).getTime() - new Date(keyData.createdAt).getTime()
  );
  const pct = Math.max(0, Math.min(100, (status.diff / total) * 100));

  let expiresIn;
  if (status.group === "revoked") {
    expiresIn = "—";
  } else if (status.diff <= 0) {
    expiresIn = "Expired";
  } else {
    const totalSec = Math.floor(status.diff / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    expiresIn = `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }

  const canRevoke = !keyData.revoked && !keyData.refunded;
  const counting = status.group !== "revoked" && status.diff > 0;

  return (
    <tr style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}>
      <td>
        <div className="ff-fg max-w-[190px] truncate font-semibold">
          {keyData.name || <span className="ff-fg4 font-normal">Untitled</span>}
        </div>
        <div className="ff-mono ff-fg4 text-[11px]">#{keyData.id}</div>
      </td>

      <td>
        <div className="flex items-center gap-2">
          <code className="ff-code" title={keyData.key}>
            {keyData.key}
          </code>
          <CopyButton text={keyData.key} />
        </div>
      </td>

      <td>
        <Badge tone={status.tone} dot live={status.group === "active"}>
          {status.label}
        </Badge>
      </td>

      <td>
        {counting ? (
          <div>
            <div className="ff-mono ff-fg text-[12px] tabular-nums">{expiresIn}</div>
            {status.group === "active" && (
              <div className="ff-bar mt-1.5">
                <i style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
        ) : (
          <span className="ff-fg4">{expiresIn}</span>
        )}
      </td>

      <td>{fmtDate(keyData.createdAt)}</td>
      <td>{keyData.usedAt ? fmtDate(keyData.usedAt) : <span className="ff-fg4">—</span>}</td>

      <td className="!text-right">
        <Button size="sm" variant="danger" icon="ban" disabled={!canRevoke} onClick={onRevoke}>
          Revoke
        </Button>
      </td>
    </tr>
  );
};

export default Admin;