import http from "http";
import https from "https";
import compression from "compression";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import passport from "passport";
import cors from "cors";
const LocalStrategy = require("passport-local").Strategy;

import fs from "fs";
import path from "path";
import httpStatus from "./utils/httpStatus";
import logUtils from "./utils/logging";
import jwtDecode from "jwt-decode";
import cryptoUtils from "./utils/cryptography";
import algaehKeys from "algaeh-keys";
import { userSecurity } from "algaeh-utilities/checksecurity";
const keys = algaehKeys.default;
let app = express();
const _port = process.env.PORT;
const { logger, requestTracking } = logUtils;
const { decryption } = cryptoUtils;

app.use(compression());
if (process.env.NODE_ENV === "production") {
  console.log("Running prod...." + _port);
  const dist = path.resolve("../", "client", "build");
  console.log(dist);
  app.use(express.static(dist));
}

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200
  })
);

app.server = http.createServer(app);

//parse application json
app.use(
  bodyParser.json({
    limit: keys.bodyLimit
  })
);

//passport config
app.use(passport.initialize());
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
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
  let reqH = req.headers;
  let reqUser = "";
if(reqH["x-client-api"] !==undefined){
 const xClientKey=  reqH["x-client-key"];

}else{
  if (req.url != "/api/v1/apiAuth") {
    reqUser = jwtDecode(reqH["x-api-key"]).id;
    if (
      req.url != "/api/v1/apiAuth/authUser" &&
      req.url != "/api/v1/apiAuth/relogin"
    ) {
      let header = req.headers["x-app-user-identity"];

      if (header != null && header != "" && header != "null") {
        header = decryption(header);

        req.body.created_by = header.algaeh_d_app_user_id;
        req.body.updated_by = header.algaeh_d_app_user_id;
        req.userIdentity = { ...header, "x-branch": reqH["x-branch"] };

        const { username } = req.userIdentity;
        userSecurity(reqH["x-client-ip"], username).catch(error => {
          res.status(httpStatus.locked).json({
            success: false,
            message: error,
            username: error === "false" ? undefined : username
          });
          return;
        });
      } else {
        res.status(httpStatus.unAuthorized).json({
          success: false,
          message: "unauthorized credentials cannot procees.."
        });
        return;
      }
    }

  }
}
  requestTracking("", {
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
  next();
});

// let logdir = path.resolve("../", "LOGS");
// if (!fs.existsSync(logdir)) {
//   fs.mkdirSync(logdir);
// }

app.set("trust proxy", true);
//api routeres v1
app.use("/api/v1", routes);

process.on("warning", warning => {
  logger.log("warn", warning);
});
process.on("uncaughtException", error => {
  logger.log("error", error);
});
process.on("unhandledRejection", (reason, promise) => {
  logger.error("error", { reason: reason, promise: promise });
});
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
  logger.log("error", _error);
});

app.server.listen(_port);
console.log(`started on port ${_port}`);

export default app;
