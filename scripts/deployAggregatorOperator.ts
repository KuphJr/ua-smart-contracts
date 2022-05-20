import { ethers } from "hardhat"

async function main() {
  const AggregatorOperator = await ethers.getContractFactory("AggregatorOperator")
  console.log('Worked')
  const aggregatorOperator = await AggregatorOperator.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    ethers.utils.getAddress('0xB7aB5555BB8927BF16F8496da338a3033c12F8f3')
  )

  await aggregatorOperator.deployed()

  const txHash = aggregatorOperator.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("AggregatorOperator contract deployed to:", txReceipt.contractAddress)

  await aggregatorOperator.setAuthorizedSenders(["0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153"]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})