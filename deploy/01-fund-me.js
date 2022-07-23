const { networkconfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //if chainId is X use address Y
  //if chainId is Z use address L

  const ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"];

  const fundMe = await deployments("FundME", {
    from: deployer,
    args: [],
    log: true,
  });
};
