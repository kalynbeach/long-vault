const LongVaultFactory = artifacts.require('LongVaultFactory');
// const LongVault = artifacts.require('LongVault');

module.exports = async function (deployer, network, accounts) {
  // const admin = accounts[0];
  const beneficiary = accounts[1];
  await deployer.deploy(LongVaultFactory, beneficiary);
};