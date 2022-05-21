import { ethers } from 'ethers'
import fetch from 'node-fetch'

const REQUIRED_TAG = 'Chainlink'
const REQUIRED_LIKES = 10
const REQUIRED_RETWEETS = 1

const response = await fetch(
  `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=id,text,entities,public_metrics`,
  {
    headers: { Authorization: `Bearer ${apiKey}` },
  },
)

if (response.status === 401) {
  return console.error(`Request unauthorised.`)
}

if (response.status !== 200) {
  return console.error(`Something went wrong with the API request.`)
}

const {
  data: {
    entities,
    public_metrics: { like_count, retweet_count },
  },
} = await response.json()

if (!entities || !entities.hashtags.find(({ tag }) => tag === REQUIRED_TAG)) {
  return console.error(
    `Tweet ID ${tweetId} does not have a required "${REQUIRED_TAG}" tag.`,
  )
}

if (like_count < REQUIRED_LIKES) {
  return console.error(
    `Tweet ID ${tweetId} does not have enough likes. Required "${REQUIRED_LIKES}" likes but found ${like_count} instead.`,
  )
}

if (retweet_count < REQUIRED_RETWEETS) {
  return console.error(
    `Tweet ID ${tweetId} does not have enough retweets. Required "${REQUIRED_RETWEETS}" retweets but found ${retweet_count} instead.`,
  )
}

// Reward 1 LINK per 1,000 likes
const rewardForLikes = ethers.BigNumber.from(like_count).mul(
  ethers.utils.parseUnits('0.001'),
)
// Reward 1 LINK per 100 retweets
const rewardForRetweets = ethers.BigNumber.from(retweet_count).mul(
  ethers.utils.parseUnits('0.01'),
)

const rewardTotal = rewardForLikes.add(rewardForRetweets).toBigInt()

return rewardTotal