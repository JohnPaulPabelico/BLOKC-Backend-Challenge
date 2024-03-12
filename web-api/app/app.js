const express = require("express");
const { ethers } = require("ethers");
const { JsonRpcProvider } = require("ethers/providers");

const abi = require("../abi.json");

const app = express();
const port = 3000;

const provider = new JsonRpcProvider(
  "https://public.stackup.sh/api/v1/node/arbitrum-sepolia"
);

app.get("/balance/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const balance = await provider.getBalance(walletAddress);
    const formattedBalance = Number(balance) / 1e18;

    if (balance !== undefined) {
      res.json({
        formattedBalance: formattedBalance,
      });
    } else {
      res.json({
        status: "Error",
        message: "Balance is undefined",
        balanceWei: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

app.get("/nft/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    // Replace with your NFT contract address and ABI
    const nftContractAddress = "0xf955B76F2C35Ad72A1AcEDD97E007018966eeF16";
    const nftContractABI = abi;

    const nftContract = new ethers.Contract(
      nftContractAddress,
      nftContractABI,
      provider
    );

    // Specify a block range to avoid the "eth_getLogs is limited to a 10000 block range" error
    const blockRange = { fromBlock: 0, toBlock: "latest" }; // Adjust the block range as needed

    // Convert blockRange to blockTag for ethers.js
    const blockTag = blockRange.toBlock;

    const transferFilter = nftContract.filters.Transfer(null, walletAddress);
    const ownedNFTs = await nftContract.queryFilter(transferFilter, blockTag);

    // Log events for debugging
    console.log("Transfer events:", ownedNFTs);

    res.json({
      ownedNFTs: ownedNFTs.map((event) => event.args.tokenId.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! http://localhost:${port}/`
  )
);
