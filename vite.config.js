import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        analytics: './pages/analytics.html',
        dashboard: './pages/dashboard_sec.html',
        login: './pages/login.html',
        report: './pages/report.html',
        settings: './pages/settings.html',
        transection: './pages/transection.html',
        users: './pages/users.html',
      },
    },
  },
});