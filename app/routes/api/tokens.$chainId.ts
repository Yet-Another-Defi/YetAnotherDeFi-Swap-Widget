import { type LoaderFunction, json } from '@remix-run/node';

import { getTokens } from '~/data/tokens';
import { type Token } from '~/objects/tokens';
import { isSupportedNetwork } from '~/helpers/helpers';

export const loader: LoaderFunction = async ({
  params: { chainId },
  context: { logger },
  request,
}): Promise<Record<string, Token> | Response> => {
  if (!chainId || !isSupportedNetwork(chainId)) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  const tokens = getTokens(logger, request, { chainId });

  return tokens;
};
