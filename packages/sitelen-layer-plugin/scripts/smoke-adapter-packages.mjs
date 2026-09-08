import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(process.cwd());
const adaptersDir = join(projectRoot, 'adapters');
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const packageVersion = packageJson.version;
const packageName = packageJson.name;
const distAdaptersDir = join(projectRoot, 'dist', 'adapters');

if (!existsSync(adaptersDir)) {
  console.error('[smoke-adapters] adapters directory not found:', adaptersDir);
  process.exit(1);
}

if (!existsSync(distAdaptersDir)) {
  console.error('[smoke-adapters] adapter packages were not generated:', distAdaptersDir);
  process.exit(1);
}

const adapterNames = readdirSync(adaptersDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name)
  .sort();

function extractFilesFromZip(zipPath) {
  const zipResult = spawnSync('unzip', ['-l', zipPath], {
    encoding: 'utf8'
  });

  if (zipResult.status !== 0) {
    console.error('[smoke-adapters] unzip failed for', zipPath);
    console.error(zipResult.stderr || '');
    process.exit(1);
  }

  return zipResult.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && /^[0-9]/.test(line))
    .map((line) => {
      const parts = line.split(/\s+/);
      const entry = parts[parts.length - 1] || '';
      return entry.startsWith('./') ? entry.slice(2) : entry;
    })
    .filter(Boolean);
}

function collectEntryAssets(entryObj, list = new Set()) {
  if (typeof entryObj === 'string') {
    list.add(entryObj);
    return list;
  }

  if (!entryObj || typeof entryObj !== 'object') {
    return list;
  }

  if (Array.isArray(entryObj)) {
    for (const item of entryObj) {
      collectEntryAssets(item, list);
    }
    return list;
  }

  for (const value of Object.values(entryObj)) {
    collectEntryAssets(value, list);
  }

  return list;
}

for (const name of adapterNames) {
  const expectedZip = join(distAdaptersDir, `${packageName}-${name}-v${packageVersion}.zip`);
  if (!existsSync(expectedZip)) {
    console.error('[smoke-adapters] missing zip package:', expectedZip);
    process.exit(1);
  }

  const files = extractFilesFromZip(expectedZip);
  if (!files.some((file) => file.endsWith('entry.json'))) {
    console.error('[smoke-adapters] missing entry.json in', expectedZip);
    process.exit(1);
  }

  if (!files.some((file) => /^README\.md$/i.test(file))) {
    console.error('[smoke-adapters] missing README.md in', expectedZip);
    process.exit(1);
  }

  const manifestPath = join(adaptersDir, name, 'entry.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const requiredAssets = collectEntryAssets(manifest.entry || {});
  for (const asset of requiredAssets) {
    if (!asset) continue;
    const present = files.some((file) => file === asset);
    if (!present) {
      console.error(`[smoke-adapters] missing manifest entry asset ${asset} in ${expectedZip}`);
      process.exit(1);
    }
  }

  console.log(`[smoke-adapters] ${name}: ${files.length} files in package`);
}

console.log('[smoke-adapters] all adapter packages passed');
