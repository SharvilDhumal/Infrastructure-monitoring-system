import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,  // Default Vite port
    open: true,
    host: true,  // This makes the server accessible on your local network
  },
  preview: {
    port: 5173,
    host: true,
  },
});
