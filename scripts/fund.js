const { getNamedAccounts, ethers, network } = require("hardhat")

async function main() {
  // run a script that allow us to fund our contracts
  const { deployer } = getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  console.log("Funding Contract...")
  const transactionRespnse = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  })
  await transactionRespnse.wait(1)
  console.log("Funded")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// to run this: yarn hardhat node
// yarn hardhat run scripts/fund.js --network localhost
