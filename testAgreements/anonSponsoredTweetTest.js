(async () => {
  console.log(
    await (async () => {
      // Get a free key from https://developer.twitter.com
      const API_KEY = ''
      const TWEET_ID = '1558392958075928583'
      const SALT = 'randomSaltForRedemption'
      const SALTED_AUTHOR_ID_HASH = 'yE4htFlJjONdQ/1zX1yxh6jkw4w3BShtoF2G4+v9Ggw='

      // AGREEMENT CODE STARTS HERE
      const axios = require('axios')
      const crypto = require('crypto')

      const payPerLikeInWei = BigInt('10000000000000000')
      const requiredTag = 'polygon'
      
      const url = `https://api.twitter.com/2/tweets/${TWEET_ID}?tweet.fields=text,entities,public_metrics&expansions=author_id`
      const data = (await axios.get(url, { headers: { Authorization: `Bearer ${API_KEY}` }})).data.data
      const saltedHash = crypto.createHash('sha256').update(data.author_id + SALT).digest('base64')

      if (saltedHash != 'yE4htFlJjONdQ/1zX1yxh6jkw4w3BShtoF2G4+v9Ggw=')
        throw Error('User or salt is invalid')

      if (!data.entities.hashtags.find(({ tag }) => tag.toLowerCase() === requiredTag))
        throw Error('Tweet does not contain required hashtag')

      return BigInt(data.public_metrics.like_count) * payPerLikeInWei
    // AGREEMENT CODE ENDS HERE
    })()
  )
})()
