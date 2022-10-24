import { json } from '@remix-run/node';
import { isSupportedNetwork } from '~/helpers/helpers';
import type { LoaderFunctionArgs } from '~/types/loader';

export const action = async ({
  params: { chainId },
  request,
  context: { logger },
}: LoaderFunctionArgs): Promise<Response> => {
  if (!chainId || (chainId && !isSupportedNetwork(chainId))) {
    return json('Does not have required param CHAIN_ID or it does not supported', {
      status: 400,
    });
  }

  let url = '';

  switch (chainId) {
    case '1':
      url = `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`;
      break;
    case '56':
      url = 'https://holy-icy-surf.bsc.quiknode.pro/9c10e94a76ce8bc3c02331172d061a79255cdc96/';
      break;
    case '137':
      url = 'https://long-summer-bush.matic.quiknode.pro/c7cdf28943ae234462c92fcf9cc58a6a8263e25b/';
      break;
    case '43114':
      url =
        'https://fragrant-wild-river.avalanche-mainnet.quiknode.pro/49b7d1682650a8af20bff176ca55f5e0fc4ecf99/ext/bc/C/rpc';
      break;
    case '250':
      url =
        'https://rough-dark-paper.fantom.quiknode.pro/6e65057f30750457b58340dbeb9367eed5c88c8f/';
      break;
    case '10':
      url =
        'https://sparkling-twilight-water.optimism.quiknode.pro/1d75cf7cb5b0c1e5c61cffaf34ae612f4ccc5c6c/';
      break;
    // for testing local contracts
    case '1337':
      url = 'http://127.0.0.1:8545';
      break;
  }

  const body = await request.json();
  let response;

  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: request.method,
      body: JSON.stringify(body),
    });
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      request: url,
      original_url: request.url,
    });
    return new Response('Failed to fetch from rpc', {
      status: 500,
    });
  }

  return json(await response.json());
};
