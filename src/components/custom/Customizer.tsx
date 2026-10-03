"use client";

import { motion, useSpring } from "motion/react";
import { useState, type PointerEvent } from "react";
import { ChoiceField, PhotoField, SizeField, TextField } from "./Fields";
import { Preview, type PhotosFor } from "./Preview";
import { Arrow } from "@/components/ui/Arrow";
import { FitFrame } from "@/components/ui/FitFrame";
import { SmartLink } from "@/components/ui/SmartLink";
import { ACCENTS } from "@/lib/accents";
import { useBag } from "@/lib/bag";
import { formatDate, useBirthday, useNames } from "@/lib/birthday";
import { CONFIGS, priceOf, summarise, visibleFields, type NameInfo, type Values } from "@/lib/customize";
import { estimateDelivery } from "@/lib/delivery";
import { DETAILS } from "@/lib/giftDetails";
import { GIFT_ORDER, GIFTS, type GiftId } from "@/lib/gifts";
import { useFinePointer, useMounted, useReducedMotionSafe } from "@/lib/hooks";
import { measureQuality, setSharedPhoto, useSharedPhoto, type PhotoQuality } from "@/lib/workbench";
import { cn, EASE_OUT } from "@/lib/cn";

function GiftTabs({ current }: { current: GiftId }) {
  return (
    <nav aria-label="Choose what to make" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:-mx-10 md:px-10">
      <ul className="flex w-max gap-2">
        {GIFT_ORDER.map((gid) => {
          const active = gid === current;
          return (
            <li key={gid}>
              <SmartLink
                href={`/custom/${gid}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "label block rounded-full border px-4 py-2.5 transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/50",
                )}
              >
                {GIFTS[gid].name}
              </SmartLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * The workbench: live preview on the left (tilts toward the pointer, scales with the
 * size you pick), numbered choices on the right, price and delivery always in view.
 */
export function Customizer({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const accent = ACCENTS[gift.accent];
  const config = CONFIGS[id];
  const detail = DETAILS[id];
  const b = useBirthday();
  const n = useNames();
  const bag = useBag();
  const mounted = useMounted();
  const fine = useFinePointer();
  const reduce = useReducedMotionSafe();
  const shared = useSharedPhoto();

  const info: NameInfo = {
    hasName: n.hasName,
    upper: n.hasName ? n.upper : "",
    lower: n.hasName ? n.lower : "",
    initial: n.hasName ? n.initial : "",
    date: formatDate(b.day, b.month).replace(/ /g, ""),
  };

  // Only what the visitor changed is stored; everything else follows the defaults,
  // so a name typed on the home page still flows in.
  const [edits, setEdits] = useState<Values>({});
  const values: Values = { ...config.defaults(info), ...edits };
  const setValue = (key: string, value: string) => setEdits((e) => ({ ...e, [key]: value }));

  const [uploads, setUploads] = useState<Record<string, Array<string | undefined>>>({});
  const [quality, setQuality] = useState<Record<string, PhotoQuality>>({});
  const [side, setSide] = useState<"front" | "back">("front");
  const [added, setAdded] = useState(false);

  const slotUrls = (key: string, count = 1) => {
    const own = uploads[key] ?? [];
    return Array.from({ length: count }, (_, i) => own[i] ?? (i === 0 && !own.some(Boolean) ? (shared ?? undefined) : undefined));
  };

  const photos: PhotosFor = (key, samples) => {
    const field = config.fields.find((f) => f.key === key);
    const count = field?.kind === "photo" ? (field.count ?? 1) : 1;
    const urls = slotUrls(key, count);
    const out = Array.from({ length: Math.max(count, samples.length) }, (_, i) =>
      urls[i] ? { url: urls[i]! } : samples[i % Math.max(samples.length, 1)],
    );
    return out.filter(Boolean);
  };

  const onFile = (key: string, file: File, slot: number) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setUploads((u) => {
      const list = [...(u[key] ?? [])];
      list[slot] = url;
      return { ...u, [key]: list };
    });
    if (slot === 0) setSharedPhoto(url);
    measureQuality(url).then((q) => setQuality((prev) => ({ ...prev, [key]: q })));
  };

  const fields = visibleFields(id, values);
  const price = priceOf(id, values);
  const size = detail.sizes.find((s) => s.id === values.size) ?? detail.sizes[0];
  const delivery = mounted ? estimateDelivery(detail.days, b.day, b.month, n.possessive) : null;
  const dot = delivery?.tone === "fine" ? "bg-acid" : delivery?.tone === "tight" ? "bg-tangerine" : "bg-cherry";

  const addToBag = () => {
    const counts = Object.fromEntries(
      config.fields.filter((f) => f.kind === "photo").map((f) => [f.key, slotUrls(f.key, f.kind === "photo" ? (f.count ?? 1) : 1).filter(Boolean).length]),
    );
    bag.add({ giftId: id, title: gift.name, details: summarise(id, values, counts), price });
    bag.setOpen(true);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  // Pointer tilt on the stage.
  const rx = useSpring(0, { stiffness: 140, damping: 18 });
  const ry = useSpring(0, { stiffness: 140, damping: 18 });
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const untilt = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className="lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {/* Stage */}
      <div className="sticky top-0 z-20 h-[44svh] lg:h-screen">
        <div
          onPointerMove={tilt}
          onPointerLeave={untilt}
          className="relative h-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#fbf7f0_0%,#efe6d8_55%,#e0d2bd_100%)]"
        >
          <span
            aria-hidden
            className="absolute left-1/2 top-[50%] aspect-square w-[min(80vw,62vh)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 lg:w-[min(46vw,74vh)]"
            style={{ background: accent.color }}
          />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-b from-[#d8c8b0] to-[#c9b597]" />

          <div className="absolute inset-0 flex items-center justify-center pb-10 pt-16 lg:pb-16 lg:pt-20" style={{ perspective: 1200 }}>
            <motion.div
              className="w-[min(70vw,calc((44svh-6.5rem)*0.8))] lg:w-[min(80%,calc((100vh-10rem)*0.8))]"
              style={{ rotateX: rx, rotateY: ry }}
            >
              <motion.div animate={{ scale: size.scale }} transition={{ type: "spring", stiffness: 150, damping: 18 }}>
                <FitFrame>
                  <Preview id={id} values={values} photos={photos} side={side} />
                </FitFrame>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-4 md:inset-x-8 lg:bottom-6">
            <div className="flex items-center gap-3">
              <span className="label hidden text-ink/60 sm:inline">Live preview</span>
              {id === "photo-keychain" && (
                <button
                  type="button"
                  onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
                  className="label rounded-full bg-ink px-4 py-2.5 text-paper"
                  aria-pressed={side === "back"}
                >
                  Flip to the {side === "front" ? "back" : "front"}
                </button>
              )}
            </div>
            <span className="label flex items-center gap-2 text-ink/70">
              <span aria-hidden className="h-px w-8 bg-ink/50" />
              {size.dims}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 bg-frosting px-4 pb-10 pt-8 md:px-10 lg:pb-12 lg:pt-28">
        <GiftTabs current={id} />

        <header className="mt-9">
          <p className="label text-smudge">The workbench</p>
          <h1 className="display mt-3 text-[clamp(3rem,5.2vw,5.6rem)]">{gift.name}</h1>
          <p className="mt-4 max-w-[32rem] text-[1.05rem] leading-relaxed text-ink/75">{config.intro}</p>
          <SmartLink href={`/gift/${id}`} className="mt-3 inline-flex items-center gap-2 text-[0.95rem] underline decoration-ink/25 underline-offset-4 hover:decoration-accent">
            The story behind it <Arrow />
          </SmartLink>
        </header>

        <ol className="mt-10 space-y-10">
          {fields.map((f, i) => (
            <motion.li key={f.key} layout="position" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {f.kind === "photo" && (
                <PhotoField
                  index={i}
                  field={f}
                  urls={slotUrls(f.key, f.count ?? 1)}
                  quality={quality[f.key]}
                  onFile={(file, slot) => onFile(f.key, file, slot)}
                />
              )}
              {f.kind === "choice" && <ChoiceField index={i} field={f} value={values[f.key]} onChange={(v) => setValue(f.key, v)} />}
              {f.kind === "text" && (
                <TextField
                  index={i}
                  field={f}
                  value={values[f.key] ?? ""}
                  extraSuggestions={id === "laser-portrait" && f.key === "line2" ? [info.date] : []}
                  onChange={(v) => setValue(f.key, v)}
                />
              )}
              {f.kind === "size" && <SizeField index={i} sizes={detail.sizes} value={values.size} onChange={(v) => setValue("size", v)} />}
            </motion.li>
          ))}
        </ol>

        <div className="sticky bottom-3 z-20 mt-12 rounded-[24px] bg-ink p-4 text-paper shadow-lift md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label text-paper/55">Your {gift.name.toLowerCase()}</p>
              <motion.p
                key={price}
                className="display text-[2.2rem] leading-none md:text-[2.8rem]"
                initial={{ y: -6, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
              >
                ${price}
              </motion.p>
            </div>
            <button
              type="button"
              onClick={addToBag}
              data-cursor="cta"
              className="display flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[1.15rem] transition-transform hover:scale-[1.03] md:px-6 md:py-4 md:text-[1.3rem]"
              style={{ background: accent.color, color: accent.ink }}
            >
              {added ? "Added — in your bag" : "Add to bag"}
              {!added && <Arrow />}
            </button>
          </div>
          <p className="mt-3 flex items-start gap-2 text-[0.82rem] leading-snug text-paper/75 md:text-[0.9rem]" aria-live="polite">
            <span aria-hidden className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", dot)} />
            {delivery?.line ?? " "}
          </p>
          <p className="mt-1 hidden text-[0.82rem] text-paper/45 sm:block">We email you a proof before anything gets made.</p>
        </div>
      </div>
    </motion.div>
  );
}
