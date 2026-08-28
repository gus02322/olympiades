import { useMemo, useState } from 'react'
import { Search, UserRound, RefreshCcw } from 'lucide-react'
import { useData } from '../data/DataContext'
import { equipeDuParticipant } from '../data/transform'
import { EquipeFiche } from '../components/EquipeFiche'
import { PageHeader } from '../components/PageHeader'
import { ContenuVide } from '../components/states'
import { STORAGE_KEY_PRENOM } from '../config'
import { afficheNom, couleurEquipe, texteSurFond } from '../lib/utils'

/** Lit le prénom mémorisé (localStorage). */
function lirePrenom(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_PRENOM) ?? ''
  } catch {
    return ''
  }
}

/**
 * « Mon équipe » : au premier lancement l'utilisateur choisit son prénom,
 * l'app le retient et affiche directement SON équipe (avec son prénom mis en avant).
 */
export default function MonEquipe() {
  const { data } = useData()
  const [prenom, setPrenom] = useState<string>(lirePrenom)
  const [recherche, setRecherche] = useState('')

  const equipe = prenom ? equipeDuParticipant(data, prenom) : undefined

  // Liste des participants filtrée par la recherche, triée par prénom.
  const participantsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase()
    return [...data.participants]
      .filter((p) => p.nom.toLowerCase().includes(q))
      .sort((a, b) => a.nom.localeCompare(b.nom))
  }, [data.participants, recherche])

  function choisir(nom: string) {
    setPrenom(nom)
    try {
      localStorage.setItem(STORAGE_KEY_PRENOM, nom)
    } catch {
      /* navigation privée : on ignore */
    }
  }

  function changer() {
    setPrenom('')
    setRecherche('')
    try {
      localStorage.removeItem(STORAGE_KEY_PRENOM)
    } catch {
      /* ignore */
    }
  }

  // Cas 1 : un prénom valide est mémorisé → on affiche la fiche de son équipe.
  if (prenom && equipe) {
    return (
      <div className="animate-pop-in px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-nuit/70">
            Salut <span className="font-semibold text-nuit">{prenom}</span> 👋
          </p>
          <button
            type="button"
            onClick={changer}
            className="zone-tactile inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-mer shadow-sm active:scale-95"
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden /> Changer
          </button>
        </div>
        <EquipeFiche data={data} equipe={equipe} prenomEnAvant={prenom} />
      </div>
    )
  }

  // Cas 2 : prénom mémorisé mais introuvable dans le Sheet → on invite à re-choisir.
  // Cas 3 : aucun prénom → sélecteur.
  return (
    <div className="animate-pop-in px-4 pt-4">
      <PageHeader titre="Mon équipe" sousTitre="Choisis ton prénom pour retrouver ton équipe" />

      {prenom && !equipe && (
        <p className="mb-3 rounded-xl bg-soleil/20 px-3 py-2 text-sm text-nuit">
          « {prenom} » n'est pas (ou plus) dans la liste. Choisis à nouveau ci-dessous.
        </p>
      )}

      {data.participants.length === 0 ? (
        <div className="carte">
          <ContenuVide
            titre="Liste des participants vide"
            detail="Remplis l'onglet Participants du Sheet pour activer cette page."
            icone={<UserRound className="h-10 w-10" aria-hidden />}
          />
        </div>
      ) : (
        <>
          <div className="carte mb-3 flex items-center gap-2 px-3 py-2">
            <Search className="h-4 w-4 text-nuit/40" aria-hidden />
            <input
              type="search"
              inputMode="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Cherche ton prénom…"
              className="w-full bg-transparent py-1.5 text-base outline-none placeholder:text-nuit/40"
              aria-label="Rechercher un prénom"
            />
          </div>

          <ul className="carte divide-y divide-nuit/5">
            {participantsFiltres.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-nuit/50">Aucun prénom trouvé.</li>
            )}
            {participantsFiltres.map((p) => {
              const eq = data.equipes.find(
                (e) => e.nom.trim().toLowerCase() === p.equipe.trim().toLowerCase(),
              )
              const fond = eq ? couleurEquipe(eq.couleur) : '#0EA5E9'
              return (
                <li key={`${p.nom}-${p.equipe}`}>
                  <button
                    type="button"
                    onClick={() => choisir(p.nom)}
                    className="zone-tactile flex w-full items-center gap-3 px-4 py-3 text-left active:bg-nuit/5"
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                      style={{ backgroundColor: fond, color: eq ? texteSurFond(fond) : '#fff' }}
                      aria-hidden
                    >
                      {eq?.emoji ?? p.nom.charAt(0)}
                    </span>
                    <span className="flex-1 font-medium text-nuit">{p.nom}</span>
                    <span className="text-xs text-nuit/50">{afficheNom(data.equipes, p.equipe)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
