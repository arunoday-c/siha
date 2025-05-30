import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import keys from "algaeh-keys";
import utliites from "algaeh-utilities";
import routes from "./routes";
import compression from "compression";
// import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
import SwaggerConfiguration from "algaeh-utilities/swagger";
const app = express();
app.server = http.createServer(app);
app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);

process.env.MYSQL_KEYS = JSON.stringify(keys.default.mysqlDb);

app.use(compression());
// if (process.env.NODE_ENV == "production") {
//   app.set("view cache", true);
// }
// process.env.MYSQL_KEYS = JSON.stringify(keys.default);
if (process.env.NODE_ENV === "development") {
  new SwaggerConfiguration("Procurement Api's").Geteate(app);
}
app.use((req, res, next) => {
  authentication(req, res, next);
});
// app.use((req, res, next) => {
//   const reqH = req.headers;
//   const _token = reqH["x-api-key"];
//
//   utliites
//     .AlgaehUtilities()
//     .logger()
//     .log("Xapi", _token, "debug");
//   const _verify = utliites.AlgaehUtilities().tokenVerify(_token);
//   if (_verify) {
//     let header = reqH["x-app-user-identity"];
//     if (header != null && header != "" && header != "null") {
//       header = utliites.AlgaehUtilities().decryption(header);
//       req.userIdentity = { ...header, "x-branch": reqH["x-branch"] };
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
// });

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
app.server.listen(_port);
console.log(`Procurement Server is running  on PORT  - ${_port} *`);
export default app;
