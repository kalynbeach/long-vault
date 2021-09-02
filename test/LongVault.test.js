const { accounts, contract } = require('@openzeppelin/test-environment');
const { BN, ether, expectEvent, expectRevert, send } = require('@openzeppelin/test-helpers');
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

  // TODO: Write
  //
  // ADMIN_ROLE set
  //

  // it('ADMIN_ROLE set to admin address', async function () {});

  // TODO: Write
  //
  // BENEFICIARY_ROLE set
  //

  // it('BENEFICIARY_ROLE set to beneficiary address', async function () {});

  /**
   * Ether Deposit & Balance
  */

  // TODO: Figure out if I need this?
  // receive()
  // it('recieves ether deposits', async function () {});

  //
  // deposit()
  //

  it('receives ether deposits', async function () {
    const testEtherAmount = new BN(1);
    const receipt = await this.vault.deposit({ from: admin, value: testEtherAmount });
    expectEvent(receipt, 'EtherDeposited', { amount: testEtherAmount });    
  });


  /**
   * ERC20 Deposit & Balances
  */

  //
  // depositERC20()
  //

  // it('recieves ERC20 token deposits', async function () {});


  /**
   * Release Creation 
  */
  
  //
  // createEtherRelease()
  //

  it('createEtherRelease emits an EtherReleaseCreated event', async function () {
    const testEtherAmount = new BN(1);
    const testReleaseTime = new BN(1723326570); // 08-10-2024
    const receipt = await this.vault.createEtherRelease(testEtherAmount, testReleaseTime, { from: admin });
    // TODO: Ether to wei conversion here?
    expectEvent(receipt, 'EtherReleaseCreated', {
      amount: testEtherAmount,
      releaseTime: testReleaseTime
    });
  });

  // TODO: Finish writing
  // it('createEtherRelease adds newly created EtherReleases to etherReleases array', async function () {
  //   const etherReleases = await this.vault.etherReleases();
  //   const prevEtherReleaseCount = etherReleases.length;
  //   // Expect new EtherRelease is added to etherReleases array
  //   expect();
  // });


  //
  // createERC20Release()
  //

  it('createERC20Release emits an ERC20ReleaseCreated event', async function () {
    const testAddress = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
    const testAmount = new BN(10);
    const testReleaseTime = new BN(1723326570); // 08-10-2024
    const receipt = await this.vault.createERC20Release(testAddress, testAmount, testReleaseTime, { from: admin });

    expectEvent(receipt, 'ERC20ReleaseCreated', { 
      token: testAddress,
      amount: testAmount,
      releaseTime: testReleaseTime
    });
  });

  // TODO: Write
  // it('createERC20Release adds newly created ERC20Releases to erc20Releases array', async function () {});

  /**
   * Releases
  */

});