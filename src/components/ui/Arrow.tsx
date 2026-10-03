import { cn } from "@/lib/cn";

/** Hand-cut arrow — slightly uneven on purpose. */
export function Arrow({ className, direction = "right" }: { className?: string; direction?: "right" | "down" | "up-right" }) {
  const rotate = direction === "down" ? 90 : direction === "up-right" ? -45 : 0;
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("inline-block size-[0.9em] shrink-0", className)}
      style={{ rotate: `${rotate}deg` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3.5 12.4c5.6-.3 11.3-.5 16.6-.3" />
      <path d="M13.6 5.6c2.4 2.3 4.6 4.3 6.6 6.5-2.2 2-4.3 4-6.3 6.3" />
    </svg>
  );
}
