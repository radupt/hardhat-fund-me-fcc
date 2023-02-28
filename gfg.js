/*
function deployFunc() {
  console.log("HI!")
}
module.exports.default = deployFunc
*/
//or

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre
}

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  // we're using this deployments object to get 2 functions, "deploy" and "log"
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  // getNamedAccounts function is a way for us to get named accounts, from namedAccounts in hardhat.config
  const chainId = network.config.chainId

  // how to parametrize the address in fuction of the chainID? We can use helper-hardhat-config
  // if chainID is X use address Y
  // if chainID is Z use address A

  //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // chainId is a number, ethUsdPriceFeed is a string
  // we use let to be able to update it
  let ethUsdPriceFeedAddress
  if (chainId == 31337) {
    //if (developmentChains.includes(network.name)) {
    /*if we are on a development chain*/ // get the most recent deployment of the test contract
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } /*if we are not on a development chain */ else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  // The idea of mock contrats:
  // if the contrat doesn't exist, we deploy a minimal version of it for our local testing

  // well what happens when we want to change chains?
  // when going for local host or hardhat network we want to use a mock
  //const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy(
    "FundMe",
    /*Name of the contract that we are deploying*/ {
      from: deployer, // who is deploying this
      args: [ethUsdPriceFeedAddress], // put the list of arguments from the contructor  // put price feed address
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    }
  )

  if (
    // se è un testnet tipo goerli che è in internet
    !developmentChains.includes(network.name) /*! means not*/ &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
  log("-------------------")
}

module.exports.tags = ["all", "fundme"]

// to deploy only this: yarn hardhat deploy --tags fundme
// Once we deployed this
// What are the other awesome things about hardhat deploy, when we run our local blockchain, our own blockchain node, hardhat "deploy" will automatically run through all of our deploy scripts,
// and add them to our node. So if i run : yarn hardhat node, we're going to spin up a new blockchain node, but it's already going to have all of our deployed contracts on it.

// yarn hardhat deploy --network goerli --tags fundme
//}
