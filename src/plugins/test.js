const oauth = require("../utill/provider");
const provider = "test";

function test(config, expire) {
    const apiURL = {
        auth: "http://localhost:3000/login",
        token: "http://localhost:3000/token",
        userInfo: "http://localhost:3000/user",
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = test;
exports.provider = provider;
