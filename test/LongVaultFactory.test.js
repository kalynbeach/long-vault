const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { ethers } = require('ethers');
const { expect } = require('chai');
require('chai').should();


const LongVault = contract.fromArtifact('LongVault');
const LongVaultFactory = contract.fromArtifact('LongVaultFactory');

describe('LongVaultFactory', function() {
  const [ admin, beneficiary ] = accounts;

  beforeEach(async function () {
    this.factory = await LongVaultFactory.new({ from: admin, gas: 8000000 });
    // this.initialLongVaultClone = await this.factory.createLongVault(
    //   beneficiary,
    //   ethers.utils.randomBytes(20),
    //   { from: admin, gas: 8000000 }
    // );
  });

  //
  // createLongVault()
  //
  it('createLongVault creates a new LongVault clone', async function () {
    const salt = ethers.utils.randomBytes(20);
    const newVaultReceipt = await this.factory.createLongVault(
      beneficiary,
      salt,
      { from: admin, gas: 8000000 }
    );
    const newVaultAddress = newVaultReceipt.logs[0].args.longVaultClone;
    const newVault = await LongVault.at(newVaultAddress);
    console.log(`newVaultReceipt: ${newVaultReceipt}`);
    console.log(`newVaultAddress: ${newVaultAddress}`);
    console.log(`newVault: ${newVault}`);
    expect(typeof newVault === typeof LongVault);
  });

  it('createLongVault initializes the new LongVault clone', async function () {
    const salt = ethers.utils.randomBytes(20);
    const newVaultReceipt = await this.factory.createLongVault(
      beneficiary,
      salt,
      { from: admin, gas: 8000000 }
    );
    const newVaultAddress = newVaultReceipt.logs[0].args.longVaultClone;
    const newVault = await LongVault.at(newVaultAddress);
    expect(typeof newVault === typeof LongVault);
  });
  
  //
  // getAllLongVaults()
  //
  it('getAllLongVaults returns all existing LongVaults', async function() {
    const initialVaults = await this.factory.getAllLongVaults();
    const initialCount = initialVaults.length;
    const salt = ethers.utils.randomBytes(20);
    await this.factory.createLongVault(
      beneficiary,
      salt,
      { from: admin, gas: 8000000 }
    );

    const endVaults = await this.factory.getAllLongVaults();
    const endCount = endVaults.length;
    expect(initialCount).eq(0);
    expect(endCount).eq(1);
  });
});