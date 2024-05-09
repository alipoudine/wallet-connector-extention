import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { getNormalizeAddress } from './utils';
import Web3 from 'web3';
import createMetaMaskProvider from 'metamask-extension-provider'


import { Buffer } from 'buffer';
window.Buffer = Buffer;
if (typeof process === 'undefined') {
    const process = require('process');
    window.process = process;
}


export const createWalletManager = (appName, appLogoUrl, appChainIds) => {
    const walletLink = new CoinbaseWalletSDK({
        appName,
        appLogoUrl,
        appChainIds
    });

    const coinbaseProvider = walletLink.makeWeb3Provider({ options: 'all' });

    const metamaskProvider = createMetaMaskProvider()
    // coinbase functionalities

    const getCoinbaseProvider = async () => {
        return coinbaseProvider
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

            const web3 = new Web3(coinbaseProvider);
            const chainId = await web3.eth.getChainId();
            // const chainId = await coinbaseProvider.request({ method: 'eth_chainId' })
            if (!chainId) {
                throw new Error("chainId not detected");
            }
            return { chainId };
        } catch (error) {
            console.log("error getting chainId : ", error);
            return error
        }
    }

    const coinbaseNetworkChange = async (chainId,) => {
        try {
            // Request the wallet to switch or add the network
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: chainId,
                }],
            });
        } catch (error) {
            console.error('Failed to change network', error);
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
            console.log("error coinbase contract call : ", error);
            return error
        }
    }


    // Metamask functionalities

    const getMetamaskProvider = async () => {
        return metamaskProvider
    }

    const metamaskConnect = async () => {
        try {
            const accounts = await metamaskProvider.request({ method: 'eth_requestAccounts' })
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
            const web3 = new Web3(metamaskProvider);
            const chainId = await web3.eth.getChainId();

            // const chainId = await metamaskProvider.request({ method: 'eth_chainId' })
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

    const metamaskDisconnect = async () => {
        try {
            console.log("disconnect wallet runs")
            await metamaskProvider.disconnect()
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

    const metamaskContractCall = async () => {
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

    return {
        getCoinbaseProvider,
        coinbaseConnect,
        coinbaseDisconnect,
        coinbaseChainId,
        coinbaseNetworkChange,
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