import fs from "fs-extra";
import puppeteer from "puppeteer";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import path from "path";
import moment from "moment";
import merge from "easy-pdf-merge";
import hbs from "handlebars";
import shortid from "shortid";
import xtype from "xtypejs";
import { v4 as uuidv4 } from "uuid";
// import "babel-polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
// import chrome from "algaeh-keys";
import writtenForm from "written-number";
import cheerio from "cheerio";
import FormData from "form-data";
import axios from "axios";

import Excel from "exceljs/modern.browser";
import utilitites from "algaeh-utilities/utilities";
import { convertMilimetersToPixel } from "algaeh-utilities/reportConvetions";
// import { generatePDFReport } from "./hummus/index";
// const chromePath =
// chrome.default.chromePuppeteer != null ? chrome.default.chromePuppeteer : {};

// const XlsxTemplate = require("xlsx-template");

const excel_cel_numFmt = "#,##0.00";
let outputFolder = path.join(
  path.join(process.cwd(), "algaeh_report_tool/templates", "Output")
);
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const compile = async function (templateName, data) {
  try {
    const filePath = path.join(
      process.cwd(),
      "algaeh_report_tool/templates",
      `${templateName}.hbs`
    );
    // console.log("data===>", data, "templateName===>", templateName);
    const html = await fs.readFile(filePath, "utf-8");

    return await hbs.compile(html)(data);
  } catch (error) {
    console.error("Compile Data error,changing to No Records Found : ", error);
    return "<center><b>No Records Found</b></center>";
  }
};

const compileExcel = async function (templateName, data) {
  const filePath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${templateName}.hbs`
  );
  const html = await fs.readFile(filePath, "utf-8");
  return hbs.compile(html)(data);
};
/**
value = value of a number
precesions= number of decimal places from (request identity)
addSymbol = true | false default true
symbol_position = request identity
currency_symbol = request identity
*/
hbs.registerHelper("numberFormating", function (value, currency) {
  const addSymbol = currency.addSymbol;
  return new utilitites().getCurrencyFormart(value, { ...currency }, addSymbol);
});
hbs.registerHelper("sumOf", function (data, sumby, callBack) {
  data = Array.isArray(data) ? data : [];
  const sumof = _.sumBy(data, function (s) {
    return s[sumby];
  });
  if (typeof callBack == "function") callBack(sumof);
  else {
    return sumof;
  }
});
hbs.registerHelper("countOf", function (data) {
  data = Array.isArray(data) ? data : [];
  return data.length;
});
hbs.registerHelper("if", function (value1, value2, options) {
  if (value1 == value2) return options.fn(this);
  else return options.inverse(this);
});
hbs.registerHelper("ifExist", function (value1, options) {
  if (value1) return options.fn(this);
  else return options.inverse(this);
});
hbs.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

// hbs.registerHelper("ifgtreql", function (value1, value2) {
//   console.log("value1: ", value1)
//   console.log("value2: ", value2)
//   if (value1 > value2) { return true; } else { return false; }
// });
hbs.registerHelper("dateTime", function (value, type) {
  type = type || "date";

  if (value == null) {
    return "";
  }
  if (value != "") {
    const dt = value instanceof Date && !isNaN(value);
    if (!dt) {
      return value;
    }
    if (type == "date") {
      return moment(value).format("DD-MM-YYYY");
    } else {
      return moment(value).format("hh:mm A");
    }
  } else {
    return value;
  }
});

hbs.registerHelper("capitalization", function (value) {
  return _.startCase(_.toLower(value));
});
//created by irfan
hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

//created by irfan:to check array has elements
hbs.registerHelper("hasElement", function (conditional, options) {
  if (conditional.length > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
//created by irfan:
hbs.registerHelper(
  "dynamicSalary",
  function (searchKey, inputArray, comp_type) {
    if (comp_type == "E") {
      const obj = inputArray.find((item) => {
        return item.earnings_id == searchKey;
      });
      return obj ? obj.amount : "BBB";
    } else if (comp_type == "D") {
      const obj = inputArray.find((item) => {
        return item.deductions_id == searchKey;
      });
      return obj ? obj.amount : "BBB";
    } else if (comp_type == "C") {
      const obj = inputArray.find((item) => {
        return item.contributions_id == searchKey;
      });
      return obj ? obj.amount : "BBB";
    }
  }
);

hbs.registerHelper("importStyle", function (styleSheetName) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${styleSheetName}`
  );
  const style = fs.readFileSync(fullPath, "utf-8");
  return "<style type='text/css'>" + style + "</style>";
});

hbs.registerHelper("loadPage", function (filePath, data) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${filePath}`
  );
  const html = fs.readFileSync(fullPath, "utf-8");
  return hbs.compile(html)(data);
});

hbs.registerHelper("imageSource", function (filePath) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${filePath}`
  );
  const _extention = path.extname(fullPath).replace(".", "");
  const img = fs.readFileSync(fullPath, "base64");
  return "data:image/" + _extention + ";base64," + img;
});

hbs.registerHelper("groupBy", function (data, groupby) {
  const groupBy = _.chain(data)
    .groupBy(groupby)
    .map(function (detail, key) {
      return {
        [groupby]: key,
        groupDetail: detail,
      };
    })
    .value();

  return groupBy;
});
hbs.registerHelper("currentDateTime", function (type) {
  if (type == null || type == "") {
    return moment().format("DD-MM-YYYY");
  } else if (type == "time") {
    return moment().format("hh:mm A");
  } else {
    return moment().format("DD-MM-YYYY");
  }
});
hbs.registerHelper("firstElement", function (array, index, fieldName) {
  array = array || [];
  index = index || 0;
  if (array.length > 0) {
    return array[index][fieldName];
  } else {
    return null;
  }
});
hbs.registerHelper("consoleLog", function (data) {
  if (typeof data == "string") {
    return data;
  } else {
    return JSON.stringify(data);
  }
});

hbs.registerHelper(
  "imageUrl",
  function (filename, index, name, stringToappend, filetype, reqHeader) {
    const host =
      reqHeader === "none" ? "localhost" : reqHeader["host"].split(":")[0];
    console.log(filename, name, filetype);
    if (Array.isArray(filename)) {
      if (filename.length > 0) {
        stringToappend = stringToappend || "";
        const imageLocation =
          "http://" +
          host +
          ":3006/api/v1/Document/get?destinationName=" +
          filename[index][name] +
          stringToappend +
          "&fileType=" +
          filetype;

        return imageLocation;
      } else {
        return "";
      }
    } else {
      return (
        "http://localhost:3006/api/v1/Document/get?destinationName=" +
        filename +
        "&fileType=" +
        filetype
      );
    }
  }
);

hbs.registerHelper("logoUrl", function (logo_type, reqHead) {
  const image =
    logo_type === "ORG" ? reqHead.organization_id : reqHead.hims_d_hospital_id;
  let logo = `${image}_${logo_type}.png`;
  let fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates/images/",
    logo
  );
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(
      process.cwd(),
      "algaeh_report_tool/templates/images/clientLogo.png"
    );
  }
  const _extention = path.extname(fullPath).replace(".", "");
  const img = fs.readFileSync(fullPath, "base64");
  return "data:image/" + _extention + ";base64," + img;
});

hbs.registerHelper("barcode", function (type, text, includetext) {
  type = type || "code128";
  includetext = includetext === undefined ? `&includetext` : ``;
  const _text = encodeURIComponent(text);
  return `http://localhost:3018/barcode?bcid=${type}&text=${_text}${includetext}&guardwhitespace`;
});

hbs.registerHelper("commentBreakUp", function (comment_data) {
  if (comment_data === "" || comment_data === null) {
    return [];
  } else {
    // return comment_data.split("<br/>");
    return comment_data.split("<br/>").filter((f) => f && f !== "");
  }
});
hbs.registerHelper("dynamic", (records, columns) => {
  const tds = columns.map((item) => {
    return `<td class="numberFld">${records[item]}</td>`;
  });
  return tds;
});

const groupBy = (data, groupby) => {
  const groupBy = _.chain(data)
    .groupBy(groupby)
    .map(function (detail, key) {
      return {
        [groupby]: key,
        groupDetail: detail,
      };
    })
    .value();
  return groupBy;
};
const arrayFirstRowToObject = (data, index) => {
  index = index || 0;
  if (data == null) {
    return {};
  } else if (data.length > 0 && data.length <= index) {
    return data[index];
  } else {
    return {};
  }
};
function encodeHexaDecimal(index, str) {
  var hex, i;
  var result = "";
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ("" + hex).slice(-4);
  }
  return `${index}${str.length.toString(16).padStart(2, 0)}${result}`;
}
function hexToBase64String(result) {
  return Buffer.from(result, "hex").toString("base64");
}
function decodeHexaDecimal(base64Str) {
  const hex = Buffer.from(base64Str, "base64").toString("hex");
  var j;
  var hexes = hex.match(/.{1,4}/g) || [];
  var back = "";
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }
  return back;
}
const { traceLog } = process.env;
export default {
  getReport: async (req, res) => {
    const input = req.query;
    const _mysql = new algaehMysql();
    const headerRequest = req.headers["x-give-access"];
    // const multiMerdgeReport = input.multiMerdgeReport;
    let responseAsJson = false;
    if (headerRequest === "algaeh") {
      responseAsJson = true;
      res
        .status(201)
        .json({ success: true, message: "your request under process" });
    }

    try {
      const _inputParam = JSON.parse(input.report);
      const {
        others,
        multiMerdgeReport,
        qrCodeReport,
        reportToPortal,
        rpt_type,
      } = _inputParam;

      let usehbs = "";
      let singleHeaderFooter = false;
      if (others) {
        usehbs = others.usehbs ? others.usehbs : "";
        singleHeaderFooter =
          others.singleHeaderFooter === undefined
            ? false
            : others.singleHeaderFooter;
      }

      let shortUrl = "";
      if (qrCodeReport) {
        shortUrl = shortid.generate();
      }

      const qrUrl = process.env.QR_CODE_CLIENT ?? "http://localhost:3024/";
      const portalUrl =
        process.env.PORTAL_HOST ?? "http://localhost:4402/api/v1";

      _mysql
        .executeQuery({
          query:
            "SELECT report_type,report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name,report_props,report_thermal_header_file_name,report_thermal_footer_file_name,thermal_report_props from algaeh_d_reports where status='A' and report_name in (?);\
            select H.*,O.* from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
          printQuery: true,
        })
        .then(async (data) => {
          _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
          _inputParam["crypto"] = req.userIdentity;

          let _reportCount = data[0].length;
          let considerSameReport = false;
          let reportValues = {};
          if (multiMerdgeReport) {
            considerSameReport = true;
            _reportCount =
              typeof multiMerdgeReport === "string"
                ? parseInt(multiMerdgeReport)
                : multiMerdgeReport;
          }

          if (_reportCount > 0) {
            let _reportOutput = [];
            for (let r = 0; r < _reportCount; r++) {
              let _r = r;
              if (considerSameReport) {
                _r = 0;
              }
              const _data = data[0][_r];

              const _inputOrders = eval(
                _data.report_input_series === null
                  ? []
                  : _data.report_input_series
              );

              let _value = [];
              for (var i = 0; i < _inputOrders.length; i++) {
                let _params = undefined;
                if (multiMerdgeReport) {
                  _params = _.find(
                    _inputParam.reportParams[r],
                    (f) => f.name == _inputOrders[i]
                  );
                } else {
                  _params = _.find(
                    _inputParam.reportParams,
                    (f) => f.name == _inputOrders[i]
                  );
                }

                if (_params != undefined) {
                  _value.push(_params.value);
                } else if (_inputOrders[i] == "login_branch") {
                  _value.push(req.userIdentity["hospital_id"]);
                } else {
                  _value.push(null);
                }
              }
              let queryObject = {
                query: _data.report_query,
                values: _value,
                printQuery: true,
              };

              if (_data.report_query == null || _data.report_query == "") {
                queryObject = {
                  query: "select 1",
                  printQuery: true,
                };
              }
              if (traceLog === "true")
                console.log("queryObject===>", queryObject);
              await _mysql
                .executeQuery(queryObject)
                .then(async (result) => {
                  const _path = await path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates/Output",
                    `${_data.report_name}_${uuidv4()}_${
                      multiMerdgeReport ? "_" + r : ""
                    }`
                  );

                  const singleHeader = _data.report_type ? true : false;
                  // const _reportType = "PDF";

                  const _supportingJS = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates",
                    `${_data.report_name}${usehbs}.js`
                  );
                  if (traceLog === "true")
                    console.log("_supportingJS===>", _supportingJS);
                  const _header = req.headers;

                  const startGenerate = async (e) => {
                    const baseObj = {
                      header: {
                        top: "150px",
                        bottom: " ",
                        right: " ",
                        left: " ",
                      },
                      footer: {
                        top: " ",
                        bottom: "100px",
                        right: " ",
                        left: " ",
                      },
                      pageOrientation: "",
                    };
                    const styleObj = _data.report_props
                      ? JSON.parse(_data.report_props)
                      : baseObj;

                    const _outPath = (await _path) + ".pdf";
                    await _reportOutput.push(_outPath);
                    const browser = await puppeteer.launch({
                      headless: true,
                      args: ["--no-sandbox", "--disable-setuid-sandbox"],
                      // headless: true,
                      // args: process.env.CHROME_BIN
                      //   ? [
                      //       "--no-sandbox",
                      //       "--disable-setuid-sandbox",
                      //       "--headless",
                      //       "--disable-gpu",
                      //       "--disable-dev-shm-usage",
                      //     ]
                      //   : [],
                    });
                    const page = await browser.newPage();
                    let _pdfTemplating = {};
                    let header_format = "";

                    if (singleHeaderFooter === false) {
                      if (
                        _data.report_header_file_name != null &&
                        _data.report_header_file_name != ""
                      ) {
                        //const _header

                        const callHeader = async () => {
                          header_format = await compile(
                            _data.report_header_file_name,
                            {
                              reqHeader: _header,
                              ...data[1][0],
                              ...result.headRecord,
                              identity: req.userIdentity,
                              user_name: req.userIdentity["username"],
                              report_name_for_header:
                                _data.report_name_for_header,
                              filter:
                                _inputParam.reportParams == null
                                  ? []
                                  : _inputParam.reportParams,
                              specialHeader: _inputParam.specialHeader,
                            }
                          );

                          // const styleObj = String(_data.report_props);
                          _pdfTemplating["headerTemplate"] = header_format;

                          _pdfTemplating["margin"] = {
                            top: styleObj.header.top,
                            // bottom: styleObj.header.bottom?styleObj.header.bottom:""
                            ..._inputParam.headerProps,
                          };
                        };
                        // if (multiMerdgeReport) {
                        //   if (r === 0) {
                        //     callHeader();
                        //   }
                        // } else {
                        callHeader();
                        //}
                      }
                    } else {
                      if (_data.report_type) {
                        header_format = await compile(
                          `${
                            _data.report_thermal_header_file_name
                              ? _data.report_thermal_header_file_name
                              : `Header${_data.report_type}`
                          }`,
                          {
                            reqHeader: _header,
                            ...data[1][0],
                            identity: req.userIdentity,
                            report_name_for_header:
                              _data.report_name_for_header,
                          }
                        );
                      }
                    }
                    let footerFormat = "";
                    if (singleHeaderFooter === false) {
                      if (
                        _data.report_footer_file_name != null &&
                        _data.report_footer_file_name != ""
                      ) {
                        // if (!multiMerdgeReport) {
                        footerFormat = await compile(
                          _data.report_footer_file_name,
                          {
                            reqHeader: _header,
                            ...data[1][0],
                            identity: req.userIdentity,
                            report_name_for_header:
                              _data.report_name_for_header,
                          }
                        );

                        _pdfTemplating["footerTemplate"] = footerFormat;
                        _pdfTemplating["margin"] = {
                          ..._pdfTemplating["margin"],
                          bottom: styleObj.footer.bottom,
                          ..._inputParam.footerProps,
                        };
                        //}
                      } else {
                        //if (!multiMerdgeReport) {
                        footerFormat = `<style> .pdffooter { font-size: 8px;
                            font-family: Arial, Helvetica, sans-serif; font-weight: bold; width:96%; text-align: center; color: grey; padding-left: 10px; }
                          .showreportname{float:left;padding-left:5px;font-size: 08px;}
                          .showcompay{float:right;padding-right:5px;font-size: 08px;}
                          </style>
                          <div class="pdffooter">
                          <span class="showreportname">System Generated Report (Generated By: ${
                            req.userIdentity["employee_code"]
                          }/${
                          req.userIdentity["full_name"]
                        } on ${moment().format("DD-MM-YYYY")})</span>
                          <span>Page </span>
                          <span class="pageNumber"></span> / <span class="totalPages"></span>
                          <span class="showcompay">Powered by Algaeh Techonologies</span>
                        </div>`;

                        // if (singleHeaderFooter === false) {
                        _pdfTemplating["footerTemplate"] = footerFormat;
                        // }

                        _pdfTemplating["margin"] = {
                          ..._pdfTemplating["margin"],
                          bottom: styleObj.footer.bottom,
                          ..._inputParam.footerProps,
                        };
                        // }
                      }
                    } else {
                      if (_data.report_type) {
                        const thermalFooterFromDB = `${
                          _data.report_thermal_footer_file_name
                            ? _data.report_thermal_footer_file_name
                            : `Footer${_data.report_type}`
                        }`;

                        const filePath = path.join(
                          process.cwd(),
                          "algaeh_report_tool/templates",
                          `${thermalFooterFromDB}.hbs`
                        );

                        if (fs.existsSync(filePath)) {
                          footerFormat = await compile(
                            // "Footer" + _data.report_type,
                            thermalFooterFromDB,
                            {
                              reqHeader: _header,
                              ...data[1][0],
                              identity: req.userIdentity,
                              report_name_for_header:
                                _data.report_name_for_header,
                            }
                          );
                        } else {
                          generalFooter();
                        }
                      } else {
                        generalFooter();
                      }

                      function generalFooter() {
                        footerFormat = `<style> .pdffooter { font-size: 8px;
                          font-family: Arial, Helvetica, sans-serif; font-weight: bold; width:96%; text-align: center; color: grey; padding-left: 10px; }
                        .showreportname{float:left;padding-left:5px;font-size: 07px;}
                        .showcompay{float:right;padding-right:5px;font-size: 07px;}
                        </style><div class="pdffooter">
                        <span class="showreportname">Generated By: ${
                          req.userIdentity["employee_code"]
                        } on ${moment().format("DD-MM-YYYY")}</span>
                        <span class="showcompay">Powered by Algaeh Techonologies</span>
                        </div>`;
                      }
                    }
                    let detailResult = result;
                    if (qrCodeReport) {
                      // const qrUrl =
                      //   process.env.QR_CODE_CLIENT ?? "http://localhost:3024/";
                      // shortUrl = shortid.generate();
                      detailResult["shortUrl"] = `${qrUrl}${shortUrl}`;
                    }

                    let pageContent = await compile(
                      `${_data.report_name}${usehbs}`,
                      {
                        ...detailResult,
                        reqHeader: _header,
                      }
                    );

                    if (singleHeaderFooter === true) {
                      pageContent = header_format + pageContent + footerFormat;
                    }

                    await page.setContent(pageContent);

                    let pageOrentation = {
                      landscape:
                        styleObj.pageOrientation === "landscape" ||
                        (_inputParam.pageOrentation !== null &&
                          _inputParam.pageOrentation == "landscape"),
                    };

                    let pageSize =
                      _inputParam.pageSize == null
                        ? { format: "A4" }
                        : { format: _inputParam.pageSize };
                    let displayHeaderFooter = true;
                    const { others } = _inputParam;
                    if (others !== undefined) {
                      const existsSize = Object.keys(others).find(
                        (f) => f === "width" || f === "height"
                      );

                      if (existsSize !== undefined) {
                        pageSize = {};
                        _pdfTemplating = {};
                        await page.addStyleTag({
                          content: "@page:first {margin-top: -8px;}",
                        });

                        const sizes = convertMilimetersToPixel(others);

                        await page.setViewport({
                          width: Math.ceil(sizes.width),
                          height: Math.ceil(sizes.height),
                        });
                      }
                      displayHeaderFooter =
                        others.showHeaderFooter === false ? false : true;
                    }

                    await page.evaluate(() => {
                      const div = document.createElement("div");
                      div.className = "watermark";
                      document.body.appendChild(div);
                    });

                    if (!_pdfTemplating["margin"]) {
                      _pdfTemplating["margin"] = {
                        bottom: "40px",
                      };
                    } else {
                      if (!_pdfTemplating["margin"]["bottom"]) {
                        _pdfTemplating["margin"]["bottom"] = "40px";
                      }
                    }
                    await page.pdf({
                      path: _outPath,
                      ...pageSize,
                      ...pageOrentation,
                      printBackground: true,
                      displayHeaderFooter: displayHeaderFooter,
                      ..._pdfTemplating,
                      ...others,
                    });

                    await browser.close();
                    // console.log(
                    //   " _reportOutput.length ",

                    //   r,
                    //   e,
                    //   r === parseInt(multiMerdgeReport) - 1
                    // );
                    let pass = false;
                    // _reportOutput.length
                    if (multiMerdgeReport) {
                      if (
                        _reportOutput.length === parseInt(multiMerdgeReport)
                      ) {
                        for (let k = 0; k < _reportOutput.length; k++) {
                          pass = false;
                          if (fs.existsSync(_reportOutput[k])) {
                            pass = true;
                          } else {
                            pass = false;
                          }
                        }
                      }
                    } else {
                      pass = true;
                    }

                    // if (r == _reportCount - 1) {
                    if (pass === true) {
                      let _outfileName = "merdge_" + uuidv4() + ".pdf";
                      let _rOut = path.join(
                        process.cwd(),
                        "algaeh_report_tool/templates/Output",
                        _outfileName
                      );

                      // if (pass === true) {
                      if (_reportOutput.length > 1) {
                        _mysql.releaseConnection();
                        merge(_reportOutput, _rOut, (error) => {
                          if (error) {
                            console.log("error", error);
                            if (responseAsJson === false) {
                              res
                                .status(400)
                                .send({ error: JSON.stringify(error) });
                            }
                          } else {
                            fs.exists(_rOut, (exists) => {
                              if (exists) {
                                if (responseAsJson === false) {
                                  res.writeHead(200, {
                                    "content-type": "application/pdf",
                                    "content-disposition":
                                      "attachment;filename=" + _outfileName,
                                  });
                                  const _fs = fs.createReadStream(_rOut);
                                  _fs.on("end", async () => {
                                    if (qrCodeReport) {
                                      try {
                                        const form = new FormData();
                                        form.append(
                                          "file",
                                          rptPath
                                          // fs.createReadStream(rptPath)
                                        );
                                        form.append("shortUrl", shortUrl);
                                        await axios
                                          .post(`${qrUrl}uploadFile`, form, {
                                            headers: { ...form.getHeaders() },
                                          })
                                          .catch((error) => {
                                            console.error(error.message);
                                          });
                                      } catch (e) {
                                        console.error(
                                          "QR Code Server issue===>",
                                          e
                                        );
                                      }
                                    }

                                    fs.unlink(_rOut);
                                    for (
                                      let f = 0;
                                      f < _reportOutput.length;
                                      f++
                                    ) {
                                      fs.unlink(_reportOutput[f]);
                                    }
                                  });

                                  _fs.pipe(res);
                                } else {
                                  const { primaryId } = input;
                                  // console.log("1=====>", _rOut);
                                  updateRequestedDownload(primaryId, _rOut);
                                }
                              } else {
                                if (responseAsJson === false) {
                                  res.status(400).send({
                                    error: "ERROR File does not exist",
                                  });
                                } else {
                                  console.error(
                                    "Error occur inside Request update @ ",
                                    new Date().toLocaleString(),
                                    "===> ERROR File does not exist"
                                  );
                                }
                              }
                            });
                          }
                        });
                      } else {
                        if (input["sendPath"]) {
                          _mysql.releaseConnection();
                          if (responseAsJson === false) {
                            res
                              .status(200)
                              .json({
                                path: _reportOutput[0],
                                filename: _data.report_name_for_header + ".pdf",
                              })
                              .end();
                          } else {
                            const { primaryId } = input;
                            console.log("2=====>", _reportOutput[0]);
                            updateRequestedDownload(
                              primaryId,
                              _reportOutput[0]
                            );
                          }
                        } else {
                          fs.exists(_reportOutput[0], (exists) => {
                            _mysql.releaseConnection();
                            if (exists) {
                              if (responseAsJson === false) {
                                res.writeHead(200, {
                                  "content-type": "application/pdf",
                                  "content-disposition":
                                    "attachment;filename=" + _outfileName,
                                });
                                const _fs = fs.createReadStream(
                                  _reportOutput[0]
                                );
                                _fs.on("end", async () => {
                                  const rptPath = fs.createReadStream(
                                    _reportOutput[0]
                                  );
                                  //  = _reportOutput[0];

                                  if (qrCodeReport) {
                                    try {
                                      const form = new FormData();
                                      form.append(
                                        "file",
                                        rptPath
                                        // fs.createReadStream(rptPath)
                                      );
                                      form.append("shortUrl", shortUrl);
                                      await axios
                                        .post(`${qrUrl}uploadFile`, form, {
                                          headers: { ...form.getHeaders() },
                                        })
                                        .catch((error) => {
                                          console.error(error.message);
                                        });
                                    } catch (e) {
                                      console.error(
                                        "QR Code Server issue===>",
                                        e
                                      );
                                    }
                                  }

                                  // fs.unlink(_reportOutput[0]);
                                });

                                if (reportToPortal === "true") {
                                  const rptParameters =
                                    _inputParam.reportParams;
                                  const portal_patient_identity =
                                    rptParameters.find(
                                      (f) => f.name === "patient_identity"
                                    ).value;
                                  const portal_service_id = rptParameters.find(
                                    (f) => f.name === "service_id"
                                  )?.value;
                                  const portal_visit_code = rptParameters.find(
                                    (f) => f.name === "visit_code"
                                  ).value;

                                  if (
                                    portal_patient_identity &&
                                    portal_service_id &&
                                    portal_visit_code
                                  ) {
                                    const formD = new FormData();
                                    formD.append(
                                      "file",
                                      _fs
                                      // fs.createReadStream(rptPath)
                                    );
                                    formD.append(
                                      "details",
                                      JSON.stringify({
                                        patient_identity:
                                          portal_patient_identity,
                                        service_id: portal_service_id,
                                        visit_code: portal_visit_code,
                                        hospital_id:
                                          req.userIdentity["hospital_id"],
                                      })
                                    );
                                    formD.append(
                                      "rpt_type",
                                      rpt_type ?? "PATIENT_REPORT"
                                    );

                                    axios
                                      .post(
                                        `${portalUrl}/report/upload`,
                                        formD,
                                        {
                                          headers: { ...formD.getHeaders() },
                                        }
                                      )
                                      .then(() => {
                                        console.log(
                                          "report updated succesfully"
                                        );
                                      })
                                      .catch((error) => {
                                        console.log("error ====> ", error);
                                        // console.error(error.message);
                                      });
                                  }
                                }
                                _fs.pipe(res);
                              } else {
                                const { primaryId } = input;
                                console.log("2=====>", _reportOutput[0]);
                                updateRequestedDownload(
                                  primaryId,
                                  _reportOutput[0]
                                );
                              }
                            } else {
                              _mysql.releaseConnection();
                              if (responseAsJson === false) {
                                res.status(400).send({
                                  error: "ERROR File does not exist",
                                  filename: _inputParam.reportName,
                                });
                              } else {
                                console.error(
                                  "Error occur inside Request update @ ",
                                  new Date().toLocaleString(),
                                  "===> ERROR File does not exist"
                                );
                              }
                            }
                          });
                        }
                      }
                    }
                  };

                  if (fs.existsSync(_supportingJS)) {
                    const { executePDF } =
                      __non_webpack_require__(_supportingJS);

                    await executePDF({
                      mysql: _mysql,
                      inputs: _inputOrders,
                      args: multiMerdgeReport
                        ? {
                            reportParams: _inputParam.reportParams[r],
                            crypto: req.userIdentity,
                          }
                        : _inputParam,
                      // args: _inputParam,
                      loadash: _,
                      xtype: xtype,
                      moment: moment,
                      mainData: data[1],
                      result: result,
                      writtenForm: writtenForm,
                      convertMilimetersToPixel: convertMilimetersToPixel,
                      utilitites: () => {
                        return new utilitites();
                      },
                      currencyFormat: (currency, formater, addSymbol) => {
                        return new utilitites().getCurrencyFormart(
                          currency,
                          formater,
                          addSymbol
                        );
                      },
                      shortenURL: `${
                        process.env.QR_CODE_CLIENT ?? "http://localhost:3024/"
                      }${shortUrl}`,
                      encodeHexaDecimal,
                      decodeHexaDecimal,
                      hexToBase64String,
                    })
                      .then(async (resultReq) => {
                        result = resultReq;
                        await startGenerate(r);
                      })
                      .catch((error) => {
                        console.log("error in report generation : ", error);
                      });
                  } else {
                    if (
                      _data.data_manupulation != null &&
                      _data.data_manupulation != ""
                    ) {
                      const data_string = "`" + _data.data_manupulation + "`";
                      const _resu = eval(data_string);
                      result = JSON.parse(_resu);
                    }
                    await startGenerate(r);
                  }
                })
                .catch((error) => {
                  _mysql.releaseConnection();
                  if (responseAsJson === false) {
                    res.status(400).send({
                      error: JSON.stringify(error),
                      stack: error.stack,
                      message: error.message,
                      filename: _inputParam.reportName,
                    });
                  } else {
                    console.error(
                      "Error occur inside Request update @ ",
                      new Date().toLocaleString(),
                      "===>",
                      error.stack
                    );
                  }
                });
            }
          } else {
            if (responseAsJson === false) {
              res.status(400).send({
                error: "No such report exists",
                filename: _inputParam.reportName,
              });
            } else {
              console.error(
                "Error occur inside Request update @ ",
                new Date().toLocaleString(),
                "===>No such report exists"
              );
            }
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          if (responseAsJson === false) {
            res.status(400).send({
              error: JSON.stringify(error),
              stack: error.stack,
              message: error.message,
              filename: _inputParam.reportName,
            });
          }
          console.log(
            "Error in report table query execution : ",
            JSON.stringify(error)
          );
        });
    } catch (e) {
      _mysql.releaseConnection();
      console.log("Error in try catch : ", JSON.stringify(error));
      if (responseAsJson === false) {
        res.status(400).send({
          error: JSON.stringify(e),
          stack: error.stack,
          message: error.message,
          filename: _inputParam.reportName,
        });
      }
    }
  },
  getReportMultiPrint: async (req, res, next) => {
    const input = req.query;

    const _mysql = new algaehMysql();
    try {
      const _inputParam = JSON.parse(input.report);

      _mysql
        .executeQuery({
          query:
            "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
            select H.*, O.* from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity.hospital_id],
          printQuery: true,
        })
        .then((data) => {
          const templates = data[0];
          let subReportCollection = [];
          const inputParameters = _inputParam.reportParams;
          let promises = [];
          for (let p = 0; p < inputParameters.length; p++) {
            const inputData = inputParameters[p];
            let reportSequence = _inputParam.reportName;
            for (let i = 0; i < reportSequence.length; i++) {
              promises.push(
                new Promise((resolve, reject) => {
                  const resourceTemplate = _.find(
                    templates,
                    (f) => f.report_name == reportSequence[i]
                  );
                  const inputOrders = eval(
                    resourceTemplate.report_input_series
                  );
                  let _value = [];
                  for (var ip = 0; ip < inputOrders.length; ip++) {
                    const _params = _.find(
                      inputData,
                      (f) => f.name == inputOrders[ip]
                    );
                    if (_params != undefined) {
                      _value.push(_params.value);
                    } else {
                      _value.push(null);
                    }
                  }
                  const _myquery = _mysql.mysqlQueryFormat(
                    resourceTemplate.report_query,
                    _value
                  );
                  _mysql
                    .executeQuery({
                      query: _myquery,
                      printQuery: true,
                    })
                    .then((result) => {
                      const _path = path.join(
                        process.cwd(),
                        "algaeh_report_tool/templates/Output",
                        resourceTemplate.report_name +
                          moment().format("YYYYMMDDHHmmss") +
                          "_" +
                          i +
                          "_" +
                          p
                      );
                      const _outPath = _path + ".pdf";
                      subReportCollection.push(_outPath);
                      const startGenerate = async () => {
                        const browser = await puppeteer.launch({
                          headless: true,
                          args: ["--no-sandbox", "--disable-setuid-sandbox"],
                          //executablePath: process.env.CHROME_BIN || null,
                          // args: process.env.CHROME_BIN
                          //   ? [
                          //       "--no-sandbox",
                          //       "--disable-setuid-sandbox",
                          //       "--headless",
                          //       "--disable-gpu",
                          //       "--disable-dev-shm-usage",
                          //     ]
                          //   : [],
                        });
                        const page = await browser.newPage();
                        const _pdfTemplating = {};
                        if (
                          resourceTemplate.report_header_file_name != null &&
                          resourceTemplate.report_header_file_name != ""
                        ) {
                          const _header = await compile(
                            resourceTemplate.report_header_file_name,
                            {
                              ...data[1][0],
                              reqHeader: req.headers,
                              identity: req.userIdentity,
                              user_name: req.userIdentity["username"],
                              report_name_for_header:
                                resourceTemplate.report_name_for_header,
                            }
                          );
                          _pdfTemplating["headerTemplate"] = _header;
                          _pdfTemplating["margin"] = {
                            top: "140px",
                          };
                        }
                        if (
                          resourceTemplate.report_footer_file_name != null &&
                          resourceTemplate.report_footer_file_name != ""
                        ) {
                          _pdfTemplating["footerTemplate"] = await compile(
                            resourceTemplate.report_footer_file_name,
                            {
                              ...data[1][0],
                              reqHeader: req.headers,
                              report_name_for_header:
                                resourceTemplate.report_name_for_header,
                            }
                          );
                          _pdfTemplating["margin"] = {
                            ..._pdfTemplating["margin"],
                            bottom: "70px",
                          };
                        } else {
                          _pdfTemplating[
                            "footerTemplate"
                          ] = `<style> .pdffooter { font-size: 8px;
                        font-family: Arial, Helvetica, sans-serif; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }
                      .showreportname{float:left;padding-left:5px;font-size: 08px;}
                      .showcompay{float:right;padding-right:5px;font-size: 08px;}
                      </style>
                      <div class="pdffooter">
                      <span class="showreportname">${resourceTemplate.report_name_for_header}</span>
                      <span>Page </span>
                      <span class="pageNumber"></span> / <span class="totalPages"></span>
                      <span class="showcompay">Powered by Algaeh Technologies.</span>
                    </div>`;
                          _pdfTemplating["margin"] = {
                            ..._pdfTemplating["margin"],
                            bottom: "50px",
                          };
                        }

                        await page.setContent(
                          await compile(resourceTemplate.report_name, {
                            ...result,
                            reqHeader: req.headers,
                          })
                        );
                        await page.emulateMedia("screen");

                        const pageOrentation =
                          _inputParam.pageOrentation == null
                            ? {}
                            : _inputParam.pageOrentation == "landscape"
                            ? { landscape: true }
                            : {};
                        const pageSize =
                          _inputParam.pageSize == null
                            ? { format: "A4" }
                            : { format: _inputParam.pageSize };
                        await page.evaluate(() => {
                          const div = document.createElement("div");
                          div.className = "watermark";
                          document.body.appendChild(div);
                        });
                        await page.pdf({
                          path: _outPath,
                          ...pageSize,
                          ...pageOrentation,
                          printBackground: true,
                          displayHeaderFooter: true,
                          ..._pdfTemplating,
                        });
                        await browser.close();
                        resolve();
                      };

                      const _supportingJS = path.join(
                        process.cwd(),
                        "algaeh_report_tool/templates",
                        `${resourceTemplate.report_name}.js`
                      );

                      if (fs.existsSync(_supportingJS)) {
                        const { executePDF } =
                          __non_webpack_require__(_supportingJS);
                        executePDF({
                          mysql: _mysql,
                          inputs: _inputParam,
                          loadash: _,
                          moment: moment,
                          mainData: data[1],
                          result: result,
                          writtenForm: writtenForm,
                          currencyFormat: (currency, formater) => {
                            return new utilitites().getCurrencyFormart(
                              currency,
                              formater
                            );
                          },
                          utilitites: () => {
                            return new utilitites();
                          },
                          shortenURL: `${
                            process.env.QR_CODE_CLIENT ??
                            "http://localhost:3024/"
                          }${shortUrl}`,
                          encodeHexaDecimal,
                          decodeHexaDecimal,
                          hexToBase64String,
                        })
                          .then((resultReq) => {
                            result = resultReq;
                            startGenerate();
                          })
                          .catch((error) => {});
                      } else {
                        if (
                          resourceTemplate.data_manupulation != null &&
                          resourceTemplate.data_manupulation != ""
                        ) {
                          const data_string =
                            "`" + resourceTemplate.data_manupulation + "`";
                          const _resu = eval(data_string);
                          result = JSON.parse(_resu);
                        }
                        startGenerate();
                      }
                    })
                    .catch((error) => {
                      console.error(
                        "Error Report Name",
                        resourceTemplate.report_name
                      );
                      console.error("Error Query", _myquery);

                      reject(error);
                    });
                })
              );
            }
          }

          Promise.all(promises)
            .then(() => {
              _mysql.releaseConnection();
              req.records = subReportCollection;
              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();

              res.writeHead(400, { "Content-Type": "text/plain" });
              res.end(error);
            });
        })
        .catch((error) => {
          _mysql.releaseConnection();
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(e);
    }
  },
  merdgeTosingleReport: (req, res) => {
    const getAllReports = req.records;
    let _outfileName = "merdge_" + moment().format("YYYYMMDDHHmmss") + ".pdf";
    let _rOut = path.join(
      process.cwd(),
      "algaeh_report_tool/templates/Output",
      _outfileName
    );

    merge(getAllReports, _rOut, (error) => {
      if (error) {
        console.error(error);
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(error));
      } else {
        fs.exists(_rOut, (exists) => {
          if (exists) {
            res.writeHead(200, {
              "content-type": "application/pdf",
              "content-disposition": "attachment;filename=" + _outfileName,
            });
            const _fs = fs.createReadStream(_rOut);
            _fs.on("end", () => {
              fs.unlink(_rOut);
              for (let f = 0; f < getAllReports.length; f++) {
                fs.unlink(getAllReports[f]);
              }
            });
            _fs.pipe(res);
          } else {
            res.writeHead(400, {
              "Content-Type": "text/plain",
            });
            res.end("ERROR File does not exist");
          }
        });
      }
    });
  },
  getExcelReport: async (req, res, next) => {
    const input = req.query;
    const _mysql = new algaehMysql();
    try {
      const _inputParam = JSON.parse(input.report);
      _mysql
        .executeQuery({
          query:
            "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
      report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
      select H.*,O.* from hims_d_hospital H,hims_d_organization O \
      where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
          printQuery: true,
        })
        .then((data) => {
          _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
          _inputParam["crypto"] = req.userIdentity;
          const _data = data[0][0];
          const _inputOrders = eval(
            _data.report_input_series === null ? [] : _data.report_input_series
          );
          let _value = [];
          for (var i = 0; i < _inputOrders.length; i++) {
            const _params = _.find(
              _inputParam.reportParams,
              (f) => f.name == _inputOrders[i]
            );
            if (_params != undefined) {
              _value.push(_params.value);
            } else if (_inputOrders[i] == "login_branch") {
              _value.push(req.userIdentity["hospital_id"]);
            } else {
              _value.push(null);
            }
          }
          let queryObject = {
            query: _data.report_query,
            values: _value,
            printQuery: true,
          };
          if (_data.report_query == null || _data.report_query == "") {
            queryObject = {
              query: "select 1",
              printQuery: true,
            };
          }
          _mysql
            .executeQuery(queryObject)
            .then((result) => {
              let mainPath = path.join(
                process.cwd(),
                "algaeh_report_tool/templates"
              );
              // let templatePath = path.join(mainPath, "Excel");

              let filePathJs = path.join(
                mainPath,
                _inputParam.reportName + ".js"
              );
              let excelRun;

              const { executePDF } = __non_webpack_require__(
                path.join(mainPath, _inputParam.reportName + ".js")
              );
              excelRun = executePDF;
              const _input = { hospital_id: req.userIdentity.hospital_id };
              for (let i = 0; i < _inputParam.reportParams.length; i++) {
                const _inp = _inputParam.reportParams[i];
                _input[_inp.name] = _inp.value;
              }
              excelRun({
                mysql: _mysql,
                inputs: _inputOrders,
                args: _inputParam,
                loadash: _,
                moment: moment,
                mainData: data[1],
                result: result,
                writtenForm: writtenForm,
                currencyFormat: (currency, formater) => {
                  return new utilitites().getCurrencyFormart(
                    currency,
                    formater
                  );
                },
                utilitites: () => {
                  return new utilitites();
                },
                encodeHexaDecimal,
                decodeHexaDecimal,
                hexToBase64String,
              }).then((resultData) => {
                (async () => {
                  try {
                    let rawData = await compile(
                      _inputParam.reportName,
                      resultData
                    );

                    // console.log("rawData", rawData);
                    //ToDo need to remove only for testing purposes
                    // fs.writeFileSync(
                    //   path.resolve(outputFolder, "test.html"),
                    //   rawData,
                    //   {
                    //     encoding: "utf8",
                    //   }
                    // );
                    // remove till above
                    if (rawData === undefined) {
                      _mysql.releaseConnection();
                      res.status(500).json({
                        success: false,
                        message: "There is no data for the above filter.",
                      });
                      return;
                    }
                    const showHeader =
                      _inputParam.excelHeader !== undefined
                        ? _inputParam.excelHeader
                        : true;
                    var workbook = new Excel.Workbook();
                    workbook.creator = "Algaeh technologies private limited";
                    workbook.lastModifiedBy = _inputParam.reportName;
                    workbook.created = new Date();
                    workbook.modified = new Date();

                    var worksheet = workbook.addWorksheet(
                      _inputParam.excelTabName ?? "Report",
                      {
                        properties: { tabColor: { argb: "FFC0000" } },
                      }
                    );
                    const logoPath = path.join(
                      mainPath,
                      "images",
                      "clientLogo.png"
                    );
                    let companyLogo = workbook.addImage({
                      filename: logoPath,
                      extension: "png",
                    });

                    var $ = cheerio.load(rawData);
                    function columnToLetter(column) {
                      var temp,
                        letter = "";
                      while (column > 0) {
                        temp = (column - 1) % 26;
                        letter = String.fromCharCode(temp + 65) + letter;
                        column = (column - temp - 1) / 26;
                      }
                      return letter;
                    }
                    if (showHeader) {
                      for (let i = 1; i <= 6; i++) {
                        worksheet.addRow([]);
                      }
                    }
                    var tables = $("table").length;

                    if (tables > 0) {
                      $("table").each(function (tableIdx, table) {
                        var rows = [];
                        // let mergedRecords = [];
                        var columns = [];
                        $(this)
                          .find("th")
                          .map(function (theadIdx, thead) {
                            let text = $(this).text().replace(/\n/g, "").trim();
                            let widthAttr = $(this).attr("excelwidth");

                            rows.push(text);
                            columns.push({
                              header: "",
                              key: theadIdx + 1,
                              width:
                                widthAttr === undefined
                                  ? text.length < 8
                                    ? 12
                                    : 30
                                  : parseInt(widthAttr),
                            });
                          });

                        worksheet.columns = columns;
                        worksheet.addRow(rows);
                        var lastRow = worksheet.rowCount;
                        let headerRow = worksheet.getRow(lastRow);

                        headerRow.fill = {
                          type: "pattern",
                          pattern: "solid",
                          fgColor: {
                            argb: "48A897",
                          },
                        };
                        headerRow.font = {
                          name: "calibri",
                          family: 4,
                          size: 12,
                          bold: true,
                          color: { argb: "FFFFFF" },
                        };
                        headerRow.alignment = {
                          vertical: "middle",
                          horizontal: "center",
                        };
                        $(this)
                          .find("tbody")
                          .find("tr")
                          .map(function (trIdx, tr) {
                            var rowID = worksheet.rowCount + 1;
                            const itemRow = worksheet.getRow(rowID);
                            let skipOnMerdge = null;
                            $(this)
                              .find("td")
                              .map(function (cellIndex, td) {
                                const celllIdx = cellIndex + 1;
                                const cell = itemRow.getCell(
                                  skipOnMerdge === null
                                    ? celllIdx
                                    : skipOnMerdge
                                );

                                // if (skipOnMerdge) {
                                //   skipOnMerdge = skipOnMerdge + 1;
                                // }
                                if ($(this).attr("excelfonts") !== undefined) {
                                  cell.font = JSON.parse(
                                    $(this).attr("excelfonts")
                                  );
                                }
                                if ($(this).attr("excelfill") !== undefined) {
                                  cell.fill = JSON.parse(
                                    $(this).attr("excelfill")
                                  );
                                }
                                if ($(this).attr("colspan") !== undefined) {
                                  if (
                                    $(this).attr("excelcellmerge") !== undefined
                                  ) {
                                    const _mergeCells = $(this)
                                      .attr("excelcellmerge")
                                      .split(":");
                                    const merge = `${_mergeCells[0]}${rowID}:${_mergeCells[1]}${rowID}`;
                                    const den = `${_mergeCells[0]}${rowID}`;
                                    worksheet.getCell(den).value = $(this)
                                      .text()
                                      .replace(/\n/g, " ")
                                      .replace(/  +/g, " ")
                                      .replace(/&amp;/gi, "&");
                                    worksheet.mergeCells(merge);
                                  } else {
                                    cell.value = $(this)
                                      .text()
                                      .replace(/\n/g, " ")
                                      .replace(/  +/g, " ")
                                      .replace(/&amp;/gi, "&");
                                    if (!isNaN(cell.value)) {
                                      cell.alignment = {
                                        vertical: "middle",
                                        horizontal: "right",
                                      };
                                    }
                                    const onlyAlphabets = cell.address.replace(
                                      /\d+/g,
                                      ""
                                    );
                                    const prefixes = onlyAlphabets.substring(
                                      0,
                                      onlyAlphabets.length - 1
                                    );
                                    const lastcharacter =
                                      onlyAlphabets.charCodeAt(
                                        onlyAlphabets.length - 1
                                      );

                                    const numberOfCols =
                                      parseInt($(this).attr("colspan")) - 1;
                                    let added = lastcharacter + numberOfCols;
                                    let character = String.fromCharCode(added);

                                    if (added > 90) {
                                      const remaining = added - 90;
                                      for (
                                        let cI = 65;
                                        cI < 65 + remaining;
                                        cI++
                                      ) {
                                        character += `A${String.fromCharCode(
                                          cI
                                        )}`;
                                      }
                                    }

                                    skipOnMerdge =
                                      // celllIdx +
                                      (skipOnMerdge ? skipOnMerdge : 0) +
                                      parseInt($(this).attr("colspan")) +
                                      (cellIndex === 0 ? 1 : 0);

                                    const merge = `${cell.address}:${prefixes}${character}${rowID}`;
                                    try {
                                      worksheet.mergeCells(merge);
                                    } catch {
                                      console.log("Already Merge", merge);
                                    }

                                    itemRow.font = {
                                      bold: true,
                                    };
                                    itemRow.fill = {
                                      type: "pattern",
                                      pattern: "solid",
                                      bgColor: { argb: "000000" },
                                      fgColor: { argb: "D1FCFF" },
                                    };
                                  }
                                  // console.log("value 1 :", cell.value);
                                  if (!isNaN(parseFloat(cell.value))) {
                                    cell.value = parseFloat(
                                      String(cell.value).replace(/,/g, "")
                                    );
                                    cell.numFmt = excel_cel_numFmt;
                                  }
                                } else {
                                  cell.value = $(this)
                                    .text()
                                    .replace(/\n/g, " ")
                                    .replace(/  +/g, " ")
                                    .replace(/&amp;/gi, "&");

                                  if (!isNaN(cell.value)) {
                                    cell.alignment = {
                                      vertical: "top",
                                      horizontal: "right",
                                    };
                                  }

                                  // if (skipOnMerdge) {
                                  skipOnMerdge =
                                    skipOnMerdge === null
                                      ? 2
                                      : skipOnMerdge + 1;
                                  // }

                                  // console.log(
                                  //   "value 2 :",
                                  //   parseFloat(cell.value)
                                  // );

                                  // console.log("cell", cell);
                                  const datatype = $(this).attr("datatype");

                                  // console.log("datatype", datatype);
                                  if (datatype === "string") {
                                  } else {
                                    if (!isNaN(parseFloat(cell.value))) {
                                      cell.value = parseFloat(
                                        String(cell.value).replace(/,/g, "")
                                      );
                                      cell.numFmt = excel_cel_numFmt;
                                      cell.alignment = {
                                        vertical: "middle",
                                        horizontal: "right",
                                      };
                                    }
                                  }
                                }

                                if (
                                  $(this).attr("excelalignment") !== undefined
                                ) {
                                  cell.alignment = JSON.parse(
                                    $(this).attr("excelalignment")
                                  );
                                }
                                if ($(this).attr("excelborder") !== undefined) {
                                  cell.border = JSON.parse(
                                    $(this).attr("excelborder")
                                  );
                                }
                              });
                          });
                      });
                      const allColumns = worksheet.columns.length;

                      if (showHeader) {
                        const merge = `A1:${columnToLetter(allColumns)}5`;
                        worksheet.mergeCells(merge);
                        worksheet.addImage(companyLogo, "F1:I5");

                        let filter = "";

                        if (_inputParam.reportParams !== undefined) {
                          for (
                            let f = 0;
                            f < _inputParam.reportParams.length;
                            f++
                          ) {
                            const item = _inputParam.reportParams[f];
                            // console.log("item.label ", item.label);
                            if (item.label !== undefined)
                              filter += `${item.label}:${item.labelValue} || `;
                          }
                        }
                        worksheet.getRow(6).getCell(1).value = filter;
                        worksheet.mergeCells(
                          `A6:${columnToLetter(allColumns)}6`
                        );
                        worksheet.getRow(6).font = { bold: true };
                        worksheet.getRow(6).alignment = {
                          vertical: "middle",
                          horizontal: "center",
                        };
                      }
                    }

                    _mysql.releaseConnection();
                    res.setHeader(
                      "Content-Type",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    res.setHeader(
                      "Content-Disposition",
                      "attachment; filename=" + "Report.xlsx"
                    );
                    workbook.xlsx.write(res).then(function (data) {
                      res.end();
                      console.log("File write done........");
                    });
                  } catch (e) {
                    _mysql.releaseConnection();
                    console.error(e);
                    res.status(500).json({
                      success: false,
                      message: e.toString(),
                    });
                  }
                })();
              });
            })
            .catch((error) => {
              next(error);
            });
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },
  getRawReport: async (req, res) => {
    const input = req.query;

    const _mysql = new algaehMysql();
    try {
      const _inputParam = JSON.parse(input.report);
      _mysql
        .executeQuery({
          query:
            "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
            select H.*,O.* from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
          printQuery: true,
        })
        .then((data) => {
          _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
          _inputParam["crypto"] = req.userIdentity;
          const _reportCount = data[0].length;
          if (_reportCount > 0) {
            let _reportOutput = [];
            for (let r = 0; r < _reportCount; r++) {
              const _data = data[0][r];

              const _inputOrders = eval(
                _data.report_input_series === null
                  ? []
                  : _data.report_input_series
              );

              let _value = [];
              for (var i = 0; i < _inputOrders.length; i++) {
                const _params = _.find(
                  _inputParam.reportParams,
                  (f) => f.name == _inputOrders[i]
                );

                if (_params != undefined) {
                  _value.push(_params.value);
                } else {
                  _value.push(null);
                }
              }

              let queryObject = {
                query: _data.report_query,
                values: _value,
                printQuery: true,
              };
              if (_data.report_query == null || _data.report_query == "") {
                queryObject = {
                  query: "select 1",
                  printQuery: true,
                };
              }
              _mysql
                .executeQuery(queryObject)
                .then((result) => {
                  if (result.length == 0) {
                    _mysql.releaseConnection();
                    res.status(400).send("No records");
                    // res.writeHead(404, {
                    //   "content-type": "text/plain"
                    // });
                    // res.write("No record");
                    return;
                  }
                  let shortUrl = "";
                  const _supportingJS = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates",
                    `${_data.report_name}.js`
                  );
                  const _header = req.headers;

                  const startGenerate = async () => {
                    _mysql.releaseConnection();

                    const _pdfTemplating = {};
                    if (
                      _data.report_header_file_name != null &&
                      _data.report_header_file_name != ""
                    ) {
                      // const _headerTemp = await compile(
                      //   _data.report_header_file_name,
                      //   {
                      //     reqHeader: _header,
                      //     ...data[1][0],
                      //     identity: req.userIdentity,
                      //     user_name:
                      //       req.userIdentity["user_display_name"]["username"],
                      //     report_name_for_header: _data.report_name_for_header,
                      //   }
                      // );
                      // _pdfTemplating["headerTemplate"] = _headerTemp;
                      // _pdfTemplating["margin"] = {
                      //   top: "150px",
                      // };
                    }
                    if (
                      _data.report_footer_file_name != null &&
                      _data.report_footer_file_name != ""
                    ) {
                      // _pdfTemplating["footerTemplate"] = await compile(
                      //   _data.report_footer_file_name,
                      //   {
                      //     reqHeader: _header,
                      //     ...data[1][0],
                      //     report_name_for_header: _data.report_name_for_header,
                      //   }
                      // );
                      // _pdfTemplating["margin"] = {
                      //   ..._pdfTemplating["margin"],
                      //   bottom: "70px",
                      // };
                    } else {
                      //   _pdfTemplating[
                      //     "footerTemplate"
                      //   ] = `<style> .pdffooter { font-size: 8px;
                      // font-family: Arial, Helvetica, sans-serif; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }
                      // .showreportname{float:left;padding-left:5px;font-size: 08px;}
                      // .showcompay{float:right;padding-right:5px;font-size: 08px;}
                      // </style>
                      // <div class="pdffooter">
                      // <span class="showreportname">System Generated Report - ${_data.report_name_for_header}</span>
                      // <span>Page </span>
                      // <span class="pageNumber"></span> / <span class="totalPages"></span>
                      // <span class="showcompay">Powered by Algaeh Techonologies.</span>
                      // </div>`;
                      // _pdfTemplating["margin"] = {
                      //   ..._pdfTemplating["margin"],
                      //   bottom: "50px",
                      // };
                    }

                    const reportRaw = await compile(_data.report_name, {
                      ...result,
                      reqHeader: _header,
                    });
                    _mysql.releaseConnection();
                    if (reportRaw != "") {
                      res.status(200).send(
                        reportRaw //+ "~@" + JSON.stringify(_pdfTemplating)
                      );
                      // res.writeHead(200, {
                      //   "content-type": "text/html"
                      // });
                      // res.write(
                      //   reportRaw + "~@" + JSON.stringify(_pdfTemplating)
                      // );
                    } else {
                      res.status(400).send("No record");
                      // res.writeHead(400, {
                      //   "content-type": "text/plain"
                      // });
                      // res.write("No record");
                      return;
                    }
                  };

                  if (fs.existsSync(_supportingJS)) {
                    const { executePDF } =
                      __non_webpack_require__(_supportingJS);

                    executePDF({
                      mysql: _mysql,
                      inputs: _inputOrders,
                      args: _inputParam,
                      loadash: _,
                      xtype: xtype,
                      moment: moment,
                      mainData: data[1],
                      result: result,
                      writtenForm: writtenForm,
                      convertMilimetersToPixel: convertMilimetersToPixel,
                      utilitites: () => {
                        return new utilitites();
                      },
                      currencyFormat: (currency, formater, addSymbol) => {
                        return new utilitites().getCurrencyFormart(
                          currency,
                          formater,
                          addSymbol
                        );
                      },
                      shortenURL: `${
                        process.env.QR_CODE_CLIENT ?? "http://localhost:3024/"
                      }${shortUrl}`,
                      encodeHexaDecimal,
                      decodeHexaDecimal,
                      hexToBase64String,
                    })
                      .then((resultReq) => {
                        result = resultReq;
                        // console.log(
                        //   "Here inside Result Request====>",
                        //   result.totalRecords
                        // );
                        startGenerate();
                      })
                      .catch((error) => {});
                  } else {
                    if (
                      _data.data_manupulation != null &&
                      _data.data_manupulation != ""
                    ) {
                      const data_string = "`" + _data.data_manupulation + "`";
                      const _resu = eval(data_string);
                      result = JSON.parse(_resu);
                    }
                    startGenerate();
                  }
                })
                .catch((error) => {
                  _mysql.releaseConnection();
                  // res.writeHead(400, { "Content-Type": "text/plain" });
                  // res.write(error);
                  res.status(400).send(JSON.stringify(error));
                });
            }
          } else {
            _mysql.releaseConnection();
            // res.writeHead(400, { "Content-Type": "text/plain" });
            // res.write(new Error("No such report exists"));
            res.status(400).send("No such report exists");
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          res.status(400).send(JSON.stringify(error));
          //   res.status(400).send(JSON.stringify(error));
          // res.writeHead(400, { "Content-Type": "text/plain" });
          // res.write(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      res.status(400).send(JSON.stringify(e));
      // res.writeHead(400, { "Content-Type": "text/plain" });
      // res.write(e);
    }
  },
  printReportRaw: (req, res) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk.toString();
    });
    req.on("end", () => {
      (async () => {
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        const _pdfTemplating = {};
        _pdfTemplating["headerTemplate"] = "";
        _pdfTemplating["margin"] = {
          top: "150px",
        };
        _pdfTemplating["footerTemplate"] = "";
        _pdfTemplating["margin"] = {
          bottom: "50px",
        };
        const template = hbs.compile(buffer);
        await page.setContent(template({}));
        await page.emulateMedia("screen");
        const _path = path.join(
          process.cwd(),
          "algaeh_report_tool/templates/Output",
          "newReports" + moment().format("YYYYMMDDHHmmss")
        );
        const _outPath = _path + ".pdf";
        const _inputParam = {};
        const pageOrentation =
          _inputParam.pageOrentation == null
            ? {}
            : _inputParam.pageOrentation == "landscape"
            ? { landscape: true }
            : { landscape: true };
        const pageSize =
          _inputParam.pageSize == null
            ? { format: "A3" }
            : { format: _inputParam.pageSize };
        await page.evaluate(() => {
          const div = document.createElement("div");
          div.className = "watermark";
          document.body.appendChild(div);
        });
        const result = await page.pdf({
          // path: _outPath,
          ...pageSize,
          landscape: true,
          printBackground: true,
          displayHeaderFooter: true,
          ..._pdfTemplating,
          // headerTemplate:
          //   "<h1>H1 tag</h1><h2>H2 tag</h2><hr style='border-bottom: 2px solid #8c8b8b;' />"
        });
        await browser.close();
        res.contentType("application/pdf");
        res.status(200).send(result);
        // fs.exists(_outPath, exists => {
        //   if (exists) {
        //     res.writeHead(200, {
        //       "content-type": "application/pdf",
        //       "content-disposition": "attachment;filename=newReport.pdf"
        //     });
        //     const _fs = fs.createReadStream(_outPath);
        //     _fs.on("end", () => {
        //       // fs.unlink(_outPath);
        //     });
        //     _fs.pipe(res);
        //   } else {
        //     res.status(400).send({ error: "ERROR File does not exist" });
        //   }
        // });
      })();
    });
  },
};

export async function updateRequestedDownload(primaryId, location) {
  const _mysql = new algaehMysql();
  try {
    const newPath = path.join(
      process.cwd(),
      "algaeh_report_tool",
      "requestDownloads"
    );
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }
    const fileName = path.basename(location);
    const newFilePath = path.join(newPath, fileName);
    fs.moveSync(location, newFilePath);
    await _mysql
      .executeQuery({
        query: `update hims_f_request_download set download_location=?,is_notify=0,can_download=1,record_status='A',update_at=?
         where hims_f_request_download_id=?;`,
        values: [newFilePath, new Date(), primaryId],
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
  } catch (error) {
    _mysql.releaseConnection();
    console.error(
      "Error occur inside Request update @ ",
      new Date().toLocaleString(),
      "===>",
      error.stack
    );
  }
}
export async function getRecordsDownload(req, res) {
  const _mysql = new algaehMysql();
  try {
    const { algaeh_d_app_user_id } = req.userIdentity;
    const result = await _mysql
      .executeQuery({
        query: `select hims_f_request_download_id,report_title,number_of_download,last_downloaded,
      can_download from hims_f_request_download where user_id=?`,
        values: [algaeh_d_app_user_id],
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
    res
      .status(200)
      .json({
        success: true,
        result,
      })
      .end();
  } catch (error) {
    _mysql.releaseConnection();
    res.status(400).json({ success: false, error: error.message }).end();
  }
}
export async function downloadReport(req, res) {
  const _mysql = new algaehMysql();
  try {
    const { hims_f_request_download_id } = req.query;
    console.log("hims_f_request_download_id====>", hims_f_request_download_id);
    const result = await _mysql
      .executeQuery({
        query: `select download_location from hims_f_request_download where hims_f_request_download_id=?`,
        values: [hims_f_request_download_id],
        printQuery: true,
      })
      .catch((error) => {
        throw error;
      });
    const { download_location } = _.head(result);
    console.log("download_location====>", download_location);
    if (download_location) {
      if (fs.existsSync(download_location)) {
        const fName = path.basename(download_location);

        res.writeHead(200, {
          "content-type": "application/pdf",
          "content-disposition": "attachment;filename=" + fName,
        });
        const _fs = fs.createReadStream(download_location);
        _fs.on("end", async () => {
          await _mysql
            .executeQuery({
              query: `update hims_f_request_download set number_of_download = number_of_download+1,
          last_downloaded=?
           where hims_f_request_download_id=? `,
              values: [new Date(), hims_f_request_download_id],
            })
            .catch((error) => {
              throw error;
            });
          _mysql.releaseConnection();
        });
        _fs.pipe(res);
      }
    }
  } catch (error) {
    _mysql.releaseConnection();
    res.writeHead(400, {
      "content-type": "application/json",
    });
    res.status(400).json({ success: false, error: error.message }).end();
  }
}
