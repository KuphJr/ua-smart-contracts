import { ethers } from "hardhat"

const RequesterABIhash = "0xfa56076c58bdf71bf6a7dbdd505b4a7ce7ec551e4b0215e2cb98f902fce90f5e";

async function main() {
  const accounts = await ethers.getSigners();

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  const AggregatorOperator = await ethers.getContractFactory("AggregatorOperator")
  const aggregatorOperator1 = await AggregatorOperator.attach("0xA0B18C7363989Ac72eAb8C778aE1f6De67802700")
  const aggregatorOperator2 = await AggregatorOperator.attach("0x7F102a0456Db7ce0852e937390BECE615679146D")
  const aggregatorOperator3 = await AggregatorOperator.attach("0xC54Ba8ce00d12c6c3aE89f95D2daf13a0F6915d9")
  await aggregatorOperator1.deployed()
  await aggregatorOperator2.deployed()
  await aggregatorOperator3.deployed()

  await aggregatorOperator1.setAuthorizedSenders(["0xB7aB5555BB8927BF16F8496da338a3033c12F8f3"]);
  await aggregatorOperator2.setAuthorizedSenders(["0xB7aB5555BB8927BF16F8496da338a3033c12F8f3"]);
  await aggregatorOperator3.setAuthorizedSenders(["0xB7aB5555BB8927BF16F8496da338a3033c12F8f3"]);

  let requestNumber1 = 0
  aggregatorOperator1.on('OracleRequest',
    async (
      specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data
    ) => {
      requestNumber1++
      console.log(`Logging OracleRequest ${requestNumber1}`)
      console.log({ specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data })
      if (requestNumber1 == 1) {
        const fulfillTx = await aggregatorOperator1.fulfillOracleRequest(
          requestId,
          payment,
          callbackAddr,
          callbackFunctionId,
          cancelExpiration,
          '0x2e835cc9e6cbd60ca1eb1007660b5a14145c20c353f31f29f90c64355fc470c5'
        )
        await ethers.provider.waitForTransaction(fulfillTx.hash)
        console.log('hashed oracle response 1 complete')
      }
      if (requestNumber1 == 2) {
        const fulfillTx = await aggregatorOperator1.fulfillOracleRequest2(
          requestId,
          payment,
          callbackAddr,
          callbackFunctionId,
          cancelExpiration,
          requestId + '0000000000000000000000000000000000000000000000000000ff549f85dd990000000000000000000000000000000000000000000000000000000000000005'
          ,{
            gasLimit: 1000000
          }
        )
        await ethers.provider.waitForTransaction(fulfillTx.hash)
        console.log('unhashed oracle response 1 complete')
      }
    }
  )

  let requestNumber2 = 0
  aggregatorOperator2.on('OracleRequest',
  async (
    specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data
  ) => {
      requestNumber2++
      console.log(`Logging OracleRequest2 ${requestNumber2}`)
      console.log({ specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data })
      if (requestNumber2 == 1) {
        const fulfillTx = await aggregatorOperator2.fulfillOracleRequest(
          requestId,
          payment,
          callbackAddr,
          callbackFunctionId,
          cancelExpiration,
          '0x2e835cc9e6cbd60ca1eb1007660b5a14145c20c353f31f29f90c64355fc470c5'
        )
        await ethers.provider.waitForTransaction(fulfillTx.hash)
        console.log('hashed oracle response 2 complete')
      }
      if (requestNumber2 == 2) {
        const fulfillTx = await aggregatorOperator2.fulfillOracleRequest2(
          requestId,
          payment,
          callbackAddr,
          callbackFunctionId,
          cancelExpiration,
          requestId + '0000000000000000000000000000000000000000000000000000ff549f85dd990000000000000000000000000000000000000000000000000000000000000005'
          ,{
            gasLimit: 1000000
          }
        )
        await ethers.provider.waitForTransaction(fulfillTx.hash)
        console.log('unhashed oracle response 2 complete')
      }
    }
  )

  let requestNumber3 = 0
  aggregatorOperator3.on('OracleRequest',
  async (
    specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data
  ) => {
      requestNumber3++
      console.log(`Logging OracleRequest3 ${requestNumber3}`)
      console.log({ specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data })
      if (requestNumber3 == 1) {
        const fulfillTx = await aggregatorOperator3.fulfillOracleRequest(
          requestId,
          payment,
          callbackAddr,
          callbackFunctionId,
          cancelExpiration,
          '0x2e835cc9e6cbd60ca1eb1007660b5a14145c20c353f31f29f90c64355fc470c5'
        )
        await ethers.provider.waitForTransaction(fulfillTx.hash)
        console.log('hashed oracle response 3 complete')
      }
      if (requestNumber3 == 2) {
        const fulfillTx = await aggregatorOperator3.fulfillOracleRequest2(
          requestId,
          payment,
          callbackAddr,
          callbackFunctionId,
          cancelExpiration,
          requestId + '0000000000000000000000000000000000000000000000000000ff549f85dd990000000000000000000000000000000000000000000000000000000000000005'
          ,{
            gasLimit: 1000000
          }
        )
        await ethers.provider.waitForTransaction(fulfillTx.hash)
        console.log('unhashed oracle response 3 complete')
      }
    }
  )

  const DirectRequestAggregator = await ethers.getContractFactory("DirectRequestAggregator")

  const directRequestAggregator = await DirectRequestAggregator.deploy(
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    '0x3363313763343939373562353432323038613864376539636133333430386531',
    '0x6339653230663039656138373432393462316166396533666233613338313739',
    [ "0xA0B18C7363989Ac72eAb8C778aE1f6De67802700", "0x7F102a0456Db7ce0852e937390BECE615679146D", "0xC54Ba8ce00d12c6c3aE89f95D2daf13a0F6915d9" ],
    BigInt(3),
    BigInt(100),
    BigInt(120),
    BigInt(100000)
  )
  await directRequestAggregator.deployed()
  const directRequestAggregatorDeployment = directRequestAggregator.deployTransaction.hash
  const aggregatorContract = await ethers.provider.waitForTransaction(directRequestAggregatorDeployment)
  const directRequestAggregatorAddress = aggregatorContract.contractAddress

  await aggregatorOperator1.setAggregatorContract(directRequestAggregatorAddress)
  await aggregatorOperator2.setAggregatorContract(directRequestAggregatorAddress)
  await aggregatorOperator3.setAggregatorContract(directRequestAggregatorAddress)

  const OfferRegistry = await ethers.getContractFactory("OfferRegistry")
  const offerRegistry = await OfferRegistry.deploy(
    RequesterABIhash
  )
  await offerRegistry.deployed()
  const txHash1 = offerRegistry.deployTransaction.hash
  const txReceipt1 = await ethers.provider.waitForTransaction(txHash1)
  const offerRegistryAddress = txReceipt1.contractAddress

  const Requester = await ethers.getContractFactory("Requester")
  const requester = await Requester.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    ethers.utils.getAddress(directRequestAggregatorAddress),
    ethers.utils.getAddress(offerRegistryAddress),
    ethers.utils.getAddress('0x981FC7F035AD33181eD7604f0708c05674395574'),
    'bafybeiezwwxj54kiq2jg6umrzdmf3ryshooxbk6o6vf6lg4hc7qnwh7nyu',
    999999
  )
  await requester.deployed()

  const requesterDeploymentTx = requester.deployTransaction.hash
  const requesterContract = await ethers.provider.waitForTransaction(requesterDeploymentTx)

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
    async (
      amountOwed: any,
      registryIndex: any,
      _requestNumber: any
    ) => {
      console.log('🎉 Offer Fulfilled! 🎉')
      console.log({ amountOwed, registryIndex, _requestNumber })
      process.exit(0)
    }
  )

  // Initalize offer
  const tokenTx = await linkToken.approve(
    ethers.utils.getAddress(requesterContract.contractAddress),
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(tokenTx.hash)
  const initTx = await requester.initalizeOffer(
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(initTx.hash)
  const roundNum = await directRequestAggregator.roundNum()
  console.log(`Round Id: ${roundNum}`)

  const approveTx = await linkToken.connect(accounts[1]).approve(
    ethers.utils.getAddress(requesterContract.contractAddress),
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(approveTx.hash)

  const tx3 = await requester.connect(accounts[1]).fulfillOffer('', '', { gasLimit: 1000000 })

  const txReceipt3 = await ethers.provider.waitForTransaction(tx3.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
