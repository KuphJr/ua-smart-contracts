(async () => {
  console.log(
    await (async () => {
      // This var would be an on-chain "public" var passed to the redeem function as a JSON object (ie: agreement.redeem('{"MATCH_ID":"9126433122765225854"}', ''))
      const MATCH_ID = '9126433122765225854'
    
      // This contract pays the redeemer for winning a Call of Duty Warzone match that occurred within the defined time window.
      // The redeemer must provide a match id where they or their team won first place upon redemption using the MATCH_ID variable.
      // More is paid dending on the type of match won.  solo = full prize, duos = half prize, trios = one-third prize & quads = one fouth-prize

      // AGREEMENT CODE STARTS HERE
      const USERNAME = "Soloman Phoenix"
      const START_EPOCH_TIME = '1658280000'
      const END_EPOCH_TIME =   '1658300000'
      const SOLO_WIN_MAX_REWARD = 1000

      const axios = require('axios')
      const result = await axios.get(`https://www.callofduty.com/api/papi-client/crm/cod/v2/title/mw/platform/battle/fullMatch/wz/${MATCH_ID}/it`)
      const players = result.data.data.allPlayers
    
      for (const player of players) {
        if (player.player.username == USERNAME) {
          if (player.utcStartSeconds < START_EPOCH_TIME || player.utcStartSeconds > END_EPOCH_TIME)
            throw Error('Match started before or after the time set in the agreement terms')
          if (player.privateMatch)
            throw Error('Private match not allowed')
          if (player.playerStats.teamPlacement != 1)
            throw Error('Did not win')

          if (player.mode.includes('solo'))
            return BigInt(SOLO_WIN_REWARD)
          if (player.mode.includes('duos'))
            return BigInt(Math.floor(SOLO_WIN_MAX_REWARD / 2))
          if (player.mode.includes('trios'))
            return BigInt(Math.floor(SOLO_WIN_MAX_REWARD / 3))
          if (player.mode.includes('quads'))
            return BigInt(Math.floor(SOLO_WIN_MAX_REWARD / 4))
        }
      }
      throw Error('Player not found')
    // AGREEMENT CODE ENDS HERE
    })()
  )
})()
