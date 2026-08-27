import { Link } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'
import { useData } from '../data/DataContext'
import { classementGeneral, membresEquipe } from '../data/transform'
import { PageHeader } from '../components/PageHeader'
import { ContenuVide } from '../components/states'
import { couleurEquipe, texteSurFond } from '../lib/utils'

/** Liste des équipes ; chaque carte mène à la fiche détaillée. */
export default function Equipes() {
  const { data } = useData()
  const rangs = classementGeneral(data.equipes, data.scores)
  // On classe les cartes par rang général pour un affichage cohérent.
  const rangParEquipe = new Map(rangs.map((r) => [r.equipe.nom, r]))

  if (data.equipes.length === 0) {
    return (
      <div className="px-4">
        <PageHeader titre="Équipes" />
        <div className="carte">
          <ContenuVide titre="Aucune équipe" detail="L'onglet Equipes du Sheet est vide." />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pop-in">
      <PageHeader titre="Équipes" sousTitre={`${data.equipes.length} équipes en lice`} />
      <div className="space-y-3 px-4">
        {data.equipes.map((equipe) => {
          const fond = couleurEquipe(equipe.couleur)
          const couleurTexte = texteSurFond(fond)
          const rang = rangParEquipe.get(equipe.nom)
          const membres = membresEquipe(data, equipe.nom)
          return (
            <Link
              key={equipe.nom}
              to={`/equipes/${encodeURIComponent(equipe.nom)}`}
              className="carte block overflow-hidden active:scale-[0.99]"
            >
              <div
                className="flex items-center gap-3 px-4 py-4"
                style={{ backgroundColor: fond, color: couleurTexte }}
              >
                <span className="text-3xl" aria-hidden>
                  {equipe.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-extrabold">{equipe.nom}</p>
                  {equipe.theme && (
                    <p className="truncate text-sm opacity-90">Thème : {equipe.theme}</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 opacity-80" aria-hidden />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 text-sm text-nuit/70">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" aria-hidden /> {membres.length} membres
                </span>
                {rang && (
                  <span className="font-semibold text-nuit">
                    {rang.total} pts · {rang.rang}
                    <sup>{rang.rang === 1 ? 'er' : 'e'}</sup>
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
