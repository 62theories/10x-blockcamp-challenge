import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import { walletStore } from '../store'
import { Bank__factory } from '../typechain-types'

type PropsType = {
  from: string
  to: string
  amount: number
  coinSymbol: string
}

export default function FeeRender(props: PropsType) {
  const { from, to, amount, coinSymbol } = props
  const [calculatedFee, setCalculatedFee] = useState('')
  const signer = walletStore((state) => state.signer)
  const isSameWallet = async () => {
    const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
    console.log(
      '  (await bank.bankAccountNameToAddress(to))',
      await bank.bankAccountNameToAddress(to),
    )

    return (
      (await bank.bankAccountNameToAddress(from)) ===
      (await bank.bankAccountNameToAddress(to))
    )
  }
  useEffect(() => {
    ;(async () => {
      if (!(from && to && amount)) {
        setCalculatedFee('')
        return
      }
      if (!(await isSameWallet())) {
        const feeInWei = ethers.utils.parseEther(String(amount)).div(100)
        setCalculatedFee(ethers.utils.formatEther(feeInWei))
      } else {
        setCalculatedFee('')
      }
    })()
  }, [from, to, amount])
  console.log('calculatedFee', calculatedFee)

  return (
    <div>
      {calculatedFee ? (
        <div>
          <label
            htmlFor=""
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            fee 1% = {calculatedFee} {coinSymbol} | Receive ={' '}
            {ethers.utils.formatEther(
              ethers.utils
                .parseEther(String(amount))
                .sub(ethers.utils.parseEther(String(amount)).div(100)),
            )}{' '}
            {coinSymbol}
          </label>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
