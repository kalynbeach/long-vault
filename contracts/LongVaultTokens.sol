// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract LongVaultTokens is ERC1155, AccessControl {
    using Address for address payable;

    event TokensDeposited(uint id, uint amount, uint timestamp);
    event TokensReleased(uint id, uint amount, uint timestamp);

    address public admin;
    address payable public beneficiary;

    bytes32 public constant BENEFICIARY_ROLE = keccak256("BENEFICIARY_ROLE");

    uint public lastDepositTokenId;
    uint public lastDepositAmount;
    uint public lastDepositDate;

    constructor(address payable beneficiary_) ERC1155("") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(BENEFICIARY_ROLE, beneficiary_);
        admin = msg.sender;
        beneficiary = beneficiary_;
    }

    /**
     * @dev Deposit tokens from the admin into the beneficiary's vault.
     * @param tokenId_ The id of the token to deposit.
     * @param amount_ The amount of the token to be deposited.
     */
    function deposit(
        uint tokenId_,
        uint amount_
    ) external payable onlyRole(DEFAULT_ADMIN_ROLE) {        
        safeTransferFrom(
            admin,
            address(this),
            tokenId_,
            amount_,
            msg.data
        );
        lastDepositTokenId = tokenId_;
        lastDepositAmount = amount_;
        lastDepositDate = block.timestamp;
        emit TokensDeposited(tokenId_, amount_, block.timestamp);
    }

    /**
     * @dev Release tokens to beneficiary.
     * @param tokenId_ The id of the token to release.
     * @param amount_ The amount of the token to release.
     */
    function release(uint tokenId_, uint amount_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint tokenBalance = balanceOf(address(this), tokenId_);
        require(
            tokenBalance >= amount_,
            "LongVault: token release amount is greater than token balance"
        );
        safeTransferFrom(
            address(this),
            beneficiary,
            tokenId_,
            amount_,
            msg.data
        );
        emit TokensReleased(tokenId_, amount_, block.timestamp);
    }

    /**
     * @dev Needed for ERC1155
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}