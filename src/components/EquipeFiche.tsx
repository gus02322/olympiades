import { Users } from 'lucide-react'
import type { AppData, Equipe } from '../types'
import { classementGeneral, epreuvesTriees, membresEquipe, scoreEquipeEpreuve } from '../data/transform'
import { couleurEquipe, medaille, texteSurFond } from '../lib/utils'
import { ContenuVide } from './states'

/**
 * Fiche détaillée d'une équipe : thème, couleur, membres, total,
 * et score + classement épreuve par épreuve.
 * Utilisée par « Équipes → fiche » et par « Mon équipe ».
 */
export function EquipeFiche({
  data,
  equipe,
  prenomEnAvant,
}: {
  data: AppData
  equipe: Equipe
  /** Prénom du membre à mettre en avant (page « Mon équipe »). */
  prenomEnAvant?: string
}) {
  const fond = couleurEquipe(equipe.couleur)
  const couleurTexte = texteSurFond(fond)
  const membres = membresEquipe(data, equipe.nom)
  const rangs = classementGeneral(data.equipes, data.scores)
  const monRang = rangs.find((r) => r.equipe.nom === equipe.nom)
  const epreuves = epreuvesTriees(data.epreuves)

  return (
    <div className="space-y-4">
      {/* En-tête coloré */}
      <section className="carte overflow-hidden">
        <div className="px-5 py-6" style={{ backgroundColor: fond, color: couleurTexte }}>
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {equipe.emoji}
            </span>
            <div>
              <h2 className="text-2xl font-extrabold leading-tight">{equipe.nom}</h2>
              {equipe.theme && <p className="text-sm opacity-90">Thème : {equipe.theme}</p>}
            </div>
          </div>
          <div className="mt-4 flex items-end gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide opacity-80">Total</p>
              <p className="text-3xl font-black">{monRang?.total ?? 0} pts</p>
            </div>
            {monRang && (
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80">Classement</p>
                <p className="text-xl font-bold">
                  {medaille(monRang.rang)} {monRang.rang}
                  <sup>{monRang.rang === 1 ? 'er' : 'e'}</sup>
                </p>
              </div>
            )}
          </div>
          {/* Note éventuelle de l'équipe (ex. vainqueur de la finale) */}
          {equipe.note && (
            <p
              className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold"
              style={{ backgroundColor: 'rgba(255,255,255,0.22)', color: couleurTexte }}
            >
              {equipe.note}
            </p>
          )}
        </div>
      </section>

      {/* Membres */}
      <section className="carte px-4 py-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-nuit">
          <Users className="h-4 w-4 text-mer" aria-hidden /> Membres ({membres.length})
        </h3>
        {membres.length === 0 ? (
          <p className="text-sm text-nuit/50">Aucun membre renseigné.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {membres.map((m) => {
              const enAvant = prenomEnAvant && m.toLowerCase() === prenomEnAvant.toLowerCase()
              return (
                <span
                  key={m}
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={
                    enAvant
                      ? { backgroundColor: fond, color: couleurTexte }
                      : { backgroundColor: 'rgba(11,37,69,0.06)', color: '#0B2545' }
                  }
                >
                  {enAvant && '⭐ '}
                  {m}
                </span>
              )
            })}
          </div>
        )}
      </section>

      {/* Détail épreuve par épreuve */}
      <section className="carte overflow-hidden">
        <h3 className="px-4 pt-4 text-sm font-bold text-nuit">Épreuve par épreuve</h3>
        {epreuves.length === 0 ? (
          <ContenuVide titre="Aucune épreuve" />
        ) : (
          <ul className="mt-2 divide-y divide-nuit/5">
            {epreuves.map((ep) => {
              const s = scoreEquipeEpreuve(data.scores, ep.nom, equipe.nom)
              return (
                <li key={ep.nom} className="flex items-center justify-between px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-nuit">{ep.nom}</p>
                    {s?.classement != null && (
                      <p className="text-xs text-nuit/50">
                        {medaille(s.classement)} {s.classement}
                        <sup>{s.classement === 1 ? 'er' : 'e'}</sup> sur l'épreuve
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-bold text-nuit">
                    {s ? `${s.points} pts` : <span className="text-nuit/30">—</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
