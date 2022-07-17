import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import WalletAuth from '../layout/wallet_auth'
import { walletStore } from '../store'
import { Bank__factory, ERC20__factory } from '../typechain-types'

export default function Withdraw() {
  const router = useRouter()
  const [bankAccountName, setBankAccountName] = useState(
    router.query.bankAccountName as string,
  )
  const [amount, setAmount] = useState('')
  const signer = walletStore((state) => state.signer)
  const [coinSymbol, setCoinSymbol] = useState('')
  const [balance, setBalance] = useState('')
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
  return (
    <WalletAuth>
      <>
        <p>Deposit</p>
        <div>
          <label htmlFor="">Account Name:</label>
          <input type="text" value={bankAccountName} />
        </div>
        <div>
          <label htmlFor="">
            Balance: {balance} {coinSymbol}
          </label>
        </div>
        <div>
          <label htmlFor="">Deposit Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={({ target: { value } }) => {
              setAmount(value)
            }}
          />
          <label htmlFor="">{coinSymbol}</label>
        </div>
        <button
          onClick={async () => {
            const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
            const tx = await bank.withdraw(
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
          }}
        >
          Withdraw
        </button>
      </>
    </WalletAuth>
  )
}
