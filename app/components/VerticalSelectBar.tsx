import React, { useEffect, useState } from 'react';
import type { FocusEvent } from 'react';
import clsx from 'clsx';
import { NumericFormat } from 'react-number-format';
import { motion } from 'framer-motion';

interface Props<T> {
  onBlur?: () => void;
  onChange: (item: T) => void;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  checkIsActive: (item: T) => boolean;
  formatCustomValue: (value: number) => T;
  list: T[];
  suffix: string;
  customValue?: number;
  customDescription?: string;
  max?: number;
  decimals?: number;
  isCustomAvailable?: boolean;
}

const typedMemo: <T>(component: T) => T = React.memo;

export const VerticalSelectBar = typedMemo(function <T>({
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
  customDescription,
  isCustomAvailable = true,
}: Props<T>) {
  const [activeElemIndex, setActiveElemIndex] = useState(() => {
    const activeIndex = list.findIndex((item) => checkIsActive(item));
    return activeIndex >= 0 ? activeIndex : list.length;
  });

  useEffect(() => {
    const activeIndex = list.findIndex((item) => checkIsActive(item));

    setActiveElemIndex(activeIndex >= 0 ? activeIndex : list.length);
  }, [checkIsActive, list]);

  const isCustomActive = isCustomAvailable && activeElemIndex === list.length;

  const isOnlyOneElementList = !isCustomAvailable && list.length === 1;

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-xl border border-gray',
        'dark:border-graySecondary'
      )}
    >
      {list.map((item, i) => {
        const isActive = activeElemIndex === i;
        return (
          <button
            key={i}
            className={clsx(
              `flex justify-between z-[2] w-full h-10 rounded-2lg py-3 px-5 font-medium`,
              isActive ? ' text-white' : 'cursor-pointer'
            )}
            onClick={() => {
              if (!isActive) {
                onChange(item);
                setActiveElemIndex(i);
              }
            }}
          >
            {renderItem(item, isActive)}
          </button>
        );
      })}
      {isCustomAvailable ? (
        <div
          className={clsx(
            'flex justify-between',
            `z-[2] w-full h-10 rounded-2lg bg-transparent text-xs py-3 px-5`,
            'font-medium cursor-pointer',
            isCustomActive && 'text-white'
          )}
          onClick={() => {
            if (!isCustomActive) {
              onChange(formatCustomValue(customValue ?? 0));
              setActiveElemIndex(list.length);
            }
          }}
        >
          <div className="text-sm">Custom</div>
          <div>
            {customDescription && (
              <span
                className={clsx('text-xs text-gray mr-2', isCustomActive && 'dark:text-[#953200]')}
              >
                {customDescription}
              </span>
            )}
            <NumericFormat
              className={clsx(
                'max-w-[75px] text-sm bg-transparent outline-none overflow-visible text-right text-gray placeholder:text-gray',
                'dark:placeholder:text-graySecondary',
                isCustomActive && '!text-white placeholder:!text-white'
              )}
              onFocus={(e: FocusEvent<HTMLInputElement>) => {
                onChange(formatCustomValue(parseFloat(e.target.value) || 0));
              }}
              onValueChange={(values) => {
                onChange(formatCustomValue(values.floatValue || 0));
              }}
              onBlur={onBlur}
              placeholder={`0 ${suffix}`}
              value={customValue ? customValue : ''}
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
          </div>
        </div>
      ) : null}
      <motion.div
        className={clsx(
          'rounded-2lg py-5 text-center absolute top-[-1px] z-[1] h-10 w-[calc(100%+2px)] left-[-1px] bg-black !m-0',
          'dark:bg-orange',
          isCustomActive && '!top-0',
          isOnlyOneElementList && 'h-[calc(100%+2px)]'
        )}
        animate={{
          y: isCustomActive ? `${100 * activeElemIndex + 4}%` : `${100 * activeElemIndex}%`,
        }}
        initial={false}
      />
    </div>
  );
});
