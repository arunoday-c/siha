import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import algaehKeys from "algaeh-keys";
import algaehUtilities from "algaeh-utilities/utilities";
import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
import routes from "./routes";
import compression from "compression";
const app = exxpress();
const keys = algaehKeys.default;
app.server = http.createServer(app);
app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: keys.bodyLimit,
  })
);
app.use(compression());

process.env.MYSQL_KEYS = JSON.stringify(keys.mysqlDb);

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

app.use("/api/v1", routes);

process.on("warning", (warning) => {
  const utliites = new algaehUtilities();
  utliites.logger().log("warn", warning, "warn");
});
process.on("uncaughtException", (error) => {
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
console.log(`Clinical Desk Server is running  on PORT  - ${_port} *`);
export default app;
