"use client";

import { Icon } from "@/components/ui/Icon";

/**
 * Both icons are rendered; CSS shows the one that matches the current theme, so the
 * server and client markup are identical and there is no flash or hydration warning.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: the choice lasts for this page view only */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`icon-btn theme-toggle ${className}`}
      aria-label="Switch colour theme"
      title="Switch colour theme"
    >
      <Icon name="moon" className="theme-icon-moon" />
      <Icon name="sun" className="theme-icon-sun" />
    </button>
  );
}

/** Runs before first paint: stored choice wins, otherwise follow the OS. */
export const themeScript = `(function(){try{var d=document.documentElement,s=localStorage.getItem('theme'),m=window.matchMedia('(prefers-color-scheme: dark)');d.dataset.theme=s||(m.matches?'dark':'light');if(!s){m.addEventListener('change',function(e){if(!localStorage.getItem('theme'))d.dataset.theme=e.matches?'dark':'light'})}}catch(e){}})();`;
