const getBrowser = () => {
  if (process.env.NODE_ENV === 'development') {
    const i18n = require('../../public/_locales/zh_CN/messages.json');

    return {
      i18n: {
        getMessage: (id: string) => {
          return i18n[id] ? i18n[id].message : '--';
        },
      },
    };
  } else {
    return require('webextension-polyfill-ts');
  }
};

export const browser = getBrowser();
