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

/**
 * Construit l'URL d'une image à partir d'une valeur du Sheet.
 * - une URL complète (http/https) est utilisée telle quelle ;
 * - sinon on considère un chemin relatif au site (ex. « legende/2018.jpg »),
 *   résolu à partir du dossier `public/` grâce à la base Vite.
 * Renvoie null si la valeur est vide.
 */
export function resoudreImage(valeur: string): string | null {
  const v = (valeur || '').trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) return v
  // BASE_URL vaut « /olympiades/ » en production, « / » en local.
  return `${import.meta.env.BASE_URL}${v.replace(/^\/+/, '')}`
}

/** Nom d'affichage d'une équipe : « nom_affiche » si fourni, sinon le nom interne. */
export function afficheEquipe(equipe: { nom: string; nomAffiche?: string }): string {
  return equipe.nomAffiche && equipe.nomAffiche.trim() !== '' ? equipe.nomAffiche.trim() : equipe.nom
}

/**
 * Nom d'affichage à partir d'un nom interne (clé) et de la liste d'équipes :
 * utile là où l'on n'a que le nom (Scores, Matchs…).
 */
export function afficheNom(equipes: { nom: string; nomAffiche?: string }[], nom: string): string {
  const e = equipes.find((x) => x.nom.trim().toLowerCase() === nom.trim().toLowerCase())
  return e ? afficheEquipe(e) : nom
}

/** Transforme un texte en identifiant de fichier (minuscules, sans accents, tirets). */
export function slug(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * URL de la photo d'une équipe :
 * - colonne « photo » du Sheet si fournie (URL ou chemin) ;
 * - sinon convention automatique « equipes/<slug-du-nom>.jpg »
 *   (masquée proprement si le fichier n'existe pas).
 */
export function photoEquipe(nom: string, photo?: string): string {
  return resoudreImage(photo || '') ?? `${import.meta.env.BASE_URL}equipes/${slug(nom)}.jpg`
}

/**
 * Décompte entre maintenant et une date cible.
 * Renvoie jours/heures/minutes/secondes + un booléen « passe » si la date est atteinte.
 */
export function decompte(cible: Date, maintenant: number = Date.now()) {
  const diff = cible.getTime() - maintenant
  const passe = diff <= 0
  const total = Math.max(0, diff)
  const jours = Math.floor(total / 86_400_000)
  const heures = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const secondes = Math.floor((total % 60_000) / 1000)
  return { jours, heures, minutes, secondes, passe }
}
