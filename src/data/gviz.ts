/**
 * Parseur robuste des réponses « gviz » de Google Sheets.
 *
 * L'endpoint gviz renvoie du JSONP enveloppé, du type :
 *   /*O_o*\/
 *   google.visualization.Query.setResponse({ ... });
 *
 * On retire ce préfixe/suffixe puis on fait un JSON.parse, et on transforme
 * la table (colonnes + lignes) en un simple tableau d'objets { entête: valeur }.
 *
 * Aucune clé API n'est nécessaire : il suffit que le Sheet soit partagé
 * en lecture (« Tout utilisateur disposant du lien : Lecteur »).
 */

import { SHEET_ID } from '../config'

/** Construit l'URL gviz pour un onglet donné. */
export function gvizUrl(sheetId: string, onglet: string): string {
  const params = new URLSearchParams({
    tqx: 'out:json',
    sheet: onglet,
    headers: '1', // force la 1re ligne comme entêtes de colonnes
  })
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${params.toString()}`
}

/** Enlève les accents et met en minuscules pour comparer des entêtes de façon tolérante. */
export function normaliserCle(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // supprime les accents
    .trim()
    .toLowerCase()
}

/** Structure minimale attendue dans la réponse gviz. */
interface GvizCol {
  label?: string
  id?: string
  type?: string
}
interface GvizCell {
  v: unknown
  f?: string
}
interface GvizTable {
  cols: GvizCol[]
  rows: { c: (GvizCell | null)[] }[]
}
interface GvizResponse {
  status: string
  table?: GvizTable
  errors?: { message?: string; detailed_message?: string }[]
}

/**
 * Extrait l'objet JSON contenu dans la réponse JSONP de gviz.
 * Tolérant aux variations de préfixe/suffixe.
 */
function extraireJson(texte: string): GvizResponse {
  // On cherche la première "{" et la dernière "}" pour isoler l'objet.
  const debut = texte.indexOf('{')
  const fin = texte.lastIndexOf('}')
  if (debut === -1 || fin === -1 || fin <= debut) {
    throw new Error('Réponse gviz illisible (format inattendu).')
  }
  const json = texte.slice(debut, fin + 1)
  return JSON.parse(json) as GvizResponse
}

/**
 * Convertit une valeur de cellule gviz en type utile.
 * Les nombres restent des nombres, les dates deviennent des chaînes lisibles,
 * les cellules vides deviennent une chaîne vide.
 */
function valeurCellule(cell: GvizCell | null): string | number {
  if (!cell || cell.v === null || cell.v === undefined) return ''
  const v = cell.v
  if (typeof v === 'number') return v
  if (typeof v === 'boolean') return v ? 'Oui' : 'Non'
  if (typeof v === 'string') {
    // Les dates gviz arrivent parfois sous la forme "Date(2025,7,15)".
    const m = v.match(/^Date\((\d+),(\d+),(\d+)/)
    if (m) {
      const [, a, mois, j] = m
      // Mois gviz : 0 = janvier. On renvoie une chaîne jj/mm/aaaa.
      const jj = String(j).padStart(2, '0')
      const mm = String(Number(mois) + 1).padStart(2, '0')
      return `${jj}/${mm}/${a}`
    }
    return v
  }
  // Cas résiduels : on utilise la valeur formatée si présente.
  return cell.f ?? String(v)
}

/**
 * Transforme la réponse gviz en tableau d'objets.
 * Les clés sont les entêtes de colonnes du Sheet (normalisées : minuscules, sans accents).
 * Renvoie [] si l'onglet est vide.
 */
export function parseGviz(texte: string): Record<string, string | number>[] {
  const data = extraireJson(texte)

  if (data.status === 'error') {
    const msg = data.errors?.[0]?.detailed_message || data.errors?.[0]?.message || 'Erreur inconnue'
    throw new Error(`Google Sheets a renvoyé une erreur : ${msg}`)
  }
  if (!data.table || !data.table.cols) return []

  // Entêtes de colonnes (normalisées). On garde l'index de chaque colonne.
  const entetes = data.table.cols.map((c) => normaliserCle(c.label || c.id || ''))

  const lignes: Record<string, string | number>[] = []
  for (const row of data.table.rows || []) {
    const cells = row.c || []
    const obj: Record<string, string | number> = {}
    let auMoinsUneValeur = false
    entetes.forEach((entete, i) => {
      if (!entete) return
      const val = valeurCellule(cells[i] ?? null)
      obj[entete] = val
      if (val !== '') auMoinsUneValeur = true
    })
    // On ignore les lignes totalement vides (fréquentes en fin de tableur).
    if (auMoinsUneValeur) lignes.push(obj)
  }
  return lignes
}

/**
 * Télécharge et parse un onglet du Sheet.
 * Lance une erreur explicite si le réseau ou le Sheet posent problème.
 */
export async function lireOnglet(onglet: string): Promise<Record<string, string | number>[]> {
  const url = gvizUrl(SHEET_ID, onglet)
  const reponse = await fetch(url, { cache: 'no-store' })
  if (!reponse.ok) {
    throw new Error(`Impossible de lire l'onglet « ${onglet} » (HTTP ${reponse.status}).`)
  }
  const texte = await reponse.text()
  return parseGviz(texte)
}
