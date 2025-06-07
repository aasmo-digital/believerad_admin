import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/', // 👈 👈 👈 Add this line
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'crypto'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});



