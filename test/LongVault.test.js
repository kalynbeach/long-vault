const { accounts, contract } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
require('chai').should();


const VAULT_RELEASE_TIME = new BN(1723326570); // 08-10-2024
const ETHER_VAULT_AMOUNT = ether('10');
const ETHER_RELEASE_AMOUNT = ether('2');
const TOKEN_VAULT_AMOUNT = new BN(100);
const TOKEN_ALLOWANCE_AMOUNT = new BN(50);
const TOKEN_RELEASE_AMOUNT = new BN(3);
// const TOKEN_VAULT_TOKEN = '0x514910771AF9Ca656af840dff83E8264EcF986CA'; // LINK

const LongVaultFactory = contract.fromArtifact('LongVaultFactory');
const LongVault = contract.fromArtifact('LongVault');
const LVTT = contract.fromArtifact('LongVaultTestToken');


async function createTestLongVault(admin, beneficiary) {
  console.log(`******** createTestLongVault admin: ${admin}`);
  console.log(`******** createTestLongVault beneficiary: ${beneficiary}`);
  const factory = await LongVaultFactory.new(beneficiary, { from: admin, gas: 8000000 });
  // console.dir(factory);
  console.log(`******** createTestLongVault factory: ${factory.address}`);
  const vaultReceipt = await factory.createLongVault(admin, beneficiary);
  const vaultAddress = vaultReceipt.logs[0].args.cloneAddress;
  const vault = await LongVault.at(vaultAddress);
  // console.dir(vaultReceipt);
  console.log(`******** createTestLongVault vaultReceipt: ${vaultReceipt}`);
  console.log(`******** createTestLongVault vaultAddress: ${vaultAddress}`);
  return vault;
}


describe('LongVault', function () {
  const [ admin, beneficiary ] = accounts;

  before(async function() {
    this.vault = await createTestLongVault(admin, beneficiary);
    this.token = await LVTT.new(
      this.vault.address,
      TOKEN_VAULT_AMOUNT,
      TOKEN_ALLOWANCE_AMOUNT,
      { from: admin, gas: 8000000 }
    );
    console.log(`******** before this.vault: ${this.vault}`);
    console.log(`******** before this.vault.address: ${this.vault.address}`);
    // console.log(`******** before this.token: ${this.token}`);
  });

  // beforeEach(async function () {
    // this.token = await LVTT.new(
    //   this.vault.address,
    //   TOKEN_VAULT_AMOUNT,
    //   TOKEN_ALLOWANCE_AMOUNT,
    //   { from: admin, gas: 8000000 }
    // );
    // console.log(`******** before this.token: ${this.token}`);
  // });

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
   * Token Deposit & Balances
  */

  //
  // depositToken()
  //
  it('receives token deposits', async function () {
    const receipt = await this.vault.depositToken(
      this.token.address,
      TOKEN_ALLOWANCE_AMOUNT,
      { from: admin }
    );
    const vaultTokenBalance = await this.token.balanceOf(this.vault.address);
    expect(vaultTokenBalance.eq(TOKEN_ALLOWANCE_AMOUNT));
    expectEvent(receipt, 'TokenDeposited', {
      token: this.token.address,
      amount: TOKEN_ALLOWANCE_AMOUNT
    });
  });

  //
  // getTokenBalance()
  //
  it('returns the current LongVault balance of a specific token', async function () {
    const testTokenBalance = await this.vault.getTokenBalance(this.token.address);
    expect(testTokenBalance.eq(TOKEN_VAULT_AMOUNT));
  });

  /**
   * Ether & Token Release Creation 
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
    console.log(`******** createEtherRelease etherReleases: ${etherReleases}`);
    console.dir(etherReleases);
    expect(etherReleases.length).to.equal(1);
  });


  //
  // createTokenRelease()
  //
  it('createTokenRelease emits an TokenReleaseCreated event', async function () {
    const receipt = await this.vault.createTokenRelease(
      this.token.address,
      TOKEN_RELEASE_AMOUNT,
      VAULT_RELEASE_TIME,
      { from: admin }
    );
    expectEvent(receipt, 'TokenReleaseCreated', { 
      token: this.token.address,
      amount: TOKEN_RELEASE_AMOUNT,
      releaseTime: VAULT_RELEASE_TIME
    });
  });

  it('createTokenRelease adds newly created TokenReleases to erc20Releases array', async function () {
    await this.vault.createTokenRelease(
      this.token.address,
      TOKEN_RELEASE_AMOUNT,
      VAULT_RELEASE_TIME,
      { from: admin }
    );
    const erc20Releases = await this.vault.getTokenReleases();
    console.log(`******** createTokenRelease erc20Releases: ${erc20Releases}`);
    console.dir(erc20Releases);
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

  //
  // releaseToken()
  //
  it('releaseToken sends tokens from vault to beneficiary', async function () {
    await this.vault.depositToken(
      this.token.address,
      TOKEN_ALLOWANCE_AMOUNT,
      { from: admin }
    );
    await this.vault.releaseToken(
      this.token.address,
      TOKEN_RELEASE_AMOUNT,
      { from: admin }
    );
    const beneficiaryTokenBalance = await this.token.balanceOf(beneficiary);
    expect(beneficiaryTokenBalance.eq(TOKEN_RELEASE_AMOUNT));
  });
});