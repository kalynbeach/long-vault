module.exports = async function main (callback) {
  try {
    // Init: Truffle contract representing the deployed instance
    const LongVault = artifacts.require('LongVault');
    const vault = await LongVault.deployed();

    async function logAddresses() {
      const admin = await vault.admin();
      const beneficiary = await vault.beneficiary();
      console.log(`* Admin: ${admin.toString()}`);
      console.log(`* Beneficiary: ${beneficiary.toString()} \n`);
    }

    // - Params:
    // -- ETH amount <uint> (need to handle wei conversion)
    // -- Release timestamp <uint> (month/day/year -> need to handle unix conversion)
    // [ -- RepeatedAnnually <bool> ]
    async function createEtherRelease(etherAmount, releaseTimestamp) {
      // TODO: Ether <-> wei conversion
      // TODO: releaseTimestamp validation (valid unix timestamp, not in the past)
      console.log(`Creating an EtherRelease...`);
      await vault.createEtherRelease(etherAmount, releaseTimestamp);
      return new Promise(resolve => {
        console.log(`* EtherRelease created: ${etherAmount} ETH on ${releaseTimestamp}`);
        resolve();
      });
    }

    // - Params:
    // -- ERC20 token contract <address>
    // -- Token amount <uint>
    // -- Release timestamp <uint> (month/day/year -> need to handle unix conversion)s
    // [ -- RepeatedAnnually <bool> ]
    async function createERC20Release(tokenAddress, tokenAmount, releaseTimestamp) {
      // TODO: Param validation
      // TODO: Error handling
      console.log(`Creating an ERC20Release...`);
      await vault.createERC20Release(tokenAddress, tokenAmount, releaseTimestamp);
      return new Promise(resolve => {
        console.log(`* ERC20Release created: ${tokenAmount} of ${tokenAddress} on ${releaseTimestamp}`);
        resolve();
      });
    }

    // TODO: Replace with actual unit tests (using Chai assertions)
    async function testReleaseCreation() {
      const testReleaseTimestamp = 1723326570; // 08-10-2024
      const testEtherAmount = 1;
      const linkAddress = '0x514910771af9ca656af840dff83e8264ecf986ca';
      const testLinkAmount = 10;

      await createEtherRelease(testEtherAmount, testReleaseTimestamp);
      await createERC20Release(linkAddress, testLinkAmount, testReleaseTimestamp);

      console.log(`*** DONE`);
    }

    await testReleaseCreation();

    // TODO: Test depositing (receiving) and releasing (sending) ETH and ERC20 tokens

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};