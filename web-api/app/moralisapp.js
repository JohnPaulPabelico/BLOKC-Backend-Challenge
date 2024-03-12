require("dotenv").config();
const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
const port = 3000;
const moralisKey = process.env.MORALIS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/balance/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const response = await Moralis.EvmApi.balance.getNativeBalance({
      chain: "0xa4b1",
      address: walletAddress,
    });

    const result = response.raw;

    return res.status(200).json({ result });
  } catch (e) {
    console.log("Error: " + e.message);
    return res.status(400).json();
  }
});

app.get("/nft/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: "0xa4b1",
      format: "decimal",
      mediaItems: false,
      address: walletAddress,
    });

    const result = response.raw;

    return res.status(200).json({ result });
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
