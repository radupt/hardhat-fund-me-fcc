async function main() {
  const { deployer } = getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  console.log("Funding...")
  const transactionRespnse = await fundMe.withdraw()
  await transactionRespnse.wait(1)
  console.log("Got it back!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
