import { browser } from 'webextension-polyfill-ts';
import { checkSettings } from '@/pages/background/kernel/settings';
import { checkMap } from '@/pages/background/kernel/map';
import { checkPolicy } from '@/pages/background/kernel/policy';
import { checkHistory } from '@/pages/background/kernel/history';
import { checkRuntime } from '@/pages/background/kernel/runtime';

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
