module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const fundMe = await deployments("FundME", {
    from: deployer,
    args: [],
    log: true,
  });
};
