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
import {
  SettingOutlined,
  PieChartOutlined,
  EditOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { browser } from 'webextension-polyfill-ts';
import {
  getUrlState,
  getUrlInfoInActiveTab,
  urlInfo,
  urlState,
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
  const [urlState, setUrlState] = useState();

  const [titleEditable, setTitleEditable] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);

  // @ts-ignore
  useEffect(async () => {
    setUrlInfo(await getUrlInfoInActiveTab());
  }, []);
  // @ts-ignore
  useEffect(async () => {
    setUrlState(await getUrlState(urlState));
  }, []);

  return (
    <div className={styles['popup']}>
      {urlInfo ? (
        <>
          <Card
            className={styles['title']}
            onMouseEnter={() => setTitleEditable(true)}
            //onMouseLeave={() => setTitleEditable(false)}
          >
            <Card.Grid
              className={styles['grid']}
              style={titleEditable ? { width: '80%' } : undefined}
            >
              <Typography.Text>{urlInfo.displayName}</Typography.Text>
              {/*<Tooltip*/}
              {/*  title={browser.i18n.getMessage('mapUrlToANewOneTooltip')}*/}
              {/*  placement="bottom"*/}
              {/*>*/}
              {/*</Tooltip>*/}
            </Card.Grid>
            {titleEditable ? (
              <Card.Grid className={styles['grid']} style={{ width: '20%' }}>
                <Button type="link" icon={<EditOutlined />} block />
              </Card.Grid>
            ) : (
              undefined
            )}
          </Card>
          <div className={styles['time-ring']}>
            <Progress
              type="dashboard"
              width={tooltipWidth - 32 * 2}
              status="active"
              percent={
                urlState.tracked
                  ? urlState.limited
                    ? ((urlState.maxLimitTime - urlState.currentlyUsedTime) /
                        urlState.maxLimitTime) *
                      100
                    : (urlState.currentlyUsedTime / 60) * 100
                  : 0
              }
              format={() =>
                urlState.tracked ? (
                  urlState.limited ? (
                    <>
                      <span className={styles['time-category']}>
                        {browser.i18n.getMessage('timeLeftShort')}
                      </span>
                      {minutes2display(
                        urlState.maxLimitTime - urlState.currentlyUsedTime,
                      )}
                    </>
                  ) : (
                    <span>{browser.i18n.getMessage('urlNotLimited')}</span>
                  )
                ) : (
                  <Tooltip
                    title={browser.i18n.getMessage('urlNotTrackedTooltip')}
                  >
                    <span>{browser.i18n.getMessage('urlNotTracked')}</span>
                  </Tooltip>
                )
              }
            />
          </div>
          <div className={styles['options']}>
            {urlState.tracked ? (
              urlState.limited ? (
                <Dropdown
                  placement="bottomCenter"
                  overlay={
                    <Menu style={{ textAlign: 'center' }}>
                      <Menu.Item
                        key="1"
                        className={styles['in-dropdown-button']}
                      >
                        <Button type="link" block danger>
                          {browser.i18n.getMessage('removeUrlFromLimitList')}
                        </Button>
                      </Menu.Item>
                      <Menu.Item
                        key="2"
                        className={styles['in-dropdown-button']}
                      >
                        <Button type="link" block danger>
                          {browser.i18n.getMessage('removeUrlFromTrackList')}
                        </Button>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button>{browser.i18n.getMessage('addMoreTime')}</Button>
                </Dropdown>
              ) : (
                <Dropdown
                  placement="bottomCenter"
                  overlay={
                    <Menu style={{ textAlign: 'center' }}>
                      <Menu.Item
                        key="1"
                        className={styles['in-dropdown-button']}
                      >
                        <Button type="link" block danger>
                          {browser.i18n.getMessage('removeUrlFromTrackList')}
                        </Button>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    {browser.i18n.getMessage('addUrlToLimitList')}
                  </Button>
                </Dropdown>
              )
            ) : (
              <Button disabled={!urlInfo.concernedProtocol}>
                {browser.i18n.getMessage('addUrlToTrackList')}
              </Button>
            )}
          </div>
          <Card className={styles['card']}>
            <Card.Grid className={styles['grid']}>
              <Statistic
                title={browser.i18n.getMessage('timeUsed')}
                value={
                  urlState.tracked
                    ? urlState.currentlyUsedTime > 59
                      ? (urlState.currentlyUsedTime / 60).toFixed(1)
                      : urlState.currentlyUsedTime
                    : '--'
                }
                suffix={
                  urlState.tracked
                    ? urlState.currentlyUsedTime > 59
                      ? browser.i18n.getMessage('hour')
                      : browser.i18n.getMessage('minute')
                    : undefined
                }
              />
            </Card.Grid>
            <Card.Grid className={styles['grid']}>
              <Statistic
                title={browser.i18n.getMessage('tabOpenedTimes')}
                value={urlState.tracked ? urlState.openedTimes : '--'}
                suffix={
                  urlState.tracked
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
