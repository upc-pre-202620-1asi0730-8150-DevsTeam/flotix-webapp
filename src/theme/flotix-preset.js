import { definePreset } from '@primeuix/themes'
import Material from '@primeuix/themes/material'

/**
 * Flotix PrimeVue theme — extends the Material preset (per the course
 * spec: "el lenguaje de diseño ... estará basado en Material Design")
 * with the product's own primary blue and a navy semantic color used
 * by the app shell (sidebar / auth hero panels).
 */
export const FlotixPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '#eef6ff',
      100: '#dbeafe',
      200: '#bfddfe',
      300: '#8ec5fd',
      400: '#54a5fa',
      500: '#1e87f0',
      600: '#0879e8',
      700: '#0662bd',
      800: '#094f94',
      900: '#0c4278',
      950: '#082a4d'
    },
    colorScheme: {
      light: {
        primary: {
          color: '#0879e8',
          contrastColor: '#ffffff',
          hoverColor: '#0662bd',
          activeColor: '#094f94'
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      }
    }
  }
})

// Navy brand tokens for the app shell (sidebar gradient, auth hero panel) —
// exposed as CSS custom properties in main.css, used by scoped component
// styles that fall outside PrimeVue's own semantic tokens.
export const FLOTIX_NAVY = { 700: '#123258', 800: '#0e2c4e', 900: '#0a2a49', 950: '#0b1f33' }
