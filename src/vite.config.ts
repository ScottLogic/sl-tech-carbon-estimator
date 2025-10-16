import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import angular from '@analogjs/vite-plugin-angular';
import string from 'vite-plugin-string';
import { resolve } from 'path';

console.log('DIR Name:' +__dirname);

export default defineConfig({
  plugins: [
    angular(),
    tailwindcss(),
    string({
      include: ['**/*.css']
    }),
  ],
  root: '.',
  build: {
    outDir: '../dist/tech-carbon-estimator',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'package-index.html')
      },
    }
  },  
  server: {
    port: 4200,
  },
});