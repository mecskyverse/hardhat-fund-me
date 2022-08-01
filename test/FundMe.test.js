const { ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
describe("FundMe", () => {
  let fundMe;
  let mockV3Aggregator;
  let deployer;
  let sendValue = ethers.utils.parseEther("1");
  beforeEach(async function () {
    // const accounts = await ethers.getSigners()
    // deployer = accounts[0]
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    console.log(deployer);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", function () {
    it("It sets the aggregator address correctly", async () => {
      const response = await fundMe.priceFeed();
      console.log(response);
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  describe("fund", function () {
    it("Fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("updated the amount funded data structure", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("adds Funder to the array of funders", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.funders(0);
      assert.equal(response, deployer);
    });
  });
});
