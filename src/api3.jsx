// api3.jsx — Personal Admin + User API (all /ff/* routes)
// Updated to match all backend endpoints including:
// - Coupon system
// - Key login
// - Razorpay live payments (with test mode fallback)
// - Affiliate + coupon codes at signup/google login

const API_BASE = "http://34.93.25.2:3001";

// ─── TOKEN STORAGE ────────────────────────────────────────────────────────────
let ffToken = localStorage.getItem("ff_token");

export function setFFToken(t) {
  ffToken = t;
  if (t) localStorage.setItem("ff_token", t);
  else localStorage.removeItem("ff_token");
}
export function getFFToken() { return ffToken; }
export function clearFFToken() { ffToken = null; localStorage.removeItem("ff_token"); }

function headers() {
  return {
    "Content-Type": "application/json",
    ...(ffToken ? { Authorization: `Bearer ${ffToken}` } : {}),
  };
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.error || `Error ${res.status}`);
    err.code   = data.code   || null;
    err.status = res.status;
    err.retry  = data.retry  || false; // for 202 payment-in-progress
    throw err;
  }
  return data;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

// coupon_code and affiliate_code are optional — pass null if not provided
export async function ffSignup(name, email, password, coupon_code = null, affiliate_code = null) {
  const res = await fetch(`${API_BASE}/ff/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, coupon_code, affiliate_code }),
  });
  const data = await handle(res);
  setFFToken(data.token);
  return data.user;
}

export async function ffLogin(email, password) {
  const res = await fetch(`${API_BASE}/ff/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handle(res);
  setFFToken(data.token);
  return data.user;
}

// coupon_code and affiliate_code captured for new Google users only
export async function ffGoogleLogin(credential, coupon_code = null, affiliate_code = null) {
  const res = await fetch(`${API_BASE}/ff/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, coupon_code, affiliate_code }),
  });
  const data = await handle(res);
  setFFToken(data.token);
  return data.user;
}

export async function ffPersonalAdminSignup(name, email, password, secret) {
  const res = await fetch(`${API_BASE}/ff/auth/personal-admin-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, secret }),
  });
  const data = await handle(res);
  setFFToken(data.token);
  return data.user;
}

// Login using a generated ff key directly — marks key used + opens session
// Returns { user, token, sessionId, reused }
export async function ffKeyLogin(key) {
  const res = await fetch(`${API_BASE}/ff/auth/key-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  const data = await handle(res);
  setFFToken(data.token);
  return data; // { user, token, sessionId, reused }
}

export async function ffGetMe() {
  const res = await fetch(`${API_BASE}/ff/me`, { headers: headers() });
  return handle(res);
}

export function ffLogout() { clearFFToken(); }

// ─── PLANS ────────────────────────────────────────────────────────────────────

export async function fetchActivePlans() {
  const res = await fetch(`${API_BASE}/ff/plans`, {
    headers: { "Content-Type": "application/json" },
  });
  return handle(res);
}

export async function fetchAllPlans() {
  const res = await fetch(`${API_BASE}/ff/plans/all`, { headers: headers() });
  return handle(res);
}

export async function createPlan(planData) {
  // planData: { name, description?, price_inr, credits }
  const res = await fetch(`${API_BASE}/ff/plans`, {
    method: "POST", headers: headers(), body: JSON.stringify(planData),
  });
  return handle(res);
}

export async function updatePlan(planId, fields) {
  // fields: any of { name, description, price_inr, credits, is_active }
  const res = await fetch(`${API_BASE}/ff/plans/${planId}`, {
    method: "PATCH", headers: headers(), body: JSON.stringify(fields),
  });
  return handle(res);
}

export async function deactivatePlan(planId) {
  const res = await fetch(`${API_BASE}/ff/plans/${planId}`, {
    method: "DELETE", headers: headers(),
  });
  return handle(res);
}

// ─── COUPONS (user-facing) ────────────────────────────────────────────────────

// Validate a coupon before paying — returns discount preview
// Returns { valid, coupon, discounted_price_inr, discount_amount_inr }
export async function validateCoupon(code, plan_id = null) {
  const res = await fetch(`${API_BASE}/ff/coupon/validate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ code, plan_id }),
  });
  return handle(res);
}

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────

// TEST MODE — adds credits instantly without Razorpay
export async function testAddCredits(planId) {
  const res = await fetch(`${API_BASE}/ff/payment/test-add-credits`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ plan_id: planId }),
  });
  return handle(res);
}

// LIVE MODE — Step 1: create Razorpay order
// Returns { order_id, amount, currency, key_id, plan, final_amount_inr,
//           discount_amount_inr, affiliate_applied, coupon_applied }
// If 100% coupon: returns { free_order: true, credits_added, credits_balance }
export async function createPaymentOrder(planId, couponCode = null, affiliateCode = null) {
  const res = await fetch(`${API_BASE}/ff/payment/create-order`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({
      plan_id:        planId,
      coupon_code:    couponCode    || undefined,
      affiliate_code: affiliateCode || undefined,
    }),
  });
  return handle(res);
}

// LIVE MODE — Step 2: verify payment after Razorpay checkout completes
// Call this in Razorpay handler.success callback
// Returns { success, credits_added, credits_balance }
// May return { retry: true } if webhook is mid-processing — poll again after 2s
export async function verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  const res = await fetch(`${API_BASE}/ff/payment/verify`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
  // 202 means "still processing" — not an error, check data.retry
  if (res.status === 202) {
    const data = await res.json().catch(() => ({}));
    return { ...data, retry: true };
  }
  return handle(res);
}

export async function fetchMyPaymentHistory() {
  const res = await fetch(`${API_BASE}/ff/payment/history`, { headers: headers() });
  return handle(res);
}

// ─── COMPLETE RAZORPAY CHECKOUT FLOW ─────────────────────────────────────────
// Use this helper in your payment UI — handles the full flow including retry
// Usage:
//   const result = await launchRazorpay(planId, couponCode, affiliateCode, {
//     onSuccess: (data) => console.log("Paid!", data.credits_added),
//     onFailure: (err)  => console.error("Failed", err),
//   });

export async function launchRazorpay(planId, couponCode = null, affiliateCode = null, callbacks = {}) {
  const { onSuccess, onFailure, onDismiss } = callbacks;

  // Step 1: Create order
  let order;
  try {
    order = await createPaymentOrder(planId, couponCode, affiliateCode);
  } catch (err) {
    onFailure?.(err);
    return;
  }

  // 100% coupon — already credited, no Razorpay popup needed
  if (order.free_order) {
    onSuccess?.(order);
    return;
  }

  // Step 2: Open Razorpay checkout
  // Make sure you load Razorpay script: <script src="https://checkout.razorpay.com/v1/checkout.js">
  const rzp = new window.Razorpay({
    key:         order.key_id,
    amount:      order.amount,
    currency:    order.currency,
    order_id:    order.order_id,
    name:        "Interview App",
    description: `${order.plan.name} — ${order.plan.credits} credit(s)`,
    handler: async (response) => {
      // Step 3: Verify with backend
      try {
        let result = await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
        );

        // Retry once if webhook is mid-processing
        if (result.retry) {
          await new Promise((r) => setTimeout(r, 2500));
          result = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );
        }

        onSuccess?.(result);
      } catch (err) {
        onFailure?.(err);
      }
    },
    modal: {
      ondismiss: () => onDismiss?.(),
    },
    prefill: {},
    theme: { color: "#4F46E5" },
  });

  rzp.open();
}

// ─── USER KEYS ────────────────────────────────────────────────────────────────

// Generates a new key — always costs 1 credit, always creates fresh key
// Returns { key, expires_at, reused: false }
export async function generateUserKey() {
  const res = await fetch(`${API_BASE}/ff/user/generate-key`, {
    method: "POST", headers: headers(),
  });
  return handle(res);
}

// Start a session using a key (without key-login flow)
// Returns { sessionId, reused }
export async function startSession(key) {
  const res = await fetch(`${API_BASE}/ff/user/start-session`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ key }),
  });
  return handle(res);
}

// Stop the current open session
// Returns { durationMinutes, creditsDeducted, refunded, message }
export async function stopSession() {
  const res = await fetch(`${API_BASE}/ff/user/stop-session`, {
    method: "POST", headers: headers(),
  });
  return handle(res);
}

// List all keys for the current user
export async function fetchMyKeys() {
  const res = await fetch(`${API_BASE}/ff/user/keys`, { headers: headers() });
  return handle(res);
}

// ─── AFFILIATE (user-facing) ──────────────────────────────────────────────────

export async function joinAffiliate() {
  const res = await fetch(`${API_BASE}/ff/affiliate/join`, {
    method: "POST", headers: headers(),
  });
  return handle(res);
}

// Returns affiliate stats including code, total_earned, pending_payout, total_referrals
export async function fetchMyAffiliateStats() {
  const res = await fetch(`${API_BASE}/ff/affiliate/me`, { headers: headers() });
  return handle(res);
}

// Returns list of successful referral payments
export async function fetchMyReferrals() {
  const res = await fetch(`${API_BASE}/ff/affiliate/my-referrals`, { headers: headers() });
  return handle(res);
}

// ─── PERSONAL ADMIN — DASHBOARD & USERS ──────────────────────────────────────

// Returns { total_users, total_revenue_inr, total_affiliates,
//           total_pending_payout, total_tracked_visitors, today_logins }
export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/dashboard`, { headers: headers() });
  return handle(res);
}

// options: { limit, offset, method: 'google'|'email'|'email_signup', returning: true|false }
export async function fetchPersonalUsers(options = {}) {
  const params = new URLSearchParams();
  if (options.limit     !== undefined) params.set("limit",     options.limit);
  if (options.offset    !== undefined) params.set("offset",    options.offset);
  if (options.method    !== undefined) params.set("method",    options.method);
  if (options.returning !== undefined) params.set("returning", options.returning);
  const qs = params.toString() ? `?${params}` : "";
  const res = await fetch(`${API_BASE}/ff/personal-admin/personal-users${qs}`, { headers: headers() });
  return handle(res);
}

export async function fetchTodayUsers() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/personal-users/today`, { headers: headers() });
  return handle(res);
}

// Returns all payments with user_name, user_email, plan_name
export async function fetchAllPayments() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/payments`, { headers: headers() });
  return handle(res);
}

export async function fetchAllUsers() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/users`, { headers: headers() });
  return handle(res);
}

// Set absolute credit value for a user
export async function setUserCredits(userId, credits) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/users/${userId}/credits`, {
    method: "PATCH", headers: headers(),
    body: JSON.stringify({ credits }),
  });
  return handle(res);
}

// ─── PERSONAL ADMIN — SETTINGS ───────────────────────────────────────────────

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/settings`, { headers: headers() });
  return handle(res);
}

// key: any ff_app_settings key, value: string
export async function updateSetting(key, value) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/settings`, {
    method: "PATCH", headers: headers(),
    body: JSON.stringify({ key, value }),
  });
  return handle(res);
}

export async function updateDefaultCommission(commission_percent) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/default-commission`, {
    method: "PATCH", headers: headers(),
    body: JSON.stringify({ commission_percent }),
  });
  return handle(res);
}

// ─── PERSONAL ADMIN — AFFILIATES ─────────────────────────────────────────────

// Returns affiliates with user_name, user_email, total_referrals
export async function fetchAllAffiliates() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/affiliates`, { headers: headers() });
  return handle(res);
}

export async function updateAffiliateCommission(affiliateId, commission_percent) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/affiliates/${affiliateId}/commission`, {
    method: "PATCH", headers: headers(),
    body: JSON.stringify({ commission_percent }),
  });
  return handle(res);
}

export async function toggleAffiliate(affiliateId) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/affiliates/${affiliateId}/toggle`, {
    method: "PATCH", headers: headers(),
  });
  return handle(res);
}

export async function approveAffiliatePayout(affiliateId, note = "") {
  const res = await fetch(`${API_BASE}/ff/personal-admin/affiliates/${affiliateId}/approve-payout`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ note }),
  });
  return handle(res);
}

export async function fetchAffiliatePayouts(affiliateId) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/affiliates/${affiliateId}/payouts`, {
    headers: headers(),
  });
  return handle(res);
}

// ─── PERSONAL ADMIN — COUPONS ─────────────────────────────────────────────────

// Create a coupon
// couponData: {
//   code: string,              required — auto uppercased
//   discount_type: 'percent' | 'flat',  required
//   discount_value: number,    required — percent (1-100) or flat INR amount
//   description?: string,
//   max_uses?: number,         null = unlimited
//   plan_id?: number,          null = works for all plans
//   expires_at?: string,       ISO date string, null = no expiry
// }
export async function createCoupon(couponData) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/coupons`, {
    method: "POST", headers: headers(),
    body: JSON.stringify(couponData),
  });
  return handle(res);
}

// List all coupons with plan_name and total_uses count
export async function fetchAllCoupons() {
  const res = await fetch(`${API_BASE}/ff/personal-admin/coupons`, { headers: headers() });
  return handle(res);
}

// Edit a coupon — any subset of fields
// fields: { description, discount_type, discount_value, max_uses, plan_id, expires_at, is_active }
export async function updateCoupon(couponId, fields) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/coupons/${couponId}`, {
    method: "PATCH", headers: headers(),
    body: JSON.stringify(fields),
  });
  return handle(res);
}

// Soft-delete (deactivate) a coupon
export async function deactivateCoupon(couponId) {
  const res = await fetch(`${API_BASE}/ff/personal-admin/coupons/${couponId}`, {
    method: "DELETE", headers: headers(),
  });
  return handle(res);
}