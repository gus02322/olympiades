import { useEffect, useState } from 'react'
import { decompte } from '../lib/utils'

/** Une case du compte à rebours (valeur + libellé). */
function Case({ valeur, label }: { valeur: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[3rem] rounded-xl bg-white/10 px-2 py-1.5 text-2xl font-black tabular-nums text-white">
        {String(valeur).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
        {label}
      </span>
    </div>
  )
}

/**
 * Compte à rebours J‑H‑M‑S jusqu'à une date cible, actualisé chaque seconde.
 * Renvoie null si la date est invalide. Affiche un message festif une fois la date atteinte.
 */
export function Countdown({ cibleIso }: { cibleIso: string }) {
  const cible = new Date(`${cibleIso}T00:00:00`)
  const valide = !Number.isNaN(cible.getTime())

  const [maintenant, setMaintenant] = useState(() => Date.now())
  useEffect(() => {
    if (!valide) return
    const id = setInterval(() => setMaintenant(Date.now()), 1000)
    return () => clearInterval(id)
  }, [valide])

  if (!valide) return null

  const { jours, heures, minutes, secondes, passe } = decompte(cible, maintenant)

  if (passe) {
    return <p className="mt-3 text-lg font-extrabold text-soleil">C'est le grand jour ! 🎉</p>
  }

  return (
    <div className="mt-4 flex items-start justify-center gap-2" aria-label="Compte à rebours">
      <Case valeur={jours} label="Jours" />
      <Case valeur={heures} label="Heures" />
      <Case valeur={minutes} label="Min" />
      <Case valeur={secondes} label="Sec" />
    </div>
  )
}
