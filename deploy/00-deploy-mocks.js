// const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployements }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
};
