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
app.get('/getpairs/', (req,res) =>{ 
    endpoints_function.list_pair(base_URL)
    .then(response => {
      const data=response;
      res.send(`Pair_name existing: ${data}`);

  })
  .catch(err => {
    console.log("Error in function getpairs");
  });
});

//Endpoint1, example pair_name='tBTCUSD'
app.get('/end1/:pair_name', (req,res) => {
  endpoints_function.retrieve_bid(req.params.pair_name,base_wss)
  .then(response => {
    const data=response;
    res.send(`Bid for ${req.params.pair_name} in: ${data}`);

  })
  .catch(err => {
    console.log("Error in function pair_name");
  });
});

//Endpoint2, example pair_name='tBTCUSD'
app.get('/end2/:pair_name', (req,res) => {
  const amount =2;
  const limit_price=44885;
  endpoints_function.retrieve_efect_price(req.params.pair_name,'buy',amount,limit_price,base_wss)
  .then(response => {
    const data=response;
    res.send(`<p>Effective price for ${req.params.pair_name} and an amount of ${amount} is: ${data[0]}</p>
            <p>With a limit price of ${limit_price} the maximun order of ${req.params.pair_name} is ${data[1]} at a effective price of ${data[2]}</p>`);
  })
  .catch(err => {
    console.log("Error in function pair_name");
  });
});