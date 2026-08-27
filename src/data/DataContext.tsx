/**
 * Contexte global de données.
 *
 * Responsabilités :
 *  - lire les 7 onglets du Google Sheet via gviz ;
 *  - rafraîchir automatiquement toutes les 45 s (effet « live ») + bouton manuel ;
 *  - mettre en cache la dernière lecture réussie (localStorage) pour survivre au
 *    mauvais réseau de l'île ;
 *  - exposer des états chargement / erreur soignés ;
 *  - retomber sur les données de démonstration si aucun SHEET_ID n'est configuré.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ONGLETS, REFRESH_INTERVAL_MS, SHEET_CONFIGURE, STORAGE_KEY_CACHE } from '../config'
import type { AppData } from '../types'
import { lireOnglet } from './gviz'
import { assembler } from './mappers'
import { fallbackData } from './fallback'

/** Origine des données actuellement affichées. */
export type Source = 'demo' | 'live' | 'cache'

interface DataState {
  data: AppData
  /** true pendant le tout premier chargement (avant toute donnée). */
  chargementInitial: boolean
  /** true pendant un rafraîchissement (données déjà affichées). */
  rafraichissement: boolean
  /** Message d'erreur du dernier essai réseau, s'il y en a un. */
  erreur: string | null
  /** D'où viennent les données affichées. */
  source: Source
  /** Horodatage (ms) de la dernière lecture réussie. */
  derniereMaj: number | null
  /** Force un rafraîchissement manuel. */
  rafraichir: () => void
}

const DataContext = createContext<DataState | null>(null)

/** Lecture du cache localStorage (dernière lecture réussie). */
function lireCache(): { data: AppData; ts: number } | null {
  try {
    const brut = localStorage.getItem(STORAGE_KEY_CACHE)
    if (!brut) return null
    const parsed = JSON.parse(brut) as { data: AppData; ts: number }
    if (!parsed?.data) return null
    return parsed
  } catch {
    return null
  }
}

/** Écriture du cache localStorage. */
function ecrireCache(data: AppData, ts: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify({ data, ts }))
  } catch {
    // Quota plein ou navigation privée : on ignore silencieusement.
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  // État initial : cache s'il existe, sinon données de démonstration.
  const cacheInitial = lireCache()
  const [data, setData] = useState<AppData>(cacheInitial?.data ?? fallbackData)
  const [source, setSource] = useState<Source>(
    cacheInitial ? 'cache' : SHEET_CONFIGURE ? 'live' : 'demo',
  )
  const [derniereMaj, setDerniereMaj] = useState<number | null>(cacheInitial?.ts ?? null)
  const [chargementInitial, setChargementInitial] = useState<boolean>(SHEET_CONFIGURE)
  const [rafraichissement, setRafraichissement] = useState<boolean>(false)
  const [erreur, setErreur] = useState<string | null>(null)

  // Empêche deux lectures simultanées.
  const enCours = useRef(false)

  const charger = useCallback(async () => {
    // Sans SHEET_ID, on reste sur la démo (pas d'appel réseau).
    if (!SHEET_CONFIGURE) {
      setChargementInitial(false)
      return
    }
    if (enCours.current) return
    enCours.current = true

    // Premier chargement vs rafraîchissement.
    setRafraichissement(true)
    try {
      // On lit tous les onglets en parallèle. Les onglets optionnels ne bloquent pas.
      const [config, equipes, participants, epreuves, scores, matchs, legende] =
        await Promise.all([
          lireOnglet(ONGLETS.config).catch(() => []),
          lireOnglet(ONGLETS.equipes).catch(() => []),
          lireOnglet(ONGLETS.participants).catch(() => []),
          lireOnglet(ONGLETS.epreuves).catch(() => []),
          lireOnglet(ONGLETS.scores).catch(() => []),
          lireOnglet(ONGLETS.matchs).catch(() => []), // optionnel
          lireOnglet(ONGLETS.legende).catch(() => []),
        ])

      const assemblee = assembler({
        config,
        equipes,
        participants,
        epreuves,
        scores,
        matchs,
        legende,
      })

      // Si le Sheet ne renvoie strictement rien d'exploitable, on garde ce qu'on a.
      const totalLignes =
        equipes.length + epreuves.length + scores.length + legende.length
      if (totalLignes === 0) {
        throw new Error('Le Google Sheet semble vide ou inaccessible.')
      }

      const ts = Date.now()
      setData(assemblee)
      setSource('live')
      setDerniereMaj(ts)
      setErreur(null)
      ecrireCache(assemblee, ts)
    } catch (e) {
      // Échec réseau : on conserve l'affichage courant (cache ou démo) et on note l'erreur.
      const message = e instanceof Error ? e.message : 'Erreur de lecture inconnue.'
      setErreur(message)
    } finally {
      setChargementInitial(false)
      setRafraichissement(false)
      enCours.current = false
    }
  }, [])

  // Premier chargement + timer de rafraîchissement automatique.
  useEffect(() => {
    charger()
    if (!SHEET_CONFIGURE) return
    const id = setInterval(charger, REFRESH_INTERVAL_MS)
    // On rafraîchit aussi quand l'utilisateur revient sur l'onglet/app.
    const onFocus = () => charger()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [charger])

  const valeur: DataState = {
    data,
    chargementInitial,
    rafraichissement,
    erreur,
    source,
    derniereMaj,
    rafraichir: charger,
  }

  return <DataContext.Provider value={valeur}>{children}</DataContext.Provider>
}

/** Hook d'accès aux données. À utiliser dans les pages/composants. */
export function useData(): DataState {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans <DataProvider>.')
  return ctx
}
