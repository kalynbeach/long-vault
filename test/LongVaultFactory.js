const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("LongVaultFactory", function() {

  let deployer;
  let addresses;

  let LongVault; // ContractFactory
  let longVaultImplementation; // Deployed contract
  let implementationAddress; // LongVault implementation address

  let LongVaultFactory;
  let longVaultFactory;
  let longVaultFactoryAddress;
  let salt;

  before(async function () {
    [deployer, ...addresses] = await ethers.getSigners();

    // console.log(`Signers - deployer: ${deployer}`);
    // console.log(`Signers - others (count): ${addresses.length}`);

    LongVault = await ethers.getContractFactory("LongVault");
    longVaultImplementation = await LongVault.deploy();
    await longVaultImplementation.deployed();

    implementationAddress = longVaultImplementation.address;

    salt = ethers.utils.randomBytes(20);

    LongVaultFactory = await ethers.getContractFactory("LongVaultFactory");
    longVaultFactory = await LongVaultFactory.deploy(implementationAddress);
    await longVaultFactory.deployed();

    longVaultFactoryAddress = longVaultFactory.address;

    // console.log(`\t* Deployed LongVault Implementation: ${implementationAddress}`);
    // console.log(`\t* Deployed LongVaultFactory: ${longVaultFactoryAddress}`);
  });

  describe("Deployment", function () {

    // longVaultImplementation
    it("Should set the LongVault implementation contract address", async function () {
      const longVaultImplementation = await longVaultFactory.getLongVaultImplementation();
      // console.log(`\t* longVaultImplementation: ${longVaultImplementation}`);
      // console.log(`\t* implementationAddress: ${implementationAddress}`);
      expect(longVaultImplementation).to.equal(implementationAddress);
    });

    // implementationBeneficiary
    it("Should set the deployer as the LongVault implementation beneficiary", async function () {
      const implementationBeneficiary = await longVaultFactory.getImplementationBeneficiary();
      // console.log(`\t* implementationBeneficiary: ${implementationBeneficiary}`);
      // console.log(`\t* deployer.address: ${deployer.address}`);
      expect(implementationBeneficiary).to.equal(deployer.address);
    });
  });

  describe("Transactions", function () {

    describe("LongVaultFactory State", function () {

      // getAllLongVaults()
      it("Should return LongVaultsEntry objects for all exisiting LongVault clones", async function () {

      });

      // getLongVaultImplementation()
      it("Should return the LongVault implementation contract address", async function () {});

      // getImplementationBeneficiary()
      it("Should return the LongVault implementation beneficiary address", async function () {});
    });

    describe("LongVault Clone Creation", function () {

      // createLongVault()
      it("Should create a new LongVault clone", async function () {});

      // createLongVault()
      it("Should initialize a newly created LongVault clone", async function () {});
    });

    // describe("LongVault Clone Management", function () {});

  });
});