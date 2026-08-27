import { CalendarRange, ChevronDown } from 'lucide-react'
import { useData } from '../data/DataContext'

/**
 * Sélecteur d'édition (année), visible depuis tous les écrans.
 * Utilise un <select> natif (roue de sélection agréable sur mobile) habillé
 * d'une pastille aux couleurs de l'app.
 */
export function YearSelector() {
  const { annees, annee, setAnnee } = useData()
  if (annees.length === 0) return null

  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-sm font-bold text-mer shadow-sm">
      <CalendarRange className="h-4 w-4" aria-hidden />
      <span>{annee || '—'}</span>
      <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
      <select
        value={annee}
        onChange={(e) => setAnnee(Number(e.target.value))}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Choisir l'édition (année)"
      >
        {annees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </label>
  )
}
