const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();


const LongVault = contract.fromArtifact('LongVault');


describe('LongVault', function () {
  const [ admin, beneficiary ] = accounts;

  beforeEach(async function () {
    this.vault = await LongVault.new(beneficiary, { from: admin });
    this.testReleaseTime = new BN(1723326570); // 08-10-2024
    this.testEtherVaultAmount = ether("10");
    this.testERC20VaultAmount = new BN(100);
    this.testERC20Token = '0x514910771AF9Ca656af840dff83E8264EcF986CA'; // LINK
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

  //
  // deposit()
  //
  it('receives ether deposits', async function () {
    const receipt = await this.vault.deposit({ from: admin, value: this.testEtherVaultAmount });
    expectEvent(receipt, 'EtherDeposited', { amount: this.testEtherVaultAmount });    
  });

  //
  // Ether Balance
  //
  it('returns the current ether balance', async function () {
    expect(await balance.current(this.vault.address, 'ether'));
  });


  /**
   * ERC20 Deposit & Balances
  */

  //
  // depositERC20()
  //
  it('receives ERC20 token deposits', async function () {
    const prevBalance = await this.vault.getERC20Balance(this.testERC20Token);
    const receipt = await this.vault.depositERC20(this.testERC20Token, this.testERC20VaultAmount, { from: admin });
    const newBalance = await this.vault.getERC20Balance(this.testERC20Token);
    const balanceDiff = newBalance.sub(prevBalance);
    expect(balanceDiff.eq(this.testERC20VaultAmount));
    expectEvent(receipt, 'ERC20Deposited', {
      token: this.testERC20Token,
      amount: this.testERC20VaultAmount
    });
  });

  //
  // ERC20 Token Balances
  //
  it('returns the current balance of a specific ERC20 token', async function () {
    const testERC20Balance = await this.vault.getERC20Balance(this.testERC20Token);
    expect(testERC20Balance.eq(this.testERC20VaultAmount));
  });

  /**
   * Release Creation 
  */
  
  //
  // createEtherRelease()
  //
  it('createEtherRelease emits an EtherReleaseCreated event', async function () {
    const receipt = await this.vault.createEtherRelease(
      this.testEtherVaultAmount, 
      this.testReleaseTime,
      { from: admin }
    );
    // TODO: Ether to wei conversion here?
    expectEvent(receipt, 'EtherReleaseCreated', {
      amount: this.testEtherVaultAmount,
      releaseTime: this.testReleaseTime
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
    const receipt = await this.vault.createERC20Release(
      this.testERC20Token,
      this.testERC20VaultAmount,
      this.testReleaseTime,
      { from: admin }
    );
    expectEvent(receipt, 'ERC20ReleaseCreated', { 
      token: this.testERC20Token,
      amount: this.testERC20VaultAmount,
      releaseTime: this.testReleaseTime
    });
  });

  // TODO: Write
  // it('createERC20Release adds newly created ERC20Releases to erc20Releases array', async function () {});

  /**
   * Ether & Token Releases
  */

  //
  // releaseEther()
  //
  it('releaseEther sends ether to beneficiary using EtherRelease object', async function () {
    await this.vault.deposit({ from: admin, value: this.testEtherVaultAmount });
    const testEtherReleaseAmount = ether("2");
    const receipt = await this.vault.releaseEther(testEtherReleaseAmount, { from: admin });
    expectEvent(receipt, 'EtherReleased', {
      amount: testEtherReleaseAmount,
    });
  });

  // TODO: Write  
  //
  // releaseERC20()
  //
  // it('releaseEther sends ether to beneficiary using EtherRelease object', async function () {}
});