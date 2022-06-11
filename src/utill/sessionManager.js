const session = new Map();

class sessionManager {
    constructor(sessionId, expire) {
        this.sessionId = sessionId;
        if (session.has(sessionId)) {
            this.session = session.get(sessionId);
        } else {
            this.session = new Map();
            session.set(sessionId, this.session);
        }
        this.set("expire", Date.now() + (expire || 1000 * 60 * 60 * 24 * 7));
    }
    get(key) {
        return this.session.get(key);
    }
    set(key, value) {
        this.session.set(key, value);
    }
    has(key) {
        return this.session.has(key);
    }
    delete(key) {
        this.session.delete(key);
    }
    forEach(callback) {
        this.session.forEach(callback);
    }
    revoke() {
        session.delete(this.sessionId);
    }
}
exports = module.exports = sessionManager;
exports.session = session;
