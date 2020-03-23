import { browser } from 'webextension-polyfill-ts';
import init from '@/pages/background/init';

(async () => {
  // @ts-ignore
  let { settings, map, policy, history, runtime } = await init();

  browser.runtime.onMessage.addListener(async msg => {});
})();
