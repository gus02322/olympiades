/**
 * Conversion des lignes brutes (issues de gviz) vers les types de l'application.
 * Tout est tolérant : si une colonne optionnelle manque, on met une valeur par défaut
 * plutôt que de planter.
 */

import type {
  AppData,
  ConfigEntry,
  EditionConfig,
  Epreuve,
  Equipe,
  LegendeEntry,
  Match,
  Participant,
  Score,
} from '../types'
import { normaliserCle } from './gviz'

type Row = Record<string, string | number>

/** Récupère une valeur texte d'une ligne, quelle que soit la casse/accentuation de la clé. */
function texte(row: Row, ...cles: string[]): string {
  for (const cle of cles) {
    const k = normaliserCle(cle)
    if (row[k] !== undefined && row[k] !== null && row[k] !== '') return String(row[k]).trim()
  }
  return ''
}

/** Récupère un nombre d'une ligne (accepte les virgules décimales), sinon `defaut`. */
function nombre(row: Row, cle: string, defaut = 0): number {
  const k = normaliserCle(cle)
  const v = row[k]
  if (v === undefined || v === null || v === '') return defaut
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(',', '.').replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(n) ? n : defaut
}

/** Récupère un nombre ou null si la cellule est vide. */
function nombreOuNull(row: Row, cle: string): number | null {
  const k = normaliserCle(cle)
  const v = row[k]
  if (v === undefined || v === null || v === '') return null
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(',', '.').replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(n) ? n : null
}

/** Onglet Config → objet clé/valeur exploitable. */
export function mapConfig(rows: Row[]): EditionConfig {
  const base: EditionConfig = {
    nom_edition: '',
    date: '',
    lieu: '',
    message_accueil: '',
    couleur_primaire: '',
  }
  for (const row of rows) {
    const entry: ConfigEntry = {
      cle: texte(row, 'cle', 'clé', 'key'),
      valeur: texte(row, 'valeur', 'value'),
    }
    if (entry.cle) base[normaliserCle(entry.cle)] = entry.valeur
  }
  return base
}

export function mapEquipes(rows: Row[]): Equipe[] {
  return rows
    .map((row) => ({
      nom: texte(row, 'nom', 'equipe', 'équipe'),
      theme: texte(row, 'theme', 'thème'),
      emoji: texte(row, 'emoji') || '🏳️',
      couleur: texte(row, 'couleur', 'color') || '#0EA5E9',
    }))
    .filter((e) => e.nom !== '')
}

export function mapParticipants(rows: Row[]): Participant[] {
  return rows
    .map((row) => ({
      nom: texte(row, 'nom', 'prenom', 'prénom'),
      equipe: texte(row, 'equipe', 'équipe'),
    }))
    .filter((p) => p.nom !== '')
}

export function mapEpreuves(rows: Row[]): Epreuve[] {
  return rows
    .map((row, i) => ({
      ordre: nombre(row, 'ordre', i + 1),
      nom: texte(row, 'nom', 'epreuve', 'épreuve'),
      horaire: texte(row, 'horaire'),
      duree: texte(row, 'duree', 'durée'),
      lieu: texte(row, 'lieu'),
      format: texte(row, 'format'),
      regles: texte(row, 'regles', 'règles'),
      systeme_points: texte(row, 'systeme_points', 'système_points', 'systeme points'),
    }))
    .filter((e) => e.nom !== '')
    .sort((a, b) => a.ordre - b.ordre)
}

export function mapScores(rows: Row[]): Score[] {
  return rows
    .map((row) => ({
      epreuve: texte(row, 'epreuve', 'épreuve'),
      equipe: texte(row, 'equipe', 'équipe'),
      points: nombre(row, 'points', 0),
      classement: nombreOuNull(row, 'classement'),
    }))
    .filter((s) => s.epreuve !== '' && s.equipe !== '')
}

export function mapMatchs(rows: Row[]): Match[] {
  return rows
    .map((row) => ({
      epreuve: texte(row, 'epreuve', 'épreuve'),
      equipeA: texte(row, 'equipeA', 'equipe_a', 'équipea'),
      equipeB: texte(row, 'equipeB', 'equipe_b', 'équipeb'),
      horaire: texte(row, 'horaire'),
      terrain: texte(row, 'terrain', 'lieu'),
      scoreA: nombreOuNull(row, 'scoreA'),
      scoreB: nombreOuNull(row, 'scoreB'),
      statut: texte(row, 'statut', 'status') || 'à venir',
    }))
    .filter((m) => m.equipeA !== '' && m.equipeB !== '')
}

export function mapLegende(rows: Row[]): LegendeEntry[] {
  return rows
    .map((row) => ({
      annee: nombre(row, 'annee', 0),
      champion: texte(row, 'champion', 'vainqueur'),
      emoji: texte(row, 'emoji') || '🏆',
      note: texte(row, 'note'),
      photo: texte(row, 'photo', 'image', 'url'),
    }))
    .filter((l) => l.annee > 0)
    .sort((a, b) => a.annee - b.annee)
}

/** Assemble un objet AppData à partir des lignes brutes de chaque onglet. */
export function assembler(raw: {
  config: Row[]
  equipes: Row[]
  participants: Row[]
  epreuves: Row[]
  scores: Row[]
  matchs: Row[]
  legende: Row[]
}): AppData {
  return {
    config: mapConfig(raw.config),
    equipes: mapEquipes(raw.equipes),
    participants: mapParticipants(raw.participants),
    epreuves: mapEpreuves(raw.epreuves),
    scores: mapScores(raw.scores),
    matchs: mapMatchs(raw.matchs),
    legende: mapLegende(raw.legende),
  }
}
