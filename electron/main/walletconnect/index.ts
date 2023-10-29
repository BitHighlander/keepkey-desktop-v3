// walletInitialization.js

// import { createOrRestoreCosmosWallet } from './utils/CosmosWalletUtil';
import { createOrRestoreEIP155Wallet } from './utils/EIP155WalletUtil';
// import { createOrRestoreSolanaWallet } from './utils/SolanaWalletUtil';
// import { createOrRestorePolkadotWallet } from './utils/PolkadotWalletUtil';
// import { createOrRestoreNearWallet } from './utils/NearWalletUtil';
// import { createOrRestoreMultiversxWallet } from './utils/MultiversxWalletUtil';
// import { createOrRestoreTronWallet } from './utils/TronWalletUtil';
// import { createOrRestoreTezosWallet } from './utils/TezosWalletUtil';
import { createWeb3Wallet, web3wallet } from './utils/WalletConnectUtil';
// import { createOrRestoreKadenaWallet } from './utils/KadenaWalletUtil';


export async function initializeWallets(relayerRegionURL = '') {
    try {
        let seed = process.env['WALLET_TEST_SEED'] || "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"
        const { eip155Addresses } = createOrRestoreEIP155Wallet(seed);
        // const { cosmosAddresses } = await createOrRestoreCosmosWallet();
        // const { solanaAddresses } = await createOrRestoreSolanaWallet();
        // const { polkadotAddresses } = await createOrRestorePolkadotWallet();
        // const { nearAddresses } = await createOrRestoreNearWallet();
        // const { multiversxAddresses } = await createOrRestoreMultiversxWallet();
        // const { tronAddresses } = await createOrRestoreTronWallet();
        // const { tezosAddresses } = await createOrRestoreTezosWallet();
        // const { kadenaAddresses } = await createOrRestoreKadenaWallet();

        // Instead of setting the addresses in a store, you might return them, log them,
        // or use them in some other way that makes sense for your Node.js application.
        console.log('EIP155 Address:', eip155Addresses[0]);
        // console.log('Cosmos Address:', cosmosAddresses[0]);
        // console.log('Solana Address:', solanaAddresses[0]);
        // console.log('Polkadot Address:', polkadotAddresses[0]);
        // console.log('Near Address:', nearAddresses[0]);
        // console.log('Multiversx Address:', multiversxAddresses[0]);
        // console.log('Tron Address:', tronAddresses[0]);
        // console.log('Tezos Address:', tezosAddresses[0]);
        // console.log('Kadena Address:', kadenaAddresses[0]);

        await createWeb3Wallet(relayerRegionURL);

        // Restart transport if relayer region changes
        web3wallet.core.relayer.restartTransport(relayerRegionURL);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
