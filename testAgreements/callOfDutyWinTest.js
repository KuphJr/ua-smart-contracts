(async () => {
  console.log(
    await (async () => {
      // This var would be an on-chain "public" var passed to the redeem function as a JSON object.
      // ie: agreement.redeem('{"matchid":"9126433122765225854"}', '')
      const matchid = '16892472564830060865'

      // AGREEMENT CODE STARTS HERE
      const axios = require('axios')

      const USER = "Ciaran" // Player username
      const START = '0000000000' // Start time in seconds
      const MAX_REWARD = BigInt('20000000000000000000') // 20 MATIC reward
      
      const url = `https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${matchid}/it`
      const players = await axios.get(url).data.data.allPlayers
      
      for (const player of players) {
        if (player.player.username == USER && player.utcStartSeconds < START)
          return BigInt(MAX_REWARD)
      }
      throw Error('Player not found')
    // AGREEMENT CODE ENDS HERE
    })()
  )
})()
