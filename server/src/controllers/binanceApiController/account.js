import config from "../../utility/configs.js";
import ccxt from "ccxt";

// Initialize Binance client
const client = new ccxt.binance({
  apiKey: config.BINANCE_API_KEY,
  secret: config.BINANCE_API_SECRET,
});

const futuresClient = new ccxt.binance({
  apiKey: config.BINANCE_API_KEY,
  secret: config.BINANCE_API_SECRET,
  options: {
    defaultType: "future",
  },
});

const testAccountRouter = async (req, res) => {
  try {
    return res.status(200).json("Successfully hit Account router");
  } catch (err) {
    return res.status(400).json({ error: `testAccountRouter Error: ${err}` });
  }
};

// Get Spot account balance in different symbol that have asset in it
const getAccountBalance = async (req, res) => {
  try {
    const account = await client.fetchBalance();
    const balance = account.info.balances.filter(
      (asset) => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0
    );

    return res.status(200).json({ balance });
  } catch (err) {
    return res
      .status(400)
      .json({ error: `Account Controller getAccountBalance Error: ${err}` });
  }
};

// Get Spot USDT Balance
const getAvailableUSDT = async (req, res) => {
  try {
    const account = await client.fetchBalance();
    const usdtBalance = account.info.balances.find(
      (asset) => asset.asset === "USDT"
    );

    if (!usdtBalance) {
      return res.status(404).json({ error: "USDT balance not found" });
    }

    // Extract free and locked USDT balances
    const freeUSDT = parseFloat(Math.floor(usdtBalance.free * 100) / 100);

    return res.status(200).json({ freeUSDT });
  } catch (err) {
    return res
      .status(400)
      .json({ error: `Account Controller getAvailableUSDT Error: ${err}` });
  }
};

// Fetch the available future balance in all symbol
const getFuturesAccount = async (req, res) => {
  try {
    const account = await futuresClient.fetchBalance();
    const availableBalance = account.info.availableBalance;
    return res.status(200).json({ availableBalance });
  } catch (err) {
    return res.status(400).json({ error: `testAccountRouter Error: ${err}` });
  }
};

// Get Futures Transfer History
const getFuturesTransfer = async (req, res) => {
  try {
    const transferHistory = await futuresClient.sapiGetFuturesTransfer({
      asset: "USDT",
      startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
      endTime: Date.now(),
      timestamp: Date.now(),
    });
    return res.status(200).json({ transferHistory });
  } catch (err) {
    return res
      .status(400)
      .json({ error: `testGetFuturesTransferRouter Error: ${err}` });
  }
};

export {
  testAccountRouter,
  getAccountBalance,
  getAvailableUSDT,
  getFuturesAccount,
  getFuturesTransfer,
};
