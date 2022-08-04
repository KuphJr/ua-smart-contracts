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