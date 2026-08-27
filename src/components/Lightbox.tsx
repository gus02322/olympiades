import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Visionneuse plein écran (lightbox).
 * S'affiche par-dessus toute l'app ; se ferme au clic sur le fond, sur la croix,
 * ou avec la touche Échap. `src` à null = fermée.
 */
export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null
  alt: string
  onClose: () => void
}) {
  // Fermeture avec Échap + blocage du défilement de la page en arrière-plan.
  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [src, onClose])

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={onClose}
            className="zone-tactile absolute right-3 top-3 flex items-center justify-center rounded-full bg-white/15 p-2 text-white active:scale-95"
            style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
            aria-label="Fermer"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            // Clic sur l'image = ne pas fermer (on ferme via le fond ou la croix).
            onClick={(e) => e.stopPropagation()}
          />
          <p
            className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-sm font-medium text-white/80"
            style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
          >
            {alt}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
