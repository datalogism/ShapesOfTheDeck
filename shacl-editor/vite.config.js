import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs/promises'

function saveShapePlugin() {
  return {
    name: 'save-shape',
    configureServer(server) {
      server.middlewares.use('/save-shape', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { ttl, filename, entry } = JSON.parse(body);
            const shapesDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'public', 'shapes');
            const fullPath = path.join(shapesDir, filename);
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, ttl, 'utf-8');
            const indexPath = path.join(shapesDir, 'index.json');
            const index = JSON.parse(await fs.readFile(indexPath, 'utf-8'));
            const filtered = index.filter(e => e.path !== filename);
            filtered.push({ path: filename, ...entry });
            await fs.writeFile(indexPath, JSON.stringify(filtered, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), saveShapePlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8765',
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
