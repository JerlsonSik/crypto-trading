import express from "express";
import {
  testTradeRouter,
  buyFuturesWithUSDT,
  fetchPosition,
  closePositionByPercentage,
  fetchMyTrades,
} from "../../../controllers/binanceApiController/trade.js";
const tradeRouter = express.Router();

// Get Method
tradeRouter.get("/test", testTradeRouter);
tradeRouter.get("/fetch-position", fetchPosition);
tradeRouter.get("/fetch-my-trades", fetchMyTrades);

// POST Method
tradeRouter.post("/create-futures-order", buyFuturesWithUSDT);
tradeRouter.post("/close-futures-position", closePositionByPercentage);
export default tradeRouter;
