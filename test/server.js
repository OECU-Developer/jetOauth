const express = require("express");
const jetOauth = require("../index");
const cookieParser = require("cookie-parser");
const { v4: uuid } = require("uuid");
const code = uuid();
const token = uuid();
const client_id = uuid();
const client_secret = uuid();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("jetOauth"));
app.use(
    jetOauth({
        providers: {
            test: {
                client_id,
                client_secret,
                scope: ["identify"],
            },
        },
    })
);

app.get("/info", (req, res) => {
    if (!req.jetOauth.isLogin) {
        res.send();
    } else {
        const obj = {};
        req.jetOauth.session.forEach((value, key) => {
            obj[key] = value;
        });
        res.json(obj);
    }
});

app.get("/login", (req, res) => {
    try {
        const query = req.query;
        if (
            query?.response_type != "code" ||
            query?.client_id != client_id ||
            !query?.scope ||
            query?.redirect_uri !=
                "http://localhost:3000/jetoauth/callback/test" ||
            !query?.state
        ) {
            throw new Error("invalid query");
        }
        res.redirect(`${query.redirect_uri}?code=${code}&state=${query.state}`);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post("/token", (req, res) => {
    try {
        const params = req.body;
        if (
            params?.grant_type != "authorization_code" ||
            params?.client_id != client_id ||
            params?.client_secret != client_secret ||
            params?.code != code ||
            params?.redirect_uri !=
                "http://localhost:3000/jetoauth/callback/test" ||
            req?.headers["content-type"] != "application/x-www-form-urlencoded"
        ) {
            throw new Error("invalid params");
        }
        res.json({
            access_token: token,
            refresh_token: token,
            expires_in: 3600,
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get("/user", (req, res) => {
    try {
        if (req.headers?.authorization != `Bearer ${token}`) {
            throw new Error("invalid headers");
        }
        res.json({
            id: "123",
            username: "jetOauth User",
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

exports = module.exports = app;
