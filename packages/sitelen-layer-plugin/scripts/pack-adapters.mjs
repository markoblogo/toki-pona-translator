import { existsSync, mkdirSync, readdirSync, rmSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve(process.cwd());
const adaptersDir = join(projectRoot, 'adapters');
const distDir = join(projectRoot, 'dist');
const outputDir = join(distDir, 'adapters');
const packageJsonPath = resolve(projectRoot, 'package.json');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const packageName = packageJson.name;
const packageVersion = packageJson.version;

if (!existsSync(adaptersDir)) {
  console.error('[pack-adapters] adapters directory not found:', adaptersDir);
  process.exit(1);
}

const zipCheck = spawnSync('zip', ['-v'], { encoding: 'utf8' });
if (zipCheck.status !== 0) {
  console.error('[pack-adapters] zip binary is required but was not found in PATH');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const adapterNames = readdirSync(adaptersDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name)
  .sort();

if (adapterNames.length === 0) {
  console.error('[pack-adapters] no adapter packages found');
  process.exit(1);
}

for (const name of adapterNames) {
  const adapterDir = join(adaptersDir, name);
  const sourceManifest = join(adapterDir, 'entry.json');

  if (!existsSync(sourceManifest)) {
    console.error(`[pack-adapters] missing manifest: ${sourceManifest}`);
    process.exit(1);
  }

  const zipFile = join(outputDir, `${packageName}-${name}-v${packageVersion}.zip`);

  if (existsSync(zipFile)) {
    rmSync(zipFile);
  }

  const zipResult = spawnSync(
    'zip',
    ['-r', zipFile, '.'],
    {
      cwd: adapterDir,
      stdio: ['ignore', 'inherit', 'inherit']
    }
  );

  if (zipResult.status !== 0) {
    console.error(`[pack-adapters] failed packaging ${name}`);
    process.exit(1);
  }

  const size = statSync(zipFile).size;
  if (!size) {
    console.error(`[pack-adapters] produced empty package for ${name}`);
    process.exit(1);
  }

  console.log(`[pack-adapters] ${name} -> ${zipFile} (${size} bytes)`);
}
