import { browser } from '@/utils/env';

const url2usedDefinedUrl: (host: string) => string = host => {
  return host;
};

export interface urlInfo {
  concernedProtocol: boolean;
  protocol: string;
  host?: string;
  url?: string;
  favIconUrl?: string;
  displayName: string;
}

const vendors: Array<string> = ['chrome', 'firefox', 'edge'];

export const getUrlInfoInActiveTab: () => Promise<urlInfo> = async () => {
  let tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const originUrl: string = tabs[0].url as string;
  const protocolReg = /^([A-Za-z]+)(?=:\/{2})/.exec(originUrl);
  const protocol = protocolReg ? protocolReg[0] : '';

  switch (protocol) {
    case 'http':
    case 'https':
    case 'chrome':
    // firefox & edge are not tested
    case 'firefox':
    case 'edge':
      const hostReg = /(?<=:\/{2})[^\r\n\t\f\v\/]+(?=\/?)/.exec(originUrl);
      const host = hostReg ? hostReg[0] : '';
      const url = vendors.includes(protocol) ? `${protocol}://${host}` : host;
      const favIconUrl = tabs[0].favIconUrl;

      return {
        concernedProtocol: true,
        protocol: protocol,
        host: host,
        url: url,
        favIconUrl: favIconUrl && favIconUrl !== '' ? favIconUrl : undefined,
        displayName: url2usedDefinedUrl(url),
      };
    case 'file':
      return {
        concernedProtocol: false,
        protocol: protocol,
        displayName: protocol.charAt(0).toUpperCase() + protocol.slice(1),
      };
    default:
      return {
        concernedProtocol: false,
        protocol: 'other',
        displayName: 'Other',
      };
  }
};

export interface urlState {
  tracked: boolean;
  limited: boolean;
  maxLimitTime?: number;
  currentlyUsedTime?: number;
  openedTimes?: number;
}

export const getUrlState: (urlInfo: urlInfo) => urlState = urlInfo => {
  return {
    tracked: true,
    limited: false,
    currentlyUsedTime: 40,
    maxLimitTime: 70,
    openedTimes: 999,
  };
};
