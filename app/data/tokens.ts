import type { Logger } from 'winston';

import type { SupportedNetworks } from '~/constants';
import type { Token } from '~/objects/tokens';

interface FilterOptions {
  chainId: SupportedNetworks;
  addresses?: string[];
  names?: string[];
  symbols?: string[];
}

const URL = `${process.env.BACKEND_API_URL}/v2/tokens/list`;

export const getTokens = async (
  logger: Logger,
  request: Request,
  options: FilterOptions
): Promise<Record<string, Token>> => {
  const { chainId, addresses, names, symbols } = options;

  let tokens: Token[];

  const filter = {
    chain_ids: [+chainId],
    is_active: true,
    addresses,
    names,
    symbols,
  };

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.DEX_ROUTER_API_KEY ?? '',
      },
      body: JSON.stringify({
        filter,
        paging: {
          page: 1,
        },
      }),
    });

    if (response.status === 200) {
      logger.info('', {
        response_code: response.status,
        request: URL,
        original_url: request.url,
      });
    } else {
      const text = await response.text();

      logger.error(text, {
        response_code: response.status,
        request: URL,
        original_url: request.url,
      });
    }

    tokens = (await response.json()).tokens;
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      request: URL,
      original_url: request.url,
    });
    tokens = [];
  }
  return tokens.reduce(
    (acc, token) => ({
      ...acc,
      [token.address.toLowerCase()]: { ...token, address: token.address.toLowerCase() },
    }),
    {}
  );
};
