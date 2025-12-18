import React from "react";

const CookieSettings = () => {
  return (
    <div className="bg-[#ffffff] text-black min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
          COOKIE SETTINGS
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          How we think about cookies and tracking.
        </h1>
        <p className="text-sm md:text-[15px] text-[#444] leading-relaxed">
          In this early beta, we aim to keep tracking minimal. Over time, this
          page will include a more detailed breakdown and controls.
        </p>

        <div className="space-y-3 text-[13px] mt-2">
          <div>
            <h2 className="font-semibold mb-1 text-[14px]">
              Essential cookies
            </h2>
            <p className="text-[12px] text-[#555]">
              Some cookies or local storage may be required for basic functionality
              (such as remembering simple settings or keeping a session active).
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-[14px]">
              Analytics & improvements
            </h2>
            <p className="text-[12px] text-[#555]">
              We may use privacy‑respecting analytics tools to understand general
              usage patterns (for example, which pages are most visited) so we
              can improve FluentFox. We aim to avoid invasive, unnecessary
              tracking.
            </p>
          </div>

          <p className="text-[11px] text-[#777]">
            As the product matures, this page will be updated with more detailed
            options and descriptions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CookieSettings;