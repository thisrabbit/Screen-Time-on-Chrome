import { browser } from 'webextension-polyfill-ts';
import { checkSettings } from '@/pages/background/kernal/settings';
import { checkMap } from '@/pages/background/kernal/map';
import { checkPolicy } from '@/pages/background/kernal/policy';
import { checkHistory } from '@/pages/background/kernal/history';
import { checkRuntime } from '@/pages/background/kernal/runtime';

/**
 * Init variables from browser's storage
 */
export default async (): Promise<void> => {
  try {
    const res = await browser.storage.local.get();

    await checkSettings(res.settings);
    await checkMap(res.map);
    await checkPolicy(res.policy);
    await checkHistory(res.history);
    await checkRuntime(res.runtime);
  } catch (e) {
    console.error("Can not get data from browser's storage.");
  }
};
