import process from 'process'
import { ethers } from "hardhat"
import {
  createNodeWallets,
  setupContracts,
  mockChainlinkNodes,
  setupRequesterLogging
} from "./universalAdapterTestUtils"

const LINK_TOKEN_ADDRESS = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
// the number of nodes must be less than 255
const NUMBER_OF_NODES = 16
// note that the number of nodes and the response threshold do not have to be the same.
// This allows for a certain number of nodes to fail to respond, without causing a request to fail.
// The tolerance for the number of failed responses == NUMBER_OF_NODES - RESPONSE_THRESHOLD

async function main() {
  const { nodeWallets, nodeAddresses } = await createNodeWallets(NUMBER_OF_NODES)
  const { universalAdapter, requester, linkToken } = await setupContracts(nodeAddresses, LINK_TOKEN_ADDRESS)
  // this creates mock Chainlink nodes to respond when OracleRequest
  // events are emitted from the UniversalAdapter contract
  mockChainlinkNodes(universalAdapter, nodeWallets)
  // Logs when a request is sent and fulfilled
  setupRequesterLogging(requester)
  // pay for the request
  const tokenTx = await linkToken.approve(requester.address, BigInt(100))
  ethers.provider.waitForTransaction(tokenTx.hash)
  // make the request
  await requester.makeRequest('return BigInt(100)', '', '', '')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
