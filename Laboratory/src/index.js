import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import keys from "algaeh-keys";
import utliites from "algaeh-utilities";

import compression from "compression";
// import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
import consumerPCR from "./rabbitMQ/consumer";
import consumerSMSStatus from "./rabbitMQ/consumerSMS";
const _port = process.env.PORT;
process.env.MYSQL_KEYS = JSON.stringify(keys.default.mysqlDb);
process.env.rabbitMQ = JSON.stringify(keys.default.rabbitMQ);
import routes from "./routes";
const app = express();
app.server = http.createServer(app);
app.use(cors());

app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);
app.use(compression());

app.use((req, res, next) => {
  // const integration = req.url.includes("lisIntegration") ? true:false;
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
        stack: error.stack,
        messageT: error.message,
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
  const { RABBIT_MQ_SERVER, enableSMS } = process.env;
  if (RABBIT_MQ_SERVER && RABBIT_MQ_SERVER !== "") {
    //Start Listing to get PCR reports.
    consumerPCR("UPDATE_BULK_PATIENT_SERVRPT");
    if (enableSMS === "true") {
      //Update Lab sms status
      consumerSMSStatus("SMS_STATUS");
    }
  }
});
console.log(`Laboratory Server is running  on PORT  - ${_port} *`);
export default app;
