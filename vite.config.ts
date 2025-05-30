// import path from 'path';
// import react from '@vitejs/plugin-react';
// import { defineConfig } from 'vite';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  optimizeDeps: {
    include: [
      '@fullcalendar/core',
      '@fullcalendar/common',
      '@fullcalendar/react',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction',
    ],
  },
});
