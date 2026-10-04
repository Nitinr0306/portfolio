import { describe, expect, it } from "vitest";
import {
  addGrain,
  blur,
  laplacianVariance,
  makeGray,
  meanIntensity,
  measureReference,
  noiseSigma,
  relight,
  scoreImage,
  sharpness,
  type Gray,
} from "./image-metrics";

/** A page of fake "text": dark strokes on light paper. */
function document(width = 160, height = 100): Gray {
  const g = makeGray(width, height, 230);
  for (let line = 0; line < 6; line++) {
    const y0 = 10 + line * 14;
    for (let x = 8; x < width - 8; x++) {
      if ((x * 7 + line * 13) % 11 < 6) {
        for (let y = y0; y < y0 + 6; y++) g.data[y * width + x] = 40;
      }
    }
  }
  return g;
}

const thresholds = { minSharpness: 0.2, minBrightness: 90, maxBrightness: 245, maxExtraNoise: 6 };

describe("measurements", () => {
  it("reports mean intensity", () => {
    expect(meanIntensity(makeGray(4, 4, 100))).toBe(100);
  });

  it("gives a flat image zero Laplacian variance and zero noise", () => {
    const flat = makeGray(20, 20, 128);
    expect(laplacianVariance(flat)).toBe(0);
    expect(noiseSigma(flat)).toBe(0);
  });

  it("loses sharpness as blur increases", () => {
    const doc = document();
    const s0 = sharpness(doc);
    const s1 = sharpness(blur(doc, 0.6));
    const s3 = sharpness(blur(doc, 2));
    expect(s1).toBeLessThan(s0);
    expect(s3).toBeLessThan(s1);
  });

  it("treats dimming as a brightness problem, not a sharpness problem", () => {
    const doc = document();
    const dim = relight(doc, 0.5);
    expect(sharpness(dim)).toBeCloseTo(sharpness(doc), 5);
    expect(meanIntensity(dim)).toBeCloseTo(meanIntensity(doc) / 2, 5);
  });

  it("estimates injected grain close to its true sigma", () => {
    const flat = makeGray(200, 200, 128);
    const sigma = noiseSigma(addGrain(flat, 10));
    expect(sigma).toBeGreaterThan(8);
    expect(sigma).toBeLessThan(12);
  });

  it("is deterministic for a given seed", () => {
    const a = addGrain(makeGray(10, 10, 100), 5, 42);
    const b = addGrain(makeGray(10, 10, 100), 5, 42);
    expect(Array.from(a.data)).toEqual(Array.from(b.data));
  });
});

describe("quality gate", () => {
  const clean = document();
  const ref = measureReference(clean);

  it("passes the clean reference", () => {
    expect(scoreImage(clean, ref, thresholds).pass).toBe(true);
  });

  it("flags a blurred scan on sharpness only", () => {
    const r = scoreImage(blur(clean, 2.5), ref, thresholds);
    expect(r.checks.sharpness).toBe(false);
    expect(r.checks.brightness).toBe(true);
    expect(r.pass).toBe(false);
  });

  it("flags a dark scan on brightness", () => {
    const r = scoreImage(relight(clean, 0.3), ref, thresholds);
    expect(r.checks.brightness).toBe(false);
    expect(r.pass).toBe(false);
  });

  it("flags grain even though grain inflates the sharpness score", () => {
    const r = scoreImage(addGrain(clean, 25), ref, thresholds);
    expect(r.sharpness).toBeGreaterThan(1);
    expect(r.checks.sharpness).toBe(true);
    expect(r.checks.noise).toBe(false);
    expect(r.pass).toBe(false);
  });
});
