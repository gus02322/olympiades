import { Link } from 'react-router-dom'
import { MapPin, CalendarDays, Trophy } from 'lucide-react'
import { useData } from '../data/DataContext'
import { classementGeneral } from '../data/transform'
import { Podium } from '../components/Podium'
import { ContenuVide } from '../components/states'

/** Écran d'accueil : identité de l'édition + podium en direct. */
export default function Accueil() {
  const { data } = useData()
  const { config, equipes, scores } = data
  const rangs = classementGeneral(equipes, scores)

  return (
    <div className="animate-pop-in space-y-4 px-4 pt-4">
      {/* Bannière de l'édition */}
      <section className="carte overflow-hidden">
        <div className="bg-gradient-to-br from-mer to-menthe px-5 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            L'olympiade de l'Île d'Yeu
          </p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight">
            {config.nom_edition || 'OlympYeu'}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/90">
            {config.date && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" aria-hidden /> {config.date}
              </span>
            )}
            {config.lieu && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden /> {config.lieu}
              </span>
            )}
          </div>
        </div>
        {config.message_accueil && (
          <p className="px-5 py-4 text-center text-base font-medium text-nuit">
            {config.message_accueil}
          </p>
        )}
      </section>

      {/* Podium en direct */}
      <section className="carte px-4 py-5">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-soleil" aria-hidden />
          <h2 className="text-lg font-bold text-nuit">Classement en direct</h2>
        </div>
        {rangs.length > 0 && rangs.some((r) => r.total > 0) ? (
          <>
            <Podium rangs={rangs} />
            <Link
              to="/classement"
              className="zone-tactile mt-5 flex w-full items-center justify-center rounded-xl bg-nuit/5 py-2.5 text-sm font-semibold text-mer active:scale-[0.98]"
            >
              Voir le classement complet →
            </Link>
          </>
        ) : (
          <ContenuVide
            titre="Le classement démarrera bientôt"
            detail="Les scores apparaîtront ici dès la première épreuve."
            icone={<Trophy className="h-10 w-10" aria-hidden />}
          />
        )}
      </section>
    </div>
  )
}
