import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routers";
import { authentication } from "algaeh-utilities/authentication";
import utilities from "algaeh-utilities";
import algaehKeys from "algaeh-keys";
import compression from "compression";
const app = express();
app.server = http.createServer(app);
app.use(cors());
const port = process.env.PORT;

const keys = algaehKeys.default;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit
  })
);
process.env.MYSQL_KEYS = JSON.stringify(keys);
app.use(compression());

app.use((req, res, next) => {
  authentication(req, res, next);
});

// if (process.env.NODE_ENV === "production") {
//   console.log(path.resolve("./", "client/build"), "prod");
//   app.use("/finbuild/", express.static(path.resolve("./", "client/build")));
// } else {
//   console.log(path.resolve("./", "client/dist"), "dev");
//   app.use("/finbuild/", express.static(path.resolve("./", "client/dist")));
// }
app.use("/api/v1", routes());

process.on("warning", warning => {
  utilities
    .AlgaehUtilities()
    .logger()
    .log("warn", warning, "warn");
});

process.on("uncaughtException", error => {
  utilities
    .AlgaehUtilities()
    .logger()
    .log("uncatched Exception", error, "error");
});

process.on("unhandledRejection", (reason, promise) => {
  utilities
    .AlgaehUtilities()
    .logger()
    .log("Unhandled rejection", { reason: reason, promise: promise }, "error");
});
app.use((error, req, res, next) => {
  error.status =
    error.status || utilities.AlgaehUtilities().httpStatus().internalServer;
  const errorMessage =
    error.sqlMessage != null ? error.sqlMessage : error.message;
  const reqH = req.headers;
  utilities
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
  res.status(error.status).json({
    success: false,
    isSql: error.sqlMessage != null ? true : false,
    message: errorMessage
  });
});
app.listen(port, () => {
  console.log(`Sales server is started on port - ${port} *`);
});
