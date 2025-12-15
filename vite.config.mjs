import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";
const isCypress = process.env.CYPRESS;

export default defineConfig({
  plugins: [
    react(),
    isCypress && istanbul({
      include: 'src/*', 
      exclude: ['node_modules', 'cypress/', '**/test/'], 
      cypress: true, 
      extension: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ].filter(Boolean), 
  
  server: {
    port: 5173,
    hmr: {
      port: 5173,
    },
  },
});