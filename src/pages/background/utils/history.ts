import { browser } from 'webextension-polyfill-ts';
import moment from 'moment';
import { resultsCode } from '@/utils/resultsCode';

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

let vHistory: history;

const defaultHistory: history = (() => {
  let temp = [];
  for (let i = moment().day(); i >= 0; i--) {
    temp[i] = {
      date: moment()
        .day(i)
        .format('YYYYMMDD'),
    };
  }
  return temp;
})();

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

export const modifyHistory: (
  url: string,
  payload: string | hourlyData,
) => Promise<resultsCode> = async (url, payload) => {
  if (!url || !payload) {
    return resultsCode.ERROR;
  } else {
    if (typeof payload === 'string') {
      // Map has been modified, history should changed accordingly.
      for (let unit of vHistory) {
        if (unit[url]) {
          unit[payload] = unit[url];
          delete unit[payload];
        }
      }
    } else {
      // Should only be happened if wants to chang today's data.
      const thisUrl = vHistory[vHistory.length - 1][url] as hourlyData;
      if (thisUrl) {
        // Should only have one key.
        const key = Object.keys((payload as hourlyData).screenTime)[0];
        if (thisUrl.screenTime[key]) {
          // In this hour
          (vHistory[vHistory.length - 1][url] as hourlyData).screenTime[
            key
          ] += (payload as hourlyData).screenTime[key];
          (vHistory[vHistory.length - 1][url] as hourlyData).openTimes[
            key
          ] += (payload as hourlyData).openTimes[key];
        } else {
          // Out of this hour
          (vHistory[vHistory.length - 1][url] as hourlyData).screenTime = {
            ...thisUrl.screenTime,
            ...(payload as hourlyData).screenTime,
          };
          (vHistory[vHistory.length - 1][url] as hourlyData).openTimes = {
            ...thisUrl.openTimes,
            ...(payload as hourlyData).openTimes,
          };
        }
      } else {
        // This is the first time that this url submit data today.
        vHistory[vHistory.length - 1][url] = payload;
      }
    }
    try {
      await browser.storage.local.set({ history: vHistory });
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  }
};

export const getHistory: () => history = () => {
  return vHistory;
};

export const archiveHistory: () => Promise<resultsCode> = async () => {
  if (moment().diff(vHistory[vHistory.length - 1].date, 'days') > 5 * 7) {
    vHistory = defaultHistory;
  } else {
  }
  try {
    await browser.storage.local.set({ history: vHistory });
  } catch (e) {
    console.error(e);
    return resultsCode.INTERNAL_ERROR;
  }
  return resultsCode.SUCCESS;
};
