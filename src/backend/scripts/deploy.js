const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  //deploying contracts
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(1); //1 is the fee percentage as the contructor takes "_feePercent"

  console.log("NFT contract address:", nft.address);
  console.log("Marketplace contract address", marketplace.address);

  //for each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end
  saveFrontendFiles(nft, "NFT");
  saveFrontendFiles(marketplace, "Marketplace");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//const contract = await ethers.getContractAt("NFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3")

//deploy script
//npx hardhat run src/backend/scripts/deploy.js --network localhost
