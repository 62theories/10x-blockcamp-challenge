// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bank is Context {
    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
        _feeCollector = _msgSender();
    }

    event BankAccountCreated(
        address indexed ownerAddress,
        string bankAccountName
    );

    mapping(address => string[]) public bankAccounts;
    mapping(address => uint256) public bankAccountsLength;
    mapping(string => address) public bankAccountNameToAddress;
    mapping(string => uint256) public balanceOfBankAccountName;
    address private _feeCollector;
    uint256 public feeBalance;
    uint256 public feePercent = 1;
    address public tokenAddress;

    modifier onlyUniqueBankAccountName(string memory bankAccountName) {
        require(
            bankAccountNameToAddress[bankAccountName] == address(0),
            "bank account name must be unique"
        );
        _;
    }

    modifier onlyExistBankAccountName(string memory bankAccountName) {
        require(
            bankAccountNameToAddress[bankAccountName] != address(0),
            "invalid bank account name"
        );
        _;
    }

    modifier onlyBankAccountOwner(string memory bankAccountName) {
        require(
            bankAccountNameToAddress[bankAccountName] == _msgSender(),
            "invalid bank account owner"
        );
        _;
    }

    modifier onlyFeeCollector() {
        require(_msgSender() == _feeCollector, "must be fee collector");
        _;
    }

    function createNewBankAccount(string memory bankAccountName)
        public
        onlyUniqueBankAccountName(bankAccountName)
    {
        bankAccountNameToAddress[bankAccountName] = _msgSender();
        bankAccounts[_msgSender()].push(bankAccountName);
        bankAccountsLength[_msgSender()] += 1;
        emit BankAccountCreated(_msgSender(), bankAccountName);
    }

    function deposit(string memory bankAccountName, uint256 amount)
        public
        onlyExistBankAccountName(bankAccountName)
        onlyBankAccountOwner(bankAccountName)
    {
        balanceOfBankAccountName[bankAccountName] += amount;
        IERC20(tokenAddress).transferFrom(_msgSender(), address(this), amount);
    }

    function withdraw(string memory bankAccountName, uint256 amount)
        public
        onlyExistBankAccountName(bankAccountName)
        onlyBankAccountOwner(bankAccountName)
    {
        require(
            balanceOfBankAccountName[bankAccountName] - amount >= 0,
            "invalid amount"
        );
        balanceOfBankAccountName[bankAccountName] -= amount;
        IERC20(tokenAddress).transfer(_msgSender(), amount);
    }

    function transfer(
        string memory from,
        string memory to,
        uint256 amount
    )
        public
        onlyExistBankAccountName(from)
        onlyExistBankAccountName(to)
        onlyBankAccountOwner(from)
    {
        require(balanceOfBankAccountName[from] - amount >= 0, "invalid amount");
        balanceOfBankAccountName[from] -= amount;
        if (bankAccountNameToAddress[from] != bankAccountNameToAddress[to]) {
            uint256 fee = ((amount * feePercent) / 100);
            feeBalance += fee;
            balanceOfBankAccountName[to] += (amount - fee);
        } else {
            balanceOfBankAccountName[to] += amount;
        }
    }

    function batchTransfer(
        string memory from,
        string[] memory to,
        uint256[] memory amount
    ) public {
        require(to.length == amount.length, "invalid to and amount length");
        for (uint256 i = 0; i < to.length; i++) {
            transfer(from, to[i], amount[i]);
        }
    }

    function collectFee() public onlyFeeCollector {
        uint256 feeToCollect = feeBalance;
        feeBalance -= feeToCollect;
        IERC20(tokenAddress).transfer(_feeCollector, feeToCollect);
    }
}
