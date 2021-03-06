import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import WalletAuth from '../layout/wallet_auth'
import { walletStore } from '../store'
import { Bank__factory, ERC20__factory } from '../typechain-types'
import { getErrorMessage } from '../utils/get_error_message'

export default function Deposit() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const signer = walletStore((state) => state.signer)
  const [bankAccountName, setBankAccountName] = useState(
    router.query.bankAccountName as string,
  )
  const [coinSymbol, setCoinSymbol] = useState('')
  const [isShowApprove, setIsShowApprove] = useState(false)
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
  return (
    <WalletAuth>
      <>
        <div className="px-5 max-w-screen-md m-auto">
          <div className="bg-white mt-5 p-3 rounded">
            <p className="text-[rgb(55,80,202)] text-xl">Deposit</p>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Account Name:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Account Name"
                value={bankAccountName}
                onChange={({ target: { value } }) => {
                  setBankAccountName(value)
                }}
              ></input>
            </div>
            <div className="mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount:
              </label>
              <div className="relative">
                <input
                  className="shadow pr-[70px] appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  onChange={({ target: { value } }) => {
                    setAmount(value)
                  }}
                ></input>
                <label htmlFor="" className="absolute top-2 right-5">
                  {coinSymbol}
                </label>
              </div>
            </div>
            {isShowApprove ? (
              <button
                disabled={isLoading}
                className="bg-[rgb(56,185,224)] text-white p-1 rounded block w-full md:w-fit md:px-5 md:ml-auto mt-5 py-2 disabled:bg-gray-400 cursor-pointer"
                onClick={async () => {
                  try {
                    setIsLoading(true)
                    const bank = Bank__factory.connect(
                      BANK_CONTRACT_ADDRESS,
                      signer,
                    )
                    const tokenAddress = await bank.tokenAddress()
                    const tx = await ERC20__factory.connect(
                      tokenAddress,
                      signer,
                    ).approve(bank.address, ethers.constants.MaxUint256)
                    await tx.wait()
                    setIsShowApprove(false)
                  } catch (err) {
                    const errorMessage = getErrorMessage(err.message as string)
                    let errorMessageDisplay =
                      errorMessage || 'approve token error'
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
                    Approve
                  </label>
                )}
              </button>
            ) : (
              <button
                disabled={isLoading || !amount || !bankAccountName}
                className="bg-[rgb(56,185,224)] text-white p-1 rounded block w-full md:w-fit md:px-5 md:ml-auto mt-5 py-2 disabled:bg-gray-400 cursor-pointer"
                onClick={async () => {
                  try {
                    setIsLoading(true)
                    const bank = Bank__factory.connect(
                      BANK_CONTRACT_ADDRESS,
                      signer,
                    )
                    const tokenAddress = await bank.tokenAddress()
                    const allowance = await ERC20__factory.connect(
                      tokenAddress,
                      signer,
                    ).allowance(await signer.getAddress(), bank.address)
                    if (allowance.lt(ethers.utils.parseEther(amount))) {
                      setIsShowApprove(true)
                    } else {
                      const tx = await bank.deposit(
                        bankAccountName,
                        ethers.utils.parseEther(amount),
                      )
                      await tx.wait()
                      Swal.fire({
                        title: 'deposit success',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                      })
                      router.push('/')
                    }
                  } catch (err) {
                    const errorMessage = getErrorMessage(err.message as string)
                    let errorMessageDisplay = errorMessage || 'deposit error'
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
                    Deposit
                  </label>
                )}
              </button>
            )}
          </div>
        </div>
      </>
    </WalletAuth>
  )
}
