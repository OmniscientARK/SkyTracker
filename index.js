const express = require("express")
const expressVue = require("express-vue")
const path = require("path")
const router = require("./router")
const keyManager = require("./keyManager")
const dataManager = require("./dataManager")

process.env.VUE_DEV = (process.argv.length >= 2 && process.argv[2] === "true")
console.log(`VUE_DEV set to ${process.env.VUE_DEV}.`)

const app =  express()
const port = process.env.PORT || 80

app.use(express.static(path.join(__dirname, "public")))

expressVue.use(app, {
    pagesPath: path.join(__dirname, "views"),
    head: {
        title: "SkyTracker",
        metas: [],
        scripts: [
            {src: "/js/blur.js"}
        ],
        styles: [
            {style: "/assets/style.css", type: "text/css"}
        ]
    }
}).then(() => {
    keyManager.registerKey("6fa57052-b629-4257-a2b8-3bf7e423e1e6")
    router.routes.forEach(route => {
        if(Object.keys(route).includes("get")) app.get(route.path, (req, res) => route.get(req, res))
        if(Object.keys(route).includes("post")) app.get(route.path, (req, res) => route.post(req, res))
    });
    app.get(router.notFound.path, (req, res) => router.notFound.get(req, res))
})

app.listen(port, () => {
    console.log(`Listening @ http://localhost:${port}`)
})