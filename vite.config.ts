import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT (GitHub Pages) :
// `base` doit valoir "/<nom-du-repo>/". Ici le repo s'appelle "olympiades",
// donc le site sera servi sous https://<utilisateur>.github.io/olympiades/.
// Si tu renommes le repo, mets à jour cette valeur en conséquence.
export default defineConfig({
  plugins: [react()],
  base: '/olympiades/',
})
