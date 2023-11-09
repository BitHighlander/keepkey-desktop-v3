// Using ES6 imports
import express from 'express';
const app = express();
const PORT = 4000;

import {onStartPioneer} from './pioneer'

onStartPioneer()

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

export function onStartServer() {
    app.listen(PORT, () => {
        console.log(`Express server running on http://localhost:${PORT}`);
    });
}
