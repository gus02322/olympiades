/**
 * Types des données lues depuis le Google Sheet.
 * Chaque interface correspond à un onglet.
 */

/** Une paire clé/valeur de l'onglet Config. */
export interface ConfigEntry {
  cle: string
  valeur: string
}

/** Configuration de l'édition (issue de l'onglet Config, sous forme d'objet). */
export interface EditionConfig {
  nom_edition: string
  date: string
  lieu: string
  message_accueil: string
  couleur_primaire: string
  /** Toutes les autres clés éventuellement présentes dans l'onglet Config. */
  [cle: string]: string
}

/** Une équipe (onglet Equipes). */
export interface Equipe {
  nom: string
  theme: string
  emoji: string
  couleur: string
}

/** Un participant (onglet Participants). */
export interface Participant {
  nom: string
  equipe: string
}

/** Une épreuve (onglet Epreuves). */
export interface Epreuve {
  ordre: number
  nom: string
  horaire: string
  duree: string
  lieu: string
  format: string
  regles: string
  systeme_points: string
}

/** Un score d'une équipe sur une épreuve (onglet Scores). */
export interface Score {
  epreuve: string
  equipe: string
  points: number
  classement: number | null
}

/** Un match / confrontation (onglet Matchs, optionnel). */
export interface Match {
  epreuve: string
  equipeA: string
  equipeB: string
  horaire: string
  terrain: string
  scoreA: number | null
  scoreB: number | null
  statut: string
}

/** Une édition passée (onglet Legende). */
export interface LegendeEntry {
  annee: number
  champion: string
  emoji: string
  note: string
}

/** Ensemble complet des données de l'application. */
export interface AppData {
  config: EditionConfig
  equipes: Equipe[]
  participants: Participant[]
  epreuves: Epreuve[]
  scores: Score[]
  matchs: Match[]
  legende: LegendeEntry[]
}

/** Ligne de classement général calculée par l'app. */
export interface RangEquipe {
  equipe: Equipe
  total: number
  rang: number
  /** Écart de points avec la 1re place. */
  ecartAvecPremier: number
}
