import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import string from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    angular(),
    string({
      include: ['**/*.generated.css', '*.css'] // Import .css files as strings
    }),
  ],
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'TechCarbonEstimator',
      fileName: 'main',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Externalize Angular dependencies for npm package
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/elements',
        // ...add others as needed
      ],
      output: {
        globals: {
          '@angular/core': 'ng.core',
          '@angular/common': 'ng.common',
          '@angular/elements': 'ng.elements',
        },
      },
    },
  },
});