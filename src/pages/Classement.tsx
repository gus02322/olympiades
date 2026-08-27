import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../data/DataContext'
import { classementGeneral } from '../data/transform'
import { Podium } from '../components/Podium'
import { ProgressBar } from '../components/ProgressBar'
import { EvolutionChart } from '../components/EvolutionChart'
import { PageHeader } from '../components/PageHeader'
import { ContenuVide } from '../components/states'
import { couleurEquipe, medaille } from '../lib/utils'

/** Classement général : podium + tableau complet + évolution. */
export default function Classement() {
  const { data } = useData()
  const rangs = classementGeneral(data.equipes, data.scores)
  const maxTotal = Math.max(1, ...rangs.map((r) => r.total))
  const aDesScores = rangs.some((r) => r.total > 0)

  return (
    <div className="animate-pop-in space-y-4 pb-4">
      <PageHeader titre="Classement" sousTitre="Total des points sur toutes les épreuves" />

      {!aDesScores ? (
        <div className="px-4">
          <div className="carte">
            <ContenuVide
              titre="Pas encore de scores"
              detail="Le classement se remplira au fil des épreuves de la journée."
            />
          </div>
        </div>
      ) : (
        <>
          <section className="mx-4 carte px-4 py-5">
            <Podium rangs={rangs} />
          </section>

          {/* Tableau complet */}
          <section className="mx-4 carte divide-y divide-nuit/5">
            {rangs.map((r, i) => {
              const couleur = couleurEquipe(r.equipe.couleur)
              return (
                <motion.div
                  key={r.equipe.nom}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/equipes/${encodeURIComponent(r.equipe.nom)}`}
                    className="block px-4 py-3 active:bg-nuit/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-lg" aria-hidden>
                        {medaille(r.rang)}
                      </span>
                      <span className="text-xl" aria-hidden>
                        {r.equipe.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-nuit">{r.equipe.nom}</p>
                        <p className="text-xs text-nuit/50">
                          {r.rang === 1
                            ? 'En tête 👑'
                            : `à ${r.ecartAvecPremier} pt${r.ecartAvecPremier > 1 ? 's' : ''} du 1er`}
                        </p>
                      </div>
                      <span className="text-lg font-extrabold text-nuit">{r.total}</span>
                    </div>
                    <div className="mt-2 pl-9">
                      <ProgressBar pourcentage={(r.total / maxTotal) * 100} couleur={couleur} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </section>

          {/* Évolution des points */}
          <section className="mx-4 carte px-4 py-5">
            <h2 className="mb-3 text-sm font-bold text-nuit">Évolution au fil des épreuves</h2>
            <EvolutionChart data={data} />
          </section>
        </>
      )}
    </div>
  )
}
