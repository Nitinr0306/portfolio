"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; label: string };

/**
 * A segmented choice built on native radio inputs, so arrow keys, focus and screen
 * reader semantics come from the browser rather than custom code.
 */
export function Segmented<T extends string>({
  legend,
  legendVisible = false,
  options,
  value,
  onChange,
  className,
}: {
  legend: string;
  legendVisible?: boolean;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const name = useId();
  return (
    <fieldset className={className}>
      <legend className={legendVisible ? "mb-2 text-small font-medium" : "sr-only"}>{legend}</legend>
      <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-line bg-sunken p-1 sm:inline-flex sm:w-auto sm:max-w-full sm:flex-wrap">
        {options.map((o) => (
          <label key={o.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex h-full items-center justify-center rounded-lg px-3 py-2 text-center text-small leading-snug transition-[background-color,color,box-shadow] duration-150 sm:block sm:text-left sm:whitespace-nowrap",
                "text-ink-2 hover:text-ink",
                "peer-checked:bg-raised peer-checked:font-medium peer-checked:text-ink peer-checked:shadow-[0_1px_2px_rgb(20_26_38/0.1),0_0_0_1px_var(--line-strong)]",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
