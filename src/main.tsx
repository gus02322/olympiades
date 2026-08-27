import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// HashRouter : évite les erreurs 404 au rafraîchissement sur GitHub Pages
// (l'URL utilise un « # », donc le serveur sert toujours index.html).
import { HashRouter } from 'react-router-dom'
import App from './App'
import { DataProvider } from './data/DataContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </HashRouter>
  </StrictMode>,
)
