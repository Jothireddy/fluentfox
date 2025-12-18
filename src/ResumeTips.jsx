import React from "react";

const ResumeTips = () => {
  return (
    <div className="bg-[#f6f1e8] text-black min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
          RESUME & JD TIPS
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          Make your resume and the job description work together.
        </h1>
        <p className="text-sm md:text-[15px] text-[#3b2b1b] leading-relaxed">
          FluentFox performs best when your resume and the job description are
          clear and focused. Here are simple ways to clean them up so your
          practice feels closer to the real interview.
        </p>

        <div className="grid gap-4 md:grid-cols-2 text-[13px] mt-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f0e0cf]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              FOR YOUR RESUME
            </p>
            <ul className="text-[12px] text-[#4b3520] space-y-1">
              <li>• Use short, action‑driven bullet points</li>
              <li>• Include measurable impact where possible</li>
              <li>• Highlight skills that match the roles you want</li>
              <li>• Remove outdated or irrelevant experience</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f0e0cf]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              FOR JOB DESCRIPTIONS
            </p>
            <ul className="text-[12px] text-[#4b3520] space-y-1">
              <li>• Paste the full JD, including responsibilities</li>
              <li>• Focus on skills / tools repeatedly mentioned</li>
              <li>• Note the seniority level and core expectations</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#f0e0cf] md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#ff4b00] font-semibold mb-1">
              HOW FLUENTFOX USES THIS
            </p>
            <p className="text-[12px] text-[#4b3520]">
              FluentFox uses your resume and the JD to personalize answers. The
              clearer these documents are, the more accurate and relevant your
              practice responses will feel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeTips;