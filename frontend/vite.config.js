import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const isGitHubPagesBuild = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  root: __dirname,
  base: isGitHubPagesBuild ? '/Portfolio/' : '/',
  publicDir: path.resolve(projectRoot, 'public'),
  plugins: [tailwindcss()],
  build: {
    outDir: path.resolve(projectRoot, 'dist/client'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
