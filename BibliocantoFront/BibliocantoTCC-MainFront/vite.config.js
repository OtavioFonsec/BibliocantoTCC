import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'staticwebapp.config.json', // Caminho do arquivo na raiz do projeto
          dest: '.' // Copia para a raiz do dist/
        }
      ]
    })
  ]
});
