import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
const path = require("path");
import keys from "algaeh-keys";
import utliites from "algaeh-utilities";
import routes from "./routes";
import compression from "compression";
// import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
const app = express();
app.server = http.createServer(app);
app.use(cors());
const PORT = process.env.PORT || 3007;

app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);

process.env.MYSQL_KEYS = JSON.stringify(keys.default.mysqlDb);

app.use(compression());

app.use((req, res, next) => {
  if (req.url.indexOf("/finbuild") > -1) {
    next();
    return;
  }

  authentication(req, res, next);
  // const reqH = req.headers;
  // const _token = reqH["x-api-key"];

  // const _verify = utliites.AlgaehUtilities().tokenVerify(_token);
  // if (req.url.indexOf("/api") > -1) {
  //   if (_verify) {
  //     let header = reqH["x-app-user-identity"];
  //     if (header != null && header != "" && header != "null") {
  //       header = utliites.AlgaehUtilities().decryption(header);
  //       req.userIdentity = header;
  //       let reqUser = utliites.AlgaehUtilities().getTokenData(_token).id;
  //
  //       const { username } = req.userIdentity;
  //       userSecurity(reqH["x-client-ip"], username)
  //         .then(() => {
  //           res.setHeader("connection", "keep-alive");
  //           next();
  //         })
  //         .catch(error => {
  //           res.status(423).json({
  //             success: false,
  //             message: error,
  //             username: error === "false" ? undefined : username
  //           });
  //           return;
  //         });
  //
  //       utliites
  //         .AlgaehUtilities()
  //         .logger("res-tracking")
  //         .log(
  //           "",
  //           {
  //             dateTime: new Date().toLocaleString(),
  //             requestIdentity: {
  //               requestClient: reqH["x-client-ip"],
  //               requestAPIUser: reqUser,
  //               reqUserIdentity: req.userIdentity
  //             },
  //             requestUrl: req.originalUrl,
  //             requestHeader: {
  //               host: reqH.host,
  //               "user-agent": reqH["user-agent"],
  //               "cache-control": reqH["cache-control"],
  //               origin: reqH.origin
  //             },
  //             requestMethod: req.method
  //           },
  //           "info"
  //         );
  //     }
  //   } else {
  //     res.status(utliites.AlgaehUtilities().httpStatus().unAuthorized).json({
  //       success: false,
  //       message: "unauthorized access"
  //     });
  //   }
  // } else {
  //   next();
  // }
});

if (process.env.NODE_ENV === "production") {
  console.log(path.resolve("./", "client/build"), "prod");
  app.use("/finbuild/", express.static(path.resolve("./", "client/build")));
} else {
  console.log(path.resolve("./", "client/dist"), "dev");
  app.use("/finbuild/", express.static(path.resolve("./", "client/dist")));
}

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
          ...(req.method === "GET" ? {} : { body: JSON.stringify(req.body) }),
          requestUrl: req.originalUrl,
          requestHeader: {
            host: reqH.host,
            "user-agent": reqH["user-agent"],
            "cache-control": reqH["cache-control"],
            origin: reqH.origin,
          },
        },
        message: errorMessage,
        errorStock: JSON.stringify(error),
      },
      "error"
    );
  res.status(error.status).json({
    success: false,
    isSql: error.sqlMessage != null ? true : false,
    message: errorMessage,
  });
});

app.server.listen(PORT);
console.log(`FINANCE Server is running  on PORT  - ${PORT} *`);
// app.listen(PORT, () => console.log("Finance server started on :", PORT));
