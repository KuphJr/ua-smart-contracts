import process from 'process'
import { ethers } from 'hardhat'
import { experimentalAddHardhatNetworkMessageTraceHook } from 'hardhat/config'

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
    '0x5526B90295EcAbB23E4ce210511071843C8EE955'
  )
  const agreementRegistryAddress = (await ethers.provider.waitForTransaction(agreementRegistry.deployTransaction.hash)).contractAddress
  // const agreementRegistryAddress = '0x39bAa880921F0EEF6e0A1431E04aC8A41C2DD3a4'
  // const agreementRegistry = await AgreementRegistry.attach(agreementRegistryAddress)

  console.log('AgreementRegistry Address: ', agreementRegistryAddress);

  // CREATE
  const LinkToken = await ethers.getContractFactory('LinkToken')
  
  console.log('Funding agreement with LINK')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  const tokenTx = await linkToken.approve(agreementRegistryAddress, BigInt(200))
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Agreement has been successfully funded')

  const tx = await agreementRegistry.createAgreement(
    '0xB7aB5555BB8927BF16F8496da338a3033c12F8f3',
    BigInt('1858367000'),
    true,
    100,
    ethers.utils.defaultAbiCoder.encode(
      ['string', 'string', 'string', 'string', 'string'],
      ['', 'bafybeiezwwxj54kiq2jg6umrzdmf3ryshooxbk6o6vf6lg4hc7qnwh7nyu', 'pub1,pub2', 'pri1,pri2', '']
    )
  )
  await ethers.provider.waitForTransaction(tx.hash)
  const agreementId = tx.value

  const agreementAddress = '0x' + JSON.parse(
    '{' + await agreementRegistry.tokenURI(agreementId) + '"}'
  ).address

  console.log('Agreement created with address: ' + agreementAddress + ' and id: ' + agreementId)

  console.log('NFT URI: ' + await agreementRegistry.tokenURI(agreementId))

  //REDEEM
  console.log('Sending LINK to pay for redeem')
  const tokenTx2 = await linkToken.approve(ethers.utils.getAddress(agreementAddress), BigInt(100))
  await ethers.provider.waitForTransaction(tokenTx2.hash)
  console.log('Redeem funding approved')

  const Agreement = await ethers.getContractFactory("Agreement")
  const agreement = await Agreement.attach(agreementAddress)
  console.log('public vars!!!!!! ' + await agreement.pubVars())

  agreement.on('Filled',
    async (
      result: any
    ) => {
      console.log(`Fulfilled with result ${result}`)
      console.log('NFT URI: ' + await agreementRegistry.tokenURI(agreementId))
    }
  )
  const redeemTx = await agreement.redeem('', '')
  await ethers.provider.waitForTransaction(redeemTx.hash)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});