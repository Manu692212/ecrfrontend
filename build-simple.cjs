const fs = require('fs');
const path = require('path');

// Simple TypeScript to JavaScript conversion (basic)
function convertTSXToJS(content) {
  // Remove TypeScript type annotations (basic)
  let jsContent = content
    .replace(/:\s*\w+(\[\])?/g, '') // Remove type annotations
    .replace(/<(\w+)([^>]*)>/g, '<$1$2>') // Keep JSX tags
    .replace(/<\/(\w+)>/g, '</$1>') // Keep closing tags
    .replace(/import\s+.*?\s+from\s+["'][^"']+["'];?/g, (match) => {
      // Convert .tsx/.ts imports to .js
      return match.replace(/\.tsx?(['"])/, '.js$1');
    })
    .replace(/from\s+["'][^"']*\.tsx?["']/g, (match) => {
      return match.replace(/\.tsx?(['"])/, '.js$1');
    });
  
  return jsContent;
}

// Build directory
const buildDir = path.join(__dirname, 'dist');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Copy and convert files
function processDirectory(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }
  
  const items = fs.readdirSync(srcDir);
  
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      processDirectory(srcPath, destPath);
    } else {
      if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const content = fs.readFileSync(srcPath, 'utf8');
        const jsContent = convertTSXToJS(content);
        const jsPath = destPath.replace(/\.(tsx?)/, '.js');
        fs.writeFileSync(jsPath, jsContent);
        console.log(`Converted ${item} -> ${path.basename(jsPath)}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${item}`);
      }
    }
  }
}

// Process src directory
processDirectory(path.join(__dirname, 'src'), path.join(buildDir, 'src'));

// Copy other files
['index.html', 'public'].forEach(item => {
  const srcPath = path.join(__dirname, item);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(buildDir, item);
    if (fs.statSync(srcPath).isDirectory()) {
      processDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
});

// Update index.html to point to .js files
const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let htmlContent = fs.readFileSync(indexPath, 'utf8');
  htmlContent = htmlContent.replace('/src/main.tsx', '/src/main.js');
  fs.writeFileSync(indexPath, htmlContent);
  console.log('Updated index.html');
}

console.log('Build completed!');
