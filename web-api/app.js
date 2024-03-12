const express = require("express");
const { ethers } = require("ethers");
const { JsonRpcProvider } = require("ethers/providers");
const { formatUnits, BigNumber } = require("ethers");

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

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! http://localhost:${port}/`
  )
);
