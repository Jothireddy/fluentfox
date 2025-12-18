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

  const [keys, setKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [, setNowTick] = useState(Date.now()); // for live timers

  // UI-only notifications
  const [toast, setToast] = useState(null); // { type: "success" | "error" | "info", message }
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  // New: name for key
  const [newKeyName, setNewKeyName] = useState("");

  // Try auto-login if token exists
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

  // Timer for countdown refresh
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
    }
  }

  // ---------- SIGNUP ----------
  async function handleSignup(e) {
    e.preventDefault();
    setAuthError("");
    try {
      const u = await adminSignup(
        signupEmail,
        signupPassword,
        signupName,
        signupKey
      );
      if (u.role !== "admin") {
        setToken(null);
        throw new Error("Signup did not create an admin account");
      }
      setMe(u);
      await loadData();
      setView("dashboard");
    } catch (err) {
      setAuthError(err?.message || "Signup failed");
    }
  }

  function handleLogout() {
    setToken(null);
    setMe(null);
    setView("auth");
  }

  // ---------- CREATE KEY (with optional name) ----------
  async function handleCreateKey() {
    setToast(null);
    try {
      const trimmedName = newKeyName.trim() || undefined;
      const result = await createClientKey(trimmedName);
      setKeys((prev) => [result.key, ...prev]);
      setMe((m) => (m ? { ...m, credits: result.remainingCredits } : m));
      setNewKeyName("");
      setToast({
        type: "success",
        message: `Client key #${result.key.id} created${
          result.key.name ? ` (${result.key.name})` : ""
        }.`,
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err?.message || "Failed to create key",
      });
    }
  }

  // ---------- REVOKE KEY (UI-confirm + toast) ----------
  function openRevokeConfirm(key) {
    setRevokeTarget(key);
  }

  async function confirmRevoke() {
    if (!revokeTarget) return;
    setRevokeLoading(true);
    setToast(null);
    try {
      const res = await revokeClientKey(revokeTarget.id);

      // Reload keys + credits from backend to stay in sync
      const [u, k] = await Promise.all([getMe(), fetchClientKeys()]);
      setMe(u);
      setKeys(k);

      setToast({
        type: "success",
        message: res.message || "Key revoked",
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err?.message || "Failed to revoke key",
      });
    } finally {
      setRevokeLoading(false);
      setRevokeTarget(null);
    }
  }

  // ---------- DERIVED STATS ----------
  const nowTs = Date.now();
  const totalKeys = keys.length;

  const activeKeys = keys.filter(
    (k) =>
      !k.used &&
      !k.revoked &&
      !k.refunded &&
      new Date(k.expiresAt).getTime() > nowTs
  ).length;

  const usedKeys = keys.filter(
    (k) => k.used && !k.revoked && !k.refunded
  ).length;

  const revokedKeys = keys.filter((k) => k.revoked || k.refunded).length;

  const totalSessions = logs.length;

  // ---------- RENDER ----------

  if (view === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300 text-sm tracking-wide">
            Preparing your admin space…
          </p>
        </div>
      </div>
    );
  }

  if (view === "auth") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
          {/* Hero side */}
          <div className="hidden md:flex flex-col gap-4 text-slate-100">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Admin Access Portal
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Manage your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                client interviews
              </span>{" "}
              with secure keys.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Log in or sign up as an admin using a referral key from your Super
              Admin. Generate time-limited client keys and track every session
              from one unified dashboard.
            </p>
            <ul className="mt-2 text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                6‑hour, single-use client keys with automatic refund if unused.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Admin credit is refunded if the interview ends in &lt; 10
                minutes.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Detailed interview session logs with credit tracking.
              </li>
            </ul>
          </div>

          {/* Auth card */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -top-10 -left-10 rounded-3xl bg-gradient-to-tr from-blue-500/20 via-cyan-400/10 to-transparent blur-3xl" />
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_18px_60px_rgba(0,0,0,0.85)] px-7 py-7 w-full">
              {/* Tabs */}
              <div className="flex mb-5 border-b border-slate-800 text-xs font-medium text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className={`flex-1 pb-2 border-b text-center transition ${
                    authMode === "login"
                      ? "border-blue-500 text-blue-300"
                      : "border-transparent hover:text-slate-200"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                  className={`flex-1 pb-2 border-b text-center transition ${
                    authMode === "signup"
                      ? "border-emerald-400 text-emerald-200"
                      : "border-transparent hover:text-slate-200"
                  }`}
                >
                  Sign up (Admin)
                </button>
              </div>

              {authError && (
                <div className="mb-4 flex items-start gap-2 rounded-md border border-red-700/60 bg-red-950/60 px-3 py-2 text-xs text-red-200">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59C19.021 16.88 18.245 18 17.017 18H2.983c-1.228 0-2.004-1.12-1.244-2.31l6.518-11.59zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>{authError}</p>
                </div>
              )}

              {authMode === "login" ? (
                <form onSubmit={handleLogin}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50">
                        Admin Login
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Use your admin credentials to access keys & logs.
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-slate-950 text-xs font-bold">
                      ADM
                    </div>
                  </div>

                  <div className="mb-3 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-200">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="mb-5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-200">
                        Password
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Admin accounts only
                      </span>
                    </div>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-blue-400 hover:to-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition"
                  >
                    <span>Login as Admin</span>
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.75 3a.75.75 0 000 1.5h3.69L6.22 12.72a.75.75 0 101.06 1.06L15.5 5.56v3.69a.75.75 0 001.5 0V3.75A.75.75 0 0016.25 3h-5.5z" />
                      <path d="M4 5.75A1.75 1.75 0 015.75 4h2a.75.75 0 000-1.5h-2A3.25 3.25 0 002.5 5.75v8.5A3.25 3.25 0 005.75 17.5h8.5A3.25 3.25 0 0017.5 14.25v-2a.75.75 0 00-1.5 0v2a1.75 1.75 0 01-1.75 1.75h-8.5A1.75 1.75 0 014 14.25v-8.5z" />
                    </svg>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50">
                        Admin Sign up
                      </h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Requires a referral key from your Super Admin.
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 text-xs font-bold">
                      NEW
                    </div>
                  </div>

                  <div className="mb-3 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-200">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/60"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                    />
                  </div>

                  <div className="mb-3 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-200">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/60"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      placeholder="Choose a strong password"
                    />
                  </div>

                  <div className="mb-3 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-200">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/60"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="mb-4 space-y-1.5">
                    <label className="block text-xs font-medium text-slate-200">
                      Referral key from Super Admin
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/60"
                      value={signupKey}
                      onChange={(e) => setSignupKey(e.target.value)}
                      required
                      placeholder="Paste the admin invite key"
                    />
                    <p className="text-[11px] text-slate-400">
                      This links your admin account under the Super Admin who
                      issued the key.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition"
                  >
                    <span>Sign up as Admin</span>
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.75 3a.75.75 0 000 1.5h3.69L6.22 12.72a.75.75 0 101.06 1.06L15.5 5.56v3.69a.75.75 0 001.5 0V3.75A.75.75 0 0016.25 3h-5.5z" />
                      <path d="M4 5.75A1.75 1.75 0 015.75 4h2a.75.75 0 000-1.5h-2A3.25 3.25 0 002.5 5.75v8.5A3.25 3.25 0 005.75 17.5h8.5A3.25 3.25 0 0017.5 14.25v-2a.75.75 0 00-1.5 0v2a.75.75 0 01-1.75 1.75h-8.5A1.75 1.75 0 014 14.25v-8.5z" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-300 flex items-center justify-center text-slate-950 font-semibold text-base shadow-md">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                Admin Dashboard
              </span>
              <span className="text-[11px] text-slate-400">
                {me?.email} · {me?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Credits</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-semibold">
                  {me?.credits?.toLocaleString() ?? 0}
                </span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[11px] font-medium text-red-200 hover:bg-red-500/15 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M3.75 3A1.75 1.75 0 002 4.75v10.5C2 16.99 3.01 18 4.25 18h5a.75.75 0 000-1.5h-5A.75.75 0 013.5 15.75v-11c0-.138.112-.25.25-.25h5a.75.75 0 000-1.5h-5z" />
                <path d="M12.22 6.22a.75.75 0 011.06 0L16.5 9.44a1.25 1.25 0 010 1.77l-3.22 3.22a.75.75 0 11-1.06-1.06L14.94 11H8.75a.75.75 0 010-1.5h6.19l-2.72-2.72a.75.75 0 010-1.06z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-5 space-y-6">
          {/* Toast / Notice */}
          {toast && (
            <div
              className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${
                toast.type === "success"
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                  : toast.type === "error"
                  ? "border-rose-500/60 bg-rose-500/10 text-rose-100"
                  : "border-slate-600/60 bg-slate-700/30 text-slate-100"
              }`}
            >
              <span className="mt-0.5">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "•"}
              </span>
              <div className="flex-1">{toast.message}</div>
              <button
                onClick={() => setToast(null)}
                className="ml-2 text-[10px] text-slate-300 hover:text-slate-100"
              >
                Close
              </button>
            </div>
          )}

          {/* Stats */}
          <section className="grid gap-4 md:grid-cols-4">
            <StatCard
              label="Available credits"
              value={me?.credits ?? 0}
              accent="from-emerald-500 to-lime-400"
            />
            <StatCard
              label="Total client keys"
              value={totalKeys}
              accent="from-blue-500 to-cyan-400"
            />
            <StatCard
              label="Active keys"
              value={activeKeys}
              accent="from-violet-500 to-fuchsia-400"
            />
            <StatCard
              label="Sessions logged"
              value={totalSessions}
              accent="from-amber-500 to-orange-400"
            />
          </section>

          {/* Generate key + info */}
          <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-3 shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    Generate client key
                  </h3>
                  <p className="text-[11px] text-slate-400 max-w-md">
                    Each key costs{" "}
                    <span className="font-semibold text-slate-200">
                      1 credit
                    </span>{" "}
                    and is valid for{" "}
                    <span className="font-semibold text-slate-200">
                      6 hours
                    </span>
                    . Clients use this key to log in and receive{" "}
                    <span className="font-semibold text-slate-200">
                      1 interview credit
                    </span>
                    . If the interview finishes in{" "}
                    <span className="font-semibold text-slate-200">
                      under 10 minutes
                    </span>
                    , your credit is automatically refunded.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-slate-200 mb-1">
                    Key name (optional)
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. John Doe – Frontend role"
                    className="w-full rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    This name will show in your keys list and session logs.
                  </p>
                </div>
                <button
                  onClick={handleCreateKey}
                  disabled={(me?.credits ?? 0) <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-blue-400 hover:to-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3.5a.75.75 0 01.75.75V9.25h5a.75.75 0 010 1.5h-5v5a.75.75 0 01-1.5 0v-5h-5a.75.75 0 010-1.5h5V4.25A.75.75 0 0110 3.5z" />
                  </svg>
                  Generate key
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-[11px] text-slate-300 space-y-2">
              <h4 className="text-xs font-semibold text-slate-100">
                Usage tips
              </h4>
              <ul className="space-y-1.5">
                <li className="flex gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Share each key with one client only. Keys expire automatically
                  after 6 hours or once used.
                </li>
                <li className="flex gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-blue-400" />
                  If a client’s interview is stopped before 10 minutes, your
                  credit is refunded and the key is revoked.
                </li>
                <li className="flex gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-violet-400" />
                  You can manually revoke keys that haven’t been fully consumed
                  yet; credits will be refunded when eligible.
                </li>
              </ul>
            </div>
          </section>

          {/* Keys above, Session logs below (no side-by-side) */}
          <section className="space-y-4">
            {/* Keys list */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">
                  Generated client keys
                </h3>
                <span className="text-[11px] text-slate-400">
                  {totalKeys === 0
                    ? "No keys generated yet"
                    : `${activeKeys} active · ${usedKeys} used · ${revokedKeys} revoked/refunded`}
                </span>
              </div>
              <div className="mt-1 -mx-2 overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="px-2 py-1.5 text-left font-medium">
                        ID
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Name
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Key
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Status
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Expires in
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Created
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Used at
                      </th>
                      <th className="px-2 py-1.5 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-2 py-4 text-center text-slate-500"
                        >
                          No keys yet. Generate one to get started.
                        </td>
                      </tr>
                    )}
                    {keys.map((k) => (
                      <KeyRow
                        key={k.id}
                        keyData={k}
                        onRevoke={() => openRevokeConfirm(k)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Session logs */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">
                  Client session logs (your keys)
                </h3>
                <span className="text-[11px] text-slate-400">
                  {logs.length === 0
                    ? "No sessions recorded yet"
                    : `${logs.length} sessions`}
                </span>
              </div>
              <div className="mt-1 -mx-2 overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="px-2 py-1.5 text-left font-medium">
                        Client key
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Session ID
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Started
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Ended
                      </th>
                      <th className="px-2 py-1.5 text-left font-medium">
                        Duration (min)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-2 py-4 text-center text-slate-500"
                        >
                          No session logs yet.
                        </td>
                      </tr>
                    )}
                    {logs.map((log) => (
                      <tr
                        key={log.sessionId}
                        className="border-b border-slate-900/80 last:border-0"
                      >
                        <td className="px-2 py-1.5 align-top text-slate-100">
                          {/* Backend already sends label = "id name" or "id key" */}
                          {log.label}
                        </td>
                        <td className="px-2 py-1.5 align-top text-slate-200">
                          #{log.sessionId}
                        </td>
                        <td className="px-2 py-1.5 align-top text-slate-200">
                          {new Date(log.startedAt).toLocaleString()}
                        </td>
                        <td className="px-2 py-1.5 align-top">
                          {log.endedAt ? (
                            <span className="text-slate-200">
                              {new Date(log.endedAt).toLocaleString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200 border border-emerald-500/40">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active / unknown
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-1.5 align-top text-slate-200">
                          {log.durationMinutes != null
                            ? log.durationMinutes
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Revoke confirmation dialog */}
      {revokeTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
            <h4 className="text-sm font-semibold text-slate-100 mb-1">
              Revoke client key #{revokeTarget.id}
              {revokeTarget.name ? ` (${revokeTarget.name})` : ""}
              ?
            </h4>
            <p className="text-[11px] text-slate-300 mb-3">
              This will revoke the key so it can no longer be used. If the
              associated interview time is under 10 minutes or no session was
              started, the admin credit will be refunded.
            </p>
            <p className="text-[10px] font-mono text-slate-400 mb-4 break-all">
              {revokeTarget.key}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRevokeTarget(null)}
                disabled={revokeLoading}
                className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-700 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevoke}
                disabled={revokeLoading}
                className="inline-flex items-center gap-1 rounded-md border border-rose-500/60 bg-rose-600/20 px-3 py-1 text-[11px] font-medium text-rose-100 hover:bg-rose-600/30 disabled:opacity-60"
              >
                {revokeLoading ? "Revoking..." : "Revoke key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
    <div
      className={`pointer-events-none absolute -right-6 -top-10 h-20 w-20 rounded-full bg-gradient-to-br ${accent} opacity-25 blur-2xl`}
    />
    <div className="relative z-10 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold tracking-tight">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </span>
    </div>
  </div>
);

const KeyRow = ({ keyData, onRevoke }) => {
  const [copied, setCopied] = useState(false);

  const now = Date.now();
  const exp = new Date(keyData.expiresAt).getTime();
  const diffMs = exp - now;

  let expiresIn = "";
  if (keyData.revoked || keyData.refunded) {
    expiresIn = "—";
  } else if (diffMs <= 0) {
    expiresIn = "Expired";
  } else {
    const totalSec = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    expiresIn = `${h}h ${m}m ${s}s`;
  }

  let status = "Active";
  if (keyData.revoked || keyData.refunded) {
    status = keyData.refunded ? "Revoked (refunded)" : "Revoked";
  } else if (keyData.used) {
    status = "Used";
  } else if (diffMs <= 0) {
    status = "Expired";
  } else {
    status = "Active";
  }

  const statusClasses =
    status.startsWith("Active")
      ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/40"
      : status.startsWith("Used")
      ? "bg-blue-500/10 text-blue-200 border-blue-500/40"
      : status.startsWith("Revoked")
      ? "bg-rose-500/10 text-rose-200 border-rose-500/40"
      : "bg-slate-700/40 text-slate-200 border-slate-500/40";

  const canRevoke = !keyData.revoked && !keyData.refunded;

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(keyData.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <tr className="border-b border-slate-900/80 last:border-0">
      <td className="px-2 py-1.5 align-top text-slate-100 text-[11px]">
        #{keyData.id}
      </td>
      <td className="px-2 py-1.5 align-top text-slate-100 text-[11px] max-w-[180px] truncate">
        {keyData.name || <span className="text-slate-500">—</span>}
      </td>
      <td className="px-2 py-1.5 align-top font-mono text-[10px] text-slate-100 max-w-[220px] break-all">
        {keyData.key}
      </td>
      <td className="px-2 py-1.5 align-top">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${statusClasses}`}
        >
          {status}
        </span>
      </td>
      <td className="px-2 py-1.5 align-top text-slate-200">{expiresIn}</td>
      <td className="px-2 py-1.5 align-top text-slate-200 whitespace-nowrap">
        {new Date(keyData.createdAt).toLocaleString()}
      </td>
      <td className="px-2 py-1.5 align-top text-slate-200 whitespace-nowrap">
        {keyData.usedAt ? new Date(keyData.usedAt).toLocaleString() : "—"}
      </td>
      <td className="px-2 py-1.5 align-top text-right">
        <div className="inline-flex items-center gap-1.5">
          <button
            onClick={copyKey}
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-200 hover:bg-slate-800 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={onRevoke}
            disabled={!canRevoke}
            className="inline-flex items-center justify-center rounded-md border border-rose-600/70 bg-rose-600/10 px-2 py-0.5 text-[10px] text-rose-200 hover:bg-rose-600/20 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
          >
            Revoke
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Admin;