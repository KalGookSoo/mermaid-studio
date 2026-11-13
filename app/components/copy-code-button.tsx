"use client";

import { useState } from "react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return <button className="rounded-lg border border-emerald-100/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-emerald-100 transition hover:bg-white/10" onClick={copy}>{copied ? "COPIED" : "COPY CODE"}</button>;
}
