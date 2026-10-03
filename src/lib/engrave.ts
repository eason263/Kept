"use client";

import { useEffect, useState } from "react";

/**
 * Client-side "laser engraving" of a photo.
 *  - `line`: Sobel edges + a little tone, dark on paper (the trace stage)
 *  - `burn`: transparent PNG of burn marks only — horizontal engraving lines whose
 *    weight follows darkness, vignetted like a medallion. Composite it on any wood.
 *  - `ink`: the line art on a transparent background, for sketches and handwriting.
 * Results are object URLs, cached per source for the session.
 */
export interface Engraving {
  line: string;
  burn: string;
  ink: string;
}

const W = 520;
const H = 650;
const cache = new Map<string, Promise<Engraving>>();

export function engrave(src: string): Promise<Engraving> {
  let job = cache.get(src);
  if (!job) {
    job = loadImage(src).then(process);
    job.catch(() => cache.delete(src));
    cache.set(src, job);
  }
  return job;
}

/** Engrave `src` when the browser is idle. Returns null until ready (or on failure). */
export function useEngraving(src: string | null) {
  const [done, setDone] = useState<{ src: string; result: Engraving } | null>(null);

  useEffect(() => {
    if (!src) return;
    let alive = true;
    const run = () =>
      engrave(src)
        .then((result) => alive && setDone({ src, result }))
        .catch(() => {});
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle ? window.requestIdleCallback(run, { timeout: 1200 }) : window.setTimeout(run, 150);
    return () => {
      alive = false;
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [src]);

  return done && done.src === src ? done.result : null;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function makeCanvas() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return c;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function toUrl(canvas: HTMLCanvasElement) {
  return new Promise<string>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

function boxBlur(src: Float32Array, r: number) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const span = 2 * r + 1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let k = -r; k <= r; k++) s += src[y * W + Math.min(W - 1, Math.max(0, x + k))];
      tmp[y * W + x] = s / span;
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let k = -r; k <= r; k++) s += tmp[Math.min(H - 1, Math.max(0, y + k)) * W + x];
      out[y * W + x] = s / span;
    }
  }
  return out;
}

async function process(img: HTMLImageElement): Promise<Engraving> {
  const N = W * H;

  // 1. Cover-crop into W×H, biased toward the top where faces live.
  const base = makeCanvas();
  const ctx = base.getContext("2d", { willReadFrequently: true })!;
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) * 0.35, dw, dh);
  const { data } = ctx.getImageData(0, 0, W, H);

  const lum = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    lum[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  }

  // 2. Auto-levels: stretch the 2nd–98th percentile to full range.
  const hist = new Uint32Array(256);
  for (let i = 0; i < N; i++) hist[(lum[i] * 255) | 0]++;
  let lo = 0;
  for (let acc = 0; lo < 255 && (acc += hist[lo]) < N * 0.02; lo++);
  let hi = 255;
  for (let acc = 0; hi > 0 && (acc += hist[hi]) < N * 0.02; hi--);
  const lo1 = lo / 255;
  const range = Math.max(1, hi - lo) / 255;
  for (let i = 0; i < N; i++) lum[i] = clamp01((lum[i] - lo1) / range);

  const soft = boxBlur(boxBlur(lum, 1), 2);

  // 3. Sobel edges.
  const mag = new Float32Array(N);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const tl = soft[i - W - 1], t = soft[i - W], tr = soft[i - W + 1];
      const l = soft[i - 1], r = soft[i + 1];
      const bl = soft[i + W - 1], b = soft[i + W], br = soft[i + W + 1];
      const gx = tr + 2 * r + br - tl - 2 * l - bl;
      const gy = bl + 2 * b + br - tl - 2 * t - tr;
      mag[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  const sample: number[] = [];
  for (let i = 0; i < N; i += 7) sample.push(mag[i]);
  sample.sort((a, b) => a - b);
  const p = Math.max(0.05, sample[Math.floor(sample.length * 0.94)]);

  // 4. Line art: ink edges + a whisper of tone on paper.
  const lineCanvas = makeCanvas();
  const lctx = lineCanvas.getContext("2d")!;
  const lineImg = lctx.createImageData(W, H);
  for (let i = 0; i < N; i++) {
    const e = smoothstep(p * 0.35, p, mag[i]);
    const a = Math.min(1, e * 0.95 + (1 - soft[i]) * 0.2);
    lineImg.data[i * 4] = 246 - (246 - 27) * a;
    lineImg.data[i * 4 + 1] = 240 - (240 - 24) * a;
    lineImg.data[i * 4 + 2] = 228 - (228 - 22) * a;
    lineImg.data[i * 4 + 3] = 255;
  }
  lctx.putImageData(lineImg, 0, 0);

  const inkCanvas = makeCanvas();
  const ictx = inkCanvas.getContext("2d")!;
  const inkImg = ictx.createImageData(W, H);
  for (let i = 0; i < N; i++) {
    const e = smoothstep(p * 0.35, p, mag[i]);
    inkImg.data[i * 4] = 27;
    inkImg.data[i * 4 + 1] = 24;
    inkImg.data[i * 4 + 2] = 22;
    inkImg.data[i * 4 + 3] = Math.min(1, e * 0.95 + (1 - soft[i]) * 0.12) * 255;
  }
  ictx.putImageData(inkImg, 0, 0);

  // 5. Burn: engraving lines + edge accents, vignetted.
  const cx = W / 2;
  const cy = H * 0.46;
  const rx = W * 0.52;
  const ry = H * 0.54;
  const fadeAt = (x: number, y: number) => {
    const dx = (x - cx) / rx;
    const dy = (y - cy) / ry;
    return 1 - smoothstep(0.6, 1, dx * dx + dy * dy);
  };

  const burnCanvas = makeCanvas();
  const b = burnCanvas.getContext("2d", { willReadFrequently: true })!;
  b.fillStyle = "rgba(58, 36, 22, 0.94)";
  const gap = 5;
  for (let row = 0; row * gap < H + gap; row++) {
    const y0 = row * gap + gap / 2;
    const yi = Math.min(H - 1, Math.max(0, Math.round(y0)));
    const top: number[] = [];
    const bottom: number[] = [];
    for (let x = 0; x <= W; x += 2) {
      const v = soft[yi * W + Math.min(W - 1, x)];
      const dark = Math.pow(1 - v, 1.3) * fadeAt(x, y0);
      const th = dark * gap * 0.94;
      const wave = Math.sin(x * 0.035 + row * 0.55) * 0.8;
      top.push(x, y0 + wave - th / 2);
      bottom.push(x, y0 + wave + th / 2);
    }
    b.beginPath();
    b.moveTo(top[0], top[1]);
    for (let k = 2; k < top.length; k += 2) b.lineTo(top[k], top[k + 1]);
    for (let k = bottom.length - 2; k >= 0; k -= 2) b.lineTo(bottom[k], bottom[k + 1]);
    b.closePath();
    b.fill();
  }

  const burnImg = b.getImageData(0, 0, W, H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const e = smoothstep(p * 0.5, p * 1.25, mag[i]) * fadeAt(x, y) * 0.6 * 255;
      if (e > burnImg.data[i * 4 + 3]) {
        burnImg.data[i * 4] = 58;
        burnImg.data[i * 4 + 1] = 36;
        burnImg.data[i * 4 + 2] = 22;
        burnImg.data[i * 4 + 3] = e;
      }
    }
  }
  b.putImageData(burnImg, 0, 0);

  const [line, burn, ink] = await Promise.all([toUrl(lineCanvas), toUrl(burnCanvas), toUrl(inkCanvas)]);
  return { line, burn, ink };
}
