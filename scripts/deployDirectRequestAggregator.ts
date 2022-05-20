import { ethers } from "hardhat"

async function main() {
  const DirectRequestAggregator = await ethers.getContractFactory("DirectRequestAggregator")
  // const directRequestAggregatorAddress = "0xc2651159046069998336bFa7281ebe6819a2c52D"
  // const directRequestAggregator = await DirectRequestAggregator.attach(directRequestAggregatorAddress)

  const directRequestAggregator = await DirectRequestAggregator.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    '0x3363313763343939373562353432323038613864376539636133333430386531',
    '0x6339653230663039656138373432393462316166396533666233613338313739',
    [ ethers.utils.getAddress("0xA0B18C7363989Ac72eAb8C778aE1f6De67802700") ],
    BigInt(1000000000000000000),
    BigInt(120),
    BigInt(400000)
  )
  await directRequestAggregator.deployed()
  const directRequestAggregatorDeployment = directRequestAggregator.deployTransaction.hash
  const aggregatorContract = await ethers.provider.waitForTransaction(directRequestAggregatorDeployment)
  console.log("DirectRequestAggregator contract deployed to:", aggregatorContract.contractAddress)
  const directRequestAggregatorAddress = aggregatorContract.contractAddress
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})