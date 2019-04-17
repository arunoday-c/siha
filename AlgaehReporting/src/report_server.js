import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import compression from "compression";
import { spawn } from "child_process";

const app = exxpress();
app.server = http.createServer(app);
app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit
  })
);
app.use(compression());
if (process.env.NODE_ENV == "production") {
  app.set("view cache", true);
}
process.on("warning", warning => {
  console.warning("warning", warning);
});
process.on("uncaughtException", error => {
  console.error("Uncaught Exception", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection", { reason: reason, promise: promise });
});
app.use("/getReport", (req, res) => {});
app.server.listen(_port);
console.log(`Report Server is running  on PORT  - ${_port} *`);
export default app;
module.exports = app;
