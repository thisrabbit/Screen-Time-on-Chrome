import { plugin, ApplyPluginsType } from 'umi';

export const changeColorMode = () => {
  if (document.body.getAttribute('data-theme') === 'default') {
    document.body.setAttribute('data-theme', 'dark');

    plugin.register({
      apply: { antd: { dark: true } },
    });
    plugin.applyPlugins({
      key: 'antd',
      type: ApplyPluginsType.modify,
      initialValue: {},
      args: {},
      async: false,
    });
  } else {
    document.body.setAttribute('data-theme', 'default');

    plugin.register({
      apply: { antd: { dark: false } },
    });
    plugin.applyPlugins({
      key: 'antd',
      type: ApplyPluginsType.modify,
      initialValue: {},
      args: {},
      async: false,
    });
  }
};
