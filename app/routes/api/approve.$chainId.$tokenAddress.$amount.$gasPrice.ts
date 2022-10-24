import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '~/types/loader';

interface ApproveResponse {
  calldata: string;
  estimate_gas: string;
  gas_price: string;
  to: string;
}

export const loader = async ({
  params: { chainId, tokenAddress, amount, gasPrice },
  request,
  context: { logger },
}: LoaderFunctionArgs): Promise<ApproveResponse | Response> => {
  if (!chainId || !tokenAddress || !amount || !gasPrice) {
    return json('Does not have required params CHAIN_ID, TOKEN_ADDRESS, AMOUNT or GAS_PRICE', {
      status: 400,
    });
  }

  const backendURL = `${process.env.BACKEND_API_URL}/v1/${chainId}/transaction/approve?tokenAddress=${tokenAddress}&amount=${amount}&gasPrice=${gasPrice}`;

  let data;

  try {
    const response = await fetch(backendURL, {
      headers: {
        'X-API-Key': process.env.DEX_ROUTER_API_KEY ?? '',
      },
    });

    data = await response.json();

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
      request: backendURL,
      original_url: request.url,
    });
  }

  return data;
};
