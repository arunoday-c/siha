"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _puppeteer = require("puppeteer");

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _algaehMysql = require("algaeh-mysql");

var _algaehMysql2 = _interopRequireDefault(_algaehMysql);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path2 = require("path");

var _path3 = _interopRequireDefault(_path2);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _easyPdfMerge = require("easy-pdf-merge");

var _easyPdfMerge2 = _interopRequireDefault(_easyPdfMerge);

var _handlebars = require("handlebars");

var _handlebars2 = _interopRequireDefault(_handlebars);

require("babel-polyfill");

var _algaehKeys = require("algaeh-keys");

var _algaehKeys2 = _interopRequireDefault(_algaehKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chromePath = _algaehKeys2.default.default.chromePuppeteer != null ? _algaehKeys2.default.default.chromePuppeteer : {};

var XlsxTemplate = require("xlsx-template");

var outputFolder = _path3.default.join(_path3.default.join(process.cwd(), "algaeh_report_tool/templates", "Output"));
if (!_fsExtra2.default.existsSync(outputFolder)) {
  _fsExtra2.default.mkdirSync(outputFolder);
}

var compile = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(templateName, data) {
    var filePath, html, comp;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            filePath = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", templateName + ".hbs");
            _context.next = 4;
            return _fsExtra2.default.readFile(filePath, "utf-8");

          case 4:
            html = _context.sent;
            _context.next = 7;
            return _handlebars2.default.compile(html)(data);

          case 7:
            comp = _context.sent;
            return _context.abrupt("return", comp);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);

            console.log("Error in compile", compile);
            return _context.abrupt("return", "");

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function compile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var compileExcel = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(templateName, data) {
    var filePath, html;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filePath = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", templateName + ".hbs");
            _context2.next = 3;
            return _fsExtra2.default.readFile(filePath, "utf-8");

          case 3:
            html = _context2.sent;
            return _context2.abrupt("return", _handlebars2.default.compile(html)(data));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function compileExcel(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

_handlebars2.default.registerHelper("sumOf", function (data, sumby, callBack) {
  data = Array.isArray(data) ? data : [];
  var sumof = _lodash2.default.sumBy(data, function (s) {
    return s[sumby];
  });
  if (typeof callBack == "function") callBack(sumof);else {
    return sumof;
  }
});
_handlebars2.default.registerHelper("countOf", function (data) {
  data = Array.isArray(data) ? data : [];
  return data.length;
});
_handlebars2.default.registerHelper("if", function (value1, value2, options) {
  if (value1 == value2) return options.fn(this);else return options.inverse(this);
});

_handlebars2.default.registerHelper("dateTime", function (value, type) {
  type = type || "date";

  if (value == null) {
    return "";
  }
  if (value != "") {
    var dt = value instanceof Date && !isNaN(value);
    if (!dt) {
      return value;
    }
    if (type == "date") {
      return (0, _moment2.default)(value).format("DD-MM-YYYY");
    } else {
      return (0, _moment2.default)(value).format("hh:mm A");
    }
  } else {
    return value;
  }
});

_handlebars2.default.registerHelper("capitalization", function (value) {
  return _lodash2.default.startCase(_lodash2.default.toLower(value));
});
//created by irfan
_handlebars2.default.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

//created by irfan:to check array has elements
_handlebars2.default.registerHelper("hasElement", function (conditional, options) {
  if (conditional.length > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
//created by irfan:
_handlebars2.default.registerHelper("dynamicSalary", function (searchKey, inputArray, comp_type) {
  if (comp_type == "E") {
    var obj = inputArray.find(function (item) {
      return item.earnings_id == searchKey;
    });
    return obj ? obj.amount : "0";
  } else if (comp_type == "D") {
    var _obj = inputArray.find(function (item) {
      return item.deductions_id == searchKey;
    });
    return _obj ? _obj.amount : "0";
  } else if (comp_type == "C") {
    var _obj2 = inputArray.find(function (item) {
      return item.contributions_id == searchKey;
    });
    return _obj2 ? _obj2.amount : "0";
  }
});

_handlebars2.default.registerHelper("importStyle", function (styleSheetName) {
  var fullPath = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", "" + styleSheetName);
  var style = _fsExtra2.default.readFileSync(fullPath, "utf-8");
  return "<style type='text/css'>" + style + "</style>";
});

_handlebars2.default.registerHelper("loadPage", function (filePath, data) {
  var fullPath = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", "" + filePath);
  var html = _fsExtra2.default.readFileSync(fullPath, "utf-8");
  return _handlebars2.default.compile(html)(data);
});

_handlebars2.default.registerHelper("imageSource", function (filePath) {
  var fullPath = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", "" + filePath);
  var _extention = _path3.default.extname(fullPath).replace(".", "");
  var img = _fsExtra2.default.readFileSync(fullPath, "base64");
  return "data:image/" + _extention + ";base64," + img;
});

_handlebars2.default.registerHelper("groupBy", function (data, groupby) {
  var groupBy = _lodash2.default.chain(data).groupBy(groupby).map(function (detail, key) {
    var _ref3;

    return _ref3 = {}, _defineProperty(_ref3, groupby, key), _defineProperty(_ref3, "groupDetail", detail), _ref3;
  }).value();

  return groupBy;
});
_handlebars2.default.registerHelper("currentDateTime", function (type) {
  if (type == null || type == "") {
    return (0, _moment2.default)().format("DD-MM-YYYY");
  } else if (type == "time") {
    return (0, _moment2.default)().format("hh:mm A");
  } else {
    return (0, _moment2.default)().format("DD-MM-YYYY");
  }
});
_handlebars2.default.registerHelper("firstElement", function (array, index, fieldName) {
  array = array || [];
  index = index || 0;
  if (array.length > 0) {
    return array[index][fieldName];
  } else {
    return null;
  }
});
_handlebars2.default.registerHelper("consoleLog", function (data) {
  if (typeof data == "string") {
    return data;
  } else {
    return JSON.stringify(data);
  }
});

_handlebars2.default.registerHelper("imageUrl", function (filename, index, name, stringToappend, filetype, reqHeader) {
  var host = reqHeader["host"].split(":")[0];

  if (Array.isArray(filename)) {
    if (filename.length > 0) {
      stringToappend = stringToappend || "";
      var imageLocation = "http://" + host + ":3006/api/v1/Document/get?destinationName=" + filename[index][name] + stringToappend + "&fileType=" + filetype;

      return imageLocation;
    } else {
      return "";
    }
  } else {
    return "http://" + host + ":3006/api/v1/Document/get?destinationName=" + filename + "&fileType=" + filetype;
  }
});

var groupBy = function groupBy(data, groupby) {
  var groupBy = _lodash2.default.chain(data).groupBy(groupby).map(function (detail, key) {
    var _ref4;

    return _ref4 = {}, _defineProperty(_ref4, groupby, key), _defineProperty(_ref4, "groupDetail", detail), _ref4;
  }).value();
  return groupBy;
};
var arrayFirstRowToObject = function arrayFirstRowToObject(data, index) {
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
  getReport: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
      var input, _mysql, _inputParam;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              input = req.query;
              _mysql = new _algaehMysql2.default();

              try {
                _inputParam = JSON.parse(input.report);

                _mysql.executeQuery({
                  query: "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
            select H.hospital_name,H.hospital_address,H.arabic_hospital_name, \
            O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,\
            O.email,O.phone1 from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
                  values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
                  printQuery: true
                }).then(function (data) {
                  _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
                  _inputParam["crypto"] = req.userIdentity;

                  console.log("input:", _inputParam);
                  var _reportCount = data[0].length;
                  if (_reportCount > 0) {
                    var i;

                    (function () {
                      var _reportOutput = [];

                      var _loop = function _loop(r) {
                        var _data = data[0][r];

                        var _inputOrders = eval(_data.report_input_series);

                        var _value = [];
                        for (i = 0; i < _inputOrders.length; i++) {
                          var _params = _lodash2.default.find(_inputParam.reportParams, function (f) {
                            return f.name == _inputOrders[i];
                          });
                          if (_params != undefined) {
                            _value.push(_params.value);
                          }
                        }

                        var queryObject = {
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

                        _mysql.executeQuery(queryObject).then(function (result) {
                          //console.log("result", result);
                          var _path = _path3.default.join(process.cwd(), "algaeh_report_tool/templates/Output", _data.report_name + (0, _moment2.default)().format("YYYYMMDDHHmmss"));
                          var _reportType = "PDF";
                          var _supportingJS = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", _data.report_name + ".js");
                          var _header = req.headers;

                          var startGenerate = function () {
                            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                              var _outPath, browser, page, _pdfTemplating, _header2, pageOrentation, pageSize, _outfileName, _rOut;

                              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                  switch (_context3.prev = _context3.next) {
                                    case 0:
                                      _outPath = _path + ".pdf";

                                      _reportOutput.push(_outPath);
                                      _context3.next = 4;
                                      return _puppeteer2.default.launch(chromePath);

                                    case 4:
                                      browser = _context3.sent;
                                      _context3.next = 7;
                                      return browser.newPage();

                                    case 7:
                                      page = _context3.sent;
                                      _pdfTemplating = {};

                                      if (!(_data.report_header_file_name != null && _data.report_header_file_name != "")) {
                                        _context3.next = 15;
                                        break;
                                      }

                                      _context3.next = 12;
                                      return compile(_data.report_header_file_name, _extends({
                                        reqHeader: _header2
                                      }, data[1][0], {
                                        user_name: req.userIdentity["username"],
                                        report_name_for_header: _data.report_name_for_header
                                      }));

                                    case 12:
                                      _header2 = _context3.sent;

                                      _pdfTemplating["headerTemplate"] = _header2;
                                      _pdfTemplating["margin"] = {
                                        top: "150px"
                                      };

                                    case 15:
                                      if (!(_data.report_footer_file_name != null && _data.report_footer_file_name != "")) {
                                        _context3.next = 22;
                                        break;
                                      }

                                      _context3.next = 18;
                                      return compile(_data.report_footer_file_name, _extends({
                                        reqHeader: _header
                                      }, data[1][0], {
                                        report_name_for_header: _data.report_name_for_header
                                      }));

                                    case 18:
                                      _pdfTemplating["footerTemplate"] = _context3.sent;

                                      _pdfTemplating["margin"] = _extends({}, _pdfTemplating["margin"], {
                                        bottom: "70px"
                                      });
                                      _context3.next = 24;
                                      break;

                                    case 22:
                                      _pdfTemplating["footerTemplate"] = "<style> .pdffooter { font-size: 8px;\n                        font-family: Arial, Helvetica, sans-serif; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }\n                      .showreportname{float:left;padding-left:5px;font-size: 08px;}\n                      .showcompay{float:right;padding-right:5px;font-size: 08px;}\n                      </style>\n                      <div class=\"pdffooter\">\n                      <span class=\"showreportname\">" + _data.report_name_for_header + "</span>\n                      <span>Page </span>\n                      <span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span>\n                      <span class=\"showcompay\">Powered by Algaeh Techonologies.</span>\n                    </div>";
                                      _pdfTemplating["margin"] = _extends({}, _pdfTemplating["margin"], {
                                        bottom: "50px"
                                      });

                                    case 24:
                                      _context3.t0 = page;
                                      _context3.next = 27;
                                      return compile(_data.report_name, _extends({}, result, {
                                        reqHeader: _header
                                      }));

                                    case 27:
                                      _context3.t1 = _context3.sent;
                                      _context3.next = 30;
                                      return _context3.t0.setContent.call(_context3.t0, _context3.t1);

                                    case 30:
                                      _context3.next = 32;
                                      return page.emulateMedia("screen");

                                    case 32:
                                      pageOrentation = _inputParam.pageOrentation == null ? {} : _inputParam.pageOrentation == "landscape" ? { landscape: true } : {};
                                      pageSize = _inputParam.pageSize == null ? { format: "A4" } : { format: _inputParam.pageSize };
                                      _context3.next = 36;
                                      return page.pdf(_extends({
                                        path: _outPath
                                      }, pageSize, pageOrentation, {
                                        printBackground: true,
                                        displayHeaderFooter: true
                                      }, _pdfTemplating)
                                      // headerTemplate:
                                      //   "<h1>H1 tag</h1><h2>H2 tag</h2><hr style='border-bottom: 2px solid #8c8b8b;' />"
                                      );

                                    case 36:
                                      _context3.next = 38;
                                      return browser.close();

                                    case 38:

                                      if (r == _reportCount - 1) {
                                        _outfileName = "merdge_" + (0, _moment2.default)().format("YYYYMMDDHHmmss") + ".pdf";
                                        _rOut = _path3.default.join(process.cwd(), "algaeh_report_tool/templates/Output", _outfileName);


                                        if (_reportOutput.length > 1) {
                                          _mysql.releaseConnection();
                                          (0, _easyPdfMerge2.default)(_reportOutput, _rOut, function (error) {
                                            if (error) {
                                              res.status(400).send({ error: JSON.stringify(error) });
                                            } else {
                                              _fsExtra2.default.exists(_rOut, function (exists) {
                                                if (exists) {
                                                  res.writeHead(200, {
                                                    "content-type": "application/pdf",
                                                    "content-disposition": "attachment;filename=" + _outfileName
                                                  });
                                                  var _fs = _fsExtra2.default.createReadStream(_rOut);
                                                  _fs.on("end", function () {
                                                    _fsExtra2.default.unlink(_rOut);
                                                    for (var f = 0; f < _reportOutput.length; f++) {
                                                      _fsExtra2.default.unlink(_reportOutput[f]);
                                                    }
                                                  });
                                                  _fs.pipe(res);
                                                } else {
                                                  res.status(400).send({ error: "ERROR File does not exist" });
                                                }
                                              });
                                            }
                                          });
                                        } else {
                                          _fsExtra2.default.exists(_reportOutput[0], function (exists) {
                                            if (exists) {
                                              res.writeHead(200, {
                                                "content-type": "application/pdf",
                                                "content-disposition": "attachment;filename=" + _outfileName
                                              });
                                              var _fs = _fsExtra2.default.createReadStream(_reportOutput[0]);
                                              _fs.on("end", function () {
                                                _fsExtra2.default.unlink(_reportOutput[0]);
                                              });
                                              _fs.pipe(res);
                                            } else {
                                              res.status(400).send({ error: "ERROR File does not exist" });
                                            }
                                          });
                                        }
                                      }

                                    case 39:
                                    case "end":
                                      return _context3.stop();
                                  }
                                }
                              }, _callee3, undefined);
                            }));

                            return function startGenerate() {
                              return _ref6.apply(this, arguments);
                            };
                          }();

                          if (_fsExtra2.default.existsSync(_supportingJS)) {
                            var _require = require(_supportingJS),
                                executePDF = _require.executePDF;

                            executePDF({
                              mysql: _mysql,
                              inputs: _inputOrders,
                              args: _inputParam,
                              loadash: _lodash2.default,
                              moment: _moment2.default,
                              mainData: data[1],
                              result: result
                            }).then(function (resultReq) {
                              result = resultReq;
                              startGenerate();
                            }).catch(function (error) {
                              console.log("Error", error);
                            });
                          } else {
                            if (_data.data_manupulation != null && _data.data_manupulation != "") {
                              var data_string = "`" + _data.data_manupulation + "`";
                              var _resu = eval(data_string);
                              result = JSON.parse(_resu);
                            }
                            startGenerate();
                          }
                        }).catch(function (error) {
                          _mysql.releaseConnection();
                          console.log("Error In query execution : ", error);
                          res.status(400).send({ error: JSON.stringify(error) });
                        });
                      };

                      for (var r = 0; r < _reportCount; r++) {
                        _loop(r);
                      }
                    })();
                  } else {
                    res.status(400).send({ error: "No such report exists" });
                  }
                }).catch(function (error) {
                  _mysql.releaseConnection();
                  console.log("Error in report table query execution : ", JSON.stringify(error));
                  res.status(400).send({ error: JSON.stringify(error) });
                });
              } catch (e) {
                _mysql.releaseConnection();
                console.log("Error in try catch : ", JSON.stringify(error));
                res.status(400).send({ error: JSON.stringify(e) });
              }

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function getReport(_x5, _x6) {
      return _ref5.apply(this, arguments);
    };
  }(),
  getReportMultiPrint: function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
      var input, _mysql, _inputParam;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              input = req.query;
              _mysql = new _algaehMysql2.default();

              try {
                _inputParam = JSON.parse(input.report);


                _mysql.executeQuery({
                  query: "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
            select H.hospital_name,H.hospital_address,H.arabic_hospital_name, \
            O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,\
            O.email,O.phone1 from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
                  values: [_inputParam.reportName, req.userIdentity["x-branch"]],
                  printQuery: true
                }).then(function (data) {
                  var templates = data[0];
                  var subReportCollection = [];
                  var inputParameters = _inputParam.reportParams;
                  var promises = [];

                  var _loop2 = function _loop2(p) {
                    var inputData = inputParameters[p];
                    var reportSequence = _inputParam.reportName;

                    var _loop3 = function _loop3(i) {
                      promises.push(new Promise(function (resolve, reject) {
                        var resourceTemplate = _lodash2.default.find(templates, function (f) {
                          return f.report_name == reportSequence[i];
                        });
                        var inputOrders = eval(resourceTemplate.report_input_series);
                        var _value = [];
                        for (var ip = 0; ip < inputOrders.length; ip++) {
                          var _params = _lodash2.default.find(inputData, function (f) {
                            return f.name == inputOrders[ip];
                          });
                          if (_params != undefined) {
                            _value.push(_params.value);
                          }
                        }
                        var _myquery = _mysql.mysqlQueryFormat(resourceTemplate.report_query, _value);
                        _mysql.executeQuery({
                          query: _myquery,
                          printQuery: true
                        }).then(function (result) {
                          var _path = _path3.default.join(process.cwd(), "algaeh_report_tool/templates/Output", resourceTemplate.report_name + (0, _moment2.default)().format("YYYYMMDDHHmmss") + "_" + i + "_" + p);
                          var _outPath = _path + ".pdf";
                          subReportCollection.push(_outPath);
                          var startGenerate = function () {
                            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                              var browser, page, _pdfTemplating, _header, pageOrentation, pageSize;

                              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                while (1) {
                                  switch (_context5.prev = _context5.next) {
                                    case 0:
                                      _context5.next = 2;
                                      return _puppeteer2.default.launch(chromePath);

                                    case 2:
                                      browser = _context5.sent;
                                      _context5.next = 5;
                                      return browser.newPage();

                                    case 5:
                                      page = _context5.sent;
                                      _pdfTemplating = {};

                                      if (!(resourceTemplate.report_header_file_name != null && resourceTemplate.report_header_file_name != "")) {
                                        _context5.next = 13;
                                        break;
                                      }

                                      _context5.next = 10;
                                      return compile(resourceTemplate.report_header_file_name, _extends({}, data[1][0], {
                                        reqHeader: req.headers,
                                        user_name: req.userIdentity["username"],
                                        report_name_for_header: resourceTemplate.report_name_for_header
                                      }));

                                    case 10:
                                      _header = _context5.sent;

                                      _pdfTemplating["headerTemplate"] = _header;
                                      _pdfTemplating["margin"] = {
                                        top: "140px"
                                      };

                                    case 13:
                                      if (!(resourceTemplate.report_footer_file_name != null && resourceTemplate.report_footer_file_name != "")) {
                                        _context5.next = 20;
                                        break;
                                      }

                                      _context5.next = 16;
                                      return compile(resourceTemplate.report_footer_file_name, _extends({}, data[1][0], {
                                        reqHeader: req.headers,
                                        report_name_for_header: resourceTemplate.report_name_for_header
                                      }));

                                    case 16:
                                      _pdfTemplating["footerTemplate"] = _context5.sent;

                                      _pdfTemplating["margin"] = _extends({}, _pdfTemplating["margin"], {
                                        bottom: "70px"
                                      });
                                      _context5.next = 22;
                                      break;

                                    case 20:
                                      _pdfTemplating["footerTemplate"] = "<style> .pdffooter { font-size: 8px;\n                        font-family: Arial, Helvetica, sans-serif; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }\n                      .showreportname{float:left;padding-left:5px;font-size: 08px;}\n                      .showcompay{float:right;padding-right:5px;font-size: 08px;}\n                      </style>\n                      <div class=\"pdffooter\">\n                      <span class=\"showreportname\">" + resourceTemplate.report_name_for_header + "</span>\n                      <span>Page </span>\n                      <span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span>\n                      <span class=\"showcompay\">Powered by Algaeh Technologies.</span>\n                    </div>";
                                      _pdfTemplating["margin"] = _extends({}, _pdfTemplating["margin"], {
                                        bottom: "50px"
                                      });

                                    case 22:
                                      _context5.t0 = page;
                                      _context5.next = 25;
                                      return compile(resourceTemplate.report_name, _extends({}, result, {
                                        reqHeader: req.headers
                                      }));

                                    case 25:
                                      _context5.t1 = _context5.sent;
                                      _context5.next = 28;
                                      return _context5.t0.setContent.call(_context5.t0, _context5.t1);

                                    case 28:
                                      _context5.next = 30;
                                      return page.emulateMedia("screen");

                                    case 30:
                                      pageOrentation = _inputParam.pageOrentation == null ? {} : _inputParam.pageOrentation == "landscape" ? { landscape: true } : {};
                                      pageSize = _inputParam.pageSize == null ? { format: "A4" } : { format: _inputParam.pageSize };
                                      _context5.next = 34;
                                      return page.pdf(_extends({
                                        path: _outPath
                                      }, pageSize, pageOrentation, {
                                        printBackground: true,
                                        displayHeaderFooter: true
                                      }, _pdfTemplating));

                                    case 34:
                                      _context5.next = 36;
                                      return browser.close();

                                    case 36:
                                      resolve();

                                    case 37:
                                    case "end":
                                      return _context5.stop();
                                  }
                                }
                              }, _callee5, undefined);
                            }));

                            return function startGenerate() {
                              return _ref8.apply(this, arguments);
                            };
                          }();

                          var _supportingJS = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", resourceTemplate.report_name + ".js");

                          if (_fsExtra2.default.existsSync(_supportingJS)) {
                            var _require2 = require(_supportingJS),
                                executePDF = _require2.executePDF;

                            executePDF({
                              mysql: _mysql,
                              inputs: _inputParam,
                              loadash: _lodash2.default,
                              moment: _moment2.default,
                              mainData: data[1],
                              result: result
                            }).then(function (resultReq) {
                              result = resultReq;
                              startGenerate();
                            }).catch(function (error) {
                              console.log("Error", error);
                            });
                          } else {
                            if (resourceTemplate.data_manupulation != null && resourceTemplate.data_manupulation != "") {
                              var data_string = "`" + resourceTemplate.data_manupulation + "`";
                              var _resu = eval(data_string);
                              result = JSON.parse(_resu);
                            }
                            startGenerate();
                          }
                        }).catch(function (error) {
                          console.error("Error Report Name", resourceTemplate.report_name);
                          console.error("Error Query", _myquery);
                          console.error();
                          reject(error);
                        });
                      }));
                    };

                    for (var i = 0; i < reportSequence.length; i++) {
                      _loop3(i);
                    }
                  };

                  for (var p = 0; p < inputParameters.length; p++) {
                    _loop2(p);
                  }

                  Promise.all(promises).then(function () {
                    _mysql.releaseConnection();
                    req.records = subReportCollection;
                    next();
                  }).catch(function (error) {
                    _mysql.releaseConnection();

                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end(error);
                  });
                }).catch(function (error) {
                  _mysql.releaseConnection();
                  res.writeHead(400, { "Content-Type": "text/plain" });
                  res.end(error);
                });
              } catch (e) {
                _mysql.releaseConnection();
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end(e);
              }

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    return function getReportMultiPrint(_x7, _x8, _x9) {
      return _ref7.apply(this, arguments);
    };
  }(),
  merdgeTosingleReport: function merdgeTosingleReport(req, res) {
    var getAllReports = req.records;
    var _outfileName = "merdge_" + (0, _moment2.default)().format("YYYYMMDDHHmmss") + ".pdf";
    var _rOut = _path3.default.join(process.cwd(), "algaeh_report_tool/templates/Output", _outfileName);

    (0, _easyPdfMerge2.default)(getAllReports, _rOut, function (error) {
      if (error) {
        console.error(error);
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(error));
      } else {
        _fsExtra2.default.exists(_rOut, function (exists) {
          if (exists) {
            res.writeHead(200, {
              "content-type": "application/pdf",
              "content-disposition": "attachment;filename=" + _outfileName
            });
            var _fs = _fsExtra2.default.createReadStream(_rOut);
            _fs.on("end", function () {
              _fsExtra2.default.unlink(_rOut);
              for (var f = 0; f < getAllReports.length; f++) {
                _fsExtra2.default.unlink(getAllReports[f]);
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
  getExcelReport: function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
      var input, templatePath, _inputParam, _require3, executeExcel, _mysql, _input, i, _inp;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              input = req.query;
              templatePath = _path3.default.join(process.cwd(), "algaeh_report_tool/templates/Excel");
              _inputParam = JSON.parse(input.report);
              _require3 = require(_path3.default.join(templatePath, _inputParam.reportName + ".js")), executeExcel = _require3.executeExcel;
              _mysql = new _algaehMysql2.default();
              _input = { hospital_id: req.userIdentity["x-branch"] };

              for (i = 0; i < _inputParam.reportParams.length; i++) {
                _inp = _inputParam.reportParams[i];

                _input[_inp.name] = _inp.value;
              }
              executeExcel({
                mysql: _mysql,
                inputs: _input,
                loadash: _lodash2.default,
                moment: _moment2.default
              }).then(function (result) {
                var excelOutput = _path3.default.join(outputFolder, "out_" + (0, _moment2.default)().format("YYYYMMDDHHmmss") + ".xlsx");
                var fileNameExcel = _inputParam.reportName + ".xlsx";

                _fsExtra2.default.readFile(_path3.default.join(templatePath, fileNameExcel), function (error, data) {
                  if (error) {
                    console.error(error);
                  } else {
                    var template = new XlsxTemplate(data);
                    if (result.copySheets != null && result.copySheets.length > 0) {
                      for (var c = 0; c < result.copySheets.length; c++) {
                        var shts = result.copySheets[c];
                        template.copySheet(shts.copySheetName, shts.newSheetName);
                      }
                    }

                    for (var s = 0; s < template.sheets.length; s++) {
                      template.substitute(template.sheets[s]["name"], result.data[template.sheets[s]["name"]]);
                    }

                    var dataGenerated = template.generate();
                    _fsExtra2.default.outputFileSync(excelOutput, dataGenerated, { encoding: "binary" });
                    res.writeHead(200, {
                      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      "content-disposition": "attachment;filename=" + fileNameExcel
                    });
                    var _fs = _fsExtra2.default.createReadStream(excelOutput);
                    _fs.on("end", function () {
                      _fsExtra2.default.unlink(excelOutput);
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

            case 8:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    }));

    return function getExcelReport(_x10, _x11) {
      return _ref9.apply(this, arguments);
    };
  }(),
  getRawReport: function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
      var input, _mysql, _inputParam;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              input = req.query;
              _mysql = new _algaehMysql2.default();

              try {
                _inputParam = JSON.parse(input.report);

                _mysql.executeQuery({
                  query: "SELECT report_name_for_header,report_name,report_query,report_input_series,data_manupulation,\
            report_header_file_name,report_footer_file_name from algaeh_d_reports where status='A' and report_name in (?);\
            select H.hospital_name,H.hospital_address,H.arabic_hospital_name, \
            O.organization_name,O.business_registration_number,O.legal_name,O.tax_number,O.address1,O.address2 ,\
            O.email,O.phone1 from hims_d_hospital H,hims_d_organization O \
            where O.hims_d_organization_id =H.organization_id and H.hims_d_hospital_id=?;",
                  values: [_inputParam.reportName, req.userIdentity["hospital_id"]],
                  printQuery: true
                }).then(function (data) {
                  _inputParam["hospital_id"] = req.userIdentity["hospital_id"];
                  var _reportCount = data[0].length;
                  if (_reportCount > 0) {
                    var _reportOutput = [];

                    var _loop4 = function _loop4(r) {
                      var _data = data[0][r];

                      var _inputOrders = eval(_data.report_input_series);

                      var _value = [];
                      for (i = 0; i < _inputOrders.length; i++) {
                        var _params = _lodash2.default.find(_inputParam.reportParams, function (f) {
                          return f.name == _inputOrders[i];
                        });
                        if (_params != undefined) {
                          _value.push(_params.value);
                        }
                      }
                      var queryObject = {
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
                      _mysql.executeQuery(queryObject).then(function (result) {
                        if (result.legth == 0) {
                          res.writeHead(400, {
                            "content-type": "text/plain"
                          });
                          res.write("No record");
                          return;
                        }

                        var _supportingJS = _path3.default.join(process.cwd(), "algaeh_report_tool/templates", _data.report_name + ".js");
                        var _header = req.headers;

                        var startGenerate = function () {
                          var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                            var _pdfTemplating, _header3, reportRaw;

                            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                              while (1) {
                                switch (_context8.prev = _context8.next) {
                                  case 0:
                                    _pdfTemplating = {};

                                    if (!(_data.report_header_file_name != null && _data.report_header_file_name != "")) {
                                      _context8.next = 7;
                                      break;
                                    }

                                    _context8.next = 4;
                                    return compile(_data.report_header_file_name, _extends({
                                      reqHeader: _header3
                                    }, data[1][0], {
                                      user_name: req.userIdentity["username"],
                                      report_name_for_header: _data.report_name_for_header
                                    }));

                                  case 4:
                                    _header3 = _context8.sent;

                                    _pdfTemplating["headerTemplate"] = _header3;
                                    _pdfTemplating["margin"] = {
                                      top: "150px"
                                    };

                                  case 7:
                                    if (!(_data.report_footer_file_name != null && _data.report_footer_file_name != "")) {
                                      _context8.next = 14;
                                      break;
                                    }

                                    _context8.next = 10;
                                    return compile(_data.report_footer_file_name, _extends({
                                      reqHeader: _header
                                    }, data[1][0], {
                                      report_name_for_header: _data.report_name_for_header
                                    }));

                                  case 10:
                                    _pdfTemplating["footerTemplate"] = _context8.sent;

                                    _pdfTemplating["margin"] = _extends({}, _pdfTemplating["margin"], {
                                      bottom: "70px"
                                    });
                                    _context8.next = 16;
                                    break;

                                  case 14:
                                    _pdfTemplating["footerTemplate"] = "<style> .pdffooter { font-size: 8px;\n                    font-family: Arial, Helvetica, sans-serif; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }\n                    .showreportname{float:left;padding-left:5px;font-size: 08px;}\n                    .showcompay{float:right;padding-right:5px;font-size: 08px;}\n                    </style>\n                    <div class=\"pdffooter\">\n                    <span class=\"showreportname\">" + _data.report_name_for_header + "</span>\n                    <span>Page </span>\n                    <span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span>\n                    <span class=\"showcompay\">Powered by Algaeh Techonologies.</span>\n                    </div>";
                                    _pdfTemplating["margin"] = _extends({}, _pdfTemplating["margin"], {
                                      bottom: "50px"
                                    });

                                  case 16:
                                    _context8.next = 18;
                                    return compile(_data.report_name, _extends({}, result, {
                                      reqHeader: _header
                                    }));

                                  case 18:
                                    reportRaw = _context8.sent;

                                    if (!(reportRaw != "")) {
                                      _context8.next = 25;
                                      break;
                                    }

                                    res.writeHead(200, {
                                      "content-type": "text/html"
                                    });
                                    res.write(reportRaw + "~@" + JSON.stringify(_pdfTemplating));
                                    res.end();
                                    _context8.next = 29;
                                    break;

                                  case 25:
                                    res.writeHead(400, {
                                      "content-type": "text/plain"
                                    });
                                    res.write("No record");
                                    res.end();
                                    return _context8.abrupt("return");

                                  case 29:
                                  case "end":
                                    return _context8.stop();
                                }
                              }
                            }, _callee8, undefined);
                          }));

                          return function startGenerate() {
                            return _ref11.apply(this, arguments);
                          };
                        }();

                        if (_fsExtra2.default.existsSync(_supportingJS)) {
                          var _require4 = require(_supportingJS),
                              executePDF = _require4.executePDF;

                          executePDF({
                            mysql: _mysql,
                            inputs: _inputOrders,
                            args: _inputParam,
                            loadash: _lodash2.default,
                            moment: _moment2.default,
                            mainData: data[1],
                            result: result
                          }).then(function (resultReq) {
                            result = resultReq;
                            startGenerate();
                          }).catch(function (error) {
                            console.log("Error", error);
                          });
                        } else {
                          if (_data.data_manupulation != null && _data.data_manupulation != "") {
                            var data_string = "`" + _data.data_manupulation + "`";
                            var _resu = eval(data_string);
                            result = JSON.parse(_resu);
                          }
                          startGenerate();
                        }
                      }).catch(function (error) {
                        _mysql.releaseConnection();
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.write(error);
                        res.end();
                      });
                    };

                    for (var r = 0; r < _reportCount; r++) {
                      var i;

                      _loop4(r);
                    }
                  } else {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.write(new Error("No such report exists"));
                    res.end();
                  }
                }).catch(function (error) {
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

            case 3:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    }));

    return function getRawReport(_x12, _x13) {
      return _ref10.apply(this, arguments);
    };
  }()
};
//# sourceMappingURL=report_generation.js.map