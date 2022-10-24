import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { configure } from 'mobx';
import { render, screen, getByRole } from '~/utils/test-utils';
import type { RootStore } from '~/store/rootStore';
import { useRootStore } from '~/store/rootStore';
import { SwapSettings } from '../SwapSettings';
import { GasPriceType } from '~/constants';

describe('Swap Settings Component integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  //mobx by default prevent functions modify
  configure({ safeDescriptors: false });
  const user = userEvent.setup();

  const closeFn = jest.fn();
  let rs: RootStore;

  const SwapSettingsComponent = () => {
    rs = useRootStore();
    return <SwapSettings onClose={closeFn} />;
  };

  test('It should render Swap Settings component and close it by click on icon', async () => {
    render(<SwapSettingsComponent />);

    await user.click(screen.getByTestId('btn-close-settings'));

    expect(closeFn).toHaveBeenCalled();
    expect(screen.getByRole('heading')).toHaveTextContent('Settings');
  });
  test('It should render Swap component and choose slippage tolerance 3%', async () => {
    render(<SwapSettingsComponent />);

    jest.spyOn(rs.settingsStore, 'setValidSlippage');

    await user.click(screen.getByRole('button', { name: '3%' }));

    expect(rs.settingsStore.setValidSlippage).toHaveBeenCalledTimes(1);
    expect(rs.settingsStore.slippage).toEqual({ type: '3', value: 3 });
  });
  test('It should render Swap component and choose slippage "custom" and type in it', async () => {
    render(<SwapSettingsComponent />);

    jest.spyOn(rs.settingsStore, 'setSlippage');

    const slippageNode = document.getElementById('slippage');

    if (slippageNode) {
      await user.type(getByRole(slippageNode, 'textbox'), '20');
    }

    // "2" and "0"
    expect(rs.settingsStore.setSlippage).toHaveBeenCalledTimes(2);
    expect(rs.settingsStore.setSlippage).toHaveBeenCalledWith({
      type: 'custom',
      value: 20,
    });
  });
  test('It should render Swap component and choose gas price "custom" and type in it', async () => {
    render(<SwapSettingsComponent />);

    jest.spyOn(rs.settingsStore, 'setGasPrice');

    const slippageNode = document.getElementById('gasPrice');

    if (slippageNode) {
      await user.type(getByRole(slippageNode, 'textbox'), '100');
    }

    //"1" and "0" and "0"
    expect(rs.settingsStore.setGasPrice).toHaveBeenCalledTimes(3);
    expect(rs.settingsStore.setGasPrice).toHaveBeenCalledWith({
      type: GasPriceType.CUSTOM,
      value: 100,
    });
  });
  // test('It should reset slippage to default 1%', async () => {
  //   render(<SwapSettingsComponent />);

  //   jest.spyOn(rs.settingsStore, 'resetSlippage');

  //   const slippageNode = document.getElementById('slippage');

  //   if (slippageNode) {
  //     await user.type(getByRole(slippageNode, 'textbox'), ' ');
  //   }

  //   await user.click(screen.getByTestId('btn-close-settings'));

  //   expect(rs.settingsStore.resetSlippage).toHaveBeenCalledTimes(1);
  //   expect(rs.settingsStore.slippage).toEqual({ type: '1', value: 1 });
  // });
  // test('It should reset gas price to default MEDIUM', async () => {
  //   render(<SwapSettingsComponent />);

  //   jest.spyOn(rs.settingsStore, 'resetGasPrice');

  //   const slippageNode = document.getElementById('gasPrice');

  //   if (slippageNode) {
  //     await user.type(getByRole(slippageNode, 'textbox'), ' ');
  //   }

  //   await user.click(screen.getByTestId('btn-close-settings'));

  //   expect(rs.settingsStore.resetGasPrice).toHaveBeenCalledTimes(1);
  //   expect(rs.settingsStore.gasPrice.type).toEqual(DEFAULT_GAS_PRICE.type);
  // });
});
