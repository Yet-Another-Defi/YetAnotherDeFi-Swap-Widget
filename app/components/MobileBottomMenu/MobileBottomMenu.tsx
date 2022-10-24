import { useRef } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { observer } from 'mobx-react';

import { BlurBackground } from '~/components/BlurBackground';
import { useIsMounted, useClickOutside } from '~/hooks';
import { MenuState } from './constants';
import { Base } from './Base';
import { Network } from './Network';
import { Connect } from './Connect';
import { Wallet } from './Wallet';
import { useRootStore } from '~/store/rootStore';
import { useMobileMenuState } from './useMobileMenuState';

const MobileBg = styled.div`
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.1);
`;

export const MobileBottomMenu = observer(() => {
  const isMounted = useIsMounted();
  const ref = useRef(null);
  const { menuState, closeSelect } = useMobileMenuState();

  const {
    appStore: { chainId },
  } = useRootStore();

  useClickOutside(ref, () => {
    closeSelect();
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className={'md:hidden'}>
      {menuState !== MenuState.base && <BlurBackground />}
      <MobileBg
        className={clsx(
          'fixed left-0 bottom-0 z-[4] w-full bg-white py-5 px-2.5 sm:px-11',
          'dark:bg-dark dark:shadow-darkShadow',
          menuState !== MenuState.base && 'z-[5]'
        )}
        ref={ref}
      >
        {menuState === MenuState.base && <Base />}
        <Network menuState={menuState} closeSelect={closeSelect} />
        <Connect menuState={menuState} closeSelect={closeSelect} />
        <Wallet menuState={menuState} closeSelect={closeSelect} chainId={chainId} />
      </MobileBg>
    </div>
  );
});
