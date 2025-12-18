import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#ffffff] text-black min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
          PRIVACY POLICY
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          How we think about your data.
        </h1>
        <p className="text-sm md:text-[15px] text-[#444] leading-relaxed">
          This is a simple, early‑stage privacy explanation. As FluentFox grows,
          this page will be updated with a more formal policy.
        </p>

        <div className="space-y-3 text-[13px] mt-2">
          <div>
            <h2 className="font-semibold mb-1 text-[14px]">
              Practice sessions
            </h2>
            <p className="text-[12px] text-[#555]">
              Practice audio is processed to generate on‑screen answers. In the
              current beta, we do not store your audio recordings for training or
              reuse. We may keep minimal technical logs (like timestamps and
              error messages) to keep the system reliable.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-[14px]">Contact data</h2>
            <p className="text-[12px] text-[#555]">
              If you contact us or request access, we store the information you
              provide (like your name, email, and use case) so we can reply,
              share access, and understand how people use FluentFox.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-[14px]">Third‑party tools</h2>
            <p className="text-[12px] text-[#555]">
              We may use third‑party infrastructure (for example, hosting or
              analytics) to run FluentFox. Where we do, we aim to keep data
              collection to the minimum needed to provide a fast, stable
              practice experience.
            </p>
          </div>

          <p className="text-[11px] text-[#777]">
            This page is not legal advice. As the product matures, a more formal
            and detailed privacy policy will replace this text.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;