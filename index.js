const axios = require('axios');
const { type } = require('os');
fs = require('fs');
const readline = require('readline');
const { response, json } = require('express');
const { checkIfCached } = require('./cache')
const { insertCache } = require('./cache')



const maps = new Map()

async function getImgStatus(img) {
    return axios.get(img)
        .then(response => {
            return response.status
        })
        .catch(error => {
            return error.response.status
        });

}

async function processLineByLine() {
    const fileStream = fs.createReadStream('./dump/input-dump');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        const product = JSON.parse(line);


        if (maps.get(product['productId'])) {
            const newImg = product['image']
            const oldImg = maps.get(product['productId'])
            oldImg[oldImg.length] = newImg
            maps.set(product['productId'], oldImg)
        } else {
            const imgList = []
            imgList.push(product['image'])
            maps.set(product['productId'], imgList)
        }
    }
    output()
}

async function output() {
    maps.forEach(async (val, key) => {

        let finalimgs = []

        for (let img of val) {

            if (finalimgs.length == 3) {
                break
            }
            else if (finalimgs.includes(img)) { continue }
            else if (checkIfCached(img)) {
                finalimgs.push(img)
            }
            else {
                const status = await getImgStatus(img)
                if (status == 200) {
                    finalimgs.push(img)
                    insertCache(img)
                }
            }
        }

        const json_final = { 'productId': key, 'images': finalimgs }
        console.log(JSON.stringify(json_final))

    })
}

processLineByLine();
