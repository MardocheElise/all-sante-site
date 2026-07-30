import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  Network,
  Fingerprint,
  Zap,
  Database,
  GitBranch,
  Bell,
  Lock,
  FileJson,
  Building2,
  Stethoscope,
  FlaskConical,
} from "lucide-react";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CodeBlock from "@/components/CodeBlock";

const flux = [
  {
    from: "SGCH",
    to: "DPI",
    icon: Building2,
    title: "Prise en charge",
    endpoint: "POST /interop/fhir/prise-en-charge",
    resources: "Patient + Invoice",
    desc: "Au règlement d'une fiche, le SGCH pousse un ressource FHIR vers le DPI, qui matérialise un patient en fonction de son format en base de donnée et la fiche réglée. Le patient entre alors dans la file d'attente infirmière.",
    color: "#38bdf8",
  },
  {
    from: "DPI",
    to: "OpenELIS",
    icon: Stethoscope,
    title: "Demande d'examen",
    endpoint: "POST /interop/fhir/demande-examen",
    resources: "Patient + ServiceRequest",
    desc: "À la finalisation d'une consultation, le DPI transmet les demandes d'examen à OpenELIS via un ressource FHIR, identifié par le matricule CMU du patient.",
    color: "#2dd4bf",
  },
  {
    from: "OpenELIS",
    to: "DPI",
    icon: FlaskConical,
    title: "Résultats d'examen",
    endpoint: "POST /interop/fhir/resultats",
    resources: "DiagnosticReport + Observation",
    desc: "Une fois les analyses validées, OpenELIS renvoie les résultats structurés au DPI. Le médecin prescripteur est notifié en temps réel Server-Sent Event (SSE).",
    color: "#a78bfa",
  },
];

const benefices = [
  {
    icon: Fingerprint,
    title: "Une identité, partout",
    desc: "Le matricule CMU (13 chiffres) est la seule clé qui relie toutes les bases. Aucune clé étrangère ne relie les differentes bases de données.",
  },
  {
    icon: Network,
    title: "Découplage total",
    desc: "Chaque logiciel garde sa propre base et son schéma. Les échanges passent exclusivement par FHIR jamais par un accès direct à une autre base.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité serveur-à-serveur",
    desc: "Les endpoints de l'api sont protégés par clé API (x-api-key), distincte de l'authentification des utilisateurs (JWT). Fermé par défaut.",
  },
  {
    icon: Zap,
    title: "Idempotence garantie",
    desc: "Le renvoi d'une même ressource ne crée pas de doublon. Les fiches et patients reecrit rn fonction du format du système sont réconciliés par référence unique.",
  },
  {
    icon: Bell,
    title: "Notifications temps réel",
    desc: "Chaque flux déclenche des notifications SSE ciblées : file d'attente infirmière, alerte au prescripteur dès la réception des résultats.",
  },
  {
    icon: Database,
    title: "Dépôt national",
    desc: "Chaque établissement pousse une copie de ses données clinique vers un dépôt central national et lit celles des autres établissements.",
  },
];

const stats = [
  { value: "3", label: "logiciels unifiés" },
  { value: "FHIR R4", label: "standard d'échange" },
  { value: "13", label: "chiffres clé CMU" },
  { value: "0", label: "FK cross-base" },
];

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 glow" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="fade-up mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--panel)] px-4 py-1.5 text-xs font-medium text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
              Middleware d&apos;interopérabilité FHIR
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-6xl">
              Un système de santé
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)] bg-clip-text text-transparent">
                qui parle d&apos;une seule voix
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]">
              <strong className="text-[var(--text)]">All_Santé </strong> unifie les logiciels
              du système d'information Hospitalier SIH. Dans cette documentation on utilisera que trois logiciels du système SGCH, DPI et OpenELIS.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-[#04121a] shadow-[0_0_30px_var(--accent-glow)] transition-transform hover:scale-[1.02]"
              >
                Lire la documentation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#architecture"
                className="rounded-xl border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)]"
              >
                Voir l&apos;architecture
              </a>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[var(--panel)] px-5 py-6 text-center">
                <div className="font-mono text-2xl font-semibold text-[var(--accent)]">{s.value}</div>
                <div className="mt-1 text-xs text-[var(--text-dim)]">{s.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ---------- ARCHITECTURE ---------- */}
      <section id="architecture" className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
              Architecture d&apos;interopérabilité
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Trois logiciels métier autonomes, chacun avec sa base de donnée et sa logique fonctionnelle, unifiés par l'API All_Santé qui a envoie les donné clinique du patient au serveur Net raccordés à un dépôt national central.
            </p>
          </div>
          <div className="mt-12">
            <ArchitectureDiagram />
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: GitBranch, t: "Autonomie", d: "Chaque app garde sa base et son schéma Prisma." },
              { icon: FileJson, t: "FHIR partout", d: "Les liens inter-apps voyagent en ressources FHIR." },
              { icon: Lock, t: "Zéro FK cross-base", d: "L'identité patient tient au seul matricule CMU." },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
                <c.icon className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="mt-3 text-sm font-semibold text-[var(--text)]">{c.t}</h3>
                <p className="mt-1 text-sm text-[var(--text-dim)]">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FLUX FHIR ---------- */}
      <section id="flux" className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
              Trois flux, un parcours patient
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Chaque système est rattaché à l&apos;API centrale <strong className="text-[var(--text)]">All_Santé</strong>.
              De l&apos;admission au résultat d&apos;analyse, les échanges transitent par elle en FHIR,
              dans les deux sens et sans accès direct d&apos;une base à l&apos;autre.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {flux.map((f) => (
              <div
                key={f.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 transition-colors hover:border-[var(--border-strong)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 opacity-70"
                  style={{ background: f.color }}
                />
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                  <span className="rounded-md bg-[var(--panel-2)] px-2 py-1 text-[var(--text-muted)]">
                    {f.from}
                  </span>
                  <ArrowLeftRight className="h-3.5 w-3.5" style={{ color: f.color }} />
                  <span className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent-glow)] px-2 py-1 font-semibold text-[var(--accent)]">
                    All_Santé
                  </span>
                  <ArrowLeftRight className="h-3.5 w-3.5" style={{ color: f.color }} />
                  <span className="rounded-md bg-[var(--panel-2)] px-2 py-1 text-[var(--text-muted)]">
                    {f.to}
                  </span>
                </div>
                <h3 className="mt-4 flex items-center gap-2 text-lg font-semibold text-[var(--text)]">
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {f.desc}
                </p>
                <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
                  <code className="block break-all font-mono text-xs text-[var(--accent)]">
                    {f.endpoint}
                  </code>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--panel-2)] px-2 py-1 font-mono text-[11px] text-[var(--text-dim)]">
                    <FileJson className="h-3 w-3" /> {f.resources}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <p className="mb-3 text-center text-sm text-[var(--text-dim)]">
              Un appel type, authentifié par clé API serveur-à-serveur&nbsp;:
            </p>
            <CodeBlock
              label="cURL"
              code={`curl -X POST https://dpi.sante.ci/interop/fhir/prise-en-charge \\
  -H "Content-Type: application/fhir+json" \\
  -H "x-api-key: $ALL_SANTE_API_KEY" \\
  -d @ressource-prise-en-charge.json`}
            />
          </div>
        </div>
      </section>

      {/* ---------- BENEFICES ---------- */}
      <section id="benefices" className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
              Conçu pour un SIH réel
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Les choix d&apos;architecture répondent aux contraintes d&apos;un système hospitalier
              multi-service : sécurité, traçabilité, résilience.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefices.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 transition-colors hover:border-[var(--border-strong)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-glow)]">
                  <b.icon className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-[var(--text)]">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 glow" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Prêt à intégrer All_Santé&nbsp;?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
            Endpoints, authentification, exemples de ressources FHIR et codes d&apos;erreur tout est
            dans la documentation.
          </p>
          <Link
            href="/docs"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-7 py-3.5 text-sm font-semibold text-[#04121a] shadow-[0_0_30px_var(--accent-glow)] transition-transform hover:scale-[1.02]"
          >
            Ouvrir la documentation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
