import process from 'process'
import { ethers } from 'hardhat'

async function main() {
  const agreementAddress = '0x7e5B93BD1b76d3c00f209b69Af5b944ccA1e2b2f'

  const Agreement = await ethers.getContractFactory("Agreement")
  const agreement = await Agreement.attach(agreementAddress)
  const LinkToken = await ethers.getContractFactory('LinkToken')

  console.log('sending link')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  const tokenTx = await linkToken.approve(agreementAddress, BigInt(200))
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Funding approved')

  agreement.on('RequestFulfilled',
    (
      requestId: any,
      result: any
    ) => {
      console.log(`Request id ${requestId} fulfilled with result ${result}`)
    }
  )

  const tx = await agreement.makeRequest('')
  console.log(tx)
  await ethers.provider.waitForTransaction(tx.hash)
  console.log('successfully created agreement')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});