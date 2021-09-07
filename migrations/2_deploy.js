const LongVault = artifacts.require('LongVault');

module.exports = async function (deployer) {
  const testBeneficiary = '0xA8EFb4035bC59ff31DFa72e04344454C2146aC10';
  await deployer.deploy(LongVault, testBeneficiary);
};
