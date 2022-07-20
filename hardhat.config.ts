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
      {
        version: "0.8.14",
        settings: {
          optimizer: {
            runs: 1
          }
        }
      },
      { version: "0.8.0" },
      { version: "0.4.24" },
      { version: "0.4.11" },
      { version: "0.4.8" }
    ]
  },
  networks: {
    mumbai: {
      url: "https://dry-young-sun.matic-testnet.quiknode.pro/f0d9ee2313cc5813ca36460677985e066497f634/",
      gasMultiplier: 10,
      accounts: [ process.env.WALLETKEY1 || '' ]
    },
    hardhat: {
      accounts: [
        {
          privateKey: process.env.WALLETKEY1 as string,
          balance: '99999999999999999999'
        }
      ],
      gasMultiplier: 2,
      forking: {
        url: "https://dry-young-sun.matic-testnet.quiknode.pro/f0d9ee2313cc5813ca36460677985e066497f634/",
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
