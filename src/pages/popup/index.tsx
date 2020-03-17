import React, { useEffect, useState } from 'react';
import { Typography, Progress, Tooltip, Button } from 'antd';
import styles from './index.less';
import { browser } from 'webextension-polyfill-ts';
import { getDomainState, getUrlInfoInActiveTab } from '@/pages/background';
import { tooltipWidth } from '@/utils/vars';

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
      {urlInfo ? (
        <>
          <div className={styles['title']}>
            <Typography.Text>{urlInfo.displayName}</Typography.Text>
          </div>
          <div className={styles['time-ring']}>
            <Progress
              type="dashboard"
              width={tooltipWidth - 32 * 2}
              percent={0}
              format={() =>
                domainState.tracked ? (
                  'j'
                ) : (
                  <Tooltip
                    title={browser.i18n.getMessage('domainNotTrackedTooltip')}
                  >
                    <span>{browser.i18n.getMessage('domainNotTracked')}</span>
                  </Tooltip>
                )
              }
            />
          </div>
          <div>
            <Button>加入统计</Button>
          </div>
        </>
      ) : (
        <Typography.Text>Loading...</Typography.Text>
      )}
    </div>
  );
};
