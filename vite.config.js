// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Must match your repo path exactly:
const repositoryName = '/kelvin-portfolio-2025/'

export default defineConfig({
  base: repositoryName,
  plugins: [react(), tailwindcss()],
})
