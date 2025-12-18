import React, { useState } from "react";

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSe-tHL5-tiZ0AGpNdWMwKBOKJQloPfEZZlFcumVgxax6ij3MQ/formResponse";

// Entry IDs (in correct order)
const ENTRY_NAME = "entry.365934067";
const ENTRY_EMAIL = "entry.612559801";
const ENTRY_USECASE = "entry.393581149";
const ENTRY_COUNTRY = "entry.1433497794";
const ENTRY_PREPARING = "entry.593928220";

const AccessPricing = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then(() => {
        setLoading(false);
        setSuccess(true);
        e.target.reset();
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch(() => {
        setLoading(false);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="bg-[#ff4b00] text-white">
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.3fr_1.7fr] items-center">
          <div className="space-y-5">
            <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-white/80">
              GET FLUENTFOX
            </p>
            <h1 className="text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-tight">
              Contact us to get the app and full pricing.
            </h1>
            <p className="text-sm md:text-[15px] leading-relaxed text-[#ffe7d8]">
              FluentFox is in private beta. We’re sharing the app, early
              features, and pricing only with people who contact us directly.
              Share a few details and we’ll send:
            </p>
            <ul className="space-y-2 text-[13px] md:text-[14px] text-[#fff3ea]">
              <li>• A secure download link for Windows or macOS</li>
              <li>• Pricing options for individuals and teams</li>
              <li>• Early access to new coaching features</li>
            </ul>

            <div className="pt-4 space-y-2 text-[12px] sm:text-[13px] text-[#ffe7d8]">
              <p>
                Prefer email? Reach us directly at{" "}
                <a
                  href="mailto:hello@fluentfox.ai"
                  className="font-semibold underline underline-offset-4 decoration-white/70 hover:decoration-white"
                >
                  hello@fluentfox.ai
                </a>
                .
              </p>
              <p className="text-[11px] text-[#ffe7d8]/90">
                FluentFox is intended only as a practice and preparation tool.
                It is not designed or recommended for use during live interviews
                or assessments.
              </p>
            </div>
          </div>

          {/* CONTACT CARD */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-tr from-white/20 via-[#ffd2b3]/40 to-transparent blur-xl opacity-80" />

            <div className="relative bg-white text-black rounded-[24px] sm:rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.45)] p-5 sm:p-6 space-y-4">
              <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold">
                REQUEST ACCESS & PRICING
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 text-[13px] sm:text-[14px]">
                {/* NAME + EMAIL */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.16em] text-[#8b5a3c]">
                      Name
                    </label>
                    <input
                      name={ENTRY_NAME}
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-[#f0d1bc] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#ff4b00]/60 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.16em] text-[#8b5a3c]">
                      Email
                    </label>
                    <input
                      name={ENTRY_EMAIL}
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#f0d1bc] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#ff4b00]/60 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* USE CASE + COUNTRY */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.16em] text-[#8b5a3c]">
                      Use case
                    </label>
                    <select
                      name={ENTRY_USECASE}
                      className="w-full rounded-xl border border-[#f0d1bc] px-3 py-2 text-[13px] outline-none bg-white focus:ring-2 focus:ring-[#ff4b00]/60"
                      defaultValue="Individual"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Students / Freshers">Students / freshers</option>
                      <option value="Team (up to 20 people)">Team (up to 20 people)</option>
                      <option value="Team (20+ people)">Team (20+ people)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.16em] text-[#8b5a3c]">
                      Country
                    </label>
                    <input
                      name={ENTRY_COUNTRY}
                      type="text"
                      placeholder="Your country"
                      className="w-full rounded-xl border border-[#f0d1bc] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#ff4b00]/60"
                    />
                  </div>
                </div>

                {/* PREPARING FOR */}
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-[0.16em] text-[#8b5a3c]">
                    What are you preparing for?
                  </label>
                  <textarea
                    name={ENTRY_PREPARING}
                    rows={3}
                    placeholder="e.g., product manager interviews, campus placements, big tech software roles…"
                    className="w-full rounded-xl border border-[#f0d1bc] px-3 py-2 text-[13px] outline-none resize-none focus:ring-2 focus:ring-[#ff4b00]/60"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4b00] text-white text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] uppercase px-5 py-2.5 shadow-md hover:bg-[#e84300] transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : success ? "Request Sent ✓" : "Submit request"}
                  <span>→</span>
                </button>

                <p className="text-[11px] text-[#8b5a3c] leading-relaxed pt-1">
                  We typically reply within 24 hours with access instructions and
                  pricing tailored to your use case.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccessPricing;
