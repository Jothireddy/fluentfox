import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const rotatingWords = ["confident", "clear", "calm"];
  const [wordIndex, setWordIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [viewMode, setViewMode] = useState("before");
  const navigate = useNavigate();

  const faqItems = [
    {
      q: "How do I get the app and pricing?",
      a: "Right now FluentFox is available by request only. Use the access & pricing page to tell us a bit about your use case, and we’ll email you access details and pricing options for individuals or teams."
    },
    {
      q: "What is FluentFox?",
      a: "FluentFox is an AI-powered tool that helps you practice speaking clear, confident interview answers in real time. It listens to questions and shows you strong, structured responses on your screen."
    },
    {
      q: "How does FluentFox help during interviews?",
      a: "When a question is asked, FluentFox instantly prepares a clear answer tailored to your resume and the job description, so you always know what to say and how to say it."
    },
    {
      q: "Does FluentFox store my voice?",
      a: "No. Your practice audio stays only in your local session and is not stored or used for training."
    },
    {
      q: "Can I customize answers for different roles?",
      a: "Yes. By uploading your resume and the job description, FluentFox adapts responses to match the expectations, skills, and responsibilities of that specific role."
    },
    {
      q: "Will more coaching features be added?",
      a: "Yes. More guidance tools, themes, and smart coaching features are planned, including deeper feedback on tone, pacing, and answer quality."
    }
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2200
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#ff4b00] text-white overflow-x-hidden">
      {/* TEXT + EXTRA ANIMATION STYLES */}
      <style>{`
        @keyframes titleGlow {
          0% {
            opacity: 0;
            transform: translateY(32px) scale(0.96);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(0) scale(1.02);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        .animate-titleGlow {
          animation: titleGlow 1.1s ease-out forwards;
        }

        @keyframes fadeSlideWord {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          15% {
            opacity: 1;
            transform: translateY(0);
          }
          70% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }
        .animate-fadeSlideWord {
          animation: fadeSlideWord 2.2s ease-in-out;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer-text {
          background-image: linear-gradient(
            120deg,
            rgba(255,255,255,0.15),
            rgba(255,255,255,0.8),
            rgba(255,255,255,0.15)
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3s infinite linear;
        }

        @keyframes floatSlow {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-floatSlow {
          animation: floatSlow 7s ease-in-out infinite;
        }

        @keyframes pulseSoft {
          0% {
            box-shadow: 0 0 0 0 rgba(255,255,255,0.45);
          }
          70% {
            box-shadow: 0 0 0 18px rgba(255,255,255,0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255,255,255,0);
          }
        }
        .cta-pulse {
          animation: pulseSoft 2.6s ease-out infinite;
        }

        @keyframes logoMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .logo-marquee {
          animation: logoMarquee 26s linear infinite;
        }

        @keyframes subtleGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(0,0,0,0.4);
          }
          50% {
            box-shadow: 0 18px 40px rgba(0,0,0,0.7);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0,0,0,0.4);
          }
        }
        .card-glow {
          animation: subtleGlow 8s ease-in-out infinite;
        }
      `}</style>

      {/* HERO CONTENT (fills full screen) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-16 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2.8fr)] items-center">
          {/* LEFT: TEXT */}
          <div className="space-y-6 max-w-xl mx-auto lg:mx-0 animate-titleGlow">
            <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold shimmer-text">
              REAL‑TIME AI INTERVIEW PRACTICE
            </p>

            {/* Animated word in heading */}
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-black leading-tight">
              Practice speaking{" "}
              <span className="relative inline-block min-w-[6ch]">
                <span
                  key={rotatingWords[wordIndex]}
                  className="inline-block animate-fadeSlideWord bg-gradient-to-r from-[#fff5e6] via-white to-[#ffd2b3] bg-clip-text text-transparent"
                >
                  {rotatingWords[wordIndex]}
                </span>
              </span>{" "}
              answers for any interview.
            </h2>

            <p className="text-sm md:text-[15px] leading-relaxed text-[#ffe7d8]">
              FluentFox is an AI‑powered real‑time interview practice assistant
              that removes fear, anxiety, and confusion — helping you stay calm
              and speak clearly when it matters most.
            </p>

            <ul className="grid gap-2 text-[13px] md:text-sm">
              <li className="flex gap-2">
                <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-white" />
                <span>
                  Learn exactly what to say in common interview questions.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-white" />
                <span>Practice speaking answers out loud without fear.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-white" />
                <span>Reduce hesitation, anxiety, and last‑minute panic.</span>
              </li>
            </ul>

            {/* SINGLE CTA: CONTACT PAGE ONLY */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/access-pricing")}
                className="w-full xs:w-auto px-6 py-3 bg-white text-black rounded-full text-[12px] sm:text-[13px] font-semibold tracking-[0.12em] uppercase shadow-sm hover:bg-[#ffe9dd] transition text-center relative cta-pulse"
              >
                Contact us to get the app & pricing
              </button>
            </div>
          </div>

          {/* RIGHT: HERO MOCK / IMAGE */}
          <div className="relative max-w-xl mx-auto lg:mx-0 w-full animate-floatSlow">
            <div
              className="rounded-[24px] sm:rounded-[32px] bg-[#111111]/70 backdrop-blur-md border border-white/10 overflow-hidden 
                         shadow-[0_18px_40px_rgba(0,0,0,0.5)]
                         transition-transform duration-500 hover:-translate-y-2 card-glow"
            >
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.14em] uppercase">
                <span className="text-white/70">FluentFox Session</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-[8px] w-[8px] rounded-full bg-[#16ff72] animate-pulse" />
                  Live Practice
                </span>
              </div>

              <div className="p-4 sm:p-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                {/* LIVE QUESTION */}
                <div className="space-y-4">
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/60">
                    Interviewer Question
                  </p>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-[12px] sm:text-[13px] leading-relaxed transition duration-300 hover:bg-white/10">
                    Tell me about yourself and why you’re interested in this
                    role.
                  </div>

                  <p className="mt-4 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-white/60">
                    FluentFox Answer Preview
                  </p>
                  <div className="rounded-2xl bg-white text-black p-3 sm:p-4 text-[11px] sm:text-[12px] leading-relaxed space-y-1 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="font-semibold text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-[#ff4b00]">
                      Clear, structured response
                    </p>
                    <p>
                      I’m a software engineer with 3+ years of experience
                      building reliable web applications. In my current role,
                      I’ve led projects that improved performance and usability,
                      and I’m excited about this position because it lets me
                      work on products that reach millions of users…
                    </p>
                  </div>
                </div>

                {/* SIDE PILLARS / STATS */}
                <div className="space-y-4 text-[11px]">
                  <div className="rounded-2xl bg-[#222222] border border-white/10 p-3 sm:p-4 space-y-3 transition-transform duration-300 hover:-translate-y-1 hover:bg-[#2b2b2b]">
                    <p className="uppercase tracking-[0.16em] text-white/60 text-[10px] sm:text-[11px]">
                      Your Practice Focus
                    </p>
                    <ul className="space-y-2 text-[11px] sm:text-[12px]">
                      <li>• Clear structure (STAR method)</li>
                      <li>• Confident tone & pacing</li>
                      <li>• Role‑aligned examples</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-[#222222] border border-white/10 p-3 sm:p-4 transition-transform duration-300 hover:-translate-y-1 hover:bg-[#2b2b2b]">
                    <p className="uppercase tracking-[0.16em] text-white/60 mb-2 sm:mb-3 text-[10px] sm:text-[11px]">
                      Response Speed
                    </p>
                    <p className="text-xl sm:text-2xl font-black leading-none mb-1">
                      0.2s
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/60">
                      Typical answer generation time in internal evaluations —
                      so you never wait or lose focus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating micro-badges */}
            <div className="pointer-events-none absolute -left-6 top-6 hidden sm:block">
              <div className="rounded-full bg-black/50 border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.16em] flex items-center gap-1 backdrop-blur">
                <span className="h-[6px] w-[6px] rounded-full bg-[#16ff72]" />
                <span>Real-time</span>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-4 bottom-10 hidden sm:block">
              <div className="rounded-2xl bg-white/10 border border-white/30 px-3 py-2 text-[10px] leading-snug backdrop-blur-sm">
                3x more confident after{" "}
                <span className="font-semibold">2–3 sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR / LOGO MARQUEE */}
      <section className="bg-[#1b1b1f] text-white py-5 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-white/50">
            PRACTICE USED BY CANDIDATES PREPARING FOR ROLES AT
          </p>
          <div className="relative overflow-hidden w-full sm:w-auto">
            <div className="flex gap-10 whitespace-nowrap logo-marquee">
              {[
                "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
                "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                "https://upload.wikimedia.org/wikipedia/commons/4/4a/Meta_Platforms_Inc._logo.svg"
              ]
                .concat([
                  "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
                  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                ])
                .map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Company logo"
                    className="h-5 sm:h-6 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#fff5e6] text-black py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid gap-6 md:grid-cols-[2fr_3fr] items-end">
            <div>
              <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
                PRACTICE LIKE A REAL INTERVIEW
              </p>
              <h2 className="text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-tight">
                How FluentFox works
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#3b2b1b] leading-relaxed">
              FluentFox supports you during real or practice interviews by
              listening to questions, understanding your resume and the job
              description, and instantly showing clear, structured answers on
              your screen — so you always know what to say.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-5 text-[13px]">
            {[
              {
                step: "01",
                title: "Upload your resume",
                body: "Helps FluentFox understand your background, skills, and strengths."
              },
              {
                step: "02",
                title: "Add the job description",
                body: "Answers are customized to the specific role you’re preparing for."
              },
              {
                step: "03",
                title: "Start your interview",
                body: "FluentFox listens when a question is asked — just like a real interview."
              },
              {
                step: "04",
                title: "Instant answer appears",
                body: "A clear, structured answer shows up on your screen in real time."
              },
              {
                step: "05",
                title: "You speak with confidence",
                body: "Follow the guidance to deliver your answer calmly and naturally."
              }
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white shadow-sm p-4 flex flex-col gap-2 border border-transparent
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#ff4b00]/40"
              >
                <span className="text-[10px] sm:text-[11px] tracking-[0.16em] font-semibold text-[#ff4b00]">
                  STEP {item.step}
                </span>
                <p className="font-semibold text-[13px] sm:text-[14px] leading-snug">
                  {item.title}
                </p>
                <p className="text-[12px] sm:text-[13px] text-[#4b3520] leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* EXTRA IMAGE STRIP */}
          <div className="mt-8 grid gap-3 sm:gap-4 sm:grid-cols-3 text-[12px] text-[#4b3520]">
            <div className="rounded-2xl overflow-hidden shadow-sm group">
              <img
                src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Interview preparation workspace"
                className="w-full h-32 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm group">
              <img
                src="https://images.pexels.com/photos/1181376/pexels-photo-1181376.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Notes and laptop"
                className="w-full h-32 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm sm:block hidden group">
              <img
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Focused candidate"
                className="w-full h-32 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL MASTER */}
      <section className="bg-[#0077ff] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2.4fr)] items-center">
          <div className="space-y-5">
            <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold">
              WHAT YOU’LL MASTER
            </p>
            <h2 className="text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-tight">
              Speak clearly, stay calm, and answer with confidence.
            </h2>
            <p className="text-sm md:text-[15px] leading-relaxed text-[#e3f0ff]">
              With every session, FluentFox helps you build real interview skills
              — not just memorize scripts. You practice live answers, learn
              natural structures, and train your voice to stay steady even under
              pressure.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-[13px]">
              {[
                {
                  label: "CLARITY",
                  title: "Structured, easy‑to‑follow answers",
                  body: "Learn to organize your thoughts using proven patterns like STAR so your answers feel focused, logical, and confident."
                },
                {
                  label: "CONFIDENCE",
                  title: "Speak without fear or freezing",
                  body: "FluentFox keeps you from blanking out by always giving you a strong answer to follow, so you can focus on delivery."
                },
                {
                  label: "PERSONALIZATION",
                  title: "Answers tailored to you & your role",
                  body: "Resume‑aware and JD‑aware answers mean your responses match your real experience and the role you want."
                },
                {
                  label: "PRACTICE",
                  title: "Repetition that actually builds skill",
                  body: "Run multiple sessions, refine answers, and watch your anxiety drop as your speaking ability increases."
                }
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white text-black rounded-2xl p-4
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#0077ff] font-semibold mb-2">
                    {card.label}
                  </p>
                  <p className="font-semibold mb-1 text-[13px] sm:text-[14px]">
                    {card.title}
                  </p>
                  <p className="text-[12px] sm:text-[13px] text-[#30415d]">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE */}
          <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] mt-4 lg:mt-0">
            <img
              src="https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Person practicing interview answers on a laptop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES & PERFORMANCE */}
      <section className="bg-[#f6f1e8] text-black py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid gap-6 md:grid-cols-[2fr_3fr] items-end">
            <div>
              <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
                BUILT FOR REAL PERFORMANCE
              </p>
              <h2 className="text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-tight">
                Fast, stable, and focused on your growth.
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#3b2b1b] leading-relaxed">
              FluentFox combines strong answer generation, personalized guidance,
              and an ultra‑fast backend to create a practice environment that
              feels smooth and reliable — even in high‑pressure interview
              simulations.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-[13px]">
            {[
              {
                label: "Ultra‑fast backend",
                title: "Answers in as little as 0.2 seconds",
                body: "Our architecture is engineered for speed and consistency, so you never wait 2–3 seconds for a reply or lose focus mid‑flow."
              },
              {
                label: "Stable & distraction‑free",
                title: "A smooth, refined practice experience",
                body: "Sessions run cleanly without interruptions, glitches, or clutter, letting you focus entirely on how you communicate."
              },
              {
                label: "High‑end AI models",
                title: "Polished, role‑aware answers",
                body: "FluentFox uses advanced models to generate accurate, well‑structured answers aligned to your resume and target role."
              }
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-4 shadow-sm border border-transparent
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#ff4b00]/30"
              >
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#ff4b00] mb-2">
                  {card.label}
                </p>
                <p className="font-semibold mb-1 text-[13px] sm:text-[14px]">
                  {card.title}
                </p>
                <p className="text-[12px] sm:text-[13px] text-[#4b3520] leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-[#ffffff] text-black py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
                WHO IT HELPS
              </p>
              <h2 className="text-[clamp(1.9rem,3vw,2.4rem)] font-black leading-tight">
                FluentFox is for anyone who feels nervous in interviews.
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#444] max-w-xl leading-relaxed">
              Whether you’re just starting your career or switching into a new
              role, FluentFox gives you a safe space to practice answering tough
              questions with clarity and confidence.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 text-[13px]">
            {[
              {
                label: "STUDENTS & FRESHERS",
                title: "Your first interviews, minus the panic",
                body: "Practice common questions and learn how to talk about projects and internships with confidence."
              },
              {
                label: "JOB SEEKERS",
                title: "Turn anxiety into preparation",
                body: "Replace guesswork with clear, structured answers that show your value instantly."
              },
              {
                label: "CAREER SWITCHERS",
                title: "Tell your story in a new domain",
                body: "FluentFox helps position your past experience so it makes sense in the new industry or role you’re targeting."
              },
              {
                label: "ANYONE WHO FEELS NERVOUS",
                title: "A calm backup for high‑pressure moments",
                body: "When you’re afraid of freezing, FluentFox gives you a reliable answer on screen so you never feel lost."
              }
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[#eee] p-4
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#ff4b00]/30"
              >
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#777] mb-2">
                  {card.label}
                </p>
                <p className="font-semibold mb-1 text-[13px] sm:text-[14px]">
                  {card.title}
                </p>
                <p className="text-[12px] sm:text-[13px] text-[#555] leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE VS AFTER SECTION */}
      <section className="bg-[#0b1020] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ffb78a]">
                TRANSFORMATION
              </p>
              <h2 className="text-[clamp(1.9rem,3vw,2.5rem)] font-black leading-tight">
                See the shift from nervous to confident.
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#ccd4ff] max-w-xl leading-relaxed">
              Switch between “before” and “after” to see how FluentFox changes
              your interview performance over just a few focused sessions.
            </p>
          </div>

          {/* TOGGLE */}
          <div className="inline-flex rounded-full bg-white/5 border border-white/10 p-1 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("before")}
              className={`px-4 py-1 rounded-full uppercase tracking-[0.16em] transition-all ${
                viewMode === "before"
                  ? "bg-white text-black font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Before FluentFox
            </button>
            <button
              type="button"
              onClick={() => setViewMode("after")}
              className={`px-4 py-1 rounded-full uppercase tracking-[0.16em] transition-all ${
                viewMode === "after"
                  ? "bg-white text-black font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              After FluentFox
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-[13px]">
            {(viewMode === "before"
              ? [
                  {
                    label: "BODY LANGUAGE",
                    title: "Fidgeting & avoiding eye contact",
                    body: "You’re focused on ‘what to say’ instead of how you’re coming across, so your body language feels stiff."
                  },
                  {
                    label: "ANSWERS",
                    title: "Rambling, unstructured responses",
                    body: "Stories start strong but drift off, and you’re never sure when to wrap up or what to highlight."
                  },
                  {
                    label: "MINDSET",
                    title: "Fear of freezing mid‑question",
                    body: "You’re worried about forgetting examples or saying the ‘wrong’ thing, which makes you even more anxious."
                  }
                ]
              : [
                  {
                    label: "BODY LANGUAGE",
                    title: "Steady, open posture",
                    body: "Because you already know the structure, you can relax physically and give the interviewer your full attention."
                  },
                  {
                    label: "ANSWERS",
                    title: "Sharp, concise stories",
                    body: "You follow a natural pattern, hit the right details, and land each answer with a clear outcome or impact."
                  },
                  {
                    label: "MINDSET",
                    title: "Quiet, calm confidence",
                    body: "You’ve practiced realistic questions and know FluentFox has your back, so your brain doesn’t go blank."
                  }
                ]
            ).map((card) => (
              <div
                key={card.label}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#ffb78a] mb-2">
                  {card.label}
                </p>
                <p className="font-semibold mb-1 text-[13px] sm:text-[14px]">
                  {card.title}
                </p>
                <p className="text-[12px] sm:text-[13px] text-[#e8ecff] leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#0b0b10] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-semibold text-[#ffb78a]">
                SOCIAL PROOF
              </p>
              <h2
                className="text-[clamp(2rem,3.2vw,2.8rem)] font-black leading-tight
                           bg-gradient-to-r from-white via-[#ffe0c7] to-[#ffb78a]
                           bg-clip-text text-transparent"
              >
                Loved by job seekers worldwide.
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#d0d0e0] max-w-xl leading-relaxed">
              People use FluentFox to turn shaky, uncertain answers into confident
              stories employers remember.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-[13px]">
            {[
              {
                name: "Ananya, Product Analyst",
                quote:
                  "FluentFox turned my vague stories into sharp, structured answers. I finally stopped rambling in interviews.",
                avatar:
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                name: "James, Software Engineer",
                quote:
                  "Practicing out loud with instant on‑screen guidance made a massive difference. I landed 2 offers in 3 weeks.",
                avatar:
                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
              },
              {
                name: "Sara, Career Switcher",
                quote:
                  "I struggled to explain my transition story. FluentFox helped me frame my past roles so they made sense for tech.",
                avatar:
                  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400"
              }
            ].map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl bg-white/5 border border-white/10 p-5
                           backdrop-blur-md overflow-hidden
                           transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 hover:shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-white/40"
                  />
                  <div>
                    <p className="text-[10px] sm:text-[12px] uppercase tracking-[0.16em] text-white/60">
                      VERIFIED USER
                    </p>
                    <p className="text-[13px] font-semibold">{t.name}</p>
                  </div>
                </div>
                <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#f5f5ff]">
                  “{t.quote}”
                </p>
                <div className="pointer-events-none absolute -right-6 -bottom-10 h-24 w-24 rounded-full bg-gradient-to-tr from-[#ff4b00]/50 to-transparent opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA VISUALS: PRACTICE SNAPSHOTS */}
      <section className="bg-[#ffffff] text-black py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ff4b00]">
                PRACTICE SNAPSHOTS
              </p>
              <h2 className="text-[clamp(1.8rem,3vw,2.4rem)] font-black leading-tight">
                See where FluentFox fits into your routine.
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#444] max-w-xl leading-relaxed">
              Use FluentFox alongside your laptop, notes, and whiteboards to turn
              solo prep time into focused, realistic interview practice sessions.
            </p>
          </div>

          {/* IMAGE GRID 1 */}
          <div className="grid gap-4 sm:grid-cols-3 text-[12px]">
            <div className="rounded-2xl overflow-hidden shadow-md group relative">
              <img
                src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Person practicing answers with a laptop and headphones"
                className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.16em] mb-1">
                  SOLO PRACTICE
                </p>
                <p className="text-[12px] leading-snug">
                  Rehearse key answers in a quiet space with on‑screen support.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md group relative">
              <img
                src="https://images.pexels.com/photos/6177615/pexels-photo-6177615.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Student preparing online interview in a study space"
                className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.16em] mb-1">
                  CAMPUS PREP
                </p>
                <p className="text-[12px] leading-snug">
                  Pair FluentFox with campus placement prep and mock interviews.
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md group relative">
              <img
                src="https://images.pexels.com/photos/5904181/pexels-photo-5904181.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Remote worker preparing with notebook and laptop"
                className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.16em] mb-1">
                  CAREER SWITCH
                </p>
                <p className="text-[12px] leading-snug">
                  Practice telling your transition story before high‑stakes calls.
                </p>
              </div>
            </div>
          </div>

          {/* IMAGE STRIP 2 */}
          <div className="grid gap-4 sm:grid-cols-[1.6fr_1.4fr] mt-4">
            <div className="rounded-2xl overflow-hidden shadow-md group">
              <img
                src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Group of people preparing together"
                className="w-full h-40 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md group">
              <img
                src="https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Desk with laptop and coffee"
                className="w-full h-40 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GALLERY / UI HIGHLIGHTS */}
      <section className="bg-[#f1f6ff] text-black py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#0077ff]">
                LIVE INTERFACE
              </p>
              <h2 className="text-[clamp(1.8rem,3vw,2.4rem)] font-black leading-tight">
                A clean, focused layout made for real‑time speaking.
              </h2>
            </div>
            <p className="text-sm md:text-[15px] text-[#38435f] max-w-xl leading-relaxed">
              FluentFox keeps the screen simple: a live question area, a
              structured answer preview, and focused coaching hints — no clutter,
              pop‑ups, or busy UI.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1.4fr] items-stretch">
            <div className="rounded-3xl bg-white shadow-lg overflow-hidden relative group">
              <img
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Screenshot-like composition of interview practice UI"
                className="w-full h-56 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white text-[11px] px-3 py-2 rounded-full uppercase tracking-[0.16em]">
                Desktop session
              </div>
            </div>

            <div className="grid gap-3 sm:grid-rows-2">
              <div className="rounded-2xl bg-white shadow-md overflow-hidden relative group">
                <img
                  src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Mobile view of practice assistant"
                  className="w-full h-32 sm:h-36 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white text-[12px]">
                  On‑screen prompts that stay readable even on small displays.
                </div>
              </div>
              <div className="rounded-2xl bg-white shadow-md overflow-hidden relative group">
                <img
                  src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Candidate taking notes during practice"
                  className="w-full h-32 sm:h-36 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white text-[12px]">
                  Save your favorite answers and refine them over time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#f6f1e8] text-black py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <h2 className="text-[clamp(1.9rem,3vw,2.6rem)] font-black leading-tight">
            Frequently asked questions
          </h2>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm text-[13px] divide-y divide-[#eee]">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() =>
                    setOpenFaq((prev) => (prev === index ? -1 : index))
                  }
                  className={`w-full text-left grid grid-cols-[50px_minmax(0,1fr)] sm:grid-cols-[60px_minmax(0,1fr)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077ff]/60 ${
                    isOpen ? "bg-[#f8fbff]" : "bg-white"
                  } transition-colors duration-200`}
                >
                  <div className="bg-[#0077ff] text-white flex items-center justify-center text-[11px] sm:text-[12px] font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[13px] sm:text-[14px]">
                        {item.q}
                      </p>
                      <span
                        className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#ddd] text-[11px] text-[#666] transition-transform duration-200 ${
                          isOpen
                            ? "rotate-45 bg-[#0077ff] text-white border-[#0077ff]"
                            : ""
                        }`}
                      >
                        +
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen
                          ? "max-h-[280px] opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-[12px] sm:text-[13px] text-[#555] leading-relaxed pb-1">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* FAQ IMAGE */}
          <div className="rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-md">
            <img
              src="https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="People helping each other prepare for interviews"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-gradient-to-r from-[#ff4b00] via-[#ff7a24] to-[#ff4b00] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-black/20 blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10 grid gap-8 md:grid-cols-[2.1fr_1.4fr] items-center">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.18em] text-[10px] sm:text-[11px] font-semibold text-[#ffe9dd]">
              READY TO PRACTICE DIFFERENTLY?
            </p>
            <h2 className="text-[clamp(2rem,3.2vw,2.7rem)] font-black leading-tight">
              Turn your next interview into a calm, confident conversation.
            </h2>
            <p className="text-sm md:text-[15px] leading-relaxed text-[#fff3ea] max-w-xl">
              Share a bit about your goals and we’ll send access details and
              pricing. Practice live answers, get comfortable speaking, and walk
              into interviews knowing you’re prepared.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/access-pricing")}
                className="px-7 py-3 bg-black text-white rounded-full text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] uppercase shadow-lg hover:bg-[#141414] transition"
              >
                Request access & pricing
              </button>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-6 py-3 border border-white/70 text-white rounded-full text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] uppercase hover:bg-white/10 transition"
              >
                Back to top
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-black/20 border border-white/40 p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#ffe3d0]">
              WHAT YOU GET
            </p>
            <ul className="space-y-2 text-[13px]">
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#16ff72]" />
                <span>Real‑time answer previews tuned to your resume & roles.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#16ff72]" />
                <span>Structured templates for behavioral & technical questions.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#16ff72]" />
                <span>Private practice sessions — audio never stored or reused.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-[#16ff72]" />
                <span>Early access to upcoming coaching & feedback features.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;