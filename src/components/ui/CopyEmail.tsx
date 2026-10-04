"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Copies the address and confirms in place; screen readers hear the confirmation. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={cn("btn btn-secondary", className)}>
      <Icon name={copied ? "check" : "copy"} size={16} className={copied ? "text-pass" : undefined} />
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
