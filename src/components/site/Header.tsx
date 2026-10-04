"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { profile } from "@/content/profile";
import { nav } from "@/lib/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  if (href === "/#work") return pathname.startsWith("/work");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Hairline + solid background once the page has scrolled.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // While the menu is open: lock scroll, trap focus inside the header, Escape closes.
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    header?.querySelector<HTMLElement>("[data-menu-first]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !header) return;
      const focusables = Array.from(
        header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Collapse the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "no-print sticky top-0 z-50 transition-[background-color,border-color] duration-200",
        "border-b",
        scrolled || open ? "border-line bg-paper" : "border-transparent bg-paper/0",
      )}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link
          href="/"
          className="group -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 font-semibold tracking-[-0.01em]"
          aria-label={`${profile.name}, home`}
        >
          <Mark />
          <span>{profile.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-small transition-colors duration-150",
                      active ? "text-ink" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span aria-hidden className="absolute inset-x-3 -bottom-[1px] h-px bg-accent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[var(--header-h)] bottom-0 overflow-y-auto border-t border-line bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex min-h-full flex-col justify-between py-6">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  data-menu-first={i === 0 ? "" : undefined}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={() => close(false)}
                  className="flex min-h-14 items-center text-h4 font-medium tracking-[-0.015em]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-3 text-small text-ink-2">
            <a className="link block w-fit" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="flex gap-5">
              <a className="link" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a className="link" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

/** The mark: a short rail, three stations, the last one lit. Same glyph as the favicon. */
function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
      <rect width="26" height="26" rx="7" className="fill-ink" />
      <path d="M6 13h14" className="stroke-paper" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7" cy="13" r="2" className="fill-paper" />
      <circle cx="13" cy="13" r="2" className="fill-paper" />
      <circle cx="19" cy="13" r="2.6" style={{ fill: "var(--mark-dot)" }} />
    </svg>
  );
}
