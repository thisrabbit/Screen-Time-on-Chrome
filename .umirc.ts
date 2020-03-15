import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/popup', component: '@/pages/popup/index' },
    { path: '/options', component: '@/pages/options/index' },
  ],
  exportStatic: {
    htmlSuffix: true,
  }
});
