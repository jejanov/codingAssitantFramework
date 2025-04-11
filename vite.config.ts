/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import path module

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000, // Frontend dev server port
        proxy: {
            // Proxy API requests to the backend server
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    test: { // Add Vitest configuration
        globals: true,
        environment: 'jsdom', // Use jsdom for simulating browser environment
        setupFiles: './tests/setup.ts', // Path to the setup file
        css: false, // Optional: disable CSS processing if not needed for tests
    }
}) 