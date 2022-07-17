/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface BankInterface extends utils.Interface {
  functions: {
    "balanceOfBankAccountName(string)": FunctionFragment;
    "bankAccountNameToAddress(string)": FunctionFragment;
    "bankAccounts(address,uint256)": FunctionFragment;
    "bankAccountsLength(address)": FunctionFragment;
    "batchTransfer(string,string[],uint256[])": FunctionFragment;
    "collectFee()": FunctionFragment;
    "createNewBankAccount(string)": FunctionFragment;
    "deposit(string,uint256)": FunctionFragment;
    "feeBalance()": FunctionFragment;
    "feePercent()": FunctionFragment;
    "tokenAddress()": FunctionFragment;
    "transfer(string,string,uint256)": FunctionFragment;
    "withdraw(string,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balanceOfBankAccountName"
      | "bankAccountNameToAddress"
      | "bankAccounts"
      | "bankAccountsLength"
      | "batchTransfer"
      | "collectFee"
      | "createNewBankAccount"
      | "deposit"
      | "feeBalance"
      | "feePercent"
      | "tokenAddress"
      | "transfer"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "balanceOfBankAccountName",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "bankAccountNameToAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "bankAccounts",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "bankAccountsLength",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "batchTransfer",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "collectFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createNewBankAccount",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "feeBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "feePercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "balanceOfBankAccountName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bankAccountNameToAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bankAccounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bankAccountsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "collectFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createNewBankAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feePercent", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "BankAccountCreated(address,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BankAccountCreated"): EventFragment;
}

export interface BankAccountCreatedEventObject {
  ownerAddress: string;
  bankAccountName: string;
}
export type BankAccountCreatedEvent = TypedEvent<
  [string, string],
  BankAccountCreatedEventObject
>;

export type BankAccountCreatedEventFilter =
  TypedEventFilter<BankAccountCreatedEvent>;

export interface Bank extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BankInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balanceOfBankAccountName(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    bankAccountNameToAddress(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    bankAccounts(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    bankAccountsLength(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    batchTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>[],
      amount: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    collectFee(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createNewBankAccount(
      bankAccountName: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deposit(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    feeBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    feePercent(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenAddress(overrides?: CallOverrides): Promise<[string]>;

    transfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  balanceOfBankAccountName(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  bankAccountNameToAddress(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  bankAccounts(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  bankAccountsLength(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  batchTransfer(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>[],
    amount: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  collectFee(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createNewBankAccount(
    bankAccountName: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deposit(
    bankAccountName: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  feeBalance(overrides?: CallOverrides): Promise<BigNumber>;

  feePercent(overrides?: CallOverrides): Promise<BigNumber>;

  tokenAddress(overrides?: CallOverrides): Promise<string>;

  transfer(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    bankAccountName: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    balanceOfBankAccountName(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bankAccountNameToAddress(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    bankAccounts(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    bankAccountsLength(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>[],
      amount: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    collectFee(overrides?: CallOverrides): Promise<void>;

    createNewBankAccount(
      bankAccountName: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    deposit(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    feeBalance(overrides?: CallOverrides): Promise<BigNumber>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    tokenAddress(overrides?: CallOverrides): Promise<string>;

    transfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "BankAccountCreated(address,string)"(
      ownerAddress?: PromiseOrValue<string> | null,
      bankAccountName?: null
    ): BankAccountCreatedEventFilter;
    BankAccountCreated(
      ownerAddress?: PromiseOrValue<string> | null,
      bankAccountName?: null
    ): BankAccountCreatedEventFilter;
  };

  estimateGas: {
    balanceOfBankAccountName(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bankAccountNameToAddress(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bankAccounts(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bankAccountsLength(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>[],
      amount: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    collectFee(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createNewBankAccount(
      bankAccountName: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deposit(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    feeBalance(overrides?: CallOverrides): Promise<BigNumber>;

    feePercent(overrides?: CallOverrides): Promise<BigNumber>;

    tokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOfBankAccountName(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bankAccountNameToAddress(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bankAccounts(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bankAccountsLength(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>[],
      amount: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    collectFee(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createNewBankAccount(
      bankAccountName: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    feeBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feePercent(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      bankAccountName: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}