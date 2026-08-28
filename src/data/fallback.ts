/**
 * Données de démonstration (MULTI-ANNÉES) utilisées :
 *  - tant que SHEET_ID n'est pas renseigné ;
 *  - ou en dernier recours si le réseau échoue et qu'aucun cache n'existe.
 *
 * Deux éditions y figurent (2025 et 2024) pour que le sélecteur d'année soit
 * démontrable. Chiffres approximatifs, uniquement pour l'affichage.
 */

import type { ConfigRow, Equipe, LegendeEntry, Match, MultiYearData, Score } from '../types'

/* ------------------------------------------------------------------ */
/*  Édition 2025                                                        */
/* ------------------------------------------------------------------ */

const equipes2025: Equipe[] = [
  { annee: 2025, nom: 'Top Yeu', theme: 'USA', emoji: '🦅', couleur: '#EF476F', points_total: null, rang: 2, note: '' },
  { annee: 2025, nom: 'Les Bronzés', theme: 'Grèce', emoji: '🏛️', couleur: '#FFB703', points_total: null, rang: 4, note: '' },
  {
    annee: 2025,
    nom: 'Astérix & Obélix',
    theme: 'Égypte',
    emoji: '🛡️',
    couleur: '#06D6A0',
    points_total: null,
    rang: 1,
    note: '🏆 Vainqueur de la finale (Flip Cup)',
  },
  { annee: 2025, nom: 'E.T.', theme: 'Mexique', emoji: '🛸', couleur: '#118AB2', points_total: null, rang: 3, note: '' },
]

// Points par épreuve, dans l'ordre [Top Yeu, Les Bronzés, Astérix, E.T.].
const points2025: Record<string, [number, number, number, number]> = {
  'Volley Ball': [45, 32, 34, 13],
  'Balle aux prisonniers': [20, 10, 30, 0],
  'Spike Ball': [45, 15, 26, 34],
  'Bombe à eau': [25, 0, 12, 2],
  'Football 3x3': [0, 10, 20, 30],
  'Baby-Foot': [6, 0, 0, 0],
  'Tournante géante': [0, 20, 0, 25],
  'Ventriglisse + Flip Cup': [12, 6, 2, 25],
  Déguisement: [6, 12, 25, 2],
}

/** Construit les Scores + le classement (rang) de chaque épreuve pour une année. */
function construireScores(
  annee: number,
  noms: string[],
  table: Record<string, number[]>,
): Score[] {
  const scores: Score[] = []
  for (const [epreuve, pts] of Object.entries(table)) {
    const lignes = noms.map((nom, i) => ({ equipe: nom, points: pts[i] ?? 0 }))
    const tri = [...lignes].sort((a, b) => b.points - a.points)
    const rangParEquipe = new Map<string, number>()
    tri.forEach((l, idx) => {
      const prec = tri[idx - 1]
      const rang = prec && prec.points === l.points ? rangParEquipe.get(prec.equipe)! : idx + 1
      rangParEquipe.set(l.equipe, rang)
    })
    for (const l of lignes) {
      scores.push({
        annee,
        epreuve,
        equipe: l.equipe,
        points: l.points,
        classement: rangParEquipe.get(l.equipe) ?? null,
      })
    }
  }
  return scores
}

const noms2025 = equipes2025.map((e) => e.nom)

const matchsSpike2025: Match[] = [
  ['Top Yeu', 'Les Bronzés', 10, 6, '11h45'],
  ['Astérix & Obélix', 'E.T.', 8, 10, '11h55'],
  ['Top Yeu', 'Astérix & Obélix', 10, 9, '12h05'],
  ['Les Bronzés', 'E.T.', 5, 10, '12h15'],
  ['Les Bronzés', 'Astérix & Obélix', 7, 10, '12h20'],
  ['Top Yeu', 'E.T.', 10, 8, '12h25'],
].map(([a, b, sa, sb, h]) => ({
  annee: 2025,
  epreuve: 'Spike Ball',
  equipeA: a as string,
  equipeB: b as string,
  horaire: h as string,
  terrain: 'Plage',
  scoreA: sa as number,
  scoreB: sb as number,
  statut: 'terminé',
}))

const matchsFoot2025: Match[] = [
  ['Top Yeu', 'Les Bronzés', 0, 1],
  ['Astérix & Obélix', 'E.T.', 0, 1],
  ['Top Yeu', 'Astérix & Obélix', 0, 1],
  ['Les Bronzés', 'E.T.', 0, 1],
  ['Les Bronzés', 'Astérix & Obélix', 0, 1],
  ['Top Yeu', 'E.T.', 0, 1],
].map(([a, b, sa, sb], i) => ({
  annee: 2025,
  epreuve: 'Football 3x3',
  equipeA: a as string,
  equipeB: b as string,
  horaire: `${14 + Math.floor(i / 2)}h${i % 2 === 0 ? '00' : '20'}`,
  terrain: 'Terrain de foot',
  scoreA: sa as number,
  scoreB: sb as number,
  statut: 'terminé',
}))

/* ------------------------------------------------------------------ */
/*  Édition 2024 (Grèce antique)                                       */
/* ------------------------------------------------------------------ */

const equipes2024: Equipe[] = [
  { annee: 2024, nom: 'Salade Grecque', theme: 'Athènes', emoji: '🥗', couleur: '#06D6A0', points_total: 140, rang: 1, note: '' },
  { annee: 2024, nom: 'Les Spartiates', theme: 'Sparte', emoji: '🛡️', couleur: '#EF476F', points_total: 120, rang: 2, note: '' },
  { annee: 2024, nom: 'Les Dieux', theme: 'Olympe', emoji: '⚡', couleur: '#FFB703', points_total: 110, rang: 3, note: '' },
  { annee: 2024, nom: 'Les Minotaures', theme: 'Crète', emoji: '🐂', couleur: '#118AB2', points_total: 90, rang: 4, note: '' },
]

const points2024: Record<string, number[]> = {
  // [Salade Grecque, Les Spartiates, Les Dieux, Les Minotaures]
  'Pétanque grecque': [50, 40, 40, 30],
  'Course de chars': [45, 40, 35, 30],
  "Lancer d'amphore": [45, 40, 35, 30],
}

const noms2024 = equipes2024.map((e) => e.nom)

/* ------------------------------------------------------------------ */
/*  Édition 2026 (affiches de films) — les 4 équipes avec photos       */
/* ------------------------------------------------------------------ */

// Équipes nommées par couleur (comme dans le vrai Sheet), avec un nom d'affichage.
const equipes2026: Equipe[] = [
  { annee: 2026, nom: 'Orange', nomAffiche: "Un indien dans l'Île", theme: 'Aventure', emoji: '🟠', couleur: '#F97316', points_total: 150, rang: 1, note: '' },
  { annee: 2026, nom: 'Vert', nomAffiche: "L'ayeuture c'est l'aventure", theme: 'Comédie', emoji: '🟢', couleur: '#22C55E', points_total: 135, rang: 2, note: '' },
  { annee: 2026, nom: 'Jaune', nomAffiche: 'Les petits jaunes', theme: 'Pastis', emoji: '🟡', couleur: '#FDCB2D', points_total: 120, rang: 3, note: '' },
  { annee: 2026, nom: 'Violet', nomAffiche: 'Les grappes en folie', theme: 'Vendanges', emoji: '🟣', couleur: '#7C3AED', points_total: 95, rang: 4, note: '' },
]

/* ------------------------------------------------------------------ */
/*  Config (globale + par année) et Légende (globale)                  */
/* ------------------------------------------------------------------ */

const configRows: ConfigRow[] = [
  // Lignes globales (annee vide)
  { annee: '', cle: 'annee_defaut', valeur: '2025' },
  { annee: '', cle: 'prochaine_edition', valeur: 'samedi 14 août 2027' },
  { annee: '', cle: 'prochaine_date_iso', valeur: '2027-08-14' },
  { annee: '', cle: 'prochaine_note', valeur: 'Préparez-vous à écrire la suite 💪' },
  // Édition 2025
  { annee: '2025', cle: 'nom_edition', valeur: 'OlympYeu 2025' },
  { annee: '2025', cle: 'date', valeur: 'samedi 16 août 2025' },
  { annee: '2025', cle: 'lieu', valeur: "Île d'Yeu" },
  { annee: '2025', cle: 'theme', valeur: 'Cinéma & BD' },
  { annee: '2025', cle: 'couleur_primaire', valeur: '#0EA5E9' },
  {
    annee: '2025',
    cle: 'message_accueil',
    valeur: 'Astérix & Obélix : par Toutatis, que la fête commence ! 🛡️',
  },
  // Édition 2024
  { annee: '2024', cle: 'nom_edition', valeur: 'OlympYeu 2024' },
  { annee: '2024', cle: 'date', valeur: 'samedi 17 août 2024' },
  { annee: '2024', cle: 'lieu', valeur: "Île d'Yeu" },
  { annee: '2024', cle: 'theme', valeur: 'Grèce antique' },
  { annee: '2024', cle: 'couleur_primaire', valeur: '#06D6A0' },
  { annee: '2024', cle: 'message_accueil', valeur: "Bienvenue aux Yeu'Olympiques antiques ! 🏛️" },
  // Édition 2026
  { annee: '2026', cle: 'nom_edition', valeur: 'OlympYeu 2026' },
  { annee: '2026', cle: 'date', valeur: 'samedi 16 août 2026' },
  { annee: '2026', cle: 'lieu', valeur: "Île d'Yeu" },
  { annee: '2026', cle: 'theme', valeur: 'Affiches de films' },
  { annee: '2026', cle: 'couleur_primaire', valeur: '#F97316' },
  { annee: '2026', cle: 'message_accueil', valeur: "L'aYEUture c'est l'aventure ! 🎬" },
]

const legende: LegendeEntry[] = [
  { annee: 2018, champion: 'Yeullow', emoji: '🏄', note: '', photo: '' },
  { annee: 2019, champion: "Belg'Yeu", emoji: '🇧🇪', note: '', photo: '' },
  { annee: 2020, champion: 'Copains comme cochons', emoji: '🐷', note: '', photo: '' },
  { annee: 2021, champion: '', emoji: '😷', note: 'Annulée — Covid', photo: '' },
  { annee: 2022, champion: "Franchou'Yeu", emoji: '🇫🇷', note: '', photo: '' },
  { annee: 2023, champion: 'Éléphant Blyeu', emoji: '🐘', note: '', photo: '' },
  { annee: 2024, champion: 'Salade Grecque', emoji: '🇬🇷', note: '', photo: '' },
  { annee: 2025, champion: 'Astérix & Obélix', emoji: '🛡️', note: '', photo: '' },
  { annee: 2026, champion: "Un indien dans l'Île", emoji: '🏹', note: '', photo: '' },
]

/* ------------------------------------------------------------------ */
/*  Assemblage MultiYearData                                           */
/* ------------------------------------------------------------------ */

export const fallbackData: MultiYearData = {
  configRows,
  equipes: [...equipes2026, ...equipes2025, ...equipes2024],
  participants: [
    // 2025
    ...['Augustin', 'Camille', 'Hugo', 'Léa'].map((nom) => ({ annee: 2025, nom, equipe: 'Top Yeu' })),
    ...['Paul', 'Sarah', 'Nicolas', 'Emma'].map((nom) => ({ annee: 2025, nom, equipe: 'Les Bronzés' })),
    ...['Julien', 'Marine', 'Maxime', 'Clara'].map((nom) => ({ annee: 2025, nom, equipe: 'Astérix & Obélix' })),
    ...['Pierre', 'Anaïs', 'Romain', 'Élise'].map((nom) => ({ annee: 2025, nom, equipe: 'E.T.' })),
    // 2024
    ...['Augustin', 'Léa', 'Sarah'].map((nom) => ({ annee: 2024, nom, equipe: 'Salade Grecque' })),
    ...['Paul', 'Julien'].map((nom) => ({ annee: 2024, nom, equipe: 'Les Spartiates' })),
    ...['Hugo', 'Clara'].map((nom) => ({ annee: 2024, nom, equipe: 'Les Dieux' })),
    ...['Pierre', 'Marine'].map((nom) => ({ annee: 2024, nom, equipe: 'Les Minotaures' })),
  ],
  epreuves: [
    // 2025
    { annee: 2025, ordre: 1, nom: 'Volley Ball', horaire: '10h00 - 11h00', duree: '1h', lieu: 'Plage des Sableaux', format: 'Tous ensemble (round-robin)', regles: 'Chaque équipe affronte les autres en matchs courts.', systeme_points: 'Match en 10 pts, on gagne le nombre de points marqués, +5 pts bonus au vainqueur.' },
    { annee: 2025, ordre: 2, nom: 'Balle aux prisonniers', horaire: '11h00 - 11h45', duree: '45 min', lieu: 'Plage des Sableaux', format: 'Tous ensemble', regles: 'Élimine les adversaires en les touchant avec la balle.', systeme_points: 'Match en 10 pts, on gagne le nombre de points marqués.' },
    { annee: 2025, ordre: 3, nom: 'Spike Ball', horaire: '11h45 - 12h30', duree: '45 min', lieu: 'Plage', format: '2 vs 2', regles: '3 matchs par équipe, dont 1 match 100 % féminin.', systeme_points: 'Match en 10 pts, points marqués + 5 pts bonus vainqueur.' },
    { annee: 2025, ordre: 4, nom: 'Bombe à eau', horaire: '12h30 - 13h00', duree: '30 min', lieu: 'Jardin', format: 'Tous ensemble', regles: "Fais voyager la bombe à eau le plus loin possible sans l'éclater.", systeme_points: 'Classement : 1er = 25, 2e = 12, 3e = 6, 4e = 2.' },
    { annee: 2025, ordre: 5, nom: 'Football 3x3', horaire: '14h00 - 15h00', duree: '1h', lieu: 'Terrain de foot', format: '3 vs 3', regles: 'Chaque équipe affronte les 3 autres. Match en 1 but.', systeme_points: 'Match en 1 but : vainqueur = 10, perdant = 0.' },
    { annee: 2025, ordre: 6, nom: 'Baby-Foot', horaire: '15h00 - 15h45', duree: '45 min', lieu: 'Bar de la plage', format: '1 vs 1', regles: 'Duels en 1 manche, dont 1 match 100 % féminin.', systeme_points: 'Match en 1 manche : vainqueur = 10, perdant = 0.' },
    { annee: 2025, ordre: 7, nom: 'Tournante géante', horaire: '15h45 - 16h30', duree: '45 min', lieu: 'Table de ping-pong', format: 'Tous ensemble', regles: 'La tournante géante autour de la table, dernier éliminé.', systeme_points: 'Classement 25 / 12 / 6 / 2.' },
    { annee: 2025, ordre: 8, nom: 'Ventriglisse + Flip Cup', horaire: '16h30 - 17h30', duree: '1h', lieu: 'Grande pelouse', format: 'Tous ensemble', regles: 'Relais : ventriglisse puis flip cup en équipe.', systeme_points: 'Classement 25 / 12 / 6 / 2.' },
    { annee: 2025, ordre: 9, nom: 'Déguisement', horaire: 'Toute la journée', duree: '—', lieu: 'Partout', format: 'Avant le jour J - voté par un jury', regles: 'Meilleur déguisement sur le thème du pays de chaque équipe.', systeme_points: 'Classement 25 / 12 / 6 / 2.' },
    // 2024
    { annee: 2024, ordre: 1, nom: 'Pétanque grecque', horaire: '10h30 - 11h30', duree: '1h', lieu: 'Boulodrome', format: 'Tous ensemble', regles: 'Pétanque revisitée façon antique.', systeme_points: 'Classement de l\'épreuve.' },
    { annee: 2024, ordre: 2, nom: 'Course de chars', horaire: '11h30 - 12h30', duree: '1h', lieu: 'Grande pelouse', format: '2 vs 2', regles: 'Relais de brouettes-chars.', systeme_points: 'Classement de l\'épreuve.' },
    { annee: 2024, ordre: 3, nom: "Lancer d'amphore", horaire: '14h00 - 15h00', duree: '1h', lieu: 'Plage', format: 'Tous ensemble', regles: 'Lancer de précision.', systeme_points: 'Classement de l\'épreuve.' },
  ],
  scores: [
    ...construireScores(2025, noms2025, points2025),
    ...construireScores(2024, noms2024, points2024),
  ],
  matchs: [...matchsSpike2025, ...matchsFoot2025],
  legende,
}
