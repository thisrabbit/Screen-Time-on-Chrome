import { browser } from 'webextension-polyfill-ts';
import { resultsCode } from '@/utils/resultsCode';

export type policyUnit = {
  tracked: boolean;
  limited: boolean;
  maxLimitTime?: number | Array<number>;
};

export type policy = {
  [url: string]: policyUnit;
};

let vPolicy: policy;

const defaultPolicy: policy = {
  all: {
    tracked: false,
    limited: false,
  },
};

export const checkPolicy: (policy: any) => Promise<void> = async policy => {
  if (!policy || typeof policy !== 'object') {
    try {
      await browser.storage.local.set({ policy: defaultPolicy });
      vPolicy = policy;
    } catch (e) {
      console.error(e);
    }
  } else {
    vPolicy = policy;
  }
};

export const modifyPolicy: (
  url: string,
  newPolicy: policyUnit,
) => Promise<resultsCode> = async (url, newPolicy) => {
  if (!url || !newPolicy) {
    return resultsCode.ERROR;
  } else {
    if (!vPolicy[url]) {
      // CREATE policy for that url.
      vPolicy[url] = newPolicy;
    } else if (isEqual(vPolicy[url], newPolicy)) {
      // UNCHANGED
      return resultsCode.SUCCESS;
    } else if (isEqual(vPolicy['all'], newPolicy)) {
      // DELETE the specific policy, and make it default to save storage space.
      delete vPolicy[url];
    } else {
      // MODIFY policy for that url.
      vPolicy[url] = newPolicy;
    }
    try {
      await browser.storage.local.set({ policy: vPolicy });
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  }
};

export const getPolicyItem: (url: string) => policyUnit = url => {
  return vPolicy[url] || vPolicy['all'];
};

const isEqual: (origin: policyUnit, target: policyUnit) => boolean = (
  origin,
  target,
) => {
  return (
    origin.tracked === target.tracked &&
    origin.limited === target.limited &&
    (origin.limited ? origin.maxLimitTime === target.maxLimitTime : true)
  );
};
