(async () => {
  console.log(
    await (async () => {
      // This var would be an on-chain "public" var passed to the redeem function as a JSON object.
      // ie: agreement.redeem('{"matchid":"9126433122765225854"}', '')
      const matchid = '9126433122765225854'
    
      // This contract pays the redeemer for winning a Call of Duty Warzone match that occurred within the defined time window.
      // The redeemer must provide a match id where they or their team won first place upon redemption using the matchid variable.
      // More is paid dending on the type of match won.  solo = full prize, duos = half prize, trios = one-third prize & quads = one fouth-prize

      // AGREEMENT CODE STARTS HERE
      const USER = "Ciaran"
      const START = '0000000000'
      const END =   '1958300000'
      const MAX_REWARD = BigInt('1000')

      const axios = require('axios')
      const result = await axios.get(`https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${matchid}/it`)
      const players = result.data.data.allPlayers
    
      for (const player of players) {
        if (player.player.username == USER) {
          if (player.utcStartSeconds < START || player.utcStartSeconds > END)
            throw Error('Invalid start time')
          if (player.privateMatch)
            throw Error('Private match not allowed')
          if (player.playerStats.teamPlacement != 1)
            throw Error('Did not win')
          let reward = MAX_REWARD
          if (player.mode.includes('duos'))
            reward = reward / BigInt(2)
          if (player.mode.includes('trios'))
            reward = reward / BigInt(3)
          if (player.mode.includes('quads'))
            reward = reward / BigInt(4)
          return BigInt(reward)
        }
      }
      throw Error('Player not found')
    // AGREEMENT CODE ENDS HERE
    })()
  )
})()
