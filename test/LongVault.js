const { expect } = require("chai");
const { ethers } = require("hardhat");


async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}


describe("LongVault", function() {

  // Signers (accounts)
  let admin;
  let beneficiary;
  let addresses;

  // LongVault (clones implementation)
  let implementation;

  // LongVaultFactory
  let factory;
  let salt;
  let createLongVaultTx;
  let longVault; // LongVault Clone
  let longVaultAddress; // LongVault Clone address

  before(async function () {
    implementation = await deploy("LongVault");
    factory = await deploy("LongVaultFactory", implementation.address);

    console.log(`\t* implementation: ${implementation.address}`);
    console.log(`\t* factory: ${factory.address}`);

    [admin, beneficiary, ...addresses] = await ethers.getSigners();

    salt = ethers.utils.randomBytes(20);
    
    createLongVaultTx = await factory.createLongVault(beneficiary.address, salt);
    await createLongVaultTx.wait();
    
    longVaultAddress = createLongVaultTx.from;
    longVault = await ethers.getContractAt("LongVault", longVaultAddress, admin);
    // console.log(`\t* longVault: ${longVault}`);
    // console.dir(longVault);
  });

  describe("Deployment", function () {

    // admin
    it("Should set the deployer address as admin", async function () {
      // const longVaultAdmin = await longVault.admin();
      // console.log(`\t* longVaultAdmin: ${longVaultAdmin}`);
      // console.log(`\t* admin.address: ${admin.address}`);
      // expect(longVaultAdmin).to.equal(admin.address);
    });

    // beneficiary
    it("Should set the beneficiary address", async function () {
      // const longVaultBeneficiary = await longVault.beneficiary();
      // console.log(`\t* longVaultBeneficiary: ${longVaultBeneficiary}`);
      // console.log(`\t* beneficiary.address: ${beneficiary.address}`);
      // expect(longVaultBeneficiary).to.equal(beneficiary.address);
    });
  });

  describe("Transactions", function () {

    describe("Balances", function () {

      it("Should return the current ether balance", async function () {});

      it("Should return the current ERC20 token balance(s)", async function () {});

      // getTokenBalance()
      it("Should return the current balance of a specific ERC20 token", async function () {});
    });

    describe("Deposits", function () {

      // deposit()
      it("Should receive ether deposits", async function () {

      });
  
      // depositToken()
      it("Should receive ERC20 token deposits", async function () {
  
      });
    });

    describe("Releases", function () {

      // createEtherRelease()
      it("Should create a new EtherRelease", async function () {});

      // createTokenRelease()
      it("Should create a new TokenRelease", async function () {});

      // createEtherRelease()
      it("Should emit an EtherReleaseCreated event", async function () {});

      // createTokenRelease()
      it("Should emit a TokenReleaseCreated event", async function () {});

      // releaseEther()
      it("Should send ether to the beneficiary", async function () {});

      // releaseToken()
      it("Should send ERC20 tokens to the beneficiary", async function () {});
    });
  });
});