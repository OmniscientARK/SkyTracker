const axios = require("axios")
const { profile } = require("console")
const fs = require("fs")
const keyManager = require("./keyManager")

class DataManager{
    constructor(path){
        this.dir = `${__dirname}\\${path}`
        this.uuidSheet = `${this.dir}\\uuids.json`
        if(!fs.existsSync(`${this.dir}`)) fs.mkdirSync(`${this.dir}`, {recursive: true})
        if(!fs.existsSync(this.uuidSheet)) fs.writeFileSync(this.uuidSheet, JSON.stringify({}))
        console.log("DataManager initialized.")
    }

    setUUID(player, uuid){
        let file = fs.readFileSync(this.uuidSheet)
        let uuids = JSON.parse(file)
        uuids[player.toLowerCase()] = uuid
        fs.writeFileSync(this.uuidSheet, JSON.stringify(uuids))
    }

    async getUUID(player){
        let file = fs.readFileSync(this.uuidSheet)
        let uuids = JSON.parse(file)
        if(Object.keys(uuids).includes(player.toLowerCase())) return uuids[player.toLowerCase()]
        let res
        try{ res = await get(`https://api.hypixel.net/player?key=${keyManager.getGoodKey()}&name=${player}`) }catch(e){ res = e.response}
        if(!res.data.success || res.status !== 200 || res.data.player == null) return null
        this.setUUID(res.data.player.displayname, res.data.player.uuid)
        return res.data.player.uuid
    }

    writeFile(uuid, file, content){
        if(!fs.existsSync(`${this.dir}\\${uuid}`)) fs.mkdirSync(`${this.dir}\\${uuid}`, {recursive: true})
        fs.writeFileSync(`${this.dir}\\${uuid}\\${file}.json`, JSON.stringify(content, null, "\t"))
    }

    readFile(uuid, file){
        if(!fs.existsSync(`${this.dir}\\${uuid}\\${file}.json`)) return null
        return JSON.parse(fs.readFileSync(`${this.dir}\\${uuid}\\${file}.json`))
    }

    async getData(uuid, profileName){
        if(uuid == null) return null
        await this.queryAPI(uuid)
        let player = this.readFile(uuid, "player")
        if(player == null) return null
        if(player.skyblock.profiles.length === 0) return null
        if(profileName == null || profileName == undefined) profileName = player.skyblock.profiles[0].name
        let currentProfile = player.skyblock.profiles.find(profile => profile.name.toLowerCase() === profileName.toLowerCase()) 
        if(!currentProfile) currentProfile = player.skyblock.profiles[0]
        return {
            player: player,
            profile: currentProfile //replace currentProfile with profile data (still need to query from API)
        }
    }

    async queryAPI(uuid){
        let player = this.readFile(uuid, "player")
        if(this.readFile(uuid, "player") == null || Date.now()-player._query > 120000){
            let res = await get(`https://api.hypixel.net/player?key=${keyManager.getGoodKey()}&uuid=${uuid}`)
            if(res.status !== 200 || !res.data.success || res.data.player == null) return
            res = res.data.player
            if(!res.stats.SkyBlock) return
            let rankType = res.prefix ? res.prefix.replace(/§[a-fA-F0-9]|\[|\]/g, "")
                           : res.rank && res.rank !== "NORMAL" ? (res.rank === "YOUTUBER" ? "YOUTUBE" : res.rank)
                           : res.monthlyPackageRank && res.monthlyPackageRank !== "NONE" ? "MVP++"
                           : res.newPackageRank ? res.newPackageRank.replace("_PLUS", "+")
                           : res.packageRank ? res.packageRank.replace("_PLUS", "+")
                           : null
            let rankColor = res.prefix ? res.prefix.match(/§[a-fA-F0-9]/g)[0] 
                            : res.rank ? {YOUTUBER: "§c", ADMIN: "§c", MOD: "§2", HELPER: "§9"}[res.rank]
                            : rankType !== null ? {VIP: "§a", "VIP+": "§a", MVP: "§b", "MVP+": "§b", "MVP++": "§6"}[rankType]
                            : null
            let rankPlusColor = rankType === "PIG+++" ? "§b"
                                : res.rankPlusColor ? `§${{BLACK: "0", DARK_BLUE: "1", DARK_GREEN: "2", DARK_AQUA: "3", DARK_RED: "4", DARK_PURPLE: "5", GOLD: "6", GRAY: "7", DARK_GRAY: "8", BLUE: "9", GREEN: "a", AQUA: "b", RED: "c", LIGHT_PURPLE: "d", YELLOW: "e", WHITE: "f"}[res.rankPlusColor]}`
                                : rankType === "VIP+" ? "§6"
                                : rankType === "MVP+" || rankType === "MVP++" ? "§c"
                                : null
            let profiles = Object.entries(res.stats.SkyBlock.profiles).map(pair => {
                return {
                    id: pair[1].profile_id,
                    name: pair[1].cute_name
                }
            })
            player = {
                name: res.displayname,
                uuid: res.uuid,
                connection: {
                    lastLogin: res.lastLogin,
                    lastLogout: res.lastLogout
                },
                rank: {
                    type: rankType,
                    color: rankColor,
                    plusColor: rankPlusColor
                },
                skyblock: {
                    profiles: profiles
                },
                _query: Date.now() 
            }
            this.writeFile(uuid, "player", player)
        }
    }
}

async function get(url){
    return await axios.get(url)
}

const dataManager = new DataManager("playerData")

module.exports = dataManager