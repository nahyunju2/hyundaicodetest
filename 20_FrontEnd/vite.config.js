import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths";
import vue from '@vitejs/plugin-vue'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import AutoImport from 'unplugin-auto-import/vite'

import { visualizer } from "rollup-plugin-visualizer";


export default ({ mode }) => {
  console.log("Run Mode : " + mode);

  return defineConfig({
    plugins: [
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "pinia"
        ],
        dts: './src/auto-imports.d.ts',
        vueTemplate: false,
        eslintrc: {
          enabled: true
        }
      }),
      tsconfigPaths(),
      vue({
        template: { transformAssetUrls }
      }),
      quasar(),
      visualizer({
        emitFile: true,
        filename: "stats.html",
        projectRoot:"../publish"
      })
    ],
    resolve: {
      alias: {
          '@': '/src'
      }
    },
    base: "/",
    server: {
      host: "localhost",
      base: "/",
      port: 80,
      strictPort: true,
      open: true,
      proxy: {
        "/api/": {
          target: "http://localhost:8080",
          changeOrigin: true
        }
      }
    },
  })
}