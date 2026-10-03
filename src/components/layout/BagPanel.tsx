"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { GiftThumb } from "@/components/home/GiftScenes";
import { Arrow } from "@/components/ui/Arrow";
import { SmartLink } from "@/components/ui/SmartLink";
import { useBag } from "@/lib/bag";
import { EASE_OUT } from "@/lib/cn";

/** The bag dropdown: empty state, items, subtotal. Checkout is not wired in the prototype. */
export function BagPanel() {
  const { items, total, remove, open, setOpen } = useBag();
  const [checkoutNote, setCheckoutNote] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="bag-panel"
          role="dialog"
          aria-label="Your bag"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="absolute right-0 top-[calc(100%+10px)] w-[min(380px,calc(100vw-24px))] origin-top-right rounded-[24px] bg-paper p-6 text-ink shadow-lift"
          data-lenis-prevent
        >
          <p className="label flex justify-between text-smudge">
            <span>Your bag</span>
            <span>{items.length ? `${items.length} item${items.length === 1 ? "" : "s"}` : ""}</span>
          </p>

          {items.length === 0 ? (
            <>
              <p className="display mt-3 text-[2.4rem]">Empty.</p>
              <p className="mt-2 text-[0.95rem] leading-snug text-ink/75">
                Like a cake with no candles. Tell us who it’s for and we’ll help you fill it.
              </p>
              <SmartLink
                href="/#quiz"
                onClick={() => setOpen(false)}
                className="label mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-paper"
              >
                Find them a gift <Arrow />
              </SmartLink>
            </>
          ) : (
            <>
              <ul className="mt-4 max-h-[46vh] space-y-3 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                      className="flex gap-4 rounded-[18px] bg-frosting/70 p-3"
                    >
                      <span aria-hidden className="grid size-16 shrink-0 place-items-center overflow-hidden">
                        <span className="scale-[0.55]">
                          <GiftThumb id={item.giftId} />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex justify-between gap-2 font-semibold">
                          {item.title}
                          <span className="font-mono text-[0.85rem]">${item.price}</span>
                        </span>
                        <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink/65">{item.details.join(" · ")}</span>
                        <button
                          type="button"
                          onClick={() => remove(item.key)}
                          className="mt-1 text-[0.8rem] underline decoration-ink/25 underline-offset-4 hover:decoration-cherry"
                        >
                          Remove
                        </button>
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <dl className="mt-4 space-y-1 border-t border-dashed border-ink/25 pt-4 font-mono text-[0.8rem]">
                <div className="flex justify-between">
                  <dt>Card + gift wrap</dt>
                  <dd>free</dd>
                </div>
                <div className="flex justify-between text-[0.95rem] font-semibold">
                  <dt>Subtotal</dt>
                  <dd>${total}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setCheckoutNote(true)}
                className="display mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 text-[1.3rem] text-paper transition-colors hover:bg-accent hover:text-accent-ink"
              >
                Checkout <Arrow />
              </button>
              {checkoutNote && (
                <p role="status" className="mt-3 text-[0.85rem] leading-snug text-ink/70">
                  Checkout isn’t connected in this prototype. Your bag is saved on this device.
                </p>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
