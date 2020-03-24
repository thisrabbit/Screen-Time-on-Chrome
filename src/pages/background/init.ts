import { browser } from 'webextension-polyfill-ts';
import { checkSettings, settings } from '@/pages/background/utils/settings';
import { checkMap, map } from '@/pages/background/utils/map';
import { checkPolicy, policy } from '@/pages/background/utils/policy';
import { checkHistory, history } from '@/pages/background/utils/history';
import { checkRuntime, runtime } from '@/pages/background/utils/runtime';

type returned = {
  settings: settings;
  map: map;
  policy: policy;
  history: history;
  runtime: runtime;
};

/**
 * Init variables from browser's storage
 */
export default async (): Promise<returned> => {
  let settings, map, policy, history, runtime;

  try {
    const res = await browser.storage.local.get([
      'settings',
      'map',
      'policy',
      'history',
      'runtime',
    ]);

    settings = await checkSettings(res.settings);
    map = await checkMap(res.map);
    policy = await checkPolicy(res.policy);
    history = await checkHistory(res.history);
    runtime = await checkRuntime(res.runtime);
  } catch (e) {
    console.error("Can not get data from browser's storage.");
  }

  // @ts-ignore
  return { settings, map, policy, history, runtime };
};
