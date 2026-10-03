"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BagPanel } from "./BagPanel";
import { Logo } from "./Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { useBag } from "@/lib/bag";
import { cn, EASE_OUT } from "@/lib/cn";

const LINKS = [
  { href: "/#explore", label: "Explore" },
  { href: "/#quiz", label: "Quiz" },
  { href: "/custom/laser-portrait", label: "Custom" },
];

function RollLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <SmartLink href={href} onClick={onClick} className="label group block rounded-full px-4 py-2.5">
      <span className="block h-[1.35em] overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1/2">
          {label}
          <span aria-hidden className="block">
            {label}
          </span>
        </span>
      </span>
    </SmartLink>
  );
}

/**
 * Top-left wordmark, top-right links. Transparent at the top of the page;
 * after a little scroll both halves tuck into floating capsules.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { count, open: bagOpen, setOpen: setBagOpen } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const bagRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 64));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBagOpen(false);
        setMenuOpen(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (bagRef.current && !bagRef.current.contains(e.target as Node)) setBagOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [setBagOpen]);

  const capsule = "transition-[background-color,color,box-shadow,padding] duration-500 ease-[var(--ease-out)]";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 p-3 md:p-5">
        <SmartLink
          href="/#top"
          aria-label="kept. — home"
          className={cn(
            "pointer-events-auto rounded-full",
            capsule,
            scrolled ? "bg-paper/90 px-5 py-2.5 text-ink shadow-[0_8px_30px_-12px_rgb(27_24_22/0.4)] backdrop-blur-md" : "px-2 py-1",
          )}
        >
          <Logo className={cn("transition-[font-size] duration-500", scrolled ? "text-[1.6rem]" : "text-[2.2rem] md:text-[2.6rem]")} />
        </SmartLink>

        <div ref={bagRef} className="pointer-events-auto relative">
          <nav
            aria-label="Main"
            className={cn(
              "flex items-center rounded-full",
              capsule,
              scrolled ? "bg-ink/92 p-1.5 text-paper shadow-[0_8px_30px_-12px_rgb(27_24_22/0.6)] backdrop-blur-md" : "p-1.5 text-ink",
            )}
          >
            <ul className="hidden items-center md:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <RollLink {...l} />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setBagOpen(!bagOpen)}
              aria-expanded={bagOpen}
              aria-controls="bag-panel"
              className="label ml-1 flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-accent-ink transition-transform hover:scale-[1.04]"
            >
              Bag{" "}
              <motion.span
                key={count}
                className="inline-block tabular-nums"
                initial={{ scale: count ? 1.8 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                ({count})
              </motion.span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="label ml-1 rounded-full px-4 py-2.5 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              Menu
            </button>
          </nav>

          <BagPanel />
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-ink p-4 text-paper md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between">
              <Logo className="text-[2.2rem] text-paper" />
              <button type="button" onClick={() => setMenuOpen(false)} className="label rounded-full border border-paper/30 px-4 py-2.5">
                Close
              </button>
            </div>
            <ul className="mt-auto">
              {[...LINKS, { href: "/#top", label: "Start over" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE_OUT }}
                >
                  <SmartLink href={l.href} onClick={() => setMenuOpen(false)} className="display block border-b border-paper/15 py-2 text-[17vw]">
                    {l.label}
                  </SmartLink>
                </motion.li>
              ))}
            </ul>
            <p className="hand mt-8 text-[1.9rem] text-bubble">psst — the quiz is the fun part.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
