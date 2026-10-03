"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealLines } from "@/components/ui/RevealLines";
import { SmartLink } from "@/components/ui/SmartLink";
import { MONTHS_LONG, daysUntil, nextBirthday, useBirthday, useNames } from "@/lib/birthday";
import { EASE_OUT } from "@/lib/cn";

const STEPS = [
  { title: "You bring the memory", body: "A photo, a name, a date, a joke only they’ll get." },
  { title: "We make the thing", body: "Traced, engraved, printed, cut, sanded and packed. About four days." },
  { title: "They keep it", body: "On the fridge, on their keys, on the shelf. For years." },
];

function Reminder() {
  const { day, month } = useBirthday();
  const n = useNames();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const [doneLine, setDoneLine] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setState("error");
      return;
    }
    // Prototype: no backend yet. Wire this to the reminders API.
    const days = daysUntil(day, month);
    const remind = nextBirthday(day, month);
    remind.setDate(remind.getDate() - 14);
    setDoneLine(
      days < 14
        ? `Done. ${n.hasName ? `${n.name}’s` : "Their"} birthday is under two weeks away, so we’ll email you tomorrow with the fastest options.`
        : `Done. We’ll email you on ${remind.getDate()} ${MONTHS_LONG[remind.getMonth()]} — two weeks before ${n.possessive} birthday.`,
    );
    setState("done");
  };

  return (
    <div className="grid gap-10 border-t border-paper/15 px-4 py-16 md:px-10 lg:grid-cols-2">
      <div>
        <p className="label text-paper/50">Birthday reminders</p>
        <p className="display mt-4 text-[clamp(2.6rem,5vw,5rem)]">
          Never miss another <span className="text-accent">birthday.</span>
        </p>
      </div>
      <div className="self-end">
        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.p
              key="done"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="hand text-[2.2rem] leading-tight text-accent"
            >
              {doneLine}
            </motion.p>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
              <label htmlFor="reminder-email" className="block text-[1.1rem] leading-relaxed text-paper/75">
                We’ll email you two weeks before {n.possessive} birthday — with time to spare.
              </label>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  id="reminder-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  aria-invalid={state === "error"}
                  aria-describedby="reminder-error"
                  className="min-w-0 flex-1 rounded-full border-2 border-paper/25 bg-transparent px-6 py-4 text-[1.05rem] text-paper placeholder:text-paper/35 focus:border-accent focus:outline-none"
                />
                <Magnetic>
                  <button type="submit" data-cursor="cta" className="display flex w-full items-center justify-center gap-3 rounded-full bg-accent px-7 py-4 text-[1.4rem] text-accent-ink">
                    Remind me <Arrow />
                  </button>
                </Magnetic>
              </div>
              <p id="reminder-error" aria-live="polite" className="mt-3 min-h-[1.5rem] text-[0.95rem] text-[#ff9a9e]">
                {state === "error" && "That email looks incomplete — check for the @ and the dot."}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="site-footer" data-accent="bubble" className="relative overflow-hidden bg-ink text-paper">
      <div className="px-4 pt-[18vh] md:px-10">
        <h2>
          <RevealLines
            className="display block text-[clamp(3.8rem,11vw,12rem)]"
            lines={["Make something", <span key="2" className="text-accent">they’ll keep.</span>]}
          />
        </h2>
      </div>

      <ol className="mt-[12vh] grid gap-10 border-t border-paper/15 px-4 py-12 md:grid-cols-3 md:px-10">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <p className="label text-paper/45">Step {i + 1}</p>
            <p className="display mt-3 text-[clamp(2rem,3vw,2.8rem)]">{s.title}</p>
            <p className="mt-3 max-w-[22rem] text-paper/70">{s.body}</p>
          </li>
        ))}
      </ol>

      <Reminder />

      <div className="label flex flex-wrap items-center justify-between gap-6 border-t border-paper/15 px-4 py-6 text-paper/55 md:px-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {["Instagram", "TikTok", "Pinterest", "Shipping & returns", "FAQ", "Contact"].map((l) => (
            <li key={l}>
              <a href="#top" className="transition-colors hover:text-accent">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <SmartLink href="/#top" className="inline-flex items-center gap-2 transition-colors hover:text-accent">
          Back to the desk <Arrow direction="up-right" />
        </SmartLink>
      </div>

      <div aria-hidden className="relative h-[28vw] select-none overflow-hidden">
        <p className="display absolute inset-x-0 top-0 text-center text-[40vw] leading-[0.74]" style={{ textTransform: "none" }}>
          kept<span className="text-accent">.</span>
        </p>
      </div>
      <p className="label px-4 pb-6 text-paper/40 md:px-10">© 2026 kept. — made by hand, mostly.</p>
    </footer>
  );
}
