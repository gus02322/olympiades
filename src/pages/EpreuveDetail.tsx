import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Users2, BookOpen, Target, Swords } from 'lucide-react'
import { useData } from '../data/DataContext'
import { matchsParEpreuve, scoresParEpreuve, trouverEquipe } from '../data/transform'
import { ContenuVide } from '../components/states'
import { afficheNom, medaille } from '../lib/utils'
import type { Match } from '../types'

/** Détail d'une épreuve : infos, règles, système de points, résultats et confrontations. */
export default function EpreuveDetail() {
  const { data } = useData()
  const { nom } = useParams<{ nom: string }>()
  const nomEpreuve = nom ? decodeURIComponent(nom) : ''
  const epreuve = data.epreuves.find((e) => e.nom === nomEpreuve)

  const resultats = scoresParEpreuve(data.scores, nomEpreuve)
  const matchs = matchsParEpreuve(data.matchs, nomEpreuve)

  if (!epreuve) {
    return (
      <div className="animate-pop-in px-4 pt-4">
        <Link to="/programme" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-mer">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Programme
        </Link>
        <div className="carte">
          <ContenuVide titre="Épreuve introuvable" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pop-in space-y-4 px-4 pt-4">
      <Link to="/programme" className="inline-flex items-center gap-1 text-sm font-medium text-mer">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Programme
      </Link>

      {/* En-tête */}
      <section className="carte overflow-hidden">
        <div className="bg-gradient-to-br from-mer to-menthe px-5 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Épreuve {epreuve.ordre}
          </p>
          <h2 className="text-2xl font-extrabold leading-tight">{epreuve.nom}</h2>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/90">
            {epreuve.horaire && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden /> {epreuve.horaire}
              </span>
            )}
            {epreuve.lieu && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden /> {epreuve.lieu}
              </span>
            )}
            {epreuve.format && (
              <span className="inline-flex items-center gap-1">
                <Users2 className="h-4 w-4" aria-hidden /> {epreuve.format}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Règles & système de points */}
      {(epreuve.regles || epreuve.systeme_points) && (
        <section className="carte space-y-3 px-4 py-4">
          {epreuve.regles && (
            <div>
              <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-nuit">
                <BookOpen className="h-4 w-4 text-mer" aria-hidden /> Règles
              </h3>
              <p className="text-sm text-nuit/80">{epreuve.regles}</p>
            </div>
          )}
          {epreuve.systeme_points && (
            <div>
              <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-nuit">
                <Target className="h-4 w-4 text-corail" aria-hidden /> Système de points
              </h3>
              <p className="text-sm text-nuit/80">{epreuve.systeme_points}</p>
            </div>
          )}
        </section>
      )}

      {/* Résultats de l'épreuve */}
      <section className="carte overflow-hidden">
        <h3 className="px-4 pt-4 text-sm font-bold text-nuit">Résultats</h3>
        {resultats.length === 0 ? (
          <ContenuVide titre="Pas encore de résultat" detail="Reviens après l'épreuve !" />
        ) : (
          <ul className="mt-2 divide-y divide-nuit/5">
            {resultats.map((s, i) => {
              const eq = trouverEquipe(data.equipes, s.equipe)
              const rang = s.classement ?? i + 1
              return (
                <li key={s.equipe} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 text-center" aria-hidden>
                    {medaille(rang)}
                  </span>
                  <span className="text-lg" aria-hidden>
                    {eq?.emoji ?? '•'}
                  </span>
                  <span className="flex-1 font-medium text-nuit">{afficheNom(data.equipes, s.equipe)}</span>
                  <span className="font-bold text-nuit">{s.points} pts</span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Confrontations / poules */}
      {matchs.length > 0 && (
        <section className="carte overflow-hidden">
          <h3 className="flex items-center gap-2 px-4 pt-4 text-sm font-bold text-nuit">
            <Swords className="h-4 w-4 text-mer" aria-hidden /> Confrontations
          </h3>
          <ul className="mt-2 divide-y divide-nuit/5">
            {matchs.map((m, i) => (
              <MatchLigne key={i} match={m} data={data} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/** Une ligne de confrontation entre deux équipes. */
function MatchLigne({ match, data }: { match: Match; data: ReturnType<typeof useData>['data'] }) {
  const a = trouverEquipe(data.equipes, match.equipeA)
  const b = trouverEquipe(data.equipes, match.equipeB)
  const termine = match.statut.toLowerCase().includes('termin')
  const aScore = match.scoreA
  const bScore = match.scoreB
  const aGagne = termine && aScore !== null && bScore !== null && aScore > bScore
  const bGagne = termine && aScore !== null && bScore !== null && bScore > aScore

  const couleurStatut =
    match.statut.toLowerCase().includes('cours')
      ? 'bg-corail/15 text-corail'
      : termine
      ? 'bg-menthe/15 text-menthe'
      : 'bg-nuit/5 text-nuit/50'

  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={`flex-1 text-right text-sm ${aGagne ? 'font-bold text-nuit' : 'text-nuit/70'}`}>
          {a?.emoji} {afficheNom(data.equipes, match.equipeA)}
        </span>
        <span className="min-w-[3.5rem] rounded-lg bg-nuit/5 px-2 py-0.5 text-center text-sm font-bold text-nuit">
          {aScore !== null && bScore !== null ? `${aScore} – ${bScore}` : 'vs'}
        </span>
        <span className={`flex-1 text-sm ${bGagne ? 'font-bold text-nuit' : 'text-nuit/70'}`}>
          {afficheNom(data.equipes, match.equipeB)} {b?.emoji}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-nuit/50">
        {match.horaire && <span>{match.horaire}</span>}
        {match.terrain && <span>· {match.terrain}</span>}
        <span className={`rounded-full px-2 py-0.5 font-medium ${couleurStatut}`}>{match.statut}</span>
      </div>
    </li>
  )
}
