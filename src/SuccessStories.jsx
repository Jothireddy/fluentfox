import React from "react";

const SuccessStories = () => {
  return (
    <div className="bg-[#ffffff] text-black min-h-[60vh]">
      <section className="max-w-4xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-6">
        <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
          SUCCESS STORIES
        </p>
        <h1 className="text-[clamp(2rem,3vw,2.6rem)] font-black leading-tight">
          How people are using FluentFox to feel calmer in interviews.
        </h1>
        <p className="text-sm md:text-[15px] text-[#444] leading-relaxed">
          FluentFox doesn’t promise offers. It helps you practice, structure your
          answers, and feel more in control when you speak.
        </p>

        <div className="space-y-4 text-[13px] mt-4">
          <div className="rounded-2xl border border-[#eee] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#777] font-semibold mb-1">
              ANANYA — PRODUCT ANALYST
            </p>
            <p className="text-[12px] text-[#555] leading-relaxed">
              “I used FluentFox to rehearse behavioral questions every evening
              for a week. By the time I had my real interviews, I didn’t feel
              like I was guessing what to say — I had practiced versions of
              almost every question.”
            </p>
          </div>

          <div className="rounded-2xl border border-[#eee] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#777] font-semibold mb-1">
              JAMES — SOFTWARE ENGINEER
            </p>
            <p className="text-[12px] text-[#555] leading-relaxed">
              “Speaking answers out loud with guidance in front of me helped me
              stop freezing when I started. I still had to do the work, but I
              didn’t walk into calls feeling unprepared.”
            </p>
          </div>

          <p className="text-[11px] text-[#777] leading-relaxed">
            These are representative experiences. Results vary and depend on your
            own effort, background, and the opportunities you apply to. FluentFox
            is a practice tool, not a guarantee of job offers.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;