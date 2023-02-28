// this is the last stage before deploying to a real testnet

const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

//let variable = false
//let somevar = varianble ? "yes" : "no"

// if (variable) {somevar = "yes"} else {somevar = "no"}

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      // We only want to run this if we are on a development chain
      let fundMe
      let deployer
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endingBalance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(), "0")
      })
    })
