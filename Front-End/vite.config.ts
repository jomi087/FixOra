import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  server: {  // we can set our own choice of port like this
    port : 3000,
    open: true
  },
  //shadcn
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },


})
