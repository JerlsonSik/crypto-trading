import express from "express";
import accountRouter from "./binanceApiRoutes/accountRouter.js";
import tradeRouter from "./binanceApiRoutes/tradeRouter.js";
import fundingRatesRouter from "./binanceApiRoutes/fundingRatesRoutes.js";
const binanceApiRouter = express.Router();

binanceApiRouter.use("/account-router", accountRouter);
binanceApiRouter.use("/trade-router", tradeRouter);
binanceApiRouter.use("/funding-rates-router", fundingRatesRouter);

export default binanceApiRouter;
