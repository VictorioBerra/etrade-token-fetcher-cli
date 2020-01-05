const crypto = require('crypto');

function AccessTokenSigner(consumerSecret, requestTokenSecret){
    var secret = encodeURIComponent(consumerSecret) + "&" + encodeURIComponent(requestTokenSecret);
    return function(base_string){
        return crypto
            .createHmac('sha1', secret)
            .update(base_string)
            .digest('base64');
    }
}

function RequestTokenSigner(base_string, key) {
    return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
}

module.exports = {
    accessTokenSigner: AccessTokenSigner,
    requestTokenSigner: RequestTokenSigner
}