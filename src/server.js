const express = require("express");
// const morgan = require("morgan");
// const router = require("./routes/index.routes");
// const cors = require("cors");
const bodyParser = require("body-parser");
const server = express();
const { createServer } = require("http");
const httpServer = createServer(server);

const whiteList = [
  "http://localhost:3000",
  "http://localhost:3001",
];

server.use(bodyParser.json({ limit: "10mb" }));
server.use(express.json());
// server.use(morgan("dev"));
// server.use(cors());

// Routes:
// router(server);

module.exports = server;
