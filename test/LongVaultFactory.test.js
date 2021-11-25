const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();

const LongVaultFactory = contract.fromArtifact('LongVaultFactory');
const LongVault = contract.fromArtifact('LongVault');


describe('LongVaultFactory', function() {
  const [ admin, beneficiary ] = accounts;

  beforeEach(async function () {
    // TODO: Init LongVaultFactory per Clones implementation
    this.factory = await LongVaultFactory.new(admin, { from: admin, gas: 8000000 });
    // this.vault = await this.factory.createLongVault(admin, beneficiary);
    console.log(`LongVaultFactory.test vault: ${this.vault}`);
  });

  //
  // createLongVault()
  //
  it('createLongVault returns newly initialized LongVault address', async function () {
    const newLongVaultReceipt = await this.factory.createLongVault(admin, beneficiary);
    const newLongVaultAddress = newLongVaultReceipt.logs[0].args.cloneAddress;
    const newLongVault = await LongVault.at(newLongVaultAddress);
    console.log(`newLongVaultAddress: ${newLongVaultAddress}`);

    expect(typeof newLongVault === typeof LongVault);
  });
  
  //
  // getAllLongVaults()
  //
  it('getAllLongVaults returns all existing LongVaults', async function() {
    const initialLongVaults = await this.factory.getAllLongVaults();
    const initialCount = initialLongVaults.length;
    console.log(`initialCount: ${initialCount}`);
    console.log(`initialLongVaults: \n`);
    console.dir(initialLongVaults);

    await this.factory.createLongVault(admin, beneficiary);

    const endLongVaults = await this.factory.getAllLongVaults();
    const endCount = endLongVaults.length;
    console.log(`endCount: ${endCount}`);
    console.log(`endLongVaults: \n`);
    console.dir(endLongVaults);

    expect(initialCount).eq(0);
    expect(endCount).eq(1);
  });
});