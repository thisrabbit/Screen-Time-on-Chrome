import { browser } from 'webextension-polyfill-ts';
import { resultsCode } from '@/utils/resultsCode';

export type settings = {
  readonly version: number;
  extraTime: number;
};

let vSettings: settings;

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

export enum extendResultOfSettingsCheck {
  'UPDATED' = 3,
}

export const checkSettings: (
  settings: any,
) => Promise<resultsCode | extendResultOfSettingsCheck> = async settings => {
  if (!settings || typeof settings !== 'object' || !integrityCheck(settings)) {
    try {
      await browser.storage.local.set({ settings: defaultSettings });
      vSettings = settings;
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  } else if (settings.version < getCurrentVersionMainNumber()) {
    // Migrant old version's settings to new version
    vSettings = settings;
    return extendResultOfSettingsCheck.UPDATED;
  } else {
    vSettings = settings;
    return resultsCode.SUCCESS;
  }
};
