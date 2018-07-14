"use strict";

var _nodeStringPad = require("node-string-pad");

var _nodeStringPad2 = _interopRequireDefault(_nodeStringPad);

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _logging = require("./logging");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paging = function paging(options) {
  var pageLimit = options.paging.pageNo * options.paging.pageSize;
  return {
    pageNo: pageLimit,
    pageSize: options.paging.pageSize
  };
};
//import { LINQ } from "node-linq";

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
  (0, _logging.debugFunction)("deleteRecord");
  var db = options.db;
  db.getConnection(function (error, connection) {
    var sqlQuery = "select distinct table_name,column_name from information_schema.KEY_COLUMN_USAGE \
      where constraint_schema=? \
      and REFERENCED_TABLE_NAME=?";
    (0, _logging.debugLog)("Sql Query : " + sqlQuery);
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
      (0, _logging.debugLog)("Existing table length : " + tables.length);
      for (var i = 0; i < tables.length; i++) {
        records += "SELECT COUNT(*) CNT FROM " + tables[i]["table_name"] + " WHERE \
           " + tables[i]["column_name"] + "=?;";
        values.push(options.id);
      }
      (0, _logging.debugLog)("rexords Query : " + records);
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
//Upload and Downloading files via multer Configuration
var storage = _multer2.default.diskStorage({
  destination: function destination(req, file, cb) {
    var fullFolderName = req.folderPath;
    var fileName = "";
    _logging.logger.log("info", "after Split %s", file.fieldname);
    var splitFiledName = file.fieldname.split("_");
    if (splitFiledName != null) {
      _logging.logger.log("info", "after Split %j", splitFiledName);
      if (splitFiledName.length > 1) {
        fullFolderName += "/" + splitFiledName[1];
        fileName = "_" + splitFiledName[splitFiledName.length - 1];
      }
    } else {
      fileName = "_" + file.fieldname;
    }
    (0, _logging.debugLog)("Field Name : " + file.fieldname + " File Name : " + fileName);
    req.fullFolderPath = fullFolderName;
    req.newFileName = req.fileName + fileName;
    (0, _mkdirp2.default)(req.fullFolderPath, function (error) {
      if (error) _logging.logger.log("error", "Directory creation error: %j ", error);else {
        (0, _logging.debugLog)("Path setting in multer " + req.fullFolderPath);
        cb(null, req.fullFolderPath);
      }
    });
  },
  filename: function filename(req, file, cb) {
    var pathDeclare = require("path");
    (0, _logging.debugLog)("File Name : " + req.newFileName + pathDeclare.extname(file.originalname));
    cb(null, req.newFileName + pathDeclare.extname(file.originalname));
  }
});
var upload = (0, _multer2.default)({ storage: storage });
//End multer configuration.
//Upload file via multer
var uploadFile = function uploadFile(req, res, callBack) {
  (0, _logging.debugFunction)("Inside File Uplaod");
  upload(req, res, function (error) {
    if (error) {
      _logging.logger.log("error", "%j", error);
    }
    callBack(error, req);
  });
};
//Download file via multer
var downloadFile = function downloadFile(req, res, callBack) {
  upload(req, res, function (error) {
    if (error) {
      _logging.logger.log("error", "Image getting error : %j", error);
    }
    callBack(error, req);
  });
};

var bulkInputArrayObject = function bulkInputArrayObject(arrayObj, outArray, objectToChang) {
  objectToChang = objectToChang || {};
  _underscore2.default.each(arrayObj, function (item, index) {
    outArray.push(Object.keys(item).map(function (key) {
      if (objectToChang[key] != null) {
        return objectToChang[key];
      }
      return item[key];
    }));
  });
};
var bulkMasters = function bulkMasters(fileName, bulkObject) {
  try {
    var masterDir = _path2.default.join(__dirname, "../../Masters/");
    if (!_fs2.default.existsSync(masterDir)) {
      _fs2.default.mkdirSync(masterDir);
    }
    var fPath = masterDir + fileName + ".json";
    if (!_fs2.default.exists(fPath)) {
      var writeStream = _fs2.default.createWriteStream(fPath);
      writeStream.write(JSON.stringify(bulkObject));
      writeStream.end();
      return bulkObject;
    }
    return JSON.parse(_fs2.default.readFileSync(fPath));
  } catch (e) {
    _logging.logger.log("error", "Bulk master save : %j", e);
  }
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
  uploadFile: uploadFile,
  downloadFile: downloadFile,
  bulkInputArrayObject: bulkInputArrayObject,
  bulkMasters: bulkMasters
};
//# sourceMappingURL=index.js.map