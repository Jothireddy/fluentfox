// superAdminApi.jsx

const API_BASE = "http://34.93.25.2:3001";

// ------- TOKEN STORAGE -------
let token = localStorage.getItem("sa_token");

export function setToken(t) {
  token = t;
  if (t) localStorage.setItem("sa_token", t);
  else localStorage.removeItem("sa_token");
}

function authHeaders() {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// --------- LOGIN ---------
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  setToken(data.token);
  return data.user;
}

// --------- GET CURRENT SUPER ADMIN ---------
export async function getMe() {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to load /me");
  return await res.json();
}

// --------- FETCH ADMIN INVITE KEYS ---------
export async function fetchAdminKeys() {
  const res = await fetch(`${API_BASE}/super-admin/admin-keys`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to load admin keys");
  return await res.json();
}

// --------- CREATE ADMIN KEY ---------
export async function createAdminKey() {
  const res = await fetch(`${API_BASE}/super-admin/admin-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to create admin key");
  return await res.json();
}

// --------- FETCH ALL ADMINS ---------
export async function fetchAdmins() {
  const res = await fetch(`${API_BASE}/super-admin/admins`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to load admins");
  return await res.json();
}

// --------- UPDATE ADMIN CREDITS ---------
export async function updateAdminCredits(adminId, credits) {
  const res = await fetch(
    `${API_BASE}/super-admin/admins/${adminId}/credits`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ credits }),
    }
  );

  if (!res.ok) throw new Error("Failed to update credits");
  return await res.json();
}
