// services/orderService.js
import {
  binanceSpot,
  binanceFutures,
  futuresClient,
  proBinanceFutures,
  proBinanceSpot,
} from "./binanceService.js";

const orderAmount = 50; // USDT
const leverage = 1;

export const placeSpotLimitOrder = async (symbol, socket) => {
  try {
    const orderBook = await binanceSpot.watchOrder(symbol);
    const currentBids = orderBook.bids;

    if (currentBids.length < 2) {
      throw new Error("Not enough bids in the order book");
    }

    const bid1Price = parseFloat(currentBids[0][0]);
    const bid2Price = parseFloat(currentBids[1][0]);

    const limitPrice = bid2Price;
    const amount = orderAmount / limitPrice;

    const spotLimitOrder = await binanceSpot.createLimitBuyOrder(
      symbol,
      amount,
      limitPrice
    );

    socket.emit("orderStatus", {
      message: "Spot limit order placed",
      order: spotLimitOrder,
    });

    return spotLimitOrder;
  } catch (error) {
    console.error("Error placing spot limit order:", error);
    socket.emit("orderError", "Failed to place spot limit order");
    throw error;
  }
};

export const cancelSpotLimitOrder = async (orderId, symbol, socket) => {
  try {
    if (orderId) {
      await binanceSpot.cancelOrder(orderId, symbol);
      socket.emit("orderStatus", {
        message: "Spot limit order canceled",
        order: { id: orderId },
      });
    }
  } catch (error) {
    console.error("Error canceling spot limit order:", error);
    socket.emit("orderError", "Failed to cancel spot limit order");
    throw error;
  }
};

export const placeFuturesMarketOrder = async (symbol, amount, socket) => {
  try {
    await binanceFutures.setLeverage(leverage, symbol);
    const futuresOrder = await binanceFutures.createMarketSellOrder(
      symbol,
      amount
    );

    socket.emit("orderStatus", {
      message: "Futures market order placed",
      order: futuresOrder,
    });
  } catch (error) {
    console.error("Error placing futures market order:", error);
    socket.emit("orderError", "Failed to place futures market order");
    throw error;
  }
};

export const monitorSpotLimitOrder = async (orderId, symbol, socket) => {
  try {
    if (!orderId) return;

    const orderStatus = await binanceSpot.fetchOrder(orderId, symbol);

    if (orderStatus.filled > 0) {
      await placeFuturesMarketOrder(symbol, orderStatus.filled, socket);

      if (orderStatus.status === "closed") {
        return null; // Order is fully filled
      }
    }

    return orderId;
  } catch (error) {
    console.error("Error monitoring spot limit order:", error);
    socket.emit("orderError", "Failed to monitor spot limit order");
    throw error;
  }
};

const getAmount = async (symbol) => {
  try {
    const orderBook = await proBinanceFutures.watchOrderBook(symbol); // Faster than watchOrderBook

    const orderAmountUSDT = 1490; // Total USDT to spend
    let totalUSDTSpent = 0; // Total USDT spent so far
    let totalUnitsBought = 0; // Total units bought so far

    const initialPrice = parseFloat(orderBook.asks[0][0]); // First ask price
    const maxAllowedPrice = initialPrice * 1.0005; // 0.05% above initial price

    // Use array methods for faster iteration
    orderBook.asks.some(([askPriceStr, availableAmountStr]) => {
      const askPrice = parseFloat(askPriceStr);
      const availableAmount = parseFloat(availableAmountStr);

      if (askPrice > maxAllowedPrice) {
        return true; // Stop buying beyond the price limit
      }

      const maxCostAtPrice = askPrice * availableAmount;

      if (totalUSDTSpent + maxCostAtPrice <= orderAmountUSDT) {
        // Buy all available at this price
        totalUnitsBought += availableAmount;
        totalUSDTSpent += maxCostAtPrice;
      } else {
        // Buy only the remaining amount needed
        const remainingUSDT = orderAmountUSDT - totalUSDTSpent;
        totalUnitsBought += remainingUSDT / askPrice;
        totalUSDTSpent = orderAmountUSDT;
        return true; // Stop after reaching USDT limit
      }

      return false; // Continue to the next ask
    });

    // Compute weighted average price
    const executionPrice = totalUSDTSpent / totalUnitsBought;

    return {
      totalUnitsBought: Math.floor(totalUnitsBought), // Floor only at the end
      executionPrice: executionPrice.toFixed(5),
      finalUSDTSpent: totalUSDTSpent.toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching order book:", error);
    throw error;
  }
};

export const fetchFundingHistory = async (symbol, socket) => {
  try {
    const fundingHistory = await binanceFutures.fetchFundingHistory(symbol);
    return fundingHistory;
  } catch (error) {
    console.error("Error fetching funding history:", error);
    throw error;
  }
};

export const fetchOrderBookFunction = async (symbol, socket) => {
  try {
    const orderBook = await proBinanceFutures.watchOrderBook(symbol);
    console.time("Execution Time");
    const startTime = Date.now();

    const amount = await getAmount(symbol);
    console.log(amount.totalUnitsBought);

    const executionTime = Date.now() - startTime; // Calculate execution time
    console.timeEnd("Execution Time"); // End timing

    console.log(`Execution Time: ${executionTime} ms`);
    const buyQueue = orderBook.bids.slice(0, 5);
    const sellQueue = orderBook.asks.slice(0, 5);

    socket.emit("orderStatus", { buyQueue, sellQueue });
  } catch (error) {
    console.error("Error fetching funding history:", error);
    throw error;
  }
};

export const executeFundingStrategy = async (symbol, socket) => {
  try {
    const amount = await getAmount(symbol);
    const buyOrder = await placeFuturesBuyMarketOrder(
      symbol,
      amount.totalUnitsBought,
      socket
    );

    const fundingHistoryInitial = await futuresClient.fetchFundingHistory();

    let previousFundingHistory = fundingHistoryInitial.length;
    let isPositionClosed = false;
    console.log("Previous", previousFundingHistory);
    const checkFundingRate = async () => {
      const fundingHistory = await futuresClient.fetchFundingHistory();
      console.log(fundingHistory.length);
      // Check if there's a new funding rate entry
      if (fundingHistory.length > previousFundingHistory.length) {
        // Close the position immediately
        await placeFuturesSellMarketOrder(
          symbol,
          amount.totalUnitsBought,
          socket
        );
        socket.emit("orderStatus", {
          message: `Funding strategy executed successfully for ${symbol}. Position closed due to new funding rate.`,
        });

        isPositionClosed = true; // Set the flag to true
      }
    };

    const fundingRateCheckInterval = setInterval(async () => {
      if (isPositionClosed) {
        clearInterval(fundingRateCheckInterval); // Stop checking if the position is closed
        return;
      }
      await checkFundingRate();
    }, 1000);
    // // Place a futures market buy order

    // // Wait for 10 seconds before closing the position
    // setTimeout(async () => {
    //   try {
    //     // Place a futures market sell order to close the trade
    //     await placeFuturesSellMarketOrder(
    //       symbol,
    //       amount.totalUnitsBought,
    //       socket
    //     );
    //     socket.emit("orderStatus", {
    //       message: `Funding strategy executed successfully for ${symbol}`,
    //     });
    //   } catch (sellError) {
    //     console.error("Error closing futures position:", sellError);
    //     socket.emit("orderError", "Failed to close futures position");
    //   }
    // }, 10000);
  } catch (buyError) {
    console.error("Error executing funding strategy:", buyError);
    socket.emit("orderError", "Failed to execute funding strategy");
  }
};

export const placeFuturesBuyMarketOrder = async (symbol, amount, socket) => {
  try {
    await binanceFutures.setLeverage(leverage, symbol);
    const futuresOrder = await binanceFutures.createMarketBuyOrder(
      symbol,
      amount
    );

    socket.emit("orderStatus", {
      message: "Futures market buy order placed",
      order: futuresOrder,
    });
  } catch (error) {
    console.error("Error placing futures market order:", error);
    socket.emit("orderError", "Failed to place futures market order");
    throw error;
  }
};

export const placeFuturesSellMarketOrder = async (symbol, amount, socket) => {
  try {
    await binanceFutures.setLeverage(leverage, symbol);
    const futuresOrder = await binanceFutures.createMarketSellOrder(
      symbol,
      amount
    );

    socket.emit("orderStatus", {
      message: "Closed futures trade on ${symbol}",
      order: futuresOrder,
    });
  } catch (error) {
    console.error("Error placing futures market order:", error);
    socket.emit("orderError", "Failed to place futures market order");
    throw error;
  }
};
