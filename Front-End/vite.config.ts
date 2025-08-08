import path from "path"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) //mode devlopment(env.devlopment) or production(env.production) or  default mode (.env) etc...

  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: Number(env.VITE_PORT), // Dynamically set port from .env
      open: true
    }
  }
})

/*
 Why the config structure was changed:

Originally:
-------------------------
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {  // we can set our own choice of port like this
    port : 5001,
    open: true
  }
})

- This version uses static values.
- It doesn't allow loading .env variables dynamically based on the mode (development, production, etc.).

Now:
-------------------------
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    server: {
      port: Number(env.VITE_PORT),
      open: true
    }
  }
})

- This version uses a function to access `mode`.
- It allows Vite to load environment variables from `.env`, `.env.development`, `.env.production`, etc.
- It's required when using `loadEnv()` for dynamic config.

*/
