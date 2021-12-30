# TODOs

## Migration from Truffle to Hardhat
* Follow hardhat's [Migrating from Truffle](https://hardhat.org/guides/truffle-migration.html) guide
* Update tests as needed
  * https://ethereum.stackexchange.com/questions/90832/following-the-hardhat-tutorial-i-get-this-error-typeerror-ethers-getsigners-i
* Update deployment (migration) script
* Test locally with `long-vault` frontend

## Fix `LongVaultFactory` create2 revert error
* Once migrated to hardhat, reference OpenZeppelin Clones workshop contracts to fix `LongVaultFactory` use of `Clones.cloneDeterministic()`
  * [How to set implementation contracts for clones](https://forum.openzeppelin.com/t/how-to-set-implementation-contracts-for-clones/6085)
  * [3-Argent.test.js ](https://github.com/OpenZeppelin/workshops/blob/master/02-contracts-clone/test/3-Argent.test.js#L8)
  * [WalletFactoryClones.sol](https://github.com/OpenZeppelin/workshops/blob/master/02-contracts-clone/contracts/3-argent/WalletFactoryClones.sol)