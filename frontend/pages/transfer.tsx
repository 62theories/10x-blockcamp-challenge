import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import FeeRender from '../components/fee_render'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import WalletAuth from '../layout/wallet_auth'
import { walletStore } from '../store'
import { Bank__factory, ERC20__factory } from '../typechain-types'
import { getErrorMessage } from '../utils/get_error_message'

export default function Transfer() {
  const router = useRouter()
  const [bankAccountName, setBankAccountName] = useState(
    router.query.bankAccountName as string,
  )
  const signer = walletStore((state) => state.signer)
  const [balance, setBalance] = useState('')
  const [coinSymbol, setCoinSymbol] = useState('')
  const [toAccounts, setToAccounts] = useState([
    {
      accountName: '',
      amount: '',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    ;(async () => {
      if (signer) {
        const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
        const tokenAddress = await bank.tokenAddress()
        const _coinSymbol = await ERC20__factory.connect(
          tokenAddress,
          signer,
        ).symbol()
        setCoinSymbol(_coinSymbol)
      }
    })()
  }, [signer])
  useEffect(() => {
    ;(async () => {
      if (signer && bankAccountName) {
        try {
          const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
          const _balance = await bank.balanceOfBankAccountName(bankAccountName)
          setBalance(ethers.utils.formatEther(_balance))
        } catch (err) {
          setBalance('')
        }
      }
    })()
  }, [signer, bankAccountName])
  const isEmptyAccountName = () =>
    toAccounts.find(({ accountName }) => {
      return !accountName
    })
  const isEmptyAmount = () =>
    toAccounts.find(({ amount }) => {
      return !amount
    })
  return (
    <WalletAuth>
      <div className="px-5 max-w-screen-md m-auto">
        <div className="bg-white mt-5 p-3 rounded">
          <p className="text-[rgb(55,80,202)] text-xl">Transfer</p>
          <div className="mt-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              From account:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="From account"
              value={bankAccountName}
              onChange={({ target: { value } }) => {
                setBankAccountName(value)
              }}
            ></input>
          </div>
          <div className="mt-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Account balance: {balance} {coinSymbol}
            </label>
          </div>
          <hr />
          <div className="my-3 flex items-center">
            <label className="text-gray-700 text-sm font-bold mb-2 mb-0">
              To account:
            </label>
          </div>
          {toAccounts.map(({ accountName, amount }, indexOuterLoop) => {
            return (
              <div>
                <div>
                  <div className="flex justify-between mt-3">
                    {' '}
                    <p className="block text-gray-700 text-sm font-bold my-2">
                      #{indexOuterLoop + 1}
                    </p>
                    {indexOuterLoop !== 0 && (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded disabled:bg-gray-400 cursor-pointer"
                        onClick={() => {
                          setToAccounts(
                            toAccounts.filter(
                              (account, indexInnerLoop) =>
                                indexOuterLoop !== indexInnerLoop,
                            ),
                          )
                        }}
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor=""
                  >
                    Account Name:
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={accountName}
                    placeholder="accountName"
                    onChange={({ target: { value } }) => {
                      setToAccounts(
                        toAccounts.map((account, indexInnerLoop) => {
                          if (indexOuterLoop === indexInnerLoop) {
                            account.accountName = value
                          }
                          return account
                        }),
                      )
                    }}
                  />
                </div>
                <div className="mt-3">
                  <label
                    htmlFor=""
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Amount:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="amount"
                      value={amount}
                      onChange={({ target: { value } }) => {
                        setToAccounts(
                          toAccounts.map((account, indexInnerLoop) => {
                            if (indexOuterLoop === indexInnerLoop) {
                              account.amount = value
                            }
                            return account
                          }),
                        )
                      }}
                    />
                    <label htmlFor="" className="absolute top-2 right-5">
                      {coinSymbol}
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <FeeRender
                    from={bankAccountName}
                    to={accountName}
                    amount={Number(amount)}
                    coinSymbol={coinSymbol}
                  />
                </div>
                <hr className="mt-3" />
              </div>
            )
          })}
          <div className="md:flex md:justify-between md:mt-3">
            <button
              className="bg-[rgb(56,185,224)] w-full md:w-fit text-white px-2 py-1 rounded disabled:bg-gray-400 cursor-pointer"
              onClick={() => {
                setToAccounts([
                  ...toAccounts,
                  {
                    accountName: '',
                    amount: '',
                  },
                ])
              }}
            >
              add account
            </button>
            <button
              disabled={
                isLoading ||
                !bankAccountName ||
                !!isEmptyAccountName() ||
                !!isEmptyAmount()
              }
              className="bg-green-500 mt-3 md:mt-0 w-full md:w-fit text-white px-2 py-1 rounded disabled:bg-gray-400 cursor-pointer"
              onClick={async () => {
                try {
                  setIsLoading(true)
                  const bank = Bank__factory.connect(
                    BANK_CONTRACT_ADDRESS,
                    signer,
                  )
                  const tx = await bank.batchTransfer(
                    bankAccountName,
                    toAccounts.map(({ accountName }) => accountName),
                    toAccounts.map(({ amount }) =>
                      ethers.utils.parseEther(amount),
                    ),
                  )
                  await tx.wait()
                  Swal.fire({
                    title: 'transfer success',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                  router.push('/')
                } catch (err) {
                  const errorMessage = getErrorMessage(err.message as string)
                  let errorMessageDisplay =
                    errorMessage || 'transfer token error'
                  Swal.fire({
                    title: errorMessageDisplay,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="mx-auto w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-300 inline "
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <label htmlFor="" className="ml-3">
                    processing
                  </label>
                </>
              ) : (
                <label htmlFor="" className="cursor-pointer">
                  Transfer
                </label>
              )}
            </button>
          </div>
        </div>
      </div>
    </WalletAuth>
  )
}
