//Here we're actualy gonna deploy our own  mock price feed contracts and in our deploy fundMe script we're going to use our own contracts, instead of already established contrats.
const { network } = require("hardhat")
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  // we're using this deployments object to get 2 functions, "deploy" and "log"
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  // getNamedAccounts function is a way for us to get named accounts, from namedAccounts in hardhat.config
  const chainId = network.config.chainId

  if (
    developmentChains.includes(
      network.name
    ) /* includes baicly is a function that check to see if some variable is inside an array*/
  ) {
    // deploy mocks
    log("Local network detected! Deploying mocks..")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true, // whith this active, when deploying we will have stuff like: deploying "MockV3Aggregator" (tx: 0x48bdfdd64644a5dd70bcefa793bec388fd55ccc9e6c6b6e4988db8d5cafde888)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
      args: [DECIMALS, INITIAL_ANSWER], // fro the constructor: node_modules/chainlink/src/v0.6/tests/MockV3Aggregator
    })
    log("Mocks deployed")
    log("--------------------------")
  }
}

module.exports.tags = ["all", "mocks"]

// to deploy only this: yarn hardhat deploy --tags mocks
