import { ethers } from "hardhat"

async function main() {
  const JS = 'return BigInt(a)'
  const CID = ''
  const VARS = '{"a":42}'
  const REF = ethers.utils.formatBytes32String('')

  const ExampleRequester = await ethers.getContractFactory("ExampleRequester");

  const addressOfDeployedExampleRequesterContract = '0x95802bF42DDbAA88Fac696922d599474f95C66D8'
  const exampleRequester = await ExampleRequester.attach(addressOfDeployedExampleRequesterContract);
  // comment out the 2 lines above and uncomment the following lines to deploy a new ExampleRequester contract
  // const exampleRequester = await ExampleRequester.deploy(
  //   // LINK token contract address (varies by blockchain)
  //   '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
  //   // Address of the deployed DirectRequestAggregator.sol contract
  //   '0x543838263CD6a67E3836eB3BC8f45cfB6c09CD19',
  //   // Cost of a request (100 Jules)
  //   BigInt(100)
  // );
  // await exampleRequester.deployed();
  // const txHash = exampleRequester.deployTransaction.hash
  // console.log(`Waiting for transaction to be mined...`)
  // const txReceipt = await ethers.provider.waitForTransaction(txHash)
  // console.log("ExampleRequester contract deployed to:", txReceipt.contractAddress);
  // const addressOfDeployedExampleRequesterContract = txReceipt.contractAddress

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  exampleRequester.on('RequestSent',
    (address, functionSelector, js, cid, vars, ref) => {
      console.log('Logging request sent event')
      console.log({ address, functionSelector, js, cid, vars, ref })
    }
  )

  exampleRequester.on('RequestFulfilled',
    async (registryIndex, result) => {
      console.log('🎉 Request Fulfilled! 🎉')
      console.log({ result, registryIndex })
      process.exit(0)
    }
  )
  // Pay the cost of the request (100 Jules)
  const tokenTx = await linkToken.approve(addressOfDeployedExampleRequesterContract, BigInt(100))
  await ethers.provider.waitForTransaction(tokenTx.hash)
  // Make the request with the set parameters
  const requestTx = await exampleRequester.makeRequest(JS, CID, VARS, REF, { gasLimit: 1000000 })
  await ethers.provider.waitForTransaction(requestTx.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
