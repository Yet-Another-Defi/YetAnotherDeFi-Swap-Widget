import { redirect, json } from '@remix-run/node';

import { DEFAULT_TOKEN_PAIRS } from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';
import type { LoaderFunctionArgs } from '~/types/loader';

export const loader = async ({ params, context: { logger }, request }: LoaderFunctionArgs) => {
  let { from, chainId } = params;

  if (!chainId || !isSupportedNetwork(chainId)) {
    return json('Does not have required param CHAIN_ID', { status: 400 });
  }

  let to = DEFAULT_TOKEN_PAIRS[chainId][1].toLowerCase();

  logger.info('', {
    response_code: 302,
    request: request.url,
    original_url: request.url,
  });
  return redirect(`/${chainId}/exchange/${from}/${to}`);
};

export default function Index() {
  return null;
}
