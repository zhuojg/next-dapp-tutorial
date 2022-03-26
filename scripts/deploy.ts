import hre from "hardhat";
import fs from "fs";

const main = async () => {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log(`Token deployed to: ${token.address}`);

  fs.writeFileSync("./.env.local", `TOKEN_ADDRESS=${token.address}`);
};

main()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
