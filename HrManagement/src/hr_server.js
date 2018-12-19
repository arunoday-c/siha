import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import keys from "../../keys/keys";
import utliites from "../../AlgaehUtilities";
import routes from "./routes";
import compression from "compression";
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
app.use((req, res, next) => {
  const reqH = req.headers;
  const _token = reqH["x-api-key"];
  const _verify = utliites.AlgaehUtilities().tokenVerify(_token);
  if (_verify) {
    let header = reqH["x-app-user-identity"];
    if (header != null && header != "" && header != "null") {
      header = utliites.AlgaehUtilities().decryption(header);
      req.userIdentity = header;
      utliites
        .AlgaehUtilities()
        .logger("HR MANAGEMENT", "req-track")
        .log("", {
          dateTime: new Date().toLocaleString(),
          requestIdentity: {
            requestClient: reqH["x-client-ip"],
            requestAPIUser: reqUser,
            reqUserIdentity: req.userIdentity
          },
          requestUrl: req.originalUrl,
          requestHeader: {
            host: reqH.host,
            "user-agent": reqH["user-agent"],
            "cache-control": reqH["cache-control"],
            origin: reqH.origin
          },
          requestMethod: req.method
        });
    }

    res.setHeader("connection", "keep-alive");
    next();
  } else {
    res.status(utliites.AlgaehUtilities().httpStatus().unAuthorized).json({
      success: false,
      message: "unauthorized access"
    });
  }
});

app.use("/api/v1", routes);

process.on("warning", warning => {
  utliites
    .AlgaehUtilities()
    .logger("HR MANAGEMENT")
    .log("warn", warning);
});
process.on("uncaughtException", error => {
  utliites
    .AlgaehUtilities()
    .logger("HR MANAGEMENT")
    .log("uncatched Exception", error, "error");
});
process.on("unhandledRejection", (reason, promise) => {
  utliites
    .AlgaehUtilities()
    .logger("HR MANAGEMENT")
    .log("Unhandled rejection", { reason: reason, promise: promise }, "error");
});
app.use((error, req, res, next) => {
  error.status =
    error.status || utliites.AlgaehUtilities().httpStatus().internalServer;
  res.status(error.status).json({
    success: false,
    isSql: error.sqlMessage != null ? true : false,
    message: error.sqlMessage != null ? error.sqlMessage : error.message
  });
});
app.server.listen(_port);
console.log(`HR MANAGEMENT Server is running  on PORT  - ${_port}`);
export default app;
module.exports = app;
