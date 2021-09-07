const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();


const VAULT_RELEASE_TIME = new BN(1723326570); // 08-10-2024
const ETHER_VAULT_AMOUNT = ether('10');
const ETHER_RELEASE_AMOUNT = ether('2');
const ERC20_VAULT_AMOUNT = new BN(10);
const ERC20_RELEASE_AMOUNT = new BN(3);
const ERC20_VAULT_TOKEN = '0x514910771AF9Ca656af840dff83E8264EcF986CA'; // LINK

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

  //
  // deposit()
  //
  it('receives ether deposits', async function () {
    const receipt = await this.vault.deposit({ from: admin, value: ETHER_VAULT_AMOUNT });
    expectEvent(receipt, 'EtherDeposited', { amount: ETHER_VAULT_AMOUNT });    
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
    const preBalance = await this.vault.getERC20Balance(ERC20_VAULT_TOKEN);
    const receipt = await this.vault.depositERC20(ERC20_VAULT_TOKEN, ERC20_VAULT_AMOUNT, { from: admin });
    const newBalance = await this.vault.getERC20Balance(ERC20_VAULT_TOKEN);
    const balanceDiff = newBalance.sub(preBalance);
    expect(balanceDiff.eq(ERC20_VAULT_AMOUNT));
    expectEvent(receipt, 'ERC20Deposited', {
      token: ERC20_VAULT_TOKEN,
      amount: ERC20_VAULT_AMOUNT
    });
  });

  //
  // ERC20 Balances
  //
  it('returns the current balance of a specific ERC20 token', async function () {
    const testERC20Balance = await this.vault.getERC20Balance(ERC20_VAULT_TOKEN);
    expect(testERC20Balance.eq(ERC20_VAULT_AMOUNT));
  });

  /**
   * Ether & ERC20 Release Creation 
  */
  
  //
  // createEtherRelease()
  //

  it('createEtherRelease emits an EtherReleaseCreated event', async function () {
    const receipt = await this.vault.createEtherRelease(
      ETHER_VAULT_AMOUNT, 
      VAULT_RELEASE_TIME,
      { from: admin }
    );
    // TODO: Ether to wei conversion here?
    expectEvent(receipt, 'EtherReleaseCreated', {
      amount: ETHER_VAULT_AMOUNT,
      releaseTime: VAULT_RELEASE_TIME
    });
  });

  it('createEtherRelease adds newly created EtherReleases to etherReleases array', async function () {
    await this.vault.createEtherRelease(
      ETHER_VAULT_AMOUNT, 
      VAULT_RELEASE_TIME,
      { from: admin }
    );
    const etherReleases = await this.vault.getEtherReleases();
    expect(etherReleases.length).to.equal(1);
  });


  //
  // createERC20Release()
  //

  it('createERC20Release emits an ERC20ReleaseCreated event', async function () {
    const receipt = await this.vault.createERC20Release(
      ERC20_VAULT_TOKEN,
      ERC20_VAULT_AMOUNT,
      VAULT_RELEASE_TIME,
      { from: admin }
    );
    expectEvent(receipt, 'ERC20ReleaseCreated', { 
      token: ERC20_VAULT_TOKEN,
      amount: ERC20_VAULT_AMOUNT,
      releaseTime: VAULT_RELEASE_TIME
    });
  });

  it('createERC20Release adds newly created ERC20Releases to erc20Releases array', async function () {
    await this.vault.createERC20Release(
      ERC20_VAULT_TOKEN,
      ERC20_VAULT_AMOUNT,
      VAULT_RELEASE_TIME,
      { from: admin }
    );
    const erc20Releases = await this.vault.getERC20Releases();
    expect(erc20Releases.length).to.equal(1);
  });

  /**
   * Ether & Token Releases
  */

  //
  // releaseEther()
  //
  it('releaseEther sends ether to beneficiary', async function () {
    await this.vault.deposit({ from: admin, value: ETHER_VAULT_AMOUNT });
    const receipt = await this.vault.releaseEther(ETHER_RELEASE_AMOUNT, { from: admin });
    expectEvent(receipt, 'EtherReleased', {
      amount: ETHER_RELEASE_AMOUNT,
    });
  });

  // TODO: Look into how to handle testing existing ERC20 token contracts (like LINK) locally
  //    -- Import locally? Need to use testnet where the contract exists? 
  //
  // releaseERC20()
  //
  // it('releaseERC20 sends tokens to beneficiary', async function () {
  //   await this.vault.depositERC20(ERC20_VAULT_TOKEN, ERC20_VAULT_AMOUNT, { from: admin });
  //   const preBalance = await this.vault.getERC20Balance(ERC20_VAULT_TOKEN);
  //   console.log(`preBalance: ${preBalance}`);
  //   const receipt = await this.vault.releaseERC20(ERC20_VAULT_TOKEN, ERC20_RELEASE_AMOUNT, { from: admin });
  //   console.log(`receipt: ${receipt}`);
  //   const postBalance = await this.vault.getERC20Balance(ERC20_VAULT_TOKEN);
  //   console.log(`postBalance: ${postBalance}`);
  // });
});