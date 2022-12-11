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
        includeAssets: ["favicon.ico", "icon.png", "icon.svg"],
        manifest: {
          name: "Simple Chat Rooms by SSbit01",
          short_name: "Simple Chat Rooms",
          description: "It's a platform where users can create and join chat rooms without the need to create an account",
          theme_color: "#0a0f19",
          background_color: "#0a0f19",
          icons: [
            {
              src: "/icon.svg",
              type: "image/svg+xml",
              sizes: "any"
            },
            {
              src: "icon.png",
              type: "image/png",
              sizes: "256x256",
            },
            {
              src: "/favicon.ico",
              type: "image/x-icon",
              sizes: "256x256",
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
