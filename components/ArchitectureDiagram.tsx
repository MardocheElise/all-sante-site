export default function ArchitectureDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)]/60 p-4 sm:p-8">
      <svg viewBox="0 0 900 580" className="mx-auto w-full max-w-4xl" role="img" aria-label="Architecture centrale d'interopérabilité All_Santé">
        <defs>
          <linearGradient id="core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="nat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#2dd4bf" stopOpacity="0.35" />
            <stop offset="1" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
          {/* Tête de flèche double sens : orient auto-start-reverse => pointes aux deux extrémités */}
          <marker id="head" markerWidth="9" markerHeight="9" refX="7.5" refY="4" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 Z" fill="#8b98ac" />
          </marker>
        </defs>

        {/* Cadre établissement */}
        <rect x="24" y="34" width="852" height="392" rx="18" fill="none" stroke="#2a3547" strokeDasharray="4 5" />
        <text x="44" y="60" fill="#63708a" fontSize="12" fontFamily="monospace">ÉTABLISSEMENT (SIH)</text>

        {/* Halo + noeud central All_Santé (API isolée) */}
        <circle cx="450" cy="295" r="150" fill="url(#coreGlow)" />
        <rect x="352" y="250" width="196" height="96" rx="18" fill="#0b1620" stroke="url(#core)" strokeWidth="2" />
        <text x="450" y="286" fill="#e6ebf4" fontSize="20" fontWeight="700" textAnchor="middle">
          All<tspan fill="#2dd4bf">_</tspan>Santé
        </text>
        <text x="450" y="308" fill="#2dd4bf" fontSize="11" textAnchor="middle" fontFamily="monospace">API FHIR centrale · isolée</text>
        <text x="450" y="326" fill="#63708a" fontSize="10" textAnchor="middle" fontFamily="monospace">x-api-key · /interop/fhir</text>

        {/* Systèmes rattachés */}
        {[
          { x: 375, y: 60, w: 150, h: 78, label: "DPI", sub: "Clinique", color: "#2dd4bf" },
          { x: 70, y: 120, w: 150, h: 78, label: "SGCH", sub: "Administratif", color: "#38bdf8" },
          { x: 680, y: 120, w: 150, h: 78, label: "OpenELIS", sub: "Labo · Imagerie", color: "#a78bfa" },
        ].map((m) => (
          <g key={m.label}>
            <rect x={m.x} y={m.y} width={m.w} height={m.h} rx="12" fill="#0e131d" stroke={m.color} strokeOpacity="0.55" />
            <text x={m.x + m.w / 2} y={m.y + 34} fill="#e6ebf4" fontSize="15" fontWeight="600" textAnchor="middle">{m.label}</text>
            <text x={m.x + m.w / 2} y={m.y + 54} fill="#97a3b6" fontSize="10" textAnchor="middle">{m.sub}</text>
          </g>
        ))}

        {/* Connecteurs BIDIRECTIONNELS système <-> API centrale */}
        {/* DPI <-> All_Santé (vertical) */}
        <line x1="450" y1="138" x2="450" y2="250" stroke="#2dd4bf" strokeOpacity="0.7" strokeWidth="2" markerStart="url(#head)" markerEnd="url(#head)" />
        <text x="462" y="200" fill="#8b98ac" fontSize="10" fontFamily="monospace">FHIR</text>
        {/* SGCH <-> All_Santé (diagonale) */}
        <line x1="212" y1="176" x2="360" y2="278" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="2" markerStart="url(#head)" markerEnd="url(#head)" />
        <text x="250" y="212" fill="#8b98ac" fontSize="10" fontFamily="monospace">FHIR</text>
        {/* OpenELIS <-> All_Santé (diagonale) */}
        <line x1="688" y1="176" x2="540" y2="278" stroke="#a78bfa" strokeOpacity="0.7" strokeWidth="2" markerStart="url(#head)" markerEnd="url(#head)" />
        <text x="600" y="212" fill="#8b98ac" fontSize="10" fontFamily="monospace">FHIR</text>

        {/* API centrale <-> Dépôt national (bidirectionnel : push + lecture) */}
        <line x1="450" y1="346" x2="450" y2="470" stroke="url(#nat)" strokeWidth="2" markerStart="url(#head)" markerEnd="url(#head)" />
        <text x="462" y="412" fill="#8b98ac" fontSize="10" fontFamily="monospace">Bundle IPS</text>

        {/* Dépôt national */}
        <rect x="150" y="470" width="600" height="72" rx="14" fill="url(#nat)" fillOpacity="0.12" stroke="url(#nat)" />
        <text x="450" y="502" fill="#e6ebf4" fontSize="15" fontWeight="600" textAnchor="middle">Dépôt National Central</text>
        <text x="450" y="522" fill="#97a3b6" fontSize="11" textAnchor="middle">Modèle centralisé · lecture inter-établissements · clé = matricule CMU</text>

        {/* Autres établissements */}
        <line x1="750" y1="506" x2="838" y2="506" stroke="#2a3547" strokeWidth="1.5" strokeDasharray="4 4" markerStart="url(#head)" markerEnd="url(#head)" />
        <text x="866" y="502" fill="#63708a" fontSize="11" textAnchor="middle">Étab.</text>
        <text x="866" y="516" fill="#63708a" fontSize="11" textAnchor="middle">2…N</text>
      </svg>
    </div>
  );
}
