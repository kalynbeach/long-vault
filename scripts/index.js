module.exports = async function main (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log(`* Test Accounts: ${accounts}`);

    // Truffle contract representing the deployed instance
    const LongVault = artifacts.require('LongVault');
    const vault = await LongVault.deployed();

    const admin = await vault.admin();
    const beneficiary = await vault.beneficiary();
    console.log(`* Admin: ${admin.toString()}`);
    console.log(`* Beneficiary: ${beneficiary.toString()}`);

    // TODO: Create Release objects, add them to vault state
    // TODO: Test depositing (receiving) and releasing (sending) ETH and ERC20 tokens


    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};