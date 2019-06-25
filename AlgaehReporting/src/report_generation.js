import fs from "fs-extra";
import puppeteer from "puppeteer";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import path from "path";
import moment from "moment";
import merge from "easy-pdf-merge";
import hbs from "handlebars";
import "babel-polyfill";
import chrome from "algaeh-keys";
const chromePath =
  chrome.default.chromePuppeteer != null ? chrome.default.chromePuppeteer : {};

const XlsxTemplate = require("xlsx-template");

let outputFolder = path.join(
  path.join(process.cwd(), "algaeh_report_tool/templates", "Output")
);
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const compile = async function(templateName, data) {
  try {
    const filePath = path.join(
      process.cwd(),
      "algaeh_report_tool/templates",
      `${templateName}.hbs`
    );
    const html = await fs.readFile(filePath, "utf-8");
    const comp = await hbs.compile(html)(data);
    //
    return comp;
  } catch (error) {
    console.log("Error in compile", compile);
    return "";
  }

  // return "رقم الفاتورة";
};

const compileExcel = async function(templateName, data) {
  const filePath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${templateName}.hbs`
  );
  const html = await fs.readFile(filePath, "utf-8");
  return hbs.compile(html)(data);
};

hbs.registerHelper("sumOf", function(data, sumby, callBack) {
  data = Array.isArray(data) ? data : [];
  const sumof = _.sumBy(data, function(s) {
    return s[sumby];
  });
  if (typeof callBack == "function") callBack(sumof);
  else {
    return sumof;
  }
});
hbs.registerHelper("countOf", function(data) {
  data = Array.isArray(data) ? data : [];
  return data.length;
});
hbs.registerHelper("if", function(value1, value2, options) {
  if (value1 == value2) return options.fn(this);
  else return options.inverse(this);
});

hbs.registerHelper("dateTime", function(value, type) {
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

hbs.registerHelper("capitalization", function(value) {
  return _.startCase(_.toLower(value));
});
//created by irfan
hbs.registerHelper("inc", function(value, options) {
  return parseInt(value) + 1;
});

//created by irfan:to check array has elements
hbs.registerHelper("hasElement", function(conditional, options) {
  if (conditional.length > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
//created by irfan:
hbs.registerHelper("dynamicSalary", function(searchKey, inputArray, comp_type) {
  if (comp_type == "E") {
    const obj = inputArray.find(item => {
      return item.earnings_id == searchKey;
    });
    return obj ? obj.amount : "0";
  } else if (comp_type == "D") {
    const obj = inputArray.find(item => {
      return item.deductions_id == searchKey;
    });
    return obj ? obj.amount : "0";
  } else if (comp_type == "C") {
    const obj = inputArray.find(item => {
      return item.contributions_id == searchKey;
    });
    return obj ? obj.amount : "0";
  }
});

hbs.registerHelper("importStyle", function(styleSheetName) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${styleSheetName}`
  );
  const style = fs.readFileSync(fullPath, "utf-8");
  return "<style type='text/css'>" + style + "</style>";
});

hbs.registerHelper("loadPage", function(filePath, data) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${filePath}`
  );
  const html = fs.readFileSync(fullPath, "utf-8");
  return hbs.compile(html)(data);
});

hbs.registerHelper("imageSource", function(filePath) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates",
    `${filePath}`
  );
  const _extention = path.extname(fullPath).replace(".", "");
  const img = fs.readFileSync(fullPath, "base64");
  return "data:image/" + _extention + ";base64," + img;
});

hbs.registerHelper("groupBy", function(data, groupby) {
  const groupBy = _.chain(data)
    .groupBy(groupby)
    .map(function(detail, key) {
      return {
        [groupby]: key,
        groupDetail: detail
      };
    })
    .value();

  return groupBy;
});
hbs.registerHelper("currentDateTime", function(type) {
  if (type == null || type == "") {
    return moment().format("DD-MM-YYYY");
  } else if (type == "time") {
    return moment().format("hh:mm A");
  } else {
    return moment().format("DD-MM-YYYY");
  }
});
hbs.registerHelper("firstElement", function(array, index, fieldName) {
  array = array || [];
  index = index || 0;
  if (array.length > 0) {
    return array[index][fieldName];
  } else {
    return null;
  }
});
hbs.registerHelper("consoleLog", function(data) {
  if (typeof data == "string") {
    return data;
  } else {
    return JSON.stringify(data);
  }
});

hbs.registerHelper("imageUrl", function(
  filename,
  index,
  name,
  stringToappend,
  filetype,
  reqHeader
) {
  const host = reqHeader["host"].split(":")[0];

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
      "http://" +
      host +
      ":3006/api/v1/Document/get?destinationName=" +
      filename +
      "&fileType=" +
      filetype
    );
  }
});

const groupBy = (data, groupby) => {
  const groupBy = _.chain(data)
    .groupBy(groupby)
    .map(function(detail, key) {
      return {
        [groupby]: key,
        groupDetail: detail
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

module.exports = {
  getReport: async (req, res) => {
    const input = req.query;
    const _mysql = new algaehMysql();
    try {
      const _inputParam = JSON.parse(input.report);
      _mysql
        .executeQuery({
          query:
            "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
            select H.hospital_name,H.hospital_address,H.arabic_hospital_name, \
            O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,\
            O.email,O.phone1 from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
          printQuery: true
        })
        .then(data => {
          _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
          _inputParam["crypto"] = req.userIdentity;

          console.log("input:", _inputParam);
          const _reportCount = data[0].length;
          if (_reportCount > 0) {
            let _reportOutput = [];
            for (let r = 0; r < _reportCount; r++) {
              const _data = data[0][r];

              const _inputOrders = eval(_data.report_input_series);

              let _value = [];
              for (var i = 0; i < _inputOrders.length; i++) {
                const _params = _.find(
                  _inputParam.reportParams,
                  f => f.name == _inputOrders[i]
                );
                if (_params != undefined) {
                  _value.push(_params.value);
                }
              }

              let queryObject = {
                query: _data.report_query,
                values: _value,
                printQuery: true
              };
              if (_data.report_query == null || _data.report_query == "") {
                queryObject = {
                  query: "select 1",
                  printQuery: true
                };
              }

              _mysql
                .executeQuery(queryObject)
                .then(result => {
                  //console.log("result", result);
                  const _path = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates/Output",
                    _data.report_name + moment().format("YYYYMMDDHHmmss")
                  );
                  const _reportType = "PDF";
                  const _supportingJS = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates",
                    `${_data.report_name}.js`
                  );
                  const _header = req.headers;

                  const startGenerate = async () => {
                    const _outPath = _path + ".pdf";
                    _reportOutput.push(_outPath);
                    const browser = await puppeteer.launch(chromePath);
                    const page = await browser.newPage();
                    const _pdfTemplating = {};
                    if (
                      _data.report_header_file_name != null &&
                      _data.report_header_file_name != ""
                    ) {
                      const _header = await compile(
                        _data.report_header_file_name,
                        {
                          reqHeader: _header,
                          ...data[1][0],
                          user_name: req.userIdentity["username"],
                          report_name_for_header: _data.report_name_for_header
                        }
                      );
                      _pdfTemplating["headerTemplate"] = _header;
                      _pdfTemplating["margin"] = {
                        top: "150px"
                      };
                    }
                    if (
                      _data.report_footer_file_name != null &&
                      _data.report_footer_file_name != ""
                    ) {
                      _pdfTemplating["footerTemplate"] = await compile(
                        _data.report_footer_file_name,
                        {
                          reqHeader: _header,
                          ...data[1][0],
                          report_name_for_header: _data.report_name_for_header
                        }
                      );
                      _pdfTemplating["margin"] = {
                        ..._pdfTemplating["margin"],
                        bottom: "70px"
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
                      <span class="showreportname">${
                        _data.report_name_for_header
                      }</span>
                      <span>Page </span>
                      <span class="pageNumber"></span> / <span class="totalPages"></span>
                      <span class="showcompay">Powered by Algaeh Techonologies.</span>
                    </div>`;
                      _pdfTemplating["margin"] = {
                        ..._pdfTemplating["margin"],
                        bottom: "50px"
                      };
                    }

                    await page.setContent(
                      await compile(_data.report_name, {
                        ...result,
                        reqHeader: _header
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
                    await page.pdf({
                      path: _outPath,
                      ...pageSize,
                      ...pageOrentation,
                      printBackground: true,
                      displayHeaderFooter: true,
                      ..._pdfTemplating
                      // headerTemplate:
                      //   "<h1>H1 tag</h1><h2>H2 tag</h2><hr style='border-bottom: 2px solid #8c8b8b;' />"
                    });
                    await browser.close();

                    if (r == _reportCount - 1) {
                      let _outfileName =
                        "merdge_" + moment().format("YYYYMMDDHHmmss") + ".pdf";
                      let _rOut = path.join(
                        process.cwd(),
                        "algaeh_report_tool/templates/Output",
                        _outfileName
                      );

                      if (_reportOutput.length > 1) {
                        _mysql.releaseConnection();
                        merge(_reportOutput, _rOut, error => {
                          if (error) {
                            res
                              .status(400)
                              .send({ error: JSON.stringify(error) });
                          } else {
                            fs.exists(_rOut, exists => {
                              if (exists) {
                                res.writeHead(200, {
                                  "content-type": "application/pdf",
                                  "content-disposition":
                                    "attachment;filename=" + _outfileName
                                });
                                const _fs = fs.createReadStream(_rOut);
                                _fs.on("end", () => {
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
                                res
                                  .status(400)
                                  .send({ error: "ERROR File does not exist" });
                              }
                            });
                          }
                        });
                      } else {
                        fs.exists(_reportOutput[0], exists => {
                          if (exists) {
                            res.writeHead(200, {
                              "content-type": "application/pdf",
                              "content-disposition":
                                "attachment;filename=" + _outfileName
                            });
                            const _fs = fs.createReadStream(_reportOutput[0]);
                            _fs.on("end", () => {
                              fs.unlink(_reportOutput[0]);
                            });
                            _fs.pipe(res);
                          } else {
                            res
                              .status(400)
                              .send({ error: "ERROR File does not exist" });
                          }
                        });
                      }
                    }
                  };

                  if (fs.existsSync(_supportingJS)) {
                    const { executePDF } = require(_supportingJS);
                    executePDF({
                      mysql: _mysql,
                      inputs: _inputOrders,
                      args: _inputParam,
                      loadash: _,
                      moment: moment,
                      mainData: data[1],
                      result: result
                    })
                      .then(resultReq => {
                        result = resultReq;
                        startGenerate();
                      })
                      .catch(error => {
                        console.log("Error", error);
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
                    startGenerate();
                  }
                })
                .catch(error => {
                  _mysql.releaseConnection();
                  console.log("Error In query execution : ", error);
                  res.status(400).send({ error: JSON.stringify(error) });
                });
            }
          } else {
            res.status(400).send({ error: "No such report exists" });
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          console.log(
            "Error in report table query execution : ",
            JSON.stringify(error)
          );
          res.status(400).send({ error: JSON.stringify(error) });
        });
    } catch (e) {
      _mysql.releaseConnection();
      console.log("Error in try catch : ", JSON.stringify(error));
      res.status(400).send({ error: JSON.stringify(e) });
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
            select H.hospital_name,H.hospital_address,H.arabic_hospital_name, \
            O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,\
            O.email,O.phone1 from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity["x-branch"]],
          printQuery: true
        })
        .then(data => {
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
                    f => f.report_name == reportSequence[i]
                  );
                  const inputOrders = eval(
                    resourceTemplate.report_input_series
                  );
                  let _value = [];
                  for (var ip = 0; ip < inputOrders.length; ip++) {
                    const _params = _.find(
                      inputData,
                      f => f.name == inputOrders[ip]
                    );
                    if (_params != undefined) {
                      _value.push(_params.value);
                    }
                  }
                  const _myquery = _mysql.mysqlQueryFormat(
                    resourceTemplate.report_query,
                    _value
                  );
                  _mysql
                    .executeQuery({
                      query: _myquery,
                      printQuery: true
                    })
                    .then(result => {
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
                        const browser = await puppeteer.launch(chromePath);
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
                              user_name: req.userIdentity["username"],
                              report_name_for_header:
                                resourceTemplate.report_name_for_header
                            }
                          );
                          _pdfTemplating["headerTemplate"] = _header;
                          _pdfTemplating["margin"] = {
                            top: "140px"
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
                                resourceTemplate.report_name_for_header
                            }
                          );
                          _pdfTemplating["margin"] = {
                            ..._pdfTemplating["margin"],
                            bottom: "70px"
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
                      <span class="showreportname">${
                        resourceTemplate.report_name_for_header
                      }</span>
                      <span>Page </span>
                      <span class="pageNumber"></span> / <span class="totalPages"></span>
                      <span class="showcompay">Powered by Algaeh Technologies.</span>
                    </div>`;
                          _pdfTemplating["margin"] = {
                            ..._pdfTemplating["margin"],
                            bottom: "50px"
                          };
                        }

                        await page.setContent(
                          await compile(resourceTemplate.report_name, {
                            ...result,
                            reqHeader: req.headers
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
                        await page.pdf({
                          path: _outPath,
                          ...pageSize,
                          ...pageOrentation,
                          printBackground: true,
                          displayHeaderFooter: true,
                          ..._pdfTemplating
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
                        const { executePDF } = require(_supportingJS);
                        executePDF({
                          mysql: _mysql,
                          inputs: _inputParam,
                          loadash: _,
                          moment: moment,
                          mainData: data[1],
                          result: result
                        })
                          .then(resultReq => {
                            result = resultReq;
                            startGenerate();
                          })
                          .catch(error => {
                            console.log("Error", error);
                          });
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
                    .catch(error => {
                      console.error(
                        "Error Report Name",
                        resourceTemplate.report_name
                      );
                      console.error("Error Query", _myquery);
                      console.error();
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
            .catch(error => {
              _mysql.releaseConnection();

              res.writeHead(400, { "Content-Type": "text/plain" });
              res.end(error);
            });
        })
        .catch(error => {
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

    merge(getAllReports, _rOut, error => {
      if (error) {
        console.error(error);
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(error));
      } else {
        fs.exists(_rOut, exists => {
          if (exists) {
            res.writeHead(200, {
              "content-type": "application/pdf",
              "content-disposition": "attachment;filename=" + _outfileName
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
              "Content-Type": "text/plain"
            });
            res.end("ERROR File does not exist");
          }
        });
      }
    });
  },
  getExcelReport: async (req, res) => {
    const input = req.query;
    let templatePath = path.join(
      process.cwd(),
      "algaeh_report_tool/templates/Excel"
    );
    const _inputParam = JSON.parse(input.report);
    const { executeExcel } = require(path.join(
      templatePath,
      _inputParam.reportName + ".js"
    ));
    const _mysql = new algaehMysql();
    const _input = { hospital_id: req.userIdentity["x-branch"] };
    for (let i = 0; i < _inputParam.reportParams.length; i++) {
      const _inp = _inputParam.reportParams[i];
      _input[_inp.name] = _inp.value;
    }
    executeExcel({
      mysql: _mysql,
      inputs: _input,
      loadash: _,
      moment: moment
    }).then(result => {
      let excelOutput = path.join(
        outputFolder,
        "out_" + moment().format("YYYYMMDDHHmmss") + ".xlsx"
      );
      const fileNameExcel = _inputParam.reportName + ".xlsx";

      fs.readFile(path.join(templatePath, fileNameExcel), function(
        error,
        data
      ) {
        if (error) {
          console.error(error);
        } else {
          var template = new XlsxTemplate(data);
          if (result.copySheets != null && result.copySheets.length > 0) {
            for (let c = 0; c < result.copySheets.length; c++) {
              const shts = result.copySheets[c];
              template.copySheet(shts.copySheetName, shts.newSheetName);
            }
          }

          for (let s = 0; s < template.sheets.length; s++) {
            template.substitute(
              template.sheets[s]["name"],
              result.data[template.sheets[s]["name"]]
            );
          }

          var dataGenerated = template.generate();
          fs.outputFileSync(excelOutput, dataGenerated, { encoding: "binary" });
          res.writeHead(200, {
            "content-type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "content-disposition": "attachment;filename=" + fileNameExcel
          });
          const _fs = fs.createReadStream(excelOutput);
          _fs.on("end", () => {
            fs.unlink(excelOutput);
          });

          _fs.pipe(res);
        }
      });
    });

    // let excelOutput = path.join(
    //   outputFolder,
    //   "out_" + moment().format("YYYYMMDDHHmmss") + ".xlsx"
    // );
    // let values = {
    //   extractDate: new Date(),
    //   dates: [
    //     new Date("2013-06-01"),
    //     new Date("2013-06-02"),
    //     new Date("2013-06-03")
    //   ],
    //   people: [
    //     { name: "John Smith", age: 20 },
    //     { name: "Bob Johnson", age: 22 }
    //   ]
    // };
    // let values2 = {
    //   extractDate: new Date(),
    //   dates: [
    //     new Date("2014-06-01"),
    //     new Date("2014-06-02"),
    //     new Date("2014-06-03")
    //   ],
    //   people: [
    //     { name: "John1 Smith", age: 21 },
    //     { name: "Bob1 Johnson", age: 23 }
    //   ]
    // };
    // const fileNameExcel = _inputParam.reportName + ".xlsx";
    //
    // fs.readFile(path.join(templatePath, fileNameExcel), function(error, data) {
    //   if (error) {
    //     console.error(error);
    //   } else {
    //     var template = new XlsxTemplate(data);
    //     var sheetNumber = 1;
    //     template.copySheet("Sheet1", "Sheet2");
    //     template.substitute(sheetNumber, values);
    //     template.substitute("Sheet2", values2);
    //     var data = template.generate();
    //     fs.outputFileSync(excelOutput, data, { encoding: "binary" });
    //   }
    // });
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
            select H.hospital_name,H.hospital_address,H.arabic_hospital_name, \
            O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,\
            O.email,O.phone1 from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
          values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
          printQuery: true
        })
        .then(data => {
          _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
          const _reportCount = data[0].length;
          if (_reportCount > 0) {
            let _reportOutput = [];
            for (let r = 0; r < _reportCount; r++) {
              const _data = data[0][r];

              const _inputOrders = eval(_data.report_input_series);

              let _value = [];
              for (var i = 0; i < _inputOrders.length; i++) {
                const _params = _.find(
                  _inputParam.reportParams,
                  f => f.name == _inputOrders[i]
                );
                if (_params != undefined) {
                  _value.push(_params.value);
                }
              }
              let queryObject = {
                query: _data.report_query,
                values: _value,
                printQuery: true
              };
              if (_data.report_query == null || _data.report_query == "") {
                queryObject = {
                  query: "select 1",
                  printQuery: true
                };
              }
              _mysql
                .executeQuery(queryObject)
                .then(result => {
                  if (result.legth == 0) {
                    res.writeHead(400, {
                      "content-type": "text/plain"
                    });
                    res.write("No record");
                    return;
                  }

                  const _supportingJS = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates",
                    `${_data.report_name}.js`
                  );
                  const _header = req.headers;

                  const startGenerate = async () => {
                    const _pdfTemplating = {};
                    if (
                      _data.report_header_file_name != null &&
                      _data.report_header_file_name != ""
                    ) {
                      const _header = await compile(
                        _data.report_header_file_name,
                        {
                          reqHeader: _header,
                          ...data[1][0],
                          user_name: req.userIdentity["username"],
                          report_name_for_header: _data.report_name_for_header
                        }
                      );
                      _pdfTemplating["headerTemplate"] = _header;
                      _pdfTemplating["margin"] = {
                        top: "150px"
                      };
                    }
                    if (
                      _data.report_footer_file_name != null &&
                      _data.report_footer_file_name != ""
                    ) {
                      _pdfTemplating["footerTemplate"] = await compile(
                        _data.report_footer_file_name,
                        {
                          reqHeader: _header,
                          ...data[1][0],
                          report_name_for_header: _data.report_name_for_header
                        }
                      );
                      _pdfTemplating["margin"] = {
                        ..._pdfTemplating["margin"],
                        bottom: "70px"
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
                    <span class="showreportname">${
                      _data.report_name_for_header
                    }</span>
                    <span>Page </span>
                    <span class="pageNumber"></span> / <span class="totalPages"></span>
                    <span class="showcompay">Powered by Algaeh Techonologies.</span>
                    </div>`;
                      _pdfTemplating["margin"] = {
                        ..._pdfTemplating["margin"],
                        bottom: "50px"
                      };
                    }

                    const reportRaw = await compile(_data.report_name, {
                      ...result,
                      reqHeader: _header
                    });
                    if (reportRaw != "") {
                      res.writeHead(200, {
                        "content-type": "text/html"
                      });
                      res.write(
                        reportRaw + "~@" + JSON.stringify(_pdfTemplating)
                      );
                      res.end();
                    } else {
                      res.writeHead(400, {
                        "content-type": "text/plain"
                      });
                      res.write("No record");
                      res.end();
                      return;
                    }
                  };

                  if (fs.existsSync(_supportingJS)) {
                    const { executePDF } = require(_supportingJS);
                    executePDF({
                      mysql: _mysql,
                      inputs: _inputOrders,
                      args: _inputParam,
                      loadash: _,
                      moment: moment,
                      mainData: data[1],
                      result: result
                    })
                      .then(resultReq => {
                        result = resultReq;
                        startGenerate();
                      })
                      .catch(error => {
                        console.log("Error", error);
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
                    startGenerate();
                  }
                })
                .catch(error => {
                  _mysql.releaseConnection();
                  res.writeHead(400, { "Content-Type": "text/plain" });
                  res.write(error);
                  res.end();
                });
            }
          } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.write(new Error("No such report exists"));
            res.end();
          }
        })
        .catch(error => {
          console.log("Error Showing :", error);
          _mysql.releaseConnection();
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.write(error);
          res.end();
        });
    } catch (e) {
      _mysql.releaseConnection();
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write(e);
      res.end();
    }
  }
};
