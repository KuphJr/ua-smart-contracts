import { ethers } from "hardhat"

async function main() {
  const OfferRegistry = await ethers.getContractFactory("OfferRegistry");
  // const requester = await Requester.deploy();

  // await requester.deployed();

  // const txHash = requester.deployTransaction.hash
  // console.log(`Waiting for transaction to be mined...`)
  // const txReceipt = await ethers.provider.waitForTransaction(txHash)
  // console.log("Requester contract deployed to:", txReceipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
