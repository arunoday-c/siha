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
var io = require("socket.io")(app);

process.on("warning", warn => {
  utilities
    .AlgaehUtilities()
    .logger()
    .log("warn", warn, "warn");
});
process.on("uncaughtException", error => {
  utliites
    .AlgaehUtilities()
    .logger()
    .log("uncatched Exception", error, "error");
});
process.on("unhandledRejection", (reason, promise) => {
  utliites
    .AlgaehUtilities()
    .logger()
    .log("Unhandled rejection", { reason: reason, promise: promise }, "error");
});
io.on("connection", socket => {
  socket.on("patientadded", data => {
    console.log("data", data);
    io.sockets.emit("patientadded", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
app.listen(_port);
console.log(`IO Sockets are running on PORT - *${_port}`);
export default app;
module.exports = app;
