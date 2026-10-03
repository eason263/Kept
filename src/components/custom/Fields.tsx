"use client";

/* eslint-disable @next/next/no-img-element -- uploaded photos are object URLs */

import { useId, useState, type DragEvent, type ReactNode } from "react";
import type { ChoiceOption, Field } from "@/lib/customize";
import type { SizeOption } from "@/lib/giftDetails";
import type { PhotoQuality } from "@/lib/workbench";
import { cn } from "@/lib/cn";

export function FieldShell({ index, label, aside, children }: { index: number; label: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <p className="label flex items-baseline justify-between gap-4">
        <span>
          <span className="text-smudge">{String(index + 1).padStart(2, "0")} — </span>
          {label}
        </span>
        {aside && <span className="text-smudge">{aside}</span>}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

const QUALITY: Record<PhotoQuality, { dot: string; text: string }> = {
  great: { dot: "bg-acid", text: "Sharp enough for any size." },
  ok: { dot: "bg-tangerine", text: "Good for the standard size. For bigger ones, use the original from your camera roll." },
  small: { dot: "bg-cherry", text: "This one’s small — it may look soft. Try the original from your camera roll." },
};

function PhotoSlot({ url, onFile, compact, label }: { url?: string; onFile: (file: File) => void; compact?: boolean; label: string }) {
  const [over, setOver] = useState(false);
  const inputId = useId();
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };
  return (
    <label
      htmlFor={inputId}
      data-cursor="cta"
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        "group relative flex cursor-pointer items-center gap-4 rounded-[18px] border-2 border-dashed p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4",
        over ? "border-accent bg-accent/10" : "border-ink/20 hover:border-ink/50",
        compact && "aspect-square flex-col justify-center p-2 text-center",
      )}
    >
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      {url ? (
        <img src={url} alt="" className={cn("shrink-0 rounded-[10px] object-cover", compact ? "size-full" : "size-20")} />
      ) : (
        <span
          aria-hidden
          className={cn("grid shrink-0 place-items-center rounded-[10px] bg-ink/5 text-[1.8rem] text-ink/40", compact ? "size-12" : "size-20")}
        >
          +
        </span>
      )}
      {!compact && (
        <span>
          <span className="block font-semibold">{url ? "Replace photo" : "Add a photo"}</span>
          <span className="block text-[0.88rem] text-ink/60">Tap to choose, or drop it here</span>
        </span>
      )}
    </label>
  );
}

export function PhotoField({
  index,
  field,
  urls,
  quality,
  onFile,
}: {
  index: number;
  field: Extract<Field, { kind: "photo" }>;
  urls: Array<string | undefined>;
  quality?: PhotoQuality;
  onFile: (file: File, slot: number) => void;
}) {
  const count = field.count ?? 1;
  const any = urls.some(Boolean);
  return (
    <FieldShell index={index} label={field.label} aside={count > 1 ? `${urls.filter(Boolean).length}/${count}` : undefined}>
      <div className={cn(count > 1 && "grid grid-cols-3 gap-3")}>
        {Array.from({ length: count }, (_, slot) => (
          <PhotoSlot key={slot} url={urls[slot]} compact={count > 1} label={`${field.label} ${slot + 1}`} onFile={(f) => onFile(f, slot)} />
        ))}
      </div>
      {field.help && <p className="mt-3 text-[0.92rem] text-ink/65">{field.help}</p>}
      {quality && any && (
        <p className="mt-2 flex items-start gap-2 text-[0.92rem]" role="status">
          <span aria-hidden className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", QUALITY[quality].dot)} />
          {QUALITY[quality].text}
        </p>
      )}
      <p className="mt-2 text-[0.82rem] text-smudge">
        {any ? "Your photo stays on this device until you order." : "Showing a sample photo until you add yours."}
      </p>
    </FieldShell>
  );
}

export function ChoiceField({
  index,
  field,
  value,
  onChange,
}: {
  index: number;
  field: Extract<Field, { kind: "choice" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const name = useId();
  const current = field.options.find((o) => o.id === value);
  return (
    <FieldShell index={index} label={field.label} aside={field.swatches ? current?.label : undefined}>
      <div role="radiogroup" aria-label={field.label} className={cn("flex flex-wrap", field.swatches ? "gap-4" : "gap-2")}>
        {field.options.map((o: ChoiceOption) => {
          const checked = o.id === value;
          return (
            <label key={o.id} className="group relative cursor-pointer">
              <input type="radio" name={name} value={o.id} checked={checked} onChange={() => onChange(o.id)} className="peer sr-only" />
              {field.swatches ? (
                <span className="flex flex-col items-center gap-1.5">
                  <span
                    aria-hidden
                    className={cn(
                      "block size-14 rounded-full shadow-obj ring-offset-2 ring-offset-frosting transition-[box-shadow,transform] group-hover:scale-105 group-has-[:focus-visible]:outline group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-4",
                      o.swatch,
                      checked ? "ring-2 ring-ink" : "ring-1 ring-black/10",
                    )}
                    style={o.swatchStyle ? { background: o.swatchStyle } : undefined}
                  />
                  <span className="text-[0.82rem]">
                    {o.label}
                    {o.delta ? <span className="text-smudge"> +${o.delta}</span> : null}
                  </span>
                </span>
              ) : (
                <span
                  className={cn(
                    "block rounded-full border-2 px-5 py-2.5 font-semibold transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                    checked ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/50",
                  )}
                >
                  {o.label}
                  {o.delta ? <span className="opacity-60"> +${o.delta}</span> : null}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}

export function TextField({
  index,
  field,
  value,
  extraSuggestions = [],
  onChange,
}: {
  index: number;
  field: Extract<Field, { kind: "text" }>;
  value: string;
  extraSuggestions?: string[];
  onChange: (v: string) => void;
}) {
  const id = useId();
  const suggestions = [...extraSuggestions, ...(field.suggestions ?? [])].filter((s, i, all) => s && all.indexOf(s) === i);
  return (
    <FieldShell index={index} label={field.label} aside={`${value.length}/${field.max}`}>
      <label htmlFor={id} className="sr-only">
        {field.label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={field.max}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className="w-full rounded-[16px] border-2 border-ink/15 bg-paper px-5 py-3.5 text-[1.15rem] font-medium outline-none transition-colors placeholder:text-ink/30 focus:border-ink"
      />
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="hand text-[1.5rem] text-ink/60">steal one:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s.slice(0, field.max))}
              className="rounded-full bg-ink/5 px-3 py-1.5 text-[0.85rem] transition-colors hover:bg-ink hover:text-paper"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </FieldShell>
  );
}

export function SizeField({
  index,
  sizes,
  value,
  onChange,
}: {
  index: number;
  sizes: SizeOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  const name = useId();
  return (
    <FieldShell index={index} label="Size">
      <div role="radiogroup" aria-label="Size" className={cn("grid gap-2", sizes.length > 2 ? "grid-cols-3" : "grid-cols-2")}>
        {sizes.map((s) => {
          const checked = s.id === value;
          return (
            <label key={s.id} className="cursor-pointer">
              <input type="radio" name={name} value={s.id} checked={checked} onChange={() => onChange(s.id)} className="peer sr-only" />
              <span
                className={cn(
                  "flex h-full flex-col rounded-[18px] border-2 p-4 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                  checked ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/50",
                )}
              >
                <span className="font-semibold leading-tight">{s.label}</span>
                <span className={cn("mt-1 text-[0.8rem] leading-snug", checked ? "text-paper/65" : "text-ink/55")}>{s.dims}</span>
                <span className="mt-auto pt-3 font-mono text-[0.9rem]">${s.price}</span>
              </span>
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}
