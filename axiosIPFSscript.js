const tweetId = '1528029598088368129'
const apiKey = 'AAAAAAAAAAAAAAAAAAAAAKK6VAEAAAAAwWz%2FuM2jqPaw3VzR2C9O0xzz6T0%3DQvUwRrwhmPQtAgzEv35hGIRJqRJgtY6lwF2P00aVgnl07nmo3J'

const main = async () => {
  const axios = require('axios')
  const ethers = require('ethers')

  const REQUIRED_TAG = 'Chainlink'
  const REQUIRED_LIKES = 10
  const REQUIRED_RETWEETS = 1

  const response = await axios.get(
    `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=id,text,entities,public_metrics`,
    {
      headers: { Authorization: `Bearer ${apiKey}` }
    }
  )
  const data = response.data.data
  if (!data.entities || !data.entities.hashtags.find(({ tag }) => tag === REQUIRED_TAG)) {
    console.log(data.entities)
    return `Tweet ID ${tweetId} does not have a required "${REQUIRED_TAG}" tag.`
  }
  if (data.public_metrics.like_count < REQUIRED_LIKES) {
    return `Tweet ID ${tweetId} does not have enough likes. Required "${REQUIRED_LIKES}" likes but found ${data.public_metrics.like_count} instead.`
  }
  
  if (data.public_metrics.retweet_count < REQUIRED_RETWEETS) {
    return `Tweet ID ${tweetId} does not have enough retweets. Required "${REQUIRED_RETWEETS}" retweets but found ${data.public_metrics.retweet_count} instead.`
  }
  // Reward 1 LINK per 1,000 likes
  const rewardForLikes = ethers.BigNumber.from(data.public_metrics.like_count).mul(
    ethers.utils.parseUnits('0.001'),
  )
  // Reward 1 LINK per 100 retweets
  const rewardForRetweets = ethers.BigNumber.from(data.public_metrics.retweet_count).mul(
    ethers.utils.parseUnits('0.01'),
  )
  
  const rewardTotal = rewardForLikes.add(rewardForRetweets).toBigInt()
  
  return rewardTotal
}

(async () => { console.log(await main()) })()