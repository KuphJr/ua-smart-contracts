import { providers } from "ethers"
import { ethers } from "hardhat"

const RequesterABIhash = "0xff6679b4fa4251f4a592d1764b1fc0dc0e835571f4e8f8e8c466ad1feacddbfc";

async function main() {
  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  const operatorAddress = "0x7cd20703AC68420BeA86D30ACB52427DBE8deB43"
  const AggregatorOperator = await ethers.getContractFactory("AggregatorOperator")
  const aggregatorOperator = await AggregatorOperator.attach(operatorAddress)
  await aggregatorOperator.setAuthorizedSenders(["0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"]);

  const aggregatorContractAddress = "0xE59BDB7D9aA4B8353891b777892135FCD08913B8"
  const DirectRequestAggregator = await ethers.getContractFactory("DirectRequestAggregator")
  const directRequestAggregator = await DirectRequestAggregator.attach(aggregatorContractAddress)

  await aggregatorOperator.setAggregatorContract(aggregatorContractAddress)

  const OfferRegistry = await ethers.getContractFactory("OfferRegistry")
  const offerRegistry = await OfferRegistry.deploy(
    RequesterABIhash
  )
  await offerRegistry.deployed()

  const txHash1 = offerRegistry.deployTransaction.hash
  const txReceipt1 = await ethers.provider.waitForTransaction(txHash1)
  console.log("OfferRegistry contract deployed to:", txReceipt1.contractAddress);

  const Requester = await ethers.getContractFactory("Requester")
  const requester = await Requester.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    ethers.utils.getAddress(aggregatorContractAddress),
    ethers.utils.getAddress(txReceipt1.contractAddress),
    ethers.utils.getAddress('0xB7aB5555BB8927BF16F8496da338a3033c12F8f3'),
    'return bigint(100);',
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

  // Initalize offer
  const tokenTx = await linkToken.approve(
    ethers.utils.getAddress(requesterContract.contractAddress),
    BigInt('1000000000000000000')
  )
  await ethers.provider.waitForTransaction(tokenTx.hash)
  await requester.initalizeOffer(
    BigInt(1000000000000000000)
  )
  console.log(`Num offers in registry: ${await offerRegistry.getRegistryLength()}`)

  await linkToken.approve(
    ethers.utils.getAddress(requesterContract.contractAddress),
    BigInt('1000000000000000000')
  )
  console.log('called approve')
  const tx3 = await requester.fulfillOffer('', '')
  console.log('fulfilled')
  const txReceipt3 = await ethers.provider.waitForTransaction(tx3.deployTransaction.hash)
  console.log('Function done')
  console.log(tx3)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
