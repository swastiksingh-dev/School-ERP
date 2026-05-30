import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path for GitHub Pages deployment
// https://swastiksingh-dev.github.io/School-ERP/
export default defineConfig({
  base: '/School-ERP/',
  plugins: [react()],
});
