const express = require("express");
const jetOauth = require("../index");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser("jetOauth"));
app.use(
    jetOauth({
        providers: {
            discord: {
                client_id: process.env.discord_client_id,
                client_secret: process.env.discord_client_secret,
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
    req.jetOauth.login("discord");
});

app.get("/jetoauth/success", (req, res) => {
    res.send("login success");
});

app.get("/jetoauth/fail", (req, res) => {
    res.send("failed to login");
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
