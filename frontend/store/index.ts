import create from 'zustand'
import * as ethers from 'ethers'

export const walletStore = create<{
  signer: ethers.ethers.providers.JsonRpcSigner
  setSigner: any
  walletAddress: string
}>((set) => ({
  signer: null,
  setSigner: async (signer) => {
    const walletAddress = await signer.getAddress()
    set((state) => {
      return { signer, walletAddress }
    })
  },
  walletAddress: '',
}))
