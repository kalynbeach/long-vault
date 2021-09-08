// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// import "./LongVaultTokens.sol";
// import "./LongVaultTestToken.sol";

// > LongVault creation
// - TODO: Read up on factory pattern, implement it as needed

// > LongVault setup
// - TODO: Ensure eth receive() works as intended
// - TODO: Figure out of fallback() is necessary

// > LongVault operation & maintainence 
// - TODO: Create release() calling mechanism
// -- Needs to check current datetime against Release struct/object timestamps


contract LongVault is AccessControl, ERC1155Holder {
    using Address for address payable;
    using SafeERC20 for IERC20;

    event EtherDeposited(uint amount, uint timestamp);
    event EtherReleaseCreated(uint amount, uint releaseTime);
    event EtherReleased(uint amount, uint releaseTime);
    event TokenDeposited(address token, uint amount, uint timestamp);
    event TokenReleaseCreated(address token, uint amount, uint releaseTime);
    event TokenReleased(address token, uint amount, uint releaseTime);

    /// TODO: Add & support uint createdTime
    struct EtherRelease {
        uint id;
        uint amount;
        uint releaseTime;
        bool released;
        bool repeatedAnnually;
    }

    /// TODO: Add & support uint createdTime
    struct TokenRelease {
        uint id;
        address token;
        uint amount;
        uint releaseTime;
        bool released;
        bool repeatedAnnually;
    }

    // LongVaultTokens public tokens;
    mapping(address => uint) public tokenIds;
    /// uint private tokenIdCount = 0;

    EtherRelease[] public etherReleases;
    TokenRelease[] public tokenReleases;

    bytes32 public constant BENEFICIARY_ROLE = keccak256("BENEFICIARY_ROLE");

    address public admin;
    address payable public beneficiary;
    
    uint public createdAt;
    uint public totalReleaseCount;
    uint public nextRelease;
    uint public etherReleaseCount;
    uint public tokenReleaseCount;
    uint public lastDepositDate;
    uint public lastDepositAmount;
    address public lastDepositToken;
    
    constructor(address payable beneficiary_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(BENEFICIARY_ROLE, beneficiary_);
        admin = msg.sender;
        beneficiary = beneficiary_;
        /// tokens = new LongVaultTokens(beneficiary_);
        createdAt = block.timestamp;
    }

    /**
     * @dev Needed for ERC1155Holder
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC1155Receiver)
        returns (bool) {
        return interfaceId == type(IERC1155).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @param token_ The address of the token contract.
     * @return the internal ERC1155 token id.
     */
    function tokenId(address token_) private view returns (uint) {
        return tokenIds[token_];
    }

    /**
     * @param token_ The address of the ERC20 token contract.
     * @return the ERC20 token being held.
     */
    function token(address token_) public view virtual returns (IERC20) {
        return IERC20(token_);
    }

    /**
     * @dev Receive ETH (when msg.data is empty)
     */
    receive() external payable {
        /// TODO: Implement as needed
        emit EtherDeposited(msg.value, block.timestamp);
    }

    /**
     * @dev Called when msg.data is not empty
     */
    fallback() external payable {
        emit EtherDeposited(msg.value, block.timestamp);
    }

    /**
     * @dev Called when msg.data is not empty
     */
    function deposit() external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        /// uint amount = msg.value;
        /// (bool success,) = address(this).call{value: msg.value}("");
        /// require(success);
        emit EtherDeposited(msg.value, block.timestamp);
    }

    /**
     * @dev Called when msg.data is not empty
     * @param token_ The address of the token to deposit.
     * @param amount_ The amount of the token to be deposited.
     */
    function depositToken(
        address token_,
        uint amount_
    ) external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20 _token = token(token_);
        _token.safeIncreaseAllowance(admin, amount_);
        _token.safeTransferFrom(admin, address(this), amount_);        
        require(
            _token.balanceOf(address(this)) >= amount_,
            "LongVault: tokens must be deposited into the vault"
        );
        emit TokenDeposited(token_, amount_, block.timestamp);
    }

    /**
     * @dev Create and add a new ether Release.
     * @param amount_ The amount of Ether to be released.
     * @param releaseTime_ The future unix timestamp of when the release will occur.
     */
    /// TODO: Add and build support for repeatedAnnually bool param
    function createEtherRelease(
        uint amount_,
        uint releaseTime_
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(releaseTime_ > block.timestamp, "LongVault: release time is before current time");
        etherReleases.push(EtherRelease({
            id: etherReleaseCount,
            amount: amount_,
            releaseTime: releaseTime_,
            released: false,
            repeatedAnnually: false
        }));
        etherReleaseCount++;
        totalReleaseCount++;
        emit EtherReleaseCreated(amount_, releaseTime_);
    }

    /**
     * @dev Create and add a new TokenRelease
     * @param token_ The address of the token to release.
     * @param amount_ The amount of the token to be released.
     * @param releaseTime_ The future unix timestamp of when the release will occur.
     */
    /// TODO: Add and build support for repeatedAnnually bool param
    function createTokenRelease(
        address token_,
        uint amount_,
        uint releaseTime_
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(releaseTime_ > block.timestamp, "LongVault: release time is before current time");
        tokenReleases.push(TokenRelease({
            id: tokenReleaseCount,
            token: token_,
            amount: amount_,
            releaseTime: releaseTime_,
            released: false,
            repeatedAnnually: false
        }));
        tokenReleaseCount++;
        totalReleaseCount++;
        emit TokenReleaseCreated(token_, amount_, releaseTime_);
    }

    /**
     * @dev Release ether to the beneficiary.
     * @param amount_ The amount of ether to release.
     */
    function releaseEther(uint amount_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            address(this).balance >= amount_,
            "LongVault: ether release amount is greater than ether balance"
        );
        /// TODO: Make sure wei/ether conversion is correct here
        beneficiary.sendValue(amount_);
        emit EtherReleased(amount_, block.timestamp);
    }

    /**
     * @dev Release tokens to the beneficiary.
     * @param token_ The token to release.
     * @param amount_ The amount of the token to release.
     */
    function releaseToken(address token_, uint amount_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20 _token = token(token_);
        uint tokenBalance = _token.balanceOf(address(this));
        /// TODO: Check for calling address approval
        require(
            tokenBalance >= amount_,
            "LongVault: token release amount is greater than token balance"
        );
        _token.safeIncreaseAllowance(address(this), amount_);
        _token.safeTransferFrom(address(this), beneficiary, amount_);
        /// tokens[token_] -= amount_;
        emit TokenReleased(token_, amount_, block.timestamp);
    }

    /**
     * @dev Get Ether balance
     */
    function getEtherBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev Get token balances
     * @param token_ The address of the token to get the balance of.
     */
    function getTokenBalance(address token_) public view returns (uint) {
        return token(token_).balanceOf(address(this));
        // return tokens.balanceOf(address(tokens), tokenId(token_));
    }

    /**
     * @dev Get Ether releases
     */
    function getEtherReleases() public view returns (EtherRelease[] memory) {
        return etherReleases;
    }

    /**
     * @dev Get token releases
     */
    function getTokenReleases() public view returns (TokenRelease[] memory) {
        return tokenReleases;
    }
    
}