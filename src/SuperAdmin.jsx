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
import {
  Shell,
  Brand,
  Button,
  Field,
  Badge,
  Tile,
  StatCard,
  Toast,
  CopyButton,
  Empty,
  LoadingScreen,
  Icon,
} from "./AdminTheme";

function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(s = "") {
  const p = s.trim().split(/[\s@._-]+/).filter(Boolean);
  return ((p[0]?.[0] || "A") + (p[1]?.[0] || "")).toUpperCase();
}

const SuperAdmin = () => {
  const [view, setView] = useState("loading");
  const [me, setMe] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [keys, setKeys] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);

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
    setLoginLoading(true);
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
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setMe(null);
    setView("login");
  }

  async function handleCreateKey() {
    setCreating(true);
    try {
      const newKey = await createAdminKey();
      setKeys((prev) => [newKey, ...prev]);
      setToast({ type: "success", message: "New admin invite key created." });
    } catch {
      setToast({ type: "error", message: "Failed to create key" });
    } finally {
      setCreating(false);
    }
  }

  async function handleCreditsChange(admin, value) {
    try {
      const updated = await updateAdminCredits(admin.id, value);
      setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setToast({ type: "success", message: `Credits updated for ${updated.email || admin.email}.` });
    } catch {
      setToast({ type: "error", message: "Failed to update credits" });
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
    const filtered = arr.filter((a) => a.email.toLowerCase().includes(search.toLowerCase()));
    if (filtered.length > 0) filteredAdminsByKey[k] = filtered;
  });

  const totalAdmins = admins.length;
  const totalKeys = keys.length;
  const totalCredits = admins.reduce(
    (sum, a) => sum + (typeof a.credits === "number" ? a.credits : 0),
    0
  );
  const matchCount = Object.values(filteredAdminsByKey).reduce((n, arr) => n + arr.length, 0);

  /* ---------- LOADING ---------- */
  if (view === "loading") {
    return <LoadingScreen text="Loading super admin console…" />;
  }

  /* ---------- LOGIN ---------- */
  if (view === "login") {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center px-5 py-12">
          <div className="w-full max-w-[420px]">
            <div className="ff-in flex flex-col items-center text-center">
              <Brand tag="Super Admin" />
              <h1 className="ff-fg mt-7 text-[30px] font-extrabold tracking-[-0.03em]">
                Control <span className="ff-hl">console</span>
              </h1>
              <p className="ff-fg3 mt-3 text-[13.5px]">
                Manage admins, invite keys and credits.
              </p>
            </div>

            <div className="ff-in mt-8" style={{ animationDelay: ".08s" }}>
              <div className="ff-glass-strong p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="ff-fg text-[15px] font-bold">Sign in</h2>
                    <p className="ff-fg4 mt-0.5 text-[12px]">Restricted access. All actions are logged.</p>
                  </div>
                  <Badge tone="lime" live>
                    Elevated
                  </Badge>
                </div>

                {loginError && (
                  <div className="ff-alert mt-5">
                    <Icon name="alert" size={15} className="mt-[2px] shrink-0" />
                    <p>{loginError}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="mt-5 space-y-4">
                  <Field
                    label="Email"
                    icon="mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                  />
                  <Field
                    label="Password"
                    right="Super admins only"
                    icon="lock"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    iconRight="arrow"
                    loading={loginLoading}
                    className="!mt-6 w-full"
                  >
                    Sign in as super admin
                  </Button>
                </form>
              </div>

              <p className="ff-fg4 mt-5 flex items-center justify-center gap-1.5 text-center text-[11.5px]">
                <Icon name="shield" size={12} /> Authorized super admins only. All activity is audited.
              </p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <Shell>
      <header className="ff-header">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
          <Brand tag="Super Admin" />

          <div className="flex items-center gap-2.5">
            <Badge tone="lime" live className="hidden sm:inline-flex">
              Elevated access
            </Badge>

            <div className="hidden items-center gap-2.5 pl-1 md:flex">
              <span className="ff-avatar">{initials(me?.name || me?.email)}</span>
              <div className="leading-tight">
                <div className="ff-fg max-w-[200px] truncate text-[12.5px] font-semibold">{me?.email}</div>
                <div className="ff-fg4 text-[11px]">{me?.role}</div>
              </div>
            </div>

            <Button variant="ghost" size="sm" icon="logout" onClick={handleLogout} aria-label="Logout">
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8">
        {/* Greeting */}
        <div className="ff-in">
          <div className="ff-eyebrow">Control center</div>
          <h1 className="ff-fg mt-1.5 text-[24px] sm:text-[28px] font-extrabold tracking-[-0.03em]">Admins & invite keys</h1>
          <p className="ff-fg3 mt-1 text-[13.5px]">
            Create invite keys, onboard admins and allocate their credits.
          </p>
        </div>

        {/* Stats + quick action */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Admins" value={totalAdmins} icon="users" tone="lav" hint="Across all keys" delay={0.05} />
          <StatCard label="Invite keys" value={totalKeys} icon="key" tone="lime" hint="Active invite keys" delay={0.1} />
          <StatCard label="Allocated credits" value={totalCredits} icon="zap" tone="tomato" hint="Held by admins" delay={0.15} />

          <div className="ff-in" style={{ animationDelay: ".2s" }}>
            <div className="ff-glass flex h-full flex-col justify-between gap-3 p-4">
              <div className="flex items-center justify-between">
                <span className="ff-eyebrow">Quick action</span>
                <Tile icon="plus" tone="lime" size={30} />
              </div>
              <Button variant="primary" icon="key" loading={creating} onClick={handleCreateKey} className="w-full">
                Create admin key
              </Button>
              <p className="ff-fg4 text-[11.5px]">Share new keys only with trusted admins.</p>
            </div>
          </div>
        </section>

        {/* Search */}
        <section
          className="ff-in flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          style={{ animationDelay: ".24s" }}
        >
          <p className="ff-fg3 text-[12.5px]">
            {search
              ? `${matchCount} admin${matchCount === 1 ? "" : "s"} match "${search}"`
              : "Search by email to quickly find an admin."}
          </p>
          <div className="w-full md:w-80">
            <Field
              icon="search"
              type="text"
              placeholder="Search admins by email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Keys + admins */}
        {keys.length === 0 && !filteredAdminsByKey["NO_KEY"] ? (
          <div className="ff-in" style={{ animationDelay: ".28s" }}>
            <Empty
              icon="key"
              title="No invite keys yet"
              text="Create your first admin invite key to start onboarding admins."
              action={
                <Button variant="primary" icon="plus" loading={creating} onClick={handleCreateKey}>
                  Create admin key
                </Button>
              }
            />
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {keys.map((k, i) => (
              <KeyCard
                key={k.id}
                index={i}
                adminKey={k}
                admins={filteredAdminsByKey[k.key] || []}
                totalAdmins={adminsByKey[k.key]?.length || 0}
                searching={Boolean(search)}
                onChangeCredits={handleCreditsChange}
              />
            ))}

            {filteredAdminsByKey["NO_KEY"] && (
              <NoKeyAdminsCard admins={filteredAdminsByKey["NO_KEY"]} onChangeCredits={handleCreditsChange} />
            )}
          </section>
        )}
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Shell>
  );
};

/* ---------- SUB-COMPONENTS ---------- */

const KeyCard = ({ adminKey, admins, totalAdmins, searching, onChangeCredits, index = 0 }) => (
  <div className="ff-in" style={{ animationDelay: `${0.28 + Math.min(index * 0.05, 0.3)}s` }}>
    <div className="ff-glass flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="ff-eyebrow">Invite key</span>
            <Badge tone="lav">
              <Icon name="users" size={11} />
              {totalAdmins} {totalAdmins === 1 ? "admin" : "admins"}
            </Badge>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <code className="ff-code !max-w-[240px]" title={adminKey.key}>
              {adminKey.key}
            </code>
            <CopyButton text={adminKey.key} />
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="ff-fg4 text-[10.5px] font-semibold uppercase tracking-wider">Created</div>
          <div className="ff-fg2 mt-0.5 text-[12px]">{fmtDate(adminKey.createdAt)}</div>
        </div>
      </div>

      <div className="mt-4 flex-1">
        {admins.length === 0 ? (
          <div className="ff-empty !py-6">
            <p className="ff-fg4 text-[12px]">
              {searching ? "No admins match the current search." : "No admins have joined with this key yet."}
            </p>
          </div>
        ) : (
          <div className="-mx-2 space-y-0.5">
            {admins.map((a, i) => (
              <AdminRow key={a.id} admin={a} index={i} onChangeCredits={onChangeCredits} />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const NoKeyAdminsCard = ({ admins, onChangeCredits }) => (
  <div className="ff-in" style={{ animationDelay: ".32s" }}>
    <div className="ff-glass flex h-full flex-col p-5" style={{ borderColor: "rgba(255,99,71,.28)" }}>
      <div className="flex items-start gap-3">
        <Tile icon="alert" tone="tomato" size={34} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="ff-fg text-[14px] font-bold">Admins without a key</span>
            <Badge tone="tomato">{admins.length}</Badge>
          </div>
          <p className="ff-fg3 mt-1 text-[12px]">
            Created directly and not attached to any invite key.
          </p>
        </div>
      </div>

      <div className="-mx-2 mt-4 space-y-0.5">
        {admins.map((a, i) => (
          <AdminRow key={a.id} admin={a} index={i} onChangeCredits={onChangeCredits} />
        ))}
      </div>
    </div>
  </div>
);

const AdminRow = ({ admin, onChangeCredits, index = 0 }) => {
  const [value, setValue] = useState(admin.credits);
  const [saving, setSaving] = useState(false);

  const dirty = value !== admin.credits;

  async function save() {
    setSaving(true);
    try {
      await onChangeCredits(admin, value);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="ff-row flex items-center gap-3 px-2 py-2"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.3)}s` }}
    >
      <span className="ff-avatar">{initials(admin.email)}</span>

      <div className="min-w-0 flex-1">
        <div className="ff-fg truncate text-[13px] font-semibold">{admin.email}</div>
        {admin.role && <div className="ff-fg4 text-[11px]">{admin.role}</div>}
      </div>

      <div className="ff-stepper" title="Credits">
        <button type="button" aria-label="Decrease credits" onClick={() => setValue((v) => Math.max(0, v - 1))}>
          <Icon name="minus" size={12} />
        </button>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value || "0", 10);
            setValue(Number.isNaN(n) ? 0 : Math.max(0, n));
          }}
          aria-label="Credits"
        />
        <button type="button" aria-label="Increase credits" onClick={() => setValue((v) => v + 1)}>
          <Icon name="plus" size={12} />
        </button>
      </div>

      <Button
        size="sm"
        variant={dirty ? "primary" : "soft"}
        loading={saving}
        disabled={!dirty}
        onClick={save}
        className="w-[70px]"
      >
        {saving ? "" : dirty ? "Save" : "Saved"}
      </Button>
    </div>
  );
};

export default SuperAdmin;