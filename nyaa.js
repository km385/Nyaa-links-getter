const fs = require('node:fs');
const fetch = require('node-fetch');
async function getHTML(url) {
    try {
        const res = await fetch(url, {
            method: "GET"
        })
        
        const response = await res.text()
        return response
    } catch (error) {
        return { error: `Error fetching HTML: ${error.message}` };
    }
    
}

function getLinks(html) {
    if(html.error) {
        console.error(html.error)
        return
    }

    const cheerio = require("cheerio")
    fs.writeFileSync('links.txt', '');

    const $ = cheerio.load(html)
    
    $('.torrent-list tbody tr').each((index, element) => {
        
        const columns = $(element).find('td');

        const link = $(columns[2]).children("a").next().attr("href") + "\r\n";
        
        try {
            fs.appendFileSync('links.txt', link);
        } catch (err) {
            console.error(err);
        }

    });
}

async function start() {
    const arg = process.argv[2]
    if(arg === undefined) {
        console.error('no url provided')
        return
    }

    const html = await getHTML(arg)
    getLinks(html)
}

start()
