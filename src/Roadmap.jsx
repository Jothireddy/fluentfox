import React from "react";

const Roadmap = () => {
  return (
    <div className="bg-[#fff5e6] text-black min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
          PRODUCT ROADMAP
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          Where FluentFox is going next.
        </h1>
        <p className="text-sm md:text-[15px] text-[#3b2b1b] leading-relaxed">
          FluentFox is in active development. We’re focused on features that make
          real interview practice feel natural, fast, and helpful — without
          overwhelming you.
        </p>

        <div className="grid gap-4 md:grid-cols-2 text-[13px] mt-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f3d6c2]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              NOW
            </p>
            <p className="font-semibold mb-1">Private beta & core practice</p>
            <ul className="text-[12px] text-[#4b3520] space-y-1">
              <li>• Real‑time answer suggestions for common questions</li>
              <li>• Resume & JD‑aware responses</li>
              <li>• Smooth, low‑latency practice sessions</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f3d6c2]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              NEXT
            </p>
            <p className="font-semibold mb-1">Deeper coaching & insights</p>
            <ul className="text-[12px] text-[#4b3520] space-y-1">
              <li>• Feedback on tone, pacing, and clarity</li>
              <li>• Structured practice plans for different roles</li>
              <li>• More question sets by industry and level</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f3d6c2]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              LATER
            </p>
            <p className="font-semibold mb-1">Team & cohort features</p>
            <ul className="text-[12px] text-[#4b3520] space-y-1">
              <li>• Admin controls for bootcamps and universities</li>
              <li>• Shared templates and best‑practice libraries</li>
              <li>• Aggregated, anonymized practice insights</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f3d6c2]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              FEEDBACK
            </p>
            <p className="font-semibold mb-1">Help shape FluentFox</p>
            <p className="text-[12px] text-[#4b3520]">
              We make roadmap decisions based on real user feedback. If you have
              a feature idea or a problem you want solved, email us at{" "}
              <a
                href="mailto:hello@fluentfox.ai"
                className="underline underline-offset-4 decoration-[#ff4b00]/70"
              >
                hello@fluentfox.ai
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;