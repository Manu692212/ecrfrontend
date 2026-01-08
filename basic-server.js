import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 8081;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const getMimeType = (filePath) => {
  const ext = filePath.split('.').pop();
  return mimeTypes[`.${ext}`] || 'text/plain';
};

const server = createServer(async (req, res) => {
  let filePath = join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  
  // For client-side routing, if it's not a file with an extension, serve index.html
  if (!filePath.includes('.') || filePath.endsWith('/')) {
    filePath = join(__dirname, 'dist', 'index.html');
  }

  try {
    const data = await readFile(filePath);
    const mimeType = getMimeType(filePath);
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  } catch (error) {
    // If file not found and it's a client-side route, serve index.html
    if (!filePath.includes('.') || filePath.endsWith('/')) {
      try {
        const indexData = await readFile(join(__dirname, 'dist', 'index.html'));
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(indexData);
        return;
      } catch (indexError) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Client-side routing enabled for React Router');
});
