/**
 * Types des données lues depuis le Google Sheet (structure MULTI-ANNÉES).
 * Chaque onglet (sauf Legende) porte désormais une colonne « annee ».
 */

/** Une ligne brute de l'onglet Config (annee peut être vide = ligne globale). */
export interface ConfigRow {
  annee: string
  cle: string
  valeur: string
}

/** Configuration résolue d'une édition (globale + spécifique à l'année choisie). */
export interface EditionConfig {
  nom_edition: string
  date: string
  lieu: string
  message_accueil: string
  couleur_primaire: string
  theme: string
  /** Toutes les autres clés éventuelles (prochaine_edition, prochaine_date_iso, …). */
  [cle: string]: string
}

/** Une équipe (onglet Equipes). */
export interface Equipe {
  annee: number
  nom: string
  theme: string
  emoji: string
  couleur: string
  /** Total pré-calculé éventuel (sinon on somme les Scores). */
  points_total: number | null
  /** Rang imposé éventuel (1 = champion), sinon calculé par total. */
  rang: number | null
  /** Note libre (ex. « Vainqueur de la finale »). */
  note: string
}

/** Un participant (onglet Participants). */
export interface Participant {
  annee: number
  nom: string
  equipe: string
}

/** Une épreuve (onglet Epreuves). */
export interface Epreuve {
  annee: number
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
  annee: number
  epreuve: string
  equipe: string
  points: number
  classement: number | null
}

/** Un match / confrontation (onglet Matchs, optionnel). */
export interface Match {
  annee: number
  epreuve: string
  equipeA: string
  equipeB: string
  horaire: string
  terrain: string
  scoreA: number | null
  scoreB: number | null
  statut: string
}

/** Une édition passée (onglet Legende) — GLOBAL, couvre toutes les années. */
export interface LegendeEntry {
  annee: number
  champion: string
  emoji: string
  note: string
  /** Photo de l'équipe gagnante (URL complète, ou nom de fichier dans public/legende/). */
  photo: string
}

/**
 * Données brutes multi-années : tout est conservé, on filtre ensuite par année.
 */
export interface MultiYearData {
  configRows: ConfigRow[]
  equipes: Equipe[]
  participants: Participant[]
  epreuves: Epreuve[]
  scores: Score[]
  matchs: Match[]
  legende: LegendeEntry[]
}

/**
 * Vue d'une seule année (ce que consomment les écrans).
 * `config` est résolue (globale + année), les listes sont filtrées sur `annee`,
 * `legende` reste GLOBALE.
 */
export interface AppData {
  annee: number
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
  /** Écart de points avec le 1er (0 si négatif/non pertinent). */
  ecartAvecPremier: number
  /** Note éventuelle de l'équipe (ex. vainqueur de la finale). */
  note: string
}
