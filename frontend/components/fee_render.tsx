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
    return (
      (await bank.bankAccountNameToAddress[from]) ===
      (await bank.bankAccountNameToAddress[to])
    )
  }
  useEffect(() => {
    if (!(from && to && amount)) {
      setCalculatedFee('')
      return
    }
    if (!isSameWallet()) {
      const feeInWei = ethers.utils.parseEther(String(amount)).div(100)
      setCalculatedFee(ethers.utils.formatEther(feeInWei))
    } else {
      setCalculatedFee('')
    }
  }, [from, to, amount])
  return (
    <div>
      {calculatedFee ? (
        <div>
          fee 1% = {calculatedFee} {coinSymbol} | Receive ={' '}
          {ethers.utils.formatEther(
            ethers.utils
              .parseEther(String(amount))
              .sub(ethers.utils.parseEther(String(amount)).div(100)),
          )}{' '}
          {coinSymbol}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
