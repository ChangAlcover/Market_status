import express from 'express';
import * as endpoints_function from './src/controller/websockets_endpoints.js';

const base_URL = 'https://api-pub.bitfinex.com/v2/';
const base_wss= 'wss://api-pub.bitfinex.com/ws/2';

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
	res.send("Hello");
});


app.listen(port, () => {
	console.log(`Server running on port: http://localhost:${port}`);
});


//This function isn't part of the challenge,
// I use it just for know the traiding pairs
app.get('/pairs', (req,res) =>{ 
    endpoints_function.list_pair(base_URL)
    .then(response => {
      const data=response;
      res.send(`Pair_name existing: ${data}`);

  })
  .catch(err => {
    console.log("Error in function getpairs");
  });
});


/**Endpoint1, example pair_name='tBTCUSD'**/
app.get('/pair/:pair_name/end1', (req,res) => {
  endpoints_function.retrieve_bid(req.params.pair_name,base_wss)
  .then(response => {
    const best_bid=response[0];
    const bid_size=response[1];
    const best_ask=response[2];
    const ask_size=response[3];

    res.send(`<p>Best bid for ${req.params.pair_name} in: ${best_bid} and have an amount of ${bid_size}</p>
            <p> for buy the best price es ${best_ask} and have an amount of ${ask_size}<p>`);

  })
  .catch(err => {
    console.log("Error in function pair_name");
  });
});


/** Endpoint2, example pair_name='tBTCUSD'**/
app.get('/pair/:pair_name/:operation/:amount/:limit_price/end2', (req,res) => {
  const pair_name=req.params.pair_name;
  const amount =req.params.amount;
  const limit_price=req.params.limit_price;
  const operation=req.params.operation;
  endpoints_function.retrieve_effect_price(pair_name,operation,amount,limit_price,base_wss)
  .then(response => {
    const data=response;
    res.write(`<p>Effective price for ${req.params.pair_name} and an amount of ${amount} is: ${data[0]}</p>
            <p>With a limit price of ${limit_price} the maximun order of ${req.params.pair_name} is ${data[1]} at a effective price of ${data[2]}</p>`);

    /** Sometimes the limit_price is out of range **/
    if (data[1]===0) {
      res.write(`<p>The limit price used isn't in the range of bid-ask</p>`);
    }
    res.end();
    
  })
  .catch(err => {
    console.log("Error in function pair_name");
  });
});
