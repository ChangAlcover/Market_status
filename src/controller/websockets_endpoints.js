import * as endpoints_conections from './websockets_connections_bitfinex.js';


export function retrieve_bid (pair_name, base_wss) {
	return new Promise (function(res, rej) {
		endpoints_conections.retrieve_ticker(pair_name,base_wss)
		.then(response => {
			const data=response;
			res([data[0],data[1],data[2],data[3]]);
		})
		.catch(err => {
			console.log("Error in function retrieve_bid");
		});
	});
}


export function retrieve_effect_price (pair_name, operation, amount, limit_price, base_wss,depth=25) {
	return new Promise (function(res, rej) {
		endpoints_conections.retrieve_book(pair_name,depth,base_wss)
		.then(response => {
			const data = response;
			res(effect_price_logic(operation,amount,limit_price,depth,data));
		})
		.catch (err => {
			console.log("Error in function retrieve_bid");
		});
	});
}


export function effect_price_logic (operation, amount, limit_price, depth, data) {	
	var amount_limit=0;
	var amount_limit_value=0;
	var acumulate=0;
	var acumulate_value=0;
	/** Data has all the information for bid and ask
	 *  but we only need one of the two according to the specified operation **/
	if (operation==='sell')	{
		data=data[0];
	}
	if (operation==='buy')	{
		data=data[1];	
	}	
	try{
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
		if (amount-acumulate>0){
			/** if the depth is not enough to evaluate the effective price
			 * returning an incorrect numeric value can lead to undetectable problems **/
			return ['Unable to calculate, a smaller amount should work',amount_limit,amount_limit_value];
		}
		return [acumulate_value,amount_limit,amount_limit_value];
	}catch (err) {
			console.log("Error effect_price_logic function");
	}
}


/** Fetches a list of valid exchange trading pairs
 * This function isn't part of the challenge,
 * I use it just to know the trading pairs **/
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
