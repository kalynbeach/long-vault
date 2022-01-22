import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";

import { HardhatUserConfig, task } from "hardhat/config";

// Example task
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
*/
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      inject: false,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
  },
  react: {
    providerPriority: ["web3modal", "hardhat"],
  },
  paths: {
    "react": "./frontend/hardhat",
    "deployments": './frontend/hardhat/deployments',
  },
  typechain: {
    "outDir": "./frontend/hardhat/typechain",
    "target": "ethers-v5"
  },
};

export default config;

