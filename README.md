# long-vault-contracts

**LongVault Smart Contracts**

> Time-locked ether & token vaults: a way to give & invest in others.

LongVault React App Frontend: [long-vault](https://github.com/kalynbeach/long-vault)

## Local Development

* Start local blockchain using truffle develop:
  * `npx truffle develop`
* Deploy contracts via truffle migrations:
  * `npx truffle migrate`


## TODOs

### Migration from Truffle to Hardhat
* Create & switch to `hardhat` branch
* Read hardhat's [Getting Started](https://hardhat.org/getting-started/) guide
* Follow hardhat's [Migrating from Truffle](https://hardhat.org/guides/truffle-migration.html) guide
* Update tests as needed

### Fix `LongVaultFactory` create2 revert
* Once migrated to hardhat, reference OpenZeppelin Clones workshop contracts to fix `LongVaultFactory` use of `Clones.cloneDeterministic()`

