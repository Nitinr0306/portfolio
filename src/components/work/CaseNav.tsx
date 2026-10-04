"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** "On this page" navigation that tracks the section currently in view. */
export function CaseNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // Of the sections inside the reading band, the one nearest the top wins.
        // Positions are measured now, not taken from the (possibly stale) entries.
        let best: string | undefined;
        let bestTop = Infinity;
        for (const id of visible) {
          const top = document.getElementById(id)?.getBoundingClientRect().top ?? Infinity;
          if (top < bestTop) {
            bestTop = top;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+2rem)]">
      <p className="text-micro text-ink-3">On this page</p>
      <ul className="mt-3 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 text-small transition-colors duration-150",
                active === item.id
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-3 hover:border-line-strong hover:text-ink",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
