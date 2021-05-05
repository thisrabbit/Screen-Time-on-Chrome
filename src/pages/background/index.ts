import { browser } from 'webextension-polyfill-ts';
import init from '@/pages/background/kernal/init';

(async () => {
  await init();

  browser.runtime.onMessage.addListener(async msg => {
    switch (msg.key) {
      case 'popup/info/urlState':
        return {
          tracked: true,
          limited: true,
          currentlyUsedTime: 1000,
          maxLimitTime: 45,
          openedTimes: 12,
        };
      case 'popup/track/add':
      case 'popup/track/remove':
      case 'popup/limit/add':
      case 'popup/limit/modify':
      case 'popup/limit/remove':
      case 'popup/extraTime/apply':
    }
  });
})();
