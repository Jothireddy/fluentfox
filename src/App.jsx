import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import Homepage          from "./Homepage";
import AccessPricing     from "./AccessPricing";
import Roadmap           from "./Roadmap";
import QuestionLibrary   from "./QuestionLibrary";
import ResumeTips        from "./ResumeTips";
import SuccessStories    from "./SuccessStories";
import SupportHelp       from "./SupportHelp";

import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy      from "./PrivacyPolicy";
import RefundPolicy       from "./RefundPolicy";
import DeliveryPolicy     from "./DeliveryPolicy";
import ContactPage        from "./ContactPage";

import SuperAdmin    from "./SuperAdmin";
import Admin         from "./Admin";
import PersonalAdmin from "./PersonalAdmin";

import UserAuth, { getUserToken, clearUserToken, apiGetMe } from "./UserAuth";
import UserDashboard from "./UserDashboard";

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header({ user, onLoginClick, onLogout }) {
  const navigate = useNavigate();

  return (
    <header style={{
      background: "#ff4b00",
      borderBottom: "0.5px solid rgba(255,255,255,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 200,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');

        .ffnav-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          padding: 3px 0;
          border-bottom: 1.5px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .ffnav-link:hover  { color: #fff; border-bottom-color: rgba(255,255,255,0.55); }
        .ffnav-link.active { color: #fff; border-bottom-color: #fff; font-weight: 700; }

        .ff-header-badge {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.18);
          color: #fff;
          border-radius: 999px;
          padding: 2px 7px;
          margin-left: 5px;
          vertical-align: middle;
          border: 0.5px solid rgba(255,255,255,0.3);
        }

        .ff-signin-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #fff;
          color: #ff4b00;
          border: none;
          border-radius: 999px;
          padding: 9px 22px;
          cursor: pointer;
          transition: background 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .ff-signin-btn:hover { background: #ffe9dd; transform: translateY(-1px) scale(1.02); }

        .ff-header-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.18);
          border-radius: 999px;
          padding: 5px 14px 5px 5px;
          cursor: pointer;
          transition: background 0.15s;
          border: 0.5px solid rgba(255,255,255,0.12);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ff-header-chip:hover { background: rgba(0,0,0,0.30); }

        .ff-credits-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0,0,0,0.2);
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: 0.5px solid rgba(255,255,255,0.12);
        }

        .ff-logout-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(0,0,0,0.2);
          color: rgba(255,255,255,0.85);
          border: none;
          border-radius: 999px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ff-logout-btn:hover { background: rgba(0,0,0,0.35); }

        @media (max-width: 768px) {
          .ff-header-nav { display: none !important; }
        }
      `}</style>

      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 clamp(16px,3vw,40px)",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}>

        {/* LOGO */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 9 }}>
          <img
            src="public/company_logo.webp"
            alt="FluentFox"
            style={{ height: 30, objectFit: "contain", flexShrink: 0 }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}>
            FluentFox
          </span>
        </Link>

        {/* NAV */}
        <nav className="ff-header-nav" style={{ display: "flex", alignItems: "center", gap: 28, flex: 1, justifyContent: "center" }}>
          <a href="/#how" className="ffnav-link">How it works</a>
          <a href="/#pricing-sec" className="ffnav-link">
            Pricing
            <span className="ff-header-badge">Early access</span>
          </a>
          <NavLink to="/support" className={({ isActive }) => `ffnav-link${isActive ? " active" : ""}`}>
            Support
          </NavLink>
        </nav>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {user ? (
            <>
              <div className="ff-credits-pill">
                <span style={{ fontSize: 13 }}>◎</span>
                <span>{user.credits ?? 0}</span>
                <span style={{ opacity: 0.6, fontSize: 10, fontWeight: 600 }}>credits</span>
              </div>

              <div className="ff-header-chip" onClick={() => navigate("/dashboard")}>
                <div style={{
                  width: 27, height: 27, borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
                <span style={{
                  fontSize: 13, color: "#fff", fontWeight: 600,
                  maxWidth: 110, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user.name || "Account"}
                </span>
              </div>

              <button className="ff-logout-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="ff-signin-btn" onClick={onLoginClick}>
              Sign in →
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const product = [
    { label: "How it works",     path: "/#how"          },
    { label: "Pricing",          path: "/#pricing-sec"  },
    { label: "FAQ",              path: "/#faq"           },
    { label: "Access & Pricing", path: "/access-pricing" },
    { label: "Roadmap",          path: "/roadmap"        },
  ];

  const legal = [
    { label: "Terms & Conditions", path: "/terms"    },
    { label: "Privacy Policy",     path: "/privacy"  },
    { label: "Refund Policy",      path: "/refund"   },
    { label: "Delivery Policy",    path: "/delivery" },
    { label: "Contact Us",         path: "/contact"  },
  ];

  const handleNav = (path) => {
    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
      }
      return;
    }
    navigate(path);
  };

  return (
    <footer style={{ background: "#0d0d0d", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .ff-footer-link {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.48);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.15s;
          display: block;
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .ff-footer-link:hover { color: rgba(255,255,255,0.85); }

        .ff-footer-col-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.24);
          margin-bottom: 18px;
        }

        .ff-footer-ig {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 9px 16px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.58);
          text-decoration: none;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          width: fit-content;
          margin-top: 18px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ff-footer-ig:hover {
          background: rgba(255,75,0,0.12);
          border-color: rgba(255,75,0,0.3);
          color: #fff;
        }

        .ff-footer-bottom-link {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.15s;
        }
        .ff-footer-bottom-link:hover { color: rgba(255,255,255,0.65); }
      `}</style>

      {/* Main grid */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(52px,7vw,80px) clamp(20px,5vw,52px) clamp(36px,5vw,52px)",
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr",
        gap: 52,
      }}>

        {/* Brand */}
        <div>
          {/* Logo image + big wordmark stacked */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <img
              src="public/company_logo.webp"
              alt="FluentFox"
              style={{ height: 36, objectFit: "contain", flexShrink: 0 }}
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
            <span style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}>
              FluentFox
            </span>
          </div>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, maxWidth: 270, margin: 0 }}>
            AI-powered real-time interview assistant.<br />Speak confidently. Land the job.
          </p>

          <a
            href="https://instagram.com/fluentfox"
            target="_blank"
            rel="noopener noreferrer"
            className="ff-footer-ig"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            fluentfox
          </a>
        </div>

        {/* Product */}
        <div>
          <p className="ff-footer-col-title">Product</p>
          {product.map(l => (
            <button key={l.label} className="ff-footer-link" onClick={() => handleNav(l.path)}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Legal */}
        <div>
          <p className="ff-footer-col-title">Legal</p>
          {legal.map(l => (
            <button key={l.label} className="ff-footer-link" onClick={() => navigate(l.path)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "0 clamp(20px,5vw,52px)" }} />

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "20px clamp(20px,5vw,52px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16, flexWrap: "wrap",
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.24)", margin: 0 }}>
          © {year} FluentFox. All rights reserved.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {[
            { label: "Privacy",  path: "/privacy"  },
            { label: "Terms",    path: "/terms"     },
            { label: "Refund",   path: "/refund"    },
            { label: "Contact",  path: "/contact"   },
          ].map((l, i, arr) => (
            <React.Fragment key={l.label}>
              <button className="ff-footer-bottom-link" onClick={() => navigate(l.path)}>
                {l.label}
              </button>
              {i < arr.length - 1 && (
                <span style={{ width: 3, height: 3, borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)", display: "inline-block" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   REDIRECT — needs login
───────────────────────────────────────────── */
function RedirectToHome({ onLoginNeeded }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
    const t = setTimeout(onLoginNeeded, 150);
    return () => clearTimeout(t);
  }, []);
  return null;
}

/* ─────────────────────────────────────────────
   INNER APP
───────────────────────────────────────────── */
function AppInner() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [checked, setChecked]   = useState(false);

  useEffect(() => {
    const token = getUserToken();
    if (token) {
      apiGetMe()
        .then(u => setUser(u))
        .catch(() => clearUserToken())
        .finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, []);

  function handleLogout() {
    clearUserToken();
    setUser(null);
  }

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    setShowAuth(false);
    // Go directly to dashboard after login
    navigate("/dashboard");
  }

  return (
    <>
      {showAuth && (
        <UserAuth
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

      <Routes>
        {/* ── Secret admin panels — standalone ── */}
        <Route path="/lunarecho"  element={<SuperAdmin />} />
        <Route path="/solardrift" element={<Admin />} />
        <Route path="/tiderunner" element={<PersonalAdmin />} />

        {/* ── User dashboard — standalone ── */}
        <Route
          path="/dashboard"
          element={
            !checked ? null :
            !user
              ? <RedirectToHome onLoginNeeded={() => setShowAuth(true)} />
              : <UserDashboard onLogout={handleLogout} />
          }
        />

        {/* ── Legal pages — standalone ── */}
        <Route path="/terms"    element={<TermsAndConditions />} />
        <Route path="/privacy"  element={<PrivacyPolicy />} />
        <Route path="/refund"   element={<RefundPolicy />} />
        <Route path="/delivery" element={<DeliveryPolicy />} />
        <Route path="/contact"  element={<ContactPage />} />

        {/* ── Public site — header + footer ── */}
        <Route
          path="/*"
          element={
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
              <Header
                user={user}
                onLoginClick={() => setShowAuth(true)}
                onLogout={handleLogout}
              />
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route path="/"                  element={<Homepage />} />
                  <Route path="/access-pricing"    element={<AccessPricing />} />
                  <Route path="/roadmap"           element={<Roadmap />} />
                  <Route path="/question-library"  element={<QuestionLibrary />} />
                  <Route path="/resume-tips"       element={<ResumeTips />} />
                  <Route path="/success-stories"   element={<SuccessStories />} />
                  <Route path="/support"           element={<SupportHelp />} />
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}