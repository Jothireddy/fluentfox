import React from "react";

const SupportHelp = () => {
  return (
    <div className="bg-[#0b0b10] text-white min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ffb78a]">
          SUPPORT & HELP
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          Need help or have a question?
        </h1>
        <p className="text-sm md:text-[15px] text-[#d0d0e0] leading-relaxed">
          FluentFox is in private beta, and we’re actively collecting feedback.
          If something is confusing or not working for you, we want to know.
        </p>

        <div className="space-y-3 text-[13px]">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold mb-1">
              CONTACT
            </p>
            <p className="text-[12px] text-[#f5f5ff]">
              Email us at{" "}
              <a
                href="mailto:hello@fluentfox.ai"
                className="underline underline-offset-4 decoration-[#ffb78a]/80"
              >
                hello@fluentfox.ai
              </a>{" "}
              for:
            </p>
            <ul className="text-[12px] text-[#f5f5ff] mt-1 space-y-1">
              <li>• Access & pricing questions</li>
              <li>• Bug reports or technical issues</li>
              <li>• Feature requests and ideas</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold mb-1">
              RESPONSE TIMES
            </p>
            <p className="text-[12px] text-[#f5f5ff]">
              We typically reply within 24–48 hours on business days. For now,
              support is handled directly by the small team building FluentFox.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportHelp;