import dotenv from "dotenv";

dotenv.config();

const config = {
  URI: process.env.URI || "",
  USERNAME: process.env.APP_USERNAME || "",
  PASSWORD: process.env.PASSWORD || "",
  PORT: process.env.PORT || 3000,
  SALT: process.env.SALT || 10,
  JWT_SECRET: process.env.JWT_SECRET || "secretkey",
  USER_SERVER: process.env.USER_SERVER || "http://localhost:5173",
  BINANCE_API_KEY: process.env.BINANCE_API_KEY || "",
  BINANCE_API_SECRET: process.env.BINANCE_API_SECRET || "",
};

export default config;
