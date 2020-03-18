import React, { useEffect, useState } from 'react';
import {
  Typography,
  Progress,
  Tooltip,
  Button,
  Card,
  Statistic,
  Dropdown,
  Menu,
} from 'antd';
import { SettingOutlined, PieChartOutlined } from '@ant-design/icons';
import styles from './index.less';
import { browser } from 'webextension-polyfill-ts';
import {
  getDomainState,
  getUrlInfoInActiveTab,
  urlInfo,
  domainState,
} from '@/utils/common';
import { tooltipWidth } from '@/utils/vars';

const minutes2display: (minutes: number) => JSX.Element = minutes => {
  return (
    <span>
      {minutes > 59 ? (
        <>
          <span>{Math.floor(minutes / 60)}</span>
          <span className={styles['time-unit']}>
            {' '}
            {browser.i18n.getMessage('hour')}{' '}
          </span>
          <span>{minutes % 60}</span>
          <span className={styles['time-unit']}>
            {' '}
            {browser.i18n.getMessage('minute')}{' '}
          </span>
        </>
      ) : (
        <>
          <span>{minutes > 0 ? minutes : 0}</span>
          <span className={styles['time-unit']}>
            {' '}
            {browser.i18n.getMessage('minute')}{' '}
          </span>
        </>
      )}
    </span>
  );
};

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
              status="active"
              percent={
                domainState.tracked
                  ? domainState.limited
                    ? ((domainState.maxLimitTime -
                        domainState.currentlyUsedTime) /
                        domainState.maxLimitTime) *
                      100
                    : (domainState.currentlyUsedTime / 60) * 100
                  : 0
              }
              format={() =>
                domainState.tracked ? (
                  domainState.limited ? (
                    <>
                      <span className={styles['time-category']}>
                        {browser.i18n.getMessage('timeLeftShort')}
                      </span>
                      {minutes2display(
                        domainState.maxLimitTime -
                          domainState.currentlyUsedTime,
                      )}
                    </>
                  ) : (
                    <span>{browser.i18n.getMessage('domainNotLimited')}</span>
                  )
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
          <div className={styles['options']}>
            {domainState.tracked ? (
              domainState.limited ? (
                <Dropdown
                  placement="bottomCenter"
                  overlay={
                    <Menu style={{ textAlign: 'center' }}>
                      <Menu.Item key="1">
                        <Button danger>
                          {browser.i18n.getMessage('removeDomainFromLimitList')}
                        </Button>
                      </Menu.Item>
                      <Menu.Item key="2">
                        {browser.i18n.getMessage('removeDomainFromTrackList')}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button>{browser.i18n.getMessage('addMoreTime')}</Button>
                </Dropdown>
              ) : (
                <Button>
                  {browser.i18n.getMessage('addDomainToLimitList')}
                </Button>
              )
            ) : (
              <Button disabled={!urlInfo.concernedProtocol}>
                {browser.i18n.getMessage('addDomainToTrackList')}
              </Button>
            )}
          </div>
          <Card className={styles['card']}>
            <Card.Grid className={styles['grid']}>
              <Statistic
                title={browser.i18n.getMessage('timeUsed')}
                value={
                  domainState.tracked
                    ? domainState.currentlyUsedTime > 59
                      ? (domainState.currentlyUsedTime / 60).toFixed(1)
                      : domainState.currentlyUsedTime
                    : '--'
                }
                suffix={
                  domainState.tracked
                    ? domainState.currentlyUsedTime > 59
                      ? browser.i18n.getMessage('hour')
                      : browser.i18n.getMessage('minute')
                    : undefined
                }
              />
            </Card.Grid>
            <Card.Grid className={styles['grid']}>
              <Statistic
                title={browser.i18n.getMessage('tabOpenedTimes')}
                value={domainState.tracked ? domainState.openedTimes : '--'}
                suffix={
                  domainState.tracked
                    ? browser.i18n.getMessage('times')
                    : undefined
                }
              />
            </Card.Grid>
            <Card.Grid className={styles['grid']} style={{ padding: 0 }}>
              <Button type="link" icon={<PieChartOutlined />} block>
                {browser.i18n.getMessage('overview')}
              </Button>
            </Card.Grid>
            <Card.Grid className={styles['grid']} style={{ padding: 0 }}>
              <Button type="link" icon={<SettingOutlined />} block>
                {browser.i18n.getMessage('settings')}
              </Button>
            </Card.Grid>
          </Card>
        </>
      ) : (
        <Typography.Text>Loading...</Typography.Text>
      )}
    </div>
  );
};
