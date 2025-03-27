import config from "../utility/configs.js";
import express from "express";
import cors from "cors";
import authenticateToken from "../middleware/authMiddleware.js";
import userRouter from "./routers/userRouter.js";
import binanceApiRouter from "./routers/binanceApiRouter.js";

const apiRouter = express.Router();

const userCorsOptions = {
  origin: [config.USER_SERVER],
};

apiRouter.use(
  "/user",
  cors(userCorsOptions),
  authenticateToken("user"),
  userRouter
);
apiRouter.use(
  "/binance-api-router",
  cors(userCorsOptions),
  authenticateToken("user"),
  binanceApiRouter
);
export default apiRouter;
