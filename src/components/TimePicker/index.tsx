import { Input } from 'antd';
import React, { useState } from 'react';
import { browser } from '@/utils/env';
import styles from './index.less';

export interface TimePickerProps {
  value?: number | undefined;
  onChange?: (value: number | undefined) => void;
}

const TimePicker: React.FC<TimePickerProps> = props => {
  const [timeInMinutes, setTimeInMinutes] = useState(props.value);

  return (
    <Input.Group compact>
      <Input
        type="number"
        min={0}
        max={24}
        style={{ width: '30px', padding: '4px', borderRight: 0 }}
        value={timeInMinutes ? Math.floor(timeInMinutes / 60) : undefined}
        onChange={({ target: { value } }) => {
          if (/^[0-9]*$/.test(value)) {
            const possibleValue =
              ((timeInMinutes || 0) % 60) + Number(value) * 60;
            const newValue =
              possibleValue > 24 * 60
                ? 24 * 60
                : possibleValue < 0
                ? 0
                : possibleValue;
            setTimeInMinutes(newValue);
            props.onChange ? props.onChange(newValue) : undefined;
          }
        }}
      />
      <Input
        className={styles['bg-in-dark']}
        placeholder={browser.i18n.getMessage('hourShort')}
        disabled
        style={{
          width: '40px',
          padding: '4px 0',
          borderLeft: 0,
          borderRight: 0,
          pointerEvents: 'none',
        }}
      />
      <Input
        type="number"
        min={0}
        max={59}
        style={{ width: '30px', padding: '4px', borderLeft: 0, borderRight: 0 }}
        // There is a weird bug: It will display '01' which shouldn't
        value={timeInMinutes ? timeInMinutes % 60 : undefined}
        onChange={({ target: { value } }) => {
          if (/^[0-9]*$/.test(value)) {
            const possibleValue =
              Math.floor((timeInMinutes || 0) / 60) * 60 + Number(value);
            const newValue =
              possibleValue > 24 * 60
                ? 24 * 60
                : possibleValue < 0
                ? 0
                : possibleValue;
            setTimeInMinutes(newValue);
            props.onChange ? props.onChange(newValue) : undefined;
          }
        }}
      />
      <Input
        className={styles['bg-in-dark']}
        placeholder={browser.i18n.getMessage('minuteShort')}
        disabled
        style={{
          width: '40px',
          padding: '4px 0',
          borderLeft: 0,
          pointerEvents: 'none',
        }}
      />
    </Input.Group>
  );
};

export default TimePicker;
