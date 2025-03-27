import { binanceSpot, binanceFutures } from "./services/binanceService.js";
import {
  placeSpotLimitOrder,
  cancelSpotLimitOrder,
  monitorSpotLimitOrder,
  fetchFundingHistory,
  executeFundingStrategy,
  fetchOrderBookFunction,
} from "./services/orderService.js";

export const initializeSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    let spotLimitOrderId = null;
    let symbol = null; // Default is null to ensure we always take frontend input
    let monitorInterval = null;

    // Update symbol based on user input
    socket.on("updateSymbol", (newSymbol) => {
      symbol = newSymbol; // Always update the symbol dynamically
      console.log(`Symbol updated to: ${symbol}`);
      socket.emit("symbolUpdated", { message: `Symbol updated to ${symbol}` });
    });

    socket.on("executeFundingStrategy", () => {
      console.log(`Executing funding strategy...`);
      // fetchOrderBookFunction(symbol, socket);
      executeFundingStrategy(symbol, socket);
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (monitorInterval) clearInterval(monitorInterval);
      if (spotLimitOrderId)
        cancelSpotLimitOrder(spotLimitOrderId, symbol, socket);
      binanceSpot.close();
      binanceFutures.close();
    });

    // Handle socket errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      if (monitorInterval) clearInterval(monitorInterval);
      if (spotLimitOrderId)
        cancelSpotLimitOrder(spotLimitOrderId, symbol, socket);
      binanceSpot.close();
      binanceFutures.close();
    });
  });
};
