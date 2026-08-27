/**
 * Données de démonstration (édition 2025) utilisées :
 *  - tant que SHEET_ID n'est pas renseigné dans src/config.ts ;
 *  - ou en dernier recours si le réseau échoue ET qu'aucun cache n'existe.
 *
 * Ainsi l'application est déjà vivante et jolie avant même de brancher le Sheet.
 * Les chiffres sont approximatifs (issus du tableur d'origine), pour l'affichage.
 */

import type { AppData, Match, Score } from '../types'

/** Les 4 équipes de l'édition 2025 (thèmes de déguisement : USA, Grèce, Égypte, Mexique). */
const equipes = [
  { nom: 'Top Yeu', theme: 'USA', emoji: '🦅', couleur: '#EF476F' },
  { nom: 'Les Bronzés', theme: 'Grèce', emoji: '🏛️', couleur: '#FFB703' },
  { nom: 'Astérix & Obélix', theme: 'Égypte', emoji: '🛡️', couleur: '#06D6A0' },
  { nom: 'E.T.', theme: 'Mexique', emoji: '🛸', couleur: '#118AB2' },
]

/**
 * Points par épreuve, dans l'ordre des équipes ci-dessus [Top Yeu, Les Bronzés, Astérix, E.T.].
 * Le classement par épreuve (rang) est calculé automatiquement plus bas.
 */
const pointsParEpreuve: Record<string, [number, number, number, number]> = {
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

/** Construit les lignes de Scores + le classement (rang) de chaque épreuve. */
function construireScores(): Score[] {
  const scores: Score[] = []
  for (const [epreuve, pts] of Object.entries(pointsParEpreuve)) {
    // On associe chaque équipe à ses points, puis on trie pour attribuer un rang.
    const lignes = equipes.map((e, i) => ({ equipe: e.nom, points: pts[i] }))
    const tri = [...lignes].sort((a, b) => b.points - a.points)
    const rangParEquipe = new Map<string, number>()
    tri.forEach((l, idx) => {
      const precedent = tri[idx - 1]
      const rang =
        precedent && precedent.points === l.points
          ? rangParEquipe.get(precedent.equipe)!
          : idx + 1
      rangParEquipe.set(l.equipe, rang)
    })
    for (const l of lignes) {
      scores.push({
        epreuve,
        equipe: l.equipe,
        points: l.points,
        classement: rangParEquipe.get(l.equipe) ?? null,
      })
    }
  }
  return scores
}

/** Résultats de foot 3x3 (match en 1 but) — cohérents avec les totaux ci-dessus. */
const matchsFoot: Match[] = [
  ['Top Yeu', 'Les Bronzés', 0, 1],
  ['Astérix & Obélix', 'E.T.', 0, 1],
  ['Top Yeu', 'Astérix & Obélix', 0, 1],
  ['Les Bronzés', 'E.T.', 0, 1],
  ['Les Bronzés', 'Astérix & Obélix', 0, 1],
  ['Top Yeu', 'E.T.', 0, 1],
].map(([a, b, sa, sb], i) => ({
  epreuve: 'Football 3x3',
  equipeA: a as string,
  equipeB: b as string,
  horaire: `${14 + Math.floor(i / 2)}h${i % 2 === 0 ? '00' : '20'}`,
  terrain: 'Terrain de foot',
  scoreA: sa as number,
  scoreB: sb as number,
  statut: 'terminé',
}))

/** Résultats de Spike Ball (match en 10 pts) — illustratifs. */
const matchsSpike: Match[] = [
  ['Top Yeu', 'Les Bronzés', 10, 6, '11h45'],
  ['Astérix & Obélix', 'E.T.', 8, 10, '11h55'],
  ['Top Yeu', 'Astérix & Obélix', 10, 9, '12h05'],
  ['Les Bronzés', 'E.T.', 5, 10, '12h15'],
  ['Les Bronzés', 'Astérix & Obélix', 7, 10, '12h20'],
  ['Top Yeu', 'E.T.', 10, 8, '12h25'],
].map(([a, b, sa, sb, h]) => ({
  epreuve: 'Spike Ball',
  equipeA: a as string,
  equipeB: b as string,
  horaire: h as string,
  terrain: 'Plage',
  scoreA: sa as number,
  scoreB: sb as number,
  statut: 'terminé',
}))

/** Objet AppData complet de démonstration. */
export const fallbackData: AppData = {
  config: {
    nom_edition: 'OlympYeu 2025',
    date: 'samedi 16 août 2025',
    lieu: "Île d'Yeu",
    message_accueil: "Astérix & Obélix : par Toutatis, que la fête commence ! 🛡️",
    couleur_primaire: '#0EA5E9',
    // Clés optionnelles utilisées par l'écran « La Légende » (teaser du prochain chapitre).
    prochaine_edition: 'samedi 14 août 2027',
    prochaine_date_iso: '2027-08-14', // format AAAA-MM-JJ pour le compte à rebours
    prochaine_note: 'Préparez-vous à écrire le prochain chapitre 💪',
  },
  equipes,
  participants: [
    // Top Yeu
    { nom: 'Augustin', equipe: 'Top Yeu' },
    { nom: 'Camille', equipe: 'Top Yeu' },
    { nom: 'Hugo', equipe: 'Top Yeu' },
    { nom: 'Léa', equipe: 'Top Yeu' },
    { nom: 'Thomas', equipe: 'Top Yeu' },
    { nom: 'Manon', equipe: 'Top Yeu' },
    // Les Bronzés
    { nom: 'Paul', equipe: 'Les Bronzés' },
    { nom: 'Sarah', equipe: 'Les Bronzés' },
    { nom: 'Nicolas', equipe: 'Les Bronzés' },
    { nom: 'Emma', equipe: 'Les Bronzés' },
    { nom: 'Antoine', equipe: 'Les Bronzés' },
    { nom: 'Chloé', equipe: 'Les Bronzés' },
    // Astérix & Obélix
    { nom: 'Julien', equipe: 'Astérix & Obélix' },
    { nom: 'Marine', equipe: 'Astérix & Obélix' },
    { nom: 'Maxime', equipe: 'Astérix & Obélix' },
    { nom: 'Clara', equipe: 'Astérix & Obélix' },
    { nom: 'Lucas', equipe: 'Astérix & Obélix' },
    { nom: 'Justine', equipe: 'Astérix & Obélix' },
    // E.T.
    { nom: 'Pierre', equipe: 'E.T.' },
    { nom: 'Anaïs', equipe: 'E.T.' },
    { nom: 'Romain', equipe: 'E.T.' },
    { nom: 'Élise', equipe: 'E.T.' },
    { nom: 'Quentin', equipe: 'E.T.' },
    { nom: 'Laura', equipe: 'E.T.' },
  ],
  epreuves: [
    {
      ordre: 1,
      nom: 'Volley Ball',
      horaire: '10h00 - 11h00',
      duree: '1h',
      lieu: 'Plage des Sableaux',
      format: 'Tous ensemble (round-robin)',
      regles: 'Chaque équipe affronte les autres en matchs courts.',
      systeme_points:
        'Match en 10 pts, on gagne le nombre de points marqués, +5 pts bonus au vainqueur.',
    },
    {
      ordre: 2,
      nom: 'Balle aux prisonniers',
      horaire: '11h00 - 11h45',
      duree: '45 min',
      lieu: 'Plage des Sableaux',
      format: 'Tous ensemble',
      regles: 'Élimine les adversaires en les touchant avec la balle.',
      systeme_points: 'Match en 10 pts, on gagne le nombre de points marqués.',
    },
    {
      ordre: 3,
      nom: 'Spike Ball',
      horaire: '11h45 - 12h30',
      duree: '45 min',
      lieu: 'Plage',
      format: '2 vs 2',
      regles: '3 matchs par équipe, dont 1 match 100 % féminin.',
      systeme_points: 'Match en 10 pts, points marqués + 5 pts bonus vainqueur.',
    },
    {
      ordre: 4,
      nom: 'Bombe à eau',
      horaire: '12h30 - 13h00',
      duree: '30 min',
      lieu: 'Jardin',
      format: 'Tous ensemble',
      regles: "Fais voyager la bombe à eau le plus loin possible sans l'éclater.",
      systeme_points: 'Classement : 1er = 25, 2e = 12, 3e = 6, 4e = 2.',
    },
    {
      ordre: 5,
      nom: 'Football 3x3',
      horaire: '14h00 - 15h00',
      duree: '1h',
      lieu: 'Terrain de foot',
      format: '3 vs 3',
      regles: 'Chaque équipe affronte les 3 autres. Match en 1 but.',
      systeme_points: 'Match en 1 but : vainqueur = 10, perdant = 0.',
    },
    {
      ordre: 6,
      nom: 'Baby-Foot',
      horaire: '15h00 - 15h45',
      duree: '45 min',
      lieu: 'Bar de la plage',
      format: '1 vs 1',
      regles: 'Duels en 1 manche, dont 1 match 100 % féminin.',
      systeme_points: 'Match en 1 manche : vainqueur = 10, perdant = 0.',
    },
    {
      ordre: 7,
      nom: 'Tournante géante',
      horaire: '15h45 - 16h30',
      duree: '45 min',
      lieu: 'Table de ping-pong',
      format: 'Tous ensemble',
      regles: 'La tournante géante autour de la table, dernier éliminé.',
      systeme_points: 'Classement 25 / 12 / 6 / 2.',
    },
    {
      ordre: 8,
      nom: 'Ventriglisse + Flip Cup',
      horaire: '16h30 - 17h30',
      duree: '1h',
      lieu: 'Grande pelouse',
      format: 'Tous ensemble',
      regles: 'Relais : ventriglisse puis flip cup en équipe.',
      systeme_points: 'Classement 25 / 12 / 6 / 2.',
    },
    {
      ordre: 9,
      nom: 'Déguisement',
      horaire: 'Toute la journée',
      duree: '—',
      lieu: 'Partout',
      format: 'Avant le jour J, voté par un jury',
      regles: 'Meilleur déguisement sur le thème du pays de chaque équipe.',
      systeme_points: 'Classement 25 / 12 / 6 / 2.',
    },
  ],
  scores: construireScores(),
  matchs: [...matchsSpike, ...matchsFoot],
  legende: [
    { annee: 2018, champion: 'Yeullow', emoji: '🏄', note: '', photo: '' },
    { annee: 2019, champion: "Belg'Yeu", emoji: '🇧🇪', note: '', photo: '' },
    { annee: 2020, champion: 'Copains comme cochons', emoji: '🐷', note: '', photo: '' },
    { annee: 2021, champion: '', emoji: '😷', note: 'Annulée — Covid', photo: '' },
    { annee: 2022, champion: "Franchou'Yeu", emoji: '🇫🇷', note: '', photo: '' },
    { annee: 2023, champion: 'Éléphant Blyeu', emoji: '🐘', note: '', photo: '' },
    { annee: 2024, champion: 'Salade Grecque', emoji: '🇬🇷', note: '', photo: '' },
    { annee: 2025, champion: 'Astérix & Obélix', emoji: '🛡️', note: '', photo: '' },
    { annee: 2026, champion: "Un indien dans l'Île", emoji: '🏹', note: '', photo: '' },
  ],
}
