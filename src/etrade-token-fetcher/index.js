const bhttp = require("bhttp");
const querystring = require("querystring");
const debug = require("debug")("etradeTokenFetcher");
const _ = require("lodash");

const responseHelpers = require("./lib/response-helpers");
const browserHelper = require("./lib/browserHelper");

// TODO, change to dictionary
var etradeAutoAuth = async function({
  username,
  password,
  consumerKey,
  consumerSecret,
  headless
}) {

  // TODO validate options
  headless = _.isUndefined(headless) ? true : headless;

  const tokenService = require("./lib/tokens")(consumerKey, consumerSecret);

  let Login = async function() {
    const requestTokenHeader = await tokenService.getRequestTokenHeader();
    const requestTokens = await bhttp
      .get("https://api.etrade.com/oauth/request_token", {
        headers: requestTokenHeader
      })
      .then(responseHelpers.throwIfNot200)
      .then(responseHelpers.toBody)
      .then(querystring.parse)
      .catch(err => {
        console.error("Request token fetch error.");
        throw err;
      });

    debug("Request token complete: ", requestTokens);

    const finalAuthURL = `https://us.etrade.com/e/t/etws/authorize?key=${consumerKey}&token=${requestTokens.oauth_token}`;
    debug("Authorizing with URL: ", finalAuthURL);
    debug("Please wait for browser automation (Chromium)... ");

    // Page is the page created. By this time the browser has a session
    const { page, browser } = await browserHelper.login(
      username,
      password,
      headless
    );

    debug("Attempting to authorize.");

    const validationCode = await browserHelper.getValidationCode(
      page,
      finalAuthURL
    );

    // Do not forget to close the browser created by browserHelper.login
    await browser.close();

    const accessTokenHeader = await tokenService.getAccessTokenHeader(
      requestTokens.oauth_token,
      requestTokens.oauth_token_secret,
      validationCode
    );

    debug("Built access token header: ", accessTokenHeader);

    const rawTokens = await bhttp
      .get("https://api.etrade.com/oauth/access_token", {
        headers: accessTokenHeader
      })
      .then(responseHelpers.throwIfNot200)
      .then(responseHelpers.toBody)
      .catch(err => {
        console.error("Access token fetch error.");
        throw err;
      });

    const finalTokens = querystring.parse(rawTokens);

    debug("Final Tokens: ", finalTokens);

    return finalTokens;
  };

  return {
    login: Login,
    exceptions: require("./lib/exceptions")
  };
};

module.exports = etradeAutoAuth;
