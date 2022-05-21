import { ethers } from 'hardhat'

const main = async () => {
  // ENTER THE ADDRESS OF THE DEPLOYED REQUESTER BELOW
  const requesterContractAddress = '0x40025e6cB25e043fA5ff38732B9ED074577C15Ab'

  const accounts = await ethers.getSigners()

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  const Requester = await ethers.getContractFactory("Requester");
  const requester = await Requester.attach(requesterContractAddress)
  const AggregatorOperator = await ethers.getContractFactory('AggregatorOperator')
  const aggregatorOperator = AggregatorOperator.attach('0xA0B18C7363989Ac72eAb8C778aE1f6De67802700')
  
  // event logging
  requester.on('RequestSent',
    (
      address: any,
      functionSelector: any,
      javaScript: any,
      scriptIpfsHash: any,
      vars: any,
      ref: any,
      registryIndex: any,
      requestNumber: any
    ) => {
      console.log('Logging request sent event')
      console.log({ address, functionSelector, javaScript, scriptIpfsHash, vars, ref, registryIndex, requestNumber })
    }
  )
  requester.on('OfferFulfilled',
    (
      amountOwed: any,
      registryIndex: any,
      _requestNumber: any
    ) => {
      console.log('🎉 Offer Fulfilled! 🎉')
      console.log({ amountOwed, registryIndex, _requestNumber })
    }
  )
  let i = 1;
  aggregatorOperator.on('OracleRequest',
    (
      specId: any,
      requester: any,
      requestId: any,
      payment: any,
      callbackAddr: any,
      callbackFunctionId: any,
      cancelExpiration: any,
      dataVersion: any,
      data: any
    ) => {
      console.log('Logging OracleRequest ' + i)
      i++
      console.log({ specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data })
    }
  )

  const approveTx = await linkToken.connect(accounts[1]).approve(
    ethers.utils.getAddress(requesterContractAddress),
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(approveTx.hash)
  console.log(
    'Balance of offeree before calling fulfillOffer: ' +
    await linkToken.balanceOf('0x981FC7F035AD33181eD7604f0708c05674395574')
  )
  const fulfillTx = await requester.connect(accounts[1]).fulfillOffer('tweetId', 'apiKey')
  await ethers.provider.waitForTransaction(fulfillTx.hash)
  console.log(
    'Balance of offeree after calling fulfillOffer: ' +
    await linkToken.balanceOf('0x981FC7F035AD33181eD7604f0708c05674395574')
  )
}

main()