import dotenv from "dotenv";
import { MainClient } from "binance";

dotenv.config();
// Binance API key and secret (store these securely, e.g., in environment variables)
const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;

// Initialize Binance client
const client = new MainClient({
  api_key: apiKey,
  api_secret: apiSecret,
});

export { client };
