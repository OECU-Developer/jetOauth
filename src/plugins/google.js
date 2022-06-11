const oauth = require("../utill/provider");
const provider = "google";

function google(config, expire) {
    const apiURL = {
        auth: "https://accounts.google.com/o/oauth2/v2/auth",
        token: "https://accounts.google.com/o/oauth2/token",
        userInfo: "https://www.googleapis.com/oauth2/v1/userinfo",
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = google;
exports.provider = provider;
