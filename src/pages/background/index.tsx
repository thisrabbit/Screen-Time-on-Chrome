import { browser } from 'webextension-polyfill-ts';

const host2domain: (host: string) => string = host => {
  const parts = host.split('.');
  return parts.length > 1
    ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
    : parts[0];
};

export interface urlInfo {
  concernedProtocol: boolean;
  protocol: string;
  host?: string;
  domain?: string;
  favIconUrl?: string;
}

export const getUrlInfoInActiveTab: () => Promise<urlInfo> = async () => {
  let tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const url: string = tabs[0].url as string;
  const protocolReg = /^([A-Za-z]+)(?=:\/{2})/.exec(url);
  const protocol = protocolReg ? protocolReg[0] : '';

  switch (protocol) {
    case 'http':
    case 'https':
    case 'chrome':
      const hostReg = /(?<=:\/{2})[^\r\n\t\f\v\/]+(?=\/?)/.exec(url);
      const host = hostReg ? hostReg[0] : '';
      const isIP = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?$/.test(
        host,
      );
      const favIconUrl = tabs[0].favIconUrl;

      return {
        concernedProtocol: true,
        protocol: protocol,
        host: host,
        domain: isIP ? host : host2domain(host),
        favIconUrl: favIconUrl && favIconUrl !== '' ? favIconUrl : undefined,
      };
    case 'file':
    default:
      return {
        concernedProtocol: false,
        protocol: protocol,
      };
  }
};

export interface domainState {
  tracked: boolean;
  maxLimit?: number;
  currentlyUsed?: number;
  openedTimes?: number;
}

export const getDomainState: (urlInfo: urlInfo) => domainState = urlInfo => {
  return {
    tracked: false,
  };
};
