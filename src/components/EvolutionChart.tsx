import type { AppData } from '../types'
import { epreuvesTriees } from '../data/transform'
import { couleurEquipe } from '../lib/utils'

/**
 * Mini-graphe de l'évolution des points cumulés par équipe, épreuve après épreuve.
 * Rendu en SVG pur (aucune librairie de graphes), responsive.
 */
export function EvolutionChart({ data }: { data: AppData }) {
  const epreuves = epreuvesTriees(data.epreuves)
  if (epreuves.length === 0 || data.equipes.length === 0) return null

  // Cumul par équipe : points[equipe][indexEpreuve].
  const series = data.equipes.map((equipe) => {
    let cumul = 0
    const valeurs = epreuves.map((ep) => {
      const s = data.scores.find((x) => x.epreuve === ep.nom && x.equipe === equipe.nom)
      cumul += s?.points ?? 0
      return cumul
    })
    return { equipe, valeurs }
  })

  const maxY = Math.max(1, ...series.flatMap((s) => s.valeurs))
  const nbPoints = epreuves.length

  // Géométrie du dessin (viewBox virtuel, mis à l'échelle par le SVG).
  const W = 320
  const H = 150
  const padX = 8
  const padY = 10
  const x = (i: number) =>
    nbPoints <= 1 ? W / 2 : padX + (i * (W - 2 * padX)) / (nbPoints - 1)
  const y = (v: number) => H - padY - (v * (H - 2 * padY)) / maxY

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-40 w-full min-w-[280px]"
        role="img"
        aria-label="Évolution des points cumulés par équipe au fil des épreuves"
      >
        {/* Lignes horizontales de repère */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={W - padX}
            y1={y(maxY * f)}
            y2={y(maxY * f)}
            stroke="#0B2545"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}
        {/* Une ligne par équipe */}
        {series.map(({ equipe, valeurs }) => {
          const couleur = couleurEquipe(equipe.couleur)
          const d = valeurs.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
          return (
            <g key={equipe.nom}>
              <path d={d} fill="none" stroke={couleur} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              {valeurs.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={2.4} fill={couleur} />
              ))}
            </g>
          )
        })}
      </svg>
      {/* Légende des équipes */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-nuit/70">
        {series.map(({ equipe }) => (
          <span key={equipe.nom} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: couleurEquipe(equipe.couleur) }}
            />
            {equipe.nom}
          </span>
        ))}
      </div>
    </div>
  )
}
