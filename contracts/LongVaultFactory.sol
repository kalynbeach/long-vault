// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./LongVault.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/**
    LongVaultFactory: LongVault Clone factory
*/

/// TODO: Make sure longVaultImplementation (address) is set/handled correctly
/// TODO: Make sure salt for cloneDeterministic() is created correctly

contract LongVaultFactory {
    using Address for address payable;

    event LongVaultCreated(
        address payable admin,
        address payable beneficiary,
        address cloneAddress,
        uint timestamp
    );

    struct LongVaultsEntry {
        address admin;
        address beneficiary;
        address cloneAddress;
        uint timestamp;
    }

    address immutable longVaultImplementation;
    address payable implementationBeneficiary;

    LongVaultsEntry[] public allLongVaults;

    constructor() {
        longVaultImplementation = address(new LongVault());
        implementationBeneficiary = payable(msg.sender);
    }

    function createLongVault(
        address payable beneficiary_,
        bytes20 salt_
    )
        external
        returns (address payable longVaultClone)
    {
        address payable admin = payable(msg.sender);
        bytes32 salt = keccak256(abi.encodePacked(salt_, admin, beneficiary_));
        // address clone = Clones.cloneDeterministic(
        //     longVaultImplementation,
        //     salt
        // );
        // address payable cloneAddress = payable(clone);
        longVaultClone = payable(Clones.cloneDeterministic(
            longVaultImplementation,
            salt
        ));
        LongVault(longVaultClone).initialize(admin, beneficiary_);
        uint createdTimestamp = block.timestamp;
        allLongVaults.push(LongVaultsEntry({
            admin: admin,
            beneficiary: beneficiary_,
            cloneAddress: longVaultClone,
            timestamp: createdTimestamp
        }));
        emit LongVaultCreated(
            admin,
            beneficiary_,
            longVaultClone,
            createdTimestamp
        );
        return longVaultClone;
    }

    function getAllLongVaults() external view returns (LongVaultsEntry[] memory) {
        return allLongVaults;
    }

    function getLongVaultImplementation() external view returns (address) {
        return longVaultImplementation;
    }

    function getImplementationBeneficiary() external view returns (address) {
        return implementationBeneficiary;
    }
}