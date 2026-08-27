import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useData } from '../data/DataContext'
import { trouverEquipe } from '../data/transform'
import { EquipeFiche } from '../components/EquipeFiche'
import { ContenuVide } from '../components/states'

/** Fiche d'une équipe (accessible en tapant une équipe dans la liste). */
export default function EquipeDetail() {
  const { data } = useData()
  const { nom } = useParams<{ nom: string }>()
  const equipe = nom ? trouverEquipe(data.equipes, decodeURIComponent(nom)) : undefined

  return (
    <div className="animate-pop-in px-4 pt-4">
      <Link
        to="/equipes"
        className="zone-tactile mb-3 inline-flex items-center gap-1 text-sm font-medium text-mer"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Toutes les équipes
      </Link>

      {equipe ? (
        <EquipeFiche data={data} equipe={equipe} />
      ) : (
        <div className="carte">
          <ContenuVide titre="Équipe introuvable" detail="Cette équipe n'existe pas (ou plus)." />
        </div>
      )}
    </div>
  )
}
