import * as ethers from 'ethers'
import React from 'react'
import { useEffect, useState } from 'react'
import { walletStore } from '../store'
type PropsType = {
  children: JSX.Element | JSX.Element[]
}

export default function WalletAuth(props: PropsType) {
  const { children } = props
  const setSigner = walletStore((state) => state.setSigner)
  const walletAddress = walletStore((state) => state.walletAddress)
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    setSigner(signer)
  }

  const renderWalletAddress = () => {
    if (walletAddress) {
      return <div>{walletAddress}</div>
    } else {
      return <button onClick={connectWallet}>connect wallet</button>
    }
  }

  return (
    <>
      <div>{renderWalletAddress()}</div>
      {walletAddress ? <>{children}</> : <></>}
    </>
  )
}
