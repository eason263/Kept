import type { CSSProperties } from "react";
import { ACCENTS, MAGNET_ORDER, type Accent } from "@/lib/accents";
import { cn, seeded } from "@/lib/cn";

interface MagnetLetterProps {
  char: string;
  accent?: Accent;
  rotate?: number;
  ghost?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** One glossy alphabet magnet. Size comes from the parent's font-size. */
export function MagnetLetter({ char, accent = "cherry", rotate = 0, ghost, className, style }: MagnetLetterProps) {
  const a = ACCENTS[accent];
  return (
    <span
      className={cn("magnet", ghost && "magnet--ghost", className)}
      style={{ "--face": a.color, "--shade": a.shade, rotate: rotate ? `${rotate}deg` : undefined, ...style } as CSSProperties}
    >
      <span className="magnet__shade" aria-hidden>
        {char}
      </span>
      <span className="magnet__face">{char}</span>
    </span>
  );
}

export function magnetAccent(index: number, seed = 0, palette: Accent[] = MAGNET_ORDER): Accent {
  return palette[(index + seed) % palette.length];
}

export function magnetTilt(index: number, char: string, seed = 0) {
  // Rounded so server and client serialise the same style string.
  return Math.round((seeded(index * 7 + seed + char.charCodeAt(0)) - 0.5) * 160) / 10;
}

/** A word spelled in magnets — static version (hero has its own animated input). */
export function MagnetWord({
  text,
  seed = 0,
  palette,
  className,
}: {
  text: string;
  seed?: number;
  palette?: Accent[];
  className?: string;
}) {
  const letters = Array.from(text.toUpperCase());
  return (
    <span role="img" aria-label={text} className={cn("inline-flex flex-wrap items-end justify-center gap-x-[0.04em]", className)}>
      {letters.map((ch, i) =>
        ch === " " ? (
          <span key={i} className="w-[0.3em]" />
        ) : (
          <MagnetLetter key={i} char={ch} accent={magnetAccent(i, seed, palette)} rotate={magnetTilt(i, ch, seed)} />
        ),
      )}
    </span>
  );
}
