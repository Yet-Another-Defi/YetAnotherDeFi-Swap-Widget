import type { Route } from '~/routes/api/route.$chainId.$from.$to';

export function mergeProtocols(routes: Route[]) {
  return routes.reduce((acc, route, _, baseArray) => {
    const currentProtocolName = route.protocol_name;

    const isProtocolInResult =
      acc.findIndex((route) => route.protocol_name === currentProtocolName) !== -1;

    //have this protocol in result array, go to next iteration
    if (isProtocolInResult) {
      return acc;
    }

    const sameProtocolPools = baseArray.filter(
      (route) => route.protocol_name === currentProtocolName
    );

    const totalPercentsSameProtocolPools = sameProtocolPools.reduce(
      (acc, cur) => acc + parseInt(String(cur.percent)),
      0
    );

    return [...acc, { ...route, percent: totalPercentsSameProtocolPools }];
  }, [] as Route[]);
}

export function balanceTo100Percents(routes: Route[]) {
  const totalPercents = (routes: Route[]) => routes.reduce((acc, cur) => acc + cur.percent, 0);

  const baseTotalPercents = totalPercents(routes);

  const proportions = routes.map((route) => route.percent / baseTotalPercents);

  let modifiedRoutes = routes.map((route, index) => ({
    ...route,
    percent: Math.floor(100 * proportions[index]),
  }));

  //total percents can be less than 100, because we use math.floor, add delta to last element
  if (totalPercents(modifiedRoutes) !== 100) {
    modifiedRoutes[modifiedRoutes.length - 1].percent += 100 - totalPercents(modifiedRoutes);
  }

  return modifiedRoutes;
}
