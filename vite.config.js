import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [solid(),tailwindcss()],
  server: {
    allowedHosts : true
  },
  base:"./",
  build: {
    cssMinify: "esbuild",
  }
})
