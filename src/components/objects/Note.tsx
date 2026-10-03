import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Torn-off ruled note with a strip of tape. */
export function Note({ children, width = 190, className }: { children: ReactNode; width?: number; className?: string }) {
  return (
    <div
      className={cn("relative bg-paper px-5 pb-6 pt-7 shadow-obj [container-type:inline-size]", className)}
      style={{
        width,
        backgroundImage:
          "linear-gradient(90deg, transparent 22px, rgb(227 40 47 / 0.35) 22px 23px, transparent 23px), repeating-linear-gradient(180deg, transparent 0 25px, rgb(39 71 255 / 0.16) 25px 26px)",
      }}
    >
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-[#f6eccd]/85 shadow-sm" />
      <p className="hand pl-3 text-[15cqw] leading-[0.9] text-[#1f2a8a]">{children}</p>
    </div>
  );
}
