const axios = require('axios')
const goFundMe = await axios.get('https://www.gofundme.com/f/save-the-environment-fund')

const donationsUSD = BigInt(parseInt( // Extract current donation amount from div
  (/\"m-progress-meter-heading">(.*?)\</).exec(goFundMe.data)[1]
    .replace(/[\D]/g, '') // Strip all non-numeric values
))
const maticPriceInMill = BigInt(
  Math.floor((await
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
  ).data['matic-network'].usd * 1000
))

return (donationsUSD * BigInt(1000)) / maticPriceInMill