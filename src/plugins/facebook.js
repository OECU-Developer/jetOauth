const oauth = require("../utill/provider");
const sessionManager = require("../utill/sessionManager");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const provider = "facebook";

class Facebook extends oauth {
    constructor(config, expire, provider, apiURL) {
        super(config, expire, provider, apiURL);
    }

    async callback(req) {
        if (!req?.signedCookies?.jetoauth) return false;
        const session = new sessionManager(req.signedCookies.jetoauth);
        const state = session.get("state");
        if (state != req?.query?.state) return false;
        const code = req?.query?.code;
        if (!code) return false;
        const redirect_uri = `${req.protocol}://${req.headers.host}/jetoauth/callback/${this.provider}`;
        const params = new URLSearchParams({
            client_id: this.client_id,
            client_secret: this.client_secret,
            code,
            redirect_uri,
        });
        const response = await fetch(
            `${this.apiURL.token}?${params.toString()}`
        );
        if (response.status != 200) return false;
        const { access_token, token_type, expires_in } = await response.json();
        session.set("access_token", access_token);
        session.set("token_type", token_type);
        session.set("token_expire", Date.now() + expires_in * 1000);
        session.delete("state");

        const userInfoParams = new URLSearchParams({
            fields: "id,name,email",
            access_token,
        });

        const userInfoResponse = await fetch(
            `${this.apiURL.userInfo}?${userInfoParams.toString()}`
        );
        if (userInfoResponse.status != 200) return false;
        const userInfo = await userInfoResponse.json();
        for (const key in userInfo) {
            session.set(key, userInfo[key]);
        }
        return true;
    }
}

function facebook(config, expire) {
    const apiURL = {
        auth: "https://www.facebook.com/v14.0/dialog/oauth",
        token: "https://graph.facebook.com/v14.0/oauth/access_token",
        userInfo: "https://graph.facebook.com/me",
    };
    return new Facebook(config, expire, provider, apiURL);
}
exports = module.exports = facebook;
exports.provider = provider;
