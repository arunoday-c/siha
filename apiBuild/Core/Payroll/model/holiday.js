"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../../utils/logging");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to define all week off's for particular year
var addWeekOffs = function addWeekOffs(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    (0, _logging.debugLog)("input:", input);

    var year = (0, _moment2.default)("'" + input.year + "'").format("YYYY");

    (0, _logging.debugLog)("year:", year);
    var today = (0, _moment2.default)().format("YYYY-MM-DD");
    (0, _logging.debugLog)("today:", today);

    var start_of_year = (0, _moment2.default)(year).startOf("year").format("YYYY-MM-DD");
    (0, _logging.debugLog)("start_of_year:", start_of_year);

    var end_of_year = (0, _moment2.default)(year).endOf("year").format("YYYY-MM-DD");
    (0, _logging.debugLog)("end_of_year:", end_of_year);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      var holidays = [];

      var inputDays = [req.body.sunday, req.body.monday, req.body.tuesday, req.body.wednesday, req.body.thursday, req.body.friday, req.body.saturday];

      for (var d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          holidays.push(d);
        }
      }

      (0, _logging.debugLog)("holidays:", holidays);
      var newDateList = [];
      if (today >= start_of_year) {
        newDateList = getDaysArray(new Date(today), new Date(end_of_year), holidays);
        (0, _logging.debugLog)("present :");
      } else if (start_of_year > today) {
        newDateList = getDaysArray(new Date(start_of_year), new Date(end_of_year), holidays);
        (0, _logging.debugLog)("next year:");
      }

      newDateList.map(function (v) {
        return v.toLocaleString();
      });

      (0, _logging.debugLog)("newDateList:", newDateList);
      (0, _logging.debugLog)("newDateList len:", newDateList.length);

      connection.query("select hims_d_holiday_id,hospital_id,holiday_date,\
        holiday_description,weekoff,holiday,holiday_type\
        from  hims_d_holiday  where record_status='A' and date(holiday_date) \
        between date(?) and date(?) and hospital_id=? ", [start_of_year, end_of_year, input.hospital_id], function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        if (result.length > 0) {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = {
            weekOff_exist: true,
            message: "week off is already defind for the year " + year
          };
          next();
          return;
        } else if (newDateList.length > 0) {
          var insurtColumns = ["holiday_date", "created_by", "updated_by"];
          (0, _logging.debugLog)("kkkkkkkkkkkkkkkk:", newDateList);

          connection.query("INSERT INTO hims_d_holiday(" + insurtColumns.join(",") + ",hospital_id, holiday_description ,weekoff,holiday,holiday_type,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
            sampleInputObject: insurtColumns,
            arrayObj: newDateList,
            newFieldToInsert: [input.hospital_id, "Week Off", "Y", "N", "RE", new Date(), new Date()],
            req: req
          })], function (error, weekOfResult) {
            (0, _utils.releaseDBConnection)(db, connection);
            if (error) {
              next(error);
            }
            (0, _logging.debugLog)("weekOfResult:", weekOfResult);
            req.records = weekOfResult;
            next();
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = {
            weekOff_exist: true,
            message: "please select week off days"
          };
          next();
          return;
        }
      });
    });
    //query  ends
  } catch (e) {
    next(e);
  }
};

function getDaysArray(start, end, days) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    var dat = new Date(dt);
    var day = new Date(dat).getDay();

    if (days.indexOf(day) > -1) {
      arr.push({ holiday_date: dat });
    }
  }

  return arr;
}

//created by irfan: fetch all holidays
var getAllHolidays = function getAllHolidays(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var start_of_year = (0, _moment2.default)().startOf("year").format("YYYY-MM-DD");

    (0, _logging.debugLog)("start_of_year:", start_of_year);

    var end_of_year = (0, _moment2.default)().endOf("year").format("YYYY-MM-DD");
    (0, _logging.debugLog)("end_of_year:", end_of_year);

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
        holiday_type,religion_id,R.religion_name,R.arabic_religion_name from  hims_d_holiday  H left join\
        hims_d_religion R on H.religion_id=R.hims_d_religion_id where H.record_status='A' and date(holiday_date) \
        between date(?) and date(?) and hospital_id=? ", [start_of_year, end_of_year, req.query.hospital_id], function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: define a holiday
var addHoliday = function addHoliday(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.body.religion_id == "null" || req.body.religion_id == "" || req.body.religion_id == null) {
      delete req.body.religion_id;
    }
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
        holiday_type from  hims_d_holiday  where \
        record_status='A' and date(holiday_date) = date(?) and hospital_id=?", [input.holiday_date, input.hospital_id], function (error, existResult) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        if (existResult.length > 0) {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = {
            holiday_exist: true,
            message: "holiday is already defind for this :" + input.holiday_date
          };
          next();
          return;
        } else {
          connection.query("INSERT INTO `hims_d_holiday` (hospital_id,holiday_date,holiday_description,\
          weekoff,holiday,holiday_type,religion_id, created_date, created_by, updated_date, updated_by)\
          VALUE(?,date(?),?,?,?,?,?,?,?,?,?)", [input.hospital_id, input.holiday_date, input.holiday_description, "N", "Y", input.holiday_type, input.religion_id, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
            (0, _utils.releaseDBConnection)(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          });
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var deleteHoliday = function deleteHoliday(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.body.hims_d_holiday_id != "null" && req.body.hims_d_holiday_id != undefined) {
      db.getConnection(function (error, connection) {
        connection.query(" DELETE FROM hims_d_holiday WHERE hims_d_holiday_id = ?; ", [req.body.hims_d_holiday_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        });
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = { addWeekOffs: addWeekOffs, getAllHolidays: getAllHolidays, addHoliday: addHoliday, deleteHoliday: deleteHoliday };
//# sourceMappingURL=holiday.js.map