import fs from "fs-extra";
import puppeteer from "puppeteer";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import path from "path";
import moment from "moment";
import merge from "easy-pdf-merge";
import hbs from "handlebars";

const compile = async function(templateName, data) {
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
  if (value != null || value != "") {
    if (type == "date") {
      return new Date(value).toLocaleDateString();
    } else {
      return new Date(value).toLocaleTimeString();
    }
  } else {
    return value;
  }
});

hbs.registerHelper("path", function(styleSheetName) {
  const fullPath = path.join(
    process.cwd(),
    "algaeh_report_tool/templates/css",
    `${styleSheetName}.css`
  );

  console.log("_ret", fullPath);
  return require(fullPath);
});

hbs.registerHelper("groupBy", function(data, groupby, callBack) {
  data = Array.isArray(data) ? data : [];
  const groupBy = _.chain(data)
    .groupBy(groupby)
    .map(function(detail, key) {
      return {
        [groupby]: key,
        detail: detail
      };
    })
    .value();
  if (typeof callBack == "function") callBack(groupBy);
  else {
    return groupBy;
  }
});
hbs.registerHelper("currentDateTime", function(type) {
  if (type == null || type == "") {
    return new Date().toLocaleString();
  } else if (type == "time") {
    return new Date().toLocaleTimeString();
  } else {
    return new Date().toLocaleDateString();
  }
});
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
where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=? ;",
          values: [_inputParam.reportName, req.userIdentity["x-branch"]]
        })
        .then(data => {
          const _reportCount = data[0].length;
          if (_reportCount > 0) {
            let _reportOutput = [];
            for (let r = 0; r < _reportCount; r++) {
              const _data = data[0][r];
              const _supportingJS = path.join(
                process.cwd(),
                "algaeh_report_tool/templates",
                `${_data.report_name}.js`
              );
              if (fs.existsSync(_supportingJS)) {
                require(_supportingJS);
              }

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

              _mysql
                .executeQuery({
                  query: _data.report_query,
                  values: _value,
                  printQuery: true
                })
                .then(result => {
                  _mysql.releaseConnection();
                  const _path = path.join(
                    process.cwd(),
                    "algaeh_report_tool/templates/Output",
                    _data.report_name + moment().format("YYYYMMDDHHmmss")
                  );
                  const _reportType =
                    _inputParam.outputFileType == null
                      ? "PDF"
                      : _inputParam.outputFileType;

                  if (
                    _data.data_manupulation != null &&
                    _data.data_manupulation != ""
                  ) {
                    const data_string = "`" + _data.data_manupulation + "`";
                    const _resu = eval(data_string);
                    result = JSON.parse(_resu);
                  }

                  switch (_reportType) {
                    case "PDF":
                      const startGenerate = async () => {
                        const _outPath = _path + ".pdf";
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                        const _pdfTemplating = {};
                        if (
                          _data.report_header_file_name != null &&
                          _data.report_header_file_name != ""
                        ) {
                          _pdfTemplating["headerTemplate"] = await compile(
                            _data.report_header_file_name,
                            {
                              ...data[1][0],
                              report_name_for_header:
                                _data.report_name_for_header
                            }
                          );
                          _pdfTemplating["margin"] = {
                            top: "100px",
                            bottom: "70px"
                          };
                        }
                        if (
                          _data.report_footer_file_name != null &&
                          _data.report_footer_file_name != ""
                        ) {
                          _pdfTemplating["footerTemplate"] = await compile(
                            _data.report_footer_file_name,
                            {
                              ...data[1][0],
                              report_name_for_header:
                                _data.report_name_for_header
                            }
                          );
                          _pdfTemplating["margin"] = {
                            top: "100px",
                            bottom: "70px"
                          };
                        } else {
                          _pdfTemplating[
                            "footerTemplate"
                          ] = `<style> .pdffooter { font-size: 10px; font-family: 'Raleway'; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }
                          .showreportname{float:left;padding-left:5px;font-size: 08px;}
                          .showcompay{float:right;padding-right:5px;font-size: 08px;}
                          </style>
                          <div class="pdffooter">
                          <span class="showreportname">${
                            _data.report_name_for_header
                          }</span>
                          <span>Page </span>
                          <span class="pageNumber"></span> / <span class="totalPages"></span>
                          <span class="showcompay">powered by algaeh techonologies.</span>
                        </div>`;
                          _pdfTemplating["margin"] = {
                            bottom: "50px"
                          };
                        }

                        await page.setContent(
                          await compile(_data.report_name, result)
                        );
                        await page.emulateMedia("screen");

                        await page.pdf({
                          path: _outPath,
                          format: "A4",
                          printBackground: true,
                          displayHeaderFooter: true,
                          ..._pdfTemplating
                        });
                        await browser.close();
                        _reportOutput.push(_outPath);
                        if (r == _reportCount - 1) {
                          let _outfileName =
                            "merdge_" +
                            moment().format("YYYYMMDDHHmmss") +
                            ".pdf";
                          let _rOut = path.join(
                            process.cwd(),
                            "algaeh_report_tool/templates/Output",
                            _outfileName
                          );

                          if (_reportOutput.length > 1) {
                            merge(_reportOutput, _rOut, error => {
                              if (error) {
                                res.writeHead(400, {
                                  "Content-Type": "text/plain"
                                });
                                res.end(JSON.stringify(error));
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
                                    res.writeHead(400, {
                                      "Content-Type": "text/plain"
                                    });
                                    res.end("ERROR File does not exist");
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
                                const _fs = fs.createReadStream(
                                  _reportOutput[0]
                                );
                                _fs.on("end", () => {
                                  fs.unlink(_reportOutput[0]);
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
                        }
                      };
                      startGenerate();
                      break;
                    case "EXCEL":
                      const conversionFactory = require("html-to-xlsx");
                      const chromeEval = require("chrome-page-eval")({
                        puppeteer
                      });
                      const _outPath = _path + ".xlsx";
                      const conversion = conversionFactory({
                        extract: chromeEval
                      })(async () => {
                        const stream = await conversion(
                          await compile(_inputParam.reportName, result)
                        );
                        stream.pipe(fs.createWriteStream(_outPath));
                        fs.exists(_outPath, exists => {
                          if (exists) {
                            res.writeHead(200, {
                              "content-type":
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                              "content-disposition":
                                "attachment;filename=" +
                                _inputParam.reportName +
                                moment().format("YYYYMMDDHHmmss") +
                                ".xlsx"
                            });
                            const _fs = fs.createReadStream(_outPath);
                            _fs.on("end", () => {
                              fs.unlink(_outPath);
                            });
                            _fs.pipe(res);
                          } else {
                            res.writeHead(400, {
                              "Content-Type": "text/plain"
                            });
                            res.end("ERROR File does not exist");
                          }
                        });
                      });
                      break;
                  }
                })
                .catch(error => {
                  _mysql.releaseConnection();
                  res.writeHead(400, { "Content-Type": "text/plain" });
                  res.end(error);
                });
            }
          } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end(new Error("No such report exists"));
          }
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
  }
};
