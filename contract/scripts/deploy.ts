import { ethers } from 'hardhat'
import { Bank, ERC20 } from '../typechain-types'

let bank: Bank
let coin: ERC20

async function deployBankContract(coinAddress: string) {
  const [owner] = await ethers.getSigners()
  const Bank = await ethers.getContractFactory('Bank', {
    signer: owner,
  })
  const bank = await Bank.deploy(coinAddress)
  await bank.deployed()
  console.log('deployed bank to :', bank.address)
  return bank
}

async function deployCoin() {
  const [owner] = await ethers.getSigners()
  const Coin = await ethers.getContractFactory('Coin', {
    signer: owner,
  })
  const coin = await Coin.deploy()
  await coin.deployed()
  console.log('deployed coin to :', coin.address)
  return coin
}

async function main() {
  coin = await deployCoin()
  bank = await deployBankContract(coin.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
