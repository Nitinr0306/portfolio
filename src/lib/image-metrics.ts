/**
 * Image-quality maths behind the in-browser quality-gate demo on the MedVision AI case
 * study. Textbook implementations written to explain the technique. This is not
 * MedVision's production code, and the thresholds are illustrative.
 *
 * Everything works on grayscale buffers (one float per pixel, row-major), so the demo
 * gives identical numbers in every browser and every function is unit-testable.
 */

export type Gray = { data: Float32Array; width: number; height: number };

export function makeGray(width: number, height: number, fill = 0): Gray {
  return { data: new Float32Array(width * height).fill(fill), width, height };
}

/** RGBA (canvas ImageData layout) → grayscale using Rec. 601 luma weights. */
export function rgbaToGray(rgba: Uint8ClampedArray, width: number, height: number): Gray {
  const out = makeGray(width, height);
  for (let i = 0, p = 0; i < out.data.length; i++, p += 4) {
    out.data[i] = 0.299 * rgba[p]! + 0.587 * rgba[p + 1]! + 0.114 * rgba[p + 2]!;
  }
  return out;
}

/** Grayscale → RGBA for drawing back onto a canvas. */
export function grayToRgba(g: Gray, target: Uint8ClampedArray): void {
  for (let i = 0, p = 0; i < g.data.length; i++, p += 4) {
    const v = g.data[i]!;
    target[p] = v;
    target[p + 1] = v;
    target[p + 2] = v;
    target[p + 3] = 255;
  }
}

const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

/* ── Distortions ─────────────────────────────────────────────────────────── */

function gaussianKernel(sigma: number): Float32Array {
  const radius = Math.max(1, Math.ceil(sigma * 3));
  const k = new Float32Array(radius * 2 + 1);
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    k[i + radius] = v;
    sum += v;
  }
  for (let i = 0; i < k.length; i++) k[i]! /= sum;
  return k;
}

/** Separable Gaussian blur with edge clamping. sigma 0 returns a copy. */
export function blur(g: Gray, sigma: number): Gray {
  const { width: w, height: h } = g;
  const out = makeGray(w, h);
  if (sigma <= 0) {
    out.data.set(g.data);
    return out;
  }
  const k = gaussianKernel(sigma);
  const r = (k.length - 1) / 2;
  const tmp = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) acc += g.data[row + Math.min(w - 1, Math.max(0, x + i))]! * k[i + r]!;
      tmp[row + x] = acc;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let i = -r; i <= r; i++) acc += tmp[Math.min(h - 1, Math.max(0, y + i)) * w + x]! * k[i + r]!;
      out.data[y * w + x] = acc;
    }
  }
  return out;
}

/** Multiplies intensity, clipping at white like an over-exposed photo. */
export function relight(g: Gray, factor: number): Gray {
  const out = makeGray(g.width, g.height);
  for (let i = 0; i < g.data.length; i++) out.data[i] = clamp255(g.data[i]! * factor);
  return out;
}

/** Small deterministic PRNG (mulberry32) so injected grain doesn't shimmer between renders. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Approximately Gaussian sensor grain with standard deviation ≈ `sigma`. */
export function addGrain(g: Gray, sigma: number, seed = 7): Gray {
  const out = makeGray(g.width, g.height);
  out.data.set(g.data);
  if (sigma <= 0) return out;
  const rand = mulberry32(seed);
  // Sum of 3 uniforms on [-0.5, 0.5] has variance 1/4, so scale by 2σ.
  for (let i = 0; i < out.data.length; i++) {
    out.data[i] = clamp255(out.data[i]! + (rand() + rand() + rand() - 1.5) * 2 * sigma);
  }
  return out;
}

/* ── Measurements ────────────────────────────────────────────────────────── */

/** Brightness: mean intensity, 0 (black) to 255 (white). */
export function meanIntensity({ data }: Gray): number {
  if (data.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i]!;
  return sum / data.length;
}

/** Global contrast: variance of intensity. */
export function intensityVariance(g: Gray): number {
  const mean = meanIntensity(g);
  let acc = 0;
  for (let i = 0; i < g.data.length; i++) acc += (g.data[i]! - mean) ** 2;
  return g.data.length ? acc / g.data.length : 0;
}

/**
 * Variance of the Laplacian (4-neighbour kernel). Edges produce large second
 * derivatives; blur flattens them, so the variance drops.
 */
export function laplacianVariance({ data, width, height }: Gray): number {
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const lap = data[i - width]! + data[i + width]! + data[i - 1]! + data[i + 1]! - 4 * data[i]!;
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  if (n === 0) return 0;
  const mean = sum / n;
  return sumSq / n - mean * mean;
}

/**
 * Sharpness: Laplacian variance normalised by intensity variance, so dimming an image
 * (which scales both by the same factor squared) doesn't read as blur.
 */
export function sharpness(g: Gray): number {
  const v = intensityVariance(g);
  return v > 0 ? laplacianVariance(g) / v : 0;
}

/**
 * Noise: Immerkær's fast noise-variance estimate (1996). The kernel cancels smooth
 * structure and keeps pixel-level noise; the mean absolute response is scaled to σ.
 */
export function noiseSigma({ data, width, height }: Gray): number {
  if (width < 3 || height < 3) return 0;
  let acc = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const v =
        data[i - width - 1]! -
        2 * data[i - width]! +
        data[i - width + 1]! -
        2 * data[i - 1]! +
        4 * data[i]! -
        2 * data[i + 1]! +
        data[i + width - 1]! -
        2 * data[i + width]! +
        data[i + width + 1]!;
      acc += Math.abs(v);
    }
  }
  return (Math.sqrt(Math.PI / 2) * acc) / (6 * (width - 2) * (height - 2));
}

/* ── The gate ────────────────────────────────────────────────────────────── */

export type GateThresholds = {
  /** Minimum sharpness as a fraction of the clean reference. */
  minSharpness: number;
  /** Acceptable mean-intensity window. */
  minBrightness: number;
  maxBrightness: number;
  /** Maximum noise σ above the clean reference. */
  maxExtraNoise: number;
};

export type Reference = { sharpness: number; noise: number };

export type GateReading = {
  /** 1 = as sharp as the clean reference. Noise can push this above 1. */
  sharpness: number;
  brightness: number;
  extraNoise: number;
  checks: { sharpness: boolean; brightness: boolean; noise: boolean };
  pass: boolean;
};

export function measureReference(clean: Gray): Reference {
  return { sharpness: sharpness(clean), noise: noiseSigma(clean) };
}

export function scoreImage(image: Gray, reference: Reference, t: GateThresholds): GateReading {
  const s = reference.sharpness > 0 ? sharpness(image) / reference.sharpness : 0;
  const brightness = meanIntensity(image);
  const extraNoise = Math.max(0, noiseSigma(image) - reference.noise);
  const checks = {
    sharpness: s >= t.minSharpness,
    brightness: brightness >= t.minBrightness && brightness <= t.maxBrightness,
    noise: extraNoise <= t.maxExtraNoise,
  };
  return {
    sharpness: s,
    brightness,
    extraNoise,
    checks,
    pass: checks.sharpness && checks.brightness && checks.noise,
  };
}
