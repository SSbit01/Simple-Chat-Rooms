import { fileURLToPath, URL } from "node:url"
import { defineConfig, loadEnv } from "vite"

import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "")

  return {
    plugins: [
      vue(),
      VitePWA({
        includeAssets: ["fonts/*.ttf"],
        manifest: {
          id: "/",
          start_url: "/",
          name: "SCR by SSbit01",
          short_name: "SCR",
          description: "A platform where users can create and join chat rooms without creating an account",
          theme_color: "#153b4e",
          background_color: "#153b4e",
          display: "standalone",
          icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png"
            }
          ]
        }
      })
    ],
    server: {
      proxy: {
        "/socket": {
          target: `ws://localhost:${env.SERVER_PORT || 3000}`,
          ws: true
        }
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@global": fileURLToPath(new URL("./../global", import.meta.url))
      }
    },
    build: {
      outDir: "../dist/public"
    }
  }
})
