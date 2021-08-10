const LongVault = artifacts.require('LongVault');

module.exports = async function (deployer) {
  const testBeneficiary = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';
  await deployer.deploy(LongVault, testBeneficiary);
};
