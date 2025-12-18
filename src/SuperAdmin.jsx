import React, { useEffect, useState } from "react";
import {
  login,
  getMe,
  setToken,
  fetchAdminKeys,
  fetchAdmins,
  createAdminKey,
  updateAdminCredits,
} from "./api2";

const SuperAdmin = () => {
  const [view, setView] = useState("loading");
  const [me, setMe] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [keys, setKeys] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const u = await getMe();
        if (u.role !== "super_admin") throw new Error("Not super_admin");

        setMe(u);
        await loadData();
        setView("dashboard");
      } catch {
        setView("login");
      }
    })();
  }, []);

  async function loadData() {
    const [k, a] = await Promise.all([fetchAdminKeys(), fetchAdmins()]);
    setKeys(k);
    setAdmins(a);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    try {
      const u = await login(email, password);
      if (u.role !== "super_admin") {
        setToken(null);
        throw new Error("Not a super_admin");
      }

      setMe(u);
      await loadData();
      setView("dashboard");
    } catch (err) {
      setLoginError(err.message || "Login failed");
    }
  }

  function handleLogout() {
    setToken(null);
    setMe(null);
    setView("login");
  }

  async function handleCreateKey() {
    try {
      const newKey = await createAdminKey();
      setKeys((prev) => [newKey, ...prev]);
    } catch {
      alert("Failed to create key");
    }
  }

  async function handleCreditsChange(admin, value) {
    try {
      const updated = await updateAdminCredits(admin.id, value);
      setAdmins((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch {
      alert("Failed to update credits");
    }
  }

  // Group admins by key
  const adminsByKey = {};
  admins.forEach((a) => {
    const k = a.adminInviteKey || "NO_KEY";
    if (!adminsByKey[k]) adminsByKey[k] = [];
    adminsByKey[k].push(a);
  });

  // Filter by search
  const filteredAdminsByKey = {};
  Object.entries(adminsByKey).forEach(([k, arr]) => {
    const filtered = arr.filter((a) =>
      a.email.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) filteredAdminsByKey[k] = filtered;
  });

  const totalAdmins = admins.length;
  const totalKeys = keys.length;
  const totalCredits = admins.reduce(
    (sum, a) => sum + (typeof a.credits === "number" ? a.credits : 0),
    0
  );

  /* -----------------------------------------
     LOADING
     ----------------------------------------- */
  if (view === "loading") {
    return (
      <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-neutral-700 border-t-indigo-500 animate-spin" />
          <p className="text-xs text-neutral-400 tracking-wide">
            Loading super admin console…
          </p>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     LOGIN
     ----------------------------------------- */
  if (view === "login") {
    return (
      <div className="min-h-screen bg-black text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-6 text-center space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Super Admin Console
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in to manage admins, invite keys and credits.
            </p>
          </div>

          {/* Card */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />
            <div className="relative rounded-2xl bg-neutral-950/90 border border-neutral-800 shadow-[0_18px_50px_rgba(0,0,0,0.7)] backdrop-blur-sm px-6 py-6 transition-all duration-300 ease-out">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium">Super admin sign in</h2>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Restricted access. All actions are logged.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-black px-2 py-1 border border-neutral-800 text-[10px] text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Elevated
                </span>
              </div>

              {loginError && (
                <div className="mb-4 flex gap-2 rounded-md border border-red-500/40 bg-red-500/5 px-3 py-2 text-xs text-red-200">
                  <svg
                    className="h-4 w-4 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59C19.021 16.88 18.245 18 17.017 18H2.983c-1.228 0-2.004-1.12-1.244-2.31l6.518-11.59zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-6a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>{loginError}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[11px] text-neutral-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="w-full rounded-lg bg-black border border-neutral-800 px-3 py-2 text-xs text-slate-100 placeholder:text-neutral-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] text-neutral-200">
                      Password
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      Super admins only
                    </span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-black border border-neutral-800 px-3 py-2 text-xs text-slate-100 placeholder:text-neutral-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-lg bg-indigo-500 text-xs font-medium text-white py-2.5 transition-all duration-200 hover:bg-indigo-400 hover:-translate-y-0.5 hover:shadow-md shadow-indigo-500/30 inline-flex items-center justify-center gap-2"
                >
                  <span>Sign in as super admin</span>
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

              <p className="mt-4 text-[11px] text-neutral-500 text-center">
                Access is restricted to authorized super admins. All activity is
                audited.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------------------
     DASHBOARD
     ----------------------------------------- */
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-xs font-semibold text-indigo-300">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                Super admin
              </span>
              <span className="text-sm font-medium tracking-tight">
                Control dashboard
              </span>
              <span className="text-[11px] text-neutral-500">
                {me?.email} · {me?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black border border-emerald-500/40 px-3 py-1 text-[11px] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Elevated access
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-black px-3 py-1 text-[11px] font-medium text-neutral-200 hover:border-red-400 hover:text-red-100 hover:bg-red-500/10 transition"
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
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Stats + Controls */}
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard label="Total admins" value={totalAdmins} />
              <StatCard label="Active invite keys" value={totalKeys} />
              <StatCard label="Allocated credits" value={totalCredits} />

              <div className="rounded-xl border border-neutral-900 bg-neutral-950/80 px-4 py-3 text-xs flex flex-col justify-between shadow-sm">
                <span className="text-[11px] uppercase tracking-wide text-neutral-400">
                  Quick action
                </span>

                <button
                  onClick={handleCreateKey}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-400 hover:shadow-md transition-all"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3.5a.75.75 0 01.75.75V9.25h5a.75.75 0 010 1.5h-5v5a.75.75 0 01-1.5 0v-5h-5a.75.75 0 010-1.5h5V4.25A.75.75 0 0110 3.5z" />
                  </svg>
                  Create admin key
                </button>

                <p className="mt-2 text-[11px] text-neutral-500">
                  Generate a new invite key and share it only with trusted
                  admins.
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>Search by email to quickly find admins.</span>
              </div>

              <div className="relative w-full md:w-72">
                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
                  <svg
                    className="h-3.5 w-3.5 text-neutral-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 103.477 9.8l3.611 3.612a.75.75 0 101.06-1.061l-3.61-3.611A5.5 5.5 0 009 3.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Search admins by email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-neutral-800 bg-black pl-7 pr-3 py-1.5 text-[11px] text-slate-100 placeholder:text-neutral-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition"
                />
              </div>
            </div>
          </section>

          {/* Keys + Admins */}
          <section className="grid gap-4 md:grid-cols-2">
            {keys.map((k) => {
              const keyAdmins = filteredAdminsByKey[k.key] || [];
              const totalForKey = adminsByKey[k.key]?.length || 0;

              return (
                <KeyCard
                  key={k.id}
                  adminKey={k}
                  admins={keyAdmins}
                  totalAdmins={totalForKey}
                  onChangeCredits={handleCreditsChange}
                />
              );
            })}

            {filteredAdminsByKey["NO_KEY"] && (
              <NoKeyAdminsCard
                admins={filteredAdminsByKey["NO_KEY"]}
                onChangeCredits={handleCreditsChange}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

/* -----------------------------------------
   SUB-COMPONENTS
   ----------------------------------------- */

const StatCard = ({ label, value }) => (
  <div className="relative overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/80 px-4 py-3 shadow-sm transition-all duration-200 hover:border-neutral-700 hover:shadow-md hover:-translate-y-0.5">
    <div className="absolute -right-4 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500/25 via-sky-500/10 to-transparent opacity-70 blur-xl pointer-events-none" />
    <div className="relative flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-neutral-400">
        {label}
      </span>
      <span className="text-lg font-semibold tracking-tight text-neutral-50">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </span>
    </div>
  </div>
);

const KeyCard = ({ adminKey, admins, totalAdmins, onChangeCredits }) => {
  const [copied, setCopied] = useState(false);

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(adminKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-neutral-900 bg-neutral-950/80 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-neutral-400">
              Invite key
            </span>
            <span className="inline-flex items-center rounded-full bg-black px-2 py-0.5 text-[10px] text-neutral-200 border border-neutral-700">
              {totalAdmins} admins
            </span>
          </div>

          <div className="flex items-center gap-2">
            <code className="flex-1 max-w-[220px] truncate rounded-md bg-black px-2 py-1 text-[11px] font-mono text-neutral-50 border border-neutral-800">
              {adminKey.key}
            </code>

            <button
              onClick={copyKey}
              className="inline-flex items-center justify-center rounded-md border border-neutral-800 bg-black px-2 py-1 text-[10px] text-neutral-200 hover:bg-neutral-900 hover:border-neutral-600 transition"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="text-right text-[11px] text-neutral-500">
          <div>Created</div>
          <div className="text-neutral-200">
            {new Date(adminKey.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {admins.length === 0 ? (
        <div className="mt-1 flex flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-black/60 px-3 py-6 text-center text-[11px] text-neutral-500">
          No admins match the current search for this key.
        </div>
      ) : (
        <div className="mt-1 -mx-2 overflow-x-auto">
          <table className="min-w-full text-[11px]">
            <thead>
              <tr className="border-b border-neutral-900 text-neutral-400 bg-black/60">
                <th className="px-2 py-1.5 text-left font-medium">Email</th>
                <th className="px-2 py-1.5 text-right font-medium w-20">
                  Credits
                </th>
                <th className="px-2 py-1.5 text-right font-medium w-16">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {admins.map((a) => (
                <AdminRow
                  key={a.id}
                  admin={a}
                  onChangeCredits={onChangeCredits}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const NoKeyAdminsCard = ({ admins, onChangeCredits }) => (
  <div className="flex flex-col rounded-xl border border-amber-500/40 bg-neutral-950/80 p-4 shadow-sm">
    <div className="mb-3 space-y-1">
      <span className="text-[11px] uppercase tracking-wide text-amber-300">
        Admins without key
      </span>

      <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-100 border border-amber-500/40">
        {admins.length} admins
      </span>

      <p className="text-[11px] text-neutral-300">
        These admins were created directly and are not attached to any invite
        key.
      </p>
    </div>

    <div className="-mx-2 overflow-x-auto">
      <table className="min-w-full text-[11px]">
        <thead>
          <tr className="border-b border-neutral-900 text-neutral-400 bg-black/60">
            <th className="px-2 py-1.5 text-left font-medium">Email</th>
            <th className="px-2 py-1.5 text-right font-medium w-20">
              Credits
            </th>
            <th className="px-2 py-1.5 text-right font-medium w-16">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {admins.map((a) => (
            <AdminRow key={a.id} admin={a} onChangeCredits={onChangeCredits} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminRow = ({ admin, onChangeCredits }) => {
  const [value, setValue] = useState(admin.credits);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await onChangeCredits(admin, value);
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-neutral-900 last:border-0 hover:bg-black/60 transition-colors">
      <td className="px-2 py-1.5 align-top text-neutral-50">
        <div className="flex flex-col">
          <span className="truncate max-w-[180px]">{admin.email}</span>
          {admin.role && (
            <span className="text-[10px] text-neutral-500">
              {admin.role}
            </span>
          )}
        </div>
      </td>

      <td className="px-2 py-1.5 align-top text-right">
        <input
          type="number"
          min={0}
          className="w-20 rounded-md border border-neutral-800 bg-black px-2 py-0.5 text-right text-[11px] text-neutral-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 transition"
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value || "0", 10);
            setValue(Number.isNaN(n) ? 0 : n);
          }}
        />
      </td>

      <td className="px-2 py-1.5 align-top text-right">
        <button
          disabled={saving}
          onClick={save}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-semibold text-black hover:bg-emerald-400 disabled:opacity-60 transition"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </td>
    </tr>
  );
};

export default SuperAdmin;