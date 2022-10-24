import { type LoaderFunction, redirect } from '@remix-run/node';
import { isSupportedNetwork } from '~/helpers/helpers';

// This component exists for redirect from old option of swap route (for example /ETH/DAI -> exchange/eth/dai)

export const loader: LoaderFunction = async ({ params }) => {
  const { from, to, chainId } = params;

  if (chainId && isSupportedNetwork(chainId)) {
    return redirect(`/${chainId}/exchange/${from?.toLowerCase()}/${to?.toLowerCase()}`);
  }

  return redirect('/1/exchange/eth/dai');
};

export default function Index() {
  return null;
}
