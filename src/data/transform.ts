/**
 * Calculs dérivés (multi-années) : liste des années, filtrage par année,
 * classement général (total + ordre par rang imposé), agrégations.
 */

import type {
  AppData,
  Epreuve,
  Equipe,
  Match,
  MultiYearData,
  RangEquipe,
  Score,
} from '../types'
import { normaliserCle } from './gviz'
import { resoudreConfig } from './mappers'

/** Liste des années présentes dans les données (union), triées de la + récente à la + ancienne. */
export function anneesDisponibles(raw: MultiYearData): number[] {
  const set = new Set<number>()
  const add = (a: number) => {
    if (a && a > 0) set.add(a)
  }
  raw.equipes.forEach((e) => add(e.annee))
  raw.participants.forEach((p) => add(p.annee))
  raw.epreuves.forEach((e) => add(e.annee))
  raw.scores.forEach((s) => add(s.annee))
  raw.matchs.forEach((m) => add(m.annee))
  raw.configRows.forEach((r) => {
    const n = Number(r.annee)
    if (Number.isFinite(n)) add(n)
  })
  return [...set].sort((a, b) => b - a)
}

/** Valeur d'une clé globale de Config (annee vide), sinon ''. */
export function configGlobale(raw: MultiYearData, cle: string): string {
  const k = normaliserCle(cle)
  const row = raw.configRows.find((r) => r.annee.trim() === '' && normaliserCle(r.cle) === k)
  return row?.valeur ?? ''
}

/** Année par défaut : clé Config « annee_defaut » si valide, sinon la plus récente. */
export function anneeDefaut(raw: MultiYearData, annees: number[]): number {
  const brut = Number(configGlobale(raw, 'annee_defaut'))
  if (Number.isFinite(brut) && annees.includes(brut)) return brut
  return annees[0] ?? 0
}

/** Construit la vue d'une année (config résolue, listes filtrées, légende globale). */
export function filtrerParAnnee(raw: MultiYearData, annee: number): AppData {
  return {
    annee,
    config: resoudreConfig(raw.configRows, annee),
    equipes: raw.equipes.filter((e) => e.annee === annee),
    participants: raw.participants.filter((p) => p.annee === annee),
    epreuves: raw.epreuves.filter((e) => e.annee === annee),
    scores: raw.scores.filter((s) => s.annee === annee),
    matchs: raw.matchs.filter((m) => m.annee === annee),
    legende: raw.legende, // GLOBAL (toutes années)
  }
}

/** Total d'une équipe : colonne points_total si remplie, sinon somme des Scores. */
export function totalEquipe(equipe: Equipe, scores: Score[]): number {
  if (equipe.points_total !== null) return equipe.points_total
  return scores
    .filter((s) => s.equipe === equipe.nom)
    .reduce((somme, s) => somme + (s.points || 0), 0)
}

/**
 * Classement général d'une année.
 * - TOTAL = points_total sinon somme des Scores.
 * - ORDRE = colonne « rang » si au moins une équipe la renseigne (1 = champion),
 *   sinon tri par total décroissant.
 * L'écart affiché reste relatif au total du 1er (0 si négatif).
 */
export function classementGeneral(equipes: Equipe[], scores: Score[]): RangEquipe[] {
  const lignes = equipes.map((equipe) => ({ equipe, total: totalEquipe(equipe, scores) }))

  const utiliserRang = equipes.some((e) => e.rang !== null)
  if (utiliserRang) {
    lignes.sort((a, b) => {
      const ra = a.equipe.rang ?? Number.POSITIVE_INFINITY
      const rb = b.equipe.rang ?? Number.POSITIVE_INFINITY
      if (ra !== rb) return ra - rb
      return b.total - a.total
    })
  } else {
    lignes.sort((a, b) => b.total - a.total)
  }

  const premierTotal = lignes.length > 0 ? lignes[0].total : 0

  return lignes.map((ligne, index) => {
    const rang = ligne.equipe.rang ?? index + 1
    return {
      equipe: ligne.equipe,
      total: ligne.total,
      rang,
      ecartAvecPremier: Math.max(0, premierTotal - ligne.total),
      note: ligne.equipe.note,
    }
  })
}

/** Score d'une équipe sur une épreuve précise (ou null si pas de score saisi). */
export function scoreEquipeEpreuve(
  scores: Score[],
  epreuve: string,
  equipe: string,
): Score | null {
  return scores.find((s) => s.epreuve === epreuve && s.equipe === equipe) ?? null
}

/** Tous les scores d'une épreuve, triés par classement puis par points décroissants. */
export function scoresParEpreuve(scores: Score[], epreuve: string): Score[] {
  return scores
    .filter((s) => s.epreuve === epreuve)
    .sort((a, b) => {
      if (a.classement !== null && b.classement !== null) return a.classement - b.classement
      return b.points - a.points
    })
}

/** Tous les matchs rattachés à une épreuve. */
export function matchsParEpreuve(matchs: Match[], epreuve: string): Match[] {
  return matchs.filter((m) => m.epreuve === epreuve)
}

/** Retrouve une équipe par son nom (tolérant à la casse/espaces). */
export function trouverEquipe(equipes: Equipe[], nom: string): Equipe | undefined {
  const cible = nom.trim().toLowerCase()
  return equipes.find((e) => e.nom.trim().toLowerCase() === cible)
}

/** Retrouve l'équipe d'un participant à partir de son prénom. */
export function equipeDuParticipant(data: AppData, prenom: string): Equipe | undefined {
  const p = data.participants.find(
    (x) => x.nom.trim().toLowerCase() === prenom.trim().toLowerCase(),
  )
  if (!p) return undefined
  return trouverEquipe(data.equipes, p.equipe)
}

/** Membres d'une équipe donnée. */
export function membresEquipe(data: AppData, nomEquipe: string): string[] {
  return data.participants
    .filter((p) => p.equipe.trim().toLowerCase() === nomEquipe.trim().toLowerCase())
    .map((p) => p.nom)
}

/**
 * Nombre d'éditions réellement disputées dans « La Légende »
 * (les années annulées — présence d'une note — ne comptent pas).
 */
export function editionsDisputees(legende: { note: string }[]): number {
  return legende.filter((l) => !l.note || l.note.trim() === '').length
}

/** Épreuves triées par ordre puis horaire (pour la timeline du programme). */
export function epreuvesTriees(epreuves: Epreuve[]): Epreuve[] {
  return [...epreuves].sort((a, b) => {
    if (a.ordre !== b.ordre) return a.ordre - b.ordre
    return a.horaire.localeCompare(b.horaire)
  })
}
