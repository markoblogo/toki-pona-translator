import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('package exports', () => {
  it('exposes bundled sitelen pona font CSS and assets', async () => {
    const packageJson = JSON.parse(await readFile(resolve(repoRoot, 'package.json'), 'utf8'));

    expect(packageJson.exports['./sitelen-pona-font.css']).toBe('./sitelen-pona-font.css');
    expect(packageJson.exports['./sitelen-emoji-truth']).toEqual(
      expect.objectContaining({
        import: './dist/sitelen-emoji-truth.js',
        require: './dist/sitelen-emoji-truth.cjs',
        types: './dist/sitelen-emoji-truth.d.ts'
      })
    );
    expect(packageJson.exports['./cli']).toEqual(
      expect.objectContaining({
        import: './dist/cli.js',
        require: './dist/cli.cjs',
        types: './dist/cli.d.ts'
      })
    );
    expect(packageJson.exports['./react']).toEqual(
      expect.objectContaining({
        import: './dist/react.js',
        require: './dist/react.cjs',
        types: './dist/react.d.ts'
      })
    );
    expect(packageJson.exports['./vue']).toEqual(
      expect.objectContaining({
        import: './dist/vue.js',
        require: './dist/vue.cjs',
        types: './dist/vue.d.ts'
      })
    );
    expect(packageJson.exports['./svelte']).toEqual(
      expect.objectContaining({
        import: './dist/svelte.js',
        require: './dist/svelte.cjs',
        types: './dist/svelte.d.ts'
      })
    );
    expect(packageJson.exports['./next']).toEqual(
      expect.objectContaining({
        import: './dist/next.js',
        require: './dist/next.cjs',
        types: './dist/next.d.ts'
      })
    );
    expect(packageJson.exports['./vite-plugin']).toEqual(
      expect.objectContaining({
        import: './dist/vite-plugin.js',
        require: './dist/vite-plugin.cjs',
        types: './dist/vite-plugin.d.ts'
      })
    );
    expect(packageJson.exports['./webpack-plugin']).toEqual(
      expect.objectContaining({
        import: './dist/webpack-plugin.js',
        require: './dist/webpack-plugin.cjs',
        types: './dist/webpack-plugin.d.ts'
      })
    );
    expect(packageJson.files).toContain('sitelen-pona-font.css');
    expect(packageJson.files).toContain('adapters');
    expect(packageJson.files).toContain('demo/integration');
    expect(packageJson.files).toContain('docs/MIGRATION_v0.3.0.md');
    expect(packageJson.files).toContain('docs/V0.3_INTEGRATION_TRACK.md');
    expect(packageJson.files).toContain('assets/fonts');
    expect(packageJson.files).toContain('bin/sitelen-layer-cli.mjs');

    expect(packageJson.bin).toHaveProperty('sitelen-layer-cli', 'bin/sitelen-layer-cli.mjs');

    expect(existsSync(resolve(repoRoot, 'sitelen-pona-font.css'))).toBe(true);
    expect(existsSync(resolve(repoRoot, 'assets/fonts/sitelen-seli-kiwen-asuki.ttf'))).toBe(true);
    expect(existsSync(resolve(repoRoot, 'assets/fonts/OFL-sitelen-seli-kiwen.txt'))).toBe(true);
    expect(existsSync(resolve(repoRoot, 'assets/fonts/README.md'))).toBe(true);
  });
});
