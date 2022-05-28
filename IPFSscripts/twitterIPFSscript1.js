const https = require('https')

const REQUIRED_TAG = 'Chainlink'
const REQUIRED_LIKES = 10
const REQUIRED_RETWEETS = 1

const options = {
  method: 'GET',
  port: '443',
  hostname: 'api.twitter.com',
  path: `/2/tweets/${tweetId}?tweet.fields=id,text,entities,public_metrics`,
  headers: { Authorization: `Bearer ${apiKey}` }
}

let result
let hasReturned = false

const request = https.request(options, (response) => {
  if (response.statusCode === 401) {
    result = 'Request unauthorized.'
    hasReturned = true
    return
  }
  if (response.statusCode !== 200) {
    result = 'Something went wrong with the API request.'
    hasReturned = true
    return 
  }

  response.on('data', (bytesData) => {
    const data = JSON.parse(bytesData.toString()).data
    if (!data.entities || !data.entities.hashtags.find(({ tag }) => tag === REQUIRED_TAG)) {
      result = `Tweet ID ${tweetId} does not have a required "${REQUIRED_TAG}" tag.`
      hasReturned = true
      return
    }
    if (data.public_metrics.like_count < REQUIRED_LIKES) {
      result = `Tweet ID ${tweetId} does not have enough likes. Required "${REQUIRED_LIKES}" likes but found ${data.public_metrics.like_count}.`
      hasReturned = true
      return
    }
    if (data.public_metrics.retweet_count < REQUIRED_RETWEETS) {
      result = `Tweet ID ${tweetId} does not have enough retweets. Required "${REQUIRED_RETWEETS}" retweets but found ${data.public_metrics.retweet_count}.`
      hasReturned = true
      return
    }
    // Reward 1 LINK (1000000000000000000 Jules) per 1,000 likes
    const rewardForLikes = (BigInt(data.public_metrics.like_count) * BigInt('1000000000000000000')) / BigInt(1000)
    // Reward 1 LINK (1000000000000000000 Jules) per 100 retweets
    const rewardForRetweets = (BigInt(data.public_metrics.retweet_count)) * BigInt('1000000000000000000') / BigInt(100)
    const rewardTotal = rewardForLikes + rewardForRetweets
    hasReturned = true
    result = rewardTotal
  })

  response.on('error', (error) => {
    result = error.toString()
    hasReturned = true
    return
  })
})
request.end()

while (!hasReturned) {
  await new Promise(r => setTimeout(r, 100));
}

return result