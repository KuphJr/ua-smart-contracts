import { ethers } from "hardhat"

async function main() {
  const ExampleRequester = await ethers.getContractFactory("ExampleRequester");
  const exampleRequester = await ExampleRequester.deploy(
    // LINK token contract address (varies by blockchain)
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    // Address of the deployed DirectRequestAggregator.sol contract
    '0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19',
    // Cost of a request (100 Jules)
    BigInt(100)
  );

  await exampleRequester.deployed();

  const txHash = exampleRequester.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("ExampleRequester contract deployed to:", txReceipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
