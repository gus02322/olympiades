/** Petites fonctions utilitaires partagées. */

/** Concatène des classes CSS en ignorant les valeurs vides/fausses. */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Choisit une couleur de texte lisible (noir ou blanc) sur un fond donné.
 * Utilise la luminance perçue. Tolérant aux couleurs invalides.
 */
export function texteSurFond(hex: string): '#0B2545' | '#FFFFFF' {
  const c = normaliserHex(hex)
  if (!c) return '#0B2545'
  const r = parseInt(c.slice(1, 3), 16)
  const g = parseInt(c.slice(3, 5), 16)
  const b = parseInt(c.slice(5, 7), 16)
  // Luminance relative (formule perçue).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#0B2545' : '#FFFFFF'
}

/** Normalise une couleur hex (#abc → #aabbcc). Renvoie null si invalide. */
export function normaliserHex(hex: string): string | null {
  if (!hex) return null
  let h = hex.trim()
  if (!h.startsWith('#')) h = '#' + h
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h = '#' + h.slice(1).split('').map((c) => c + c).join('')
  }
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : null
}

/** Couleur d'équipe sûre (avec repli sur le bleu mer). */
export function couleurEquipe(hex: string): string {
  return normaliserHex(hex) ?? '#0EA5E9'
}

/** « il y a X s / min » à partir d'un horodatage ms. */
export function ilYA(ts: number | null, maintenant: number = Date.now()): string {
  if (!ts) return 'jamais'
  const secondes = Math.max(0, Math.round((maintenant - ts) / 1000))
  if (secondes < 5) return "à l'instant"
  if (secondes < 60) return `il y a ${secondes} s`
  const minutes = Math.round(secondes / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const heures = Math.round(minutes / 60)
  return `il y a ${heures} h`
}

/** Médaille selon le rang (1/2/3), sinon une puce. */
export function medaille(rang: number): string {
  return rang === 1 ? '🥇' : rang === 2 ? '🥈' : rang === 3 ? '🥉' : '•'
}
