class KeyManager{
    constructor(){
        this.availableKeys = {}
    }

    registerKey(key){
        this.availableKeys[key] = 0
    }

    getGoodKey(){
        let currentKey = null
        Object.keys(this.availableKeys).forEach(key => {
            if(currentKey == null || this.availableKeys[key] < this.availableKeys[currentKey]) currentKey = key
        })
        if(this.availableKeys[currentKey] >= 120) return null
        this.availableKeys[currentKey] = this.availableKeys[currentKey]+1
        setTimeout(() => this.availableKeys[currentKey] = this.availableKeys[currentKey]-1, 60000)
        return currentKey
    }
}

const keyManager = new KeyManager()

module.exports = keyManager