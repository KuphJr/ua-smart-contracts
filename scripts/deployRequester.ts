import { ethers } from "hardhat"

async function main() {
  const accounts = await ethers.getSigners();

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')


  const Requester = await ethers.getContractFactory("Requester");
  const requester = await Requester.deploy(
    // LINK token address
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    // Aggregator contract address
    '0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19',
    // Registry contract address
    '0xe62b71D706302C49aeb371e48C12368DE02e6A1a',
    // Offeree
    '0x981FC7F035AD33181eD7604f0708c05674395574',
    // IPFS hash
    'bafybeibugaf5qybcpg3z3la665lhbvcrcdzh2bj2zktmue7uvrvachdhxq',
    // Seconds from now until expiration
    999999
  )

  await requester.deployed();

  const txHash = requester.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("Requester contract deployed to:", txReceipt.contractAddress);

  // Initalize offer
  const tokenTx = await linkToken.approve(
    ethers.utils.getAddress(txReceipt.contractAddress),
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(tokenTx.hash)
  const initTx = await requester.initalizeOffer(
    BigInt(100)
  )
  await ethers.provider.waitForTransaction(initTx.hash)

  const OfferRegistry = await ethers.getContractFactory("OfferRegistry")
  const offerRegistry = await OfferRegistry.attach('0xe62b71D706302C49aeb371e48C12368DE02e6A1a')
  console.log(`Num offers in registry: ${await offerRegistry.getRegistryLength()}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
