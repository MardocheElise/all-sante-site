# All_Santé — Site vitrine & documentation

Site vitrine et documentation technique de **All_Santé**, la plateforme
d'interopérabilité FHIR qui unifie SGCH, DPI et OpenELIS autour du matricule CMU.

## Stack

- **Next.js 16** (App Router) · React 19
- **Tailwind CSS v4**
- **TypeScript 5**
- Thème sombre orienté développeur

## Démarrer

```bash
npm install
npm run dev
# → http://localhost:3030
```

## Build de production

```bash
npm run build
npm run start
```

## Structure

```
all-sante-site/
├── app/
│   ├── layout.tsx        # Layout racine (navbar + footer)
│   ├── page.tsx          # Landing / vitrine
│   ├── globals.css       # Thème sombre + tokens
│   └── docs/page.tsx     # Documentation technique
└── components/
    ├── Navbar.tsx
    ├── Footer.tsx
    ├── CodeBlock.tsx           # Bloc de code avec copie
    ├── ArchitectureDiagram.tsx # Schéma SVG d'interopérabilité
    └── DocsSidebar.tsx         # Sommaire de la doc (scroll-spy)
```

## Contenu documenté

Les trois flux FHIR de la plateforme d'interop :

| Flux | Endpoint | Ressources |
|------|----------|-----------|
| SGCH → DPI | `POST /interop/fhir/prise-en-charge` | Patient + Invoice |
| DPI → OpenELIS | `POST /interop/fhir/demande-examen` | Patient + ServiceRequest |
| OpenELIS → DPI | `POST /interop/fhir/resultats` | DiagnosticReport + Observation |

Authentification serveur-à-serveur par clé API (`x-api-key`).
