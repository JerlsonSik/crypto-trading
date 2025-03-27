import express from "express";
import {
  testAccountRouter,
  getAccountBalance,
  getAvailableUSDT,
  getFuturesAccount,
  getFuturesTransfer,
} from "../../../controllers/binanceApiController/account.js";
const accountRouter = express.Router();

// Get Method
accountRouter.get("/test", testAccountRouter);
accountRouter.get("/get-account-balance", getAccountBalance);
accountRouter.get("/get-available-usdt", getAvailableUSDT);
accountRouter.get("/get-futures-account", getFuturesAccount);
accountRouter.get("/get-futures-transfer", getFuturesTransfer);
export default accountRouter;
