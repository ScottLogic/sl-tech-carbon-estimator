import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import string from 'vite-plugin-string';
import {resolve} from 'path';

export default defineConfig({
  plugins: [
    angular(),
    string({
      include: ['**/*.generated.css', '**/*.css'] // Import .css files as strings
    }),
  ],
  root: 'src',
  build: {
    target: 'es2022',
    outDir: '../dist/tech-carbon-estimator',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/elements',
        'zone.js',
      ],
      output: {
        globals: {
          '@angular/core': 'ng.core',
          '@angular/common': 'ng.common',
          '@angular/elements': 'ng.elements',
          'zone.js': 'Zone',
        },
      },
    },  
  },
  server: {
    port: 4200,
  },
  assetsInclude: ['**/*.ico', '**/*.css'],
});