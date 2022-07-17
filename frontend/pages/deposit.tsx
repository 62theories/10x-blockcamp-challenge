import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import WalletAuth from '../layout/wallet_auth'
import { walletStore } from '../store'
import { Bank__factory, ERC20__factory } from '../typechain-types'

export default function Deposit() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const signer = walletStore((state) => state.signer)
  const [bankAccountName, setBankAccountName] = useState(
    router.query.bankAccountName as string,
  )
  const [coinSymbol, setCoinSymbol] = useState('')
  const [isShowApprove, setIsShowApprove] = useState(false)
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
        <p>Deposit</p>
        <div>
          <label>Account Name:</label>
          <input type="text" value={bankAccountName} />
        </div>
        <div>
          <label htmlFor="">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={({ target: { value } }) => {
              setAmount(value)
            }}
          />
          <label htmlFor="">{coinSymbol}</label>
        </div>
        {isShowApprove ? (
          <button
            onClick={async () => {
              const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
              const tokenAddress = await bank.tokenAddress()
              const tx = await ERC20__factory.connect(
                tokenAddress,
                signer,
              ).approve(bank.address, ethers.constants.MaxUint256)
              await tx.wait()
              setIsShowApprove(false)
            }}
          >
            approve
          </button>
        ) : (
          <button
            onClick={async () => {
              const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
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
            }}
          >
            Deposit
          </button>
        )}
      </>
    </WalletAuth>
  )
}
