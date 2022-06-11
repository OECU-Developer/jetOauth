const oauth = require("../utill/provider");
const provider = "line";

function line(config, expire) {
    const apiURL = {
        auth: "https://access.line.me/oauth2/v2.1/authorize",
        token: "https://api.line.me/oauth2/v2.1/token",
        userInfo: "https://api.line.me/v2/profile",
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = line;
exports.provider = provider;
