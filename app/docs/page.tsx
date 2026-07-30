import type { Metadata } from "next";
import DocsSidebar from "@/components/DocsSidebar";
import CodeBlock from "@/components/CodeBlock";
import { Info, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Référence de l'API d'interopérabilité FHIR All_Santé : authentification, endpoints, Bundles et codes d'erreur.",
};

function Method({ verb }: { verb: string }) {
  const colors: Record<string, string> = {
    POST: "bg-[#2dd4bf]/15 text-[#2dd4bf] border-[#2dd4bf]/30",
    GET: "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30",
    PUT: "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30",
    DELETE: "bg-[#f87171]/15 text-[#f87171] border-[#f87171]/30",
  };
  return (
    <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${colors[verb] ?? ""}`}>
      {verb}
    </span>
  );
}

function EndpointHeader({ verb, path }: { verb: string; path: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3">
      <Method verb={verb} />
      <code className="break-all font-mono text-sm text-[var(--text)]">{path}</code>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto py-10 lg:block">
          <DocsSidebar />
        </aside>

        {/* Contenu */}
        <article className="min-w-0 flex-1 py-10">
          <div className="prose-doc max-w-3xl space-y-16">
            {/* INTRO */}
            <section id="introduction" className="prose-anchor scroll-mt-24">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
                Documentation API
              </span>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)]">
                Plateforme d&apos;interopérabilité FHIR
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-[var(--text-muted)]">
                All_Santé est une API  qui fait dialoguer les logiciels d&apos;un
                SIH : <strong className="text-[var(--text)]">SGCH</strong> (administratif),{" "}
                <strong className="text-[var(--text)]">DPI</strong> (clinique) et{" "}
                <strong className="text-[var(--text)]">OpenELIS</strong> (laboratoire) etc... et les
                raccorde à un dépôt national. Tous les échanges se font en  <strong className="text-[var(--text)]">ressources
                FHIR </strong> transmis en HTTP, authentifiés par clé API.
              </p>
              {/* <div className="mt-6 flex gap-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-glow)] p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <p className="text-sm text-[var(--text-muted)]">
                  L&apos;interopérabilité ne partage jamais de base de données. Chaque logiciel
                  expose et consomme du FHIR ; l&apos;identité patient tient au seul{" "}
                  <strong className="text-[var(--text)]">matricule CMU</strong>.
                </p>
              </div> */}
            </section>

            {/* CONCEPTS */}
            <section id="concepts" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Concepts clés</h2>
              <dl className="mt-6 space-y-4">
                {[
                  ["Matricule CMU", "Numéro à 13 chiffres. Clé pivot unique utilisé par l'APi pour identifier le patient entre les differents systèmes."],
                  ["Patient reconstruit", "Chaque application maintient une copie réduite de l'identité patient (identifiée par le CMU), créée/actualisée à la réception d'une ressource FHIR."],
                  ["Bundle FHIR", "Conteneur d'un échange : un ensemble de ressources (Patient, Invoice, ServiceRequest, DiagnosticReport, Observation) transmis en un seul appel."],
                  ["Passerelle d'interop", "Le module `interop` implementer au  iveau de chaque système: il valide, extrait et matérialise les ressources reçues, puis déclenche les notifications métier."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <dt className="font-mono text-sm font-semibold text-[var(--accent)]">{t}</dt>
                    <dd className="mt-1 text-sm text-[var(--text-muted)]">{d}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* BASE URL */}
            <section id="base-url" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                URL de base &amp; ports
              </h2>
              <p className="mt-4 text-[var(--text-muted)]">
                L&apos;API centrale <strong className="text-[var(--text)]">All_Santé</strong> est le
                point d&apos;entrée unique de l&apos;interopérabilité&nbsp;; chaque système s&apos;y
                rattache et échange avec elle dans les deux sens. En développement, les services
                tournent en local&nbsp;:
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--panel-2)] text-left text-[var(--text-dim)]">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Logiciel</th>
                      <th className="px-4 py-2.5 font-medium">Base URL (dev)</th>
                      <th className="px-4 py-2.5 font-medium">Production</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] font-mono text-xs text-[var(--text-muted)]">
                    <tr className="bg-[var(--accent-glow)]"><td className="px-4 py-2.5 font-semibold text-[var(--accent)]">All_Santé (API centrale)</td><td className="px-4 py-2.5">http://localhost:3050</td><td className="px-4 py-2.5">https://api.all-sante.ci</td></tr>
                    <tr><td className="px-4 py-2.5 text-[var(--text)]">SGCH</td><td className="px-4 py-2.5">http://localhost:3011</td><td className="px-4 py-2.5">https://sgch.sante.ci</td></tr>
                    <tr><td className="px-4 py-2.5 text-[var(--text)]">DPI</td><td className="px-4 py-2.5">http://localhost:3001</td><td className="px-4 py-2.5">https://dpi.sante.ci</td></tr>
                    <tr><td className="px-4 py-2.5 text-[var(--text)]">OpenELIS</td><td className="px-4 py-2.5">http://localhost:3021</td><td className="px-4 py-2.5">https://openelis.sante.ci</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[var(--text-dim)]">
                Toutes les requêtes d&apos;interop utilisent l&apos;en-tête{" "}
                <code className="inline">Content-Type: application/fhir+json</code>.
              </p>
            </section>

            {/* AUTH */}
            <section id="authentification" className="prose-anchor scroll-mt-24">
              <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
                <KeyRound className="h-6 w-6 text-[var(--accent)]" /> Authentification
              </h2>
              <p className="mt-4 text-[var(--text-muted)]">
                Les endpoints d&apos;interop sont des échanges <strong className="text-[var(--text)]">machine à
                machine</strong>. il utilisent une clé API
                partagée, transmise dans l&apos;en-tête <code className="inline">x-api-key</code>. Une
                garde <code className="inline">ApiKeyGuard</code> rejette toute requête sans clé
                valide.
              </p>
              <div className="mt-6">
                <CodeBlock
                  label="En-têtes requis"
                  code={`Content-Type: application/fhir+json
x-api-key: <ALL_SANTE_API_KEY>`}
                />
              </div>
              {/* <div className="mt-6 flex gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--warning)]" />
                <p className="text-sm text-[var(--text-muted)]">
                  La clé API est un secret serveur. Ne l&apos;exposez jamais côté navigateur ni dans
                  un dépôt git. Stockez-la en variable d&apos;environnement
                  (<code className="inline">ALL_SANTE_API_KEY</code>) et faites-la tourner
                  régulièrement.
                </p>
              </div> */}
            </section>

            {/* ERREURS */}
            <section id="erreurs" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Codes d&apos;erreur</h2>
              <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--panel-2)] text-left text-[var(--text-dim)]">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Code</th>
                      <th className="px-4 py-2.5 font-medium">Signification</th>
                      <th className="px-4 py-2.5 font-medium">Cause typique</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[var(--text-muted)]">
                    {[
                      ["200", "OK", "Bundle reçu et matérialisé (idempotent)."],
                      ["400", "Bad Request", "Payload invalide, matricule CMU absent ou consentement manquant."],
                      ["401", "Unauthorized", "En-tête x-api-key manquant ou invalide."],
                      ["404", "Not Found", "Patient ou consultation introuvable au dépôt national."],
                      ["422", "Unprocessable", "Ressource attendue absente du Bundle."],
                      ["500", "Server Error", "Erreur interne lors de la matérialisation."],
                    ].map(([c, s, d]) => (
                      <tr key={c}>
                        <td className="px-4 py-2.5 font-mono text-[var(--accent)]">{c}</td>
                        <td className="px-4 py-2.5 font-medium text-[var(--text)]">{s}</td>
                        <td className="px-4 py-2.5">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ENDPOINTS OVERVIEW */}
            <section id="endpoints" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Endpoints vue d&apos;ensemble
              </h2>
              <p className="mt-4 text-[var(--text-muted)]">
                Les systèmes ne se parlent jamais directement&nbsp;: ils sont rattachés à l&apos;API
                centrale <strong className="text-[var(--text)]">All_Santé</strong>, qui reçoit et relaie
                les ressources FHIR dans les deux sens. Trois points d&apos;entrée couvrent le parcours
                patient, de l&apos;admission au résultat d&apos;analyse.
              </p>
              <div className="mt-5 space-y-2">
                {[
                  ["POST", "/interop/fhir/prise-en-charge", "SGCH ⇄ All_Santé ⇄ DPI", "#prise-en-charge"],
                  ["POST", "/interop/fhir/demande-examen", "DPI ⇄ All_Santé ⇄ OpenELIS", "#demande-examen"],
                  ["POST", "/interop/fhir/resultats", "OpenELIS ⇄ All_Santé ⇄ DPI", "#resultats"],
                ].map(([v, p, flow, href]) => (
                  <a
                    key={p}
                    href={href}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 transition-colors hover:border-[var(--accent)]"
                  >
                    <Method verb={v} />
                    <code className="flex-1 break-all font-mono text-sm text-[var(--text)]">{p}</code>
                    <span className="font-mono text-xs text-[var(--text-dim)]">{flow}</span>
                    <ArrowRight className="h-4 w-4 text-[var(--text-dim)]" />
                  </a>
                ))}
              </div>
            </section>

            {/* PRISE EN CHARGE */}
            <section id="prise-en-charge" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Réception d&apos;une prise en charge
              </h2>
              <p className="mt-2 font-mono text-xs text-[var(--text-dim)]">SGCH → DPI</p>
              <div className="mt-4">
                <EndpointHeader verb="POST" path="https://dpi.sante.ci/interop/fhir/prise-en-charge" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Au règlement d&apos;une fiche de paiement, le SGCH pousse un Bundle{" "}
                <code className="inline">Patient</code> + <code className="inline">Invoice</code>.
                Le DPI matérialise un patient selon son format de donnée (clé CMU) et la fiche réglée, puis notifie
                l&apos;infirmerie qu&apos;un patient entre dans la file d&apos;attente.
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Corps de la requête
              </h3>
              <div className="mt-3">
                <CodeBlock
                  label="bundle-prise-en-charge.json"
                  code={`{
  "resourceType": "Bundle",
  "type": "message",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "identifier": [
          {
            "system": "https://cmu.sante.ci/matricule",
            "value": "1234567890123"
          }
        ],
        "name": [{ "family": "KOUADIO", "given": ["Awa"] }],
        "gender": "female",
        "birthDate": "1990-04-12"
      }
    },
    {
      "resource": {
        "resourceType": "Invoice",
        "status": "balanced",
        "identifier": [
          { "system": "https://sgch.sante.ci/fiche", "value": "FP-2026-004821" }
        ],
        "subject": {
          "identifier": {
            "system": "https://cmu.sante.ci/matricule",
            "value": "1234567890123"
          }
        },
        "totalGross": { "value": 15000, "currency": "XOF" }
      }
    }
  ]
}`}
                />
              </div>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Réponse — 200 OK
              </h3>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "recu": true,
  "matriculeCMU": "1234567890123",
  "fiche": "FP-2026-004821",
  "patientMiroir": "cree"
}`}
                />
              </div>
            </section>

            {/* DEMANDE EXAMEN */}
            <section id="demande-examen" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Transmission d&apos;une demande d&apos;examen
              </h2>
              <p className="mt-2 font-mono text-xs text-[var(--text-dim)]">DPI → OpenELIS</p>
              <div className="mt-4">
                <EndpointHeader verb="POST" path="https://openelis.sante.ci/interop/fhir/demande-examen" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                À la finalisation d&apos;une consultation, le DPI transmet les examens prescrits à
                OpenELIS via un Bundle <code className="inline">Patient</code> +{" "}
                <code className="inline">ServiceRequest</code>. Chaque demande porte un identifiant
                partagé qui servira à rattacher les résultats.
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Corps de la requête
              </h3>
              <div className="mt-3">
                <CodeBlock
                  label="bundle-demande-examen.json"
                  code={`{
  "resourceType": "Bundle",
  "type": "message",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "identifier": [
          { "system": "https://cmu.sante.ci/matricule", "value": "1234567890123" }
        ]
      }
    },
    {
      "resource": {
        "resourceType": "ServiceRequest",
        "status": "active",
        "intent": "order",
        "identifier": [
          {
            "system": "https://dpi.sante.ci/demande-examen/numero",
            "value": "DEM-2026-1177"
          }
        ],
        "subject": {
          "identifier": {
            "system": "https://cmu.sante.ci/matricule",
            "value": "1234567890123"
          }
        },
        "code": {
          "coding": [
            { "system": "http://loinc.org", "code": "58410-2", "display": "Hémogramme (NFS)" }
          ]
        }
      }
    }
  ]
}`}
                />
              </div>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Réponse — 200 OK
              </h3>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "recu": true,
  "matriculeCMU": "1234567890123",
  "demandes": ["DEM-2026-1177"],
  "nombre": 1
}`}
                />
              </div>
            </section>

            {/* RESULTATS */}
            <section id="resultats" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Réception des résultats d&apos;examen
              </h2>
              <p className="mt-2 font-mono text-xs text-[var(--text-dim)]">OpenELIS → DPI</p>
              <div className="mt-4">
                <EndpointHeader verb="POST" path="https://dpi.sante.ci/interop/fhir/resultats" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Une fois les analyses validées, OpenELIS renvoie les résultats structurés au DPI
                via un Bundle <code className="inline">DiagnosticReport</code> +{" "}
                <code className="inline">Observation</code>. Le médecin prescripteur reçoit une
                notification temps réel (SSE) s&apos;il est connecté.
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Corps de la requête
              </h3>
              <div className="mt-3">
                <CodeBlock
                  label="bundle-resultats.json"
                  code={`{
  "resourceType": "Bundle",
  "type": "message",
  "entry": [
    {
      "resource": {
        "resourceType": "DiagnosticReport",
        "status": "final",
        "basedOn": [
          {
            "identifier": {
              "system": "https://dpi.sante.ci/demande-examen/numero",
              "value": "DEM-2026-1177"
            }
          }
        ],
        "subject": {
          "identifier": {
            "system": "https://cmu.sante.ci/matricule",
            "value": "1234567890123"
          }
        },
        "result": [{ "reference": "Observation/hb-1" }]
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "id": "hb-1",
        "status": "final",
        "code": {
          "coding": [
            { "system": "http://loinc.org", "code": "718-7", "display": "Hémoglobine" }
          ]
        },
        "valueQuantity": { "value": 12.4, "unit": "g/dL" },
        "referenceRange": [{ "low": { "value": 12 }, "high": { "value": 16 } }]
      }
    }
  ]
}`}
                />
              </div>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Réponse — 200 OK
              </h3>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "recu": true,
  "matriculeCMU": "1234567890123",
  "demande": "DEM-2026-1177",
  "observations": 1,
  "prescripteurNotifie": true
}`}
                />
              </div>
            </section>

            {/* ===================== DÉPÔT NATIONAL ===================== */}
            {/* NATIONAL — OVERVIEW */}
            <section id="national" className="prose-anchor scroll-mt-24">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-3)]">
                Dépôt national
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
                API d&apos;identité et d&apos;historique partagé
              </h2>
              <p className="mt-4 text-[var(--text-muted)]">
                Au-delà du bus d&apos;interopérabilité (routage FHIR entre systèmes d&apos;un même
                établissement), All_Santé expose un <strong className="text-[var(--text)]">dépôt
                national</strong>. Il consolide l&apos;identité pivot et l&apos;historique clinique du
                patient <em>entre établissements</em>, sous le contrôle de son consentement. La clé API
                identifie l&apos;établissement appelant&nbsp;: il n&apos;a plus à se déclarer, il est
                reconnu, et chaque accès est journalisé (piste d&apos;audit opposable).
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Socle vital", "Groupe sanguin, allergies, traitements au long cours. Publié par défaut — ce qui sauve une vie quand le patient ne peut pas parler.", "SOCLE_VITAL"],
                  ["Épisode de soin", "Consultations, diagnostics, prescriptions. Partagé uniquement avec le consentement du patient.", "EPISODE_SOIN"],
                  ["Charge sociale", "Éléments les plus sensibles, cloisonnés à part.", "CHARGE_SOCIALE"],
                ].map(([t, d, tag]) => (
                  <div key={tag} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <span className="font-mono text-[11px] text-[var(--accent-3)]">{tag}</span>
                    <h3 className="mt-1 text-sm font-semibold text-[var(--text)]">{t}</h3>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">{d}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Toutes les routes nationales
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  ["GET", "/national/patients/:matricule", "Identité pivot (SGCH)", "#national-identite"],
                  ["POST", "/national/patients", "Publier une identité (SGCH)", "#national-identite"],
                  ["GET", "/national/patients/:matricule/consultations", "Historique externe (DPI)", "#national-historique"],
                  ["POST", "/national/consultations", "Publier une consultation (DPI)", "#national-historique"],
                  ["DELETE", "/national/consultations/:id", "Révoquer une consultation", "#national-historique"],
                  ["GET", "/national/patients/:matricule/socle-vital", "Socle vital (urgences)", "#national-socle"],
                  ["POST", "/national/patients/:matricule/allergies", "Déclarer une allergie", "#national-socle"],
                  ["POST", "/national/patients/:matricule/traitements-chroniques", "Déclarer un traitement", "#national-socle"],
                  ["PUT", "/national/patients/:matricule/preferences", "Préférences de partage", "#national-preferences"],
                ].map(([v, p, flow, href]) => (
                  <a
                    key={v + p}
                    href={href}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 transition-colors hover:border-[var(--accent)]"
                  >
                    <Method verb={v} />
                    <code className="flex-1 break-all font-mono text-sm text-[var(--text)]">{p}</code>
                    <span className="font-mono text-xs text-[var(--text-dim)]">{flow}</span>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex gap-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-glow)] p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <p className="text-sm text-[var(--text-muted)]">
                  Base&nbsp;: <code className="inline">https://api.all-sante.ci</code>. L&apos;en-tête{" "}
                  <code className="inline">x-api-key</code> identifie l&apos;établissement (aucune
                  déclaration nécessaire). L&apos;en-tête optionnel{" "}
                  <code className="inline">x-etablissement</code> n&apos;est qu&apos;un repli hérité&nbsp;:
                  l&apos;identité prouvée par la clé prime toujours dans le journal d&apos;accès.
                </p>
              </div>
            </section>

            {/* NATIONAL — IDENTITÉ */}
            <section id="national-identite" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Identité patient
              </h2>

              <h3 className="mt-6 text-base font-semibold text-[var(--text)]">Consulter une identité</h3>
              <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">SGCH — recherche dès la saisie des 13 chiffres</p>
              <div className="mt-3">
                <EndpointHeader verb="GET" path="https://api.all-sante.ci/national/patients/:matricule" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Renvoie l&apos;identité pivot du patient, son établissement d&apos;origine et ses
                préférences de partage (le DPI s&apos;en sert pour savoir s&apos;il doit redemander
                l&apos;accord à chaque consultation).
              </p>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "matricule": "1234567890123",
  "nom": "KOUADIO",
  "prenom": "Awa",
  "genre": "feminin",
  "dateNaissance": "1990-04-12",
  "groupeSanguin": "O+",
  "etablissementOrigine": { "code": "HOPA", "nom": "Hôpital A" },
  "partageDurable": false,
  "oppositionSocleVital": false,
  "misAJourLe": "2026-07-30T09:14:02.000Z"
}`}
                />
              </div>

              <h3 className="mt-8 text-base font-semibold text-[var(--text)]">Publier une identité</h3>
              <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">SGCH — upsert après création du patient</p>
              <div className="mt-3">
                <EndpointHeader verb="POST" path="https://api.all-sante.ci/national/patients" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Idempotent&nbsp;: réconcilié par matricule CMU (13 chiffres, sans séparateurs). Le champ{" "}
                <code className="inline">genre</code> vaut <code className="inline">masculin</code> ou{" "}
                <code className="inline">feminin</code>.
              </p>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  label="Corps — identité"
                  code={`{
  "matricule": "1234567890123",
  "nom": "KOUADIO",
  "prenom": "Awa",
  "genre": "feminin",
  "dateNaissance": "1990-04-12",
  "contact": "+2250700000000",
  "villeCommune": "Abidjan",
  "groupeSanguin": "O+",
  "assuranceNom": "CMU",
  "assuranceNumero": "..."
}`}
                />
                <CodeBlock
                  label="200 OK"
                  code={`{
  "ok": true,
  "matricule": "1234567890123",
  "id": "cly8x…"
}`}
                />
              </div>
            </section>

            {/* NATIONAL — HISTORIQUE */}
            <section id="national-historique" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Historique clinique
              </h2>

              <h3 className="mt-6 text-base font-semibold text-[var(--text)]">Consulter l&apos;historique</h3>
              <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">DPI — historique consolidé, hors établissement appelant</p>
              <div className="mt-3">
                <EndpointHeader verb="GET" path="https://api.all-sante.ci/national/patients/:matricule/consultations" />
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--panel-2)] text-left text-[var(--text-dim)]">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Query</th>
                      <th className="px-4 py-2.5 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[var(--text-muted)]">
                    <tr><td className="px-4 py-2.5 font-mono text-xs text-[var(--accent)]">limite</td><td className="px-4 py-2.5">Nombre maximum de consultations retournées.</td></tr>
                    <tr><td className="px-4 py-2.5 font-mono text-xs text-[var(--accent)]">exclureEtablissement</td><td className="px-4 py-2.5">Code établissement à retirer (le DPI possède déjà ses consultations locales).</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Le champ <code className="inline">elementsNonPartages</code> est un booléen seul&nbsp;:
                le praticien sait qu&apos;il doit interroger son patient, sans rien apprendre du contenu masqué.
              </p>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "matricule": "1234567890123",
  "patient": { "nom": "KOUADIO", "prenom": "Awa" },
  "nombre": 2,
  "elementsNonPartages": true,
  "messageNonPartages": "Ce patient a choisi de ne pas partager certains éléments…",
  "consultations": [
    {
      "id": "cly…",
      "dateConsultation": "2026-06-02T10:20:00.000Z",
      "etablissement": { "code": "HOPB", "nom": "Hôpital B", "ville": "Bouaké" },
      "motif": "Fièvre persistante",
      "professionnel": "Dr. Traoré",
      "diagnosticRetenu": "Paludisme simple",
      "codeCim10": "B54"
    }
  ]
}`}
                />
              </div>

              <h3 className="mt-8 text-base font-semibold text-[var(--text)]">Publier une consultation</h3>
              <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">DPI — à la clôture d&apos;une consultation</p>
              <div className="mt-3">
                <EndpointHeader verb="POST" path="https://api.all-sante.ci/national/consultations" />
              </div>
              <div className="mt-4 flex gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--warning)]" />
                <p className="text-sm text-[var(--text-muted)]">
                  Le bloc <code className="inline">consentement</code> est <strong className="text-[var(--text)]">obligatoire</strong>.
                  Sans accord du patient, l&apos;API refuse tout contenu clinique (<code className="inline">400</code>) et n&apos;écrit
                  qu&apos;un marqueur d&apos;existence. <code className="inline">recueilliPar</code> est requis même en cas de refus.
                </p>
              </div>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  label="Corps — consultation"
                  code={`{
  "matricule": "1234567890123",
  "referenceLocale": "CONS-2026-8841",
  "consentement": {
    "accorde": true,
    "recueilliPar": "Dr. Traoré",
    "portee": "DURABLE",
    "support": "FORMULAIRE_PAPIER",
    "etages": ["EPISODE_SOIN"]
  },
  "etage": "EPISODE_SOIN",
  "dateConsultation": "2026-07-30T09:00:00Z",
  "motif": "Céphalées",
  "professionnel": "Dr. Traoré",
  "diagnosticRetenu": "Migraine",
  "codeCim10": "G43",
  "prescriptions": [
    { "medicament": "Paracétamol", "dosage": "1000mg", "posologie": "3x/j" }
  ]
}`}
                />
                <CodeBlock
                  label="200 OK"
                  code={`{
  "ok": true,
  "id": "cly…",
  "referenceLocale": "CONS-2026-8841",
  "matricule": "1234567890123",
  "partage": true,
  "message": "Épisode de soin publié au dépôt national."
}`}
                />
              </div>

              <h3 className="mt-8 text-base font-semibold text-[var(--text)]">Révoquer une consultation</h3>
              <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">Le patient revient sur son accord — purge du contenu clinique</p>
              <div className="mt-3">
                <EndpointHeader verb="DELETE" path="https://api.all-sante.ci/national/consultations/:id?motif=..." />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Le contenu clinique est purgé&nbsp;; la consultation redevient un simple marqueur. Les
                lectures antérieures restent traçables dans le journal d&apos;accès.
              </p>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "ok": true,
  "id": "cly…",
  "message": "Contenu clinique purgé du dépôt national. Les lectures antérieures restent consultables dans le journal d'accès."
}`}
                />
              </div>
            </section>

            {/* NATIONAL — SOCLE VITAL */}
            <section id="national-socle" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Socle vital</h2>
              <p className="mt-4 text-[var(--text-muted)]">
                Ce qui sauve une vie quand le patient ne peut pas parler&nbsp;: groupe sanguin,
                allergies, traitements au long cours. Publié par défaut, mais le patient peut s&apos;y opposer.
              </p>

              <h3 className="mt-6 text-base font-semibold text-[var(--text)]">Consulter le socle vital</h3>
              <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">Urgences</p>
              <div className="mt-3">
                <EndpointHeader verb="GET" path="https://api.all-sante.ci/national/patients/:matricule/socle-vital" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Si le patient s&apos;est opposé, la réponse renvoie <code className="inline">oppositionPatient: true</code> et
                des listes vides — jamais de contenu.
              </p>
              <div className="mt-3">
                <CodeBlock
                  label="200 OK"
                  code={`{
  "matricule": "1234567890123",
  "patient": { "nom": "KOUADIO", "prenom": "Awa", "genre": "feminin" },
  "oppositionPatient": false,
  "groupeSanguin": "O+",
  "allergies": [
    { "libelle": "Pénicilline", "type": "medicament", "severite": "grave", "reaction": "Œdème" }
  ],
  "traitementsChroniques": [
    { "medicament": "Metformine", "dosage": "850mg", "posologie": "2x/j", "indication": "Diabète type 2" }
  ]
}`}
                />
              </div>

              <h3 className="mt-8 text-base font-semibold text-[var(--text)]">Déclarer une allergie</h3>
              <div className="mt-3">
                <EndpointHeader verb="POST" path="https://api.all-sante.ci/national/patients/:matricule/allergies" />
              </div>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  label="Corps — allergie"
                  code={`{
  "referenceLocale": "ALG-2026-114",
  "libelle": "Pénicilline",
  "type": "medicament",
  "severite": "grave",
  "reaction": "Œdème de Quincke",
  "active": true
}`}
                />
                <CodeBlock
                  label="200 OK"
                  code={`{
  "ok": true,
  "id": "cly…",
  "matricule": "1234567890123"
}`}
                />
              </div>

              <h3 className="mt-8 text-base font-semibold text-[var(--text)]">Déclarer un traitement chronique</h3>
              <div className="mt-3">
                <EndpointHeader verb="POST" path="https://api.all-sante.ci/national/patients/:matricule/traitements-chroniques" />
              </div>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  label="Corps — traitement"
                  code={`{
  "referenceLocale": "TRT-2026-052",
  "medicament": "Metformine",
  "dci": "metformine",
  "dosage": "850mg",
  "posologie": "2x/j",
  "indication": "Diabète type 2",
  "actif": true
}`}
                />
                <CodeBlock
                  label="200 OK"
                  code={`{
  "ok": true,
  "id": "cly…",
  "matricule": "1234567890123"
}`}
                />
              </div>
            </section>

            {/* NATIONAL — PRÉFÉRENCES */}
            <section id="national-preferences" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Préférences de partage
              </h2>
              <div className="mt-4">
                <EndpointHeader verb="PUT" path="https://api.all-sante.ci/national/patients/:matricule/preferences" />
              </div>
              <p className="mt-4 text-[var(--text-muted)]">
                Accord durable au partage, ou opposition au socle vital. Appelable par un agent
                d&apos;accueil comme par un praticien — le canal principal reste le formulaire papier
                saisi au guichet. <code className="inline">recueilliPar</code> est requis.
              </p>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                <CodeBlock
                  label="Corps — préférences"
                  code={`{
  "partageDurable": true,
  "oppositionSocleVital": false,
  "recueilliPar": "Agent d'accueil — M. Koné",
  "support": "FORMULAIRE_PAPIER",
  "preuve": "scan-formulaire-2026-07-30.pdf"
}`}
                />
                <CodeBlock
                  label="200 OK"
                  code={`{
  "ok": true,
  "matricule": "1234567890123",
  "partageDurable": true,
  "oppositionSocleVital": false
}`}
                />
              </div>
            </section>

            {/* BUNDLE */}
            <section id="bundle" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                Bundle &amp; systèmes d&apos;identifiants
              </h2>
              <p className="mt-4 text-[var(--text-muted)]">
                Les liens inter-applications ne sont jamais des clés étrangères mais des{" "}
                <strong className="text-[var(--text)]">identifiants partagés</strong>, portés par un{" "}
                <code className="inline">system</code> FHIR. Les principaux&nbsp;:
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--panel-2)] text-left text-[var(--text-dim)]">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Système (URI)</th>
                      <th className="px-4 py-2.5 font-medium">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] font-mono text-xs text-[var(--text-muted)]">
                    <tr><td className="px-4 py-2.5 text-[var(--accent)]">https://cmu.sante.ci/matricule</td><td className="px-4 py-2.5 font-sans">Identité patient (clé pivot)</td></tr>
                    <tr><td className="px-4 py-2.5 text-[var(--accent)]">https://sgch.sante.ci/fiche</td><td className="px-4 py-2.5 font-sans">Référence fiche de paiement</td></tr>
                    <tr><td className="px-4 py-2.5 text-[var(--accent)]">https://dpi.sante.ci/demande-examen/numero</td><td className="px-4 py-2.5 font-sans">Rattachement demande ↔ résultat</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* IDEMPOTENCE */}
            <section id="idempotence" className="prose-anchor scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Idempotence</h2>
              <p className="mt-4 text-[var(--text-muted)]">
                Tous les endpoints sont <strong className="text-[var(--text)]">idempotents</strong>.
                Le renvoi d&apos;un même Bundle ne crée pas de doublon&nbsp;: le patient miroir est
                réconcilié par matricule CMU, la fiche par sa référence, et les résultats par le
                numéro de demande. Un rejeu réseau est donc sans danger.
              </p>
              <div className="mt-6 flex gap-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-glow)] p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
                <p className="text-sm text-[var(--text-muted)]">
                  Cette garantie permet de re-livrer un Bundle en cas de doute sur la réception,
                  sans mécanisme de déduplication côté émetteur.
                </p>
              </div>
            </section>

            <div className="border-t border-[var(--border)] pt-8 text-sm text-[var(--text-dim)]">
              Documentation All_Santé · FHIR R4 · Dernière révision {new Date().toLocaleDateString("fr-FR")}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
