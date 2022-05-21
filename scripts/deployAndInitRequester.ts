import { ethers } from "hardhat"

async function main() {
  const offerRegistryAddress = '0xb9a8e44D214E30004c54D253ed484A13Fb5381b5'

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  const Requester = await ethers.getContractFactory("Requester");
  const requester = await Requester.deploy(
    // LINK token address
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    // Aggregator contract address
    '0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19',
    // Registry contract address
    offerRegistryAddress,
    // Offeree
    '0x981FC7F035AD33181eD7604f0708c05674395574',
    // IPFS hash
    'bafybeibugaf5qybcpg3z3la665lhbvcrcdzh2bj2zktmue7uvrvachdhxq',
    // Seconds from now until expiration
    999999
  )
  const txHash = requester.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("Requester contract deployed to:", txReceipt.contractAddress);
  const requesterContractAddress = txReceipt.contractAddress
  // const requesterContractAddress = '0x6CfD3CD9B5676B382b4CAE9Cb8B805846176D8E4'
  // const requester = Requester.attach(requesterContractAddress)

  await requester.deployed();

  // Initalize offer
  const tokenTx = await linkToken.approve(
    ethers.utils.getAddress(requesterContractAddress),
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Link tokens transferred')

  const initTx = await requester.initalizeOffer(
    BigInt(100), { gasLimit: 1000000 }
  )
  await ethers.provider.waitForTransaction(initTx.hash)
  console.log('offer initialized')

  const OfferRegistry = await ethers.getContractFactory("OfferRegistry")
  const offerRegistry = await OfferRegistry.attach(offerRegistryAddress)
  console.log('Trying to get registry length')
  console.log(`Num offers in registry: ${await offerRegistry.getRegistryLength()}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
