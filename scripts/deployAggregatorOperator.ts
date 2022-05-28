import { ethers } from "hardhat"

async function main() {
  const AggregatorOperator = await ethers.getContractFactory("AggregatorOperator")
  const aggregatorOperator = await AggregatorOperator.attach("0xA0B18C7363989Ac72eAb8C778aE1f6De67802700")
  //await aggregatorOperator.deployed()

  //const txHash = aggregatorOperator.deployTransaction.hash
  //console.log(`Waiting for transaction to be mined...`)
  //const txReceipt = await ethers.provider.waitForTransaction(txHash)
  //console.log("AggregatorOperator contract deployed to:", txReceipt.contractAddress)

  const tx1 = await aggregatorOperator.setAuthorizedSenders(["0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"], { gasLimit: 500000 });
  const tx2 = await aggregatorOperator.setAggregatorContract("0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19", { gasLimit: 500000 })
  await ethers.provider.waitForTransaction(tx1.hash)
  await ethers.provider.waitForTransaction(tx2.hash)
  console.log('done')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})