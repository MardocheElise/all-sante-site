"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  Plus,
  Server,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  Compte,
  CleResume,
  ErreurApi,
  effacerJeton,
  ecrireJeton,
  lireJeton,
  portailApi,
  Systemes,
} from "@/lib/portail-api";

type Vue = "chargement" | "connexion" | "inscription" | "tableau";

export default function PortailPage() {
  const [vue, setVue] = useState<Vue>("chargement");
  const [compte, setCompte] = useState<Compte | null>(null);

  // Une session déjà ouverte évite de redemander les identifiants à chaque
  // rechargement — le développeur revient souvent sur cette page.
  useEffect(() => {
    if (!lireJeton()) {
      setVue("connexion");
      return;
    }
    portailApi
      .profil()
      .then((p) => {
        setCompte(p);
        setVue("tableau");
      })
      .catch(() => {
        effacerJeton();
        setVue("connexion");
      });
  }, []);

  const ouvrirSession = (jeton: string, c: Compte) => {
    ecrireJeton(jeton);
    setCompte(c);
    setVue("tableau");
  };

  const fermerSession = () => {
    effacerJeton();
    setCompte(null);
    setVue("connexion");
  };

  return (
    <main className="bg-grid min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <header className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--text-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
            Portail développeur
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Vos clés d&apos;accès à All<span className="text-[var(--accent)]">_</span>Santé
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--text-muted)]">
            Chaque établissement dispose de ses propres clés. C&apos;est ce qui
            permet au dépôt national de tracer <em>quel</em> hôpital a consulté{" "}
            <em>quel</em> dossier, et <em>quand</em> — une clé partagée rendrait
            cette traçabilité sans valeur.
          </p>
        </header>

        {vue === "chargement" && (
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        )}

        {vue === "connexion" && (
          <FormulaireConnexion
            onSucces={ouvrirSession}
            versInscription={() => setVue("inscription")}
          />
        )}

        {vue === "inscription" && (
          <FormulaireInscription
            onSucces={ouvrirSession}
            versConnexion={() => setVue("connexion")}
          />
        )}

        {vue === "tableau" && compte && (
          <TableauDeBord compte={compte} onDeconnexion={fermerSession} />
        )}
      </div>
    </main>
  );
}

// ─── Champs réutilisables ────────────────────────────────────────────────────

function Champ({
  label,
  aide,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  aide?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[var(--text-muted)]">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[var(--accent)]"
      />
      {aide && <span className="mt-1 block text-xs text-[var(--text-dim)]">{aide}</span>}
    </label>
  );
}

function Erreur({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-3 text-sm text-[var(--danger)]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function Carte({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 sm:p-8">
      {children}
    </div>
  );
}

// ─── Connexion ───────────────────────────────────────────────────────────────

function FormulaireConnexion({
  onSucces,
  versInscription,
}: {
  onSucces: (jeton: string, compte: Compte) => void;
  versInscription: () => void;
}) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      const r = await portailApi.connexion(email, motDePasse);
      onSucces(r.jeton, r.compte);
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : "Connexion impossible");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="max-w-md">
      <Carte>
        <h2 className="text-lg font-semibold">Connexion</h2>
        <form onSubmit={soumettre} className="mt-5 space-y-4">
          <Champ
            label="Adresse e-mail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@hopital.ci"
          />
          <Champ
            label="Mot de passe"
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          {erreur && <Erreur message={erreur} />}
          <button
            type="submit"
            disabled={envoi}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[#04121a] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {envoi && <Loader2 className="h-4 w-4 animate-spin" />}
            Se connecter
          </button>
        </form>
        <p className="mt-5 text-sm text-[var(--text-muted)]">
          Pas encore de compte ?{" "}
          <button
            onClick={versInscription}
            className="text-[var(--accent)] hover:underline"
          >
            Inscrire mon établissement
          </button>
        </p>
      </Carte>
    </div>
  );
}

// ─── Inscription ─────────────────────────────────────────────────────────────

function FormulaireInscription({
  onSucces,
  versConnexion,
}: {
  onSucces: (jeton: string, compte: Compte) => void;
  versConnexion: () => void;
}) {
  const [form, setForm] = useState({
    nomEtablissement: "",
    typeEtablissement: "HOPITAL_GENERAL",
    ville: "",
    nom: "",
    prenom: "",
    fonction: "",
    telephone: "",
    email: "",
    motDePasse: "",
  });
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Aperçu du code : le développeur voit immédiatement l'identifiant sous
  // lequel son établissement apparaîtra dans le journal d'accès.
  const apercuCode = apercuDuCode(form.nomEtablissement);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      const r = await portailApi.inscription(form);
      onSucces(r.jeton, r.compte);
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : "Inscription impossible");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Carte>
        <h2 className="text-lg font-semibold">Inscrire mon établissement</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Le code de votre établissement est dérivé de son nom. Il figurera dans
          chaque ligne du journal d&apos;accès national.
        </p>

        <form onSubmit={soumettre} className="mt-6 space-y-5">
          <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-[var(--accent)]" /> Établissement
            </div>
            <Champ
              label="Nom complet"
              required
              minLength={3}
              value={form.nomEtablissement}
              onChange={(e) => set("nomEtablissement", e.target.value)}
              placeholder="CHR de Bouaké"
              aide={
                apercuCode
                  ? `Code attribué : ${apercuCode}`
                  : "Ex. « Centre de Santé Urbain d'Adjamé »"
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-[var(--text-muted)]">
                  Type
                </span>
                <select
                  value={form.typeEtablissement}
                  onChange={(e) => set("typeEtablissement", e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                >
                  <option value="CHU">CHU</option>
                  <option value="CHR">CHR</option>
                  <option value="HOPITAL_GENERAL">Hôpital général</option>
                  <option value="CENTRE_SANTE">Centre de santé</option>
                  <option value="CLINIQUE">Clinique</option>
                  <option value="LABORATOIRE">Laboratoire</option>
                </select>
              </label>
              <Champ
                label="Ville"
                value={form.ville}
                onChange={(e) => set("ville", e.target.value)}
                placeholder="Bouaké"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Champ
              label="Nom"
              required
              value={form.nom}
              onChange={(e) => set("nom", e.target.value)}
            />
            <Champ
              label="Prénom"
              value={form.prenom}
              onChange={(e) => set("prenom", e.target.value)}
            />
            <Champ
              label="Fonction"
              value={form.fonction}
              onChange={(e) => set("fonction", e.target.value)}
              placeholder="Responsable informatique"
            />
            <Champ
              label="Téléphone"
              value={form.telephone}
              onChange={(e) => set("telephone", e.target.value)}
              placeholder="0700000000"
            />
          </div>

          <Champ
            label="Adresse e-mail"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="vous@hopital.ci"
          />
          <Champ
            label="Mot de passe"
            type="password"
            required
            minLength={12}
            value={form.motDePasse}
            onChange={(e) => set("motDePasse", e.target.value)}
            aide="12 caractères minimum. Une phrase longue vaut mieux qu'un mot compliqué."
          />

          {erreur && <Erreur message={erreur} />}

          <button
            type="submit"
            disabled={envoi}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[#04121a] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {envoi && <Loader2 className="h-4 w-4 animate-spin" />}
            Créer mon compte
          </button>
        </form>

        <p className="mt-5 text-sm text-[var(--text-muted)]">
          Déjà inscrit ?{" "}
          <button onClick={versConnexion} className="text-[var(--accent)] hover:underline">
            Se connecter
          </button>
        </p>
      </Carte>
    </div>
  );
}

/** Reproduit côté navigateur la dérivation faite par l'API (aperçu seulement). */
function apercuDuCode(nom: string): string {
  const vides = new Set(["de", "du", "des", "la", "le", "les", "et", "a", "au", "aux", "l", "d"]);
  const mots = nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/['’]/g, " ")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((m) => m && !vides.has(m.toLowerCase()));
  if (mots.length === 0) return "";
  let code = mots.join("-");
  if (code.length > 24) {
    const retenus: string[] = [];
    let n = 0;
    for (const m of mots) {
      const ajout = retenus.length === 0 ? m.length : m.length + 1;
      if (n + ajout > 24) break;
      retenus.push(m);
      n += ajout;
    }
    code = retenus.length ? retenus.join("-") : mots[0].slice(0, 24);
  }
  return code;
}

// ─── Tableau de bord ─────────────────────────────────────────────────────────

function TableauDeBord({
  compte,
  onDeconnexion,
}: {
  compte: Compte;
  onDeconnexion: () => void;
}) {
  const [cles, setCles] = useState<CleResume[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [libelle, setLibelle] = useState("");
  const [creation, setCreation] = useState(false);
  const [cleFraiche, setCleFraiche] = useState<string | null>(null);

  const recharger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await portailApi.listerCles();
      setCles(r.cles);
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : "Chargement impossible");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void recharger();
  }, [recharger]);

  const creer = async () => {
    setErreur(null);
    setCreation(true);
    try {
      const r = await portailApi.creerCle(libelle || "Clé sans libellé");
      setCleFraiche(r.cle);
      setLibelle("");
      await recharger();
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : "Génération impossible");
    } finally {
      setCreation(false);
    }
  };

  const revoquer = async (id: string, prefixe: string) => {
    if (
      !window.confirm(
        `Révoquer la clé ${prefixe} ?\n\nTout appel la présentant sera immédiatement rejeté. Cette action est irréversible.`,
      )
    )
      return;
    try {
      await portailApi.revoquerCle(id);
      await recharger();
    } catch (err) {
      setErreur(err instanceof ErreurApi ? err.message : "Révocation impossible");
    }
  };

  return (
    <div className="space-y-6">
      <Carte>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[var(--accent)]" />
              <span className="font-semibold">{compte.etablissement.nom}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Code établissement{" "}
              <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-[var(--accent)]">
                {compte.etablissement.code}
              </code>
            </p>
            <p className="mt-1 text-sm text-[var(--text-dim)]">
              {compte.prenom} {compte.nom} · {compte.email}
            </p>
          </div>
          <button
            onClick={onDeconnexion}
            className="flex items-center gap-2 rounded-lg border border-[var(--border-strong)] px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </Carte>

      {cleFraiche && (
        <CleAffichee cle={cleFraiche} onFermer={() => setCleFraiche(null)} />
      )}

      <Carte>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <KeyRound className="h-4 w-4 text-[var(--accent)]" /> Clés API
          </h2>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            placeholder="Libellé — ex. « intégration DPI », « tests »"
            className="flex-1 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--text-dim)] focus:border-[var(--accent)]"
          />
          <button
            onClick={creer}
            disabled={creation}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[#04121a] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {creation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Générer une clé
          </button>
        </div>

        {erreur && (
          <div className="mt-4">
            <Erreur message={erreur} />
          </div>
        )}

        <div className="mt-6">
          {chargement ? (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
            </div>
          ) : cles.length === 0 ? (
            <p className="text-sm text-[var(--text-dim)]">
              Aucune clé pour l&apos;instant. Générez-en une pour commencer à
              appeler l&apos;API.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {cles.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm text-[var(--text)]">
                        {c.prefixe}
                      </code>
                      {c.active ? (
                        <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-xs text-[var(--success)]">
                          active
                        </span>
                      ) : (
                        <span className="rounded-full bg-[var(--danger)]/10 px-2 py-0.5 text-xs text-[var(--danger)]">
                          révoquée
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-dim)]">
                      {c.libelle} · créée le{" "}
                      {new Date(c.creeeLe).toLocaleDateString("fr-FR")}
                      {c.dernierUsageLe
                        ? ` · dernier appel le ${new Date(c.dernierUsageLe).toLocaleDateString("fr-FR")}`
                        : " · jamais utilisée"}
                    </p>
                  </div>
                  {c.active && (
                    <button
                      onClick={() => revoquer(c.id, c.prefixe)}
                      className="flex items-center gap-1.5 rounded-lg border border-[var(--border-strong)] px-2.5 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Révoquer
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Carte>

      <CarteSystemes />

      <Carte>
        <h2 className="text-lg font-semibold">Utiliser votre clé</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          La clé s&apos;envoie dans l&apos;en-tête <code>x-api-key</code>. Elle
          identifie votre établissement : vous n&apos;avez plus à le déclarer.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[#070a10] p-4 font-mono text-xs text-[var(--text-muted)]">
{`curl https://api.allsante.ci/national/patients/1994031200123 \\
  -H "x-api-key: als_votre_cle_ici"`}
        </pre>
      </Carte>
    </div>
  );
}

// ─── Systèmes de l'établissement ─────────────────────────────────────────────

/**
 * Sans ces adresses, All_Santé ne sait pas où renvoyer les Bundles FHIR de
 * l'établissement : il retombe sur une cible globale, donc potentiellement
 * vers le DPI d'un autre hôpital. C'est l'écran le plus important du portail
 * pour qui utilise le bus d'interopérabilité.
 */
function CarteSystemes() {
  const [systemes, setSystemes] = useState<Systemes | null>(null);
  const [dpiUrl, setDpiUrl] = useState("");
  const [openelisUrl, setOpenelisUrl] = useState("");
  const [sgchUrl, setSgchUrl] = useState("");
  const [cleSortante, setCleSortante] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    portailApi
      .lireSystemes()
      .then((s) => {
        setSystemes(s);
        setDpiUrl(s.dpiUrl ?? "");
        setOpenelisUrl(s.openelisUrl ?? "");
        setSgchUrl(s.sgchUrl ?? "");
      })
      .catch(() => undefined);
  }, []);

  const enregistrer = async () => {
    setErreur(null);
    setSucces(null);
    setEnvoi(true);
    try {
      const r = await portailApi.majSystemes({
        dpiUrl: dpiUrl || null,
        openelisUrl: openelisUrl || null,
        cleSortante: cleSortante || null,
      });
      setSystemes(r);
      setCleSortante("");
      setSucces(r.message);
    } catch (err) {
      setErreur(
        err instanceof ErreurApi ? err.message : "Enregistrement impossible",
      );
    } finally {
      setEnvoi(false);
    }
  };

  const incomplet =
    systemes && (!systemes.dpiUrl || !systemes.openelisUrl || !systemes.cleSortanteDefinie);

  return (
    <Carte>
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Server className="h-4 w-4 text-[var(--accent)]" /> Vos systèmes
      </h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Adresses vers lesquelles All_Santé renvoie les Bundles FHIR de votre
        établissement : prise en charge vers votre DPI, demandes d&apos;examen
        vers votre laboratoire.
      </p>

      {/* {incomplet && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-3 text-sm text-[var(--text-muted)]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--warning)]" />
          <span>
            Tant que ces adresses ne sont pas déclarées, vos Bundles sont routés
            vers la cible par défaut du bus — potentiellement le système
            d&apos;un <strong>autre établissement</strong>.
          </span>
        </div>
      )} */}

      <div className="mt-5 space-y-4">
        <Champ
          label="URL de votre DPI"
          value={dpiUrl}
          onChange={(e) => setDpiUrl(e.target.value)}
          placeholder="http://localhost:3001"
          aide="Reçoit les prises en charge et les résultats."
        />
        <Champ
          label="URL de votre système de laboratoire"
          value={openelisUrl}
          onChange={(e) => setOpenelisUrl(e.target.value)}
          placeholder="http://localhost:3021"
          aide="Reçoit les demandes d'examen émises par votre DPI."
        />
        <Champ
          label="URL de votre système administrative"
          value={sgchUrl}
          onChange={(e) => setSgchUrl(e.target.value)}
          placeholder="http://localhost:3021"
          aide="Reçoit les demandes d'examen émises par votre DPI."
        />
        <Champ
          label="Clé entrante"
          type="password"
          value={cleSortante}
          onChange={(e) => setCleSortante(e.target.value)}
          placeholder={
            systemes?.cleSortanteDefinie
              ? "définie — laisser vide pour conserver"
              : ""
          }
          aide="Clé qu'All_Santé présentera à vos systèmes. Doit correspondre à leur variable INTEROP_INBOUND_KEY. 16 caractères minimum."
        />

        {erreur && <Erreur message={erreur} />}
        {succes && (
          <div className="flex items-start gap-2 rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/5 p-3 text-sm text-[var(--success)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{succes}</span>
          </div>
        )}

        <button
          onClick={enregistrer}
          disabled={envoi}
          className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] disabled:opacity-50"
        >
          {envoi && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer
        </button>
      </div>
    </Carte>
  );
}

// ─── Clé affichée une seule fois ─────────────────────────────────────────────

function CleAffichee({ cle, onFermer }: { cle: string; onFermer: () => void }) {
  const [visible, setVisible] = useState(true);
  const [copie, setCopie] = useState(false);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(cle);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--warning)]/40 bg-[var(--warning)]/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--warning)]" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[var(--warning)]">
            Copiez cette clé maintenant
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Elle ne sera plus jamais affichée. Nous n&apos;en conservons que
            l&apos;empreinte — en cas de perte, révoquez-la et générez-en une
            nouvelle.
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[#070a10] p-3">
            <code className="min-w-0 flex-1 truncate font-mono text-sm text-[var(--accent)]">
              {visible ? cle : "•".repeat(44)}
            </code>
            <button
              onClick={() => setVisible(!visible)}
              className="rounded p-1.5 text-[var(--text-dim)] hover:text-[var(--text)]"
              aria-label={visible ? "Masquer" : "Afficher"}
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={copier}
              className="flex items-center gap-1.5 rounded-md bg-[var(--panel-2)] px-2.5 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {copie ? (
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

          <button
            onClick={onFermer}
            className="mt-4 text-sm text-[var(--text-muted)] underline hover:text-[var(--text)]"
          >
            J&apos;ai copié la clé, masquer ce message
          </button>
        </div>
      </div>
    </div>
  );
}
