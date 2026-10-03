"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { GiftThumb } from "./GiftScenes";
import { Candle } from "@/components/objects/Candle";
import { Arrow } from "@/components/ui/Arrow";
import { MotionLink } from "@/components/ui/MotionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealLines } from "@/components/ui/RevealLines";
import { ACCENTS } from "@/lib/accents";
import { useNames } from "@/lib/birthday";
import { GIFTS } from "@/lib/gifts";
import { QUESTIONS, scoreProfile } from "@/lib/quiz";
import { EASE_OUT, seeded } from "@/lib/cn";

function Stamp({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 120" className="size-28 animate-[spin_18s_linear_infinite] md:size-36" aria-hidden>
      <defs>
        <path id="stamp-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 4" />
      <text fill={color} className="font-mono" style={{ fontSize: 9.5, letterSpacing: 2.2 }}>
        <textPath href="#stamp-circle">KEPT. CERTIFIED GIFT PROFILE · KEPT. ·</textPath>
      </text>
      <text x="60" y="68" textAnchor="middle" fill={color} className="font-magnet" style={{ fontSize: 26, fontWeight: 700 }}>
        ✓
      </text>
    </svg>
  );
}

function Result({ answers, onReset }: { answers: number[]; onReset: () => void }) {
  const n = useNames();
  const profile = scoreProfile(answers);
  const accent = ACCENTS[profile.accent];
  const code = `0${answers.map((a) => a + 1).join("")}`;
  const first = GIFTS[profile.gifts[0]];
  const [shared, setShared] = useState<"idle" | "copied" | "failed">("idle");

  // The link unfurls into a profile card (see app/share/[profile]/[name]).
  const share = async () => {
    const url = `${window.location.origin}/share/${profile.id}/${encodeURIComponent(n.hasName ? n.name : "them")}`;
    const title = `${n.hasName ? `${n.name} is` : "They’re"} ${profile.name}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: `${title} — find their gift on kept.`, url });
        return;
      } catch (err) {
        // Closing the share sheet is a choice, not an error. Anything else: copy instead.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared("copied");
    } catch {
      setShared("failed");
    }
  };

  return (
    <motion.div
      key="result"
      initial={{ y: 90, opacity: 0, rotate: -6 }}
      animate={{ y: 0, opacity: 1, rotate: -1.2 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="mx-auto max-w-[1040px]"
    >
      <div className="relative overflow-hidden rounded-[34px] bg-ink p-7 text-paper shadow-lift md:p-12">
        <span aria-hidden className="absolute left-1/2 top-5 h-3 w-16 -translate-x-1/2 rounded-full bg-acid" />
        <div className="label flex justify-between gap-4 text-paper/55">
          <span>Gift profile</span>
          <span>
            For {n.hasName ? n.name : "them"} · № {code}
          </span>
        </div>
        <div className="absolute right-6 top-14 md:right-10 md:top-16">
          <Stamp color={accent.color} />
        </div>
        <p className="label mt-12 md:mt-16" style={{ color: accent.color }}>
          {n.hasName ? `${n.name} is` : "They’re"}
        </p>
        <h3 className="display mt-3 max-w-[12ch] text-[clamp(3.2rem,8vw,8.4rem)]" style={{ color: accent.color }}>
          {profile.name}
        </h3>
        <p className="mt-6 max-w-[34rem] text-[1.2rem] leading-relaxed text-paper/80">{profile.line}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {profile.gifts.map((id, i) => (
            <MotionLink
              key={id}
              href={`/gift/${id}`}
              data-cursor="view"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.6, ease: EASE_OUT }}
              className="group flex flex-col items-center rounded-[22px] bg-paper p-5 text-center text-ink transition-transform hover:-translate-y-1"
            >
              <span className="grid h-36 place-items-center">
                <GiftThumb id={id} />
              </span>
              <span className="label mt-3 text-smudge">{i === 0 ? "Best match" : "Also great"}</span>
              <span className="mt-1 text-[1.15rem] font-semibold">{GIFTS[id].name}</span>
              <span className="mt-1 font-mono text-[0.75rem]">from ${GIFTS[id].from}</span>
            </MotionLink>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8">
        <Magnetic>
          <Link href={`/gift/${first.id}`} data-cursor="cta" className="display inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[1.45rem] text-paper">
            See the {first.name.toLowerCase()} <Arrow />
          </Link>
        </Magnetic>
        <button
          type="button"
          onClick={share}
          data-cursor="cta"
          className="display inline-flex items-center gap-3 rounded-full border-2 border-ink px-7 py-[0.9rem] text-[1.45rem] transition-colors hover:bg-ink hover:text-paper"
        >
          {shared === "copied" ? "Link copied" : "Share this profile"}
          <Arrow direction="up-right" />
        </button>
        <button type="button" onClick={onReset} className="underline decoration-ink/30 decoration-2 underline-offset-[6px]">
          Retake the quiz
        </button>
      </div>
      <p className="hand mt-6 text-center text-[1.9rem]" aria-live="polite">
        {shared === "copied"
          ? "paste it in the group chat — it turns into a card."
          : shared === "failed"
            ? "couldn’t copy the link — screenshot it instead."
            : "send it to the group chat. it turns into a card."}
      </p>
    </motion.div>
  );
}

/** Three questions → a shareable gift profile. Candles light up as progress. */
export function GiftQuiz() {
  const [answers, setAnswers] = useState<number[]>([]);
  const done = answers.length === QUESTIONS.length;
  const q = QUESTIONS[answers.length];

  return (
    <section id="quiz" data-accent="acid" className="relative overflow-hidden bg-acid px-4 py-[14vh] text-ink md:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label">Gift quiz — three questions</p>
            <h2 className="mt-5">
              <RevealLines className="display block text-[clamp(3.6rem,9vw,9.5rem)]" lines={["Find", "their gift."]} />
            </h2>
          </div>
          <div className="flex items-end gap-3" role="img" aria-label={`${answers.length} of ${QUESTIONS.length} answered`}>
            {QUESTIONS.map((_, i) => (
              <Candle key={i} lit={answers.length > i} height={92} stripe={i === 1 ? "var(--blue)" : "var(--cherry)"} />
            ))}
          </div>
        </div>

        <div className="mt-14 min-h-[560px]">
          <AnimatePresence mode="wait">
            {done ? (
              <Result key="result" answers={answers} onReset={() => setAnswers([])} />
            ) : (
              <motion.div
                key={q.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -60, transition: { duration: 0.3 } }}
              >
                <p className="label">
                  Question {answers.length + 1} of {QUESTIONS.length}
                </p>
                <h3 className="display mt-3 text-[clamp(2.4rem,5vw,5.2rem)]">{q.prompt}</h3>
                <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  {q.options.map((o, i) => {
                    const tilt = Math.round((seeded(i + answers.length * 10) - 0.5) * 50) / 10;
                    return (
                      <motion.button
                        key={o.title}
                        type="button"
                        onClick={() => setAnswers((a) => [...a, i])}
                        data-cursor="pick"
                        initial={{ y: 70, opacity: 0, rotate: tilt * 3 }}
                        animate={{ y: 0, opacity: 1, rotate: tilt }}
                        whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 240, damping: 20, delay: i * 0.05 }}
                        className="group relative flex min-h-[150px] flex-col rounded-[20px] bg-paper p-4 text-left shadow-obj outline-offset-4 hover:shadow-lift sm:min-h-[170px] sm:rounded-[24px] sm:p-6"
                      >
                        <span className="label text-smudge">{String.fromCharCode(65 + i)}</span>
                        <span className="display mt-auto block pt-4 text-[clamp(1.35rem,2.6vw,2.6rem)] sm:pt-6">{o.title}</span>
                        <span className="hand mt-1 block text-[1.35rem] leading-none text-ink/65 sm:text-[1.75rem]">{o.aside}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {answers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => a.slice(0, -1))}
                    className="mt-8 underline decoration-ink/30 decoration-2 underline-offset-[6px]"
                  >
                    ← Previous question
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
