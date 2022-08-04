import process from 'process'
import { ethers } from 'hardhat'

async function main() {
  const LinkToken = await ethers.getContractFactory('LinkToken')
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
  
  console.log('Calling LINK.transferAndCall() to create agreement')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')
  const abiCoder = new ethers.utils.AbiCoder()
  const agreementData = abiCoder.encode(
    ['string', 'string', 'string', 'string', 'string'],
    ['', 'bafybeiezwwxj54kiq2jg6umrzdmf3ryshooxbk6o6vf6lg4hc7qnwh7nyu', 'pub1,pub2', 'pri1,pri2', '']
  )
  const tokenTx = await linkToken.transferAndCall(
    agreementRegistryAddress,
    BigInt(100),
    abiCoder.encode(
      ['address', 'uint', 'bool', 'uint', 'bytes'],
      ['0xB7aB5555BB8927BF16F8496da338a3033c12F8f3', BigInt('1858367000'), true, 100, agreementData]
    )
  )
  await ethers.provider.waitForTransaction(tokenTx.hash)
  console.log('Agreement has been successfully funded & created')
  agreementRegistry.on('Created', async (creatorAddress, agreementId) => {
    console.log(await agreementRegistry.tokenURI(agreementId))
    const agreementAddress = '0x' + JSON.parse(
      '{' + await agreementRegistry.tokenURI(agreementId) + '"}'
    ).address
    console.log('Agreement created with address: ' + agreementAddress + ' and id: ' + agreementId)
    console.log('NFT URI: ' + await agreementRegistry.tokenURI(agreementId))

  //REDEEM

  console.log('Calling transferAndCall to redeem agreement')
  const tokenTx2 = await linkToken.transferAndCall(
    ethers.utils.getAddress(agreementAddress),
    BigInt(100),
    abiCoder.encode(
      ['string', 'string'],
      ['', '']
    )
  )
  await ethers.provider.waitForTransaction(tokenTx2.hash)
  console.log('Awaiting oracle request')

  const Agreement = await ethers.getContractFactory("Agreement")
  const agreement = await Agreement.attach(agreementAddress)
  agreement.on('Filled',
    async (
      result: any
    ) => {
      console.log(`Fulfilled with result ${result}`)
      console.log('NFT URI: ' + await agreementRegistry.tokenURI(agreementId))
    }
  )
  })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});