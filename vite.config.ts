import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // El workflow de GitHub Pages define BASE_PATH según el nombre del repo.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
})
