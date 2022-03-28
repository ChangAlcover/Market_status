import axios from 'axios';
import ws from 'ws';

export function retrieve_ticker(pair_name,base_wss) {

	return new Promise (function(res, rej) {
	
		const ws_server = new ws(base_wss);

		let msg = JSON.stringify({ 
		  event: 'subscribe', 
		  channel: 'ticker', 
		  symbol: pair_name 
		});

		ws_server.on('message', (msg) => {
			const data=JSON.parse(msg.toString());
			if (!isNaN(data[0])){
				ws_server.close();
				res(data[1]);		
			}
		});
			ws_server.on('open', () => ws_server.send(msg));
	});
}


export function retrieve_book(pair_name,depth,base_wss) {

	return new Promise (function(res, rej) {
	
		const ws_server = new ws(base_wss);

		let msg = JSON.stringify({ 
		  event: 'subscribe', 
		  channel: 'book', 
		  symbol: pair_name,
		  prec: 'R0',
		  lenght: depth
		});

		ws_server.on('message', (msg) => {
			const bid_data=[];
			const ask_data=[];
			var data=JSON.parse(msg.toString());

			/** The information from Bitfinex comes with a tag in data[0]
			 * 	The information needed to calculate the effective price is 
			 * 	labeled with the NUMBER of the connection channel.
			 *  If the order takes a long time, it has the label 'hb' and there is no information
			 * 	Finally, sometimes Bitfinex sends updates of the information with the snapchat of the current situation,
			 * 	it is necessary to delete all updates, which can be recognized because it doesn't have the required depth **/

			if (typeof data[0]==='number' && data[1]!=='hb' && data[1].length==depth*2){
				data=data[1];
				ws_server.close();
				for (let i=0; i<depth*2; i++) {					
					if (data[i][2]>0) {
						bid_data.push([data[i][1],data[i][2]]);
					} else {
						ask_data.push([data[i][1],-data[i][2]]);
					}					
				}
				data=[bid_data,ask_data];
				res(data);				
			}
		});
			ws_server.on('open', () => ws_server.send(msg));
	});
}


/** Access to Configs Params
 * This function isn't part of the challenge,
 * I use it just to know the trading pairs **/
export function obtain_configs (base_URL,config_params) {
	
	return new Promise (function(res, rej) {

		axios.get(`${base_URL}/${config_params}`)
		.then(response => {
			res(response.data);
		})
		.catch(err => {
			console.log("Error in function obtain_configs");
		});
	});
}
