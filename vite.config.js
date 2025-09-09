import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [solid(),tailwindcss()],
  server: {
    allowedHosts : true
  },
  base:"./",
  build: {
    cssMinify: "esbuild",
    rollupOptions:{
      plugins: [visualizer({ open: false })],
      output: {
        manualChunks: (id) => {
          if (id.includes('@permaweb/aoconnect')) {
            return '@permaweb/aoconnect'
          }
          if (id.includes('solid-js')) {
            return 'solid-js'
          }
          
          if (id.includes('bignumber.js')) {
            return 'bignumber.js'
          }
          if (id.includes('@arweave-wallet-kit/core')) {
            return '@arweave-wallet-kit/core'
          }
          if (id.includes('@solidjs/router')) {
            return '@solidjs/router'
          }
          if (id.includes('solid-toast')) {
            return 'solid-toast'
          }
  
          if (id.includes('@iconify-icon/solid')) {
            return '@iconify-icon/solid'
          }
          if (id.includes('@arweave-wallet-kit/othent-strategy')) {
            return '@arweave-wallet-kit/othent-strategy'
          }
          if (id.includes('@arweave-wallet-kit/wander-strateg')) {
            return '@arweave-wallet-kit/wander-strateg'
          }
          if (id.includes('@dha-team/arbundles')) {
            return '@dha-team/arbundles'
          }
          if (id.includes('@vela-ventures/aosync-strategy')) {
            return '@vela-ventures/aosync-strategy'
          }
          if (id.includes('iconify-icon')) {
            return 'iconify-icon'
          }
          if (id.includes('@othent/kms')) {
            return '@othent/kms'
          }
          if (id.includes('buffer/index.js')) {
            return 'buffer/index.js'
          }
          if (id.includes('arwallet-solid-kit')) {
            return 'arwallet-solid-kit'
          }
          if (id.includes('warp-arbundles/build/web/esm/bundle.js')) {
            return 'warp-arbundles/build/web/esm/bundle.js'
          }
   
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      },
    }
  }
})
