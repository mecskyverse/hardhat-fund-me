const {
  networkconfig,
  developmentChains,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //if chainId is X use address Y
  //if chainId is Z use address L

  let ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"];
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployements.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"];
  }
  const fundMe = await deployments("FundME", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
  if (!developmentChains.includes(network.name) && process.env.Ether_api) {
  }
  log("---------------------------------------");
};
module.exports.tags = ["all", "fundme"];
