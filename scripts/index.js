module.exports = async function main (callback) {
  try {
    // Truffle contract representing the deployed instance
    const LongVault = artifacts.require('LongVault');
    const vault = await LongVault.deployed();

    const admin = await vault.admin();
    const beneficiary = await vault.beneficiary();
    console.log(`* Admin: ${admin.toString()}`);
    console.log(`* Beneficiary: ${beneficiary.toString()} \n`);

    // TODO: Create Release objects, add them to vault state
    const linkAddress = '0x514910771af9ca656af840dff83e8264ecf986ca';
    const testLinkAmount = 10;
    const testTimestamp = 1723326570; // 08-10-2024

    console.log(`Creating an ERC20Release...`);
    await vault.createERC20Release(linkAddress, testLinkAmount, testTimestamp);
    console.log(`ERC20Release created!`);

    const erc20Releases = await vault.getERC20Releases();
    console.log(`* erc20Releases: ${erc20Releases}`);

    // TODO: Build a Release generating function
    // - Params:
    // -- ERC20 token contract <address>
    // -- Token amount <uint>
    // -- Release timestamp <uint>
    // ---- Month
    // ---- Day
    // ---- Year (depends if Release is repeated annually)
    // -- RepeatedAnnually <bool>

    function generateEtherReleases() {}

    function generateERC20Releases() {}

    // TODO: Test depositing (receiving) and releasing (sending) ETH and ERC20 tokens

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};