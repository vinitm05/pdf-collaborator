import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { viteWorker } from "vite-plugin-worker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteWorker()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
