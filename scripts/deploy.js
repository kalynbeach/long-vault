// Hardhat Runtime Environment - explicitly required here to allow for
// standalone script running via `node <script>`
// const hre = require("hardhat");
// const ethers = hre.ethers;


// Path to frontend contract artifacts directory
// const FRONTEND_CONTRACTS_DIR = __dirname + "/../../long-vault/src/contracts";
const FRONTEND_CONTRACTS_DIR = __dirname + "/../../../../DApps/long-vault-frontend/src/contracts";


async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}


async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const implementation = await deploy("LongVault");
  const implementationAddress = implementation.address;
  
  const factory = await deploy("LongVaultFactory", implementation.address)  
  const factoryAddress = factory.address;

  saveFrontendFiles(implementation, factory);
  
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Deployed LongVault (Implementation): ${implementationAddress}`);
  console.log(`Deployed LongVaultFactory: ${factoryAddress}`);
}


function saveFrontendFiles(longVaultImplementation, longVaultFactory) {
  const fs = require("fs");

  const contractsDir = FRONTEND_CONTRACTS_DIR;

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save deployed LongVault implementation address
  fs.writeFileSync(
    contractsDir + "/implementation-address.json",
    JSON.stringify({ LongVault: longVaultImplementation.address }, undefined, 2)
  );

  // Save deployed LongVaultFactory address
  fs.writeFileSync(
    contractsDir + "/factory-address.json",
    JSON.stringify({ LongVaultFactory: longVaultFactory.address }, undefined, 2)
  );

  const LongVaultArtifact = artifacts.readArtifactSync("LongVault");

  // Save LongVault contract artifact
  fs.writeFileSync(
    contractsDir + "/LongVault.json",
    JSON.stringify(LongVaultArtifact, null, 2)
  );

  const LongVaultFactoryArtifact = artifacts.readArtifactSync("LongVaultFactory");

  // Save LongVaultFactory contract artifact
  fs.writeFileSync(
    contractsDir + "/LongVaultFactory.json",
    JSON.stringify(LongVaultFactoryArtifact, undefined, 2)
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });