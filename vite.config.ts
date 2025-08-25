import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/TimeSync/' : '/',
  server: {
    host: true,
    https: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // 標準的な本番ビルド設定
    sourcemap: false, // 本番環境ではソースマップ無効
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // console.log削除（本番環境では推奨）
        drop_debugger: true, // debugger文削除
      },
      format: {
        comments: false, // コメント削除
      },
    },
    // チャンクサイズ最適化
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // キャッシュ効率化のためのハッシュ化
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // コード分割の最適化
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react'],
        },
      },
    },
  },
});
