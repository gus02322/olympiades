/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  CONFIGURATION — LE SEUL FICHIER À MODIFIER POUR BRANCHER TES DONNÉES │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * 1) Ouvre ton Google Sheet dans le navigateur.
 * 2) Regarde l'URL, elle ressemble à :
 *
 *      https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit#gid=0
 *                                            └──────────── SHEET_ID ───────────┘
 *
 *    Le SHEET_ID est la longue suite de lettres/chiffres entre "/d/" et "/edit".
 * 3) Copie-la et colle-la ci-dessous entre les guillemets.
 * 4) Vérifie que le Sheet est partagé en « Tout utilisateur disposant du lien : Lecteur ».
 *
 * Tant que SHEET_ID reste vide, l'application affiche les données de démonstration
 * (édition 2025) pour rester jolie et vivante.
 */
export const SHEET_ID = '1RxVzs3qqpeCPEagZuPbslxHUUJf1BQJzActYsUTqe8I'

/**
 * Noms des onglets du Google Sheet.
 * Ne change ces valeurs que si tu renommes les onglets dans ton Sheet
 * (déconseillé : garde les noms par défaut).
 */
export const ONGLETS = {
  config: 'Config',
  equipes: 'Equipes',
  participants: 'Participants',
  epreuves: 'Epreuves',
  scores: 'Scores',
  matchs: 'Matchs',
  legende: 'Legende',
} as const

/** Intervalle de rafraîchissement automatique (effet « live » le jour J). */
export const REFRESH_INTERVAL_MS = 45_000

/** Clé utilisée pour mémoriser le prénom choisi dans « Mon équipe ». */
export const STORAGE_KEY_PRENOM = 'olympyeu:prenom'

/** Clé utilisée pour mémoriser l'année sélectionnée (sélecteur d'édition). */
export const STORAGE_KEY_ANNEE = 'olympyeu:annee'

/** Préfixe des clés de cache d'affichage (dernière lecture réussie du Sheet). */
export const STORAGE_KEY_CACHE = 'olympyeu:cache'

/** Vrai si un SHEET_ID a été renseigné. */
export const SHEET_CONFIGURE = SHEET_ID.trim().length > 0
