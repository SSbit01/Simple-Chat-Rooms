import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import tsconfigPaths from "vite-tsconfig-paths"
import { VitePWA } from "vite-plugin-pwa"


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "")

  return {
    plugins: [vue(), tsconfigPaths(), VitePWA()],
    server: {
      proxy: {
        "/socket": {
          target: `ws://localhost:${env.SERVER_PORT || 3000}`,
          ws: true
        }
      },
    },
    build: {
      outDir: "../dist/public"
    }
  }
})
