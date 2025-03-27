import express from "express";
import config from "./utility/configs.js";
import connectToDB from "./config/connection.js";
import apiRouter from "./api/api.js";
import { Server } from "socket.io";
import http from "http";
import { initializeSocket } from "./controllers/socketController/socketController.js";

const app = express();
const PORT = config.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.USER_SERVER,
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use("/api", apiRouter);

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Listening to server: ${PORT}`);
});

connectToDB();
