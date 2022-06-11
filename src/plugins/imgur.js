const oauth = require("../utill/provider");
const provider = "imgur";

function imgur(config, expire) {
    const apiURL = {
        auth: "https://api.imgur.com/oauth2/authorize",
        token: "https://api.imgur.com/oauth2/token",
        userInfo: "https://api.imgur.com/3/account/me/block",
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = imgur;
exports.provider = provider;
