// services/binanceService.js
import ccxt, { RateLimitExceeded } from "ccxt";
import config from "../../../utility/configs.js";

// Initialize Binance APIs
const binanceSpot = new ccxt.binance({
  apiKey: config.BINANCE_API_KEY,
  secret: config.BINANCE_API_SECRET,
});

const binanceFutures = new ccxt.binanceusdm({
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

const proBinanceSpot = new ccxt.pro.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_API_SECRET,
});

const proBinanceFutures = new ccxt.pro.binanceusdm({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_API_SECRET,
});

// Export the initialized instances
export {
  binanceSpot,
  binanceFutures,
  futuresClient,
  proBinanceFutures,
  proBinanceSpot,
};
