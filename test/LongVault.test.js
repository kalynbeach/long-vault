const { accounts, contract } = require('@openzeppelin/test-environment');
const { BN, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();


const LongVault = contract.fromArtifact('LongVault');


describe('LongVault', function () {
  const [ admin, beneficiary ] = accounts;

  beforeEach(async function () {
    this.vault = await LongVault.new(beneficiary, { from: admin });
  });

  /**
   * Initial State
  */

  it('contract deployer address is set as admin', async function () {
    expect(await this.vault.admin()).to.equal(admin);
  });

  it('beneficiary address is set', async function () {
    expect(await this.vault.beneficiary()).to.equal(beneficiary);
  });

  // TODO: Write this test
  // it('ADMIN_ROLE set to admin address', async function () {});

  // TODO: Write this test
  // it('BENEFICIARY_ROLE set to beneficiary address', async function () {});


  /**
   * createEtherRelease()
  */

  it('createEtherRelease emits an EtherReleaseCreated event', async function () {
    const testEtherAmount = new BN(1);
    const testReleaseTimestamp = new BN(1723326570); // 08-10-2024
    const receipt = await this.vault.createEtherRelease(testEtherAmount, testReleaseTimestamp, { from: admin });

    expectEvent(receipt, 'EtherReleaseCreated', {
      timestamp: testReleaseTimestamp,
      amount: testEtherAmount
    });
  });

  // TODO: Finish writing this test
  // it('createEtherRelease adds newly created EtherReleases to etherReleases array', async function () {
  //   const etherReleases = await this.vault.etherReleases();
  //   const prevEtherReleaseCount = etherReleases.length;
  //   // Expect new EtherRelease is added to etherReleases array
  //   expect();
  // });


  /**
   * createERC20Release()
  */

  it('createERC20Release emits an ERC20ReleaseCreated event', async function () {
    const testAddress = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
    const testAmount = new BN(10);
    const testReleaseTimestamp = new BN(1723326570); // 08-10-2024
    const receipt = await this.vault.createERC20Release(testAddress, testAmount, testReleaseTimestamp, { from: admin });

    expectEvent(receipt, 'ERC20ReleaseCreated', { 
      token: testAddress,
      timestamp: testReleaseTimestamp,
      amount: testAmount
    });
  });

  // TODO: Write this test
  // it('createERC20Release adds newly created ERC20Releases to erc20Releases array', async function () {});

});