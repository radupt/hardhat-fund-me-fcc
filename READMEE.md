ESLINT is known as a Javascript linter, which helps ou find and automatically fix problems in your code .
SOLHINT ia known as a Solidity linter: Linting is the process of running a program that will analise code for potential errors: yarn solhint contracts/\*.sol

To install @chainlink/contracts; yarn add --dev @chainlink/contracts, nad then is available in node_modules

To deploy uour contracts and keepeng track of all our deployments, is a little difficult with this method, we are gonna work with a package that makes all that staff a lot easier.
HARDHAT-DEPLOY packasge.: yarn add --dev hardhat-deploy
Now we have a new task "deploy", that is gonna be thr main that we use to deploy our contracts.
New folder "deploy"
To write our scripts in this folder, since we are using ethers.js, we have to add "hardhat-deploy-ethers", but is better thatn we add:
"yarn add @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers"
All the scripts that we add to our deploy folder, will run when we run: yarn hardhat deploy

How we actually deploy this Fund Me contract?
one of the ways to not interract with the real testnet, but still have the informations about the real word(like we need in PriceConverter.sol), we can use the "Forking of a blockchain".
We can use Mocking, that in short is creating objects that simulate the behavior of real objects

We create the folder utils, witch stays for utilities. And this is where we are gonna add different scripts that we can use across different deplyments.

hardhat-deploy: https://github.com/wighawag/hardhat-deploy
To deploy we use the folder "deploy", since we want to use "ethers.js" in all our script, we want to add "hardhat-deploy-ethers".

Style guide for solidity.

NatSpec: stands for Ethereum natural language specification format. And it's basically a way of documenting our code inspired by DoxyGen

Gas Estimator.

Unit testing is a software testing method by which individual units or source code are tested. (Testing minimum portion of our ocde to make shore they work correctly).
The one our small pieces of test work, we want to do a staging test or maybe an integration test. This might be where we run our code on a test net or some actual network.
Staging tests can be done on a testnet (LAST STOP).
Uniy tests are done locally with:

- local hardhat
- forked hardat

In our package.json, we can add the scripts section to make our lives a lot easier and condense all these long test into a yarn script for us.
So to run test, we run only "yarn test".
