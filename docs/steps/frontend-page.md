# Write Frontend Page  

Install [`Web3Modal`](https://github.com/Web3Modal/web3modal) to connect our page to smart contract:  

```bash
pnpm install web3modal
```

Paste the following code into `pages/index.tsx`, and the inline comments explain how the code works:

```tsx
import type { InferGetStaticPropsType } from "next";
import Web3Modal from "web3modal";
import Token from "../artifacts/contracts/Token.sol/Token.json";
import { useCallback, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

export const getStaticProps = async () => {
  // read tokenAddress from environment variable
  // which will be written into `.env.local` when deploying
  const tokenAddress: string = process.env.TOKEN_ADDRESS ?? "";

  return {
    props: {
      tokenAddress,
    },
  };
};

interface TokenInformation {
  name: string;
  symbol: string;
  totalSupply: string;
  owner: string;
}

const Home = ({
  tokenAddress, // `tokenAddress` comes from `getStaticProps`
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);

  const load = useCallback(async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider);

    // get token information from contract
    setTokenInfo({
      name: await contract.name(),
      symbol: await contract.symbol(),
      totalSupply: `${await contract.totalSupply()}`,
      owner: await contract.owner(),
    });

    setLoading(false);
  }, []);

  const getCurrentBalance = useCallback(async () => {
    // open ethereum wallet
    const web3Modal = new Web3Modal();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);

    // check the network choice
    // the hardhat local network should have chainId 1337 and name "unknown"
    const currentNetwork = await provider.getNetwork();
    if (currentNetwork.chainId !== 1337 && currentNetwork.name !== "unknown") {
      setCurrentBalance("wrong network chosen");
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);

    // get current account balance using contract
    const balance: BigNumber = await contract.balanceOf(
      await signer.getAddress()
    );

    setCurrentBalance(balance.toNumber().toString());
  }, []);

  useEffect(() => {
    load();
  }, []);

  if (loading || !tokenInfo) return <div>loading...</div>;

  return (
    <div className="mt-32 w-1/3 mx-auto">
      <h1 className="font-bold text-lg">Token Information</h1>

      <div className="flex flex-col">
        {Object.entries(tokenInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <div>{key}</div>
            <div>{value}</div>
          </div>
        ))}

        <div className="flex justify-between">
          <div>my balance</div>
          {currentBalance !== null ? (
            <span>{currentBalance}</span>
          ) : (
            <button
              className="bg-gray-200 rounded-lg px-2 cursor-pointer hover:bg-gray-300"
              onClick={() => {
                getCurrentBalance();
              }}
            >
              get
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
```

Now let's start deploying smart contract on local network.
