import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve source files for development
app.use('/src', express.static(path.join(__dirname, 'src')));

// Handle client-side routing - always return index.html for non-file requests
app.get('*', (req, res) => {
  // Don't intercept requests for static files or source files
  if (req.path.startsWith('/src/') || req.path.startsWith('/dist/')) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
