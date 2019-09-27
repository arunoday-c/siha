import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import keys from "algaeh-keys";
import router from "./routes";
import utils from "./Utils/logging";
const { logger } = utils;
const app = exxpress();
const portNumber = process.env.PORT; //keys.port;
app.server = http.createServer(app);
app.use(cors());
//parse application json
app.use(
  bodyParser.json({
    limit: keys.bodyLimit
  })
);

//api routeres v1
app.use("/api/v1", router);
process.on("warning", warning => {
  logger.log("warn", warning);
});
process.on("uncaughtException", error => {
  logger.log("error", error);
});
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", { reason: reason, promise: promise });
});

if (process.env.NODE_ENV == "production") {
  app.set("view cache", true);
}
//Error Handling MiddleWare
app.use((error, req, res, next) => {
  error.status = error.status || httpStatus.internalServer;
  if (req.db != null) {
    let connection = req.connection;
    if (connection != null) {
      if (req.db._freeConnections.indexOf(connection) == -1) {
        if (typeof connection.rollback == "function") {
          connection.rollback(() => {
            if (typeof connection.release == "function") connection.release();

            res.status(error.status).json({
              success: false,
              message:
                error.sqlMessage != null ? error.sqlMessage : error.message,
              isSql: error.sqlMessage != null ? true : false
            });
          });
        } else {
          if (typeof connection.release == "function") connection.release();
          res.status(error.status).json({
            success: false,
            message:
              error.sqlMessage != null ? error.sqlMessage : error.message,
            isSql: error.sqlMessage != null ? true : false
          });
        }
      } else {
        res.status(error.status).json({
          success: false,
          message: error.sqlMessage != null ? error.sqlMessage : error.message,
          isSql: error.sqlMessage != null ? true : false
        });
      }
    } else {
      res.status(error.status).json({
        success: false,
        message: error.sqlMessage != null ? error.sqlMessage : error.message,
        isSql: error.sqlMessage != null ? true : false
      });
    }
  } else {
    res.status(error.status).json({
      success: false,
      message: error.sqlMessage != null ? error.sqlMessage : error.message,
      isSql: error.sqlMessage != null ? true : false
    });
  }

  const _error = {
    source: req.originalUrl,
    requestClient: req.headers["x-client-ip"],
    reqUserIdentity: req.userIdentity,
    errorDescription: error
  };
  logger.log("error", "%j", _error);

  res.setHeader("connection", "keep-alive");
});
app.server.listen(portNumber);
console.log(`Document management server started on port ${portNumber} *`);

export default app;
