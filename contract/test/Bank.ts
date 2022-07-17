import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Bank, Bank__factory, ERC20 } from '../typechain-types'
import { BigNumber } from 'ethers'

describe('Bank', function () {
  let bank: Bank
  let coin: ERC20
  const createAccount = async (toCreateBankAccountName: string) => {
    const tx = await bank.createNewBankAccount(toCreateBankAccountName)
    const receipt = await tx.wait()
    const event = receipt.events?.find(
      (event) => event.event === 'BankAccountCreated',
    )
    const createdBankAccountName: string = event!.args?.[1]
    expect(createdBankAccountName).to.be.equal(toCreateBankAccountName)
  }
  const createFirstAccount = async () => {
    await createAccount('test1')
  }
  const createSecondAccount = async () => {
    await createAccount('test2')
  }
  const createThirdAccount = async () => {
    await createAccount('test3')
  }
  this.beforeEach(async function () {
    coin = await deployCoin()
    bank = await deployBankContract(coin.address)
  })
  async function deployBankContract(coinAddress: string) {
    const [owner, otherAccount] = await ethers.getSigners()
    const Bank = await ethers.getContractFactory('Bank', {
      signer: owner,
    })
    const bank = await Bank.deploy(coinAddress)
    return bank
  }
  async function deployCoin() {
    const [owner, otherAccount] = await ethers.getSigners()
    const Coin = await ethers.getContractFactory('Coin', {
      signer: owner,
    })
    const coin = await Coin.deploy()
    return coin
  }
  describe('create account', async function () {
    it('can create a bank account with specified name', async function () {
      await createAccount('test1')
    })
    it('can create bank accounts', async function () {
      await createFirstAccount()
      await createSecondAccount()
    })
    it('can not create a not unique bank account name', async function () {
      const name = 'test1'
      const createAccountWithUnUniqueName = async () => {
        const toCreateBankAccountName = name
        await expect(
          bank.createNewBankAccount(toCreateBankAccountName),
        ).to.revertedWith('bank account name must be unique')
      }
      await createAccount(name)
      await createAccountWithUnUniqueName()
    })
  })

  describe('list accounts', async function () {
    it('can list bank account names of address with balance', async function () {
      const getBankAccountsOfAddress = async () => {
        const [owner, otherAccount] = await ethers.getSigners()
        const createdFirstAccount = await bank.bankAccounts(owner.address, 0)
        const createdSecondAccount = await bank.bankAccounts(owner.address, 1)
        expect(createdFirstAccount).to.equal('test1')
        expect(createdSecondAccount).to.equal('test2')
        await expect(
          await bank.balanceOfBankAccountName(createdFirstAccount),
        ).to.equal(BigNumber.from(0))
        await expect(
          await bank.balanceOfBankAccountName(createdSecondAccount),
        ).to.equal(BigNumber.from(0))
      }
      await createFirstAccount()
      await createSecondAccount()
      await getBankAccountsOfAddress()
    })
  })
  it('can deposit erc20 by specifing valid account name, arbiraty amount', async function () {
    const depositAmount = 10
    const [owner, otherAccount] = await ethers.getSigners()
    await createFirstAccount()
    const balanceWalletBeforeDeposit = await coin.balanceOf(owner.address)
    const balanceBankBeforeDeposit = await coin.balanceOf(bank.address)
    const balanceInBankBeforeDeposit = await bank.balanceOfBankAccountName(
      'test1',
    )
    await coin.approve(bank.address, depositAmount)
    await bank.deposit('test1', depositAmount)
    const balanceWalletAfterDeposit = await coin.balanceOf(owner.address)
    const balanceBankAfterDeposit = await coin.balanceOf(bank.address)
    const balanceInBankAfterDeposit = await bank.balanceOfBankAccountName(
      'test1',
    )
    expect(balanceWalletBeforeDeposit.sub(depositAmount)).to.equal(
      balanceWalletAfterDeposit,
    )
    expect(balanceInBankBeforeDeposit.add(depositAmount)).to.equal(
      balanceInBankAfterDeposit,
    )
    expect(balanceBankBeforeDeposit.add(depositAmount)).to.equal(
      balanceBankAfterDeposit,
    )
  })
  it('can withdraw erc20 by specifing valid account name, arbiraty amount', async function () {
    const withdrawAmount = 10
    const depositAmount = 10
    const [owner, otherAccount] = await ethers.getSigners()
    await createFirstAccount()
    await coin.approve(bank.address, ethers.constants.MaxUint256)
    await bank.deposit('test1', depositAmount)
    const balanceWalletBeforeWithdraw = await coin.balanceOf(owner.address)
    const balanceBankBeforeWithdraw = await coin.balanceOf(bank.address)
    const balanceInBankBeforeWithdraw = await bank.balanceOfBankAccountName(
      'test1',
    )
    await bank.withdraw('test1', withdrawAmount)
    const balanceWalletAfterWithdraw = await coin.balanceOf(owner.address)
    const balanceBankAfterWithdraw = await coin.balanceOf(bank.address)
    const balanceInBankAfterWithdraw = await bank.balanceOfBankAccountName(
      'test1',
    )
    expect(balanceWalletBeforeWithdraw.add(withdrawAmount)).to.equal(
      balanceWalletAfterWithdraw,
    )
    expect(balanceBankBeforeWithdraw.sub(withdrawAmount)).to.equal(
      balanceBankAfterWithdraw,
    )
    expect(balanceInBankBeforeWithdraw.sub(withdrawAmount)).to.equal(
      balanceInBankAfterWithdraw,
    )
  })
  it('can transfer erc20 by specifing valid account name, arbiraty amount', async function () {
    const depositAmount = 10
    const transferAmount = 10
    await createFirstAccount()
    await createSecondAccount()
    await coin.approve(bank.address, ethers.constants.MaxUint256)
    await bank.deposit('test1', depositAmount)
    const balanceOfFirstAccountBeforeTransfer = await bank.balanceOfBankAccountName(
      'test1',
    )
    const balanceOfSecondAccountBeforeTransfer = await bank.balanceOfBankAccountName(
      'test2',
    )
    await bank.transfer('test1', 'test2', transferAmount)
    const balanceOfFirstAccountAfterTransfer = await bank.balanceOfBankAccountName(
      'test1',
    )
    const balanceOfSecondAccountAfterTransfer = await bank.balanceOfBankAccountName(
      'test2',
    )
    expect(balanceOfFirstAccountBeforeTransfer.sub(transferAmount)).to.equal(
      balanceOfFirstAccountAfterTransfer,
    )
    expect(balanceOfSecondAccountBeforeTransfer.add(transferAmount)).to.equal(
      balanceOfSecondAccountAfterTransfer,
    )
  })
  it('can transfer to other accounts that is not yours, the contract must deduct 1% of the transferred amount as a platform fee.', async function () {
    const depositAmount = ethers.utils.parseEther('10')
    const transferAmount = ethers.utils.parseEther('10')
    const [owner, otherAccount] = await ethers.getSigners()
    await createFirstAccount()
    bank = Bank__factory.connect(bank.address, otherAccount)
    await createSecondAccount()
    await coin.approve(bank.address, ethers.constants.MaxUint256)
    bank = Bank__factory.connect(bank.address, owner)
    await coin.approve(bank.address, ethers.constants.MaxUint256)
    await bank.deposit('test1', depositAmount)
    const feeBalanceBeforeTransfer = await bank.feeBalance()
    const balanceOfSecondAccountBeforeTransfer = await bank.balanceOfBankAccountName(
      'test2',
    )
    await bank.transfer('test1', 'test2', transferAmount)
    const feeBalanceAfterTransfer = await bank.feeBalance()
    const balanceOfSecondAccountAfterTransfer = await bank.balanceOfBankAccountName(
      'test2',
    )
    const feeDeducted = BigNumber.from(transferAmount).div(100)
    const transferAmountMinusfee = BigNumber.from(transferAmount).sub(
      feeDeducted,
    )
    expect(feeBalanceBeforeTransfer.add(feeDeducted)).to.equal(
      feeBalanceAfterTransfer,
    )
    expect(
      balanceOfSecondAccountBeforeTransfer.add(transferAmountMinusfee),
    ).to.equal(balanceOfSecondAccountAfterTransfer)
  })
  it('transfer the ERC 20 token that is in the balance of my account to multiple accounts at the same time through the list of account names.', async function () {
    const depositAmount = ethers.utils.parseEther('10')
    const transferAmount = ethers.utils.parseEther('1')
    await createFirstAccount()
    await createSecondAccount()
    await createThirdAccount()
    await coin.approve(bank.address, ethers.constants.MaxUint256)
    await bank.deposit('test1', depositAmount)
    const balanceOfSecondAccountBeforeTransfer = await bank.balanceOfBankAccountName(
      'test2',
    )
    const balanceOfThirdAccountBeforeTransfer = await bank.balanceOfBankAccountName(
      'test3',
    )
    await bank.batchTransfer(
      'test1',
      ['test2', 'test3'],
      [transferAmount, transferAmount],
    )
    const balanceOfSecondAccountAfterTransfer = await bank.balanceOfBankAccountName(
      'test2',
    )
    const balanceOfThirdAccountAfterTransfer = await bank.balanceOfBankAccountName(
      'test3',
    )
    expect(balanceOfSecondAccountBeforeTransfer.add(transferAmount)).to.equal(
      balanceOfSecondAccountAfterTransfer,
    )
    expect(balanceOfThirdAccountBeforeTransfer.add(transferAmount)).to.equal(
      balanceOfThirdAccountAfterTransfer,
    )
  })
})
