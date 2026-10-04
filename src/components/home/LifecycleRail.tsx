"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { LifecycleStage } from "@/content/types";
import { cn } from "@/lib/cn";

type Props = {
  stages: LifecycleStage[];
  projectNames: Record<string, string>;
};

/**
 * "Schema to deploy" rail. Seven stages as an ARIA tablist: arrow keys move between
 * stages, the panel shows where each stage appears in real work. The connecting line
 * draws once on load — the only motion on the page that isn't triggered by the visitor.
 */
export function LifecycleRail({ stages, projectNames }: Props) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const stage = stages[selected]!;

  function focusTab(index: number) {
    const next = (index + stages.length) % stages.length;
    setSelected(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(selected + 1),
      ArrowDown: () => focusTab(selected + 1),
      ArrowLeft: () => focusTab(selected - 1),
      ArrowUp: () => focusTab(selected - 1),
      Home: () => focusTab(0),
      End: () => focusTab(stages.length - 1),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  }

  return (
    <div className="rail">
      <div
        role="tablist"
        aria-label="Stages of the software lifecycle I work across"
        className="relative grid gap-0 md:grid-cols-7 md:gap-3"
      >
        {stages.map((s, i) => {
          const active = i === selected;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${s.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel`}
              aria-labelledby={`${baseId}-verb-${s.id}`}
              aria-describedby={`${baseId}-tools-${s.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelected(i)}
              onKeyDown={onKeyDown}
              className={cn(
                "group relative flex gap-4 py-2.5 text-left md:flex-col md:gap-3 md:py-0",
                "rounded-md focus-visible:outline-offset-4",
              )}
            >
              {i < stages.length - 1 && (
                /* Segment to the next station: vertical on small screens, horizontal from md up. */
                <span
                  aria-hidden
                  className="rail-seg absolute top-[24px] -bottom-[24px] left-[7px] w-px bg-line-strong md:top-[7px] md:bottom-auto md:left-[7.5px] md:h-px md:w-[calc(100%+0.75rem)]"
                  style={{ animationDelay: `${220 + i * 140}ms` }}
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "rail-node relative z-10 mt-1.5 grid size-[15px] shrink-0 place-items-center rounded-full border-[1.5px] transition-[background-color,border-color,box-shadow] duration-200 md:mt-0",
                  active
                    ? "border-accent bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"
                    : "border-line-strong bg-paper group-hover:border-ink-2",
                )}
                style={{ animationDelay: `${120 + i * 140}ms` }}
              />
              <span className="rail-label min-w-0" style={{ animationDelay: `${180 + i * 140}ms` }}>
                <span
                  id={`${baseId}-verb-${s.id}`}
                  className={cn(
                    "block text-small font-medium transition-colors duration-150",
                    active ? "text-ink" : "text-ink-2 group-hover:text-ink",
                  )}
                >
                  {s.verb}
                </span>
                <span id={`${baseId}-tools-${s.id}`} className="mt-0.5 block text-micro text-ink-3 md:mt-1">
                  {s.tools.join(", ")}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${stage.id}`}
        className="mt-6 border-t border-line pt-5 md:mt-8"
      >
        <div key={stage.id} className="rail-panel grid gap-3 md:grid-cols-[11rem_1fr] md:gap-8">
          <p className="text-small text-ink-3">Where it shows up</p>
          <ul className="space-y-2">
            {stage.proof.map((p) => (
              <li key={p.project + p.note} className="text-small text-ink-2">
                <Link href={`/work/${p.project}`} className="link-accent mr-2">
                  {projectNames[p.project]}
                </Link>
                {p.note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
