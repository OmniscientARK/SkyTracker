const axios = require("axios")
const keyManager = require("./keyManager")
const dataManager = require("./dataManager")


let routes = [
    {
        path: "/",
        get(req, res) {
            res.renderVue("index.vue", {title: "SkyTracker"})
        }
    },
    {
        path: ["/stats/:player", "/stats/:player/:profile"],
        async get(req, res){
            let uuid = await dataManager.getUUID(req.params.player)
            if(uuid == null) return res.renderVue("index.vue", {error: "The specified user wasn't found."})
            let data = await dataManager.getData(uuid, req.params.profile)
            if(data == null) return res.renderVue("index.vue", {error: "Error on user request."})
            res.renderVue("stats.vue", data)
        }

    }
]

let notFound = {
    path: "*",
    get(req, res){
        res.renderVue("404.vue")
    }
}

module.exports = {
    routes,
    notFound
}