const axios = require("axios")
const path = require("path")
const fs = require("fs")
const nbt = require("prismarine-nbt")
const keyManager = require("./keyManager")
const { gzip } = require("zlib")

class DataManager{
    constructor(dataPath){
        this.dir = path.join(__dirname, dataPath)
        this.uuidSheet = `${this.dir}\\uuids.json`
        this.nameSheet = `${this.dir}\\names.json`
        if(!fs.existsSync(`${this.dir}`)) fs.mkdirSync(`${this.dir}`, {recursive: true})
        if(!fs.existsSync(this.uuidSheet)) fs.writeFileSync(this.uuidSheet, JSON.stringify({}))
        if(!fs.existsSync(this.nameSheet)) fs.writeFileSync(this.nameSheet, JSON.stringify({}))
        console.log(`DataManager initialized @ ${this.dir}.`)
    }

    setUUID(player, uuid){
        let file = fs.readFileSync(this.uuidSheet)
        let uuids = JSON.parse(file)
        uuids[player.toLowerCase()] = uuid
        fs.writeFileSync(this.uuidSheet, JSON.stringify(uuids, null, "\t"))
        file = fs.readFileSync(this.nameSheet)
        let names = JSON.parse(file)
        names[uuid] = player
        fs.writeFileSync(this.nameSheet, JSON.stringify(names, null, "\t"))
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

    async getName(uuid){
        let file = fs.readFileSync(this.nameSheet)
        let names = JSON.parse(file)
        if(!names[uuid]){
            let res
            try{ res = await get(`https://api.hypixel.net/player?key=${keyManager.getGoodKey()}&uuid=${uuid}`) }catch(e){ res = e.response}
            if(!res.data.success || res.status !== 200 || res.data.player == null) return null
            this.setUUID(res.data.player.displayname, res.data.player.uuid);
            return res.data.player.displayname
        }
        return names[uuid]
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
        await this.queryAPI(uuid, profileName)
        let player = this.readFile(uuid, "player")
        if(!player) return null
        if(player.skyblock.profiles.length === 0) return null
        if(profileName == null || profileName == undefined) profileName = player.skyblock.profiles[0].name
        let profileData = player.skyblock.profiles.find(profile => profile.name.toLowerCase() === profileName.toLowerCase()) 
        if(!profileData) profileData = player.skyblock.profiles[0]
        let profile = this.readFile(uuid, profileData.id)
        if(!profile) return null
        return {
            player: player,
            profile: profile
        }
    }

    async queryAPI(uuid, profileName){
        let player = this.readFile(uuid, "player")
        if(player == null || Date.now()-player._query > 120000){
            let res = await get(`https://api.hypixel.net/player?key=${keyManager.getGoodKey()}&uuid=${uuid}`)
            if(res.status !== 200 || !res.data.success || !res.data.player) return
            res = res.data.player
            if(!res.stats.SkyBlock) return
            let rankType = res.prefix ? res.prefix.replace(/§[a-fA-F0-9]|\[|\]/g, "") : res.rank && res.rank !== "NORMAL" ? (res.rank === "YOUTUBER" ? "YOUTUBE" : res.rank) : res.monthlyPackageRank && res.monthlyPackageRank !== "NONE" ? "MVP++" : res.newPackageRank ? res.newPackageRank.replace("_PLUS", "+") : res.packageRank ? res.packageRank.replace("_PLUS", "+") : null
            player = {
                name: res.displayname,
                uuid: res.uuid,
                connection: {
                    lastLogin: res.lastLogin,
                    lastLogout: res.lastLogout
                },
                rank: {
                    type: rankType,
                    color: res.prefix ? res.prefix.match(/§[a-fA-F0-9]/g)[0] : res.rank ? {YOUTUBER: "§c", ADMIN: "§c", MOD: "§2", HELPER: "§9"}[res.rank] : rankType !== null ? {VIP: "§a", "VIP+": "§a", MVP: "§b", "MVP+": "§b", "MVP++": "§6"}[rankType] : null,
                    plusColor: rankType === "PIG+++" ? "§b" : res.rankPlusColor ? `§${{BLACK: "0", DARK_BLUE: "1", DARK_GREEN: "2", DARK_AQUA: "3", DARK_RED: "4", DARK_PURPLE: "5", GOLD: "6", GRAY: "7", DARK_GRAY: "8", BLUE: "9", GREEN: "a", AQUA: "b", RED: "c", LIGHT_PURPLE: "d", YELLOW: "e", WHITE: "f"}[res.rankPlusColor]}` : rankType === "VIP+" ? "§6" : rankType === "MVP+" || rankType === "MVP++" ? "§c" : null
                },
                skyblock: {
                    profiles: Object.entries(res.stats.SkyBlock.profiles).map(pair => {
                        return {
                            id: pair[1].profile_id,
                            name: pair[1].cute_name
                        }
                    })
                },
                _query: Date.now() 
            }
            this.writeFile(uuid, "player", player)
        }
        let profileData = profileName ? player.skyblock.profiles.find(profile => profile.name.toLowerCase() === profileName.toLowerCase()) : player.skyblock.profiles[0]
        if(!profileData) return
        let profile = this.readFile(uuid, profileData.id)
        if(profile == null || Date.now()-profile._query > 120000){
            let res = await get(`https://api.hypixel.net/skyblock/profile?key=${keyManager.getGoodKey()}&profile=${profileData.id}`)
            if(res.status !== 200 || !res.data.success || !res.data.profile) return
            res = res.data.profile
            let member = res.members[Object.keys(res.members).find(memberUUID => memberUUID === uuid)]
            if(!member) return
            let members = []
            for(let i = 0; i < Object.keys(res.members).length; i++){
                let memberUUID = Object.keys(res.members)[i]
                let memberRes = await get(`https://api.hypixel.net/player?key=${keyManager.getGoodKey()}&uuid=${memberUUID}`)
                if(memberRes.status !== 200 || !memberRes.data.success || !memberRes.data.player) continue
                memberRes = memberRes.data.player
                let memberProfile = memberRes.stats.SkyBlock.profiles[Object.keys(memberRes.stats.SkyBlock.profiles).find(profileID => profileID.toLowerCase() === profileData.id.toLowerCase())]
                if(!memberProfile) continue
                members.push({
                    name: memberRes.displayname,
                    uuid: memberUUID,
                    profile: {
                        id: memberProfile.profile_id,
                        name: memberProfile.cute_name
                    }
                })
            }
            profile = {
                id: res.profile_id,
                members: members,
                inventory: {
                    armor: (await parseNBT(member.inv_armor.data)).map(parsed => parseItemJSON(parsed))
                },
                _query: Date.now()
            }
            this.writeFile(uuid, profileData.id, profile)
        }
    }
}   

async function get(url){
    return await axios.get(url)
}

async function parseNBT(encoded){
    let buffer = Buffer.from(encoded, "base64")
    try{
        let parsed = await nbt.parse(buffer)
        return parsed.parsed.value.i.value.value
    }catch(e){
        console.log(e)
        return {}
    }
}

function parseItemJSON(item){
    let extra = item.tag.value.ExtraAttributes.value || undefined
    return {
        minecraftID: item.id.value,
        hypixelID: extra?.id.value || undefined,
        amount: item.Count.value,
        name: item.tag.value.display.value.Name.value, 
        lore: item.tag.value.display.value.Lore.value.value,
        color: extra.color || undefined,
        skull: item.tag.value.display.SkullOwner?.value.Properties.value.textures.value.Value.value || undefined,
        attributes: {
            rarity: item.tag.value.display.value.Lore.value.value.at(-1).split(" ")[0].replace(/§[0-9a-fk-orA-FK-OR]/g, ""),
            recombobulators: extra.rarity_upgrades?.value || 0,
            hotPotatoBooks: extra.hot_potato_count?.value || 0,
            reforge: extra.modifier?.value.toUpperCase() || null,
            gemstones: extra.gems ? Object.keys(extra.gems.value).filter(slot => !slot.endsWith("_gem")).map(slot => {
                return {
                    type: Object.keys(extra.gems.value).includes(`${slot}_gem`) ? extra.gems.value[`${slot}_gem`].value : slot.split("_")[0],
                    quality: extra.gems.value[slot].value
                }
            }) : [],
            dungeonStars: extra.dungeon_item_level?.value || 0,
            enchantments: extra.enchantments ? Object.keys(extra.enchantments.value).map(enchantment => {
                return {
                    enchantment: enchantment.toUpperCase(),
                    level: extra.enchantments.value[enchantment].value
                }
            }) : [],
            uuid: extra.uuid?.value || null,
            timestamp: extra.timestamp?.value || null
        }
    }
}

const dataManager = new DataManager("playerData")

module.exports = dataManager