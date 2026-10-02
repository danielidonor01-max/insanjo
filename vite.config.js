import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    // Never ship source maps — they expose the original, readable source.
    sourcemap: false,
  },
  // Production builds drop console/debugger calls and license comments.
  esbuild: mode === 'production'
    ? { drop: ['console', 'debugger'], legalComments: 'none' }
    : {},
}));
