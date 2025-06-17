// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy configuration
    proxy: {
      // Any request starting with /api will be forwarded
      '/api': {
        target: 'http://localhost:5000', // Your backend server URL
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Recommended for development with http
      },
    },
  },
});