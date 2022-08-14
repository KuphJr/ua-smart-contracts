(async () => {
  console.log(
    await (async () => {
      const API_KEY = '' // Get a free key from https://developer.twitter.com
      const TWEET_ID = '1558392958075928583'

      // AGREEMENT CODE STARTS HERE
      const axios = require('axios')

      const payPerLikeInWei = BigInt('10000000000000000')
      const requiredTag = 'polygon'
      
      const url = `https://api.twitter.com/2/tweets/${TWEET_ID}?tweet.fields=id,text,entities,public_metrics`
      const data = (await axios.get(url, { headers: { Authorization: `Bearer ${API_KEY}` }})).data.data

      if (!data.entities.hashtags.find(({ tag }) => tag.toLowerCase() === requiredTag))
        throw Error('Tweet does not contain required hashtag')

      return BigInt(data.public_metrics.like_count) * payPerLikeInWei
    // AGREEMENT CODE ENDS HERE
    })()
  )
})()
