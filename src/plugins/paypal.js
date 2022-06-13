const oauth = require("../utill/provider");
const sessionManager = require("../utill/sessionManager");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const provider = "paypal";

class Paypal extends oauth {
    constructor(...args) {
        super(...args);
    }
    async callback(req, res) {
        if (!req?.signedCookies?.jetoauth) return false;
        const session = new sessionManager(req.signedCookies.jetoauth);
        const state = session.get("state");
        if (state != req?.query?.state) return false;
        const code = req?.query?.code;
        if (!code) return false;
        const params = new URLSearchParams({
            grant_type: "authorization_code",
            code,
        });
        const response = await fetch(this.apiURL.token, {
            method: "POST",
            body: params,
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${this.client_id}:${this.client_secret}`
                ).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (response.status != 200) return false;
        const { access_token, refresh_token, expires_in } =
            await response.json();
        session.set("access_token", access_token);
        session.set("refresh_token", refresh_token);
        session.set("token_expire", Date.now() + expires_in * 1000);
        session.delete("state");

        const userInfoResponse = await fetch(this.apiURL.userInfo, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (userInfoResponse.status != 200) return false;
        const userInfo = await userInfoResponse.json();
        for (const key in userInfo) {
            session.set(key, userInfo[key]);
        }
        return true;
    }
}

function paypal(config, expire) {
    let apiURL
    if(config.sandbox){
        apiURL = {
            auth: "https://www.sandbox.paypal.com/connect",
            token: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            userInfo: "https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo",
        };
    }else{
        apiURL = {
            auth: "https://www.paypal.com/connect",
            token: "https://api-m.paypal.com/v1/oauth2/token",
            userInfo: "https://api-m.paypal.com/v1/identity/oauth2/userinfo",
        };
    }
    
    return new Paypal(config, expire, provider, apiURL);
}
exports = module.exports = paypal;
exports.provider = provider;
