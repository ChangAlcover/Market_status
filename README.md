# Market_status
API REST in Express that retrieves market information

## Basic use

To use like a localhost, express, ws, chai-mocha and axios it's needed, then run in the terminal:

$ npm start

## Online service

AWS Elastic Beanstalk was used for deploying the aplication:

http://marketst-env.eba-u9ybrq8c.us-east-1.elasticbeanstalk.com/

Endpoints can be checked by accessing the site

## Endpoints

Two endpoints was required and another was done for comfort (to know all the trading_pair available)

The 1st endpoint recieves a traiding_pair name and return just the best bid price,
it's called like '/pair/:pair_name/end1;

The 2nd endpoint recieves a traiding_pair name, a operation (buy/sell), an amount and a limit_price for the bonus,
it's called like '/pair/:pair_name/:operation/:amount/:limit_price/end2'
it return the effective price, the maximum order size that could be executed with the limit_price and it's effective price

## Test 

The unit-test use Mocka, and for the moment there is a only test.
I could add more tests to check each error handler and console.log, but it's for a future version

## Contributor

Develop by Ariel Chang
