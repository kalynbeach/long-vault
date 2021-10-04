// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


/// > LongVault creation
/// - TODO: Read up on factory pattern, implement it as needed

/// > LongVault setup
/// - TODO: Figure out of fallback() is necessary

/// > LongVault operation & maintainence 
/// - TODO: Create release() calling mechanism
/// -- Needs to check current datetime against Release struct/object timestamps


contract LongVault is AccessControl, Initializable {
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

    EtherRelease[] public etherReleases;
    TokenRelease[] public tokenReleases;

    bytes32 public constant BENEFICIARY_ROLE = keccak256("BENEFICIARY_ROLE");

    address payable public admin;
    address payable public beneficiary;
    
    uint public createdAt;
    uint public totalReleaseCount;
    uint public nextRelease;
    uint public etherReleaseCount;
    uint public tokenReleaseCount;
    uint public lastDepositDate;
    uint public lastDepositAmount;
    address public lastDepositToken;

    /// TODO: Implement initialize function
    function initialize(
        address payable admin_,
        address payable beneficiary_
    ) public virtual initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, admin_);
        _setupRole(BENEFICIARY_ROLE, beneficiary_);
        admin = admin_;
        beneficiary = beneficiary_;
        createdAt = block.timestamp;
    }
    
    // constructor(address payable beneficiary_) {
    //     _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    //     _setupRole(BENEFICIARY_ROLE, beneficiary_);
    //     admin = msg.sender;
    //     beneficiary = beneficiary_;
    //     createdAt = block.timestamp;
    // }

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
     * @param token_ The address of the ERC20 token contract.
     * @return the ERC20 token being held.
     */
    function token(address token_) public view virtual returns (IERC20) {
        return IERC20(token_);
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

    /// TODO: Add and build support for repeatedAnnually bool param
    /**
     * @dev Create and add a new ether Release.
     * @param amount_ The amount of Ether to be released.
     * @param releaseTime_ The future unix timestamp of when the release will occur.
     */
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

    /// TODO: Add and build support for repeatedAnnually bool param
    /**
     * @dev Create and add a new TokenRelease
     * @param token_ The address of the token to release.
     * @param amount_ The amount of the token to be released.
     * @param releaseTime_ The future unix timestamp of when the release will occur.
     */
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