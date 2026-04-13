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

// Legal pages — new
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

// ─── HEADER ───────────────────────────────────────────────────────────────────
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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        .ffnav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          padding: 2px 0;
          border-bottom: 1.5px solid transparent;
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .ffnav-link:hover { color: #fff; border-bottom-color: rgba(255,255,255,0.5); }
        .ffnav-link.active { color: #fff; border-bottom-color: #fff; }

        .ff-header-badge {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.18);
          color: #fff;
          border-radius: 999px;
          padding: 2px 7px;
          margin-left: 5px;
          vertical-align: middle;
          border: 0.5px solid rgba(255,255,255,0.3);
        }

        .ff-header-signin {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: #fff;
          color: #ff4b00;
          border: none;
          border-radius: 999px;
          padding: 8px 20px;
          cursor: pointer;
          transition: background 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .ff-header-signin:hover { background: #ffe9dd; transform: scale(1.03); }

        .ff-header-logout {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(0,0,0,0.2);
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ff-header-logout:hover { background: rgba(0,0,0,0.35); }

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
        }
        .ff-header-chip:hover { background: rgba(0,0,0,0.32); }

        .ff-credits-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0,0,0,0.2);
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 11px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          border: 0.5px solid rgba(255,255,255,0.12);
        }

        @media (max-width: 768px) {
          .ff-header-nav { display: none !important; }
        }
      `}</style>

      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 clamp(16px,3vw,40px)",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
      }}>

        {/* LOGO */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}>
          <img
            src="/company-logo.webp"
            alt="FluentFox"
            style={{ height: 28, objectFit: "contain" }}
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "inline";
            }}
          />
          <span style={{
            display: "none",
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.01em",
          }}>
            FluentFox
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="ff-header-nav" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {[
            { to: "/",               label: "Home",           end: true },
            { to: "/access-pricing", label: "Access & Pricing"          },
            { to: "/roadmap",        label: "Roadmap"                   },
            { to: "/question-library",label: "Questions"               },
            { to: "/support",        label: "Support"                   },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end || undefined}
              className={({ isActive }) => `ffnav-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}

          <a href="/#pricing-sec" className="ffnav-link">
            Pricing
            <span className="ff-header-badge">Early access</span>
          </a>
        </nav>

        {/* RIGHT: user state */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {user ? (
            <>
              <div className="ff-credits-pill">
                <span style={{ fontSize: 13 }}>🎯</span>
                <span style={{ fontWeight: 800 }}>{user.credits ?? 0}</span>
                <span style={{ opacity: 0.65, fontSize: 10 }}>credits</span>
              </div>

              <div className="ff-header-chip" onClick={() => navigate("/dashboard")}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 900, color: "#fff",
                  flexShrink: 0,
                }}>
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, color: "#fff", fontWeight: 600,
                  maxWidth: 110, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user.name || "Account"}
                </span>
              </div>

              <button className="ff-header-logout" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="ff-header-signin" onClick={onLoginClick}>
              Sign In →
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const product = [
    { label: "How it works",   path: "/#how"         },
    { label: "Who it's for",   path: "/#who"          },
    { label: "Pricing",        path: "/#pricing-sec"  },
    { label: "FAQ",            path: "/#faq"          },
    { label: "Access & Pricing", path: "/access-pricing" },
    { label: "Roadmap",        path: "/roadmap"       },
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
      // If already on home, scroll; otherwise navigate then scroll
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
    <footer style={{ background: "#0d0d0d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .ff-footer-link {
          font-size: 14px;
          color: rgba(255,255,255,0.52);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
          display: block;
          margin-bottom: 11px;
        }
        .ff-footer-link:hover { color: #fff; }
        .ff-footer-col-title {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.26);
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
          color: rgba(255,255,255,0.62);
          text-decoration: none;
          transition: background 0.18s, color 0.18s, border-color 0.18s;
          width: fit-content;
          margin-top: 16px;
        }
        .ff-footer-ig:hover {
          background: rgba(255,75,0,0.12);
          border-color: rgba(255,75,0,0.3);
          color: #fff;
        }
        .ff-footer-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(34,197,94,0.1);
          border: 0.5px solid rgba(34,197,94,0.22);
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.52);
          margin-top: 14px;
        }
        .ff-footer-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          animation: ffpulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes ffpulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        .ff-footer-bottom-link {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .ff-footer-bottom-link:hover { color: rgba(255,255,255,0.7); }
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
          <img
            src="/company-logo.webp"
            alt="FluentFox"
            style={{ height: 32, objectFit: "contain", display: "block", marginBottom: 16 }}
            onError={e => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span style={{
            display: "none",
            fontFamily: "'Syne',sans-serif",
            fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 16,
          }}>FluentFox</span>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.72, maxWidth: 280 }}>
            AI-powered real-time interview assistant. Speak confidently. Land the job.
          </p>

          <div className="ff-footer-status">
            <span className="ff-footer-pulse" />
            All systems operational
          </div>

          <a
            href="https://instagram.com/fluentfox"
            target="_blank"
            rel="noopener noreferrer"
            className="ff-footer-ig"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            @fluentfox
          </a>
        </div>

        {/* Product */}
        <div>
          <p className="ff-footer-col-title">Product</p>
          {product.map((l) => (
            <button key={l.label} className="ff-footer-link" onClick={() => handleNav(l.path)}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Legal */}
        <div>
          <p className="ff-footer-col-title">Legal</p>
          {legal.map((l) => (
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
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.26)", margin: 0 }}>
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
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── REDIRECT + PROMPT LOGIN ──────────────────────────────────────────────────
function RedirectToHome({ onLoginNeeded }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
    const t = setTimeout(onLoginNeeded, 150);
    return () => clearTimeout(t);
  }, []);
  return null;
}

// ─── INNER APP (needs Router context) ────────────────────────────────────────
function AppInner() {
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
        {/* ── Secret admin panels — standalone, no header/footer ── */}
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

        {/* ── Legal pages — standalone (own orange hero layout) ── */}
        <Route path="/terms"    element={<TermsAndConditions />} />
        <Route path="/privacy"  element={<PrivacyPolicy />} />
        <Route path="/refund"   element={<RefundPolicy />} />
        <Route path="/delivery" element={<DeliveryPolicy />} />
        <Route path="/contact"  element={<ContactPage />} />

        {/* ── Public site — header + footer wrapper ── */}
        <Route
          path="/*"
          element={
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000", color: "#fff" }}>
              <Header
                user={user}
                onLoginClick={() => setShowAuth(true)}
                onLogout={handleLogout}
              />
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route path="/"                 element={<Homepage />} />
                  <Route path="/access-pricing"   element={<AccessPricing />} />
                  <Route path="/roadmap"          element={<Roadmap />} />
                  <Route path="/question-library" element={<QuestionLibrary />} />
                  <Route path="/resume-tips"      element={<ResumeTips />} />
                  <Route path="/success-stories"  element={<SuccessStories />} />
                  <Route path="/support"          element={<SupportHelp />} />
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

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}