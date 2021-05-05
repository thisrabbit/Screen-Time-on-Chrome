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

// FIXED: If user open browser for a day long, then this default history might be out dated.
const getDefaultHistory: () => history = () => {
  let temp = [];
  for (let i = moment().day(); i >= 0; i--) {
    temp[i] = {
      date: moment()
        .day(i)
        .format('YYYYMMDD'),
    };
  }
  return temp;
};

export const checkHistory: (
  history: any,
) => Promise<resultsCode> = async history => {
  if (!history || !Array.isArray(history)) {
    try {
      const defaultHistory = getDefaultHistory();
      await browser.storage.local.set({ history: defaultHistory });
      vHistory = defaultHistory;
    } catch (e) {
      console.error(e);
      return resultsCode.INTERNAL_ERROR;
    }
    return resultsCode.SUCCESS;
  } else {
    vHistory = history;
    return resultsCode.SUCCESS;
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
  if (
    moment(getStartDayOfTheWeek(moment().format('YYYYMMDD')), 'YYYYMMDD').diff(
      getStartDayOfTheWeek(vHistory[vHistory.length - 1].date),
    ) >
    4 * 7
  ) {
    // Saved data was out of date, refresh with new one.
    vHistory = getDefaultHistory();
  } else {
    // Complete unfilled data, and then cut off the out-dated.
    for (
      let i = moment().diff(vHistory[vHistory.length - 1].date);
      i > 0;
      i--
    ) {
      vHistory[vHistory.length + i] = {
        date: moment()
          .subtract(i, 'day')
          .format('YYYYMMDD'),
      };
    }
    if (vHistory.length > 5 * 7) {
      vHistory = vHistory.slice(-5 * 7);
    }
  }
  try {
    await browser.storage.local.set({ history: vHistory });
  } catch (e) {
    console.error(e);
    return resultsCode.INTERNAL_ERROR;
  }
  return resultsCode.SUCCESS;
};

const getStartDayOfTheWeek: (day: string) => string = day => {
  return moment(day, 'YYYYMMDD')
    .subtract(moment(day, 'YYYYMMDD').day())
    .format('YYYYMMDD');
};
