const oauth = require("../utill/provider");
const sessionManager = require("../utill/sessionManager");
const { URLSearchParams } = require("url");
const fetch = require("node-fetch");
const provider = "github";

class Github extends oauth {
    constructor(config, expire, provider, apiURL) {
        super(config, expire, provider, apiURL);
    }

    async callback(req, res) {
        if (!req?.signedCookies?.jetoauth) return false;
        const session = new sessionManager(req.signedCookies.jetoauth);
        const state = session.get("state");
        if (state != req?.query?.state) return false;
        const code = req?.query?.code;
        if (!code) return false;
        const redirect_uri = `${req.protocol}://${req.headers.host}/jetoauth/callback/${this.provider}`;
        const params = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: this.client_id,
            client_secret: this.client_secret,
            code,
            redirect_uri,
        });
        const response = await fetch(this.apiURL.token, {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
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
                Authorization: `token ${access_token}`,
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

function github(config, expire) {
    const apiURL = {
        auth: "https://github.com/login/oauth/authorize",
        token: "https://github.com/login/oauth/access_token",
        userInfo: "https://api.github.com/user",
    };
    return new Github(config, expire, provider, apiURL);
}
exports = module.exports = github;
exports.provider = provider;
