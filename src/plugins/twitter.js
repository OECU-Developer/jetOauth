const sessionManager = require("../utill/sessionManager");
const { URLSearchParams } = require("url");
const { v4: uuid } = require("uuid");
const fetch = require("node-fetch");
const {Buffer} = require("buffer");
const oauth = require("../utill/provider");
const provider = "twitter";

class Twitter extends oauth {
    constructor(config, expire, provider, apiURL) {
        super(config, expire, provider, apiURL);
    }
    login (req, res){
        const params = new URLSearchParams({
            response_type: "code",
            client_id: this.client_id,
            scope: this.scope.join(" "),
        });

        const sessionID = uuid();
        const session = new sessionManager(sessionID, this.expire);
        res.cookie("jetoauth", sessionID, {
            signed: true,
            httpOnly: true,
            expire: new Date(
                Date.now() + (this.expire || 1000 * 60 * 60 * 24 * 7)
            ),
        });
        const state = uuid();
        session.set("state", state);
        const redirect_uri = `${req.protocol}://${req.headers.host}/jetoauth/callback/${this.provider}`;
        params.append("redirect_uri", redirect_uri);
        params.append("state", state);
        params.append("code_challenge", state)
        params.append("code_challenge_method", "plain")
        return res.redirect(`${this.apiURL.auth}?${params.toString()}`);
    }
    async callback(req, res) {
        //reqのsignedCookiesの中に「jetoauth」がなかったらfalseを返す。
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
            code_verifier: state,
        });
        const response = await fetch(this.apiURL.token, {
            method: "POST",
            body: params,
            headers: {
                "Authorization": "Basic " + new Buffer.from(`${this.client_id}:${this.client_secret}`).toString("base64"),
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

function twitter(config, expire) {
    const apiURL = {
        auth: "https://twitter.com/i/oauth2/authorize",
        token: "https://api.twitter.com/2/oauth2/token",
        userInfo: "https://api.twitter.com/2/users/me",
    };
    return new Twitter(config, expire, provider, apiURL);
}
exports = module.exports = twitter;
exports.provider = provider;
