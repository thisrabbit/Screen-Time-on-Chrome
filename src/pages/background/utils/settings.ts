import { browser } from 'webextension-polyfill-ts';

export type settings = {
  readonly version: number;
  extraTime: number;
};

export const defaultSettings: settings = {
  version: 1,
  extraTime: 1,
};

const getCurrentVersionMainNumber: () => number = () => {
  const { version } = browser.runtime.getManifest();
  return parseInt(version.split('.')[0]) || 1;
};

const integrityCheck: (obj: object) => boolean = obj => {
  return (
    Object.keys(defaultSettings).toString() === Object.keys(obj).toString()
  );
};

export const checkSettings: (
  settings: any,
) => Promise<settings> = async settings => {
  if (!settings || typeof settings !== 'object' || !integrityCheck(settings)) {
    try {
      await browser.storage.local.set({ settings: defaultSettings });
    } catch (e) {
      console.error(e);
    }
    return defaultSettings;
  } else if (settings.version < getCurrentVersionMainNumber()) {
    // Migrant old version's settings to new version
    return settings;
  } else {
    return settings;
  }
};
