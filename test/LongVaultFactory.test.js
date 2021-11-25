const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();

const LongVaultFactory = contract.fromArtifact('LongVaultFactory');
const LongVault = contract.fromArtifact('LongVault');


describe('LongVaultFactory', function() {
  const [ admin, beneficiary ] = accounts;

  beforeEach(async function () {
    this.factory = await LongVaultFactory.new(admin, { from: admin, gas: 8000000 });
  });

  //
  // createLongVault()
  //
  it('createLongVault returns newly initialized LongVault address', async function () {
    const newVaultReceipt = await this.factory.createLongVault(admin, beneficiary);
    const newVaultAddress = newVaultReceipt.logs[0].args.cloneAddress;
    const newVault = await LongVault.at(newVaultAddress);
    expect(typeof newVault === typeof LongVault);
  });
  
  //
  // getAllLongVaults()
  //
  it('getAllLongVaults returns all existing LongVaults', async function() {
    const initialVaults = await this.factory.getAllLongVaults();
    const initialCount = initialVaults.length;

    await this.factory.createLongVault(admin, beneficiary);

    const endVaults = await this.factory.getAllLongVaults();
    const endCount = endVaults.length;
    expect(initialCount).eq(0);
    expect(endCount).eq(1);
  });
});