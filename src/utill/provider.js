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
}