export interface Balance {
    network: string;
    blockchainCaip: string;
    assetCaip: string;
    asset: string;
    symbol: string;
    pubkey: string;
    context: string;
    isToken: boolean;
    lastUpdated: number;
    balance: number;
}

export interface Pubkey {
    pubkey: string;
    type: string;
    blockchain: string;
    symbol: string;
    asset: string;
    path: string;
    pathMaster: string;
    script_type: string;
    network: string;
    created: number;
    tags: string[];
    xpub: string;
    master: string;
    address: string;
    balances: Balance[];
}
