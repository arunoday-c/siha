"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";

import { debugLog } from "../../utils/logging";
import moment from "moment";
import _ from "lodash";

//created by irfan:
let addWeakOffs = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    debugLog("input:", input);

    const year = moment(input.year).format("YYYY");

    debugLog("year:", year);
    const today = moment().format("YYYY-MM-DD");
    debugLog("today:", today);

    const start_of_year = moment(year)
      .startOf("year")
      .format("YYYY-MM-DD");
    debugLog("start_of_year:", start_of_year);

    const end_of_year = moment(year)
      .endOf("year")
      .format("YYYY-MM-DD");
    debugLog("end_of_year:", end_of_year);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let holidays = [];

      let inputDays = [
        req.body.sunday,
        req.body.monday,
        req.body.tuesday,
        req.body.wednesday,
        req.body.thursday,
        req.body.friday,
        req.body.saturday
      ];

      for (let d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          holidays.push(d);
        }
      }

      debugLog("holidays:", holidays);
      let newDateList = [];
      if (today >= start_of_year) {
        newDateList = getDaysArray(
          new Date(today),
          new Date(end_of_year),
          holidays
        );
        debugLog("present :");
      } else if (start_of_year > today) {
        newDateList = getDaysArray(
          new Date(start_of_year),
          new Date(end_of_year),
          holidays
        );
        debugLog("next year:");
      }

      newDateList.map(v => v.toLocaleString());

      debugLog("newDateList:", newDateList);
      debugLog("newDateList len:", newDateList.length);

      connection.query(
        "select hims_d_holiday_id,hospital_id,holiday_date,\
        holiday_descritpion,weekoff,holiday,holiday_type\
        from  hims_d_holiday  where record_status='A' and date(holiday_date) \
        between date(?) and date(?) and hospital_id=? ",
        [start_of_year, end_of_year, input.hospital_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            releaseDBConnection(db, connection);
            req.records = {
              weekOff_exist: true,
              message: "week off is already defind for the year " + year
            };
            next();
            return;
          } else if (newDateList.length > 0) {
            const insurtColumns = ["holiday_date", "created_by", "updated_by"];
            debugLog("kkkkkkkkkkkkkkkk:", newDateList);

            connection.query(
              "INSERT INTO hims_d_holiday(" +
                insurtColumns.join(",") +
                ",hospital_id, holiday_descritpion ,weekoff,holiday,holiday_type,created_date,updated_date) VALUES ?",
              [
                jsonArrayToObject({
                  sampleInputObject: insurtColumns,
                  arrayObj: newDateList,
                  newFieldToInsert: [
                    input.hospital_id,
                    input.holiday_descritpion,
                    "Y",
                    "N",
                    "RE",

                    new Date(),
                    new Date()
                  ],
                  req: req
                })
              ],
              (error, weekOfResult) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                debugLog("weekOfResult:", weekOfResult);
                req.records = weekOfResult;
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = {
              weekOff_exist: true,
              message: "please select week off days"
            };
            next();
            return;
          }
        }
      );
    });
    //query  ends
  } catch (e) {
    next(e);
  }
};

function getDaysArray(start, end, days) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    const dat = new Date(dt);
    const day = new Date(dat).getDay();

    if (days.indexOf(day) > -1) {
      arr.push({ holiday_date: dat });
    }
  }
  debugLog("newDatesList tt:", arr);
  return arr;
}

module.exports = { addWeakOffs };
