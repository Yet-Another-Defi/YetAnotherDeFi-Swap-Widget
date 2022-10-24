import { type LoaderFunction, redirect } from '@remix-run/node';
import { DEFAULT_TOKEN_PAIRS } from '~/constants';
import { isSupportedNetwork } from '~/helpers/helpers';

// This component exists for redirect from incorrect url to correct

export const loader: LoaderFunction = ({ params }) => {
  const { chainId } = params;

  if (chainId && isSupportedNetwork(chainId)) {
    return redirect(
      `/${chainId}/exchange/${DEFAULT_TOKEN_PAIRS[chainId][0].toLowerCase()}/${DEFAULT_TOKEN_PAIRS[
        chainId
      ][1].toLowerCase()}`
    );
  }

  return redirect('/1/exchange/eth/dai');
};

export default function Index() {
  return null;
}
