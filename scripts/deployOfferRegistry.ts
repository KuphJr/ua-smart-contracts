import { ethers } from "hardhat"

async function main() {
  const OfferRegistry = await ethers.getContractFactory("OfferRegistry");
  const offerRegistry = await OfferRegistry.deploy(
    '0x760bcbe1bbbca2049c904c9b2ad51e0ce86bcd50aaae18ae092812851da45b60'
  );

  await offerRegistry.deployed();

  const txHash = offerRegistry.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("Requester contract deployed to:", txReceipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
