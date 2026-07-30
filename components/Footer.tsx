import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]">
                <Activity className="h-4 w-4 text-[#04121a]" strokeWidth={2.5} />
              </span>
              <span className="font-semibold text-[var(--text)]">
                All<span className="text-[var(--accent)]">_</span>Santé
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">
              API d&apos;interopérabilité pour le système d&apos;information
              hospitalier.Le nemero CMU du patient est utilisé par API pour relier les differents logiciels.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Produit
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#architecture" className="text-[var(--text-muted)] hover:text-[var(--accent)]">Architecture</Link></li>
                <li><Link href="/#flux" className="text-[var(--text-muted)] hover:text-[var(--accent)]">Flux FHIR</Link></li>
                <li><Link href="/#benefices" className="text-[var(--text-muted)] hover:text-[var(--accent)]">Bénéfices</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Développeurs
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/docs" className="text-[var(--text-muted)] hover:text-[var(--accent)]">Documentation</Link></li>
                <li><Link href="/docs#authentification" className="text-[var(--text-muted)] hover:text-[var(--accent)]">Authentification</Link></li>
                <li><Link href="/docs#endpoints" className="text-[var(--text-muted)] hover:text-[var(--accent)]">Endpoints</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Ressources
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://hl7.org/fhir/" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)]">HL7 FHIR R4</a></li>
                <li><a href="https://build.fhir.org/ig/HL7/fhir-ips/" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--accent)]">FHIR IPS</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-dim)] sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} All_Santé Projet de stage KRA Mardochée</span>
        </div>
      </div>
    </footer>
  );
}
