# Market_status
API REST in Express that retrieves market information

Two endpoints was required and another was done for comfort (to know all the trading_pair available)

The 1st endpoint recieves a traiding_pair name and return just the best bid price,
it's called with the URL: http://localhost:3000/end1/:pair_name

The 2nd endpoint recieves a traiding_pair name, a operation (buy/sell), an amount and a limit_price for the bonus,
URL is http://localhost:3000/end2/:pair_name/:operation/:amount/:limit_price
it return the effective price, the maximum order size that could be executed with the limit_price and it's effective price

The unit-test use Mocka, and for the moment there is a only test, this should change soon

