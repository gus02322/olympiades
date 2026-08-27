import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useData } from '../data/DataContext'
import { editionsDisputees } from '../data/transform'
import { PageHeader } from '../components/PageHeader'
import { ContenuVide } from '../components/states'
import { Countdown } from '../components/Countdown'
import { resoudreImage } from '../lib/utils'

/**
 * « La Légende » : le palmarès de toutes les éditions en timeline verticale,
 * façon hall of fame. 2021 (annulée) est distinguée visuellement.
 * Se termine par une carte teaser du prochain chapitre.
 */
export default function Legende() {
  const { data } = useData()
  const { legende, config } = data

  // Numéro du prochain chapitre = nb d'éditions réellement disputées + 1.
  const disputees = editionsDisputees(legende)
  const prochainChapitre = disputees + 1

  // Dernière édition disputée (pour la mettre en avant).
  const derniereDisputee = [...legende].reverse().find((l) => !l.note)

  const prochaineDate = config.prochaine_edition || config.prochaine_date || ''
  const prochaineNote = config.prochaine_note || 'Préparez-vous 💪'

  return (
    <div className="animate-pop-in">
      <PageHeader
        titre="La Légende"
        sousTitre="Le palmarès des champions depuis 2018"
      />

      {legende.length === 0 ? (
        <div className="px-4">
          <div className="carte">
            <ContenuVide titre="Palmarès vide" detail="Remplis l'onglet Legende du Sheet." />
          </div>
        </div>
      ) : (
        <div className="relative px-4">
          {/* Ligne verticale de la timeline */}
          <div className="absolute bottom-0 left-[2.15rem] top-2 w-0.5 bg-gradient-to-b from-soleil via-corail to-mer" />

          <ol className="space-y-3">
            {legende.map((edition, i) => {
              const annulee = Boolean(edition.note)
              const estDerniere = derniereDisputee?.annee === edition.annee
              const photo = resoudreImage(edition.photo)
              return (
                <motion.li
                  key={edition.annee}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex items-center gap-3"
                >
                  {/* Pastille : photo de l'équipe si disponible, sinon emoji */}
                  {photo && !annulee ? (
                    <img
                      src={photo}
                      alt={`Équipe championne ${edition.annee} : ${edition.champion}`}
                      loading="lazy"
                      className={`z-10 h-12 w-12 shrink-0 rounded-full object-cover shadow ${
                        estDerniere ? 'ring-2 ring-soleil' : 'ring-2 ring-white'
                      }`}
                      // Si l'image ne charge pas, on la masque (l'emoji reste en repli via le fond).
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div
                      className={`z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl shadow ${
                        annulee ? 'bg-nuit/10 grayscale' : 'bg-white'
                      }`}
                      aria-hidden
                    >
                      {edition.emoji}
                    </div>
                  )}

                  <div
                    className={`carte flex-1 px-4 py-3 ${
                      annulee ? 'opacity-70' : ''
                    } ${estDerniere ? 'ring-2 ring-soleil' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-nuit/60">{edition.annee}</span>
                      {estDerniere && (
                        <span className="rounded-full bg-soleil/25 px-2 py-0.5 text-[11px] font-bold text-nuit">
                          Champion en titre
                        </span>
                      )}
                      {annulee && (
                        <span className="rounded-full bg-nuit/10 px-2 py-0.5 text-[11px] font-semibold text-nuit/60">
                          Annulée
                        </span>
                      )}
                    </div>
                    {annulee ? (
                      <p className="mt-0.5 text-sm italic text-nuit/60">{edition.note}</p>
                    ) : (
                      <p className="mt-0.5 flex items-center gap-1.5 text-base font-extrabold text-nuit">
                        🏆 {edition.champion}
                      </p>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>

          {/* Carte teaser du prochain chapitre */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: legende.length * 0.04 + 0.1 }}
            className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-corail via-soleil to-menthe p-[2px] shadow-carte"
          >
            <div className="rounded-[calc(1rem-1px)] bg-nuit px-5 py-6 text-center text-white">
              <Sparkles className="mx-auto mb-2 h-6 w-6 text-soleil" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Le prochain chapitre
              </p>
              <p className="mt-1 text-2xl font-black">Chapitre {prochainChapitre}</p>
              {prochaineDate && <p className="mt-1 text-sm text-white/90">{prochaineDate}</p>}
              {/* Compte à rebours (si une date ISO est fournie dans l'onglet Config) */}
              {(config.prochaine_date_iso || config.prochaine_date) && (
                <Countdown cibleIso={config.prochaine_date_iso || config.prochaine_date} />
              )}
              <p className="mt-3 text-base font-medium text-soleil">{prochaineNote}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
