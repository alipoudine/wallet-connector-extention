import { MetaMaskInpageProvider } from "@metamask/inpage-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import PortStream from "extension-port-stream";
import { detect } from "detect-browser";
import { getNormalizeAddress } from "./utils";
import Web3 from "web3";
import { Buffer } from "buffer";

const browser = detect();
window.Buffer = Buffer;

if (typeof process === "undefined") {
  const process = require("process");
  window.process = process;
}

const config = {
  CHROME_ID: "nkbihfbeogaeaoehlefnkodbefgpgknn",
  FIREFOX_ID: "webextension@metamask.io",
};

const createMetamaskProvider = () => {
  try {
    if (window.ethereum) {
      return window.ethereum;
    } else {
      let currentMetaMaskId = getMetaMaskId();
      const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
      const pluginStream = new PortStream(metamaskPort);
      return new MetaMaskInpageProvider(pluginStream);
    }
  } catch (error) {
    console.dir(`Metamask connect error `, error);
    throw error;
  }
};

const getMetaMaskId = () => {
  switch (browser && browser.name) {
    case "chrome":
      return config.CHROME_ID;
    case "firefox":
      return config.FIREFOX_ID;
    default:
      return config.CHROME_ID;
  }
};

export const createWalletManager = (appName, appLogoUrl, appChainIds) => {
  const walletLink = new CoinbaseWalletSDK({
    appName,
    appLogoUrl,
    appChainIds,
  });

  const coinbaseProvider = walletLink.makeWeb3Provider({ options: "all" });
  const metamaskProvider = createMetamaskProvider();

  const getCoinbaseProvider = () => {
    return coinbaseProvider;
  };

  const coinbaseConnect = async () => {
    try {
      const accounts = await coinbaseProvider.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length <= 0) {
        throw new Error("wallet address not selected");
      }
      const account = getNormalizeAddress(accounts);
      return { account };
    } catch (error) {
      return error;
    }
  };

  const coinbaseDisconnect = async () => {
    try {
      walletLink.disconnect();
    } catch (error) {
      return error;
    }
  };

  const coinbaseChainId = async () => {
    try {
      const chainId = await coinbaseProvider.request({ method: "eth_chainId" });
      if (!chainId) {
        throw new Error("chainId not detected");
      }
      return { chainId };
    } catch (error) {
      return error;
    }
  };

  const coinbasePersonalSign = async (message, account) => {
    try {
      const checkSumAddress = Web3.utils.toChecksumAddress(account);
      const messageHash = Web3.utils.utf8ToHex(message);
      const signature = await coinbaseProvider.request({
        method: "personal_sign",
        params: [messageHash, checkSumAddress],
      });
      return signature;
    } catch (error) {
      return error;
    }
  };

  const coinbasePayment = async (from, to, value) => {
    try {
      const hash = await coinbaseProvider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value,
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      });
      return hash;
    } catch (error) {
      return error;
    }
  };

  const coinbaseContractCall = async () => {
    try {
      const hash = await coinbaseProvider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value,
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      });
      return hash;
    } catch (error) {
      return error;
    }
  };

  // , chainName, rpcUrls, blockExplorerUrls
  const coinbaseSwitchNetwork = async (chainId) => {
    try {
      await coinbaseProvider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: Web3.utils.toHex(chainId),
          },
        ],
      });
    } catch (error) {
      // Handle specific errors if needed
      if (switchError.code === 4902) {
        // Chain not added to the wallet
      }
      return error;
    }
  };

  const getMetamaskProvider = () => {
    return metamaskProvider;
  };

  const metamaskConnect = async () => {
    try {
      // Check if MetaMask is already connected by checking existing accounts
      const existingAccounts = await metamaskProvider.request({ method: 'eth_accounts' });
  
      let accounts;
      if (existingAccounts && existingAccounts.length > 0) {
        // MetaMask is already connected
        // accounts = existingAccounts;
        accounts = await metamaskProvider.request({ method: 'eth_requestAccounts' });
      } else {
        // MetaMask is not connected, request accounts
        accounts = await metamaskProvider.request({ method: 'eth_requestAccounts' });
      }
  
      if (!accounts || accounts.length <= 0) {
        throw new Error('wallet address not selected');
      }
  
      const account = getNormalizeAddress(accounts[0]);
      return { account };
    } catch (error) {
      console.error('MetaMask connection error:', error);
      return error;
    }
  };
  

  const metamaskChainId = async () => {
    try {
      const chainId = await metamaskProvider.request({ method: "eth_chainId" });
      if (!chainId) {
        throw new Error("chainId not detected");
      }
      return { chainId };
    } catch (error) {
      return error;
    }
  };

  const metamaskPersonalSign = async (message, account) => {
    try {
      const checkSumAddress = Web3.utils.toChecksumAddress(account);
      const messageHash = Web3.utils.utf8ToHex(message);

      const signature = await metamaskProvider.request({
        method: "personal_sign",
        params: [messageHash, checkSumAddress],
      });
      return signature;
    } catch (error) {
      return error;
    }
  };

  const metamaskDisconnect = async () => {
    try {
      await metamaskProvider.disconnect()
    } catch (error) {
      return error;
    }
  };

  const metamaskPayment = async (from, to, value) => {
    try {
      const hash = await metamaskProvider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value,
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      });
      return hash;
    } catch (error) {
      return error;
    }
  };

  const metamaskContractCall = async () => {
    try {
      const hash = await metamaskProvider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value,
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      });
      return hash;
    } catch (error) {
      return error;
    }
  };

  // , chainName, rpcUrls, blockExplorerUrls
  const metamaskSwitchNetwork = async (chainId) => {
    try {
      await metamaskProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(chainId) }],
      });
    } catch (error) {
      // Handle specific errors if needed
      if (error.code === 4902) {
        // Chain not added to the wallet
      }
    }
  };

  return {
    coinbaseProvider,
    getCoinbaseProvider,
    coinbaseConnect,
    coinbaseDisconnect,
    coinbaseChainId,
    coinbasePersonalSign,
    coinbasePayment,
    coinbaseContractCall,
    coinbaseSwitchNetwork,

    metamaskProvider,
    getMetamaskProvider,
    metamaskConnect,
    metamaskDisconnect,
    metamaskChainId,
    metamaskPersonalSign,
    metamaskPayment,
    metamaskContractCall,
    metamaskSwitchNetwork,
  };
};
