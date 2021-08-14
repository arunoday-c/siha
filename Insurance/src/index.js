import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import keys from "algaeh-keys";
import utliites from "algaeh-utilities";
import routes from "./routes";
import compression from "compression";
import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
import SwaggerConfiguration from "algaeh-utilities/swagger";
// import corporateMaster from "./rabbitMQ/consumer";
const app = express();
app.server = http.createServer(app);
app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);
app.use(compression());

process.env.MYSQL_KEYS = JSON.stringify(keys.default.mysqlDb);
process.env.rabbitMQ = JSON.stringify(keys.default.rabbitMQ);
if (process.env.NODE_ENV === "development") {
  new SwaggerConfiguration("Insurance Api's").Geteate(app);
}
app.use((req, res, next) => {
  authentication(req, res, next);
});

app.use("/api/v1", routes);

process.on("warning", (warning) => {
  utliites.AlgaehUtilities().logger().log("warn", warning, "warn");
});
process.on("uncaughtException", (error) => {
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
            origin: reqH.origin,
          },
        },
        message: errorMessage,
      },
      "error"
    );
  res.status(error.status).json({
    success: false,
    isSql: error.sqlMessage != null ? true : false,
    message: errorMessage,
  });
});
app.server.listen(_port, () => {
  const { RABBIT_MQ_SERVER } = process.env;
  if (RABBIT_MQ_SERVER && RABBIT_MQ_SERVER !== "") {
    require("./rabbitMQ/consumer");
  }
});
console.log(`Insurance Server is running  on PORT  - ${_port} *`);
export default app;
