import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['pack', '--silent', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
});

if (result.status !== 0) {
  console.error('[smoke-publication] npm pack failed');
  console.error(result.stderr || '');
  process.exit(1);
}

let packOutput;
try {
  packOutput = JSON.parse(result.stdout);
} catch (error) {
  console.error('[smoke-publication] unable to parse npm pack JSON output');
  process.exit(1);
}

const entry = Array.isArray(packOutput) ? packOutput[0] : packOutput;
const filename = entry?.filename;

if (!filename || typeof filename !== 'string') {
  console.error('[smoke-publication] npm pack output does not contain filename');
  process.exit(1);
}

const packagePath = resolve(process.cwd(), filename);
if (!existsSync(packagePath)) {
  console.error('[smoke-publication] npm pack artifact missing:', packagePath);
  process.exit(1);
}

if (statSync(packagePath).size <= 0) {
  console.error('[smoke-publication] npm pack artifact is empty:', packagePath);
  process.exit(1);
}

console.log('[smoke-publication] npm pack produced', filename);
