"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { Candle } from "@/components/objects/Candle";
import { CakeTopper } from "@/components/objects/CakeTopper";
import { FilmStrip } from "@/components/objects/FilmStrip";
import { HandTag } from "@/components/objects/HandTag";
import { Keychain } from "@/components/objects/Keychain";
import { LaserPlaque } from "@/components/objects/LaserPlaque";
import { Polaroid } from "@/components/objects/Polaroid";
import { MagnetWord } from "@/components/ui/MagnetWord";
import { daysUntil, formatDate, useBirthday, useNames, zodiac } from "@/lib/birthday";
import { GIFTS, type GiftId } from "@/lib/gifts";
import { useMounted, useReducedMotionSafe } from "@/lib/hooks";
import { seeded } from "@/lib/cn";
import { useRouter } from "next/navigation";

/** Where the camera ends up (in depth units). Objects sit between 1 and 5. */
const CAMERA_END = 4.1;

interface Floater {
  gift?: GiftId;
  x: number; // vw from centre at scale 1
  y: number; // vh from centre at scale 1
  z: number;
  node: ReactNode;
}

function useFloaters(): Floater[] {
  const { day, month } = useBirthday();
  const n = useNames();
  const date = formatDate(day, month).replace(/ /g, "");
  return [
    { gift: "laser-portrait", x: -40, y: -14, z: 1.5, node: <LaserPlaque src="laugh" name={n.upper} date={date} width={230} /> },
    { x: 40, y: -24, z: 2.0, node: <Polaroid src="friendsBench" caption={`${n.lower} & the crew`} width={210} /> },
    { gift: "photo-keychain", x: -50, y: -38, z: 2.5, node: <Keychain src="curls" letter={n.initial} width={140} tint="acid" /> },
    {
      gift: "magnet-set",
      x: 34,
      y: 32,
      z: 3.0,
      node: (
        <div className="steel rounded-[14px] px-6 py-5 shadow-obj">
          <MagnetWord text={n.hasName ? n.name.slice(0, 8) : "hello"} className="text-[4.2rem]" seed={2} />
        </div>
      ),
    },
    { gift: "cake-topper", x: 10, y: -42, z: 3.4, node: <CakeTopper name={n.lower} width={250} tone="pink" /> },
    { gift: "film-strip", x: 46, y: 6, z: 3.8, node: <FilmStrip photos={["kid", "beach", "confetti"]} frame={110} /> },
    { x: -8, y: 36, z: 4.3, node: <Candle height={190} stripe="var(--blue)" /> },
    {
      gift: "handwriting",
      x: 13,
      y: 4,
      z: 5.0,
      node: <HandTag lines={["love you more", "than cake"]} sign="mum" width={250} />,
    },
    { x: -8, y: -24, z: 5.3, node: <LaserPlaque src="smile" name="DAD" date="SINCE 1971" width={210} dark /> },
  ];
}

function FlyingObject({ camera, f }: { camera: MotionValue<number>; f: Floater }) {
  const router = useRouter();
  const depth = useTransform(camera, (c) => f.z - c);
  const scale = useTransform(depth, (d) => Math.min(4, 1 / Math.max(d, 0.25)));
  const x = useTransform(scale, (s) => `${f.x * s}vw`);
  const y = useTransform(scale, (s) => `${f.y * s}vh`);
  const opacity = useTransform(depth, (d) => {
    if (d < 0.3) return 0;
    if (d < 0.65) return (d - 0.3) / 0.35;
    if (d > 3.8) return Math.max(0.15, 1 - (d - 3.8) / 1.6);
    return 1;
  });
  const pointerEvents = useTransform(depth, (d) => (d < 0.4 ? "none" : "auto"));
  const gift = f.gift ? GIFTS[f.gift] : null;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y, scale, opacity, pointerEvents, zIndex: Math.round(100 - f.z * 10) }}
    >
      <div
        className="relative w-max -translate-x-1/2 -translate-y-1/2 scale-[0.6] md:scale-100"
        data-cursor={gift ? "view" : undefined}
        onClick={gift ? () => router.push(`/gift/${gift.id}`) : undefined}
      >
        {f.node}
        {gift && (
          <span className="label absolute left-[calc(100%+14px)] top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap text-paper/80">
            <span className="h-px w-8 bg-paper/50" />
            {gift.name} · from ${gift.from}
          </span>
        )}
      </div>
    </motion.div>
  );
}

const round = (v: number) => Math.round(v * 100) / 100;
const STARS = Array.from({ length: 90 }, (_, i) => ({
  left: round(seeded(i + 1) * 100),
  top: round(seeded(i + 101) * 100),
  size: 1 + Math.round(seeded(i + 201) * 2.4),
  delay: round(seeded(i + 301) * 4),
}));

function Beat({
  progress,
  input,
  shown,
  title,
  body,
  accent,
}: {
  progress: MotionValue<number>;
  /** Scroll offsets — must stay within 0–1 (Motion runs these on the compositor via WAAPI). */
  input: number[];
  /** Visibility (0/1) at each offset. */
  shown: number[];
  title: ReactNode;
  body: ReactNode;
  accent?: boolean;
}) {
  const opacity = useTransform(progress, input, shown);
  const y = useTransform(progress, input, shown.map((v, i) => (v ? 0 : i === 0 ? 28 : -28)));
  return (
    <motion.div className="absolute bottom-[9vh] left-4 z-[150] max-w-[min(46rem,92vw)] md:left-10" style={{ opacity, y }}>
      <p className={`display text-[clamp(3rem,7.4vw,7.6rem)] ${accent ? "text-bubble" : "text-paper"}`}>{title}</p>
      <p className="mt-4 max-w-[30rem] text-[1.05rem] leading-snug text-paper/70">{body}</p>
    </motion.div>
  );
}

/**
 * The birthday universe: a pinned scene where the visitor's personalised objects
 * float in depth and fly past as you scroll. Pure 2D transforms with perspective
 * maths — no WebGL — so it holds up on phones.
 */
export function GiftUniverse() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { day, month, built } = useBirthday();
  const n = useNames();
  const mounted = useMounted();
  const floaters = useFloaters();
  const z = zodiac(day, month);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: entering } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const background = useTransform(entering, [0.3, 0.95], ["#f1e8da", "#1b1816"]);
  const camera = useTransform(scrollYProgress, [0.04, 1], [0, CAMERA_END]);
  const starScale = useTransform(camera, [0, CAMERA_END], [1, 1.9]);
  const nameScale = useTransform(camera, [0, 0.75], [1, 3.4]);
  const nameOpacity = useTransform(camera, [0, 0.45, 0.72], [1, 0.9, 0]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const who = n.hasName ? n.name : "your person";
  const hud = (
    <>
      <p className="label absolute left-4 top-24 z-[150] text-paper/60 md:left-10">
        Birthday universe — {n.upper} — {formatDate(day, month)}
      </p>
      <p className="label absolute left-4 top-[7.5rem] z-[150] max-w-[16rem] text-paper/60 md:left-auto md:right-10 md:top-24 md:text-right">
        {z.sign} · {z.trait}
        {mounted && (
          <>
            <br />
            {daysUntil(day, month)} days to go
          </>
        )}
      </p>
    </>
  );

  if (reduce) {
    return (
      <section id="universe" ref={ref} data-accent="bubble" className="relative bg-ink px-4 py-32 text-paper md:px-10">
        {hud}
        <p className="display text-center text-[clamp(4rem,20vw,18rem)] text-transparent [-webkit-text-stroke:1.5px_var(--paper)]">
          {n.hasName ? n.name : "Them"}
        </p>
        <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-center gap-12">
          {floaters.map((f, i) => (
            <div key={i}>{f.node}</div>
          ))}
        </div>
        <div className="mx-auto mt-20 max-w-3xl space-y-4 text-center">
          <p className="display text-[clamp(2.6rem,6vw,5rem)]">Some gifts get opened.</p>
          <p className="display text-[clamp(2.6rem,6vw,5rem)] text-bubble">Some gifts get kept.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="universe"
      ref={ref}
      data-accent="bubble"
      aria-label={`${who}’s birthday universe`}
      className="relative h-[420vh] md:h-[480vh]"
    >
      <motion.div className="sticky top-0 h-[100svh] overflow-hidden text-paper" style={{ backgroundColor: background }}>
        <motion.div aria-hidden className="absolute inset-0" style={{ scale: starScale }}>
          {STARS.map((s, i) => (
            <span
              key={i}
              className="star absolute rounded-full bg-paper"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, "--dur": `${3 + (i % 4)}s`, "--delay": `${s.delay}s` } as CSSProperties}
            />
          ))}
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 text-center"
          style={{ scale: nameScale, opacity: nameOpacity, x: "-50%", y: "-50%" }}
        >
          <p className="display whitespace-nowrap text-[clamp(5rem,24vw,24rem)] text-transparent [-webkit-text-stroke:1.5px_rgb(251_247_240/0.9)]">
            {n.hasName ? n.name : "Them"}
          </p>
          <p className="display -mt-[0.2em] text-[clamp(2rem,5vw,5rem)] text-bubble">{formatDate(day, month)}</p>
        </motion.div>

        <div aria-hidden>
          {floaters.map((f, i) => (
            <FlyingObject key={i} camera={camera} f={f} />
          ))}
        </div>

        {hud}

        <Beat
          progress={scrollYProgress}
          input={[0, 0.16, 0.22]}
          shown={[1, 1, 0]}
          title={built && n.hasName ? <>This is {n.name}’s universe.</> : <>Picture {n.possessive} universe.</>}
          body={<>Everything in here is made from {n.hasName ? n.name : "them"}: a name, a date, and a few photos you already have on your phone.</>}
        />
        <Beat
          progress={scrollYProgress}
          input={[0.3, 0.36, 0.54, 0.6]}
          shown={[0, 1, 1, 0]}
          title="Some gifts get opened."
          body="A mug. A candle that smells like “linen”. A gift card, panic-bought at the airport. Lovely. Gone by March."
        />
        <Beat
          progress={scrollYProgress}
          input={[0.66, 0.72, 1]}
          shown={[0, 1, 1]}
          title="Some gifts get kept."
          body="A face on walnut. A name on the fridge. The photo from that night, clipped to their keys. Still there in ten years."
          accent
        />

        <div className="absolute bottom-6 right-4 z-[150] flex items-center gap-3 md:right-10">
          <span className="label text-paper/50">Keep scrolling</span>
          <span className="relative h-px w-24 bg-paper/20">
            <motion.span className="absolute inset-0 origin-left bg-bubble" style={{ scaleX: bar }} />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
