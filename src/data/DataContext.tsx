/**
 * Contexte global de données (MULTI-ANNÉES).
 *
 * - lit les 7 onglets du Google Sheet via gviz ;
 * - conserve toutes les années (MultiYearData) ;
 * - expose l'année sélectionnée + la vue filtrée (`data`) de cette année ;
 * - rafraîchissement auto 45 s + bouton manuel, cache localStorage, repli démo.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  ONGLETS,
  REFRESH_INTERVAL_MS,
  SHEET_CONFIGURE,
  STORAGE_KEY_ANNEE,
  STORAGE_KEY_CACHE,
} from '../config'
import type { AppData, MultiYearData } from '../types'
import { lireOnglet } from './gviz'
import { assembler } from './mappers'
import { anneeDefaut, anneesDisponibles, filtrerParAnnee } from './transform'
import { fallbackData } from './fallback'

export type Source = 'demo' | 'live' | 'cache'

interface DataState {
  /** Vue filtrée de l'année sélectionnée (config résolue, listes de l'année, légende globale). */
  data: AppData
  /** Toutes les années disponibles (récent → ancien). */
  annees: number[]
  /** Année sélectionnée. */
  annee: number
  /** Change l'année (mémorisée en localStorage). */
  setAnnee: (a: number) => void
  chargementInitial: boolean
  rafraichissement: boolean
  erreur: string | null
  source: Source
  derniereMaj: number | null
  rafraichir: () => void
}

const DataContext = createContext<DataState | null>(null)

/** Le cache est-il un MultiYearData exploitable ? */
function estMultiYear(x: unknown): x is MultiYearData {
  return !!x && typeof x === 'object' && Array.isArray((x as MultiYearData).configRows)
}

function lireCache(): { data: MultiYearData; ts: number } | null {
  try {
    const brut = localStorage.getItem(STORAGE_KEY_CACHE)
    if (!brut) return null
    const parsed = JSON.parse(brut) as { data: unknown; ts: number }
    if (!estMultiYear(parsed?.data)) return null // ignore un ancien cache mono-année
    return { data: parsed.data, ts: parsed.ts }
  } catch {
    return null
  }
}

function ecrireCache(data: MultiYearData, ts: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify({ data, ts }))
  } catch {
    /* quota / navigation privée : on ignore */
  }
}

function lireAnneeStockee(): number | null {
  try {
    const v = Number(localStorage.getItem(STORAGE_KEY_ANNEE))
    return Number.isFinite(v) && v > 0 ? v : null
  } catch {
    return null
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const cacheInitial = lireCache()
  const [raw, setRaw] = useState<MultiYearData>(cacheInitial?.data ?? fallbackData)
  const [source, setSource] = useState<Source>(
    cacheInitial ? 'cache' : SHEET_CONFIGURE ? 'live' : 'demo',
  )
  const [derniereMaj, setDerniereMaj] = useState<number | null>(cacheInitial?.ts ?? null)
  const [chargementInitial, setChargementInitial] = useState<boolean>(SHEET_CONFIGURE)
  const [rafraichissement, setRafraichissement] = useState<boolean>(false)
  const [erreur, setErreur] = useState<string | null>(null)

  // Année sélectionnée (null = « pas encore choisie », on prendra le défaut).
  const [anneeChoisie, setAnneeChoisie] = useState<number | null>(lireAnneeStockee)

  const annees = useMemo(() => anneesDisponibles(raw), [raw])

  // Année effective : choix valide sinon année par défaut.
  const annee = useMemo(() => {
    if (anneeChoisie && annees.includes(anneeChoisie)) return anneeChoisie
    return anneeDefaut(raw, annees)
  }, [anneeChoisie, annees, raw])

  const setAnnee = useCallback((a: number) => {
    setAnneeChoisie(a)
    try {
      localStorage.setItem(STORAGE_KEY_ANNEE, String(a))
    } catch {
      /* ignore */
    }
  }, [])

  // Vue filtrée pour l'année courante.
  const data = useMemo(() => filtrerParAnnee(raw, annee), [raw, annee])

  const enCours = useRef(false)

  const charger = useCallback(async () => {
    if (!SHEET_CONFIGURE) {
      setChargementInitial(false)
      return
    }
    if (enCours.current) return
    enCours.current = true
    setRafraichissement(true)
    try {
      const [config, equipes, participants, epreuves, scores, matchs, legende] =
        await Promise.all([
          lireOnglet(ONGLETS.config).catch(() => []),
          lireOnglet(ONGLETS.equipes).catch(() => []),
          lireOnglet(ONGLETS.participants).catch(() => []),
          lireOnglet(ONGLETS.epreuves).catch(() => []),
          lireOnglet(ONGLETS.scores).catch(() => []),
          lireOnglet(ONGLETS.matchs).catch(() => []),
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

      const totalLignes = equipes.length + epreuves.length + scores.length + legende.length
      if (totalLignes === 0) throw new Error('Le Google Sheet semble vide ou inaccessible.')

      const ts = Date.now()
      setRaw(assemblee)
      setSource('live')
      setDerniereMaj(ts)
      setErreur(null)
      ecrireCache(assemblee, ts)
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur de lecture inconnue.')
    } finally {
      setChargementInitial(false)
      setRafraichissement(false)
      enCours.current = false
    }
  }, [])

  useEffect(() => {
    charger()
    if (!SHEET_CONFIGURE) return
    const id = setInterval(charger, REFRESH_INTERVAL_MS)
    const onFocus = () => charger()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [charger])

  const valeur: DataState = {
    data,
    annees,
    annee,
    setAnnee,
    chargementInitial,
    rafraichissement,
    erreur,
    source,
    derniereMaj,
    rafraichir: charger,
  }

  return <DataContext.Provider value={valeur}>{children}</DataContext.Provider>
}

export function useData(): DataState {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans <DataProvider>.')
  return ctx
}
