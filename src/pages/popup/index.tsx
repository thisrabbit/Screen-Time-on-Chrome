import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import { isDev } from '@/utils/env';

export default () => {
  if (isDev) {
    const b = require('../background/index');
    console.log(b.getDomainState(b.getUrlInfoInActiveTab()));
  } else {
    let activeDomain: string = '';
    chrome.runtime.sendMessage(
      {
        id: 'getUrlInfoInActiveTab',
      },
      res => console.log(res),
    );
    chrome.runtime.sendMessage(
      {
        id: 'getDomainState',
        domain: activeDomain,
      },
      res => console.log(res),
    );
  }

  return (
    <div className={styles['main']}>
      <Button>Test</Button>
    </div>
  );
};
