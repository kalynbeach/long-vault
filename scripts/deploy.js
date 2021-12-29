// Hardhat Runtime Environment - explicitly required here to allow for
// standalone script running via `node <script>`
// const hre = require("hardhat");
// const ethers = hre.ethers;


// Path to frontend contract artifacts directory
const FRONTEND_CONTRACTS_DIR = __dirname + "/../../long-vault/src/build"; 


async function main() {

  const [deployer] = ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  console.log(`Deployer: ${deployerAddress}`);

  const LongVault = await ethers.getContractFactory("LongVault");
  const longVault = await LongVault.deploy();
  await longVault.deployed();

  const longVaultImpAddress = longVault.address;

  console.log(`Deployed LongVault Implementation: ${longVaultAddress}`);

  const LongVaultFactory = await ethers.getContractFactory("LongVaultFactory");
  const longVaultFactory = await LongVaultFactory.deploy(longVaultAddress);
  await longVaultFactory.deployed();

  const longVaultFactoryAddress = longVaultFactory.address;

  console.log(`Deployed LongVaultFactory: ${longVaultFactoryAddress}`);

  saveFrontendFiles(longVault, longVaultFactory)
}


function saveFrontendFiles(longVaultImplementation, longVaultFactory) {
  const fs = require("fs");

  const contractsDir = FRONTEND_CONTRACTS_DIR;

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Save LongVault Clones implementation address
  fs.writeFileSync(
    contractsDir + "/implementation-address.json",
    JSON.stringify({ LongVault: longVaultImplementation.address }, undefined, 2)
  );

  const LongVaultArtifact = hre.artifacts.readArtifactSync("LongVault");

  // Save LongVault contract artifact
  fs.writeFileSync(
    contractsDir + "/LongVault.json",
    JSON.stringify(LongVaultArtifact, null, 2)
  );

  const LongVaultFactoryArtifact = hre.artifacts.readArtifactSync("LongVaultFactory");

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