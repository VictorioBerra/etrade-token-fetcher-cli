const OAuth = require('oauth-1.0a');
const Promise = require("bluebird");
const bhttp = require("bhttp");

const insertString = require("./string-utilities").insertString;
const toBody = require("./response-helpers").toBody;
const signers = require("./signing");

function GetAccessToken(requestToken, requestTokenSecret, verificationToken) {
    var self = this;

    return Promise.try(function () {

        const oauthAccess = OAuth({
            consumer: {
                key: self.consumerKey,
                secret: self.consumerSecret
            },
            signature_method: 'HMAC-SHA1',
            hash_function: signers.accessTokenSigner(self.consumerSecret, requestTokenSecret)
        });

        const tokenData = {
            url: 'https://api.etrade.com/oauth/access_token',
            method: 'GET',
            data: {
                oauth_token: requestToken,
                oauth_verifier: verificationToken,
            }
        };

        var authHeader = insertString((oauthAccess.toHeader(oauthAccess.authorize(tokenData))).Authorization, 'realm="",', "oauth_consumer_key");

        return {
            Authorization:  authHeader
        };
    });
}

function GetRequestToken() {
    var self = this;

    return Promise.try(function () {

        const oauth = OAuth({
            consumer: {
                key: self.consumerKey,
                secret: self.consumerSecret
            },
            signature_method: 'HMAC-SHA1',
            hash_function: signers.requestTokenSigner
        });

        const requestTokenData = {
            url: 'https://api.etrade.com/oauth/request_token',
            method: 'GET',
            data: {
                oauth_callback: "oob"
            }
        };

        return oauth.toHeader(oauth.authorize(requestTokenData));
    });
}

module.exports = function(consumerKey, consumerSecret){
    return {
        consumerKey: consumerKey,
        consumerSecret: consumerSecret,
        getRequestTokenHeader: GetRequestToken,
        getAccessTokenHeader: GetAccessToken
    }
}