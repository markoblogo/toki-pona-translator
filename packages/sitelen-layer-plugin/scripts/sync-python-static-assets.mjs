import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const targetRoot = path.join(
  projectRoot,
  'python',
  'sitelen-layer-static',
  'src',
  'sitelen_layer_static',
  'assets'
);

rmSync(targetRoot, { recursive: true, force: true });
mkdirSync(targetRoot, { recursive: true });
cpSync(path.join(projectRoot, 'dist'), path.join(targetRoot, 'dist'), { recursive: true });
cpSync(path.join(projectRoot, 'sitelen-pona-font.css'), path.join(targetRoot, 'sitelen-pona-font.css'));
cpSync(path.join(projectRoot, 'assets', 'fonts'), path.join(targetRoot, 'assets', 'fonts'), { recursive: true });

console.log('Synced built plugin assets into sitelen-layer-static');
