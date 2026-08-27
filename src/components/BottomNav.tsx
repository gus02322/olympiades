import { NavLink } from 'react-router-dom'
import { Home, Trophy, Users, Star, CalendarClock, Crown } from 'lucide-react'
import { cx } from '../lib/utils'

const onglets = [
  { to: '/', label: 'Accueil', icone: Home, exact: true },
  { to: '/classement', label: 'Classement', icone: Trophy },
  { to: '/equipes', label: 'Équipes', icone: Users },
  { to: '/mon-equipe', label: 'Mon équipe', icone: Star },
  { to: '/programme', label: 'Programme', icone: CalendarClock },
  { to: '/legende', label: 'Légende', icone: Crown },
]

/** Barre de navigation fixée en bas d'écran, style application mobile. */
export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-nuit/10 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {onglets.map(({ to, label, icone: Icone, exact }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={exact}
              className={({ isActive }) =>
                cx(
                  'zone-tactile flex flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-mer' : 'text-nuit/50',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icone
                    className={cx('h-5 w-5 transition-transform', isActive && 'scale-110')}
                    aria-hidden
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
