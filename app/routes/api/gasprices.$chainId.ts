import { json } from '@remix-run/node';

import { SupportedNetworks, GasPriceType } from '~/constants';
import type { LoaderFunctionArgs } from '~/types/loader';

export type GasPricesResponse = {
  gasPrices: { [K in GasPriceType]?: number };
};

export const loader = async ({
  params: { chainId },
  request,
  context: { logger },
}: LoaderFunctionArgs): Promise<GasPricesResponse | Response> => {
  if (!chainId) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  const backendURL = `${process.env.BACKEND_API_URL}/v1/${chainId}/gasprices`;

  let gasPrices;

  try {
    const response = await fetch(backendURL, {
      headers: {
        'X-API-Key': process.env.DEX_ROUTER_API_KEY ?? '',
      },
    });

    gasPrices = await response.json();

    if (response.status === 200) {
      logger.info('', {
        response_code: response.status,
        request: backendURL,
        original_url: request.url,
      });
    } else {
      logger.error(await response.text(), {
        response_code: response.status,
        request: backendURL,
        original_url: request.url,
      });
    }
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      original_url: request.url,
    });
    return json(
      {
        gasPrices: {
          [GasPriceType.LOW]: 0,
          [GasPriceType.MEDIUM]: 0,
          [GasPriceType.FAST]: 0,
        },
      },
      { status: 500 }
    );
  }
  const isOptimismChain = chainId === SupportedNetworks.Optimism;

  return {
    gasPrices: {
      [GasPriceType.LOW]: +Number(gasPrices?.low).toFixed(isOptimismChain ? 3 : 0) ?? 0,
      [GasPriceType.MEDIUM]: +Number(gasPrices?.medium).toFixed(isOptimismChain ? 3 : 0) ?? 0,
      [GasPriceType.FAST]: +Number(gasPrices?.high).toFixed(isOptimismChain ? 3 : 0) ?? 0,
    },
  };
};
