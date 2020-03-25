import { browser } from 'webextension-polyfill-ts';
import moment from 'moment';
import { resultsCode } from '@/utils/resultsCode';

export type runtimeUnit = {
  usedSecond: number;
  inExtraTime: boolean;
};

export type runtime = {
  date: string;
  // The type of string is just aimed to compatible with `date`.
  [url: string]: runtimeUnit | string;
};

let vRuntime: runtime;

const getDefaultRuntime: () => runtime = () => ({
  date: moment().format('YYYYMMDD'),
});

export enum extendResultsOfRuntimeCheck {
  'ARCHIVED' = 3,
}

export const checkRuntime: (
  runtime: any,
) => Promise<resultsCode | extendResultsOfRuntimeCheck> = async runtime => {
  if (!runtime || typeof runtime !== 'object' || !runtime.date) {
    try {
      const defaultRuntime = getDefaultRuntime();
      await browser.storage.local.set({ runtime: defaultRuntime });
      vRuntime = defaultRuntime;
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  } else if (moment().diff(runtime.date, 'days') > 0) {
    // Needs save runtime data to history, and start a new day~
    vRuntime = getDefaultRuntime();
  } else {
    return runtime;
  }
};

export enum extendResultsOfRuntimeModify {
  'SUCCESS_WITHOUT_SAVE_TO_STORAGE' = 3,
}

export const modifyRuntime: (
  url: string,
  payload: number | boolean,
  save?: boolean,
) => Promise<resultsCode | extendResultsOfRuntimeModify> = async (
  url,
  payload,
  save = false,
) => {
  if (!url || !payload) {
    return resultsCode.ERROR;
  } else {
    if (vRuntime[url]) {
      // MODIFY unit data of this url
      if (typeof payload === 'number') {
        (vRuntime[url] as runtimeUnit).usedSecond = payload;
      } else {
        (vRuntime[url] as runtimeUnit).inExtraTime = payload;
      }
    } else {
      // ADD unit about this url
      if (typeof payload === 'number') {
        vRuntime[url] = {
          usedSecond: payload,
          inExtraTime: false,
        };
      } else {
        vRuntime[url] = {
          usedSecond: 0,
          inExtraTime: payload,
        };
      }
    }
    if (save) {
      try {
        await browser.storage.local.set({ runtime: vRuntime });
      } catch (e) {
        console.error(e);
        return resultsCode.INTERNAL_ERROR;
      }
      return resultsCode.SUCCESS;
    } else {
      return extendResultsOfRuntimeModify.SUCCESS_WITHOUT_SAVE_TO_STORAGE;
    }
  }
};
