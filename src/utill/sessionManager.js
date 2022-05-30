const session = new Map()

class sessionManager{
    constructor(sessionId){
        this.sessionId = sessionId
        if(session.has(sessionId)){
            this.session = session.get(sessionId)
        }else{
            this.session = new Map()
            session.set(sessionId, this.session)
        }
    }
    get(key){
        return this.session.get(key)
    }
    set(key, value){
        this.session.set(key, value)
    }
    delete(key){
        this.session.delete(key)
    }
    revoke(){
        session.delete(this.sessionId)
    }
}
exports = module.exports = sessionManager
exports.session = session