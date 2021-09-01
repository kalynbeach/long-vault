const LongVault = artifacts.require('LongVault');

module.exports = async function (deployer) {
  const testBeneficiary = '0x509B0f4F7d834a65517ac4Fcc834c67e1e20b68F';
  await deployer.deploy(LongVault, testBeneficiary);
};
