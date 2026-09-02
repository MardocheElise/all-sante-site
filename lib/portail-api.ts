// ─────────────────────────────────────────────────────────────────────────────
// Client du portail développeur All_Santé.
//
// L'URL de l'API est injectée à la compilation par NEXT_PUBLIC_API_URL. En
// développement, elle pointe vers l'instance locale.
// ─────────────────────────────────────────────────────────────────────────────

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

const CLE_SESSION = "allsante_portail_jeton";

export function lireJeton(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CLE_SESSION);
}

export function ecrireJeton(jeton: string) {
  window.localStorage.setItem(CLE_SESSION, jeton);
}

export function effacerJeton() {
  window.localStorage.removeItem(CLE_SESSION);
}

export interface Etablissement {
  code: string;
  nom: string;
  ville?: string | null;
}

export interface Compte {
  id: string;
  email: string;
  nom: string;
  prenom?: string | null;
  fonction?: string | null;
  etablissement: Etablissement;
}

export interface CleResume {
  id: string;
  libelle: string;
  prefixe: string;
  creeeLe: string;
  dernierUsageLe: string | null;
  revoqueeLe: string | null;
  active: boolean;
}

/** Erreur porteuse du statut HTTP, pour distinguer 401 et 500 côté interface. */
export class ErreurApi extends Error {
  constructor(
    message: string,
    readonly statut: number,
  ) {
    super(message);
  }
}

async function appeler<T>(
  chemin: string,
  options: RequestInit = {},
  avecJeton = false,
): Promise<T> {
  const entetes: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (avecJeton) {
    const jeton = lireJeton();
    if (jeton) entetes.Authorization = `Bearer ${jeton}`;
  }

  let reponse: Response;
  try {
    reponse = await fetch(`${API_URL}${chemin}`, { ...options, headers: entetes });
  } catch {
    // Distinguer « serveur injoignable » d'une erreur métier évite au
    // développeur de chercher une faute dans sa saisie.
    throw new ErreurApi(
      `Impossible de joindre l'API (${API_URL}). Vérifiez qu'elle est démarrée.`,
      0,
    );
  }

  if (!reponse.ok) {
    let message = `Erreur ${reponse.status}`;
    try {
      const corps = await reponse.json();
      message = Array.isArray(corps?.message)
        ? corps.message.join(", ")
        : (corps?.message ?? message);
    } catch {
      /* corps non JSON */
    }
    throw new ErreurApi(message, reponse.status);
  }

  return reponse.json() as Promise<T>;
}

export const portailApi = {
  inscription: (donnees: Record<string, unknown>) =>
    appeler<{ jeton: string; compte: Compte }>("/portail/inscription", {
      method: "POST",
      body: JSON.stringify(donnees),
    }),

  connexion: (email: string, motDePasse: string) =>
    appeler<{ jeton: string; compte: Compte }>("/portail/connexion", {
      method: "POST",
      body: JSON.stringify({ email, motDePasse }),
    }),

  profil: () => appeler<Compte>("/portail/profil", {}, true),

  listerCles: () =>
    appeler<{ etablissement: Etablissement; cles: CleResume[] }>(
      "/portail/cles",
      {},
      true,
    ),

  creerCle: (libelle: string) =>
    appeler<{
      cle: string;
      avertissement: string;
      details: { prefixe: string; libelle: string };
    }>(
      "/portail/cles",
      { method: "POST", body: JSON.stringify({ libelle }) },
      true,
    ),

  revoquerCle: (id: string) =>
    appeler<{ ok: boolean; message: string }>(
      `/portail/cles/${id}`,
      { method: "DELETE" },
      true,
    ),

  lireSystemes: () => appeler<Systemes>("/portail/systemes", {}, true),

  majSystemes: (donnees: {
    dpiUrl?: string | null;
    openelisUrl?: string | null;
    sgchUrl?: string | null;
    cleSortante?: string | null;
  }) =>
    appeler<Systemes & { message: string }>(
      "/portail/systemes",
      { method: "PUT", body: JSON.stringify(donnees) },
      true,
    ),
};

/**
 * Adresses vers lesquelles All_Santé renvoie les Bundles FHIR de
 * l'établissement. Tant qu'elles ne sont pas déclarées, le bus retombe sur une
 * cible globale — c'est-à-dire vers un autre hôpital.
 */
export interface Systemes {
  code: string;
  dpiUrl: string | null;
  openelisUrl: string | null;
  sgchUrl: string | null;
  cleSortanteDefinie: boolean;
  complet?: boolean;
}
