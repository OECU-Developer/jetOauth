const oauth = require("../utill/provider");
const provider = "yahoojapan";

function yahoo(config, expire) {
    const apiURL = {
        auth: "https://auth.login.yahoo.co.jp/yconnect/v2/authorization",
        token: "https://auth.login.yahoo.co.jp/yconnect/v2/token",
        userInfo: "https://userinfo.yahooapis.jp/yconnect/v2/attribute",
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = yahoo;
exports.provider = provider;
