import { ethers } from "hardhat"

async function main() {
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
    'bafybeieomwdf37r6nooiyeoxhoovn3hfob2xfjwch4wy3rj6l5dojeuqle',
    // Seconds from now until expiration
    999999
  )

  await requester.deployed();

  const txHash = requester.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("Requester contract deployed to:", txReceipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
