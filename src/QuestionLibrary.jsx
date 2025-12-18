import React from "react";

const QuestionLibrary = () => {
  return (
    <div className="bg-[#ffffff] text-black min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
          INTERVIEW QUESTION LIBRARY
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          Practice the questions you’re most likely to face.
        </h1>
        <p className="text-sm md:text-[15px] text-[#444] leading-relaxed">
          FluentFox focuses on real‑world, high‑signal questions instead of
          endless trivia. You can mix general behaviorals with role‑specific
          prompts to build confidence in the interviews that matter.
        </p>

        <div className="grid gap-4 md:grid-cols-2 text-[13px] mt-4">
          <div className="rounded-2xl border border-[#eee] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#777] font-semibold mb-1">
              CORE BEHAVIORAL
            </p>
            <ul className="text-[12px] text-[#555] space-y-1">
              <li>• Tell me about yourself</li>
              <li>• Why this company / role?</li>
              <li>• A time you handled conflict</li>
              <li>• Biggest challenge / failure</li>
              <li>• Strengths & weaknesses</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#eee] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#777] font-semibold mb-1">
              ROLE‑SPECIFIC
            </p>
            <ul className="text-[12px] text-[#555] space-y-1">
              <li>• Product tradeoff scenarios</li>
              <li>• System design / technical deep dives</li>
              <li>• Project ownership & leadership stories</li>
              <li>• Domain‑specific case questions</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#eee] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#777] font-semibold mb-1">
              LEVELS
            </p>
            <p className="text-[12px] text-[#555]">
              Question sets tuned for interns, entry‑level, mid‑career, and
              senior roles — so you’re not over‑ or under‑preparing.
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#777] font-semibold mb-1">
              CUSTOM PROMPTS
            </p>
            <p className="text-[12px] text-[#555]">
              You can bring your own questions from companies, forums, or friends
              and use FluentFox to practice clear, structured answers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuestionLibrary;