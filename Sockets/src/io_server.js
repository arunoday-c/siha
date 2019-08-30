import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import keys from "algaeh-keys";
import utilities from "algaeh-utilities";
import compression from "compression";
import express from "express";
const _port = process.env.PORT;
const exp = express();
exp.use(cors());
const app = http.createServer(exp);
import socketAuth from "socketio-auth";
export const io = require("socket.io")(app);
import { authenticate } from "./socketAuth";
import appsock from "./appointmentSocket";
import labsock from "./labSocket";

socketAuth(io, {
  authenticate
});

const utils = utilities.AlgaehUtilities();
const logger = utils.logger();

process.on("warning", warn => {
  logger.log("warn", warn, "warn");
});
process.on("uncaughtException", error => {
  logger.log("uncatched Exception", error, "error");
});
process.on("unhandledRejection", (reason, promise) => {
  logger.log(
    "Unhandled rejection",
    { reason: reason, promise: promise },
    "error"
  );
});

io.on("connection", socket => {
  socket.on("user_logged", function(user, moduleList, userIdentity) {
    console.log(`${user} connected`);
    userIdentity = utils.decryption(userIdentity);
    console.log(userIdentity);
    if (moduleList.length !== 0) {
      if (moduleList.includes("mwb")) {
        socket.join(userIdentity.employee_id);
      }
      socket.join(moduleList);
    }
  });

  socket.on("user_logout", function() {
    console.log(socket.rooms);
    socket.disconnect();
  });

  appsock(socket);
  labsock(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
app.listen(_port);
console.log(`IO Sockets are running on PORT - *${_port}`);
export default app;
