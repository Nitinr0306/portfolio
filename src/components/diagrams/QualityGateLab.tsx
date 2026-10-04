"use client";

import { useEffect, useRef, useState } from "react";
import {
  addGrain,
  blur,
  grayToRgba,
  measureReference,
  relight,
  rgbaToGray,
  scoreImage,
  type GateReading,
  type GateThresholds,
  type Gray,
  type Reference,
} from "@/lib/image-metrics";
import { cn } from "@/lib/cn";

const W = 360;
const H = 240;

/** Illustrative thresholds, tuned for this synthetic sample only. */
const THRESHOLDS: GateThresholds = {
  minSharpness: 0.2,
  minBrightness: 95,
  maxBrightness: 238,
  maxExtraNoise: 6,
};

type Settings = { focus: number; light: number; grain: number };

const presets: { label: string; settings: Settings }[] = [
  { label: "Clean scan", settings: { focus: 0, light: 1, grain: 0 } },
  { label: "Out of focus", settings: { focus: 1, light: 1, grain: 0 } },
  { label: "Dim room", settings: { focus: 0, light: 0.38, grain: 0 } },
  { label: "Grainy", settings: { focus: 0, light: 1, grain: 22 } },
];

/** Draws a synthetic, clearly fake prescription onto a canvas. */
function drawSample(ctx: CanvasRenderingContext2D) {
  // A phone photo of paper is grey, not white; that leaves headroom for over-exposure.
  ctx.fillStyle = "#c9c6bf";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#d8d5ce";
  ctx.fillRect(18, 14, W - 36, H - 28);

  ctx.fillStyle = "#2a2d33";
  ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Sample Clinic", 34, 40);
  ctx.font = "400 10px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#555a63";
  ctx.fillText("Synthetic document for demonstration", 34, 55);

  ctx.strokeStyle = "#9a9da3";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(34, 66);
  ctx.lineTo(W - 34, 66);
  ctx.stroke();

  ctx.fillStyle = "#1d2026";
  ctx.font = "italic 700 26px Georgia, 'Times New Roman', serif";
  ctx.fillText("Rx", 34, 100);

  ctx.font = "400 12px Georgia, 'Times New Roman', serif";
  const lines = [
    "1.  Tab. Example 500 mg      1 - 0 - 1      5 days",
    "2.  Cap. Sample 250 mg        0 - 1 - 0      3 days",
    "3.  Syrup Demo 5 ml             0 - 0 - 1      7 days",
  ];
  lines.forEach((line, i) => ctx.fillText(line, 74, 96 + i * 22));

  ctx.strokeStyle = "#1d2026";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(W - 140, H - 46);
  ctx.bezierCurveTo(W - 120, H - 70, W - 104, H - 30, W - 86, H - 52);
  ctx.bezierCurveTo(W - 74, H - 66, W - 64, H - 40, W - 50, H - 50);
  ctx.stroke();
  ctx.font = "400 9px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#555a63";
  ctx.fillText("Signature", W - 128, H - 30);
}

export function QualityGateLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const base = useRef<{ gray: Gray; ref: Reference } | null>(null);
  const [settings, setSettings] = useState<Settings>(presets[0]!.settings);
  const [reading, setReading] = useState<GateReading | null>(null);

  // Draw the clean sample once and measure it as the reference.
  useEffect(() => {
    const scratch = document.createElement("canvas");
    scratch.width = W;
    scratch.height = H;
    const sctx = scratch.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;
    drawSample(sctx);
    const gray = rgbaToGray(sctx.getImageData(0, 0, W, H).data, W, H);
    base.current = { gray, ref: measureReference(gray) };
  }, []);

  // Re-render and re-score whenever a control moves. 360×240 pixels takes a few
  // milliseconds, so this runs directly rather than being deferred.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !base.current) return;
    const processed = addGrain(relight(blur(base.current.gray, settings.focus), settings.light), settings.grain);
    const image = ctx.createImageData(W, H);
    grayToRgba(processed, image.data);
    ctx.putImageData(image, 0, 0);
    setReading(scoreImage(processed, base.current.ref, THRESHOLDS));
  }, [settings]);

  const failing = reading
    ? [
        !reading.checks.sharpness && "too blurred",
        !reading.checks.brightness && (reading.brightness < THRESHOLDS.minBrightness ? "too dark" : "washed out"),
        !reading.checks.noise && "too noisy",
      ].filter(Boolean)
    : [];

  return (
    <div className="panel overflow-hidden">
      <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="border-b border-line p-5 sm:p-6 md:border-r md:border-b-0">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block aspect-[3/2] w-full rounded-lg border border-line bg-sunken"
            role="img"
            aria-label="A synthetic prescription, re-rendered with the blur, lighting and grain you choose."
          />
          <div
            aria-live="polite"
            className={cn(
              "mt-4 rounded-lg px-4 py-3 text-small",
              !reading ? "bg-sunken text-ink-2" : reading.pass ? "bg-pass-soft" : "bg-flag-soft",
            )}
          >
            {!reading ? (
              <p>Measuring the sample…</p>
            ) : reading.pass ? (
              <p>
                <span className="font-medium text-pass">Passes the gate.</span>{" "}
                <span className="text-ink">This scan would go on to OCR.</span>
              </p>
            ) : (
              <p>
                <span className="font-medium text-flag">Flagged before OCR.</span>{" "}
                <span className="text-ink">The scan is {joinWords(failing as string[])}.</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Presets">
            {presets.map((p) => {
              const active =
                p.settings.focus === settings.focus &&
                p.settings.light === settings.light &&
                p.settings.grain === settings.grain;
              return (
                <button
                  key={p.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSettings(p.settings)}
                  className={cn(
                    "chip cursor-pointer transition-colors duration-150 hover:border-line-strong",
                    active && "border-accent bg-accent-soft text-accent",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <Slider
            id="qg-focus"
            label="Blur"
            value={settings.focus}
            min={0}
            max={1.6}
            step={0.05}
            display={settings.focus === 0 ? "None" : `σ ${settings.focus.toFixed(2)} px`}
            onChange={(focus) => setSettings((s) => ({ ...s, focus }))}
          />
          <Slider
            id="qg-light"
            label="Lighting"
            value={settings.light}
            min={0.3}
            max={1.6}
            step={0.02}
            display={`${Math.round(settings.light * 100)}%`}
            onChange={(light) => setSettings((s) => ({ ...s, light }))}
          />
          <Slider
            id="qg-grain"
            label="Grain"
            value={settings.grain}
            min={0}
            max={30}
            step={1}
            display={settings.grain === 0 ? "None" : `σ ${settings.grain}`}
            onChange={(grain) => setSettings((s) => ({ ...s, grain }))}
          />

          {reading && (
            <dl className="grid gap-3 border-t border-line pt-5">
              <Meter
                label="Sharpness"
                hint="Laplacian variance, normalised for contrast, vs. the clean scan"
                value={reading.sharpness}
                max={1.6}
                text={`${Math.round(reading.sharpness * 100)}%`}
                ok={reading.checks.sharpness}
                band={[THRESHOLDS.minSharpness, 1.6]}
              />
              <Meter
                label="Brightness"
                hint="Mean intensity, 0 to 255"
                value={reading.brightness}
                max={255}
                text={reading.brightness.toFixed(0)}
                ok={reading.checks.brightness}
                band={[THRESHOLDS.minBrightness, THRESHOLDS.maxBrightness]}
              />
              <Meter
                label="Noise"
                hint="Extra σ above the clean scan (Immerkær estimate)"
                value={reading.extraNoise}
                max={30}
                text={reading.extraNoise.toFixed(1)}
                ok={reading.checks.noise}
                band={[0, THRESHOLDS.maxExtraNoise]}
              />
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function joinWords(words: string[]) {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-small font-medium">
          {label}
        </label>
        <output htmlFor={id} className="text-micro text-ink-2 tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 block w-full cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
}

/** A horizontal gauge with the acceptable band shaded. */
function Meter({
  label,
  hint,
  value,
  max,
  text,
  ok,
  band,
}: {
  label: string;
  hint: string;
  value: number;
  max: number;
  text: string;
  ok: boolean;
  band: [number, number];
}) {
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-small">
          {label}
          <span className="block text-micro text-ink-3">{hint}</span>
        </dt>
        <dd className={cn("shrink-0 text-small font-medium tabular-nums", ok ? "text-pass" : "text-flag")}>
          {text}
          <span className="sr-only">{ok ? ", within range" : ", out of range"}</span>
        </dd>
      </div>
      <div aria-hidden className="relative mt-2 h-1.5 rounded-full bg-sunken">
        <span
          className="absolute inset-y-0 rounded-full bg-pass-soft"
          style={{ left: pct(band[0]), width: `calc(${pct(band[1])} - ${pct(band[0])})` }}
        />
        <span
          className={cn(
            "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface transition-[left] duration-150",
            ok ? "bg-pass" : "bg-flag",
          )}
          style={{ left: pct(value) }}
        />
      </div>
    </div>
  );
}
