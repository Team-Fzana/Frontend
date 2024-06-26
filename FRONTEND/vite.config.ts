import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // API 서버 주소
        changeOrigin: true,
      },
    },
  },
});