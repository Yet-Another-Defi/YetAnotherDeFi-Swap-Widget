import { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';
import clsx from 'clsx';

import { TokenItem } from './TokenItem';
import { Button } from '~/components/Button';
import type { Token } from '~/objects/tokens';
import type { TokenWithBalance } from '~/helpers/exchange.helpers';

const PADDING_SIZE = 10;
const ITEM_SIZE = 30;
const LIST_ELEMENTS_QUANTITY = 5;

interface Props {
  tokens: TokenWithBalance[] | Token[];
  getLinkUrl: (token: Token) => string;
  setTokenToStore: (token: Token) => void;
  openSelectCustomToken: () => void;
  closeSelect: () => void;
  isConnected: boolean;
}

const StyledList = styled(List)`
  ::-webkit-scrollbar {
    width: 2px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(160, 160, 160, 0.2);
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.gray};
    border-radius: 2px;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

export function TokenList({
  tokens,
  getLinkUrl,
  setTokenToStore,
  openSelectCustomToken,
  closeSelect,
  isConnected,
}: Props): JSX.Element {
  const renderToken = useCallback(
    ({ index, style }) => {
      const token = tokens[index];

      return (
        <TokenItem
          token={token}
          style={style}
          getLinkUrl={getLinkUrl}
          setTokenToStore={setTokenToStore}
          close={closeSelect}
          isConnected={isConnected}
        />
      );
    },
    [tokens, getLinkUrl, setTokenToStore, closeSelect, isConnected]
  );

  if (!tokens.length) {
    return (
      <div>
        <div
          className={clsx(
            'mt-20 text-center text-2xl text-black/60',
            'dark:text-white/60 mb-[108px]'
          )}
        >
          Nothing found
        </div>
        <Button className="w-full md:block" variant="outline" onClick={openSelectCustomToken}>
          Add token +
        </Button>
      </div>
    );
  }

  return (
    // @ts-ignore: don't pass width
    <StyledList
      height={(ITEM_SIZE + PADDING_SIZE * 2) * LIST_ELEMENTS_QUANTITY}
      itemCount={tokens.length}
      overscanCount={20}
      itemSize={ITEM_SIZE + PADDING_SIZE * 2}
    >
      {renderToken}
    </StyledList>
  );
}
