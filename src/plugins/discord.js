const sessionManager = require("../utill/sessionManager");
const { URLSearchParams } = require("url");
const { v4: uuid } = require("uuid");
const fetch = require("node-fetch");
const provider = "discord";

function discord(config, expire) {
    const { client_id, client_secret, scope } = config;

    const params = new URLSearchParams({
        response_type: "code",
        client_id,
        scope: scope.join(" "),
        prompt: "consent",
    });

    return {
        login: async function (req, res) {
            const sessionID = uuid();
            const session = new sessionManager(sessionID, expire);
            res.cookie("jetoauth", sessionID, {
                signed: true,
                httpOnly: true,
                expire: new Date(
                    Date.now() + (expire || 1000 * 60 * 60 * 24 * 7)
                ),
            });
            const state = uuid();
            session.set("state", state);
            const redirect_uri = `${req.protocol}://${req.headers.host}/jetoauth/callback/${provider}`;
            params.append("redirect_uri", redirect_uri);
            params.append("state", state);
            return res.redirect(
                `https://discordapp.com/oauth2/authorize?${params.toString()}`
            );
        },
        callback: async function (req, res) {
            if (!req?.signedCookies?.jetoauth) return false;
            const session = new sessionManager(req.signedCookies.jetoauth);
            const state = session.get("state");
            if (state != req?.query?.state) return false;
            const code = req?.query?.code;
            if (!code) return false;
            const redirect_uri = `${req.protocol}://${req.headers.host}/jetoauth/callback/${provider}`;
            const params = new URLSearchParams({
                grant_type: "authorization_code",
                client_id,
                client_secret,
                code,
                redirect_uri,
            });
            const response = await fetch(
                "https://discordapp.com/api/oauth2/token",
                {
                    method: "POST",
                    body: params,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            if (response.status != 200) return false;
            const { access_token, refresh_token, expires_in } =
                await response.json();
            session.set("access_token", access_token);
            session.set("refresh_token", refresh_token);
            session.set("token_expire", Date.now() + expires_in * 1000);
            session.delete("state");

            const userInfoResponse = await fetch(
                "https://discordapp.com/api/users/@me",
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (userInfoResponse.status != 200) return false;
            const userInfo = await userInfoResponse.json();
            for (const key in userInfo) {
                session.set(key, userInfo[key]);
            }
            return true;
        },
    };
}
exports = module.exports = discord;
exports.provider = provider;
