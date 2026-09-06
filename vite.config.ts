import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from "node:path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname,"index.html"),
        history: resolve(import.meta.dirname,"history/index.html"),
        latestNews: resolve(import.meta.dirname,"latest-news/index.html"),
        midc: resolve(import.meta.dirname,"midc/index.html"),
        blog: resolve(import.meta.dirname,"blog/index.html"),
        media: resolve(import.meta.dirname,"media/index.html")
      }
    }
  }
});
