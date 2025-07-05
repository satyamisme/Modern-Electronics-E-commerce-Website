import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,
    strictPort: true
  },
  preview: {
    host: '0.0.0.0', // Allow external connections for preview
    port: 4173,
    strictPort: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});