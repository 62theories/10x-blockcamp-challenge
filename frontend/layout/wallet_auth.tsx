import * as ethers from 'ethers'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect, useState } from 'react'
import { walletStore } from '../store'
type PropsType = {
  children: JSX.Element | JSX.Element[]
}

export default function WalletAuth(props: PropsType) {
  const { children } = props
  const router = useRouter()
  const setSigner = walletStore((state) => state.setSigner)
  const walletAddress = walletStore((state) => state.walletAddress)
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    setSigner(signer)
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 6,
      address.length - 1,
    )}`
  }

  const renderWalletAddress = () => {
    if (walletAddress) {
      return (
        <div className="bg-[rgb(42,204,163)] rounded px-2 py-1">
          {formatAddress(walletAddress)}
        </div>
      )
    } else {
      return (
        <button
          className="bg-[rgb(42,204,163)] rounded px-2 py-1"
          onClick={connectWallet}
        >
          connect wallet
        </button>
      )
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="bg-[rgb(55,80,202)] px-5 py-3 flex text-white justify-between items-center overflow-hidden">
          <p
            onClick={() => {
              router.push('/')
            }}
          >
            10xBank
          </p>
          {renderWalletAddress()}
        </div>
        <div className="flex-1 bg-[rgb(239,240,245)]">
          {walletAddress ? <>{children}</> : <></>}
        </div>
      </div>
    </>
  )
}
