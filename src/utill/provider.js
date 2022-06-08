const sessionManager = require("../utill/sessionManager")
const {URLSearchParams} = require("url")
const {v4: uuid} = require("uuid")
const fetch = require("node-fetch")

class provider{
    constructor(config, expire, provider, apiURL){
        const {client_id, client_secret, scope} = config
        this.client_id = client_id
        this.client_secret = client_secret
        this.scope = scope

        this.expire = expire
        this.provider = provider
        this.apiURL = apiURL //オフジェクト型
    }

    async login(req, res){
        params = new URLSearchParams({
            response_type: "code",
            client_id:this.client_id,
            scope: scope.join(" ")
        })
        
        const sessionID = uuid()
        const session = new sessionManager(sessionID, this.expire)
        res.cookie("jetoauth", sessionID, {
            signed: true,
            httpOnly: true,
            expire: new Date(Date.now() + (this.expire || 1000 * 60 * 60 * 24 * 7))
        })
        const state = uuid()
        session.set("state", state)
        const redirect_uri = `${req.protocol}://${req.headers.host}/jetoauth/callback/${this.provider}`
        params.append("redirect_uri", redirect_uri)
        params.append("state", state)
        return res.redirect(`${this.apiURL.auth}?${params.toString()}`)
    }
}