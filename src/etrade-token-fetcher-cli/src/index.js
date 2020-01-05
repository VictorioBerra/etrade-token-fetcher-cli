const {Command, flags} = require('@oclif/command');

class ETradeTokenFetcherCliCommand extends Command {
  async run() {
    const {flags} = this.parse(ETradeTokenFetcherCliCommand);

    const etradeTokenFetcher = await require('etrade-token-fetcher')({
      username: flags.webUsername,
      password: flags.webPassword,
      consumerKey: flags.consumerKey,
      consumerSecret: flags.consumerSecret,
      headless: !flags.noHeadless, // Invert because the property headless=true in the library will make the browser not show.
    });

    const tokens = await etradeTokenFetcher.login();
    // eslint-disable-next-line camelcase
    tokens.oauth_token = encodeURIComponent(tokens.oauth_token);

    this.log(JSON.stringify(tokens));
  }
}

ETradeTokenFetcherCliCommand.description = `Headless browser login to etrade, and call request_token and authorize_token.
Use the consumer key and secret to get a request token via /request_token
Use a headless Chromium browser to login via the ETrade web UI (THIS WILL LOG YOU OUT)
Use a headless browser to hit /authorize endpoint using the request token and accept and grab the validation code
Use the validation code to call /access_token
`;

ETradeTokenFetcherCliCommand.examples = [
  '$ ETradeAuth --webUsername "" --webPassword \'\' --consumerKey "" --consumerSecret ""',
  '$ env:DEBUG="etradeTokenFetcher"; --webUsername "" --webPassword \'\' --consumerKey "" --consumerSecret "" --noHeadless',
];

ETradeTokenFetcherCliCommand.flags = {
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
  webUsername: flags.string({
    char: 'u',
    description: 'Username used to login to ETrade Web UI.',
    required: true,
  }),
  webPassword: flags.string({
    char: 'p',
    description: 'Password used to login to ETrade Web UI.',
    required: true,
  }),
  consumerKey: flags.string({
    char: 'k',
    description: 'Consumer Key received from ETrade API access request.',
    required: true,
  }),
  consumerSecret: flags.string({
    char: 's',
    description: 'Consumer Secret received from ETrade API access request.',
    required: true,
  }),
  noHeadless: flags.boolean({    
    description: 'Show the browser during automation.',
    default: false,
  }),
};

module.exports = ETradeTokenFetcherCliCommand;
