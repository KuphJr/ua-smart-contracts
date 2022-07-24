import process from 'process'
import { ethers } from 'hardhat'

async function main() {
  const agreementRegistryDeployedAddress = '0xFE987A77eD34241CB4838304D80e56430B72F114'

  const AgreementRegistry = await ethers.getContractFactory("AgreementRegistry")
  const agreementRegistry = await AgreementRegistry.attach(agreementRegistryDeployedAddress)
  const LinkToken = await ethers.getContractFactory('LinkToken')

  console.log('sending link')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  const tokenTx = await linkToken.approve(agreementRegistryDeployedAddress, BigInt(200))
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Funding approved')

  agreementRegistry.on('AgreementCreated',
    (
      agreementId: any,
      agreementAddress: any,
      agreementData: any
    ) => {
      console.log('Agreement created with address: ' + agreementAddress)
    }
  )

  const tx = await agreementRegistry.createAgreement(
    '0xB7aB5555BB8927BF16F8496da338a3033c12F8f3',
    BigInt('1658362756'),
    true,
    200,
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'string', 'string[]', 'string[]', 'string'],
      ['return BigInt(45)', '', [], [], '']
    )
  )
  console.log(tx)
  await ethers.provider.waitForTransaction(tx.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});