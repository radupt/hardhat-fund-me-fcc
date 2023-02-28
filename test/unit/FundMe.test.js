// We did test previusly in our last section, we're actually goiing to use hardhat deploy, to automatically set up our tests as both of the deploy functions had been run.

const { getNamedAccounts, deployments, ethers } = require("hardhat") // we need to deploy
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name) // only if we are on testchains
  ? describe.skip
  : describe("FundMe", async function () /*This larger scope will be for the entire FundMe contract*/ {
      let fundMe
      let deployer
      let mockV3Aggregator
      //const sendValue = "100000000000000000"   // 1ETH
      const sendValue = ethers.utils.parseEther("1") // 1eth
      beforeEach(async function () {
        // deploy our fundme contract using Hardhat-deploy
        // Since we use hardhat deploy, our fundMe contract will come even with our mocks.

        // Another way to get dfferent accounts directly from hardhat.config
        //const accounts = await ethers.getSigners()
        // If you are on your default network it's gonna give you a list of 10 fake accounts that we can work with
        //const accountZero = accounts[0]

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"]) //.fixture allow us to basically run our entire deploy folder with many tags as we want.("all", in module.exports)
        fundMe = await ethers.getContract("FundMe", deployer) // this getContract function is going to get the most recend deployment
        // "("FundMe", deployer)", connect the deployer, to the FundMe account.
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })

      describe("constructor", async function () /*  This is gonna be for the contructor*/ {
        it("sets the aggregator address correctly", async function () {
          const response = await fundMe.getPriceFeed() // We will want to make sure this s_getPriceFeed is going to be the same as our Mock3, since we are going to run this tests locally.
          assert.equal(response, mockV3Aggregator.address)
        })
      })

      describe("fund", async function () {
        // for the fund function
        // require line, test to see if this contract actualli does fail if we don't send enough ETH
        it("Fails if you don't send enough ETH", async function () {
          // For this we need Waffle, What we can actually do is, we can use the expected keyword and expect transitions to be reverted and for transaction to fail.
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          )
        })
        it("updated the ammount funded data structure", async function () {
          await fundMe.fund({ value: sendValue })
          const response = await fundMe.getAddressToAmountFunded(deployer)
          assert.equal(response.toString(), sendValue.toString()) // this 2 values should be the same
        }) // if you want to run only this: yarn hardhat test --grep "ammount funded"
        it("Adds funder to array of getFunder", async function () {
          await fundMe.fund({ value: sendValue })
          const funder = await fundMe.getFunder(0)
          assert.equal(funder, deployer)
        })
      })
      describe("withdraw", async function () {
        // Test the withdraw
        beforeEach(async function () {
          // fas the firt thing, we fund the contract with some money
          await fundMe.fund({ value: sendValue })
        })
        it("withdraw ETH from a single funder", async function () {
          //Arrange, we want actually check that we're correctly withdrawing the ether from a single funder.
          // So first we're going to get the starting balance of the fundme contract and the starting balance of the Deployer
          const startingFundMeBalance = await fundMe.provider.getBalance(
            /*this is calling form the blockchain so is gonna be of type big number*/ fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Act
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt // variable taken with the debugger, this we pull out object from other object
          const gasCost = gasUsed.mul(effectiveGasPrice) // . mul, to moltiplicate big numbers

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Assert
          assert.equal(endingFundMeBalance, 0) // dovrebbe essere 0
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance), //startingFundMeBalance + startingDeployerBalance, use add because of big number
            endingDeployerBalance.add(gasCost).toString() // because when we call the withdraw, our deployer spend some gas, .toString becuse of big number
          ) // ti accerti della somma
        })

        it("withdraw ETH from a single funder", async function () {
          //Arrange, we want actually check that we're correctly withdrawing the ether from a single funder.
          // So first we're going to get the starting balance of the fundme contract and the starting balance of the Deployer
          const startingFundMeBalance = await fundMe.provider.getBalance(
            /*this is calling form the blockchain so is gonna be of type big number*/ fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Act
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt // variable taken with the debugger, this we pull out object from other object
          const gasCost = gasUsed.mul(effectiveGasPrice) // . mul, to moltiplicate big numbers

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Assert
          assert.equal(endingFundMeBalance, 0) // dovrebbe essere 0
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance), //startingFundMeBalance + startingDeployerBalance, use add because of big number
            endingDeployerBalance.add(gasCost).toString() // because when we call the withdraw, our deployer spend some gas, .toString becuse of big number
          ) // ti accerti della somma
        })

        it("allows us to withdraw multiple getFunder", async function () {
          // Arrange
          const accounts = await ethers.getSigners() // differents accouns
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendValue })
          }

          // So first we're going to get the starting balance of the fundme contract and the starting balance of the Deployer
          const startingFundMeBalance = await fundMe.provider.getBalance(
            /*this is calling form the blockchain so is gonna be of type big number*/ fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Act
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt // variable taken with the debugger, this we pull out object from other object
          const gasCost = gasUsed.mul(effectiveGasPrice) // . mul, to moltiplicate big numbers

          // Assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0) // dovrebbe essere 0
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance), //startingFundMeBalance + startingDeployerBalance, use add because of big number
            endingDeployerBalance.add(gasCost).toString() // because when we call the withdraw, our deployer spend some gas, .toString becuse of big number
          ) // ti accerti della somma

          // Make sure thatgetFunder are set properly
          await expect(fundMe.getFunder(0)).to.be.reverted // this should revert
          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            ) // should be 0
          }
        })

        it("Only allows the owner to withdraw", async function () {})
        const accounts = await ethers.getSigners()
        const attacker = accounts[1]
        const attackerConnectedContract = await fundMe.connect(attacker)
        await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
          "FundMe__NotOwner"
        ) // should not be able to withdraw
      })

      it("cheaperWithdraw testing...", async function () {
        // Arrange
        const accounts = await ethers.getSigners() // differents accouns
        for (let i = 1; i < 6; i++) {
          const fundMeConnectedContract = await fundMe.connect(accounts[i])
          await fundMeConnectedContract.fund({ value: sendValue })
        }

        // So first we're going to get the starting balance of the fundme contract and the starting balance of the Deployer
        const startingFundMeBalance = await fundMe.provider.getBalance(
          /*this is calling form the blockchain so is gonna be of type big number*/ fundMe.address
        )
        const startingDeployerBalance = await fundMe.provider.getBalance(
          deployer
        )

        // Act
        const transactionResponse = await fundMe.cheaperWithdraw()
        const transactionReceipt = await transactionResponse.wait(1)
        const { gasUsed, effectiveGasPrice } = transactionReceipt // variable taken with the debugger, this we pull out object from other object
        const gasCost = gasUsed.mul(effectiveGasPrice) // . mul, to moltiplicate big numbers

        // Assert
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

        assert.equal(endingFundMeBalance, 0) // dovrebbe essere 0
        assert.equal(
          startingFundMeBalance.add(startingDeployerBalance), //startingFundMeBalance + startingDeployerBalance, use add because of big number
          endingDeployerBalance.add(gasCost).toString() // because when we call the withdraw, our deployer spend some gas, .toString becuse of big number
        ) // ti accerti della somma

        // Make sure thatgetFunder are set properly
        await expect(fundMe.getFunder(0)).to.be.reverted // this should revert
        for (i = 1; i < 6; i++) {
          assert.equal(
            await fundMe.getAddressToAmountFunded(accounts[i].address),
            0
          ) // should be 0
        }
      })
    })

// yarn hardhat coverage
// yarn hardhat test --grep "funder to array"
// yarn hardhat test
