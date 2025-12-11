import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'II-51-Laboratorios/LAB10/dist',
  plugins: [react()],
})
