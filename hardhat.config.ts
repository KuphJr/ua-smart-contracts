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
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.7.0" },
      { version: "0.6.0" },
      { version: "0.4.24" },
      { version: "0.4.11" }
    ]
  },
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY as string,
          balance: '99999999999999999999'
        }
      ],
      gasMultiplier: 2,
      forking: {
        url: process.env.RINKBY_URL || "",
        enabled: true
      }
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
