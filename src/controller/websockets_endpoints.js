import * as endpoints_conections from './websockets_connections.js';

export function retrieve_bid (pair_name, base_wss) {
	return new Promise (function(res, rej) {
		endpoints_conections.retrieve_ticker(pair_name,base_wss)
		.then(response => {
			const data=response;
			res(data[0]);
		})
		.catch(err => {
			console.log("Error in function retrieve_bid");
		});
	});
}


export function retrieve_efect_price (pair_name,operation,amount,limit_price, base_wss) {
	const depth=25;
	return new Promise (function(res, rej) {
		endpoints_conections.retrieve_book(pair_name,depth,base_wss)
		.then(response => {
			var amount_limit=0;
			var amount_limit_value=0;
			var acumulate=0;
			var acumulate_value=0;
			var data=[];

			if (operation==='sell')	{
				data=response[0];
			}
			if (operation==='buy')	{
				data=response[1];
			}
			console.log(data);

			for (let i = 0; i <depth; i++) {
				if (amount-acumulate >0) {
					if (amount-acumulate > data[i][1]) {
						acumulate_value+=data[i][0]*data[i][1];
					}else {
						acumulate_value+=data[i][0]*(amount-acumulate);
					}
					acumulate+=data[i][1];
				}
				
				if (limit_price<data[i][0] && operation==='sell') {
					amount_limit+=data[i][1];
					amount_limit_value+=data[i][0]*data[i][1];
					}
				if (limit_price>data[i][0] && operation==='buy') {
					amount_limit+=data[i][1];
					amount_limit_value+=data[i][0]*data[i][1];
					}
			}
			res([acumulate_value,amount_limit,amount_limit_value]);
		})
		.catch(err => {
			console.log("Error in function retrieve_bid");
		});
	});
}


//Fetches a list of valid exchange traiding pairs
//This function isn't part of the challenge,
// I use it just for know the traiding pairs
export function list_pair (baseURL,res) {
	return new Promise (function(res, rej) {
		endpoints_conections.obtain_configs(baseURL,'conf/pub:list:pair:exchange')
		.then(response => {
			res(response);
		})
		.catch(err => {
			console.log("Error in function list_pair");
		});
	});
}
