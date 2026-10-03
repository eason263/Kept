import { cn } from "@/lib/cn";

/** Wordmark: "kept" + a full stop that takes the section's accent. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("display inline-flex items-end leading-none", className)} style={{ textTransform: "none" }}>
      kept
      <span aria-hidden className="mb-[0.06em] ml-[0.04em] inline-block size-[0.26em] rounded-full bg-accent" />
    </span>
  );
}
