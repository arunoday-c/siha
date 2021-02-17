import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import keys from "algaeh-keys";
import router from "./routes";
import translation from "./routes/translation";
import utils from "./Utils/logging";
import busboy from "connect-busboy";
import mime from "mime-types";
import path from "path";
// import { authentication } from "algaeh-utilities/authentication";
const { logger } = utils;
const app = exxpress();
const portNumber = process.env.PORT; //keys.port;
app.server = http.createServer(app);
app.use(cors());
app.use(
  busboy({
    highWaterMark: 10 * 1024 * 1024, // 10 MB buffer
  })
);

//parse application json
app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);

if (process.env.ENABLE_I18N) {
  const pathUI = `${process.cwd()}/translation-ui/public`;
  app.use(exxpress.static(pathUI));
}
// console.log("CWD", process.cwd());
app.use(
  "/UPLOAD",
  (req, res, next) => {
    const isType = mime.contentType(path.extname(req.originalUrl));

    console.log("UPLOAD======", isType);
    if (isType.includes("image")) {
      next();
    } else {
      res.write("No access to content");
    }
  },
  exxpress.static(`${process.cwd()}/UPLOAD`)
);

process.env.MYSQL_KEYS = JSON.stringify(keys.default.mysqlDb);
//api routeres v1
app.use("/api/v1", router);
app.use("/translation", translation);
process.on("warning", (warning) => {
  logger.log("warn", warning);
});
process.on("uncaughtException", (error) => {
  logger.log("error", error);
});
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", { reason: reason, promise: promise });
});

// if (process.env.NODE_ENV == "production") {
//   app.set("view cache", true);
// }
//Error Handling MiddleWare
app.use((error, req, res, next) => {
  error.status = error.status || 500;

  res.status(error.status).json({
    success: false,
    message: error.sqlMessage != null ? error.sqlMessage : error.message,
    isSql: error.sqlMessage != null ? true : false,
  });

  const _error = {
    source: req.originalUrl,
    requestClient: req.headers["x-client-ip"],
    reqUserIdentity: req.userIdentity,
    errorDescription: error,
  };
  logger.log("error", "%j", _error);

  res.setHeader("connection", "keep-alive");
});
app.server.listen(portNumber);
console.log(`Document management server started on port ${portNumber} *`);

export default app;
