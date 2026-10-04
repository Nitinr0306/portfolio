import type { Metric } from "@/content/types";
import { cn } from "@/lib/cn";

/** Figures from the project, each with the qualifier that keeps it honest. */
export function MetricRow({ metrics, className }: { metrics: Metric[]; className?: string }) {
  if (metrics.length === 0) return null;
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line",
        metrics.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
        className,
      )}
    >
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col bg-paper px-4 py-4">
          <dt className="order-2 mt-1 text-micro text-ink-2">
            {m.label}
            {m.context && <span className="block text-ink-3">{m.context}</span>}
          </dt>
          <dd className="order-1 text-h3 font-semibold tracking-[-0.03em] tabular-nums">{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}
