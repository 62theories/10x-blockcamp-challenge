import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as ethers from 'ethers'
import { useEffect, useState } from 'react'
import { Bank__factory, ERC20__factory } from '../typechain-types'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import WalletAuth from '../layout/wallet_auth'
import { useRouter } from 'next/router'
import { walletStore } from '../store'

export default function Home() {
  const [banksAccount, setBankAccounts] = useState<
    {
      banksAccountName: ''
      balance: ''
    }[]
  >([])
  const [coinSymbol, setCoinSymbol] = useState('')
  const signer = walletStore((state) => state.signer)
  useEffect(() => {
    ;(async () => {
      try {
        if (signer) {
          const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
          const bankAccountsLength = (
            await bank.bankAccountsLength(walletAddress)
          ).toNumber()

          const _banksAccount = []
          for (let i = 0; i < bankAccountsLength; i++) {
            const banksAccountName = await bank.bankAccounts(walletAddress, i)
            const balance = await bank.balanceOfBankAccountName(
              banksAccountName,
            )
            _banksAccount.push({
              banksAccountName,
              balance: ethers.utils.formatEther(balance),
            })
          }
          const tokenAddress = await bank.tokenAddress()
          const _coinSymbol = await ERC20__factory.connect(
            tokenAddress,
            signer,
          ).symbol()
          setBankAccounts(_banksAccount)
          setCoinSymbol(_coinSymbol)
        }
      } catch (err) {
        console.error(err)
      }
    })()
  }, [signer])
  const router = useRouter()

  const walletAddress = walletStore((state) => state.walletAddress)
  const renderBankAccount = () => {
    return (
      <div>
        {banksAccount.map(({ banksAccountName, balance }) => {
          return (
            <div>
              <p>Account Name: {banksAccountName}</p>
              <p>
                Balance: {balance} {coinSymbol}
              </p>
              <button
                onClick={() => {
                  router.push(`/deposit?bankAccountName=${banksAccountName}`)
                }}
              >
                Deposit
              </button>
              <button
                onClick={() => {
                  router.push(`/withdraw?bankAccountName=${banksAccountName}`)
                }}
              >
                Withdraw
              </button>
              <button
                onClick={() => {
                  router.push(`/transfer?bankAccountName=${banksAccountName}`)
                }}
              >
                Transfer
              </button>
            </div>
          )
        })}
      </div>
    )
  }
  return (
    <>
      <WalletAuth>
        <p>My Accounts</p>
        {renderBankAccount()}
        <div>
          <button
            onClick={() => {
              router.push('/create_account')
            }}
          >
            create bank account
          </button>
        </div>
      </WalletAuth>
    </>
  )
}
