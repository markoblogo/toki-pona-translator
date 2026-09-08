import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: {
        'sitelen-layer-plugin': resolve(__dirname, 'src/index.ts'),
        'sitelen-emoji-truth': resolve(__dirname, 'src/sitelen-emoji-truth.ts'),
        cli: resolve(__dirname, 'src/cli.ts'),
        react: resolve(__dirname, 'src/react.ts'),
        vue: resolve(__dirname, 'src/vue.ts'),
        svelte: resolve(__dirname, 'src/svelte.ts'),
        next: resolve(__dirname, 'src/next.ts'),
        'vite-plugin': resolve(__dirname, 'src/vite-plugin.ts'),
        'webpack-plugin': resolve(__dirname, 'src/webpack-plugin.ts')
      },
      name: 'SitelenLayerPlugin',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'iife') {
          return `${entryName}.iife.js`;
        }

        if (format === 'cjs') {
          return `${entryName}.cjs`;
        }

        return `${entryName}.js`;
      }
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          typeof warning === 'object' &&
          warning.message.includes('src/next.ts') &&
          (warning.message.includes('Module level directives cause errors when bundled, "use client"') ||
            warning.message.includes('Can\'t resolve original location of error'))
        ) {
          return;
        }

        warn(warning);
      },
      output: {
        exports: 'named'
      }
    }
  }
});
