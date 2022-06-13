const oauth = require("../utill/provider");
const provider = "microsoft";

function microsoft(config, expire) {
    const apiURL = {
        auth: `https://login.microsoftonline.com/${
            config?.tenant_id || "consumers"
        }/oauth2/v2.0/authorize`,
        token: `https://login.microsoftonline.com/${
            config?.tenant_id || "consumers"
        }/oauth2/v2.0/token`,
        userInfo: `https://graph.microsoft.com/oidc/userinfo`,
    };
    return new oauth(config, expire, provider, apiURL);
}
exports = module.exports = microsoft;
exports.provider = provider;
