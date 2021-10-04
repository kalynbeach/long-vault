const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();

const LongVaultFactory = contract.fromArtifact('LongVaultFactory');

describe('LongVaultFactory', function() {
  const [ admin, beneficiary ] = accounts;

  before(async function () {
    // TODO: Init LongVaultFactory per Clones implementation
    this.factory = await LongVaultFactory.new(admin, { from: admin, gas: 8000000 });
    this.vault = await this.factory.createLongVault(admin);
    console.log(`LongVaultFactory.test vault: ${this.vault}`);
  });
});