import React, { useEffect, useState } from 'react';
import type { FocusEvent } from 'react';
import clsx from 'clsx';
import { NumericFormat } from 'react-number-format';
import { motion } from 'framer-motion';

interface Props<T> {
  onBlur?: () => void;
  onChange: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  checkIsActive: (item: T) => boolean;
  formatCustomValue: (value: number) => T;
  list: T[];
  suffix: string;
  customValue?: number;
  max?: number;
  decimals?: number;
}

const typedMemo: <T>(component: T) => T = React.memo;

// base cell width 3 (count) * 20% = 60%
const BASE_CELL_WIDTH = 20;
// custom cell width 3 (count) * 20% + 25% (custom cell) = 85%
const CUSTOM_CELL_WIDTH = 25;
// gap width is 25% of THE CELL WIDTH (not all width of select bar). The rest of the width - 15%. one gap is 15 / 3 = 5%. 5 / 0.2 (20% is cell width) = 25%
const GAP_WIDTH = 25;

export const SelectBar = typedMemo(function <T>({
  list,
  renderItem,
  onChange,
  onBlur,
  checkIsActive,
  max,
  suffix,
  formatCustomValue,
  decimals = 0,
  customValue,
}: Props<T>) {
  const [activeElemIndex, setActiveElemIndex] = useState(() => {
    const activeIndex = list.findIndex((item) => checkIsActive(item));
    return activeIndex >= 0 ? activeIndex : list.length;
  });

  useEffect(() => {
    const activeIndex = list.findIndex((item) => checkIsActive(item));

    setActiveElemIndex(activeIndex >= 0 ? activeIndex : list.length);
  }, [checkIsActive, list]);

  const isCustomActive = activeElemIndex === list.length;

  return (
    <div
      // There is 3 gaps between cells. The rest of the width for gaps is 15%. 15 / 3 = 5% --> space-x-[5%]
      className={clsx(
        'relative flex space-x-[5%] rounded-xl border border-gray',
        'dark:bg-dark dark:border-graySecondary'
      )}
    >
      {list.map((item, i) => {
        const isActive = activeElemIndex === i;
        return (
          <button
            key={i}
            className={clsx(
              `z-[2] w-[20%] rounded-2lg py-3 text-center`,
              isActive ? ' text-white' : 'cursor-pointer'
            )}
            onClick={() => {
              if (!isActive) {
                onChange(item);
                setActiveElemIndex(i);
              }
            }}
          >
            {renderItem(item)}
          </button>
        );
      })}
      <NumericFormat
        className={clsx(
          `z-[2] w-[25%] rounded-2lg bg-transparent text-center text-sm outline-none placeholder:text-gray dark:placeholder:text-graySecondary`,
          isCustomActive
            ? 'text-white placeholder:text-white dark:placeholder:text-white'
            : 'bg-transparent'
        )}
        onFocus={(e: FocusEvent<HTMLInputElement>) => {
          onChange(formatCustomValue(parseFloat(e.target.value) || 0));
        }}
        onValueChange={(values) => {
          onChange(formatCustomValue(values.floatValue || 0));
        }}
        onClick={() => {
          setActiveElemIndex(list.length);
        }}
        onBlur={onBlur}
        value={customValue ? customValue : ''}
        placeholder="Custom"
        suffix={suffix}
        isAllowed={
          max
            ? (value) => {
                return !value.floatValue || value.floatValue < max;
              }
            : undefined
        }
        allowNegative={false}
        decimalScale={decimals}
        allowedDecimalSeparators={['.', ',']}
        spellCheck={false}
      />
      <motion.div
        className={clsx(
          `rounded-2lg py-5 text-center absolute top-[-1px] z-[1] h-[calc(100%+2px)] left-[-1px] bg-black !m-0`,
          'dark:bg-orange'
        )}
        animate={{
          x: isCustomActive
            ? `${(BASE_CELL_WIDTH / CUSTOM_CELL_WIDTH) * (100 + GAP_WIDTH) * activeElemIndex + 2}%` // +2% for positioning when the custom element is selected
            : `${(100 + GAP_WIDTH) * activeElemIndex}%`,
          width: isCustomActive ? `${CUSTOM_CELL_WIDTH}%` : `${BASE_CELL_WIDTH}%`,
        }}
        initial={false}
      />
    </div>
  );
});
