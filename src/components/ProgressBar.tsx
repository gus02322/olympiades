import { couleurEquipe } from '../lib/utils'

/** Barre de progression aux couleurs d'une équipe (valeur en % de 0 à 100). */
export function ProgressBar({
  pourcentage,
  couleur,
}: {
  pourcentage: number
  couleur: string
}) {
  const pct = Math.max(0, Math.min(100, pourcentage))
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-nuit/10">
      <div
        className="h-full origin-left rounded-full animate-grow-bar"
        style={{ width: `${pct}%`, backgroundColor: couleurEquipe(couleur) }}
      />
    </div>
  )
}
