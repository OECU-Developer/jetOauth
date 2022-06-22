<div align="center">
    <h1>jetOauth</h1>
    <img src="https://user-images.githubusercontent.com/33394165/173181473-d73c8e98-2794-4061-8291-04d495a219f9.png" width="200" height="200">
    <br>
    <br>
    <p>Easy implementation of OAuth2.0 login for express.</p>
    <br>
</div>

## Support Providers

| Service | Developer Link | Document URL |
| --- | --- | --- |
| ![GoogleIcon](http://www.google.com/s2/favicons?domain=google.com) [Google](https://google.com/) | [Google Cloud Console](https://console.cloud.google.com/) | [Google OAuth2.0 Document](https://developers.google.com/identity/protocols/oauth2/) |
| ![FacebookIcon](http://www.google.com/s2/favicons?domain=facebook.com) [Facebook](https:/facebook.com/) | [Facebook Developers](https://developers.facebook.com/) | [Facebook API Document](https://developers.facebook.com/docs/)
| ![TwitterIcon](http://www.google.com/s2/favicons?domain=twitter.com) [Twitter](https://twitter.com/) | [Twitter Developer](https://developer.twitter.com/) | [Twitter API Document](https://developer.twitter.com/en/docs/twitter-api) |
| ![MicrosoftIcon](http://www.google.com/s2/favicons?domain=microsoft.com) [Microsoft](https://microsoft.com/) | [Azure](https://portal.azure.com/) | [Microsoft OAuth2.0 Document](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow) |
| ![YahooJapanIcon](http://www.google.com/s2/favicons?domain=yahoo.co.jp) [YahooJapan](https://yahoo.co.jp/) | [Yahooデベロッパーネットワーク](https://developer.yahoo.co.jp/) | [YahooJapan API Document](https://developer.yahoo.co.jp/sitemap/) |
| ![PayPalIcon](http://www.google.com/s2/favicons?domain=paypal.com) [PayPal](https://paypal.com/) | [PayPal Developer](https://developer.paypal.com/) | [PayPal Auth document](https://developer.paypal.com/api/rest/authentication/) |
| ![GitHubIcon](http://www.google.com/s2/favicons?domain=github.com) [GitHub](https://github.com/) | [GitHub Apps](https://github.com/settings/apps) | [GitHub API Document](https://docs.github.com/en/developers/apps/building-oauth-apps) |
| ![LINEIcon](http://www.google.com/s2/favicons?domain=line.me) [LINE](https://line.me) | [LINE Developer](https://developers.line.biz/) | [LINE API Document](https://developers.line.biz/en/reference/line-login/) |
| ![DiscordIcon](http://www.google.com/s2/favicons?domain=discord.com) [Discord](https://discord.com/) | [Discord Developer](https://discord.com/developers/) | [Discord API Document](https://discord.com/developers/docs/topics/oauth2) |
| ![RedditIcon](http://www.google.com/s2/favicons?domain=reddit.com) [Reddit](https://www.reddit.com/) | [Reddit developer application](https://www.reddit.com/prefs/apps/) | [Reddit API Document](https://www.reddit.com/dev/api/) |
| ![ImgurIcon](http://www.google.com/s2/favicons?domain=imgur.com) [Imgur](https://imgur.com/) | [Imgur API](https://api.imgur.com/) | [Imgur OAuth Document](https://apidocs.imgur.com/#authorization-and-oauth) |

## Requirements

[express](https://github.com/expressjs/express) [express-cookie](https://www.npmjs.com/package/express-cookie)

## Installation

### Install via npm

```shell
npm install jetoauth
```

### Install via yarn

```shell
yarn add jetoauth
```

### Install via pnpm

```shell
pnpm add jetoauth
```

## Example Usage

```javascript
const express = require("express");
const jetOauth = require("jetoauth");
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
```

### Login URL
```
https://{your domain}/jetoauth/login/{provider}
```

### Callback URL
```
https://{your domain}/jetoauth/callback/{provider}
```

## Contributers

<img src="https://github.com/Tonoyama.png" alt="Tonoyama" width="18px" style="border-radius:50%"> [Tonoyama](https://github.com/Tonoyama)

<img src="https://github.com/tsubasa652.png" alt="tsubasa652" width="18px" style="border-radius:50%"> [tsubasa652](https://github.com/tsubasa652)

<img src="https://github.com/terusibata.png" alt="terusibata" width="18px" style="border-radius:50%"> [terusibata](https://github.com/terusibata)

<img src="https://github.com/kamitani2001.png" alt="kamitani2001" width="18px" style="border-radius:50%"> [kamitani2001](https://github.com/kamitani2001)

<img src="https://github.com/noli-noli.png" alt="noli-noli" width="18px" style="border-radius:50%"> [noli-noli](https://github.com/noli-noli)

## **LICENSE**

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
