import { mergeProtocols, balanceTo100Percents } from '../routes.helpers';
import {
  MOCKED_ROUTES,
  MOCKED_ROUTES_MORE_100,
  MOCKED_ROUTES_MORE_100_2,
  MOCKED_ROUTES_LESS_100,
  MOCKED_ROUTES_LESS_100_2,
} from '../test-mocks';

describe('Merge protocols', () => {
  test('Should merge 2 Uniswap_V2 protocols. Base protocols 4', () => {
    expect(mergeProtocols(MOCKED_ROUTES)).toHaveLength(3);
  });
});

describe('Balance percentage less or more 100%', () => {
  test('Should balance percentage > 100%. Plus float delta to last value', () => {
    const balancedPercentages = balanceTo100Percents(MOCKED_ROUTES_MORE_100).map(
      (route) => route.percent
    );
    expect(balancedPercentages).toEqual([18, 18, 43, 14, 7]);
  });
  test('Should balance percentage > 100% with too large values(500+) Plus float delta to last value', () => {
    const balancedPercentages = balanceTo100Percents(MOCKED_ROUTES_MORE_100_2).map(
      (route) => route.percent
    );
    expect(balancedPercentages).toEqual([32, 34, 29, 3, 2]);
  });
  test('Should balance percentage < 100%. Plus float delta to last value', () => {
    const balancedPercentages = balanceTo100Percents(MOCKED_ROUTES_LESS_100).map(
      (route) => route.percent
    );
    expect(balancedPercentages).toEqual([3, 12, 79, 6]);
  });
  test('Should balance percentage < 100% with too small values (0.3, .0.1) Plus float delta to last value', () => {
    const balancedPercentages = balanceTo100Percents(MOCKED_ROUTES_LESS_100_2).map(
      (route) => route.percent
    );
    expect(balancedPercentages).toEqual([6, 18, 3, 73]);
  });
});
