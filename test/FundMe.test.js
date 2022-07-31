const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert } = require("chai");
describe("FundMe", () => {
  let fundMe;
  let mockV3Aggregator;
  let deployer;
  beforeEach(async function () {
    // const accounts = await ethers.getSigners()
    // deployer = accounts[0]
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);

    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", function () {
    it("It sets the aggregator address correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
});
