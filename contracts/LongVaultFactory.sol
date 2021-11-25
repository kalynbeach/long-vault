// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./LongVault.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";


/**
    LongVaultFactory: LongVault Clone factory
*/


contract LongVaultFactory {
    using Address for address payable;

    event LongVaultCreated(
        address cloneAddress,
        address payable admin,
        address payable beneficiary,
        uint timestamp
    );

    struct LongVaultsEntry {
        address admin;
        address longVaultAddress;
    }

    LongVaultsEntry[] public allLongVaults;
    
    address immutable longVaultImplementation;
    address payable implementationBeneficiary;

    constructor(address payable beneficiary_) {
        longVaultImplementation = address(new LongVault());
        implementationBeneficiary = beneficiary_;
    }

    function createLongVault(
        address payable admin_,
        address payable beneficiary_
    ) external returns (address payable) {
        bytes32 salt = keccak256(abi.encodePacked(admin_));
        address clone = Clones.cloneDeterministic(
            longVaultImplementation,
            salt
        );
        /// TODO: Read up on (payable) Clones, make sure this is the move
        address payable payableClone = payable(clone);
        LongVault(payableClone).initialize(admin_, beneficiary_);
        emit LongVaultCreated(
            payableClone,
            admin_,
            beneficiary_,
            block.timestamp
        );
        allLongVaults.push(LongVaultsEntry(admin_, payableClone));
        return payableClone;
    }

    function getAllLongVaults() external view returns (LongVaultsEntry[] memory) {
        return allLongVaults;
    }
}