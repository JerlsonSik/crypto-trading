import { initializeSocketHandlers } from "./socketHandlers.js";

const initializeSocket = (io) => {
  initializeSocketHandlers(io);
};

export { initializeSocket };
