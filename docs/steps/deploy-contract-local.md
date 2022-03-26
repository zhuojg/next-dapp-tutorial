# Deploy Smart Contract  

Create a file named `scripts/deploy.ts` with following:

```typescript
import hre from "hardhat";
import fs from "fs";

const main = async () => {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log(`Token deployed to: ${token.address}`);
  
  // write token address into `.env.local`
  // so our next page can read it
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

```

Run `npx hardhat node` to start a local network, and you should get something like this:

```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

...
```

Run `npx hardhat run scripts/deploy.ts --network localhost` to deploy smart contract, and you should see the address of smart contract.  

Now start the next page by `pnpm dev`, open `http://localhost:3000` in your browser.  

If everything goes right, you can see a page with basic token information.  

Before click `get` button to see the balance of current account, you need to add a test account to your wallet.  

Try to pick a test account from the output of `npx hardhat node`, and import it into your wallet with private key.  

<img width="371" alt="image" src="https://user-images.githubusercontent.com/24386525/160231803-68dd1447-7da8-46f4-b9ff-da32ac67ce68.png">

Then change the network of your wallet to `Localhost 8545`.  

<img width="371" alt="image" src="https://user-images.githubusercontent.com/24386525/160231731-d4d6bd1b-f9d5-4ee3-9f61-59ec0dfab7a3.png">

If `Localhost 8545` doesn't exist, click `Add Network`, and input following:

> Network Name: Localhost 8545  
> New RPC URL: http://127.0.0.1:8545  
> Chain ID: 31337  
> Currency Symbol: ETH  

Now you can click `get` button, and the modal will show.  

The balance should be `1000000` if you choose `Account #0`, or `0` if you choose other test accounts.  

Now everything has been done with our simplest smart contract and dApp.  
