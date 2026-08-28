import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { RefreshIndicator } from './components/RefreshIndicator'
import { YearSelector } from './components/YearSelector'
import { BandeauErreur, Chargement } from './components/states'
import { useData } from './data/DataContext'
import Accueil from './pages/Accueil'
import Classement from './pages/Classement'
import Equipes from './pages/Equipes'
import EquipeDetail from './pages/EquipeDetail'
import MonEquipe from './pages/MonEquipe'
import Programme from './pages/Programme'
import EpreuveDetail from './pages/EpreuveDetail'
import Legende from './pages/Legende'

export default function App() {
  const { chargementInitial, erreur, source } = useData()

  return (
    <div className="min-h-full">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col pb-24">
        {/* Barre supérieure : marque + état de rafraîchissement */}
        <div className="sticky top-0 z-20 border-b border-nuit/5 bg-sable/80 px-4 py-2 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight text-nuit">
              <span aria-hidden>🏝️</span> OlympYeu
            </span>
            {/* Sélecteur d'édition (année), accessible depuis tous les écrans */}
            <YearSelector />
          </div>
          <div className="mt-1">
            <RefreshIndicator />
          </div>
        </div>

        {/* Bandeau d'erreur non bloquant : on garde le contenu visible (cache/démo) */}
        {erreur && source !== 'demo' && (
          <div className="mt-2">
            <BandeauErreur message={`Réseau instable — dernière version affichée. (${erreur})`} />
          </div>
        )}

        <main className="flex-1">
          {chargementInitial ? (
            <Chargement message="Récupération des données de l'olympiade…" />
          ) : (
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/classement" element={<Classement />} />
              <Route path="/equipes" element={<Equipes />} />
              <Route path="/equipes/:nom" element={<EquipeDetail />} />
              <Route path="/mon-equipe" element={<MonEquipe />} />
              <Route path="/programme" element={<Programme />} />
              <Route path="/programme/:nom" element={<EpreuveDetail />} />
              <Route path="/legende" element={<Legende />} />
              {/* Toute route inconnue renvoie à l'accueil */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
