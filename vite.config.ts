import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    optimizeDeps: {
        include: ['@mui/material', 'react-router-dom', '@emotion/react', 'aws-amplify/storage'],
    },
});
