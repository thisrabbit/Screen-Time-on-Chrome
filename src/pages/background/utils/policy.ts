import { browser } from 'webextension-polyfill-ts';

export type policyUnit = {
  tracked: boolean;
  limited: boolean;
  maxLimitTime?: number | Array<number>;
};

export type policy = {
  [url: string]: policyUnit;
};

const defaultPolicy: policy = {
  all: {
    tracked: false,
    limited: false,
  },
};

export const checkPolicy: (policy: any) => Promise<policy> = async policy => {
  if (!policy || typeof policy !== 'object') {
    try {
      await browser.storage.local.set({ policy: defaultPolicy });
    } catch (e) {
      console.error(e);
    }
    return defaultPolicy;
  } else {
    return policy;
  }
};
