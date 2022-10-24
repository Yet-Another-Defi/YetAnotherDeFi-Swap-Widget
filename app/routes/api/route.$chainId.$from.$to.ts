import { json } from '@remix-run/node';
import { isSupportedNetwork } from '~/helpers/helpers';
import { balanceTo100Percents, mergeProtocols } from '~/helpers/routes.helpers';
import type { LoaderFunctionArgs } from '~/types/loader';

export interface RoutesResponse {
  routes?: Route[];
  callData?: string;
  rawResponse?: ApiResponse;
  gasUnitsConsumed?: number;
  amountOut?: string;
  swapContractAddress?: string;
}

export interface Pool {
  token0: string;
  token1: string;
  zero_for_one: boolean;
}
export interface Route {
  amount_in: string;
  amount_out: string;
  percent: number;
  pools: Pool[] | null;
  protocol_name: string;
}
interface ApiResponse {
  amount_out_total: string;
  calldata: string;
  estimate_gas_total: string;
  fee_recipient_amount: string;
  routes: Route[];
  token_in: string;
  token_out: string;
  to: string;
}

export const loader = async ({
  params,
  request,
  context: { logger },
}: LoaderFunctionArgs): Promise<RoutesResponse | Response> => {
  const { from, to, chainId } = params;

  if (!chainId || (chainId && !isSupportedNetwork(chainId))) {
    return json('Does not have required param CHAIN_ID or chain does not supported', {
      status: 400,
    });
  }

  const url = new URL(request.url);
  const amount = url.searchParams.get('amount');
  const slippage = url.searchParams.get('slippage') ?? 1;
  const gasPrice = url.searchParams.get('gasPrice');

  let rawResponse: ApiResponse;

  // e.g. 10 = 1%
  const slippageDecimals = +slippage * 10;

  const backendURL = `/v1/${chainId}/quote?fromTokenAddress=${from}&toTokenAddress=${to}&amount=${amount}&slippage=${slippageDecimals}&gasPrice=${gasPrice}`;

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}${backendURL}`, {
      headers: {
        'X-API-Key': process.env.DEX_ROUTER_API_KEY ?? '',
      },
    });
    rawResponse = await response.json();

    if (response.status === 200) {
      logger.info('', {
        response_code: response.status,
        request: backendURL,
        original_url: request.url,
      });
    } else {
      logger.error('Failed to fetch route', {
        response_code: response.status,
        request: backendURL,
        original_url: request.url,
      });
    }
  } catch (error) {
    logger.error(`${error}`, {
      response_code: 500,
      request: request.url,
      original_url: request.url,
    });
    return json({ routes: [] }, { status: 500 });
  }

  if (!rawResponse?.routes?.length) {
    return { routes: [] };
  }

  //merge same protocols (e.g. Uniswap_V3 and Uniswap_V3) and balanced total routes percentage to 100 (can bee more or less 100%) ans sort DESC
  const routes = balanceTo100Percents(mergeProtocols(rawResponse.routes)).sort(
    (routeA, routeB) => routeB.percent - routeA.percent
  );

  return {
    routes,
    callData: rawResponse.calldata,
    gasUnitsConsumed: +rawResponse.estimate_gas_total,
    amountOut: rawResponse.amount_out_total,
    swapContractAddress: rawResponse.to,
    rawResponse,
  };
};
