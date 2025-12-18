const API_BASE = "https://34.93.25.2:3001";

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string|null} name
 * @property {string} role
 * @property {number} credits
 */

/**
 * @typedef {Object} ClientKey
 * @property {number} id
 * @property {string} key
 * @property {string|null} name
 * @property {number} adminId
 * @property {number|null} clientId
 * @property {string} createdAt
 * @property {string} expiresAt
 * @property {string|null} usedAt
 * @property {boolean} used
 * @property {boolean} revoked
 * @property {string|null} revokedAt
 * @property {boolean} refunded
 * @property {string|null} refundedAt
 */

/**
 * Admin /admin/session-logs response shape
 * @typedef {Object} SessionLog
 * @property {number} sessionId
 * @property {number} userId
 * @property {string} startedAt
 * @property {string|null} endedAt
 * @property {number|null} durationMinutes
 * @property {number|null} keyId
 * @property {string|null} keyName
 * @property {string|null} key
 * @property {string} label  // "id name" or "id key"
 */

/**
 * @typedef {Object} CreateClientKeyResponse
 * @property {ClientKey} key
 * @property {number} remainingCredits
 */

let token = localStorage.getItem("admin_token");

export function setToken(t) {
  token = t;
  if (t) localStorage.setItem("admin_token", t);
  else localStorage.removeItem("admin_token");
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
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Invalid credentials");
  }

  const data = await res.json();
  setToken(data.token);
  return data.user;
}

// --------- ADMIN SIGNUP ---------
export async function adminSignup(email, password, name, inviteKey) {
  const res = await fetch(`${API_BASE}/auth/admin-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, inviteKey }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Signup failed");
  }

  const data = await res.json();
  setToken(data.token);
  return data.user;
}

// --------- CURRENT USER ---------
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

// --------- CLIENT KEYS ---------
/**
 * Fetch all client keys for the current admin.
 * @returns {Promise<ClientKey[]>}
 */
export async function fetchClientKeys() {
  const res = await fetch(`${API_BASE}/admin/client-keys`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to load client keys");
  return await res.json();
}

/**
 * Create a new client key for the current admin.
 * Optionally send a name for the key.
 *
 * @param {string} [name] - Optional display name for the key
 * @returns {Promise<CreateClientKeyResponse>}
 */
export async function createClientKey(name) {
  const body =
    typeof name === "string" && name.trim().length > 0
      ? { name: name.trim() }
      : {};

  const res = await fetch(`${API_BASE}/admin/client-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.message || "Failed to create client key");
    } catch {
      throw new Error(text || "Failed to create client key");
    }
  }

  return await res.json();
}

// --------- SESSION LOGS ---------
/**
 * Fetch session logs for this admin's client keys.
 * @returns {Promise<SessionLog[]>}
 */
export async function fetchSessionLogs() {
  const res = await fetch(`${API_BASE}/admin/session-logs`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to load session logs");
  return await res.json();
}

// --------- REVOKE CLIENT KEY ---------
export async function revokeClientKey(id) {
  const res = await fetch(`${API_BASE}/admin/client-keys/${id}/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // ignore parse error
  }

  if (!res.ok) {
    throw new Error(data.message || text || "Failed to revoke key");
  }

  return data;
}
