import process from 'process'
import { ethers } from 'hardhat'
import { setupContracts } from './universalAdapterTestUtils'

async function main() {
  const { universalAdapter, requester, linkToken } = await setupContracts(
    [ '0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153' ],
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});