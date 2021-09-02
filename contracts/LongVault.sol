// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


// > LongVault creation
// - TODO: Read up on factory pattern, implement it as needed

// > LongVault setup
// - TODO: Ensure eth receive() works as intended
// - TODO: Figure out of fallback() is necessary

// > LongVault operation & maintainence 
// - TODO: Create release() calling mechanism
// -- Needs to check current datetime against Release struct/object timestamps

// > Web3.js
// - TODO: Start writing tests
// - TODO: Learn how Web3.js interface is involved in contract creation


contract LongVault is AccessControl {
    using Address for address payable;

    event EtherReleaseCreated(uint amount, uint releaseTime);
    event EtherDeposited(uint amount, uint releaseTime);
    event EtherReleased(uint amount, uint releaseTime);
    event ERC20ReleaseCreated(address token, uint amount, uint releaseTime);
    event ERC20Deposited(address token, uint amount, uint releaseTime);
    event ERC20Released(address token, uint amount, uint releaseTime);

    struct EtherRelease {
        uint id;
        uint amount;
        uint releaseTime;
        bool released;
        bool repeatedAnnually;
    }

    struct ERC20Release {
        uint id;
        address token;
        uint amount;
        uint releaseTime;
        bool released;
        bool repeatedAnnually;
    }

    EtherRelease[] public etherReleases;
    ERC20Release[] public erc20Releases;

    mapping(address => uint) public erc20Tokens;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BENEFICIARY_ROLE = keccak256("BENEFICIARY_ROLE");

    address public admin;
    address payable public beneficiary;
    
    uint public createdAt;
    uint public totalReleaseCount;
    uint public nextRelease;
    uint etherReleaseCount;
    uint erc20ReleaseCount;
    uint lastDepositDate;
    uint lastDepositToken;
    uint lastDepositAmount;
    
    constructor(address payable beneficiary_) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(BENEFICIARY_ROLE, beneficiary_);
        admin = msg.sender;
        beneficiary = beneficiary_;
        createdAt = block.timestamp;
    }

    /**
     * @dev Receive ETH (when msg.data is empty)
     */
    receive() external payable {
        /// TODO: Implement as needed
        emit EtherDeposited(block.timestamp, msg.value);
    }

    /**
     * @dev Called when msg.data is not empty
     */
    fallback() external payable {}

    /**
     * @dev Called when msg.data is not empty
     */
    function deposit() external payable onlyRole(ADMIN_ROLE) {
        /// uint amount = msg.value;
        emit EtherDeposited(msg.value, block.timestamp);
    }

    /**
     * @dev Called when msg.data is not empty
     * @param token_ The address of the ERC20 token to deposit.
     * @param amount_ The amount of the ERC20 token to be deposited.
     */
    function depositERC20(
        address token_,
        uint amount_
    ) external payable onlyRole(ADMIN_ROLE) {
        erc20Tokens[token_] += amount_;
        lastDepositAmount = amount_;
        lastDepositDate = block.timestamp;
        emit ERC20Deposited(token_, amount_, block.timestamp);
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
    ) public onlyRole(ADMIN_ROLE) {
        require(releaseTime_ > block.timestamp, "LongVault: release time is before current time");
        etherReleases.push(EtherRelease({
            id: etherReleaseCount,
            amount: amount_,
            releaseTime: releaseTime_,
            released: false,
            repeatedAnnually: false
        }));
        emit EtherReleaseCreated(amount_, releaseTime_);
        etherReleaseCount++;
        totalReleaseCount++;
    }

    /**
     * @dev Create and add a new ERC20 token Release
     * @param token_ The address of the ERC20 token to release.
     * @param amount_ The amount of the ERC20 token to be released.
     * @param releaseTime_ The future unix timestamp of when the release will occur.
     */
    /// TODO: Add and build support for repeatedAnnually bool param
    function createERC20Release(
        address token_,
        uint amount_,
        uint releaseTime_
    ) public onlyRole(ADMIN_ROLE) {
        require(releaseTime_ > block.timestamp, "LongVault: release time is before current time");
        erc20Releases.push(ERC20Release({
            id: erc20ReleaseCount,
            token: token_,
            amount: amount_,
            releaseTime: releaseTime_,
            released: false,
            repeatedAnnually: false
        }));
        emit ERC20ReleaseCreated(token_, amount_, releaseTime_);
        erc20ReleaseCount++;
        totalReleaseCount++;
    }

    /**
     * @dev Release ether to beneficiary.
     * @param release_ The EtherRelease object to use as the release.
     */
    function releaseEther(EtherRelease memory release_) public onlyRole(ADMIN_ROLE) {
        uint amount = release_.amount;
        beneficiary.sendValue(amount);
        emit EtherReleased(amount, block.timestamp);
    }

    /**
     * @dev Release ERC20 tokens to beneficiary.
     * @param release_ The ERC20Release object to use as the release.
     */
    function releaseERC20(ERC20Release memory release_) public onlyRole(ADMIN_ROLE) {
        address token = release_.token;
        uint amount = release_.amount;
        /// TODO: Send tokens to beneficiary wallet
        emit ERC20Released(token, amount, block.timestamp);
    }

    /**
     * @dev Get Ether balance
     */
    function getEtherBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev Get ERC20 token balances
     * @param token_ The address of the ERC20 token to get the balance of.
     */
    function getERC20Balance(address token_) public view returns (uint) {
        return erc20Tokens[token_];
    }

    /**
     * @dev Get Ether releases
     */
    function getEtherReleases() public view returns (EtherRelease[] memory) {
        return etherReleases;
    }

    /**
     * @dev Get ERC20 token releases
     */
    function getERC20Releases() public view returns (ERC20Release[] memory) {
        return erc20Releases;
    }
    
}