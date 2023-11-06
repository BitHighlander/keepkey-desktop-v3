import { Web3Wallet, IWeb3Wallet } from '@walletconnect/web3wallet'
import { Core } from '@walletconnect/core'
import {
  setItem,
  getItem,
  removeItem,
  getAllItems } from '../../database'

export let web3wallet: IWeb3Wallet

export async function createWeb3Wallet(relayerRegionURL: string) {

  //end WC
  class FakeLocalStorage {
    constructor() {
      this.storage = {};
    }

    getItem(key) {
      console.log("get: ",key)
      return getItem[key];
    }

    setItem(key, value) {
      console.log("setItem: ",key)
      console.log("setItem: ",value)
      setItem(key, value);
    }

    removeItem(key) {
      removeItem(key);
    }

    clear() {
      this.storage = {};
    }
  }
  let localStorage = new FakeLocalStorage();

  const core = new Core({
    projectId: "14d36ca1bc76a70273d44d384e8475ae",
    relayUrl: relayerRegionURL ?? process.env.NEXT_PUBLIC_RELAY_URL,
    storage:localStorage
  })
  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'React Wallet Example',
      description: 'React Wallet for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886']
    }
  })

  try {
    const clientId = await web3wallet.engine.signClient.core.crypto.getClientId()
    console.log('WalletConnect ClientID: ', clientId)
    //localStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId)
  } catch (error) {
    console.error('Failed to set WalletConnect clientId in localStorage: ', error)
  }
}

export async function updateSignClientChainId(chainId: string, address: string) {
  console.log('chainId', chainId, address)
  // get most recent session
  const sessions = web3wallet.getActiveSessions()
  if (!sessions) return
  const namespace = chainId.split(':')[0]
  Object.values(sessions).forEach(async session => {
    await web3wallet.updateSession({
      topic: session.topic,
      namespaces: {
        ...session.namespaces,
        [namespace]: {
          ...session.namespaces[namespace],
          chains: [
            ...new Set([chainId].concat(Array.from(session.namespaces[namespace].chains || [])))
          ],
          accounts: [
            ...new Set(
              [`${chainId}:${address}`].concat(Array.from(session.namespaces[namespace].accounts))
            )
          ]
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 1000))

    const chainChanged = {
      topic: session.topic,
      event: {
        name: 'chainChanged',
        data: parseInt(chainId.split(':')[1])
      },
      chainId: chainId
    }

    const accountsChanged = {
      topic: session.topic,
      event: {
        name: 'accountsChanged',
        data: [`${chainId}:${address}`]
      },
      chainId
    }
    await web3wallet.emitSessionEvent(chainChanged)
    await web3wallet.emitSessionEvent(accountsChanged)
  })
}
