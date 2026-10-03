import { cn } from "@/lib/cn";

export type TopperTone = "gold" | "silver" | "pink";
export type TopperFont = "rounded" | "chunky";

const MIRROR: Record<TopperTone, { fill: string; edge: string }> = {
  gold: {
    fill: "linear-gradient(100deg, #8a6a1f, #f7e08b 20%, #b8892c 38%, #fff3b8 52%, #a87a22 70%, #f2d47a 86%, #7a5a16)",
    edge: "80 56 10",
  },
  silver: {
    fill: "linear-gradient(100deg, #7d8389, #f4f6f8 20%, #a9aeb4 38%, #ffffff 52%, #9aa0a6 70%, #e8ebee 86%, #6f757b)",
    edge: "60 64 70",
  },
  pink: {
    fill: "linear-gradient(100deg, #b4497c, #ffd0e6 22%, #e2679f 42%, #ffe3f0 55%, #c95389 72%, #ffc2de 88%, #a03c6c)",
    edge: "120 30 70",
  },
};

interface CakeTopperProps {
  name: string;
  line?: string;
  width?: number | string;
  tone?: TopperTone;
  font?: TopperFont;
  className?: string;
}

/** Laser-cut mirror-acrylic cake topper: one connected piece on two sticks. */
export function CakeTopper({ name, line = "happy birthday", width = 230, tone = "gold", font = "rounded", className }: CakeTopperProps) {
  const { fill, edge } = MIRROR[tone];
  const nameSize = Math.min(30, 150 / Math.max(4, name.length));
  const face =
    font === "rounded"
      ? "font-magnet lowercase tracking-[-0.03em]"
      : "font-display lowercase tracking-[-0.02em] [font-variation-settings:'wdth'_90]";
  const clip = { backgroundImage: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

  return (
    <div className={cn("relative flex flex-col items-center [container-type:inline-size]", className)} style={{ width }}>
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          filter: `drop-shadow(0 1px 0 rgb(${edge} / 0.9)) drop-shadow(0 -1px 0 rgb(${edge} / 0.35)) drop-shadow(0 12px 12px rgb(27 24 22 / 0.25))`,
        }}
      >
        <span className={cn(face, "font-semibold leading-none")} style={{ fontSize: "10cqw", ...clip }}>
          {line}
        </span>
        <span className={cn(face, "-mt-[2%] font-bold leading-[0.9]")} style={{ fontSize: `${nameSize}cqw`, ...clip }}>
          {name}
        </span>
        <span aria-hidden className="mt-[1%] h-[1.6cqw] w-[64%] rounded-full" style={{ background: fill }} />
      </div>
      <div aria-hidden className="relative -mt-[1%] flex w-[64%] justify-between px-[8%]">
        <span className="h-[34cqw] w-[2.2cqw] rounded-b-full" style={{ background: fill }} />
        <span className="h-[34cqw] w-[2.2cqw] rounded-b-full" style={{ background: fill }} />
      </div>
    </div>
  );
}
