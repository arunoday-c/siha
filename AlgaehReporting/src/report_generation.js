import fs from "fs-extra";
import puppeteer from "puppeteer";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import path from "path";
import moment from "moment";
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

hbs.registerHelper("algaehCustom", function(callBack) {
  const fun = eval(callBack);
  return fun({ moment, _ });
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
            "SELECT report_query,report_input_series,data_manupulation from algaeh_d_reports where status='A' and report_name=?",
          values: [_inputParam.reportName]
        })
        .then(data => {
          if (data.length > 0) {
            const _data = data[0];
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
                  _inputParam.reportName + moment().format("YYYYMMDDHHmmss")
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

                      await page.setContent(
                        await compile(_inputParam.reportName, result)
                      );
                      await page.emulateMedia("screen");
                      await page.pdf({
                        path: _outPath,
                        format: "A4",
                        printBackground: true
                      });
                      await browser.close();
                      fs.exists(_outPath, exists => {
                        if (exists) {
                          res.writeHead(200, {
                            "content-type": "application/pdf",
                            "content-disposition":
                              "attachment;filename=" +
                              _inputParam.reportName +
                              moment().format("YYYYMMDDHHmmss") +
                              ".pdf"
                          });
                          const _fs = fs.createReadStream(_outPath);
                          _fs.on("end", () => {
                            fs.unlink(_outPath);
                          });
                          _fs.pipe(res);
                        } else {
                          res.writeHead(400, { "Content-Type": "text/plain" });
                          res.end("ERROR File does not exist");
                        }
                      });
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
                          res.writeHead(400, { "Content-Type": "text/plain" });
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
