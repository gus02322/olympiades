import { Link } from 'react-router-dom'
import { Clock, MapPin, Users2, ChevronRight } from 'lucide-react'
import { useData } from '../data/DataContext'
import { epreuvesTriees } from '../data/transform'
import { PageHeader } from '../components/PageHeader'
import { ContenuVide } from '../components/states'

/** Programme de la journée : timeline verticale des épreuves. */
export default function Programme() {
  const { data } = useData()
  const epreuves = epreuvesTriees(data.epreuves)

  return (
    <div className="animate-pop-in">
      <PageHeader titre="Programme" sousTitre={data.config.date || 'La journée épreuve par épreuve'} />

      {epreuves.length === 0 ? (
        <div className="px-4">
          <div className="carte">
            <ContenuVide titre="Programme à venir" detail="Les épreuves apparaîtront ici." />
          </div>
        </div>
      ) : (
        <ol className="relative space-y-3 px-4">
          {epreuves.map((ep) => (
            <li key={ep.nom}>
              <Link
                to={`/programme/${encodeURIComponent(ep.nom)}`}
                className="carte flex items-stretch gap-3 overflow-hidden active:scale-[0.99]"
              >
                {/* Bandeau numéro d'ordre */}
                <div className="flex w-14 shrink-0 flex-col items-center justify-center bg-mer/10 text-mer">
                  <span className="text-[10px] font-semibold uppercase">Ép.</span>
                  <span className="text-xl font-black">{ep.ordre}</span>
                </div>
                <div className="min-w-0 flex-1 py-3 pr-3">
                  <p className="truncate text-base font-bold text-nuit">{ep.nom}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-nuit/60">
                    {ep.horaire && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden /> {ep.horaire}
                      </span>
                    )}
                    {ep.lieu && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden /> {ep.lieu}
                      </span>
                    )}
                    {ep.format && (
                      <span className="inline-flex items-center gap-1">
                        <Users2 className="h-3.5 w-3.5" aria-hidden /> {ep.format}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center pr-3 text-nuit/30">
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
