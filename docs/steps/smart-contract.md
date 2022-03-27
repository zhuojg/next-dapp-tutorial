# Write Smart Contract

> For simplicity, we just use a smart contract from [Hardhat tutorial](https://hardhat.org/tutorial/writing-and-compiling-contracts.html)  

Create a file named `Token.sol` in `./contracts`:  

```bash
rm contracts/Greeter.sol # also remove the default contract
touch contracts/Token.sol
```

Copy the following code into `contracts/Token.sol`

> Notice that the solidity version here is `^0.8.0`, but you should change this according to the solidity version configured in `hardhat.config.ts`

```solidity
// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;


// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    // The `public` modifier makes a variable readable from outside the contract.
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
```

Compile contract

```bash
pnpm hardhat compile
```

Create a file named `Token.ts` in `./test`

```bash
rm test/sample-test.js # remove the default test
touch test/Token.ts
```

Copy the following code into `test/Token.ts`

> we rewrite test with TypeScript
> and you can find a full version of test in [`test/Token-full.ts`](https://github.com/zhuojg/next-dapp-tutorial/blob/main/test/Token-full.ts)

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token contract", () => {
  it("Deployment should assign the total supply of tokens to the owner", async () => {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});
```

Run test with `pnpm hardhat test`, you should get this:  

```
  Token contract
    ✔ Deployment should assign the total supply of tokens to the owner (345ms)

  Deployment
    ✔ Should set the right owner
    ✔ Should assign the total supply of tokens to the owner

  Transactions
    ✔ Should transfer tokens between accounts (66ms)
    ✔ Should fail if sender doesn’t have enough tokens (42ms)
    ✔ Should update balances after transfers (60ms)


  6 passing (867ms)
```
