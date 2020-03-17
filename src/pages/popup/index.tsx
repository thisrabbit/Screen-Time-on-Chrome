import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import { browser } from 'webextension-polyfill-ts';
import { getDomainState, getUrlInfoInActiveTab } from '@/pages/background';

export default () => {
  const [urlInfo, setUrlInfo] = useState();
  const [domainState, setDomainState] = useState();

  // @ts-ignore
  useEffect(async () => {
    setUrlInfo(await getUrlInfoInActiveTab());
  }, []);
  // @ts-ignore
  useEffect(async () => {
    setDomainState(await getDomainState(domainState));
  }, []);

  return (
    <div className={styles['popup']}>
      {urlInfo ? <p>{urlInfo.domain}</p> : <p>Loading...</p>}
    </div>
  );
};
