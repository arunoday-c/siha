import pad from "node-string-pad";
import algaehKeys from "algaeh-keys"; //"../keys/keys";
import multer from "multer";
import path from "path";
import mkdirp from "mkdirp";
import logUtils from "./logging";
import fs from "fs";
import { LINQ } from "node-linq";
import _ from "underscore";

const { logger, debugFunction, debugLog } = logUtils;
const config = algaehKeys.default;
let paging = options => {
  let pageLimit = options.paging.pageNo * options.paging.pageSize;
  return {
    pageNo: pageLimit,
    pageSize: options.paging.pageSize
  };
};
let whereCondition = options => {
  let condition = "";
  let values = [];
  let total = Object.keys(options).length;
  let i = 0;
  Object.keys(options).forEach(key => {
    condition += "(" + key + '=? or "ALL"=?)';
    if (options[key] == null || options[key] == "null") {
      options[key] = "ALL";
    }

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

let selectStatement = (
  options,
  successCallback,
  errorCallback,
  isreleaseConnection
) => {
  isreleaseConnection = isreleaseConnection || false;
  if (options == null) {
    if (typeof errorCallback == "function") {
      errorCallback({
        success: false,
        message: "Options cannot null"
      });
    }
  }
  let db = options.db;
  options.values = options.values || [];
  db.getConnection((error, connection) => {
    connection.query(options.query, options.values, (error, result) => {
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

let deleteRecord = (
  options,
  successCallback,
  errorCallback,
  isreleaseConnection
) => {
  isreleaseConnection = isreleaseConnection || false;

  let db = options.db;
  db.getConnection((error, connection) => {
    let sqlQuery =
      "select distinct table_name,column_name from information_schema.KEY_COLUMN_USAGE \
      where constraint_schema=? \
      and REFERENCED_TABLE_NAME=?";
    debugLog("Options", options);
    debugLog("Sql Query : " + sqlQuery, options.tableName);
    connection.query(
      sqlQuery,
      [config.mysqlDb.database, options.tableName],
      (error, tables) => {
        if (error) {
          if (isreleaseConnection) connection.release();
          if (typeof errorCallback == "function") {
            errorCallback(error);
            return;
          }
        }
        let records = "";
        let values = [];

        if (tables.length == 0) {
          connection.query(
            options.query,
            options.values,
            (error, deleteRecord) => {
              if (error) {
                if (isreleaseConnection) connection.release();
                if (typeof errorCallback == "function") {
                  errorCallback(error);
                  return;
                }
              }

              let result = {
                success: true,
                records: deleteRecord
              };
              if (isreleaseConnection) connection.release();
              if (typeof successCallback == "function") {
                successCallback(result);
              }
            }
          );
        } else {
          for (var i = 0; i < tables.length; i++) {
            records +=
              "SELECT COUNT(*) CNT FROM " +
              tables[i]["table_name"] +
              " WHERE \
             " +
              tables[i]["column_name"] +
              "=?;";
            values.push(options.id);
          }

          connection.query(records, values, (error, result) => {
            if (error) {
              if (isreleaseConnection) connection.release();
              if (typeof errorCallback == "function") {
                errorCallback(error);
                return;
              }
            } else {
              var hasRecords = false;

              for (var c = 0; c < result.length; c++) {
                if (result[c][0] != null) {
                  if (result[c][0]["CNT"] > 0) {
                    hasRecords = true;
                    break;
                  }
                } else {
                  if (result[c]["CNT"] > 0) {
                    hasRecords = true;
                    break;
                  }
                }
              }

              if (hasRecords == true) {
                result = {
                  success: false,
                  message: "Record already in use.."
                };
                if (isreleaseConnection) connection.release();
                if (typeof successCallback == "function") {
                  successCallback(result);
                }
              } else {
                connection.query(
                  options.query,
                  options.values,
                  (error, deleteRecord) => {
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
                  }
                );
              }
            }
          });
        }
      }
    );
  });
};
let releaseConnection = (req, res) => {
  if (req.db != null) {
    delete req.db;
  }
  if (req.records != null) {
    delete req.records;
  }
  res.flush();
};
let checkIsNull = (input, defaultType) => {
  return input == null || input == "" ? defaultType : input;
};

let runningNumberGen = options => {
  const db = options.db;

  db.query(
    "SELECT  `module_desc`,`hims_f_app_numgen_id`, `prefix`, `intermediate_series`, `postfix`\
, `length`, `increment_by`, `numgen_seperator`, `postfix_start`\
,`postfix_end`, `current_num`, `pervious_num` FROM `hims_f_app_numgen`\
 WHERE record_status='A' AND `module_desc` in (?)AND  \
 `postfix` >= `postfix_start` AND `postfix` <= `postfix_end`",
    [options.module_desc],
    (error, result) => {
      if (error) {
        options.onFailure(error);
      }

      if (result.length == 0) {
        options.onFailure(
          "Generation series for '" +
            options.module_desc +
            "' not exist please contact administrator."
        );
      } else {
        let resultNumbers = [];
        result.map((item, index) => {
          let prefix = item["prefix"];
          let numgenId = item["hims_f_app_numgen_id"];
          let intermediate_series = item["intermediate_series"];
          let postfix = item["postfix"];
          let length =
            parseInt(item["length"], 10) - parseInt(prefix.length, 10);
          let increment_by = parseInt(item["increment_by"], 10);
          if (options.counter != null) {
            increment_by = increment_by + parseInt(options.counter - 1, 10);
          }

          let numgen_seperator = item["numgen_seperator"];
          let newNumber = parseInt(postfix, 10) + increment_by;

          let paddedNumber = padString(String(newNumber), length, "0");

          let queryAtt =
            "UPDATE `hims_f_app_numgen` \
    SET `current_num`=?, `pervious_num`=?,postfix=? \
    WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?";
          db.query(
            queryAtt,
            [paddedNumber, postfix, paddedNumber, numgenId],
            (error, numUpdate) => {
              if (error) {
                debugFunction("Error");
                options.onFailure(error);
              }

              let completeNumber =
                prefix +
                numgen_seperator +
                intermediate_series +
                numgen_seperator +
                paddedNumber;

              resultNumbers.push({
                completeNumber: completeNumber,
                module_desc: item["module_desc"]
              });

              if (index == result.length - 1) {
                options.onSuccess(resultNumbers);
                debugLog("Number:", resultNumbers);
              }
            }
          );
        });
      }
    }
  );
};

let runningNumber = (
  db,
  numgenId,
  paramName,
  callBack,
  isreleaseConnection
) => {
  isreleaseConnection = isreleaseConnection || false;

  db.query(
    "SELECT  `prefix`, `intermediate_series`, `postfix`\
  , `length`, `increment_by`, `numgen_seperator`, `postfix_start`\
  ,`postfix_end`, `current_num`, `pervious_num` FROM `hims_f_app_numgen`\
   WHERE record_status='A' AND hims_f_app_numgen_id=?",
    [numgenId],
    (error, result) => {
      if (error) {
        throw error;
      }
      result = result[0];
      let prefix = result["prefix"];
      let intermediate_series = result["intermediate_series"];
      let postfix = result["postfix"];
      let length = parseInt(result["length"], 10) - parseInt(prefix.length, 10);
      let increment_by = result["increment_by"];
      let numgen_seperator = result["numgen_seperator"];
      let postfix_start = result["postfix_start"];
      let postfix_end = result["postfix_end"];

      let newNumber = parseInt(postfix, 10) + parseInt(increment_by, 10);

      if (
        parseInt(postfix_start, 10) <= newNumber &&
        parseInt(postfix_end, 10) >= newNumber
      ) {
        let paddedNumber = padString(String(newNumber), length, "0");
        let queryAtt =
          "UPDATE `hims_f_app_numgen` \
        SET `current_num`=?, `pervious_num`=?,postfix=? \
        WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?";
        db.query(
          queryAtt,
          [paddedNumber, postfix, paddedNumber, numgenId],
          (error, numUpdate) => {
            if (error) {
              throw error;
            }

            let completeNumber =
              prefix +
              numgen_seperator +
              intermediate_series +
              numgen_seperator +
              paddedNumber;

            if (typeof callBack == "function") {
              callBack(error, numUpdate, completeNumber);
            }
          }
        );
      } else {
        db.query(
          "select  param_value from algaeh_d_app_config where \
        param_name =? and param_sequence =(\
        select param_sequence from algaeh_d_app_config \
        where param_name=? and param_value=? \
        )+1",
          [paramName, paramName, intermediate_series],
          (error, resultSeries) => {
            if (error) {
              throw error;
            }
            newNumber =
              parseInt(postfix_start, 10) + parseInt(increment_by, 10);
            paddedNumber = padString(newNumber, length, "0");

            let interSeries = resultSeries[0]["param_value"];
            let queryGen =
              "UPDATE `hims_f_app_numgen` SET `intermediate_series`=?,\
            `current_num`=?,`pervious_num`=?,postfix=? \
            WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?";
            db.query(
              queryGen,
              [interSeries, paddedNumber, postfix, paddedNumber, numgenId],
              (error, updateResult) => {
                if (error) {
                  throw error;
                }

                let completeNumber =
                  prefix +
                  numgen_seperator +
                  interSeries +
                  numgen_seperator +
                  paddedNumber;

                if (typeof callBack == "function") {
                  callBack(error, updateResult, completeNumber);
                }
              }
            );
          }
        );
      }
    }
  );
};

let padString = (newNumber, length, paddCharacter) => {
  return pad(newNumber.toString(), length, "LEFT", paddCharacter);
};

let releaseDBConnection = (pool, connection) => {
  if (pool._freeConnections.indexOf(connection) == -1) {
    connection.release();
  }
};
//Upload and Downloading files via multer Configuration
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let fullFolderName = req.folderPath;
    let fileName = "";
    logger.log("info", "after Split %s", file.fieldname);
    let splitFiledName = file.fieldname.split("_");
    if (splitFiledName != null) {
      logger.log("info", "after Split %j", splitFiledName);
      if (splitFiledName.length > 1) {
        fullFolderName += "/" + splitFiledName[1];
        fileName = "_" + splitFiledName[splitFiledName.length - 1];
      }
    } else {
      fileName = "_" + file.fieldname;
    }
    debugLog("Field Name : " + file.fieldname + " File Name : " + fileName);
    req.fullFolderPath = fullFolderName;
    req.newFileName = req.fileName + fileName;
    mkdirp(req.fullFolderPath, error => {
      if (error) logger.log("error", "Directory creation error: %j ", error);
      else {
        debugLog("Path setting in multer " + req.fullFolderPath);
        cb(null, req.fullFolderPath);
      }
    });
  },
  filename: function(req, file, cb) {
    const pathDeclare = require("path");
    debugLog(
      "File Name : " + req.newFileName + pathDeclare.extname(file.originalname)
    );
    cb(null, req.newFileName + pathDeclare.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });
//End multer configuration.
//Upload file via multer
let uploadFile = (req, res, callBack) => {
  debugFunction("Inside File Uplaod");
  upload(req, res, error => {
    if (error) {
      logger.log("error", "%j", error);
    }
    callBack(error, req);
  });
};
//Download file via multer
let downloadFile = (req, res, callBack) => {
  upload(req, res, error => {
    if (error) {
      logger.log("error", "Image getting error : %j", error);
    }
    callBack(error, req);
  });
};
/*
   input as array of obejct and converting to single araay object
*/
let jsonArrayToObject = options => {
  let outputObject = [];
  for (let i = 0; i < options.arrayObj.length; i++) {
    let internalarray = [];
    const item = options.arrayObj[i];
    for (let j = 0; j < options.sampleInputObject.length; j++) {
      let key = options.sampleInputObject[j];
      let inideCreate = false;
      if (key == "created_by" || key == "updated_by") {
        internalarray.push(options.req.body.created_by);
        inideCreate = true;
      }
      if (options.replaceObject != null && options.replaceObject.length != 0) {
        let replacer = new LINQ(options.replaceObject)
          .Where(w => w.originalKey == key)
          .FirstOrDefault();

        if (replacer != null) {
          if (replacer.NewKey != null) {
            key = replacer.NewKey;
          }
        }
      }
      if (!inideCreate) internalarray.push(item[key]);
    }

    // outputObject.push(

    //   options.sampleInputObject.map(key => {
    //     if (key == "created_by" || key == "updated_by") {
    //       return options.req.body.created_by;
    //     }
    //     if (
    //       options.replaceObject != null &&
    //       options.replaceObject.length != 0
    //     ) {
    //       let replacer = new LINQ(options.replaceObject)
    //         .Where(w => w.originalKey == key)
    //         .FirstOrDefault();

    //       if (replacer != null) {
    //         if (replacer.NewKey != null) {
    //           key = replacer.NewKey;
    //         }
    //       }
    //     }

    //     return item[key];
    //   })
    // );
    if (options.newFieldToInsert != null) {
      options.newFieldToInsert.map(row => {
        internalarray.push(row);
      });
    }
    outputObject.push(internalarray);
  }
  return outputObject;
};

let bulkInputArrayObject = (arrayObj, outArray, objectToChang) => {
  objectToChang = objectToChang || {};
  _.each(arrayObj, (item, index) => {
    outArray.push(
      Object.keys(item).map((key, keyIndex) => {
        if (objectToChang[key] != null) {
          return objectToChang[key];
        }
        return item[key];
      })
    );
  });
};
let bulkMasters = (fileName, bulkObject) => {
  try {
    let testobj = JSON.stringify(bulkObject);
    if (testobj == "" || testobj == null) {
      return;
    }
    const masterDir = path.join(__dirname, "../../Masters/");
    if (!fs.existsSync(masterDir)) {
      fs.mkdirSync(masterDir);
    }
    const fPath = masterDir + fileName + ".json";
    if (!fs.exists(fPath)) {
      var writeStream = fs.createWriteStream(fPath);
      writeStream.write(testobj);
      writeStream.end();
      return bulkObject;
    }
    return JSON.parse(fs.readFileSync(fPath));
  } catch (e) {
    logger.log("error", "Bulk master save : %j", e);
  }
};

const generateDbConnection = (req, res, next) => {
  const _db = req.db;
  if (_db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  _db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    req["connection"] = connection;
    debugLog("connection", connection);
    next();
  });
};
//created by irfan: to get maximum AUTH levels
let getMaxAuth = options => {
  let db = options.req.db;

  let MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth;

  db.getConnection((error, connection) => {
    db.query(
      "SELECT * FROM hims_d_hrms_options",

      (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          options.onFailure(error);
        }

        //LEAVE
        switch (result[0]["leave_level"]) {
          case "1":
            MaxLeave = "1";
            break;

          case "2":
            MaxLeave = "2";
            break;
          case "3":
            MaxLeave = "3";
            break;
          // case "4":
          //   MaxLeave = "4";
          //   break;
          // case "5":
          //   MaxLeave = "5";
          //   break;
          // default:
        }

        //LOAN
        switch (result[0]["loan_level"]) {
          case "1":
            MaxLoan = "1";
            break;

          case "2":
            MaxLoan = "2";
            break;
          // case "3":
          //   MaxLoan = "3";
          //   break;
          // case "4":
          //   MaxLoan = "4";
          //   break;
          // case "5":
          //   MaxLoan = "5";
          //   break;
          // default:
        }
        //LEAVE ENCASH
        switch (result[0]["leave_encash_level"]) {
          case "1":
            MaxLeaveEncash = "1";
            break;

          case "2":
            MaxLeaveEncash = "2";
            break;
          case "3":
            MaxLeaveEncash = "3";
            break;
          // case "4":
          //   MaxLeaveEncash = "4";
          //   break;
          // case "5":
          //   MaxLeaveEncash = "5";
          //   break;
          // default:
        }
        //REVIEW AUTH
        switch (result[0]["review_auth_level"]) {
          case "1":
            MaxreviewAuth = "1";
            break;

          case "2":
            MaxreviewAuth = "2";
            break;
          case "3":
            MaxreviewAuth = "3";
            break;
          // case "4":
          //   MaxreviewAuth = "4";
          //   break;
          // case "5":
          //   MaxreviewAuth = "5";
          //   break;
          // default:
        }
        debugLog("redd:", { MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth });
        options.onSuccess({ MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth });

        //HOW TO CALL

        // new Promise((resolve, reject) => {
        //   try {
        //     getMaxAuth({
        //       req: req,
        //       onFailure: error => {
        //         reject(error);
        //       },
        //       onSuccess: result => {
        //         resolve(result);
        //       }
        //     });
        //   } catch (e) {
        //     reject(e);
        //   }
        // }).then(result => {
        //   debugLog("result:", result);
        // });
      }
    );
  });
};

export default {
  generateDbConnection,
  selectStatement,
  paging,
  whereCondition,
  releaseConnection,
  checkIsNull,
  runningNumber,
  deleteRecord,
  releaseDBConnection,
  uploadFile,
  downloadFile,
  bulkInputArrayObject,
  bulkMasters,
  jsonArrayToObject,
  runningNumberGen,
  getMaxAuth
};
