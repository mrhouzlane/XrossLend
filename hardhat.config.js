require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const networks = require("./networks.json");
const accounts = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      finder: networks.rinkeby.contracts.finder,
      chainId: networks.rinkeby.chainId,
      url: networks.rinkeby.rpc,
      accounts,
    },
    optimism: {
      finder: networks.optimism.contracts.finder,
      chainId: networks.optimism.chainId,
      url: networks.optimism.rpc,
      accounts,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
