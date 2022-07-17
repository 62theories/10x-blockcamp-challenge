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
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
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
      } finally {
        setIsLoading(false)
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
            <div className="bg-white p-3 mt-5">
              <div className="flex">
                <label htmlFor="" className="basis-1/2 md:basis-1/3">
                  Account Name:
                </label>
                <label htmlFor="" className="flex-3">
                  {banksAccountName}
                </label>
              </div>
              <div className="flex mt-3">
                <label htmlFor="" className="basis-1/2 md:basis-1/3">
                  Balance:
                </label>
                <label htmlFor="" className="flex-3">
                  {Number(balance).toLocaleString()} {coinSymbol}
                </label>
              </div>
              <div className="space-y-3 mt-3 md:flex md:space-y-0 md:space-x-3">
                <button
                  className="bg-[rgb(49,200,154)] text-white p-1 rounded block w-full"
                  onClick={() => {
                    router.push(`/deposit?bankAccountName=${banksAccountName}`)
                  }}
                >
                  Deposit
                </button>
                <button
                  className="bg-[rgb(56,185,224)] text-white p-1 rounded block w-full"
                  onClick={() => {
                    router.push(`/withdraw?bankAccountName=${banksAccountName}`)
                  }}
                >
                  Withdraw
                </button>
                <button
                  className="bg-[rgb(55,80,202)] text-white p-1 rounded block w-full"
                  onClick={() => {
                    router.push(`/transfer?bankAccountName=${banksAccountName}`)
                  }}
                >
                  Transfer
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  return (
    <>
      <WalletAuth>
        {isLoading ? (
          <div></div>
        ) : (
          <>
            <div className="px-5 max-w-screen-md m-auto">
              <div className="bg-white mt-5 p-3 rounded">
                <p className="text-[rgb(55,80,202)] text-xl">My Accounts</p>
                <hr className="mt-3" />
                <div className="flex mt-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">Total accounts:</p>
                    <p className="text-[rgb(51,55,97)] text-sm font-bold">
                      {banksAccount.length}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">Total balance:</p>
                    <p className="text-[rgb(51,55,97)]  text-sm  font-bold">
                      {banksAccount
                        .reduce((prev, cur) => {
                          return prev + Number(cur.balance)
                        }, 0)
                        .toLocaleString()}{' '}
                      {coinSymbol}
                    </p>
                  </div>
                </div>
              </div>
              {renderBankAccount()}
              <div
                className="border-2 p-3 mt-5 border-dashed border-gray-500 rounded flex justify-center items-center h-[150px] cursor-pointer"
                onClick={() => {
                  router.push('/create_account')
                }}
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p>create bank account</p>
                </div>
              </div>
            </div>
          </>
        )}
      </WalletAuth>
    </>
  )
}
