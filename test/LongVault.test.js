const { expect } = require('chai');
const { BN, expectEvent } = require('@openzeppelin/test-helpers');

const LongVault = artifacts.require('LongVault');

contract('LongVault', function () {

  // Newly deployed LongVault contract for each test
  beforeEach(async function () {
    const testBeneficiaryAddress = '0x509B0f4F7d834a65517ac4Fcc834c67e1e20b68F';
    this.vault = await LongVault.new(testBeneficiaryAddress);
  });


  /**
   * createEtherRelease()
  */

  it('createEtherRelease emits an EtherReleaseCreated event', async function () {
    const testEtherAmount = new BN(1);
    const testReleaseTimestamp = new BN(1723326570); // 08-10-2024
    const receipt = await this.vault.createEtherRelease(testEtherAmount, testReleaseTimestamp);

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
    const testLINKAddress = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
    const testLINKAmount = new BN(10);
    const testLINKReleaseTimestamp = new BN(1723326570); // 08-10-2024
    const receipt = await this.vault.createERC20Release(testLINKAddress, testLINKAmount, testLINKReleaseTimestamp);

    expectEvent(receipt, 'ERC20ReleaseCreated', { 
      token: testLINKAddress,
      timestamp: testLINKReleaseTimestamp,
      amount: testLINKAmount
    });
  });

  // TODO: Write this test
  // it('createERC20Release adds newly created ERC20Releases to erc20Releases array', async function () {});

});