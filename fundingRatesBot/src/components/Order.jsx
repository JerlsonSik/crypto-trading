import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Order = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // Track socket connection
  const [status, setStatus] = useState("");
  const [symbol, setSymbol] = useState("BTC/USDT"); // Default symbol

  const [buyQueue, setBuyQueue] = useState([]);
  const [sellQueue, setSellQueue] = useState([]);

  // Function to handle socket connection and update symbol
  const handleFundingStrategy = () => {
    // Disconnect existing socket if any
    if (socket) {
      socket.off("orderStatus");
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
      newSocket.emit("executeFundingStrategy");
    });

    newSocket.on("orderStatus", (data) => {
      // setStatus(data.message);
      setBuyQueue(data.buyQueue);
      setSellQueue(data.sellQueue);
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
        socket.off("disconnect");
        socket.disconnect();
      }
    };
  }, [socket]); // Runs only when socket changes

  return (
    <div>
      <h1>Funding Rate Strategy</h1>
      <h2>Update Symbol</h2>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter symbol (e.g., BTC/USDT)"
      />

      <button onClick={handleFundingStrategy}>
        {isConnected ? "Reconnect & Update Symbol" : "Connect & Update Symbol"}
      </button>
      <p>Status: {status}</p>
      <h2>Live Order Book ({symbol})</h2>

      {/* <div className="order-section">
        <div className="sell-orders">
          <h3>Sell Queue (Asks)</h3>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Amount</th>
                <th>USDT</th>
              </tr>
            </thead>
            <tbody>
              {sellQueue.map(([price, amount], index) => (
                <tr key={index}>
                  <td style={{ color: "red" }}>{price}</td>
                  <td>{amount.toFixed(6)}</td>
                  <td>{amount * price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sell-orders">
          <h3>Buy Queue (Bids)</h3>
          <table>
            <thead>
              <tr>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {buyQueue.map(([price, amount], index) => (
                <tr key={index}>
                  <td style={{ color: "red" }}>{price}</td>
                  <td>{amount.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default Order;
