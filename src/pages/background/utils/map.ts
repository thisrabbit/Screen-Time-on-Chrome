import { browser } from 'webextension-polyfill-ts';
import { resultsCode } from '@/utils/resultsCode';
import { modifyHistory } from '@/pages/background/utils/history';

export type map = {
  [origin: string]: string;
};

let vMap: map;

const defaultMap: map = {};

const reservedKeyword = ['all', 'date'];

export const checkMap: (map: any) => Promise<resultsCode> = async map => {
  if (!map || typeof map !== 'object') {
    try {
      await browser.storage.local.set({ map: defaultMap });
      vMap = defaultMap;
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  } else {
    vMap = map;
    return resultsCode.SUCCESS;
  }
};

export enum extendResultsOfMapModify {
  'MATCH_RESERVED_KEYWORD' = 3,
  'WOULD_BE_RECLUSIVE',
}

export const modifyMap: (
  origin: string,
  target: string,
) => Promise<resultsCode | extendResultsOfMapModify> = async (
  origin,
  target,
) => {
  if (!origin || !target) {
    return resultsCode.ERROR;
  } else if (reservedKeyword.includes(target)) {
    return extendResultsOfMapModify.MATCH_RESERVED_KEYWORD;
  } else if (vMap[target]) {
    return extendResultsOfMapModify.WOULD_BE_RECLUSIVE;
  } else {
    if (!vMap[origin]) {
      // CREATE the map of origin.
      vMap[origin] = target;
    } else if (vMap[origin] === target) {
      // UNCHANGED
      return resultsCode.SUCCESS;
    } else if (origin === target) {
      // DELETE the map of origin, (also change history back to origin) NO NEED.
    } else {
      // MODIFY the map of origin, also change history to new target.
      vMap[origin] = target;
    }
    try {
      await browser.storage.local.set({ map: vMap });
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  }
};

export const getMapItem: (origin: string) => string = origin => {
  return vMap[origin] || origin;
};
