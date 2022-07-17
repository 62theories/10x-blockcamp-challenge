import { useState } from 'react'
import * as ethers from 'ethers'
import { Bank__factory } from '../typechain-types'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import WalletAuth from '../layout/wallet_auth'
import { walletStore } from '../store'

export default function CreateAccount() {
  const signer = walletStore((state) => state.signer)
  const router = useRouter()
  const [bankAccountName, setBankAccountName] = useState('')
  const createBankAccount = async () => {
    try {
      const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
      const tx = await bank.createNewBankAccount(bankAccountName)
      await tx.wait()
      Swal.fire({
        title: 'create bank account success',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
      router.push('/')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <WalletAuth>
      <div>
        <p>Create Your bank account</p>
        <div>
          <p>Account Name:</p>
          <input
            type="text"
            value={bankAccountName}
            onChange={({ target: { value } }) => {
              setBankAccountName(value)
            }}
          />
        </div>
        <button onClick={createBankAccount}>Create</button>
      </div>
    </WalletAuth>
  )
}
