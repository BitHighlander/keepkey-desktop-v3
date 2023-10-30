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
    // const onSessionRequest = useCallback(
    //     async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
    //         console.log('session_request', requestEvent)
    //         const { topic, params, verifyContext } = requestEvent
    //         const { request } = params
    //         const requestSession = web3wallet.engine.signClient.session.get(topic)
    //         // set the verify context so it can be displayed in the projectInfoCard
    //         //SettingsStore.setCurrentRequestVerifyContext(verifyContext)
    //         console.log("(request.method: ",request.method)
    //         // switch (request.method) {
    //         //     case EIP155_SIGNING_METHODS.ETH_SIGN:
    //         //     case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    //         //         return events.sender.send('SessionSignModal', { requestEvent, requestSession })
    //         //
    //         //     case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    //         //     case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    //         //     case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
    //         //         return events.sender.send('SessionSignTypedDataModal', { requestEvent, requestSession })
    //         //
    //         //     case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
    //         //     case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
    //         //         return events.sender.send('SessionSendTransactionModal', { requestEvent, requestSession })
    //         //
    //         //     case COSMOS_SIGNING_METHODS.COSMOS_SIGN_DIRECT:
    //         //     case COSMOS_SIGNING_METHODS.COSMOS_SIGN_AMINO:
    //         //         return events.sender.send('SessionSignCosmosModal', { requestEvent, requestSession })
    //         //
    //         //     case SOLANA_SIGNING_METHODS.SOLANA_SIGN_MESSAGE:
    //         //     case SOLANA_SIGNING_METHODS.SOLANA_SIGN_TRANSACTION:
    //         //         return events.sender.send('SessionSignSolanaModal', { requestEvent, requestSession })
    //         //
    //         //     case POLKADOT_SIGNING_METHODS.POLKADOT_SIGN_MESSAGE:
    //         //     case POLKADOT_SIGNING_METHODS.POLKADOT_SIGN_TRANSACTION:
    //         //         return events.sender.send('SessionSignPolkadotModal', { requestEvent, requestSession })
    //         //
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_IN:
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_OUT:
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_TRANSACTION:
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_AND_SEND_TRANSACTION:
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_TRANSACTIONS:
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_AND_SEND_TRANSACTIONS:
    //         //     case NEAR_SIGNING_METHODS.NEAR_VERIFY_OWNER:
    //         //     case NEAR_SIGNING_METHODS.NEAR_SIGN_MESSAGE:
    //         //         return events.sender.send('SessionSignNearModal', { requestEvent, requestSession })
    //         //
    //         //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_MESSAGE:
    //         //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_TRANSACTION:
    //         //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_TRANSACTIONS:
    //         //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_LOGIN_TOKEN:
    //         //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_NATIVE_AUTH_TOKEN:
    //         //         return events.sender.send('SessionSignMultiversxModal', { requestEvent, requestSession })
    //         //
    //         //     case NEAR_SIGNING_METHODS.NEAR_GET_ACCOUNTS:
    //         //         return web3wallet.respondSessionRequest({
    //         //             topic,
    //         //             response: await approveNearRequest(requestEvent)
    //         //         })
    //         //
    //         //     case TRON_SIGNING_METHODS.TRON_SIGN_MESSAGE:
    //         //     case TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION:
    //         //         return events.sender.send('SessionSignTronModal', { requestEvent, requestSession })
    //         //     case TEZOS_SIGNING_METHODS.TEZOS_GET_ACCOUNTS:
    //         //     case TEZOS_SIGNING_METHODS.TEZOS_SEND:
    //         //     case TEZOS_SIGNING_METHODS.TEZOS_SIGN:
    //         //         return events.sender.send('SessionSignTezosModal', { requestEvent, requestSession })
    //         //     case KADENA_SIGNING_METHODS.KADENA_GET_ACCOUNTS:
    //         //     case KADENA_SIGNING_METHODS.KADENA_SIGN:
    //         //     case KADENA_SIGNING_METHODS.KADENA_QUICKSIGN:
    //         //         return events.sender.send('SessionSignKadenaModal', { requestEvent, requestSession })
    //         //     default:
    //         //         return events.sender.send('SessionUnsuportedMethodModal', { requestEvent, requestSession })
    //         // }
    //     },
    //     []
    // )

    const onSessionRequest = (requestEvent:any) => {
            console.log("requestEvent: ", requestEvent);
            const { topic, params, verifyContext } = requestEvent
            const { request } = params
            console.log("request.method: ", request.method);

            const requestSession = web3wallet.engine.signClient.session.get(topic)
            return events.sender.send('onSessionRequest', { method:request.method, requestEvent, requestSession })
        
            // switch (request.method) {
            //     case EIP155_SIGNING_METHODS.ETH_SIGN:
            //     case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            //         return events.sender.send('SessionSignModal', { requestEvent, requestSession })
            //
            //     case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
            //     case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
            //     case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
            //         return events.sender.send('SessionSignTypedDataModal', { requestEvent, requestSession })
            //
            //     case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
            //     case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
            //         return events.sender.send('SessionSendTransactionModal', { requestEvent, requestSession })
            //
            // //     case COSMOS_SIGNING_METHODS.COSMOS_SIGN_DIRECT:
            // //     case COSMOS_SIGNING_METHODS.COSMOS_SIGN_AMINO:
            // //         return events.sender.send('SessionSignCosmosModal', { requestEvent, requestSession })
            // //
            // //     case SOLANA_SIGNING_METHODS.SOLANA_SIGN_MESSAGE:
            // //     case SOLANA_SIGNING_METHODS.SOLANA_SIGN_TRANSACTION:
            // //         return events.sender.send('SessionSignSolanaModal', { requestEvent, requestSession })
            // //
            // //     case POLKADOT_SIGNING_METHODS.POLKADOT_SIGN_MESSAGE:
            // //     case POLKADOT_SIGNING_METHODS.POLKADOT_SIGN_TRANSACTION:
            // //         return events.sender.send('SessionSignPolkadotModal', { requestEvent, requestSession })
            // //
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_IN:
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_OUT:
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_TRANSACTION:
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_AND_SEND_TRANSACTION:
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_TRANSACTIONS:
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_AND_SEND_TRANSACTIONS:
            // //     case NEAR_SIGNING_METHODS.NEAR_VERIFY_OWNER:
            // //     case NEAR_SIGNING_METHODS.NEAR_SIGN_MESSAGE:
            // //         return events.sender.send('SessionSignNearModal', { requestEvent, requestSession })
            // //
            // //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_MESSAGE:
            // //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_TRANSACTION:
            // //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_TRANSACTIONS:
            // //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_LOGIN_TOKEN:
            // //     case MULTIVERSX_SIGNING_METHODS.MULTIVERSX_SIGN_NATIVE_AUTH_TOKEN:
            // //         return events.sender.send('SessionSignMultiversxModal', { requestEvent, requestSession })
            // //
            // //     case NEAR_SIGNING_METHODS.NEAR_GET_ACCOUNTS:
            // //         return web3wallet.respondSessionRequest({
            // //             topic,
            // //             response: await approveNearRequest(requestEvent)
            // //         })
            // //
            // //     case TRON_SIGNING_METHODS.TRON_SIGN_MESSAGE:
            // //     case TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION:
            // //         return events.sender.send('SessionSignTronModal', { requestEvent, requestSession })
            // //     case TEZOS_SIGNING_METHODS.TEZOS_GET_ACCOUNTS:
            // //     case TEZOS_SIGNING_METHODS.TEZOS_SEND:
            // //     case TEZOS_SIGNING_METHODS.TEZOS_SIGN:
            // //         return events.sender.send('SessionSignTezosModal', { requestEvent, requestSession })
            // //     case KADENA_SIGNING_METHODS.KADENA_GET_ACCOUNTS:
            // //     case KADENA_SIGNING_METHODS.KADENA_SIGN:
            // //     case KADENA_SIGNING_METHODS.KADENA_QUICKSIGN:
            // //         return events.sender.send('SessionSignKadenaModal', { requestEvent, requestSession })
            //     default:
            //         return events.sender.send('SessionUnsuportedMethodModal', { requestEvent, requestSession })
            // }
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
            console.log("web3wallet", web3wallet)
            if(web3wallet){
              web3wallet.pair({ uri })
              //event.reply('asynchronous-reply', 'pong')
            }
        
            event.reply('pair', message)
        });
        
    }

}
