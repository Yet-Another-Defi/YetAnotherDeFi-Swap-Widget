# Yet Another DeFi Widget
![image](https://user-images.githubusercontent.com/116569800/209335753-a2e3e147-6b0b-4c97-9331-5bfe6da7e6e3.png)

- Easy asess to swaps 3500+ tokens in 6 blockcahins without leaving your product.


## Use cases
- Converting to the required currency for an NFT purchase or any other in-app usage.
- Sell your token.
- Swapping assets in a DeFi application for providing liquidity, farming & staking.
- Extra Revenue by adding your own fees.

## Integration
**1. Configure your widget by URL parametres**
```
https://widget.yad.finance/{chainId}/exchange/
{symbolFrom}/{symbolTo}?
theme={theme}&
feeRecipient={feeRecipient}&
feePercentage={feePercentage}
```


| Parametrs     |Description  |Default values  |Possible values|
|---------------|---|---|---|
| chainId       |The blockchain network ID.  | 1 (Ethereum) | You can find out it [here](https://github.com/Yet-Another-Defi/api-integration#endpoint-description).
| symbolFrom    | Default sell token symbol. | Native coin of selected chainID | You can find out it [here](https://github.com/Yet-Another-Defi/api-integration#get-v1chainidtokens).
| symbolTo      | Default buy token symbol. | DAI |You can find out it [here](https://github.com/Yet-Another-Defi/api-integration#get-v1chainidtokens).
| theme         | Dark or Ligt mode. | get from browser theme |“dark”, “light” 
| feeRecipient  | Wallet address for receiving fees. The commission is paid from the purchase token. | null (no fees) | EVM address (in lower or upper cases)
| feePercentage* | Percentage of commission from the amount of purchase tokens, is taken in favor of feeRecipient.  | 0 (no fees) | (10 = 1%, maximum value is 500)

* If fees are on, buy amount is shown with fee subtraction.

**2. Insert this code, where you want to place widget.**


#### Vertical widget
```html
<div id="yad-widget">
<iframe src="https://widget.yad.finance/1/ETH/DAI" 
title="yad-widget" height="508" width="416" style="border-radius:20px">
</iframe>
</div>

```
In `src=` you can put your set up link from pt. 1.


#### Horizontal widget
```html
<div id="yad-widget">
<iframe src="https://widget.yad.finance/1/ETH/DAI" 
title="yad-widget" height="212" width="1180" style="border-radius:20px">
</iframe>
</div>

```
In `src=` you can put your set up link from pt. 1.


#### Flexible widget

Widget changes automatically depends on width size. If width is lower than 1180, widget is vertical, otherwise horizontal.
```html
<div id="yad-widget">
<iframe src="https://widget.yad.finance/1/ETH/DAI" 
title="yad-widget" height="212" width="1180" style="border-radius:20px">
</iframe>
</div>

```
For flexible widget you should do two more steps:
1. Insert script in `html head` section:

```html
<script type="text/javascript" src="https://widget.yad.finance/widget.min.js"></script>

```
2. Place this script in the bottom of `body`:
```html
<script defer> const yadWidget = new YadWidget(); yadWidget.init();</script>
```
