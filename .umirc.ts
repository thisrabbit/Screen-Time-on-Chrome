import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/popup', component: '@/pages/popup/index' },
    { path: '/options', component: '@/pages/options/index' },
  ],
  exportStatic: {
    htmlSuffix: true,
  },
  chainWebpack(memo) {
    memo
      .entry('background')
      .add('@/pages/background/index.ts')
      .end();

    // TODO: Remove this if want to deploy
    memo.optimization.minimize(false);
  },
});
