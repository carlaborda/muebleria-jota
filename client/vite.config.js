import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, las llamadas a /api se redirigen al backend Express (puerto 3000),
// así el front puede usar rutas relativas sin configurar CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:3000',
    },
  },
})
