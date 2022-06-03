const sessionManager = require("./utill/sessionManager")
const cookie = require("cookie")
const cookieSignature = require("cookie-signature")
const fs = require("fs")
const path = require("path")

exports = module.exports = jetOauth

function logout(res, session){
    session.revoke()
    res?.clearCookie("jetoauth")
}

function jetOauth(config = {}){

    if(typeof(config?.providers) !== "object") {
        throw new Error("No providers found")
    }else if(Object.keys(config.providers).length === 0) {
        throw new Error("No providers found")
    }

    const expire = config.expire || 7 * 24 * 60 * 60 * 1000
    const pluginsDir = config?.pluginsDir || path.join(__dirname, "plugins")
    const pluginFiles = fs.readdirSync(pluginsDir).filter(plugin => /\.js$/.test(plugin))
    const plugins = {}

    for(let pluginFile of pluginFiles){
        const plugin = require(path.join(pluginsDir, pluginFile))
        if(config.providers[plugin.provider]){
            plugins[plugin.provider] = plugin(config.providers[plugin.provider], cookie, expire)
        }
    }

    return function (req, res, next){
        if(req.methods == "OPTIONS"){
            return next()
        }

        req.jetOauth = {
            isLogin: false
        }

        if(req?.signedCookies?.jetoauth){
            const session = new sessionManager(req.signedCookies.jetoauth)
            if(session.get("expire") <= Date.now()){
                req.jetOauth = {
                    ...req.jetOauth,
                    session,
                    isLogin: true,
                    logout: () => logout(res, session)
                }
            }
        }

        if(req.methods == "GET" && /^\/jetoauth\/(login|callback)\/(.+)$/.test(req.path)){
            const provider = replace(req.path, /^\/jetoauth\/(login|callback)\//, "")
            switch(true){
                case /^\/jetoauth\/login\/(.+)$/.test(req.path):
                    if(plugins[provider]){
                        plugins[provider].login(req, res)
                        return next(false)
                    }
                    break
                case /^\/jetoauth\/callback\/(.+)$/.test(req.path):
                    if(plugins[provider]){
                        if(plugins[provider].callback(req, res)){
                            res.redirect(config?.redirect?.success || "/jetOauth/success")
                            return next(false)
                        }else{
                            res.redirect(config?.redirect?.fail || "/jetOauth/fail")
                            return next(false)
                        }
                    }
                    break
            }
        }
        
        if(req.methods == "GET" && /^\/jetoauth\/logout$/.test(req.path) && req.jetOauth.isLogin){
            req.jetOauth.logout()
            res.redirect(config?.redirect?.logout || "/")
            return next(false)
        }

        if(!req.jetOauth.isLogin){
            req.jetOauth = {
                ...req.jetOauth,
                login: (provider) => plugins[provider].login(req, res)
            }
        }

        next()
    }
}

exports.sessionManager = sessionManager
exports.session = sessionManager.session