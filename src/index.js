import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import PortStream from 'extension-port-stream'
import { detect } from 'detect-browser'
import { getNormalizeAddress } from './utils';
import Web3 from 'web3';
import { Buffer } from 'buffer';

const browser = detect()
window.Buffer = Buffer;

if (typeof process === 'undefined') {
    const process = require('process');
    window.process = process;
}

const config = {
    "CHROME_ID": "nkbihfbeogaeaoehlefnkodbefgpgknn",
    "FIREFOX_ID": "webextension@metamask.io"
}

// complete the functionalities
// pass provider for listeners on connect network and ... in extension
// handle chainId 
// 

const createMetamaskProvider = () => {
    try {
        if (window.ethereum) {
            console.log('found window.ethereum>>');
            return window.ethereum;
        } else {
            console.log("not found window.ethereum>>")
            let currentMetaMaskId = getMetaMaskId()
            const metamaskPort = chrome.runtime.connect(currentMetaMaskId)
            const pluginStream = new PortStream(metamaskPort)
            return new MetaMaskInpageProvider(pluginStream)
        }
    } catch (error) {
        console.dir(`Metamask connect error `, error)
        throw error
    }
}

const createCoinbaseProvider = (appName, appLogoUrl, appChainIds) => {
    const walletLink = new CoinbaseWalletSDK({
        appName,
        appLogoUrl,
        appChainIds
    });

    return walletLink.makeWeb3Provider({ options: 'all' });
}

export const createWalletManager = (appName, appLogoUrl, appChainIds) => {

    const coinbaseProvider = createCoinbaseProvider(appName, appLogoUrl, appChainIds)

    const metamaskProvider = createMetamaskProvider()

    // coinbase functionalities

    const getCoinbaseProvider = async () => {

    }

    const coinbaseConnect = async () => {
        try {
            const accounts = await coinbaseProvider.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length <= 0) {
                throw new Error("wallet address not selected");
            }
            const account = getNormalizeAddress(accounts);
            return { account };
        } catch (error) {
            console.log("error while connecting to coinbase : ", error);
            return error
        }
    };

    const coinbaseDisconnect = async () => {
        try {
            walletLink.disconnect()
        } catch (error) {
            console.log("error while disconnecting wallet : ", error);
            return error
        }
    }

    const coinbaseChainId = async () => {
        try {
            const chainId = await coinbaseProvider.request({ method: 'eth_chainId' })
            if (!chainId) {
                throw new Error("chainId not detected");
            }
            return { chainId };
        } catch (error) {
            console.log("error getting chainId : ", error);
            return error
        }
    }

    const coinbasePersonalSign = async (message, account) => {
        try {
            const checkSumAddress = Web3.utils.toChecksumAddress(account)
            const messageHash = Web3.utils.utf8ToHex(message)

            const signature = await coinbaseProvider.request({
                method: 'personal_sign',
                params: [messageHash, checkSumAddress]
            })
            return signature
        } catch (error) {
            console.log("error coinbase personal signing : ", error);
            return error
        }
    }

    const coinbasePayment = async (from, to, value) => {
        try {
            const hash = await coinbaseProvider.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from,
                        to,
                        value,
                        gasLimit: '0x5028',
                        maxPriorityFeePerGas: '0x3b9aca00',
                        maxFeePerGas: '0x2540be400',
                    }
                ]
            })
            return hash
        } catch (error) {
            return error
        }

    }

    const coinbaseContractCall = async () => {
        try {

        } catch (error) {
            console.log("error coinbase contract call : ", error);
            return error
        }
    }


    // Metamask functionalities

    const getMetamaskProvider = async () => {

    }

    const metamaskConnect = async () => {
        try {
            const accounts = metamaskProvider.request({ method: 'eth_requestAccounts' })
            if (!accounts || accounts.length <= 0) {
                throw new Error("wallet address not selected");
            }
            const account = getNormalizeAddress(accounts);
            return { account }
        } catch (error) {
            console.log("error while connecting to metamask", error);
            return error
        }
    }

    const metamaskChainId = async () => {
        try {
            const chainId = await metamaskProvider.request({ method: 'eth_chainId' })
            if (!chainId) {
                throw new Error("chainId not detected");
            }
            return { chainId };
        } catch (error) {
            console.log("error getting chainId : ", error);
            return error
        }
    }

    const metamaskPersonalSign = async (message, account) => {
        try {
            const checkSumAddress = Web3.utils.toChecksumAddress(account)
            const messageHash = Web3.utils.utf8ToHex(message)

            const signature = await metamaskProvider.request({
                method: 'personal_sign',
                params: [messageHash, checkSumAddress]
            });
            return signature;
        } catch (error) {
            console.error("Failed to sign message with MetaMask:", error);
            return error
        }
    };

    const metamaskDisconnect = () => {
        try {
            console.log("disconnectWallet runs")
        } catch (error) {
            console.log(error);
            return error
        }
    }

    const metamaskPayment = async (from, to, value) => {
        try {
            const hash = await metamaskProvider.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from,
                        to,
                        value,
                        gasLimit: '0x5028',
                        maxPriorityFeePerGas: '0x3b9aca00',
                        maxFeePerGas: '0x2540be400',
                    }
                ]
            })
            return hash
        } catch (error) {
            console.log("error while connect", error);
            return error
        }
    }

    const metamaskContractCall = () => {
        try {

        } catch (error) {
            console.log("error metamask contract call : ", error);
            return error
        }
    }

    const metamaskSubscribeToEvents = async () => {
        if (metamaskProvider) {
            // metamaskProvider.on(EthereumEvents.CHAIN_CHANGED, handleChainChanged);
            // metamaskProvider.on(EthereumEvents.ACCOUNTS_CHANGED, handleAccountsChanged);
            // metamaskProvider.on(EthereumEvents.CONNECT, handleConnect);
            // metamaskProvider.on(EthereumEvents.DISCONNECT, handleDisconnect);
        }
    }

    const metamaskUnsubscribeToEvents = async () => {
        if (metamaskProvider) {
            // metamaskProvider.removeListener(EthereumEvents.CHAIN_CHANGED, handleChainChanged);
            // metamaskProvider.removeListener(EthereumEvents.ACCOUNTS_CHANGED, handleAccountsChanged);
            // metamaskProvider.removeListener(EthereumEvents.CONNECT, handleConnect);
            // metamaskProvider.removeListener(EthereumEvents.DISCONNECT, handleDisconnect);
        }
    }

    const metamaskHandleChainChanged = (chainId) => {
        metamaskChainId = chainId;
    }

    const metamaskHandleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
            console.log("[account changes]: ", getNormalizeAddress(accounts))
        }
    }

    const getMetaMaskId = () => {
        switch (browser && browser.name) {
            case 'chrome':
                return config.CHROME_ID
            case 'firefox':
                return config.FIREFOX_ID
            default:
                return config.CHROME_ID
        }
    }

    return {
        getCoinbaseProvider,
        coinbaseConnect,
        coinbaseDisconnect,
        coinbaseChainId,
        coinbasePersonalSign,
        coinbasePayment,
        coinbaseContractCall,

        getMetamaskProvider,
        metamaskConnect,
        metamaskDisconnect,
        metamaskChainId,
        metamaskPersonalSign,
        metamaskPayment,
        metamaskContractCall
    };
}