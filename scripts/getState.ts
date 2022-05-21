

import { providers } from "ethers"
import { ethers } from "hardhat"

async function main() {
  const Requester = await ethers.getContractFactory("Requester")
  const requester = await Requester.attach('0xf473c82cbCd340B729F9d32507DE91c6457308Ad')
  console.log(await requester.getState())

  const accounts = await ethers.getSigners();

  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach('0x326C977E6efc84E512bB9C30f76E30c160eD06FB')

  console.log('balance of offeree: ' + await linkToken.balanceOf('0x981FC7F035AD33181eD7604f0708c05674395574'))
}

main()