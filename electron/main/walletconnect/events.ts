import { Web3WalletTypes } from '@walletconnect/web3wallet'
// import { COSMOS_SIGNING_METHODS } from './data/COSMOSData'
import { EIP155_SIGNING_METHODS } from './data/EIP155Data'
// import { SOLANA_SIGNING_METHODS } from './data/SolanaData'
// import { POLKADOT_SIGNING_METHODS } from './data/PolkadotData'
// import { MULTIVERSX_SIGNING_METHODS } from './data/MultiversxData'
// import { TRON_SIGNING_METHODS } from './data/TronData'
// import ModalStore from '@/store/ModalStore'
// import SettingsStore from '@/store/SettingsStore'
import { web3wallet } from './utils/WalletConnectUtil'
import { SignClientTypes } from '@walletconnect/types'
import { useCallback, useEffect } from 'react'
// import { NEAR_SIGNING_METHODS } from './data/NEARData'
// import { approveNearRequest } from './utils/NearRequestHandlerUtil'
// import { TEZOS_SIGNING_METHODS } from './data/TezosData'
// import { KADENA_SIGNING_METHODS } from './data/KadenaData'
import { ipcMain } from 'electron'

export default function useWalletConnectEventsManager(initialized: boolean, events: any) {
    /******************************************************************************
     * 1. Open session proposal modal for confirmation / rejection
     *****************************************************************************/

    const onSessionProposal = (proposal:any) => {
        console.log("onSessionProposal: ", proposal);
        events.sender.send('onSessionProposal', { proposal });
    };

    /******************************************************************************
     * 2. Open Auth modal for confirmation / rejection
     *****************************************************************************/

    const onAuthRequest = (request:any) => {
        console.log("onAuthRequest: ", request);
        events.sender.send('onAuthRequest', { request });
    };

    /******************************************************************************
     * 3. Open request handling modal based on method that was used
     *****************************************************************************/
    const onSessionRequest = (requestEvent:any) => {
            console.log("requestEvent: ", requestEvent);
            const { topic, params, verifyContext } = requestEvent
            const { request } = params
            console.log("request.method: ", request.method);

            const requestSession = web3wallet.engine.signClient.session.get(topic)
            return events.sender.send('onSessionRequest', { method:request.method, requestEvent, requestSession })
    };

    /******************************************************************************
     * Set up WalletConnect event listeners
     *****************************************************************************/
    if (initialized) {
        // Sign
        web3wallet.on('session_proposal', onSessionProposal);
        web3wallet.on('session_request', onSessionRequest);
        // Auth
        web3wallet.on('auth_request', onAuthRequest);
        // TODOs
        web3wallet.engine.signClient.events.on('session_ping', (data) => {
            try {
                console.log('ping', data);
            } catch (error) {
                console.error("Error in handling 'session_ping' event:", error);
            }
        });

        web3wallet.on('session_delete', (data) => {
            try {
                console.log('delete', data);
            } catch (error) {
                console.error("Error in handling 'session_delete' event:", error);
            }
        });


        ipcMain.on('pair', async (event, message) => {
            console.log("PAIR", message)
            let uri = message
            // console.log("web3wallet", web3wallet)
            if(web3wallet){
              web3wallet.pair({ uri })
              //event.reply('asynchronous-reply', 'pong')
            }
            event.reply('pair', message)
        });
        
    }

}
