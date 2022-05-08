import * as dotenv from "dotenv";
import process from 'process'

import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.7.0",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts: [process.env.PRIVATE_KEY as string]
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}

export default config
