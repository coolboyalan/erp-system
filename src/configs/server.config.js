import morgan from "morgan";
import express from "express";
import router from "#routes/index";
import logger from "#configs/logger";
import httpStatus from "http-status";
import requestSessionMiddleware from "#middlewares/requestSession";

const server = express();

server.use(morgan(logger));
server.use(requestSessionMiddleware());
server.use("/", router);

server.use((req, res) => {
  res
    .status(httpStatus.NOT_FOUND)
    .json({ status: false, message: "Path not found" });
});

export default server;
