import { type LoaderFunction, redirect } from '@remix-run/node';

// This component exists for redirect any route to exchange/eth/dai

export const loader: LoaderFunction = async () => {
  return redirect('/1/exchange/eth/dai');
};

export default function Index() {
  return null;
}
