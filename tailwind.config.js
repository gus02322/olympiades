/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette « bord de mer / olympiade estivale »
        mer: '#0EA5E9',       // bleu océan
        sable: '#FCEFCB',     // sable chaud
        corail: '#FF6B6B',    // corail vif
        soleil: '#FFD166',    // jaune soleil
        menthe: '#06D6A0',    // vert menthe
        nuit: '#0B2545',      // bleu nuit (texte foncé)
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        carte: '0 8px 24px -12px rgba(11, 37, 69, 0.25)',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'grow-bar': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.35s ease-out both',
        'grow-bar': 'grow-bar 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
