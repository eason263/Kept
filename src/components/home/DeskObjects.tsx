"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Candle } from "@/components/objects/Candle";
import { CakeTopper } from "@/components/objects/CakeTopper";
import { FilmStrip } from "@/components/objects/FilmStrip";
import { Keychain } from "@/components/objects/Keychain";
import { LaserPlaque } from "@/components/objects/LaserPlaque";
import { Note } from "@/components/objects/Note";
import { Polaroid } from "@/components/objects/Polaroid";
import { formatDate, useBirthday, useNames } from "@/lib/birthday";
import { useDesktop } from "@/lib/hooks";
import { useIntroDone } from "@/lib/intro";
import { cn } from "@/lib/cn";

interface Placement {
  left?: string;
  right?: string;
  top: string;
  rotate: number;
  /** Parallax depth — bigger moves more. */
  depth: number;
}

const PLACEMENTS: Placement[] = [
  { left: "3.5%", top: "15%", rotate: -9, depth: 0.6 },
  { left: "12.5%", top: "43%", rotate: 5, depth: 1.1 },
  { left: "5.5%", top: "61%", rotate: -7, depth: 0.4 },
  { left: "1.5%", top: "82%", rotate: -4, depth: 0.8 },
  { right: "3.5%", top: "12%", rotate: 6, depth: 0.7 },
  { right: "14%", top: "47%", rotate: -10, depth: 1.2 },
  { right: "2.5%", top: "71%", rotate: 4, depth: 0.5 },
];

let topZ = 30;

function DeskItem({
  place,
  index,
  mx,
  my,
  bounds,
  children,
}: {
  place: Placement;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  bounds: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const introDone = useIntroDone();
  const px = useTransform(mx, (v) => v * place.depth * 28);
  const py = useTransform(my, (v) => v * place.depth * 18);
  const [z, setZ] = useState(10 + index);
  const [lifted, setLifted] = useState(false);

  return (
    <motion.div className="absolute" style={{ left: place.left, right: place.right, top: place.top, x: px, y: py, zIndex: z }}>
      <motion.div
        data-cursor="drag"
        className={cn("origin-center touch-none select-none lg:scale-[0.72] xl:scale-[0.88] 2xl:scale-100", lifted && "is-lifted")}
        initial={{ opacity: 0, y: 140, scale: 0.6, rotate: place.rotate + 24 }}
        animate={introDone ? { opacity: 1, y: 0, scale: 1, rotate: place.rotate } : undefined}
        transition={{ type: "spring", stiffness: 110, damping: 15, delay: 0.35 + index * 0.08 }}
        drag
        dragConstraints={bounds}
        dragElastic={0.12}
        dragTransition={{ power: 0.22, timeConstant: 240 }}
        whileHover={{ scale: 1.03 }}
        whileDrag={{ scale: 1.07, rotate: place.rotate * 0.3 }}
        onDragStart={() => {
          setZ(++topZ);
          setLifted(true);
        }}
        onDragEnd={() => setLifted(false)}
      >
        <div className="float" style={{ "--dur": `${5.2 + (index % 3) * 0.9}s`, "--delay": `${-index * 1.1}s` } as CSSProperties}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The birthday workbench: real-looking objects scattered around the hero that
 * personalise as you type, can be picked up and thrown, and drift with the pointer.
 * Desktop only — phones get the swipeable strip in <Hero>.
 */
export function DeskObjects({ bounds }: { bounds: RefObject<HTMLElement | null> }) {
  const { day, month } = useBirthday();
  const n = useNames();
  const reduce = useReducedMotion();
  // Mounted (not CSS-hidden) only on desktop, so drag constraints are measured on a visible layout.
  const desktop = useDesktop();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce || !desktop) return;
    const move = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, desktop, rawX, rawY]);

  if (!desktop) return null;

  const date = formatDate(day, month).replace(/ /g, "");
  const items: ReactNode[] = [
    <Polaroid key="p" src="beagle" caption={`${n.lower}’s best boy`} width={186} tape eager sizes="200px" />,
    <Note key="n" width={176}>
      shh — don’t tell {n.lower}
    </Note>,
    <Candle key="c" height={168} />,
    <FilmStrip key="f" photos={["cafe", "beach", "balloons"]} frame={86} />,
    <LaserPlaque key="l" src="laugh" name={n.upper} date={date} width={206} />,
    <Keychain key="k" src="friendsHug" letter={n.initial} width={124} />,
    <CakeTopper key="t" name={n.lower} width={230} />,
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 [&>*]:pointer-events-auto">
      {items.map((item, i) => (
        <DeskItem key={i} place={PLACEMENTS[i]} index={i} mx={mx} my={my} bounds={bounds}>
          {item}
        </DeskItem>
      ))}
    </div>
  );
}
