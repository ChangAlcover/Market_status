/*jshint esversion: 6 */

import express from 'express';
import  ws from 'ws';
import {endpoint1} from './src/controller/websockets_endpoints.js';

const w = new ws('wss://api-pub.bitfinex.com/ws/2');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send(endpoint1("Hello",w));
});

app.listen(port, () => {
	console.log(`Server running on port: http://localhost:${port}`);
});
