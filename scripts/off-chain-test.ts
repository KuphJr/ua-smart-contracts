import process from 'process'
import { ethers } from 'hardhat'

async function main() {
  const UniversalAdapter = await ethers.getContractFactory("UniversalAdapter")
  const universalAdapter = await UniversalAdapter.attach('0x5526B90295EcAbB23E4ce210511071843C8EE955')

  universalAdapter.on(
    'OracleRequest',
    (specId: any, requester: any, requestId: any, payment: any, callbackAddr: any, callbackFunctionId: any, cancelExpiration: any, dataVersion: any, data: any) => {
      console.log('OracleRequest Emitted')
      console.log('requestId: ', requestId)
      console.log('data: ', data)
    }
  )
  // Deploy
  const AgreementRegistry = await ethers.getContractFactory("AgreementRegistry")
  const agreementRegistry = await AgreementRegistry.deploy(
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    '0x5526B90295EcAbB23E4ce210511071843C8EE955',
    BigInt(100)
  )
  const agreementRegistryAddress = (await ethers.provider.waitForTransaction(agreementRegistry.deployTransaction.hash)).contractAddress
  console.log('AgreementRegistry Address: ', agreementRegistryAddress);

  // CREATE
  const LinkToken = await ethers.getContractFactory('LinkToken')
  
  console.log('sending link')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  const tokenTx = await linkToken.approve(agreementRegistryAddress, BigInt(200))
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Inital Funding approved')

  agreementRegistry.on('AgreementCreated',
    async (
      agreementId: any,
      agreementAddress: any,
      agreementData: any
    ) => {
      console.log('Agreement created with address: ' + agreementAddress)
      console.log('REDEEMING')

      // REDEEM
      console.log('sending link')
      const tokenTx = await linkToken.approve(agreementAddress, BigInt(200))
      await ethers.provider.waitForTransaction(tokenTx.hash)
      console.log('Redeem Funding approved')

      const Agreement = await ethers.getContractFactory("Agreement")
      const agreement = await Agreement.attach(agreementAddress)
      const LinkToken = await ethers.getContractFactory('LinkToken')

      agreement.on('RequestFulfilled',
        (
          requestId: any,
          result: any
        ) => {
          console.log(`Request id ${requestId} fulfilled with result ${result}`)
        }
      )
      console.log('BEFORE MAKEREQUEST')
      const tx = await agreement.makeRequest('')
      await ethers.provider.waitForTransaction(tx.hash)
      console.log('successfully called makeRequest')
    }
  )

  const tx = await agreementRegistry.createAgreement(
    '0xB7aB5555BB8927BF16F8496da338a3033c12F8f3',
    BigInt('1658362756'),
    false,
    200,
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'string', 'string', 'string'],
      ['return 55', '', '', '']
    )
  )
  await ethers.provider.waitForTransaction(tx.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});