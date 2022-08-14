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