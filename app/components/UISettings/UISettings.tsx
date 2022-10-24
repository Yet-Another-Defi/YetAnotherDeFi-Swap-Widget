import { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import styled from 'styled-components';
import { useParams } from '@remix-run/react';

import { ThreeDotsIcon } from '../Icon/ThreeDots';
import { useClickOutside } from '~/hooks';
import { Tumbler } from '~/components/Tumbler';
import { THEMES } from '~/constants';
import { useUiSettings, isTheme } from '~/UiProvider';

const StyledContainer = styled.div`
  background: ${(props) => props.theme.colors?.white};
  @media (min-width: 768px) {
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
`;

export function UISettings() {
  const params = useParams();
  const ref = useRef(null);

  const {
    state: { theme },
    changeTheme,
  } = useUiSettings();

  const [isOpen, setIsOpen] = useState(false);

  const isMainPage = params.from && params.to;

  const toggleOpennessUISettings = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeUISettingsMenu = () => {
    setIsOpen(false);
  };

  const onChangeTheme = useCallback(
    (newTheme: string) => {
      if (isTheme(newTheme)) {
        changeTheme(newTheme);
      }
    },
    [changeTheme]
  );

  useClickOutside(ref, closeUISettingsMenu);

  const isThemeChecked = theme === THEMES[1].value;

  return (
    <div
      className={clsx('md:h-full flex items-center relative md:ml-2.5', !isMainPage && 'hidden')}
      ref={ref}
    >
      <div
        className={clsx(
          'hidden md:flex justify-center items-center',
          'cursor-pointer ease-linear',
          'w-10 h-10',
          'rounded-lg border-gray border-[1px] text-black',
          'dark:text-white',
          'hover:bg-black hover:border-black hover:text-white',
          'dark:hover:bg-white dark:hover:border-white dark:hover:text-black',
          isOpen &&
            'bg-black !border-black text-white dark:bg-white dark:!border-white dark:text-black'
        )}
        onClick={toggleOpennessUISettings}
      >
        <ThreeDotsIcon />
      </div>
      <StyledContainer
        className={clsx(
          'block md:hidden md:absolute right-0 bottom-[-110px] px-5 pt-3.5 pb-20 md:py-5 w-[300px] bg-white',
          'dark:bg-black dark:md:shadow-lightDarkShadow dark:border-lightBlack',
          isOpen && '!block'
        )}
      >
        <div className="flex justify-between items-center mb-2.5">
          <h6 className="font-medium text-sm opacity-40">Theme</h6>
          <Tumbler modes={THEMES} onChange={onChangeTheme} checked={isThemeChecked} />
        </div>
      </StyledContainer>
    </div>
  );
}
