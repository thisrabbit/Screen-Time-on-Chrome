import { browser } from 'webextension-polyfill-ts';

export type map = {
  [origin: string]: string;
};

const defaultMap: map = {};

export const checkMap: (map: any) => Promise<map> = async map => {
  if (!map || typeof map !== 'object') {
    try {
      await browser.storage.local.set({ map: defaultMap });
    } catch (e) {
      console.error(e);
    }
    return defaultMap;
  } else {
    return map;
  }
};
