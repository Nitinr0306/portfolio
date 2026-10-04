"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { Icon } from "@/components/ui/Icon";
import { useStepper } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const stages = [
  { id: "upload", service: "Next.js 14", title: "Upload", detail: "The typed frontend sends the files to the API." },
  {
    id: "validate",
    service: "Spring Boot 3",
    title: "Validate",
    detail: "5-file cap, 10 MB per file, MIME-type allowlist.",
  },
  {
    id: "store",
    service: "Spring Boot 3",
    title: "Store",
    detail: "Stored under a UUID-based name.",
  },
  {
    id: "gate",
    service: "Quality gate",
    title: "Score quality",
    detail: "Blur (Laplacian variance), brightness and noise.",
  },
  {
    id: "process",
    service: "Python FastAPI",
    title: "Process",
    detail: "One of 10 selectable CV operations runs, such as OCR or CLAHE enhancement.",
  },
] as const;

type ScenarioId = "clear" | "blurry" | "type" | "count";

type Scenario = { label: string; stopAt: number | null; stopLabel?: string; outcome: string; verdict: string };

const scenarios: Record<ScenarioId, Scenario> = {
  clear: {
    label: "Clear scan",
    stopAt: null,
    outcome: "Processed.",
    verdict: "Every check passes and the selected operation runs.",
  },
  blurry: {
    label: "Blurry phone photo",
    stopAt: 3,
    stopLabel: "Flagged",
    outcome: "Flagged before OCR.",
    verdict:
      "Validation passes, but the quality gate scores the scan as unusable and auto-flags it before the OCR pipelines run. Auto-flagging unusable uploads reduced wasted processing by 60%.",
  },
  type: {
    label: "Unsupported file type",
    stopAt: 1,
    stopLabel: "Rejected",
    outcome: "Rejected at validation.",
    verdict: "The MIME type isn't on the allowlist, so the Spring Boot validation layer rejects the upload.",
  },
  count: {
    label: "Six files at once",
    stopAt: 1,
    stopLabel: "Rejected",
    outcome: "Rejected at validation.",
    verdict: "The request is over the 5-file cap, so the Spring Boot validation layer rejects it.",
  },
};

const scenarioOptions = (Object.keys(scenarios) as ScenarioId[]).map((id) => ({
  value: id,
  label: scenarios[id].label,
}));

type Status = "pass" | "flag" | "skip" | "active" | "waiting";

export function MedVisionPipeline() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("clear");
  const { position, running, run } = useStepper(420);
  const scenario = scenarios[scenarioId];
  const stopIdx = scenario.stopAt ?? Number.POSITIVE_INFINITY;
  const last = Math.min(stopIdx, stages.length - 1);
  const complete = position > last;

  function statusOf(i: number): Status {
    if (i > stopIdx) return position > stopIdx ? "skip" : "waiting";
    if (i < position) return i === stopIdx ? "flag" : "pass";
    if (i === position) return "active";
    return "waiting";
  }

  function choose(id: ScenarioId) {
    setScenarioId(id);
    run(Math.min(scenarios[id].stopAt ?? Number.POSITIVE_INFINITY, stages.length - 1));
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <Segmented legend="Choose what gets uploaded" options={scenarioOptions} value={scenarioId} onChange={choose} />
        <button
          type="button"
          className="btn btn-quiet self-start sm:self-auto"
          onClick={() => run(last)}
          disabled={running}
        >
          Replay
        </button>
      </div>

      <ol className="grid gap-0 p-5 sm:p-6 md:grid-cols-5 md:gap-3">
        {stages.map((s, i) => {
          const status = statusOf(i);
          return (
            <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0 md:flex-col md:gap-3 md:pb-0">
              {i < stages.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-8 -bottom-0 left-[15px] w-px md:top-[15px] md:right-auto md:bottom-auto md:left-8 md:h-px md:w-[calc(100%-2rem+0.75rem)]",
                    "transition-colors duration-300",
                    // Exactly one background treatment, so no two utilities compete.
                    statusOf(i + 1) === "skip"
                      ? "border-dashed border-line-strong border-l md:border-t md:border-l-0"
                      : status === "pass"
                        ? "bg-pass"
                        : "bg-line-strong",
                  )}
                />
              )}
              <StatusNode status={status} index={i} />
              <div className="min-w-0 pt-0.5 md:pt-0">
                <p className="text-micro text-ink-3">{s.service}</p>
                <p className="mt-0.5 font-medium">{s.title}</p>
                <p className="mt-1 text-micro text-ink-2">{s.detail}</p>
                <p
                  className={cn(
                    "mt-2 text-micro font-medium",
                    status === "pass" && "text-pass",
                    status === "flag" && "text-flag",
                    (status === "skip" || status === "waiting") && "text-ink-3",
                    status === "active" && "text-accent",
                  )}
                >
                  {status === "flag" ? (scenario.stopLabel ?? statusLabel.flag) : statusLabel[status]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className={cn(
          "border-t border-line px-5 py-4 text-small sm:px-6",
          complete && scenario.stopAt !== null ? "bg-flag-soft" : complete ? "bg-pass-soft" : "bg-sunken",
        )}
        aria-live="polite"
      >
        {complete ? (
          <p className="text-ink">
            <span className={cn("font-medium", scenario.stopAt !== null ? "text-flag" : "text-pass")}>
              {scenario.outcome}
            </span>{" "}
            {scenario.verdict}
          </p>
        ) : (
          <p className="text-ink-2">Following the upload through the pipeline…</p>
        )}
      </div>
    </div>
  );
}

const statusLabel: Record<Status, string> = {
  pass: "Passed",
  flag: "Stopped",
  skip: "Skipped",
  active: "Checking…",
  waiting: "Waiting",
};

function StatusNode({ status, index }: { status: Status; index: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-micro font-medium transition-[background-color,border-color,color,box-shadow] duration-200",
        status === "pass" && "border-pass bg-pass-soft text-pass",
        status === "flag" && "border-flag bg-flag-soft text-flag",
        status === "active" && "border-accent bg-accent-soft text-accent shadow-[0_0_0_4px_var(--accent-soft)]",
        status === "waiting" && "border-line-strong bg-surface text-ink-3",
        status === "skip" && "border-dashed border-line-strong bg-surface text-ink-3",
      )}
    >
      {status === "pass" ? (
        <Icon name="check" size={15} />
      ) : status === "flag" ? (
        <Icon name="close" size={14} />
      ) : (
        index + 1
      )}
    </span>
  );
}
