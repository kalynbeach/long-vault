// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LongVaultTestToken is ERC20, Ownable {

    constructor(
        address vault_,
        uint initialSupply_,
        uint initialAllowance_
    ) ERC20("LongVaultTestToken", "LVTT") {
        _mint(msg.sender, initialSupply_);
        increaseAllowance(msg.sender, initialAllowance_); /// LongVault admin
        increaseAllowance(vault_, initialAllowance_); /// LongVault
    }

    // function increaseVaultAllowance(address vault_, uint amount_) public onlyOwner {
    //     // uint currentAllowance = allowance(vault_, msg.sender);
    //     increaseAllowance(vault_, amount_);
    // }

    function mint(address to_, uint256 amount_) public onlyOwner {
        _mint(to_, amount_);
    }
}