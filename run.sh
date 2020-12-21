#! /bin/bash

echo "Fetching Tokens"
tokens=$(ETradeAuth --consumerKey ${ETRADE_CONSUMER_KEY} --consumerSecret ${ETRADE_CONSUMER_SECRET} --webPassword ${ETRADE_PASSWORD} --webUsername ${ETRADE_USERNAME})
echo "$tokens"
echo "$tokens" > /tokens/tokens.json
