import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Test = () => {
  const [socket, setSocket] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [symbol, setSymbol] = useState("BTC/USDT"); // Default symbol
  const [isConnected, setIsConnected] = useState(false); // Track socket connection

  // Function to handle socket connection and update symbol
  const handleUpdateSymbol = () => {
    // Disconnect existing socket if any
    if (socket) {
      socket.off("orderStatus");
      socket.off("orderError");
      socket.off("symbolUpdated");
      socket.off("disconnect");
      socket.disconnect();
    }

    // Create a new socket connection
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    setIsConnected(true);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("updateSymbol", symbol);
      newSocket.emit("placeOrder");
    });

    newSocket.on("orderStatus", (data) => {
      console.log("Order Status:", data);
      setOrderStatus(data);
      setOrderError(null);
    });

    newSocket.on("orderError", (message) => {
      console.error("Order Error:", message);
      setOrderError(message);
      setOrderStatus(null);
    });

    newSocket.on("symbolUpdated", (data) => {
      console.log("Symbol Updated:", data.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("Socket Disconnected:", reason);
      setIsConnected(false);
    });
  };

  // Cleanup socket when component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        socket.off("orderStatus");
        socket.off("orderError");
        socket.off("symbolUpdated");
        socket.off("disconnect");
        socket.disconnect();
      }
    };
  }, [socket]); // Runs only when socket changes

  return (
    <div>
      <h1>Socket Connection Test</h1>

      {/* Symbol Input */}
      <div>
        <h2>Update Symbol</h2>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter symbol (e.g., BTC/USDT)"
        />
        <button onClick={() => handleUpdateSymbol()}>
          {isConnected
            ? "Reconnect & Update Symbol"
            : "Connect & Update Symbol"}
        </button>
      </div>

      {/* Display Connection Status */}
      <p>Socket Status: {isConnected ? "Connected" : "Disconnected"}</p>

      {/* Display Order Status */}
      {orderStatus ? (
        <div>
          <h2>Order Status</h2>
          <p>{orderStatus.message}</p>
          <pre>{JSON.stringify(orderStatus.order, null, 2)}</pre>
        </div>
      ) : (
        <p>Waiting for order updates...</p>
      )}

      {/* Display Order Errors */}
      {orderError && (
        <div>
          <h2>Order Error</h2>
          <p>{orderError}</p>
        </div>
      )}
    </div>
  );
};

export default Test;
