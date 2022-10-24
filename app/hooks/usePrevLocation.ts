import { useEffect, useRef } from 'react';
import { useParams } from '@remix-run/react';
import type { Location, Params } from 'react-router';

interface PreviousLocation {
  location: Location;
  params: Params;
}

export const usePrevLocation = (location: Location) => {
  const params = useParams();
  const prevLocRef = useRef<PreviousLocation | null>(null);

  useEffect(() => {
    prevLocRef.current = { location: location, params: params };
  }, [location, params]);

  return prevLocRef.current;
};
