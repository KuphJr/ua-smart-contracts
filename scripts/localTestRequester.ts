import { providers } from "ethers"
import { ethers } from "hardhat"

const RequesterABIhash = "0xf3d19818214c83f5243efc55578a35407094bcf89b52af961955e87d8db9a6f9";

async function main() {
  const accounts = await ethers.getSigners();

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  const aggregatorOperatorAddress = "0xA0B18C7363989Ac72eAb8C778aE1f6De67802700"
  const AggregatorOperator = await ethers.getContractFactory("AggregatorOperator")
  const aggregatorOperator = AggregatorOperator.attach(aggregatorOperatorAddress)
  // const aggregatorOperator = await AggregatorOperator.deploy(
  //   ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
  //   ethers.utils.getAddress('0xB7aB5555BB8927BF16F8496da338a3033c12F8f3')
  // )
  // await aggregatorOperator.deployed()

  // const operatorDeployment = aggregatorOperator.deployTransaction.hash
  // const operator = await ethers.provider.waitForTransaction(operatorDeployment)
  // console.log("AggregatorOperator contract deployed to:", operator.contractAddress)

  await aggregatorOperator.setAuthorizedSenders(["0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"]);

  let i = 1;
  aggregatorOperator.on('OracleRequest',
    (
      specId,
      requester,
      requestId,
      payment,
      callbackAddr,
      callbackFunctionId,
      cancelExpiration,
      dataVersion,
      data
    ) => {
      console.log('Logging OracleRequest ' + i)
      i++
      console.log({ specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data })
    }
  )

  const DirectRequestAggregator = await ethers.getContractFactory("DirectRequestAggregator")
  // const directRequestAggregatorAddress = '0x068582D81EA8479dc49C9E6bdef290eE725E2480'
  // const directRequestAggregator = await DirectRequestAggregator.attach(directRequestAggregatorAddress)

  const directRequestAggregator = await DirectRequestAggregator.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    '0x3363313763343939373562353432323038613864376539636133333430386531',
    '0x6339653230663039656138373432393462316166396533666233613338313739',
    [ ethers.utils.getAddress("0xA0B18C7363989Ac72eAb8C778aE1f6De67802700") ],
    BigInt(100),
    BigInt(120),
    BigInt(400000)
  )
  await directRequestAggregator.deployed()
  const directRequestAggregatorDeployment = directRequestAggregator.deployTransaction.hash
  const aggregatorContract = await ethers.provider.waitForTransaction(directRequestAggregatorDeployment)
  console.log("DirectRequestAggregator contract deployed to:", aggregatorContract.contractAddress)
  const directRequestAggregatorAddress = aggregatorContract.contractAddress

  await aggregatorOperator.setAggregatorContract(directRequestAggregatorAddress)

  // const offerRegistryAddress = "0x7EC339e8E24D1B227D0430de9B1c695c192A8582"
  const OfferRegistry = await ethers.getContractFactory("OfferRegistry")
  // const offerRegistry = await OfferRegistry.attach(offerRegistryAddress)

  const offerRegistry = await OfferRegistry.deploy(
    RequesterABIhash
  )
  await offerRegistry.deployed()
  const txHash1 = offerRegistry.deployTransaction.hash
  const txReceipt1 = await ethers.provider.waitForTransaction(txHash1)
  console.log("OfferRegistry contract deployed to:", txReceipt1.contractAddress);
  const offerRegistryAddress = txReceipt1.contractAddress

  const Requester = await ethers.getContractFactory("Requester")
  const requester = await Requester.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    ethers.utils.getAddress(directRequestAggregatorAddress),
    ethers.utils.getAddress(offerRegistryAddress),
    ethers.utils.getAddress('0x981FC7F035AD33181eD7604f0708c05674395574'),
    'bafybeieomwdf37r6nooiyeoxhoovn3hfob2xfjwch4wy3rj6l5dojeuqle',
    999999
  )
  await requester.deployed()

  const requesterDeploymentTx = requester.deployTransaction.hash
  const requesterContract = await ethers.provider.waitForTransaction(requesterDeploymentTx)
  console.log("Requester contract deployed to:", requesterContract.contractAddress);

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
  console.log(`Num offers in registry: ${await offerRegistry.getRegistryLength()}`)

  const approveTx = await linkToken.connect(accounts[1]).approve(
    ethers.utils.getAddress(requesterContract.contractAddress),
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(approveTx.hash)
  console.log('called approve')
  console.log(await linkToken.balanceOf('0x981FC7F035AD33181eD7604f0708c05674395574'))
  const tx3 = await requester.connect(accounts[1]).fulfillOffer('', '')
  console.log('fulfilled')
  const txReceipt3 = await ethers.provider.waitForTransaction(tx3.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
