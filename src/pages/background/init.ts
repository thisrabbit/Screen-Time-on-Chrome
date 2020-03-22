import { browser } from 'webextension-polyfill-ts';
import { checkSettings } from '@/pages/background/settings';

/**
 * Init variables from browser storage
 */

(async () => {
  try {
    let {
      settings,
      map,
      policy,
      history,
      runtime,
    } = await browser.storage.local.get([
      'settings',
      'map',
      'policy',
      'history',
      'runtime',
    ]);

    settings = checkSettings(settings);
    map = map || {};
  } catch (e) {
    // Find a good solution for error display
  }
})();
