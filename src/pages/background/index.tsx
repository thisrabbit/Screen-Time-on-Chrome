import { isDev } from '@/utils/env';

const host2domain: (host: string) => string = (host: string) => {
  const parts = host.split('.');
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
};

export const getUrlInfoInActiveTab = () => {
  if (isDev) {
    return {
      protocol: 'https',
      host: 'www.pabbit.club',
      domain: 'pabbit.club',
    };
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url: string = tabs[0].url as string;
      const protocol = /^([A-Za-z]+)(?=:\/{2})/.exec(url);
      // @ts-ignore
      const host = /(?<=:\/{2})[^\r\n\t\f\v\/]+(?=\/?)/.exec(url)[0];
      const isIP = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?$/.test(
        host,
      );
      return {
        protocol: protocol ? protocol[0] : 'other',
        host: protocol && /^http/.test(protocol[0]) ? host : undefined,
        domain:
          protocol && /^http/.test(protocol[0])
            ? isIP
              ? host
              : host2domain(host)
            : undefined,
      };
    });
  }
};

export const getDomainState: (domain: string) => string = (domain: string) => {
  return domain;
};

if (!isDev) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.id) {
      case 'getUrlInfoInActiveTab':
        sendResponse(getUrlInfoInActiveTab());
        break;
      case 'getDomainState':
        sendResponse(getDomainState(request.domain));
        break;
      default:
        sendResponse(new Error('Invalid function call.'));
    }
    return true;
  });
}
