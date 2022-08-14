import process from 'process'
import { ethers } from 'hardhat'
import { setupContracts } from './universalAdapterTestUtils'

async function main() {
  const { universalAdapter, requester, linkToken } = await setupContracts(
    [ '0x8195A9E6d0EdBf96DfF46Be22B7CcdaBB7F09153',  '0x9F509CCbA8affcae3b5c2F38186Ee0BD6ae8f30E', '0x1C99C1c7b3C2dc52ba1B1ac07d55e26bAfBCd146'],
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});