import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
import * as ethers from 'ethers'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    bsc_test: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [process.env.PRIVATE_KEY as string],
    },
    localhost: {
      // accounts: accountUtils.getAccounts().map((acc) => ({
      //   balance: parseEther("1000000000").toString(),
      //   privateKey: acc,
      // })),
      url: `http://localhost:8545/`,
      accounts: [
        process.env.PRIVATE_KEY as string,
        // {
        //   privateKey: process.env.PRIVATE_KEY as string,
        //   balance: ethers.utils.parseEther('1000000000').toString(),
        // },
      ],
    },
  },
}

export default config
