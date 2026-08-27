import { motion } from 'framer-motion'
import type { RangEquipe } from '../types'
import { couleurEquipe, texteSurFond } from '../lib/utils'

/**
 * Podium animé du classement général (1·2·3).
 * L'ordre visuel est 2e - 1er - 3e, avec des hauteurs de marches différentes.
 */
export function Podium({ rangs }: { rangs: RangEquipe[] }) {
  const premier = rangs[0]
  const deuxieme = rangs[1]
  const troisieme = rangs[2]

  // Ordre d'affichage des marches (podium olympique).
  const marches = [
    { rang: deuxieme, hauteur: 'h-24', medaille: '🥈', delay: 0.1 },
    { rang: premier, hauteur: 'h-32', medaille: '🥇', delay: 0 },
    { rang: troisieme, hauteur: 'h-16', medaille: '🥉', delay: 0.2 },
  ].filter((m) => m.rang)

  if (!premier) return null

  return (
    <div className="flex items-end justify-center gap-2 px-2">
      {marches.map(({ rang, hauteur, medaille, delay }) => {
        const e = rang!.equipe
        const fond = couleurEquipe(e.couleur)
        const couleurTexte = texteSurFond(fond)
        return (
          <motion.div
            key={e.nom}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex w-1/3 max-w-[7.5rem] flex-col items-center"
          >
            <div className="mb-1 text-3xl" aria-hidden>
              {medaille}
            </div>
            <div className="text-2xl" aria-hidden>
              {e.emoji}
            </div>
            <div className="mt-1 line-clamp-2 text-center text-xs font-semibold leading-tight text-nuit">
              {e.nom}
            </div>
            <div className="text-sm font-extrabold text-nuit">{rang!.total} pts</div>
            <div
              className={`mt-1 flex ${hauteur} w-full items-start justify-center rounded-t-xl pt-2 text-sm font-black shadow-carte`}
              style={{ backgroundColor: fond, color: couleurTexte }}
            >
              {rang!.rang}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
