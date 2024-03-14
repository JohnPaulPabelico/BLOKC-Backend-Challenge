require("dotenv").config();
const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
const port = 3000;
const moralisKey = process.env.MORALIS_API_KEY;
const chainId = "0xa4b1";

app.use(cors());
app.use(express.json());

async function getNativeBalance(walletAddress) {
  const balanceInWei = await Moralis.EvmApi.balance.getNativeBalance({
    chain: chainId,
    address: walletAddress,
  });
  const balanceInEth = balanceInWei.result.balance.ether;

  return { balanceInEth };
}

async function getWalletNFTs(walletAddress) {
  const nftsInWallet = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: chainId,
    format: "decimal",
    mediaItems: true,
    address: walletAddress,
  });

  const nfts = nftsInWallet.result.map((nft) => ({
    name: nft.result.name,
    amount: nft.result.amount,
    metadata: nft.result.metadata,
  }));

  return { nfts };
}

//FETCH NATIVE BALANCE OF WALLET
app.get("/balance/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    balanceInEth = await getNativeBalance(walletAddress);

    console.log("Native balance", balanceInEth);

    return res.status(200).json({ balanceInEth });
  } catch (e) {
    console.log("Error: " + e.message);
    return res.status(400).json();
  }
});

//FETCH ALL NFTS ON WALLET
app.get("/nft/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    nfts = await getWalletNFTs(walletAddress);

    console.log("NFTs", nfts);

    return res.status(200).json({ nfts });
  } catch (e) {
    console.log("Error: " + e.message);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: moralisKey,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on http://localhost:${port}/`);
  });
});
