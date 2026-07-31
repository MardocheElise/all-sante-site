"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, Github, Menu, X } from "lucide-react";

const links = [
  { href: "/#architecture", label: "Architecture" },
  { href: "/#flux", label: "Flux FHIR" },
  { href: "/#benefices", label: "Bénéfices" },
  { href: "/docs", label: "Documentation" },
  { href: "/portail", label: "Portail" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-[0_0_20px_var(--accent-glow)]">
            <Activity className="h-5 w-5 text-[#04121a]" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
            All<span className="text-[var(--accent)]">_</span>Santé
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--panel)] hover:text-[var(--text)]"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/MardocheElise/allSante-api"
            target="_blank"
            rel="noreferrer"
            className="ml-2 flex items-center gap-2 rounded-lg border border-[var(--border-strong)] px-3.5 py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <Github className="h-4 w-4" /> Code
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-[var(--text-muted)] md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
