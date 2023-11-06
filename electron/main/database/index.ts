/*
    Database Controller
 */

// Import required modules
const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database
const db = new sqlite3.Database('sessions.db');

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

interface SessionData {
    relay: {
        protocol: string;
    };
    namespaces: {
        eip155: {
            chains: string[];
            methods: string[];
            events: string[];
            accounts: string[];
        };
    };
    requiredNamespaces: {
        eip155: {
            chains: string[];
            methods: string[];
            events: string[];
            rpcMap: { [key: string]: any };
        };
    };
    optionalNamespaces: {
        eip155: {
            chains: string[];
            methods: string[];
            events: string[];
            rpcMap: { [key: string]: any };
        };
    };
    pairingTopic: string;
    controller: string;
    expiry: number;
    topic: string;
    acknowledged: boolean;
    self: {
        publicKey: string;
        metadata: {
            name: string;
            description: string;
            url: string;
            icons: string[];
        };
    };
    peer: {
        publicKey: string;
        metadata: {
            description: string;
            url: string;
            icons: string[];
            name: string;
        };
    };
}

// Create the pubkeys, balances, caips, and sessions tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pubkeys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pubkey TEXT NOT NULL,
            type TEXT NOT NULL,
            blockchain TEXT NOT NULL,
            symbol TEXT NOT NULL,
            asset TEXT NOT NULL,
            path TEXT NOT NULL,
            pathMaster TEXT NOT NULL,
            script_type TEXT NOT NULL,
            network TEXT NOT NULL,
            created INTEGER NOT NULL,
            tags TEXT NOT NULL,
            xpub TEXT NOT NULL,
            master TEXT NOT NULL,
            address TEXT NOT NULL
        )
  `);

    db.run(`
        CREATE TABLE IF NOT EXISTS balances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            network TEXT NOT NULL,
            blockchainCaip TEXT NOT NULL,
            assetCaip TEXT NOT NULL,
            asset TEXT NOT NULL,
            symbol TEXT NOT NULL,
            pubkey TEXT NOT NULL,
            context TEXT NOT NULL,
            isToken INTEGER NOT NULL,
            lastUpdated INTEGER NOT NULL,
            balance REAL NOT NULL
        )
  `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionData TEXT NOT NULL
      )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS key_value_store (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
`);

});

//keystore
// Function to store a key-value pair
function setItem(key, value) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT OR REPLACE INTO key_value_store (key, value) VALUES (?, ?)',
            [key, JSON.stringify(value)],
            function (err) {
                if (err) {
                    console.error('Error storing key-value pair:', err.message);
                    reject(err);
                } else {
                    console.log('Key-value pair stored successfully');
                    resolve();
                }
            }
        );
    });
}

// Function to retrieve a value by key
function getItem(key) {
    return new Promise((resolve, reject) => {
        db.get('SELECT value FROM key_value_store WHERE key = ?', [key], function (err, row) {
            if (err) {
                console.error('Error retrieving value by key:', err.message);
                reject(err);
            } else if (row) {
                resolve(JSON.parse(row.value));
            } else {
                resolve(null);
            }
        });
    });
}

// Function to delete a key-value pair by key
function removeItem(key) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM key_value_store WHERE key = ?', [key], function (err) {
            if (err) {
                console.error('Error deleting key-value pair by key:', err.message);
                reject(err);
            } else {
                console.log('Key-value pair deleted successfully');
                resolve();
            }
        });
    });
}

// Function to retrieve all key-value pairs
function getAllItems() {
    return new Promise((resolve, reject) => {
        db.all('SELECT key, value FROM key_value_store', [], function (err, rows) {
            if (err) {
                console.error('Error retrieving all key-value pairs:', err.message);
                reject(err);
            } else {
                const result = {};
                rows.forEach(row => {
                    result[row.key] = JSON.parse(row.value);
                });
                resolve(result);
            }
        });
    });
}

// export interface Session {
//     id?: number; // Optional ID field for database storage
//     sessionData: SessionData;
// }
// Function to delete sessions by topic

function deleteSessionsByTopic(topic: string) {
    return new Promise<void>((resolve, reject) => {
        db.run(
            'DELETE FROM sessions WHERE sessionData LIKE ?',
            [`%"topic":"${topic}"%`], // Match the topic within the sessionData JSON
            function (err) {
                if (err) {
                    console.error('Error deleting sessions by topic:', err.message);
                    reject(err);
                } else {
                    console.log('Sessions deleted successfully for topic:', topic);
                    resolve();
                }
            }
        );
    });
}

// Function to store a session
function storeSession(session: SessionData) {
    return new Promise<void>((resolve, reject) => {
        db.run(
            'INSERT INTO sessions (sessionData) VALUES (?)',
            [JSON.stringify(session)],
            function (err) {
                if (err) {
                    console.error('Error storing session:', err.message);
                    reject(err);
                } else {
                    console.log('Session stored successfully with ID:', this.lastID);
                    resolve();
                }
            }
        );
    });
}

// Function to retrieve all sessions
function getAllSessions() {
    return new Promise<Session[]>((resolve, reject) => {
        db.all('SELECT * FROM sessions', function (err, rows) {
            if (err) {
                console.error('Error retrieving sessions:', err.message);
                reject(err);
            } else {
                const sessions = rows.map((row) => ({
                    id: row.id,
                    sessionData: JSON.parse(row.sessionData),
                }));
                resolve(sessions);
            }
        });
    });
}

// Function to store a pubkey
function storePubkey(pubkey: Pubkey) {
    return new Promise<void>((resolve, reject) => {
        db.run(
            'INSERT INTO pubkeys (pubkey, type, blockchain, symbol, asset, path, pathMaster, script_type, network, created, tags, xpub, master, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                pubkey.pubkey,
                pubkey.type,
                pubkey.blockchain,
                pubkey.symbol,
                pubkey.asset,
                pubkey.path,
                pubkey.pathMaster,
                pubkey.script_type,
                pubkey.network,
                pubkey.created,
                JSON.stringify(pubkey.tags), // Store tags as JSON string
                pubkey.xpub,
                pubkey.master,
                pubkey.address
            ],
            function (err: { message: any; }) {
                if (err) {
                    console.error('Error storing pubkey:', err.message);
                    reject(err);
                } else {
                    console.log('Pubkey stored successfully with ID:', this.lastID);
                    resolve();
                }
            }
        );
    });
}

// Function to retrieve all pubkeys
function getAllPubkeys() {
    return new Promise<Pubkey[]>((resolve, reject) => {
        db.all('SELECT * FROM pubkeys', function (err: { message: any; }, rows: Pubkey[] | PromiseLike<Pubkey[]>) {
            if (err) {
                console.error('Error retrieving pubkeys:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to update a pubkey by its ID
function updatePubkeyById(pubkeyId: number, updatedPubkey: Pubkey) {
    return new Promise<void>((resolve, reject) => {
        db.run(
            'UPDATE pubkeys SET pubkey = ?, type = ?, blockchain = ?, symbol = ?, asset = ?, path = ?, pathMaster = ?, script_type = ?, network = ?, created = ?, tags = ?, xpub = ?, master = ?, address = ? WHERE id = ?',
            [
                updatedPubkey.pubkey,
                updatedPubkey.type,
                updatedPubkey.blockchain,
                updatedPubkey.symbol,
                updatedPubkey.asset,
                updatedPubkey.path,
                updatedPubkey.pathMaster,
                updatedPubkey.script_type,
                updatedPubkey.network,
                updatedPubkey.created,
                JSON.stringify(updatedPubkey.tags), // Store tags as JSON string
                updatedPubkey.xpub,
                updatedPubkey.master,
                updatedPubkey.address,
                pubkeyId
            ],
            function (err: { message: any; }) {
                if (err) {
                    console.error('Error updating pubkey by ID:', err.message);
                    reject(err);
                } else {
                    console.log('Pubkey updated successfully with ID:', pubkeyId);
                    resolve();
                }
            }
        );
    });
}

// Function to delete a pubkey by its ID
function deletePubkeyById(pubkeyId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM pubkeys WHERE id = ?', [pubkeyId], function (err) {
            if (err) {
                console.error('Error deleting pubkey by ID:', err.message);
                reject(err);
            } else {
                console.log('Pubkey deleted successfully with ID:', pubkeyId);
                resolve();
            }
        });
    });
}

// Function to delete all balances associated with a pubkey by pubkey ID
function deleteBalancesByPubkey(pubkeyId: number) {
    return new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM balances WHERE pubkey = ?', [pubkeyId], function (err) {
            if (err) {
                console.error('Error deleting balances by pubkey ID:', err.message);
                reject(err);
            } else {
                console.log('Balances deleted successfully for pubkey with ID:', pubkeyId);
                resolve();
            }
        });
    });
}

// Export the functions
export {
    setItem,
    getItem,
    removeItem,
    getAllItems,
    deleteSessionsByTopic,
    storeSession,
    getAllSessions,
    storePubkey,
    getAllPubkeys,
    updatePubkeyById,
    deletePubkeyById,
    deleteBalancesByPubkey,
};
