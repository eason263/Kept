"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { DeskObjects } from "./DeskObjects";
import { CakeTopper } from "@/components/objects/CakeTopper";
import { Keychain } from "@/components/objects/Keychain";
import { LaserPlaque } from "@/components/objects/LaserPlaque";
import { PhotoMagnet } from "@/components/objects/PhotoMagnet";
import { Polaroid } from "@/components/objects/Polaroid";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { MagnetLetter, MagnetWord, magnetAccent, magnetTilt } from "@/components/ui/MagnetWord";
import { RevealLines } from "@/components/ui/RevealLines";
import {
  MONTHS_LONG,
  RELATIONSHIPS,
  countdownLine,
  daysInMonth,
  daysUntil,
  formatDate,
  useBirthday,
  useNames,
  type Relationship,
} from "@/lib/birthday";
import { GIFTS } from "@/lib/gifts";
import { useMounted } from "@/lib/hooks";
import { useIntroDone } from "@/lib/intro";
import { EASE_OUT } from "@/lib/cn";

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: Array<[string | number, string]>;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-none border-b-2 border-ink bg-transparent py-0.5 pl-1 pr-7 font-bold text-ink outline-offset-4 transition-colors hover:border-accent"
      >
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 12 8" className="pointer-events-none absolute right-1 w-3" aria-hidden>
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </label>
  );
}

/** The magnet row *is* the name input: a real <input> sits invisibly on top. */
function MagnetInput({ invalid, onInput }: { invalid: boolean; onInput: () => void }) {
  const { name, set } = useBirthday();
  const [focused, setFocused] = useState(false);
  const letters = Array.from(name.toUpperCase());
  const len = Math.max(4, letters.length);
  const size = `min(clamp(3.4rem, 8.2vw, 7.6rem), ${(88 / (len * 0.78)).toFixed(2)}vw)`;

  return (
    <label className="relative block w-full cursor-text" data-cursor="type">
      <span className="sr-only">Their name</span>
      <input
        type="text"
        value={name}
        maxLength={14}
        onChange={(e) => {
          set({ name: e.target.value });
          onInput();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        enterKeyHint="go"
        aria-invalid={invalid}
        aria-describedby="name-hint"
        className="peer absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        style={{ fontSize: 16 }}
      />
      <div
        aria-hidden
        className="flex min-h-[1.25em] flex-wrap items-end justify-center gap-x-[0.03em] rounded-2xl py-2 outline-2 outline-offset-8 outline-ink/0 peer-focus-visible:outline-ink/40"
        style={{ fontSize: size }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {letters.length === 0 &&
            ["N", "A", "M", "E"].map((ch, i) => (
              <motion.span
                key={`ghost-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: focused ? 0.45 : 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
              >
                <MagnetLetter char={ch} ghost rotate={magnetTilt(i, ch)} />
              </motion.span>
            ))}
          {letters.map((ch, i) =>
            ch === " " ? (
              <motion.span key={`${i}-space`} layout className="w-[0.3em]" />
            ) : (
              <motion.span
                key={`${i}-${ch}`}
                layout
                initial={{ y: "-0.9em", opacity: 0, rotate: magnetTilt(i, ch) - 28, scale: 1.3 }}
                animate={{ y: 0, opacity: 1, rotate: magnetTilt(i, ch), scale: 1 }}
                exit={{ y: "0.35em", opacity: 0, scale: 0.5, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 520, damping: 22, mass: 0.7 }}
              >
                <MagnetLetter char={ch} accent={magnetAccent(i)} />
              </motion.span>
            ),
          )}
        </AnimatePresence>
        <span
          className="mb-[0.16em] ml-[0.06em] h-[0.78em] w-[0.06em] min-w-[3px] rounded-full bg-ink"
          style={{ opacity: focused ? 1 : 0, animation: focused ? "caret 1.05s steps(1) infinite" : "none" }}
        />
      </div>
    </label>
  );
}

const STRIP_ITEMS = ["laser-portrait", "photo-keychain", "cake-topper", "magnet-set"] as const;

export function Hero() {
  const b = useBirthday();
  const n = useNames();
  const introDone = useIntroDone();
  const mounted = useMounted();
  const sectionRef = useRef<HTMLElement>(null);
  const [invalid, setInvalid] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!n.hasName) {
      setInvalid(true);
      animate(scope.current, { x: [0, -14, 12, -8, 5, 0] }, { duration: 0.5 });
      scope.current?.querySelector("input")?.focus();
      return;
    }
    b.set({ built: true });
    b.openLoader();
  };

  const setMonth = (v: string) => {
    const month = Number(v);
    b.set({ month, day: Math.min(b.day, daysInMonth(month)) });
  };

  const days = mounted ? daysUntil(b.day, b.month) : null;
  const date = formatDate(b.day, b.month).replace(/ /g, "");

  return (
    <section
      id="top"
      ref={sectionRef}
      data-accent="tangerine"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <DeskObjects bounds={sectionRef} />

      <form
        onSubmit={submit}
        noValidate
        className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-1 flex-col items-center justify-center px-4 pb-10 pt-28 text-center lg:pb-24"
      >
        <motion.p
          className="label mb-5 text-smudge"
          initial={{ opacity: 0 }}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Birthday gift universe — est. on somebody’s birthday
        </motion.p>

        <h1 className="relative">
          <RevealLines
            show={introDone}
            className="display block text-[clamp(3.6rem,9vw,9.4rem)]"
            lines={["Whose birthday"]}
          />
          <motion.span
            className="hand absolute -bottom-[1.05em] right-[4%] block -rotate-[5deg] whitespace-nowrap text-[clamp(1.9rem,3.4vw,3.4rem)] text-ink md:right-[-2%]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={introDone ? { opacity: 1, scale: 1 } : undefined}
            transition={{ delay: 0.55, type: "spring", stiffness: 200, damping: 14 }}
          >
            are we celebrating?
            <svg viewBox="0 0 220 14" className="absolute -bottom-1 left-0 w-full text-accent" aria-hidden preserveAspectRatio="none">
              <path d="M2 9c40-6 90-8 140-4 26 2 50 4 76 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.span>
        </h1>

        <motion.div
          ref={scope}
          className="mt-[clamp(3.6rem,8vh,5.5rem)] w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.45, duration: 0.8, ease: EASE_OUT }}
        >
          <MagnetInput invalid={invalid} onInput={() => setInvalid(false)} />
          <p id="name-hint" aria-live="polite" className="hand mt-1 min-h-[1.8rem] text-[1.6rem] text-ink/70">
            {invalid ? (
              <span className="text-cherry">add a name first — it goes on everything</span>
            ) : n.hasName ? (
              <>look around — it’s already on everything</>
            ) : (
              <>tap and type their name</>
            )}
          </p>
        </motion.div>

        <motion.div
          className="mt-5 flex max-w-[44rem] flex-wrap items-baseline justify-center gap-x-2.5 gap-y-3 text-[clamp(1.15rem,1.7vw,1.5rem)]"
          initial={{ opacity: 0, y: 18 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT }}
        >
          <span>Born on</span>
          <Select
            label="Birthday — day"
            value={b.day}
            onChange={(v) => b.set({ day: Number(v) })}
            options={Array.from({ length: daysInMonth(b.month) }, (_, i) => [i + 1, String(i + 1)])}
          />
          <Select label="Birthday — month" value={b.month} onChange={setMonth} options={MONTHS_LONG.map((m, i) => [i + 1, m])} />
          <span>and they’re my</span>
          <Select
            label="Who they are to you"
            value={b.relationship}
            onChange={(v) => b.set({ relationship: v as Relationship })}
            options={RELATIONSHIPS.map((r) => [r.id, r.phrase])}
          />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10"
          initial={{ opacity: 0, y: 18 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.75, duration: 0.8, ease: EASE_OUT }}
        >
          <Magnetic>
            <button
              type="submit"
              data-cursor="cta"
              className="display group flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[clamp(1.35rem,2vw,1.75rem)] text-paper transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
            >
              Build {n.possessive} universe
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Magnetic>
          <a
            href="#explore"
            className="group inline-flex items-center gap-2 text-[1.05rem] underline decoration-ink/30 decoration-2 underline-offset-[6px] transition-colors hover:decoration-accent"
          >
            I just want to find a really cool gift
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </form>

      {/* Phones & tablets: the desk becomes a swipeable strip. */}
      <div className="relative z-10 pb-10 lg:hidden">
        <p className="label px-4 text-smudge">Things we could make for {n.hasName ? n.name : "them"} — swipe</p>
        <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none]">
          {STRIP_ITEMS.map((id) => (
            <li key={id} className="w-[68vw] max-w-[300px] shrink-0 snap-center">
              <Link href={`/gift/${id}`} className="block">
              <div className="flex h-[300px] items-center justify-center rounded-[28px] bg-paper/60 ring-1 ring-ink/5">
                {id === "laser-portrait" && <LaserPlaque src="laugh" name={n.upper} date={date} width={170} />}
                {id === "photo-keychain" && <Keychain src="friendsHug" letter={n.initial} width={130} className="-rotate-6" />}
                {id === "cake-topper" && <CakeTopper name={n.lower} width={210} />}
                {id === "magnet-set" && (
                  <div className="steel flex h-[86%] w-[86%] flex-col items-center justify-center gap-4 rounded-[18px] shadow-obj">
                    <MagnetWord text={n.hasName ? n.name.slice(0, 7) : "hey"} className="text-[2.8rem]" />
                    <div className="flex items-center gap-3">
                      <PhotoMagnet src="lick" size={84} className="-rotate-6" />
                      <Polaroid src="beagle" width={92} className="rotate-6" />
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 flex justify-between px-1 text-[0.95rem]">
                <span className="font-semibold">{GIFTS[id].name}</span>
                <span className="font-mono text-[0.8rem] text-smudge">from ${GIFTS[id].from}</span>
              </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="label pointer-events-none relative z-10 hidden items-end justify-between px-6 pb-5 text-smudge lg:flex">
        <span>↖ Everything on this desk is draggable</span>
        <span className="text-center">Scroll</span>
        <span className="min-w-[18rem] text-right">{days !== null ? countdownLine(days, n.possessive) : " "}</span>
      </div>
    </section>
  );
}
