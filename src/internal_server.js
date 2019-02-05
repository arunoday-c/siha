import http from "http";

import compression from "compression";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import passport from "passport";
import cors from "cors";
const LocalStrategy = require("passport-local").Strategy;
import morgan from "morgan";
import fs from "fs";
import path from "path";
import keys from "./keys/keys";
import rfs from "rotating-file-stream";
import httpStatus from "./utils/httpStatus";
import { logger, requestTracking } from "./utils/logging";
import jwtDecode from "jwt-decode";
import { decryption } from "./utils/cryptography";

let app = express();
const _port = keys.port;

app.use(compression());
if (process.env.NODE_ENV == "production") {
  console.log("Running prod...." + _port);
  console.log(process.env.NODE_ENV);
  app.use(express.static("build"));
}

// app.server = http.createServer(app);

// app.options(
//   "*",
//   cors({
//     origin: "*",
//     optionsSuccessStatus: 200
//   })
// );
// app.use(
//   cors({
//     origin: "*",
//     optionsSuccessStatus: 200
//   })
// );
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
  done(null, { msg: "done" });
});
if (process.env.NODE_ENV == "production") {
  app.set("view cache", true);
}
app.use((req, res, next) => {
  let reqH = req.headers;

  let reqUser = "";
  // res.setHeader("connection", "keep-alive");
  //res.setHeader("Transfer-Encoding", "gzip");
  if (req.url != "/api/v1/apiAuth") {
    if (req.url != "/api/v1/apiAuth/authUser") {
      // res.setHeader("Content-Encoding", "gzip");
      //  res.setHeader("connection", "keep-alive");
    }
    reqUser = jwtDecode(reqH["x-api-key"]).id;
    if (req.url != "/api/v1/apiAuth/authUser") {
      let header = req.headers["x-app-user-identity"];

      if (header != null && header != "" && header != "null") {
        header = decryption(header);

        req.body.created_by = header.algaeh_d_app_user_id;
        req.body.updated_by = header.algaeh_d_app_user_id;
        req.userIdentity = header;
      } else {
        res.status(httpStatus.unAuthorized).json({
          success: false,
          message: "unauthorized credentials can not procees.."
        });
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

let logdir = path.join(__dirname, "../" + keys.logpath);
if (!fs.existsSync(logdir)) {
  fs.mkdirSync(logdir);
}

// var accessLogStream = fs.createWriteStream(path.join(logdir, "access.log"), {
//   flags: "a"
// });

var accessLogStream = rfs("access.log", {
  size: "5M",
  path: logdir
});

app.use(morgan("combined", { streamexceptionHandlers: accessLogStream }));
app.set("trust proxy", true);
//api routeres v1
app.use("/api/v1", routes);

process.on("warning", warning => {
  logger.log("warn", warning);
});
process.on("uncaughtException", error => {
  logger.log("uncatched Exception", error);
});
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", { reason: reason, promise: promise });
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
  logger.log("error", "%j", _error);
});

app.server.listen(_port);

console.log(`started on port ${_port}`);

export default app;
module.exports = app;
