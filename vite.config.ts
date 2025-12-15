import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgLoader(), vue()],
  resolve: {
    alias: {
      "@src": "/src",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@assets": "/src/assets",
      "@icons": "/src/icons",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  assetsInclude: ["**/*.svg"],
});
