import { useEffect, useState } from 'react'
import { RefreshCw, Wifi, Database, HardDrive } from 'lucide-react'
import { useData, type Source } from '../data/DataContext'
import { cx, ilYA } from '../lib/utils'

const libelleSource: Record<Source, { texte: string; icone: typeof Wifi; classe: string }> = {
  live: { texte: 'En direct', icone: Wifi, classe: 'text-menthe' },
  cache: { texte: 'Hors ligne', icone: HardDrive, classe: 'text-soleil' },
  demo: { texte: 'Démo', icone: Database, classe: 'text-mer' },
}

/**
 * Indicateur « mis à jour il y a X s » + état de la source + bouton rafraîchir.
 * Se met à jour chaque seconde pour un rendu vivant.
 */
export function RefreshIndicator() {
  const { source, derniereMaj, rafraichir, rafraichissement } = useData()
  const [, setTick] = useState(0)

  // Force un re-rendu chaque seconde pour actualiser le « il y a X s ».
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const info = libelleSource[source]
  const Icone = info.icone

  return (
    <div className="flex items-center gap-2 text-xs text-nuit/60">
      <span className={cx('inline-flex items-center gap-1 font-medium', info.classe)}>
        <Icone className="h-3.5 w-3.5" aria-hidden />
        {info.texte}
      </span>
      {source !== 'demo' && (
        <span aria-live="polite">· mis à jour {ilYA(derniereMaj)}</span>
      )}
      <button
        type="button"
        onClick={rafraichir}
        disabled={rafraichissement}
        className="zone-tactile ml-auto inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 font-medium text-mer shadow-sm active:scale-95 disabled:opacity-50"
        aria-label="Rafraîchir les données"
      >
        <RefreshCw className={cx('h-3.5 w-3.5', rafraichissement && 'animate-spin')} aria-hidden />
        Rafraîchir
      </button>
    </div>
  )
}
