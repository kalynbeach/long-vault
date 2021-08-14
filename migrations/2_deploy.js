const LongVault = artifacts.require('LongVault');

module.exports = async function (deployer) {
  const testBeneficiary = '0xc6b766e76EC10966E1fd8736474b684042E0Dc05';
  await deployer.deploy(LongVault, testBeneficiary);
};
