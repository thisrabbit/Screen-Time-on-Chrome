import { browser } from 'webextension-polyfill-ts';
import moment from 'moment';

export type runtimeUnit = {
  usedSecond: number;
  inExtraTime: boolean;
};

export type runtime = {
  date: string;
  // The type of string is just aimed to compatible with `date`.
  [url: string]: runtimeUnit | string;
};

const defaultRuntime: runtime = {
  date: moment().format('YYYYMMDD'),
};

export const checkRuntime: (
  runtime: any,
) => Promise<runtime> = async runtime => {
  if (!runtime || typeof runtime !== 'object' || !runtime.date) {
    try {
      await browser.storage.local.set({ runtime: defaultRuntime });
    } catch (e) {
      console.error(e);
    }
    return defaultRuntime;
  } else if (moment(defaultRuntime.date).diff(runtime.date, 'days') > 0) {
    // Needs save runtime data to history, and start a new day~
    return runtime;
  } else {
    return runtime;
  }
};
