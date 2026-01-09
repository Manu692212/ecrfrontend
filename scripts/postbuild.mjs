import { copyFile, mkdir, access } from 'fs/promises';
import { constants } from 'fs';
import { resolve } from 'path';

const projectRoot = resolve(process.cwd());
const source = resolve(projectRoot, 'static.json');
const destinationDir = resolve(projectRoot, 'dist');
const destination = resolve(destinationDir, 'static.json');

async function ensureFileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const hasStatic = await ensureFileExists(source);
  if (!hasStatic) {
    console.warn('[postbuild] static.json not found; skipping copy.');
    return;
  }

  await mkdir(destinationDir, { recursive: true });
  await copyFile(source, destination);
  console.info('[postbuild] Copied static.json to dist/.');
}

main().catch((error) => {
  console.error('[postbuild] Failed to copy static.json:', error);
  process.exitCode = 1;
});
