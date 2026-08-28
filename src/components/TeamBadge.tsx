import type { Equipe } from '../types'
import { afficheEquipe, couleurEquipe, cx, texteSurFond } from '../lib/utils'

/** Pastille colorée représentant une équipe (emoji + nom). */
export function TeamBadge({
  equipe,
  taille = 'md',
  className,
}: {
  equipe: Equipe
  taille?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const fond = couleurEquipe(equipe.couleur)
  const texte = texteSurFond(fond)
  const tailles = {
    sm: 'text-sm px-2.5 py-1 gap-1.5',
    md: 'text-base px-3 py-1.5 gap-2',
    lg: 'text-lg px-4 py-2 gap-2.5 font-semibold',
  }
  return (
    <span
      className={cx('inline-flex items-center rounded-full font-medium', tailles[taille], className)}
      style={{ backgroundColor: fond, color: texte }}
    >
      <span aria-hidden>{equipe.emoji}</span>
      <span>{afficheEquipe(equipe)}</span>
    </span>
  )
}

/** Petite pastille ronde avec juste l'emoji, aux couleurs de l'équipe. */
export function TeamDot({ equipe, className }: { equipe: Equipe; className?: string }) {
  const fond = couleurEquipe(equipe.couleur)
  return (
    <span
      className={cx('inline-flex h-9 w-9 items-center justify-center rounded-full text-lg shadow', className)}
      style={{ backgroundColor: fond }}
      aria-hidden
    >
      {equipe.emoji}
    </span>
  )
}
