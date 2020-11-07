const NodeCache = require("node-cache");

const myCache = new NodeCache();

module.exports = {
    insertCache: function insertCache(img) {
        myCache.set(img, img)
    },
    checkIfCached: function checkIfCached(id) {
        return myCache.has(id)
    }
}

