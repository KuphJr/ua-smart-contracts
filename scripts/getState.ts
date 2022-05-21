

import { providers } from "ethers"
import { ethers } from "hardhat"

async function main() {
  const Requester = await ethers.getContractFactory("Requester")
  const requester = await Requester.attach('0xe22f3522E281EFfdc60593343417E2f319378be7')
  console.log(await requester.getState())
}

main()