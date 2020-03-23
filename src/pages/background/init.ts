import { browser } from 'webextension-polyfill-ts';
import { checkSettings } from '@/pages/background/utils/settings';
import { checkMap } from '@/pages/background/utils/map';
import { checkPolicy } from '@/pages/background/utils/policy';
import { checkHistory } from '@/pages/background/utils/history';
import { checkRuntime } from '@/pages/background/utils/runtime';

/**
 * Init variables from browser's storage
 */
export default async () => {
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

    settings = await checkSettings(settings);
    map = await checkMap(map);
    policy = await checkPolicy(policy);
    history = await checkHistory(history);
    runtime = await checkRuntime(runtime);

    return {
      settings,
      map,
      policy,
      history,
      runtime,
    };
  } catch (e) {
    console.error("Can not get data from browser's storage.");
  }
};
