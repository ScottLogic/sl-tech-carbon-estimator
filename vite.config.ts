import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import string from 'vite-plugin-string';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    angular(),
    string({
      include: ['**/*.generated.css', '**/*.css'] // Import .css files as strings
    }),
  ],
  build: {
    outDir: './dist/tech-carbon-estimator',
    emptyOutDir: true,
  },
  server: {
    port: 4200,
  },
});
