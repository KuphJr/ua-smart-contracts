import process from 'process'
import { ethers } from 'hardhat'

console.log('RUNNING')

async function main() {
  const AgreementRegistry = await ethers.getContractFactory("AgreementRegistry")
  const agreementRegistry = await AgreementRegistry.deploy(
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    '0x5526B90295EcAbB23E4ce210511071843C8EE955',
    BigInt(100)
  )
  const agreementRegistryAddress = (await ethers.provider.waitForTransaction(agreementRegistry.deployTransaction.hash)).contractAddress
  console.log('AgreementRegistry Address: ', agreementRegistryAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});