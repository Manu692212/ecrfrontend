const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  // Handle API requests to backend
  if (req.url.startsWith('/api') || req.url.startsWith('/admin')) {
    // Proxy API and admin requests to Laravel backend
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxy = http.request(options, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res);
    });

    proxy.on('error', (err) => {
      res.writeHead(500);
      res.end('Proxy error: ' + err.message);
    });

    req.pipe(proxy);
    return;
  }

  // Serve static files or fallback to index.html for client-side routing
  const requestedUrl = req.url.split('?')[0].split('#')[0];
  const safePath = requestedUrl === '/'
    ? 'index.html'
    : requestedUrl.replace(/^\/+/, '');
  let filePath = path.join(__dirname, 'dist', safePath);

  const hasExtension = Boolean(path.extname(safePath));

  // If the path looks like an asset and it doesn't exist, bail with 404
  if (hasExtension && !fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>', 'utf-8');
    return;
  }

  // For clean URLs (no extension), fall back to index.html when missing
  if (!hasExtension && !fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for client-side routing
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        fs.readFile(indexPath, (indexError, indexContent) => {
          if (indexError) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>', 'utf-8');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error', 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
