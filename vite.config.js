// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 💡 IMPORTANT: Replace 'REPOSITORY-NAME' with your actual GitHub repository name, 
// including the leading and trailing slashes. E.g., '/kelvin-portfolio/'
const repositoryName = '/https://github.com/kelvinchow2003/Kelvins-Website-2025-NAME/' 

export default defineConfig({
  // --- ADDED THIS LINE ---
  base: repositoryName, 
  // -----------------------
  plugins: [react(), tailwindcss()],
})