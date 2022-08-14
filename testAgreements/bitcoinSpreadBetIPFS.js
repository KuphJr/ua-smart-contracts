const axios = require('axios')

const referencePrice = BigInt(24000)
const weiMultiplier = BigInt('1000000000000000000')

const coingeckoUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
const coinpaprikaUrl = 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin'
const messariUrl = 'https://data.messari.io/api/v1/assets/btc/metrics'

const prices = []
const queries = [
  axios.get(coingeckoUrl).then((res) => prices.push(res.data.bitcoin.usd)).catch(),
  axios.get(coinpaprikaUrl).then((res) => prices.push(res.data.quotes.USD.price)).catch(),
  axios.get(messariUrl).then((res) => prices.push(res.data.data.market_data.price_usd)).catch()
]
await Promise.all(queries)
console.log(prices)
const priceSum = prices.reduce((sum, a) => sum + a, 0)
const meanPrice = BigInt(Math.round(priceSum / prices.length))
let priceChange = meanPrice - referencePrice
priceChange = priceChange > BigInt(0) ? priceChange : BigInt(0)

return priceChange * weiMultiplier