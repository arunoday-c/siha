"use strict";

var _nodeStringPad = require("node-string-pad");

var _nodeStringPad2 = _interopRequireDefault(_nodeStringPad);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _fileBase = require("file-base64");

var _fileBase2 = _interopRequireDefault(_fileBase);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _logging = require("./logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paging = function paging(options) {
  var pageLimit = options.paging.pageNo * options.paging.pageSize;
  return {
    pageNo: pageLimit,
    pageSize: options.paging.pageSize
  };
};
var whereCondition = function whereCondition(options) {
  var condition = "";
  var values = [];
  var total = Object.keys(options).length;
  var i = 0;
  Object.keys(options).forEach(function (key) {
    condition += "(" + key + '=? or "ALL"=?)';
    if (i != total - 1) condition += " AND ";
    values.push(options[key]);
    values.push(options[key]);
    i = i + 1;
  });
  return {
    condition: condition,
    values: values
  };
};

var selectStatement = function selectStatement(options, successCallback, errorCallback, isreleaseConnection) {
  isreleaseConnection = isreleaseConnection || false;
  if (options == null) {
    if (typeof errorCallback == "function") {
      errorCallback({
        success: false,
        message: "Options can not null"
      });
    }
  }
  var db = options.db;
  options.values = options.values || [];
  db.getConnection(function (error, connection) {
    connection.query(options.query, options.values, function (error, result) {
      if (isreleaseConnection) releaseDBConnection(db, connection);
      if (error) {
        if (typeof errorCallback == "function") {
          errorCallback(error);
        }
      }
      if (typeof successCallback == "function") successCallback(result);
    });
  });
};
var deleteRecord = function deleteRecord(options, successCallback, errorCallback, isreleaseConnection) {
  isreleaseConnection = isreleaseConnection || false;
  var db = options.db;
  db.getConnection(function (error, connection) {
    var sqlQuery = "select distinct table_name,column_name from information_schema.KEY_COLUMN_USAGE \
      where constraint_schema=? \
      and REFERENCED_TABLE_NAME=?";
    connection.query(sqlQuery, [_keys2.default.mysqlDb.database, options.tableName], function (error, tables) {
      if (error) {
        if (isreleaseConnection) connection.release();
        if (typeof errorCallback == "function") {
          errorCallback(error);
          return;
        }
      }
      var records = "";
      var values = [];
      for (var i = 0; i < tables.length; i++) {
        records += "SELECT COUNT(*) CNT FROM " + tables[i]["table_name"] + " WHERE \
           " + tables[i]["column_name"] + "=?;";
        values.push(options.id);
      }
      connection.query(records, values, function (error, result) {
        if (error) {
          if (isreleaseConnection) connection.release();
          if (typeof errorCallback == "function") {
            errorCallback(error);
            return;
          }
        } else {
          var hasRecords = false;
          for (var c = 0; c < result.length; c++) {
            if (result[c][0] != null && result[c][0]["CNT"] == 1) {
              hasRecords = true;
              break;
            }
          }
          if (hasRecords == true) {
            result = {
              success: false,
              message: "Record already exists.."
            };
            if (isreleaseConnection) connection.release();
            if (typeof successCallback == "function") {
              successCallback(result);
            }
          } else {
            connection.query(options.query, options.values, function (error, deleteRecord) {
              if (error) {
                if (isreleaseConnection) connection.release();
                if (typeof errorCallback == "function") {
                  errorCallback(error);
                  return;
                }
              }

              result = {
                success: true,
                records: deleteRecord
              };
              if (isreleaseConnection) connection.release();
              if (typeof successCallback == "function") {
                successCallback(result);
              }
            });
          }
        }
      });
    });
  });
};
var releaseConnection = function releaseConnection(req) {
  if (req.db != null) {
    delete req.db;
  }
  if (req.records != null) {
    delete req.records;
  }
};
var checkIsNull = function checkIsNull(input, defaultType) {
  return input == null || input == "" ? defaultType : input;
};

var runningNumber = function runningNumber(db, numgenId, paramName, callBack, isreleaseConnection) {
  isreleaseConnection = isreleaseConnection || false;
  db.query("SELECT  `prefix`, `intermediate_series`, `postfix`\
  , `length`, `increment_by`, `numgen_seperator`, `postfix_start`\
  ,`postfix_end`, `current_num`, `pervious_num` FROM `hims_f_app_numgen`\
   WHERE record_status='A' AND hims_f_app_numgen_id=?", [numgenId], function (error, result) {
    if (error) {
      throw error;
    }
    result = result[0];
    var prefix = result["prefix"];
    var intermediate_series = result["intermediate_series"];
    var postfix = result["postfix"];
    var length = parseInt(result["length"]) - parseInt(prefix.length);
    var increment_by = result["increment_by"];
    var numgen_seperator = result["numgen_seperator"];
    var postfix_start = result["postfix_start"];
    var postfix_end = result["postfix_end"];

    var newNumber = parseInt(postfix) + parseInt(increment_by);

    if (parseInt(postfix_start) <= newNumber && parseInt(postfix_end) >= newNumber) {
      var _paddedNumber = padString(String(newNumber), length, "0");
      var queryAtt = "UPDATE `hims_f_app_numgen` \
        SET `current_num`=?, `pervious_num`=?,postfix=? \
        WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?";
      db.query(queryAtt, [_paddedNumber, postfix, _paddedNumber, numgenId], function (error, numUpdate) {
        if (error) {
          throw error;
        }

        var completeNumber = prefix + numgen_seperator + intermediate_series + numgen_seperator + _paddedNumber;

        if (typeof callBack == "function") {
          callBack(error, numUpdate, completeNumber);
        }
      });
    } else {
      db.query("select  param_value from algaeh_d_app_config where \
        param_name =? and param_sequence =(\
        select param_sequence from algaeh_d_app_config \
        where param_name=? and param_value=? \
        )+1", [paramName, paramName, intermediate_series], function (error, resultSeries) {
        if (error) {
          throw error;
        }
        newNumber = parseInt(postfix_start) + parseInt(increment_by);
        paddedNumber = padString(newNumber, length, "0");

        var interSeries = resultSeries[0]["param_value"];
        var queryGen = "UPDATE `hims_f_app_numgen` SET `intermediate_series`=?,\
            `current_num`=?,`pervious_num`=?,postfix=? \
            WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?";
        db.query(queryGen, [interSeries, paddedNumber, postfix, paddedNumber, numgenId], function (error, updateResult) {
          if (error) {
            throw error;
          }

          var completeNumber = prefix + numgen_seperator + interSeries + numgen_seperator + paddedNumber;

          if (typeof callBack == "function") {
            callBack(error, updateResult, completeNumber);
          }
        });
      });
    }
  });
};

var padString = function padString(newNumber, length, paddCharacter) {
  return (0, _nodeStringPad2.default)(newNumber.toString(), length, "LEFT", paddCharacter);
};

var releaseDBConnection = function releaseDBConnection(pool, connection) {
  if (pool._freeConnections.indexOf(connection) == -1) {
    connection.release();
  }
};
//from base64 decode to a file
var base64DecodeToFile = function base64DecodeToFile(options) {
  (0, _logging.debugFunction)("base64DecodeToFile");
  var settings = (0, _extend2.default)({
    isPatient: true,
    code: "",
    file: "",
    base64String: "",
    callBack: null
  }, options);
  var appendFolder = "/Patients/";
  if (!settings.isPatient) appendFolder = "/Employees/";
  var folderDir = (_keys2.default.documentFolderPath + appendFolder + settings.code).trim();
  (0, _logging.debugLog)(folderDir);
  //logger,debugFunction,debugLog

  var fullDocPath = _path2.default.join(__dirname, folderDir);
  (0, _logging.debugLog)("DocumentPath" + fullDocPath);
  (0, _mkdirp2.default)(fullDocPath, function (error) {
    if (error) _logging.logger.log("error %j", error);else {
      (0, _logging.debugLog)("Document folder created successfully");
      _fileBase2.default.decode(settings.base64String, fullDocPath + "/" + settings.file, function (error, output) {
        if (typeof settings.callBack == "function") settings.callBack(error, output);
      });
    }
  });
};
//from base64 encode to a file
var base64EncodeToFile = function base64EncodeToFile(options) {
  var settings = (0, _extend2.default)({
    file: "",
    callBack: null
  }, options);
  var fullDocPath = _path2.default.join(__dirname, _keys2.default.documentFolderPath + "/" + settings.file);
  _fileBase2.default.encode(fullDocPath, function (error, output) {
    if (typeof settings.callBack == "function") settings.callBack(error, output);
  });
};
var updateApplicationObject = function updateApplicationObject(key, value) {
  applicationObject;
};

module.exports = {
  selectStatement: selectStatement,
  paging: paging,
  whereCondition: whereCondition,
  releaseConnection: releaseConnection,
  checkIsNull: checkIsNull,
  runningNumber: runningNumber,
  deleteRecord: deleteRecord,
  releaseDBConnection: releaseDBConnection,
  base64DecodeToFile: base64DecodeToFile,
  base64EncodeToFile: base64EncodeToFile
};
//# sourceMappingURL=index.js.map