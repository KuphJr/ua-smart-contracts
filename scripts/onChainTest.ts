import process from 'process'
import { ethers } from 'hardhat'
import { attachToContracts, setupRequesterLogging, logOracleRequests } from './universalAdapterTestUtils'

async function main() {
  const { universalAdapter, requester, linkToken } = await attachToContracts(
    '0x5526B90295EcAbB23E4ce210511071843C8EE955',
    '0x06955fA33CA96a19f7D13D931565AAA76ef7B26F',
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  )
  setupRequesterLogging(requester)
  // pay for the request
  console.log('sending link')
  const tokenTx = await linkToken.approve(requester.address, BigInt(100))
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Funding approved')

  // make the request
  logOracleRequests(universalAdapter)
  await requester.makeRequest(
    // js: javascript code to be executed (cannot be used in combination with cid)
    'return BigInt(100)',
    // cid: IPFS content ID of a valid JavaScript file to be executed
    '',
    // vars: a JSON-formatted string containing variables which are injected into the JavaScript
    '',
    // ref: used to reference private variables
    ''
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});