import type { ReactNode } from 'react'

/** Entête de page : gros titre + sous-titre optionnel + action à droite. */
export function PageHeader({
  titre,
  sousTitre,
  action,
}: {
  titre: string
  sousTitre?: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="mb-4 flex items-end justify-between gap-3 px-4 pt-4">
      <div>
        <h1 className="text-2xl font-extrabold leading-tight text-nuit">{titre}</h1>
        {sousTitre && <p className="mt-0.5 text-sm text-nuit/60">{sousTitre}</p>}
      </div>
      {action}
    </header>
  )
}
