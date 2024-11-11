const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

async function fetchToken(tokenName) {
    const response = await fetch(`https://api.rugcheck.xyz/v1/tokens/${tokenName}/report`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,az;q=0.8,ru;q=0.7,de;q=0.6",
            "authorization": "",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-wallet-address": "null"
        },
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET"
    })

    const json = await response.json()

    return json;
}

async function fetchTokenPrice(tokenName) {
    const response = await fetch(`https://data.fluxbeam.xyz/tokens/${tokenName}/price`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,az;q=0.8,ru;q=0.7,de;q=0.6",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET"
    })

    const tokenPrice = await response.json()

    return tokenPrice
}

function printTokenOverview(json, tokenPrice) {
    console.log('Token Overview');

    let tokenOverview = [{
        name: json.tokenMeta.name,
        mint: json.mint,
        creator: json.creator,
        supply: json.token.supply,
        tokenPrice: tokenPrice,
        marketCap: json.token.supply * tokenPrice,
        mintAuthority: json.mintAuthority
    }];

    console.table(tokenOverview);
}

function printRiskAnalysis(json) {
    console.log('Risk Analysis');
    console.table(json.risks);
}

function printMarkets(json) {
    const markets = [];

    json.markets.forEach(m => markets.push({
        marketType: m.marketType,
        liquidity: parseFloat(m.lp.lpLockedUSD).toFixed(2),
        lpLocked: parseFloat(m.lp.lpLockedPct).toFixed(2) + '%',
        lpMint: m.lp.lpMint === '11111111111111111111111111111111' ? '-' : m.lp.lpMint
    }));

    console.log('Markets');
    console.table(markets);
}

function printTopHolders(json) {
    const holders = [];

    json.topHolders.forEach(h => holders.push({
        account: h.owner,
        amount: h.amount,
        percentage: parseFloat(h.pct).toFixed(2) + '%',
        insider: h.insider
    }));

    console.log('Top Holders');
    console.table(holders);
}

async function execute(tokenName) {
    const tokenJson = await fetchToken(tokenName)
    const tokenPrice = await fetchTokenPrice(tokenName)

    printTokenOverview(tokenJson, tokenPrice)
    printRiskAnalysis(tokenJson)
    printMarkets(tokenJson)
    printTopHolders(tokenJson)
}

if (argv.token)
    execute(argv.token)
else
    console.log('Please set token')