"use client";

import { Icon } from "@/components/ui/Icon";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-quiet">
      <Icon name="printer" size={16} />
      Print this page
    </button>
  );
}
