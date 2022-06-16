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
            let uuid, data
            try{
                uuid = await dataManager.getUUID(req.params.player)
                if(uuid == null) return res.renderVue("index.vue", {error: "The specified user wasn't found."})
                data = await dataManager.getData(uuid, req.params.profile)
                if(data == null) return res.renderVue("index.vue", {error: "An error occurred."})
                res.renderVue("stats.vue", data)
            }catch(ex){
                console.log(ex)
                res.renderVue("index.vue", {error: "An error occurred."})
            }
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