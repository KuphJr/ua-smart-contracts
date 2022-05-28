import { ethers } from "hardhat"

async function main() {
  const DirectRequestAggregator = await ethers.getContractFactory("DirectRequestAggregator")
  // const directRequestAggregatorAddress = "0xc2651159046069998336bFa7281ebe6819a2c52D"
  // const directRequestAggregator = await DirectRequestAggregator.attach(directRequestAggregatorAddress)

  const directRequestAggregator = await DirectRequestAggregator.deploy(
    ethers.utils.getAddress('0x326C977E6efc84E512bB9C30f76E30c160eD06FB'),
    '0x3363313763343939373562353432323038613864376539636133333430386531',
    '0x6339653230663039656138373432393462316166396533666233613338313739',
    [
      ethers.utils.getAddress("0xA0B18C7363989Ac72eAb8C778aE1f6De67802700"),
      ethers.utils.getAddress("0x7F102a0456Db7ce0852e937390BECE615679146D"),
      ethers.utils.getAddress("0xC54Ba8ce00d12c6c3aE89f95D2daf13a0F6915d9"),
    ],
    BigInt(3),
    BigInt(100),
    BigInt(120),
    BigInt(300)
  )
  await directRequestAggregator.deployed()
  const directRequestAggregatorDeployment = directRequestAggregator.deployTransaction.hash
  const aggregatorContract = await ethers.provider.waitForTransaction(directRequestAggregatorDeployment)
  console.log("DirectRequestAggregator contract deployed to:", aggregatorContract.contractAddress)
  const directRequestAggregatorAddress = aggregatorContract.contractAddress

  const AggregatorOperator = await ethers.getContractFactory("AggregatorOperator")
  const aggregatorOperator1 = await AggregatorOperator.attach("0xA0B18C7363989Ac72eAb8C778aE1f6De67802700")
  aggregatorOperator1.setAggregatorContract(aggregatorContract.contractAddress)
  const aggregatorOperator2 = await AggregatorOperator.attach("0x7F102a0456Db7ce0852e937390BECE615679146D")
  aggregatorOperator2.setAggregatorContract(aggregatorContract.contractAddress)
  const aggregatorOperator3 = await AggregatorOperator.attach("0xC54Ba8ce00d12c6c3aE89f95D2daf13a0F6915d9")
  aggregatorOperator3.setAggregatorContract(aggregatorContract.contractAddress)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})