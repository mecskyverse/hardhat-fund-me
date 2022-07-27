// const { network } = require("hardhat");

const { network } = require("hardhat");
const {
  developmentChains,
  Decimals,
  InitialAnswer,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployements }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    log("Local Network detecetd Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [Decimals, InitialAnswer],
    });
    log("Mocks Deployed!");
    log("----------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
