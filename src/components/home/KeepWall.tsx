"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { RevealLines } from "@/components/ui/RevealLines";
import { useDesktop } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type Material = "maple" | "walnut" | "brass" | "paper" | "pink" | "blue" | "acid";

const MESSAGES: Array<{ text: string; material: Material; rotate: number; left: string; top: string }> = [
  { text: "To the one who still owes me $20. Happy 30th.", material: "maple", rotate: -6, left: "2%", top: "4%" },
  { text: "Mum — you were right. About everything. Don’t let it go to your head.", material: "paper", rotate: 4, left: "34%", top: "0%" },
  { text: "Same table. Same jokes. Same time next year.", material: "brass", rotate: -3, left: "68%", top: "6%" },
  { text: "Happy birthday to my favourite notification.", material: "pink", rotate: 7, left: "8%", top: "40%" },
  { text: "For Biscuit, the goodest boy. 12 today.", material: "walnut", rotate: -8, left: "40%", top: "36%" },
  { text: "You’re officially old. We’re officially proud.", material: "blue", rotate: 3, left: "70%", top: "42%" },
  { text: "Thanks for raising me. Sorry about the car.", material: "paper", rotate: -4, left: "4%", top: "72%" },
  { text: "Day one. Still here. Still annoying.", material: "acid", rotate: 5, left: "37%", top: "70%" },
  { text: "Happy birthday from the person who knows all your passwords.", material: "brass", rotate: 2, left: "67%", top: "74%" },
];

const BRASS = "linear-gradient(125deg, #a87632 0%, #f3d58a 24%, #c99a48 44%, #f8e6ad 60%, #b5843a 80%, #e9c97a 100%)";

const MATERIAL: Record<Material, { className: string; style?: CSSProperties }> = {
  maple: { className: "wood engraved rounded-[10px] font-semibold uppercase tracking-wide" },
  walnut: { className: "wood-dark rounded-[10px] font-semibold uppercase tracking-wide text-[#f3dcb9] [text-shadow:0_1px_0_rgb(0_0_0/0.4)]" },
  brass: { className: "hand rounded-[14px] text-[1.9rem] leading-[0.95] text-[#5a3d12]", style: { background: BRASS } },
  paper: { className: "hand bg-paper text-[1.9rem] leading-[0.95] text-[#1f2a8a]" },
  pink: { className: "rounded-[22px] font-magnet font-semibold text-ink", style: { background: "color-mix(in srgb, var(--bubble) 80%, white)" } },
  blue: { className: "rounded-[22px] bg-blue font-magnet font-semibold text-paper" },
  acid: { className: "rounded-[6px] bg-acid font-mono text-[0.85rem] uppercase text-ink" },
};

function Tile({ text, material, className, style }: { text: string; material: Material; className?: string; style?: CSSProperties }) {
  const m = MATERIAL[material];
  return (
    <div className={cn("w-[260px] p-6 shadow-obj", m.className, className)} style={{ ...m.style, ...style }}>
      <p>{text}</p>
    </div>
  );
}

/** Gift-message ideas as real materials. Desktop: drag them around, click to copy. Mobile: marquee. */
export function KeepWall() {
  const desktop = useDesktop();
  const boardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [z, setZ] = useState<number[]>(MESSAGES.map((_, i) => i));

  const copy = (text: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(text);
        window.setTimeout(() => setCopied((c) => (c === text ? null : c)), 2200);
      })
      .catch(() => {});
  };

  return (
    <section data-accent="blue" className="relative overflow-hidden bg-frosting py-[16vh]">
      <div className="flex flex-wrap items-end justify-between gap-6 px-4 md:px-10">
        <div>
          <p className="label text-smudge">Gift message ideas</p>
          <h2 className="mt-5">
            <RevealLines
              className="display block text-[clamp(3.4rem,7.6vw,8rem)]"
              lines={["Stuck on what", <span key="2" className="text-accent">to write?</span>]}
            />
          </h2>
        </div>
        <p className="max-w-[22rem] text-[1.05rem] leading-relaxed text-ink/75">
          Steal one of these. {desktop ? "Drag them around, click one to copy it." : "Tap one to copy it."}
        </p>
      </div>

      {desktop ? (
        <div ref={boardRef} className="relative mx-4 mt-14 h-[78vh] min-h-[620px] md:mx-10">
          {MESSAGES.map((m, i) => (
            <motion.div
              key={m.text}
              drag
              dragConstraints={boardRef}
              dragElastic={0.1}
              dragTransition={{ power: 0.2, timeConstant: 220 }}
              initial={false}
              animate={{ rotate: m.rotate }}
              whileHover={{ scale: 1.03 }}
              whileDrag={{ scale: 1.07, rotate: 0 }}
              onDragStart={() => setZ((prev) => prev.map((v, j) => (j === i ? Math.max(...prev) + 1 : v)))}
              onTap={() => copy(m.text)}
              data-cursor="copy"
              className="absolute touch-none select-none"
              style={{ left: m.left, top: m.top, zIndex: z[i] }}
            >
              <Tile text={m.text} material={m.material} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-12 space-y-6">
          {[MESSAGES.slice(0, 5), MESSAGES.slice(5)].map((row, r) => (
            <div key={r} className="overflow-hidden py-4">
              <div className="marquee flex w-max gap-5 px-4" style={{ "--dur": `${r ? 46 : 38}s`, animationDirection: r ? "reverse" : "normal" } as CSSProperties}>
                {[...row, ...row].map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => copy(m.text)}
                    aria-hidden={i >= row.length}
                    tabIndex={i >= row.length ? -1 : 0}
                    className="text-left"
                    style={{ rotate: `${m.rotate * 0.6}deg` }}
                  >
                    <Tile text={m.text} material={m.material} className="w-[220px]" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {copied && (
          <motion.p
            role="status"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="label fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-paper shadow-lift"
          >
            Copied — paste it in when you personalise
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
