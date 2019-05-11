import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import compression from "compression";
import moment from "moment";
import fs from "fs";
import path from "path";
import {
  getReport,
  getReportMultiPrint,
  merdgeTosingleReport,
  getExcelReport
} from "./report_generation";
import algaehUtilities from "algaeh-utilities/utilities";
const exec = require("child_process").exec;
const app = exxpress();
app.server = http.createServer(app);

app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    limit: "200kb"
  })
);
// app.use(
//   exxpress.static(
//     path.join(process.cwd(), "/algaeh_report_tool/templates/report_assets")
//   )
// );
app.use(compression());
if (process.env.NODE_ENV == "production") {
  app.set("view cache", true);
}
process.on("warning", warning => {
  console.warning("warning", warning);
});
process.on("uncaughtException", error => {
  console.error("Uncaught Exception", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection", { reason: reason, promise: promise });
});
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
      // req.userIdentity = header;
      req.userIdentity = { ...header, "x-branch": reqH["x-branch"] };
      let reqUser = utilities.getTokenData(_token).id;
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

    res.setHeader("connection", "keep-alive");
    next();
  } else {
    res.status(utilities.httpStatus().unAuthorized).json({
      success: false,
      message: "unauthorized access"
    });
  }
});
app.use("/api/v1/report", getReport);
app.use("/api/v1/excelReport", getExcelReport);

app.use("/api/v1/multireports", getReportMultiPrint, merdgeTosingleReport);
app.use("/api/v1/pentahoreport", (req, res) => {
  let input = req.query;

  const _path = path.join(process.cwd(), "algaeh_report_tool");
  const outputFileName = moment().format("YYYYMMDDHHmmss");
  let argumentString = JSON.stringify(input.rep)
    .replace("$outputFileName", outputFileName)
    .replace("$reportLocation", _path);
  const _jsonParam = JSON.parse(JSON.parse(argumentString));
  const _outputFile =
    _jsonParam.outputFileName +
    "." +
    (_jsonParam.outputFileType == "EXCEL" ? "xlsx" : _jsonParam.outputFileType);
  exec(
    "java -jar " + _path + "/pentaho_reporting.jar " + argumentString,
    function(err, stdout, stderr) {
      if (err) {
        console.log(err);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(err);
      }
      console.log(stdout);
      const _outFile = path.join(_path, "Output", _outputFile);

      fs.exists(_outFile, exists => {
        if (exists) {
          res.writeHead(200, {
            "Content-type":
              "application/" +
              (_jsonParam.outputFileType == "EXCEL"
                ? "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : _jsonParam.outputFileType),
            // "content-type": "application/xml", //vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=" + _outputFile
          });
          fs.createReadStream(_outFile).pipe(res);
        } else {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("ERROR File does not exist");
        }
      });
    }
  );
});
app.server.listen(_port);
console.log(`Report Server is running  on PORT  - ${_port} *`);
export default app;
module.exports = app;
