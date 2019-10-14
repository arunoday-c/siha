import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import keys from "algaeh-keys";
import algaehUtilities from "algaeh-utilities/utilities";
import { userSecurity } from "algaeh-utilities/checksecurity";
import routes from "./routes";
import compression from "compression";
const app = exxpress();
app.server = http.createServer(app);
app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit
  })
);
app.use(compression());
if (process.env.NODE_ENV == "production") {
  app.set("view cache", true);
}
app.use((req, res, next) => {
  const reqH = req.headers;
  const _token = reqH["x-api-key"];
  const utilities = new algaehUtilities();
  utilities.logger().log("Xapi", _token, "debug");
  const _verify = utilities.tokenVerify(_token);
  if (_verify) {
    let header = reqH["x-app-user-identity"];
    if (header != null && header != "" && header != "null") {
      header = utilities.decryption(header);
      req.userIdentity = header;
      let reqUser = utilities.getTokenData(_token).id;
      const { username } = req.userIdentity;
      userSecurity(reqH["x-client-ip"], username)
        .then(() => {
          res.setHeader("connection", "keep-alive");
          next();
        })
        .catch(error => {
          res.status(423).json({
            success: false,
            message: error,
            username: error === "false" ? undefined : username
          });
          return;
        });
      utilities.logger("res-tracking").log(
        "",
        {
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
        },
        "info"
      );
    }
  } else {
    res.status(utilities.httpStatus().unAuthorized).json({
      success: false,
      message: "unauthorized access"
    });
  }
});

app.use("/api/v1", routes);

process.on("warning", warning => {
  const utliites = new algaehUtilities();
  utliites.logger().log("warn", warning, "warn");
});
process.on("uncaughtException", error => {
  const utliites = new algaehUtilities();
  utliites.logger().log("uncatched Exception", error, "error");
});
process.on("unhandledRejection", (reason, promise) => {
  const utliites = new algaehUtilities();
  utliites
    .logger()
    .log("Unhandled rejection", { reason: reason, promise: promise }, "error");
});
app.use((error, req, res, next) => {
  const utliites = new algaehUtilities();
  error.status = error.status || utliites.httpStatus().internalServer;
  const errorMessage =
    error.sqlMessage != null ? error.sqlMessage : error.message;
  const reqH = req.headers;
  utliites.logger().log(
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
app.server.listen(_port);
console.log(`Clinical Desk Server is running  on PORT  - ${_port} *`);
export default app;
