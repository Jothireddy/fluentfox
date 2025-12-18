import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link
} from "react-router-dom";

import Homepage from "./Homepage";
import AccessPricing from "./AccessPricing";
import Roadmap from "./Roadmap";
import QuestionLibrary from "./QuestionLibrary";
import ResumeTips from "./ResumeTips";
import SuccessStories from "./SuccessStories";
import SupportHelp from "./SupportHelp";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsofUse";
import CookieSettings from "./CookieSettings";

import SuperAdmin from "./SuperAdmin";   // ⭐ Added
import Admin from "./Admin";             // ⭐ Added

const Header = () => {
  return (
    <header className="bg-[#ff4b00] text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
          <span className="text-[12px] sm:text-[13px] font-black tracking-[0.18em] uppercase">
            Fluent Fox
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-start md:justify-end gap-4 text-[11px] sm:text-[12px] uppercase tracking-[0.16em]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-1 pb-0.5 border-b-2 ${
                isActive ? "border-white" : "border-transparent hover:border-white/60"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/access-pricing"
            className={({ isActive }) =>
              `px-1 pb-0.5 border-b-2 ${
                isActive ? "border-white" : "border-transparent hover:border-white/60"
              }`
            }
          >
            Access & Pricing
          </NavLink>

          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              `px-1 pb-0.5 border-b-2 ${
                isActive ? "border-white" : "border-transparent hover:border-white/60"
              }`
            }
          >
            Roadmap
          </NavLink>

          <NavLink
            to="/question-library"
            className={({ isActive }) =>
              `px-1 pb-0.5 border-b-2 ${
                isActive ? "border-white" : "border-transparent hover:border-white/60"
              }`
            }
          >
            Questions
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `px-1 pb-0.5 border-b-2 ${
                isActive ? "border-white" : "border-transparent hover:border-white/60"
              }`
            }
          >
            Support
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#050509] text-white border-t border-white/10 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6 sm:pb-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_1.2fr] text-[13px]">
          
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-white/60 mb-3">
              FLUENT FOX
            </p>
            <p className="text-[20px] sm:text-[22px] font-black leading-tight mb-3">
              AI Interview Lab for real-world confidence.
            </p>
            <p className="text-[12px] sm:text-[13px] text-[#d0d0e0] leading-relaxed">
              Practice real interview answers with instant, on-screen guidance so
              you never freeze, ramble, or feel lost when it matters most.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-3">
              PRODUCT
            </p>
            <ul className="space-y-2 text-[12px] sm:text-[13px] text-[#e0e0f0]">
              <li><Link to="/" className="hover:text-white transition">Overview</Link></li>
              <li><Link to="/access-pricing" className="hover:text-white transition">Access & pricing</Link></li>
              <li><Link to="/access-pricing" className="hover:text-white transition">Request a demo</Link></li>
              <li><Link to="/roadmap" className="hover:text-white transition">Feature roadmap</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-3">
              RESOURCES
            </p>
            <ul className="space-y-2 text-[12px] sm:text-[13px] text-[#e0e0f0]">
              <li><Link to="/question-library" className="hover:text-white transition">Interview question library</Link></li>
              <li><Link to="/resume-tips" className="hover:text-white transition">Resume & JD tips</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition">Success stories</Link></li>
              <li><Link to="/support" className="hover:text-white transition">Support & help</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-3">
              CONNECT
            </p>
            <p className="text-[12px] sm:text-[13px] text-[#e0e0f0] mb-3">
              Have ideas, questions, or feedback? We’d love to hear from you.
            </p>
            <a
              href="mailto:hello@fluentfox.ai"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-[11px] sm:text-[12px] font-semibold tracking-[0.14em] uppercase hover:bg-[#ffe9dd] transition"
            >
              Email us →
            </a>
            <div className="mt-4 flex flex-wrap gap-4 text-[11px] sm:text-[12px] text:white/70">
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition">X (Twitter)</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">LinkedIn</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition">YouTube</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[10px] sm:text-[11px] text-white/60">
          <p>© {new Date().getFullYear()} FluentFox. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy policy</Link>
            <Link to="/terms-of-use" className="hover:text-white transition">Terms of use</Link>
            <Link to="/cookie-settings" className="hover:text-white transition">Cookie settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/access-pricing" element={<AccessPricing />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/question-library" element={<QuestionLibrary />} />
            <Route path="/resume-tips" element={<ResumeTips />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/support" element={<SupportHelp />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/cookie-settings" element={<CookieSettings />} />

            {/* ⭐ HIDDEN ROUTES — Accessible only via URL */}
            <Route path="/lunarecho" element={<SuperAdmin />} />
            <Route path="/solardrift" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
