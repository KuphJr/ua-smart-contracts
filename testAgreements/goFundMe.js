(async () => {
  console.log(
    await (async () => {
      const MATCH_FACTOR = 0.75

      const axios = require('axios')
      const goFundMe = await axios.get('https://www.gofundme.com/f/save-the-environment-fund')
      
      const donationsUSD = parseInt(
        (/\"m-progress-meter-heading">(.*?)\</).exec(goFundMe.data)[1] // Extract current donation amount from div
          .replace(/[\\D]/g, '') // Strip all non-numeric values
      )
      // TODO: get prices from 3 different data providers and then return median price
      const linkPrice = BigInt(
        (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=chainlink&vs_currencies=usd')
        ).data.chainlink.usd
      )
      
      const totalMatchUSD = donationsUSD * MATCH_FACTOR
      return BigInt(totalMatchUSD) * linkPrice * BigInt('1000000000000000000')
    })()
  )
})()
