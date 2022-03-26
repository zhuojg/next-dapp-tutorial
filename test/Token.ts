// reference: https://hardhat.org/tutorial/testing-contracts.html

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
