import { ethers } from "hardhat"

async function main() {
  const OfferRegistry = await ethers.getContractFactory("OfferRegistry");
  const offerRegistry = await OfferRegistry.deploy(
    '0xfa56076c58bdf71bf6a7dbdd505b4a7ce7ec551e4b0215e2cb98f902fce90f5e'
  );

  await offerRegistry.deployed();

  const txHash = offerRegistry.deployTransaction.hash
  console.log(`Waiting for transaction to be mined...`)
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  console.log("OfferRegistry contract deployed to:", txReceipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
