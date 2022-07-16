// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Bank is Context {
    address tokenAddress;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
        _feeCollector = _msgSender();
    }

    event BankAccountCreated(
        address indexed ownerAddress,
        string bankAccountName
    );

    mapping(address => string[]) public bankAccounts;
    mapping(string => address) public bankAccountNameToAddress;
    mapping(string => uint256) public balanceOfBankAccountName;
    address private _feeCollector;
    uint256 public feeBalance;
    uint256 public feePercent = 1;

    function createNewBankAccount(string memory bankAccountName) public {
        require(
            bankAccountNameToAddress[bankAccountName] == address(0),
            "bank account name must be unique"
        );
        bankAccountNameToAddress[bankAccountName] = _msgSender();
        bankAccounts[_msgSender()].push(bankAccountName);
        emit BankAccountCreated(_msgSender(), bankAccountName);
    }

    function deposit(string memory bankAccountName, uint256 amount) public {
        require(
            bankAccountNameToAddress[bankAccountName] != address(0),
            "invalid bank account name"
        );
        require(
            bankAccountNameToAddress[bankAccountName] == _msgSender(),
            "invalid bank account owner"
        );
        balanceOfBankAccountName[bankAccountName] += amount;
        IERC20(tokenAddress).transferFrom(_msgSender(), address(this), amount);
    }

    function withdraw(string memory bankAccountName, uint256 amount) public {
        require(
            bankAccountNameToAddress[bankAccountName] != address(0),
            "invalid bank account name"
        );
        require(
            bankAccountNameToAddress[bankAccountName] == _msgSender(),
            "invalid bank account owner"
        );
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
    ) public {
        require(
            bankAccountNameToAddress[from] != address(0),
            "invalid bank account name"
        );
        require(
            bankAccountNameToAddress[to] != address(0),
            "invalid bank account name"
        );
        require(
            bankAccountNameToAddress[from] == _msgSender(),
            "invalid bank account owner"
        );
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

    function collectFee() public {
        require(_msgSender() == _feeCollector, "must be fee collector");
        uint256 feeToCollect = feeBalance;
        feeBalance -= feeToCollect;
        IERC20(tokenAddress).transfer(_feeCollector, feeToCollect);
    }
}
