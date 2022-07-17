import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import FeeRender from '../components/fee_render'
import { BANK_CONTRACT_ADDRESS } from '../constant'
import WalletAuth from '../layout/wallet_auth'
import { walletStore } from '../store'
import { Bank__factory, ERC20__factory } from '../typechain-types'

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
      <div>
        <p>Transfer</p>
        <div>
          <p>from account:</p>
          <input type="text" value={bankAccountName} />
        </div>
        <div>
          <div>
            <label htmlFor="">
              Balance: {balance} {coinSymbol}
            </label>
          </div>
        </div>
        <hr />
        <p>to account</p>
        {toAccounts.map(({ accountName, amount }, indexOuterLoop) => {
          return (
            <div>
              <div>
                <label htmlFor="">Account Name:</label>
                <input
                  type="text"
                  value={accountName}
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
              <div>
                <label htmlFor="">Amount:</label>
                <input
                  type="text"
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
                <label htmlFor="">{coinSymbol}</label>
              </div>
              <FeeRender
                from={bankAccountName}
                to={accountName}
                amount={Number(amount)}
                coinSymbol={coinSymbol}
              />
              {indexOuterLoop !== 0 && (
                <button
                  onClick={() => {
                    setToAccounts(
                      toAccounts.filter(
                        (account, indexInnerLoop) =>
                          indexOuterLoop !== indexInnerLoop,
                      ),
                    )
                  }}
                >
                  remove
                </button>
              )}
            </div>
          )
        })}
        <button
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
          onClick={async () => {
            const bank = Bank__factory.connect(BANK_CONTRACT_ADDRESS, signer)
            const tx = await bank.batchTransfer(
              bankAccountName,
              toAccounts.map(({ accountName }) => accountName),
              toAccounts.map(({ amount }) => ethers.utils.parseEther(amount)),
            )
            await tx.wait()
            Swal.fire({
              title: 'transfer success',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            })
            router.push('/')
          }}
        >
          Transfer
        </button>
      </div>
    </WalletAuth>
  )
}
