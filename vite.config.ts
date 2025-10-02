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
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'TechCarbonEstimator',
      fileName: 'main',
      formats: ['es', 'umd'],
    }, 
    outDir: './dist/tech-carbon-estimator',
  },
  server: {
    port: 4200,
  },
});