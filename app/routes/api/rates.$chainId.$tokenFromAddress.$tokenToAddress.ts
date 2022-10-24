import { json } from '@remix-run/node';
import {
  CHAIN_ID_TO_COINGECKO_CHAIN_ID,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
} from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';
import type { LoaderFunctionArgs } from '~/types/loader';

export type RatesResponse = {
  nativeTokenPriceUSD: number;
  tokenFromPriceUSD: number;
  tokenToPriceUSD: number;
};

export const loader = async ({
  params,
  request,
  context: { logger },
}: LoaderFunctionArgs): Promise<RatesResponse | Response> => {
  const { tokenFromAddress, tokenToAddress, chainId } = params;

  if (!chainId || !isSupportedNetwork(chainId)) {
    return json('Does not have required param CHAIN_ID or it is not support', { status: 400 });
  }

  const priceNativeTokenPromise = fetch(
    `https://pro-api.coingecko.com/api/v3/simple/price?ids=${NATIVE_TOKEN_COINGECKO_ID[chainId]}&vs_currencies=usd&x_cg_pro_api_key=${process.env.COINGECKO_KEY}`
  );
  const tokenPricePromise = (tokenAddress?: string) =>
    fetch(
      `https://pro-api.coingecko.com/api/v3/simple/token_price/${CHAIN_ID_TO_COINGECKO_CHAIN_ID[chainId]}?contract_addresses=${tokenAddress}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&x_cg_pro_api_key=${process.env.COINGECKO_KEY}`
    );

  const urls = [
    `https://pro-api.coingecko.com/api/v3/simple/price?ids=${NATIVE_TOKEN_COINGECKO_ID[chainId]}&vs_currencies=usd`,
    `https://pro-api.coingecko.com/api/v3/simple/token_price/${CHAIN_ID_TO_COINGECKO_CHAIN_ID[chainId]}?contract_addresses=${tokenFromAddress}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`,
    `https://pro-api.coingecko.com/api/v3/simple/token_price/${CHAIN_ID_TO_COINGECKO_CHAIN_ID[chainId]}?contract_addresses=${tokenToAddress}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`,
  ];

  let ratesResult = [];

  try {
    const ratesResponse = await Promise.allSettled([
      priceNativeTokenPromise,
      tokenPricePromise(tokenFromAddress),
      tokenPricePromise(tokenToAddress),
    ]);
    ratesResult = await Promise.all(
      ratesResponse.map((rateResponse, index) => {
        if (rateResponse.status === 'fulfilled' && rateResponse.value.status === 200) {
          logger.info('', {
            response_code: rateResponse.value.status,
            request: urls[index],
            original_url: request.url,
          });

          return rateResponse.value.json();
        }
        logger.error('', {
          response_code: rateResponse.status,
          request: urls[index],
          original_url: request.url,
        });
        return undefined;
      })
    );
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      original_url: request.url,
    });
    return json(
      {
        nativeTokenPriceUSD: 0,
        tokenFromPriceUSD: 0,
        tokenToPriceUSD: 0,
      },
      { status: 500 }
    );
  }

  const [nativeTokenPriceUSD, tokenFromPriceUSD, tokenToPriceUSD] = ratesResult;

  let tokenFromPrice = 0;
  let tokenToPrice = 0;

  if (tokenFromAddress === NATIVE_TOKEN_ADDRESS) {
    tokenFromPrice = nativeTokenPriceUSD?.[NATIVE_TOKEN_COINGECKO_ID[chainId]]?.usd ?? 0;
  } else if (
    params.tokenFromAddress &&
    tokenFromPriceUSD?.[params.tokenFromAddress.toLowerCase()]?.usd
  ) {
    tokenFromPrice = tokenFromPriceUSD?.[params.tokenFromAddress.toLowerCase()]?.usd;
  }

  if (tokenToAddress === NATIVE_TOKEN_ADDRESS) {
    tokenToPrice = nativeTokenPriceUSD?.[NATIVE_TOKEN_COINGECKO_ID[chainId]]?.usd ?? 0;
  } else if (params.tokenToAddress && tokenToPriceUSD?.[params.tokenToAddress.toLowerCase()]?.usd) {
    tokenToPrice = tokenToPriceUSD?.[params.tokenToAddress.toLowerCase()]?.usd;
  }

  return {
    nativeTokenPriceUSD: nativeTokenPriceUSD?.[NATIVE_TOKEN_COINGECKO_ID[chainId]]?.usd ?? 0,
    tokenFromPriceUSD: tokenFromPrice ?? 0,
    tokenToPriceUSD: tokenToPrice ?? 0,
  };
};
