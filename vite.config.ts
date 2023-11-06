import { rmSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      react(),
      electron([
        {
          entry: 'electron/main/server/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log('[startup] Electron App');
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild ? 'esbuild' : false,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: [
                  ...Object.keys(pkg.dependencies || {}),
                  'electron',
                  // If "electron/main/server" is not supposed to be bundled:
                  'electron/main/server',
                ],
                output: {
                  format: 'cjs',
                },
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : false,
              minify: isBuild ? 'esbuild' : false,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: [
                  ...Object.keys(pkg.dependencies || {}),
                  // Specify additional external dependencies if necessary
                ],
                output: {
                  format: 'cjs',
                },
              },
            },
          },
        }
      ]),
      renderer(),
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
      return {
        host: url.hostname,
        port: +url.port,
      };
    })(),
    build: {
      rollupOptions: {
        external: [
          'electron/main/server', // Include this if `electron/main/server` is not part of the bundle
        ],
      },
    },
    clearScreen: false,
  };
});
