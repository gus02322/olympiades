import { AlertTriangle, Loader2, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

/** Écran de chargement (premier chargement). */
export function Chargement({ message = 'Chargement…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-nuit/60">
      <Loader2 className="h-8 w-8 animate-spin text-mer" aria-hidden />
      <p className="text-sm">{message}</p>
    </div>
  )
}

/** Bandeau d'erreur non bloquant (les données affichées restent visibles). */
export function BandeauErreur({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-corail/30 bg-corail/10 px-3 py-2 text-sm text-nuit"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-corail" aria-hidden />
      <span>{message}</span>
    </div>
  )
}

/** État vide soigné (onglet non rempli). */
export function ContenuVide({
  titre = 'Rien à afficher pour le moment',
  detail,
  icone,
}: {
  titre?: string
  detail?: string
  icone?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center text-nuit/60">
      <div className="text-mer">{icone ?? <Inbox className="h-10 w-10" aria-hidden />}</div>
      <p className="font-semibold text-nuit">{titre}</p>
      {detail && <p className="max-w-xs text-sm">{detail}</p>}
    </div>
  )
}
