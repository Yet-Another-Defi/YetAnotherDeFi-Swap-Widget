import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

export const loader: LoaderFunction = async ({
  params: { chainId, address },
  request,
  context: { logger },
}): Promise<string | null | Response> => {
  if (!address) {
    return json('Does not have required param ADDRESS', { status: 400 });
  }
  let logo;

  const backendURLCoinGeckoId = `${process.env.BACKEND_API_URL}/v1/${chainId}/coin?address=${address}`;

  try {
    const coinGeckoIdResponse = await fetch(backendURLCoinGeckoId, {
      headers: {
        'X-API-Key': process.env.DEX_ROUTER_API_KEY ?? '',
      },
    });

    if (coinGeckoIdResponse.status === 204) {
      logger.info('There is no id for this token', {
        response_code: coinGeckoIdResponse.status,
        request: backendURLCoinGeckoId,
        original_url: request.url,
      });
      return null;
    }

    if (coinGeckoIdResponse.status === 200) {
      logger.info('', {
        response_code: coinGeckoIdResponse.status,
        request: backendURLCoinGeckoId,
        original_url: request.url,
      });
    } else {
      logger.error(coinGeckoIdResponse, {
        response_code: coinGeckoIdResponse.status,
        request: backendURLCoinGeckoId,
        original_url: request.url,
      });
    }

    const { coin_id } = await coinGeckoIdResponse.json();

    const backendURLTokenLogo = `https://api.coingecko.com/api/v3/coins/${coin_id}`;

    const tokenLogoResponse = await fetch(backendURLTokenLogo);
    const token = await tokenLogoResponse.json();

    logo = token.image.small;

    if (tokenLogoResponse.status === 200) {
      logger.info('', {
        response_code: tokenLogoResponse.status,
        request: backendURLTokenLogo,
        original_url: request.url,
      });
    } else {
      logger.error(tokenLogoResponse, {
        response_code: tokenLogoResponse.status,
        request: backendURLTokenLogo,
        original_url: request.url,
      });
    }
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      original_url: request.url,
    });
  }

  return logo;
};
