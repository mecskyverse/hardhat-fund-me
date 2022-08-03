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
  describe("withdraw", () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraw ETH from a single funder", async () => {
      //Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      //Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const effectiveGasUsed = gasUsed.mul(effectiveGasPrice);
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      //Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(effectiveGasUsed).toString()
      );
    });
    it("Withdraw ETH from multiple funders", async () => {
      //Arrange
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );
      //ACT
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const effectiveGasUsed = gasUsed.mul(effectiveGasPrice);
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      //Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(effectiveGasUsed).toString()
      );

      //Make sure that the funders are reset properly
      await expect(fundMe.funders(0)).to.be.reverted;

      for (i = 1; i < 6; i++) {
        assert.equal(
          await fundMe.addressToAmountFunded(accounts[i].address),
          0
        );
      }
    });
    it("Only Allows owner to witdraw money", async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerConnectedContract = await fundMe.connect(attacker);
      expect(attackerConnectedContract.withdraw()).to.be.reverted;
    });
  });
});
