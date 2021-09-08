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

const LongVault = contract.fromArtifact('LongVault');
const LVTT = contract.fromArtifact('LongVaultTestToken');

describe('LongVault', function () {
  const [ admin, beneficiary ] = accounts;

  beforeEach(async function () {
    this.vault = await LongVault.new(beneficiary, { from: admin, gas: 8000000 });
    this.token = await LVTT.new(
      this.vault.address,
      TOKEN_VAULT_AMOUNT,
      TOKEN_ALLOWANCE_AMOUNT,
      { from: admin, gas: 8000000 }
    );
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
   * Token Deposit & Balances
  */

  // TODO: Fix this `Error: ERC1155: insufficient balance for transfer`
  //
  // depositToken()
  //
  it('receives token deposits', async function () {
    // const _adminAllowance = await this.token.allowance(admin, this.vault.address);
    // console.log(`_adminAllowance: ${_adminAllowance}`);
    // const _vaultAllowance = await this.token.allowance(this.vault.address, admin);
    // console.log(`_vaultAllowance: ${_vaultAllowance}`);
    // const _adminTokenBalance = await this.token.balanceOf(admin);
    // console.log(`_adminTokenBalance: ${_adminTokenBalance}`);
    // const _vaultTokenBalance = await this.token.balanceOf(this.token.address);
    // console.log(`_vaultTokenBalance: ${_vaultTokenBalance}`);

    const receipt = await this.vault.depositToken(
      this.token.address,
      TOKEN_ALLOWANCE_AMOUNT,
      { from: admin }
    );
    // console.log(`\n<TokenDeposited>\n`);

    // const adminAllowance = await this.token.allowance(admin, this.vault.address);
    // console.log(`adminAllowance: ${adminAllowance}`);
    // const vaultAllowance = await this.token.allowance(this.vault.address, admin);
    // console.log(`vaultAllowance: ${vaultAllowance}`);
    // const adminTokenBalance = await this.token.balanceOf(admin);
    // console.log(`adminTokenBalance: ${adminTokenBalance}`);

    const vaultTokenBalance = await this.token.balanceOf(this.vault.address);
    // console.log(`vaultTokenBalance: ${vaultTokenBalance}`);
    expect(vaultTokenBalance.eq(TOKEN_ALLOWANCE_AMOUNT));
    expectEvent(receipt, 'TokenDeposited', {
      token: this.token.address,
      amount: TOKEN_ALLOWANCE_AMOUNT
    });
  });

  //
  // Token Balances
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

  // TODO: Fix this `Error: ERC1155: insufficient balance for transfer`
  //
  // releaseToken()
  //
  it('releaseToken sends tokens from vault to beneficiary', async function () {
    // await this.token.increaseAllowance(this.vault.address, TOKEN_ALLOWANCE_AMOUNT);
    // const _adminAllowance = await this.token.allowance(admin, this.vault.address);
    // console.log(`_adminAllowance: ${_adminAllowance}`);
    // const _vaultAllowance = await this.token.allowance(this.vault.address, admin);
    // console.log(`_vaultAllowance: ${_vaultAllowance}`);
    // const _adminTokenBalance = await this.token.balanceOf(admin);
    // console.log(`_adminTokenBalance: ${_adminTokenBalance}`);
    // const _vaultTokenBalance = await this.token.balanceOf(this.vault.address);
    // console.log(`_vaultTokenBalance: ${_vaultTokenBalance}`);

    await this.vault.depositToken(
      this.token.address,
      TOKEN_ALLOWANCE_AMOUNT,
      { from: admin }
    );
    // console.log(`\n<TokenDeposited>\n`);

    // const adminAllowance = await this.token.allowance(admin, this.vault.address);
    // console.log(`adminAllowance: ${adminAllowance}`);
    // const vaultAllowance = await this.token.allowance(this.vault.address, admin);
    // console.log(`vaultAllowance: ${vaultAllowance}`);

    // const adminTokenBalance = await this.token.balanceOf(admin);
    // console.log(`adminTokenBalance: ${adminTokenBalance}`);
    // const vaultTokenBalance = await this.token.balanceOf(this.vault.address);
    // console.log(`vaultTokenBalance: ${vaultTokenBalance}`);

    await this.vault.releaseToken(
      this.token.address,
      TOKEN_RELEASE_AMOUNT,
      { from: admin }
    );
    // console.log(`\n<TokenReleased>\n`);
    
    const postBalance = await this.token.balanceOf(this.vault.address);
    const expectedBalance = TOKEN_ALLOWANCE_AMOUNT - TOKEN_RELEASE_AMOUNT;
    const beneficiaryTokenBalance = await this.token.balanceOf(beneficiary);
    // console.log(`postBalance: ${postBalance}`);
    // console.log(`expectedBalance: ${expectedBalance}`);
    // console.log(`*** beneficiaryTokenBalance: ${beneficiaryTokenBalance}\n`);

    expect(postBalance.eq(expectedBalance));
  });
});