import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GLB Draco: @react-three/drei decodifica automáticamente desde el CDN de Google
// (gstatic.com/draco). No hace falta copiar el decoder localmente para dev ni build.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
