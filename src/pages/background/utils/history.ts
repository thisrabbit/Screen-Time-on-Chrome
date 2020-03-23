import { browser } from 'webextension-polyfill-ts';
import moment from 'moment';

export type hourlyData = {
  screenTime: { [hour: string]: number };
  openTimes: { [hour: string]: number };
};

export type historyUnit = {
  date: string;
  // The type of string is just aimed to compatible with `date`.
  [url: string]: hourlyData | string;
};

export type history = Array<historyUnit>;

const defaultHistory: history = [
  {
    date: moment().format('YYYYMMDD'),
  },
];

export const checkHistory: (
  history: any,
) => Promise<history> = async history => {
  if (!history || !Array.isArray(history)) {
    try {
      await browser.storage.local.set({ history: defaultHistory });
    } catch (e) {
      console.error(e);
    }
    return defaultHistory;
  } else {
    return history;
  }
};
