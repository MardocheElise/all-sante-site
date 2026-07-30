"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponible */
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#070a10]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-4 py-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
          {label && (
            <span className="ml-2 font-mono text-xs text-[var(--text-dim)]">{label}</span>
          )}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--text-dim)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--text)]"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[var(--success)]" /> Copié
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copier
            </>
          )}
        </button>
      </div>
      <pre className="codeblock rounded-none border-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}
