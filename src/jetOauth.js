const sessionManager = require("./utill/sessionManager")
const fs = require("fs")
const path = require("path")

exports = module.exports = jetOauth

function jetOauth(config = {}){

    if(typeof(config?.providers) !== "object") {
        throw new Error("No providers found")
    }else if(Object.keys(config.providers).length === 0) {
        throw new Error("No providers found")
    }

    const pluginsDir = config?.pluginsDir || path.join(__dirname, "plugins")
    const pluginFiles = fs.readdirSync(pluginsDir).filter(plugin => /\.js$/.test(plugin))

    const plugins = {}

    for(let pluginFile of pluginFiles){
        const plugin = require(path.join(pluginsDir, pluginFile))
        if(config.providers[plugin.provider]){
            plugins[plugin.provider] = plugin(config.providers[plugin.provider])
        }
    }

    return function (req, res, next){
        if(req.methods == "OPTIONS"){
            return next()
        }
    }
}

exports.sessionManager = sessionManager
exports.session = sessionManager.session