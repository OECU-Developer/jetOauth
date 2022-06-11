const oauth = require("../utill/provider");
const provider = "discord";

function discord(config, expire) {
    const apiURL = {
        auth: "https://discordapp.com/api/oauth2/authorize",
        token: "https://discordapp.com/api/oauth2/token",
        userInfo: "https://discordapp.com/api/users/@me",
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = discord;
exports.provider = provider;
