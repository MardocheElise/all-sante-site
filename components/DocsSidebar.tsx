"use client";

import { useEffect, useState } from "react";

const sections = [
  {
    group: "Démarrage",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "concepts", label: "Concepts clés" },
      { id: "base-url", label: "URL de base & ports" },
    ],
  },
  {
    group: "Sécurité",
    items: [
      { id: "authentification", label: "Authentification" },
      { id: "erreurs", label: "Codes d'erreur" },
    ],
  },
  {
    group: "Endpoints",
    items: [
      { id: "endpoints", label: "Vue d'ensemble" },
      { id: "prise-en-charge", label: "Prise en charge" },
      { id: "demande-examen", label: "Demande d'examen" },
      { id: "resultats", label: "Résultats" },
    ],
  },
  {
    group: "Ressources FHIR",
    items: [
      { id: "bundle", label: "Bundle & identifiants" },
      { id: "idempotence", label: "Idempotence" },
    ],
  },
];

export default function DocsSidebar() {
  const [active, setActive] = useState("introduction");

  useEffect(() => {
    const ids = sections.flatMap((s) => s.items.map((i) => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="space-y-6">
      {sections.map((s) => (
        <div key={s.group}>
          <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            {s.group}
          </h4>
          <ul className="space-y-0.5">
            {s.items.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active === i.id
                      ? "bg-[var(--accent-glow)] font-medium text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--panel)] hover:text-[var(--text)]"
                  }`}
                >
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
