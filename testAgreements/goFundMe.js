(async () => {
  console.log(
    await (async () => {
      const axios = require('axios')
      const result = await axios.get(`https://www.gofundme.com/f/save-the-environment-fund`)
      console.log(/\"m-progress-meter-heading">(.*?)\</.exec(result.data)[1])
    })()
  )
})()
