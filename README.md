ETradeTokenFetcherCLI
=====================

Perform auth operations (/request_token and /access_token) against the ETrade Web UI and ETrade API using a headless browser.

## Install

I am not uploading this to NPM. You are free to fork and do so.

CD into src/etrade-token-fetcher-cli, `npm install` and you should be able to run the CLI. You could use `npm link` for this or you could `npm pack` and then install the pack globally.

## Usage

`ETradeAuth --help`

```
Headless browser login to etrade, and call request_token and authorize_token.

USAGE
  $ ETradeAuth

OPTIONS
  -h, --help                           show CLI help
  -k, --consumerKey=consumerKey        (required) Consumer Key received from ETrade API access request.
  -p, --webPassword=webPassword        (required) Password used to login to ETrade Web UI.
  -s, --consumerSecret=consumerSecret  (required) Consumer Secret received from ETrade API access request.
  -u, --webUsername=webUsername        (required) Username used to login to ETrade Web UI.
  -v, --version                        show CLI version
  --noHeadless                         Show the browser during automation.

DESCRIPTION
  Use the consumer key and secret to get a request token via /request_token
  Use a headless Chromium browser to login via the ETrade web UI (THIS WILL LOG YOU OUT)
  Use a headless browser to hit /authorize endpoint using the request token and accept and grab the validation code
  Use the validation code to call /access_token

EXAMPLES
  $ ETradeAuth --webUsername "" --webPassword '' --consumerKey "" --consumerSecret ""
  $ env:DEBUG="etradeTokenFetcher"; --webUsername "" --webPassword '' --consumerKey "" --consumerSecret "" --noHeadless

```

Debug by setting the `DEBUG` environment variable. Like so:  `env:DEBUG="etradeTokenFetcher"`

## Errors

Currently the command can report the following errors

- Wrong Password
- Bot detected (error code 942 from ETrade)
- Account locked
- Request token fetch failed
- Access token request failed

## Contributing

Most of the unique logic exists in a separate package included in the `src` directory called `etrade-token-fetcher`

Use the environment var `DEBUG=etradeTokenFetcher` to enable verbose logging. **This will log sensitive data.**

## Notes

This was two separate repos, and I combined them into one to more easily share the code

## Disclaimer

ETrade appears to be doing some really basic headless browser detection. A lot of trial and error went into subverting this. At the time of writing this README (1/4/2019) this CLI worked perfectly.

However, I can not promise this will always work, and I do not intend to offer support. I wanted to release this internal tool to the community to both help others with this task, and to also add some examples of my software to my portfolio.

## License

MIT