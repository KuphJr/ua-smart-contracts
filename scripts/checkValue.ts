import process from 'process'
import { ethers } from 'hardhat'
import { attachToContracts, setupRequesterLogging, logOracleRequests } from './universalAdapterTestUtils'

async function main() {
  const { universalAdapter, requester, linkToken } = await attachToContracts(
    '0x82cB584fb4013c3B1ef8c3a8D445579211679220',
    '0x59da33c37a93cfe5f8cf01fD5a537b2F76951324',
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  )
  const result = await requester.result()
  console.log('result: ' + result)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});