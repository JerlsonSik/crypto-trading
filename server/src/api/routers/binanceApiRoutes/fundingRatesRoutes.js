import express from "express";
import {
  testFundingRatesRouter,
  getCurrentFundingRates,
  getFundingIntervals,
  getFundingHistory,
} from "../../../controllers/binanceApiController/fundingRates.js";
const fundingRatesRouter = express.Router();

// Get Method
fundingRatesRouter.get("/test", testFundingRatesRouter);
fundingRatesRouter.get("/current-funding-rates", getCurrentFundingRates);
fundingRatesRouter.get("/funding-intervals", getFundingIntervals);
fundingRatesRouter.get("/funding-history", getFundingHistory);

export default fundingRatesRouter;
