// if (process.env.ENABLE_MONITOR === true) {
// const dash = require("appmetrics-dash");
// import dash from "appmetrics-dash";
// dash.attach({
//   port: 4000,
//   // url: "/core-monitor",
//   title: "Core Dashboard",
//   docs: "http://algaeh.com"
// });
// }
import http from "http";
import compression from "compression";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import passport from "passport";
import cors from "cors";
const LocalStrategy = require("passport-local").Strategy;
import path from "path";
import httpStatus from "./utils/httpStatus";
import logUtils from "./utils/logging";
import jwtDecode from "jwt-decode";
import cryptoUtils from "./utils/cryptography";
import algaehKeys from "algaeh-keys";
// import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
const keys = algaehKeys.default;
let app = express();
const _port = process.env.PORT;
const { logger, requestTracking } = logUtils;
const { decryption } = cryptoUtils;
// dash.attach();
app.use(compression());
if (process.env.NODE_ENV === "production") {
  console.log("Running prod...." + _port);
  const dist = path.resolve("../", "client", "build");
  app.use(express.static(dist));
}

process.env.MYSQL_KEYS = JSON.stringify(keys);
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.server = http.createServer(app);

//parse application json
app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);

//passport config
app.use(passport.initialize());
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      return done(null, username);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  done(null, { id: id, msg: "done" });
});

app.use((req, res, next) => {
  if (req.url.includes("/apiAuth") === true) {
    if (req.url.includes("/logout")) {
      let reqH = req.headers;

      let header = reqH["x-api-key"];
      if (header != null && header !== "" && header !== "null") {
        header = jwtDecode(reqH["x-api-key"]);
        req.userIdentity = { ...header, "x-branch": reqH["x-branch"] };
        next();
      }
    } else {
      next();
    }
  } else {
    authentication(req, res, next);
  }
});

app.set("trust proxy", true);
//api routeres v1
app.use("/api/v1", routes);

process.on("warning", (warning) => {
  logger.log("warn", "warning-Core", warning);
});
process.on("uncaughtException", (error) => {
  logger.log("error", "uncaughtException-Core", error);
});
process.on("unhandledRejection", (reason, promise) => {
  logger.error("error", "unhandledRejection-Core", {
    reason: reason,
    promise: promise,
  });
});
//Error Handling MiddleWare
app.use((error, req, res, next) => {
  error.status = error.status || httpStatus.internalServer;
  if (req.db != null) {
    let connection = req.connection;
    if (connection != null) {
      if (req.db._freeConnections.indexOf(connection) === -1) {
        if (typeof connection.rollback === "function") {
          connection.rollback(() => {
            if (typeof connection.release === "function") connection.release();

            res
              .status(error.status)
              .json({
                success: false,
                message:
                  error.sqlMessage != null ? error.sqlMessage : error.message,
                isSql: error.sqlMessage != null ? true : false,
              })
              .end();
          });
        } else {
          if (typeof connection.release === "function") connection.release();
          res
            .status(error.status)
            .json({
              success: false,
              message:
                error.sqlMessage != null ? error.sqlMessage : error.message,
              isSql: error.sqlMessage != null ? true : false,
            })
            .end();
        }
      } else {
        res
          .status(error.status)
          .json({
            success: false,
            message:
              error.sqlMessage != null ? error.sqlMessage : error.message,
            isSql: error.sqlMessage != null ? true : false,
          })
          .end();
      }
    } else {
      console.log("Here is an error", error);
      res
        .status(error.status)
        .json({
          success: false,
          message: error.sqlMessage != null ? error.sqlMessage : error.message,
          isSql: error.sqlMessage != null ? true : false,
        })
        .end();
    }
  } else {
    res
      .status(error.status)
      .json({
        success: false,
        message: error.sqlMessage != null ? error.sqlMessage : error.message,
        isSql: error.sqlMessage != null ? true : false,
      })
      .end();
  }

  const _error = {
    source: req.originalUrl,
    requestClient: req.headers["x-client-ip"],
    reqUserIdentity: req.userIdentity,
    errorDescription: error,
  };
  logger.log("error", "unhandlerd", _error);
});

app.server.listen(_port);
console.log(`started on port ${_port}`);

export default app;
