import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, 'src'),
        },
    },
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                {
                    name: 'load-js-files-as-jsx',
                    setup(build) {
                        build.onLoad(
                            { filter: /src\\.*\.js$/ },
                            async (args) => ({
                                loader: 'jsx',
                                contents: await fs.readFile(args.path, 'utf8'),
                            })
                        );
                    },
                },
            ],
        },
    },

    plugins: [
        svgr(), 
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
              name: 'Hệ thống quản lý lịch thi',
              short_name: 'Lịch thi',
              theme_color: '#3f51b5',
              background_color: '#ffffff',
              display: 'standalone',
              icons: [
                {
                  src: '/android-chrome-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                },
                {
                  src: '/android-chrome-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                },
              ],
            },
        }),
    ],
    base: '',
    // Thêm cấu hình server ngay đây, ngang hàng với base:
    server: {
        host: '0.0.0.0', // Cho phép truy cập từ mọi IP
        port: 5173,
        proxy:{
            '/api':{
                target: 'http://172.20.10.2:8080',
                changeOrigin: true
            }
        }
    }
    // Changed from '/Modernize-Vite' for proper PWA paths
});
