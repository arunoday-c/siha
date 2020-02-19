// if (process.env.ENABLE_MONITOR === true) {
//    let dashPort = 4000
//   require("appmetrics-dash").atttach({port: dashport})
// }
import "core-js/stable";
import "regenerator-runtime/runtime";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import keys from "algaeh-keys";
import utliites from "algaeh-utilities";
import routes from "./routes";
import compression from "compression";
// let dash = null;
// if (process.env.ENABLE_MONITOR) {
//   dash = require("appmetrics-dash");
// }
// import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
const app = exxpress();
// dash.attach();
app.server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    allowedHeaders: "*",
    optionsSuccessStatus: 204
  })
);
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit
  })
);

process.env.MYSQL_KEYS = JSON.stringify(keys.default);

app.use(compression());

app.use((req, res, next) => {
  authentication(req, res, next);
});

app.use("/api/v1", routes);

process.on("warning", warning => {
  utliites
    .AlgaehUtilities()
    .logger()
    .log("warn", warning, "warn");
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
app.use((error, req, res, next) => {
  error.status =
    error.status || utliites.AlgaehUtilities().httpStatus().internalServer;
  const errorMessage =
    error.sqlMessage != null ? error.sqlMessage : error.message;
  const reqH = req.headers;
  utliites
    .AlgaehUtilities()
    .logger()
    .log(
      "Exception",
      {
        ...{
          dateTime: new Date().toLocaleString(),
          method: req.method,
          ...(req.method === "GET" ? {} : { body: req.body }),
          requestUrl: req.originalUrl,
          requestHeader: {
            host: reqH.host,
            "user-agent": reqH["user-agent"],
            "cache-control": reqH["cache-control"],
            origin: reqH.origin
          }
        },
        message: errorMessage
      },
      "error"
    );
  res
    .status(error.status)
    .json({
      success: false,
      isSql: error.sqlMessage != null ? true : false,
      message: errorMessage
    })
    .end();
});
app.server.listen(_port);
console.log(`HR MANAGEMENT Server is running  on PORT  - ${_port} *`);

export default app;
