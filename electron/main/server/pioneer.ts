import { v4 as uuidv4 } from "uuid";
import { SDK } from "@pioneer-sdk/sdk";
import fs from 'fs/promises';
import path from 'path';

const CONFIG_PATH = path.join(__dirname, 'config.json'); // Ensure path is correct with `__dirname`

// Default configuration values
const defaultConfig = {
    queryKey: null,
    username: null,
    keepkeyApiKey: process.env.KEEPKEY_API_KEY || null,
};

async function readConfig() {
    try {
        return JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File not found, write default config to a new file
            const newConfig = {
                ...defaultConfig,
                queryKey: `key:${uuidv4()}`,
                username: `user:${uuidv4()}`.substring(0, 13),
            };
            await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
            return newConfig;
        } else {
            throw error; // An error other than file not existing
        }
    }
}

export async function onStartPioneer() {
    try {
        const config = await readConfig();

        const keepkeyApiKey = config.keepkeyApiKey || process.env.KEEPKEY_API_KEY;

        const blockchains = config.blockchains || [
            "bitcoin", "ethereum", "thorchain", "bitcoincash", "litecoin", "binance", "cosmos", "dogecoin"
        ];

        const spec = process.env.VITE_PIONEER_URL_SPEC || config.spec || "https://swaps.pro/spec/swagger.json";

        const configPioneer = {
            blockchains,
            username: config.username,
            queryKey: config.queryKey,
            keepkeyApiKey,
            spec,
            wss: "wss://pioneers.dev",
            paths: config.paths || [],
            ethplorerApiKey: process.env.VITE_ETHPLORER_API_KEY || config.ethplorerApiKey || "EK-xs8Hj-qG4HbLY-LoAu7",
            covalentApiKey: process.env.VITE_COVALENT_API_KEY || config.covalentApiKey || "cqt_rQ6333MVWCVJFVX3DbCCGMVqRH4q",
            utxoApiKey: process.env.VITE_BLOCKCHAIR_API_KEY || config.utxoApiKey,
            walletConnectProjectId: process.env.VITE_WALLET_CONNECT_PROJECT_ID || config.walletConnectProjectId || "18224df5f72924a5f6b3569fbd56ae16",
        };

        if (!configPioneer.utxoApiKey) {
            throw Error("blockchair api key required!");
        }

        const appInit = new SDK(spec, configPioneer);

        if (appInit.keepkeyApiKey !== keepkeyApiKey) {
            console.log("SAVING API KEY.");
            config.keepkeyApiKey = appInit.keepkeyApiKey;
            await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
        }

        const api = await appInit.init();
        console.log("appInit.wallets: ", appInit.wallets);

        // Add more logic as needed...
    } catch (e) {
        console.error(e);
    }
}

// Call the function to start the process
onStartPioneer().then(() => {
    console.log('Pioneer started successfully.');
}).catch((error) => {
    console.error('Error starting Pioneer:', error);
});
