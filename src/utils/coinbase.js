import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const setupCoinbaseWallet = () => {
  const walletLink = new CoinbaseWalletSDK({
    appName: "My App",
    appLogoUrl: "https://example.com/logo.png",
    // appChainIds: [1],
  });

  const provider = walletLink.makeWeb3Provider();

  // keysUrl: "https://mainnet.infura.io/v3/a7369cfe951548d7a4fe0938ff4f24a9",

  return {
    walletLink,
    provider
  };
}

export default setupCoinbaseWallet;