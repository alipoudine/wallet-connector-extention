import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
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


export const createWalletManager = (appName, appLogoUrl, appChainIds) => {
    const walletLink = new CoinbaseWalletSDK({
        appName,
        appLogoUrl,
        appChainIds
    });

    const coinbaseProvider = walletLink.makeWeb3Provider({ options: 'all' });

    const metamaskProvider = getMetamaskProvider()

    const coinbaseConnect = async () => {
        try {
            const accounts = await coinbaseProvider.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length <= 0) {
                throw new Error("wallet address not selected");
            }
            const account = getNormalizeAddress(accounts);
            console.log("User's address : ", account);
            return { account };
        } catch (error) {
            console.log("error while connect", error);
            return { error }
        }
    };

    const coinbaseDisconnect = async () => {
        try {
            walletLink.disconnect()
        } catch (error) {
            console.log("error while disconnecting wallet", error);
            return { error }
        }
    }

    const coinbaseChainId = async () => {
        // const web3 = new Web3(coinbaseProvider);
        // const chainId = await web3.eth.getChainId();
        // console.log("coinbase's chainId : ", chainId);

        try {
            const chainId = await coinbaseProvider.request({ method: 'eth_chainId' })
            if (!chainId) {
                throw new Error("chainId not detected");
            }
            return { chainId };
        } catch (error) {
            console.log("error while connect", e);
            return { error }
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
            console.log('Signature:', signature);
            return signature
        } catch (error) {
            console.log("error while connect", error);
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
            console.log('Hash:', hash);
            return signature
        } catch (error) {
            console.log("error while connect", error);
        }

    }

    const coinbaseContractCall = async () => {

    }

    const metamaskConnect = async () => {
        console.log("connectWallet runs....")
        try {
            const [accounts, chainId] = await getMetamaskAccounts(metamaskProvider);
            if (accounts && accounts.length > 0 && chainId) {
                const account = getNormalizeAddress(accounts);
                storage.set('connected', { connected: true, wallet: 'metamask' });
                // metamaskSubscribeToEvents(metamaskProvider)
                return { account, chainId }
            }
        } catch (e) {
            console.log("error while connect", e);
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
            console.log(`Signature: ${signature}`);
            return signature;
        } catch (error) {
            console.error("Failed to sign message with MetaMask:", error);
            throw error;
        }
    };

    const metamaskDisconnect = () => {
        try {
            console.log("disconnectWallet runs")
        } catch (e) {
            console.log(e);
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
            console.log('Hash:', hash);
            return signature
        } catch (error) {
            console.log("error while connect", error);
        }
    }

    const metamaskContractCall = () => {

    }

    const getMetamaskAccounts = async () => {
        console.log("metamask provider =====> ", metamaskProvider)
        if (metamaskProvider) {
            const [accounts, chainId] = await Promise.all([
                metamaskProvider.request({
                    method: 'eth_requestAccounts',
                }),
                metamaskProvider.request({ method: 'eth_chainId' }),
            ]);
            return [accounts, chainId];
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

    const connectEagerly = async () => {
        const metamask = await storage.get('connected');
        if (metamask?.connected) {
            await this.MetamaskConnect();
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

    const getMetamaskProvider = async () => {
        if (window.ethereum) {
            console.log('found window.ethereum>>');
            return window.ethereum;
        } else {
            console.log("not found window.ethereum>>")
            const provider = createMetaMaskProvider();
            return provider;
        }
    }

    const createMetaMaskProvider = () => {
        let provider
        try {
            let currentMetaMaskId = getMetaMaskId()
            const metamaskPort = chrome.runtime.connect(currentMetaMaskId)
            const pluginStream = new PortStream(metamaskPort)
            provider = new MetaMaskInpageProvider(pluginStream)
        } catch (e) {
            console.dir(`Metamask connect error `, e)
            throw e
        }
        return provider
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
        coinbaseConnect,
        coinbaseDisconnect,
        coinbaseChainId,
        coinbasePersonalSign,
        coinbasePayment,
        coinbaseContractCall,
        //
        metamaskConnect,
        metamaskPersonalSign,
        metamaskDisconnect,
        metamaskPayment,
        metamaskContractCall
    };
}