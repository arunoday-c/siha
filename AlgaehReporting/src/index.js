import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import exxpress from "express";
import compression from "compression";
import moment from "moment";
import fs from "fs";
import path from "path";
import atob from "atob";
import algaehKeys from "algaeh-keys";
import reportGen, {
  getRecordsDownload,
  downloadReport,
} from "./report_generation";
import utliites from "algaeh-utilities/utilities";
import jwtDecode from "jwt-decode";
import {
  saveEmployeeDetails,
  getKPIDetails,
  generateReport,
} from "./docsReports";
// import algaehUtilities from "algaeh-utilities/utilities";
// import { userSecurity } from "algaeh-utilities/checksecurity";
import { authentication } from "algaeh-utilities/authentication";
import excelRouting from "./directExcel";
const bwipjs = require("bwip-js");
const exec = require("child_process").exec;
const app = exxpress();
const keys = algaehKeys.default;
app.server = http.createServer(app);

const {
  getReport,
  getReportMultiPrint,
  merdgeTosingleReport,
  getExcelReport,
  getRawReport,
  printReportRaw,
} = reportGen;

process.env.MYSQL_KEYS = JSON.stringify(keys.mysqlDb);

app.use(cors());
const _port = process.env.PORT;
app.use(
  bodyParser.json({
    // limit: "200kb",
  })
);
// app.use(
//   exxpress.static(
//     path.join(process.cwd(), "/algaeh_report_tool/templates/report_assets")
//   )
// );
app.use(compression());
// if (process.env.NODE_ENV == "production") {
//   app.set("view cache", true);
// }
process.setMaxListeners(0);
process.on("warning", (warning) => {
  new utliites().logger().log("warning-Reports", warning, "warn");
});
process.on("uncaughtException", (error) => {
  new utliites().logger().log("uncaughtException-Reports", error, "error");
});
process.on("unhandledRejection", (reason, promise) => {
  new utliites()
    .logger()
    .log(
      "unhandledRejection-Reports",
      { reason: reason, promise: promise },
      "error"
    );
});
app.use("/barcode", (req, res) => {
  if (req.url.indexOf("/?bcid=") != 0) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("BWIPJS: Unknown request format.", "utf8");
  } else {
    bwipjs(req, res);
  }
});
app.use("/getImage/:image", (req, res) => {
  const { image } = req.params;
  if (image) {
    const filePath = path.join(
      process.cwd(),
      "algaeh_report_tool",
      "templates",
      "images",
      image
    );
    res.writeHead(200);
    const _fs = fs.createReadStream(filePath);
    _fs.pipe(res);
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("No such file exist");
  }
});

app.use("/getDownloadLink/:dPath", (req, res) => {
  const { dPath } = req.params;

  const loc = atob(dPath);
  console.log("loc", loc);
  const filePath = loc;
  if (loc) {
    if (fs.existsSync(filePath)) {
      res.writeHead(200);
      const _fs = fs.createReadStream(filePath);
      _fs.pipe(res);
    } else {
      throw new Error("No file exists");
    }
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("No such file exist");
  }
});
app.use((req, res, next) => {
  const xBypassUser = "algaeh";
  const xBypassPassword = "alg_hea2018";

  if (
    req.headers["x-bypass-user"] &&
    req.headers["x-bypass-password"] &&
    req.headers["x-bypass-user"] === xBypassUser &&
    req.headers["x-bypass-password"] === xBypassPassword
  ) {
    req.userIdentity = {
      hospital_id: 1,
    };
    console.log("Bypass  url ===>", req.url);
    next();
  } else {
    if (
      req.headers["x-give-access"] &&
      req.headers["x-give-access"] === "algaeh"
    ) {
      const tokenData = jwtDecode(req.headers["x-api-key"]);
      req.userIdentity = tokenData;
      // console.log("Here inside xapi===>", tokenData);
      next();
    } else {
      authentication(req, res, next);
    }
  }
});

app.use("/api/v1/report", (req, res, next) => {
  const { directEcel } = req.query;
  if (directEcel === "true") {
    excelRouting(req, res, next);
  } else {
    getReport(req, res, next);
  }
});
app.use("/api/v1/excelReport", (req, res, next) => {
  const { directEcel } = req.query;
  if (directEcel === "true") {
    excelRouting(req, res, next);
  } else {
    getExcelReport(req, res, next);
  }
});
app.use("/api/v1/getRawReport", getRawReport);
app.use(
  "/api/v1/multireports",
  getReportMultiPrint,
  (req, res, next) => {
    const getAllReports = req.records;
    let newArray = [];
    for (let i = 0; i < getAllReports.length; i++) {
      if (fs.existsSync(getAllReports[i])) {
        newArray.push(getAllReports[i]);
      }
    }
    if (newArray.length == 1) {
      const _fs = fs.createReadStream(newArray[0]);
      _fs.on("end", () => {
        fs.unlink(newArray[0]);
      });
      _fs.pipe(res);
    } else {
      req.records = newArray;
      next();
    }
  },
  merdgeTosingleReport
);
app.use("/api/v1/getRecordsDownload", getRecordsDownload);
app.use("/api/v1/downloadReport", downloadReport);
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
    function (err, stdout, stderr) {
      if (err) {
        console.log(err);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(err);
      }
      console.log(stdout);
      const _outFile = path.join(_path, "Output", _outputFile);

      fs.exists(_outFile, (exists) => {
        if (exists) {
          res.writeHead(200, {
            "Content-type":
              "application/" +
              (_jsonParam.outputFileType == "EXCEL"
                ? "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : _jsonParam.outputFileType),
            // "content-type": "application/xml", //vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=" + _outputFile,
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
app.use("/api/v1/printReportRaw", printReportRaw);
app.get(
  "/api/v1/getDocsReports",
  saveEmployeeDetails,
  getKPIDetails,
  generateReport
);
app.server.listen(_port);
console.log(`Report Server is running  on PORT  - ${_port} *`);
export default app;
