/**
 * Calculs dérivés des données : classement général, agrégations par équipe/épreuve.
 * Le classement général est TOUJOURS recalculé à partir des points (jamais pré-calculé
 * dans le Sheet), pour rester la source de vérité.
 */

import type { AppData, Epreuve, Equipe, Match, RangEquipe, Score } from '../types'

/** Total de points d'une équipe sur toutes les épreuves. */
export function totalEquipe(scores: Score[], nomEquipe: string): number {
  return scores
    .filter((s) => s.equipe === nomEquipe)
    .reduce((somme, s) => somme + (s.points || 0), 0)
}

/**
 * Classement général : additionne les points de chaque équipe, trie du plus grand
 * au plus petit, attribue un rang (ex æquo possibles) et calcule l'écart avec le 1er.
 */
export function classementGeneral(equipes: Equipe[], scores: Score[]): RangEquipe[] {
  const lignes = equipes.map((equipe) => ({
    equipe,
    total: totalEquipe(scores, equipe.nom),
  }))

  lignes.sort((a, b) => b.total - a.total)

  const meilleurTotal = lignes.length > 0 ? lignes[0].total : 0

  // Rang « standard » : deux ex æquo partagent le même rang.
  const resultat: RangEquipe[] = []
  lignes.forEach((ligne, index) => {
    const precedent = resultat[index - 1]
    const rang =
      precedent && precedent.total === ligne.total ? precedent.rang : index + 1
    resultat.push({
      equipe: ligne.equipe,
      total: ligne.total,
      rang,
      ecartAvecPremier: meilleurTotal - ligne.total,
    })
  })
  return resultat
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
 * Sert à déduire le numéro du prochain « chapitre ».
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
