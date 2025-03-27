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

const testTradeRouter = async (req, res) => {
  try {
    return res.status(200).json("Successfully hit Trade router");
  } catch (err) {
    return res.status(400).json({ error: `testTradeRouter Error: ${err}` });
  }
};

const buySpotWithUSDT = async (req, res) => {
  const { symbol, quoteOrderOty } = req.body;

  try {
    const order = await client.createOrder(
      symbol,
      "market",
      "buy",
      null,
      null,
      {
        quoteOrderQty: parseFloat(quoteOrderQty), // Amount of USDT to spend
      }
    );

    return res.status(200).json({
      message: "Buy order placed successfully",
      order,
    });
  } catch (err) {
    return res.status(400).json({ error: `testTradeRouter Error: ${err}` });
  }
};

const buyFuturesWithUSDT = async (req, res) => {
  const { symbol, leverage } = req.body;
  try {
    // Step 1: Set leverage
    await futuresClient.setLeverage(leverage, symbol);

    // Step 2: Fetch the current price of the asset
    const ticker = await futuresClient.fetchTicker(symbol);

    const currentPrice = ticker.last; // Last traded price
    console.log(ticker);

    // Step 3: Calculate the quantity to buy
    const amountInUSDT = 25; // Amount in USDT
    const quantity = amountInUSDT / currentPrice;
    console.log("Quantity", quantity);

    // Step 4: Place a market buy order in futures
    const order = await futuresClient.createOrder(
      symbol,
      "market", // Order type
      "buy", // Order side (long position)
      quantity // Quantity of the asset to buy
    );

    return res.status(200).json({
      message: "Long futures order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Error placing long futures order:", err);
    return res.status(500).json({
      error: `Failed to place long futures order: ${err.message}`,
    });
  }
};

// Fetch all futures position
const fetchPosition = async (req, res) => {
  try {
    const positions = await futuresClient.fetchPositions();
    return res.status(200).json({ positions });
  } catch (err) {
    console.error("Error fetching open trades:", err);
    return res
      .status(500)
      .json({ error: `Failed to fetch open trades: ${err.message}` });
  }
};

const closePositionByPercentage = async (req, res) => {
  const { symbol, percentage, leverage = 1 } = req.body; // e.g., symbol = "BTC/USDT", quantity = 0.3

  try {
    // Step 1: Set leverage
    await futuresClient.setLeverage(leverage, symbol);

    // Step 2: Fetch the target position
    const positions = await futuresClient.fetchPositions();
    const targetPosition = positions.find(
      (position) => position.info.symbol === symbol && position.contracts > 0
    );

    if (!targetPosition) {
      return res
        .status(404)
        .json({ error: "No open position found for the specified symbol" });
    }

    // Step 3: Calculate the quantity to close based on the percentage
    const closeQuantity = targetPosition.contracts * percentage;

    // Step 4: Determine the order side based on the position side
    const orderSide = targetPosition.side === "long" ? "sell" : "buy";

    // Step 5: Place a market order to close the partial position
    const order = await futuresClient.createOrder(
      symbol,
      "market", // Order type
      orderSide, // Order side (sell for long, buy for short)
      closeQuantity // Quantity to close
    );

    return res.status(200).json({
      message: "Partial position closed successfully",
      order,
    });
  } catch (err) {
    console.error("Error closing partial position:", err);
    return res
      .status(500)
      .json({ error: `Failed to close partial position: ${err.message}` });
  }
};

const fetchMyTrades = async (req, res) => {
  try {
    // Step 1: Fetch all trades for the symbol
    const trades = await futuresClient.fapiPrivateGetUserTrades();

    return res.status(200).json({ trades });
  } catch (err) {
    console.error("Error fetching all position history:", err);
    return res
      .status(500)
      .json({ error: `Failed to fetch all position history: ${err.message}` });
  }
};

export {
  testTradeRouter,
  buyFuturesWithUSDT,
  fetchPosition,
  closePositionByPercentage,
  fetchMyTrades,
};
