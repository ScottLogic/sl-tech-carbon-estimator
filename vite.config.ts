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
  root: 'src',
  build: {
    outDir: '../dist/tech-carbon-estimator',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/package-index.html'),
      },
    }
  },  
  server: {
    port: 4200,
  },
});