import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
module.exports = {
  getLoanMaster: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_d_loan_id,loan_code, loan_description, loan_account, loan_limit_type, \
          loan_maximum_amount,loan_status from hims_d_loan where record_status='A' \
          order by hims_d_loan_id desc",
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  addLoanMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_d_loan (loan_code,loan_description, loan_account,loan_limit_type,\
                loan_maximum_amount, created_date,created_by,updated_date,updated_by) \
                values(?,?,?,?,?,?,?,?,?)",
        values: [
          input.loan_code,
          input.loan_description,
          input.loan_account,
          input.loan_limit_type,
          input.loan_maximum_amount,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
      })
      .then(inserted_loan => {
        _mysql.releaseConnection();
        req.records = inserted_loan;
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  updateLoanMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };
    utilities
      .AlgaehUtilities()
      .logger()
      .log("input: ", input);

    _mysql
      .executeQuery({
        query:
          "update hims_d_loan set loan_code=?,loan_description=?,loan_account=?,\
          loan_limit_type=?,loan_maximum_amount=?, record_status=?, updated_date=?, updated_by=?  \
          WHERE hims_d_loan_id = ?",
        values: [
          input.loan_code,
          input.loan_description,
          input.loan_account,
          input.loan_limit_type,
          input.loan_maximum_amount,
          input.record_status,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_loan_id
        ]
      })
      .then(update_loan => {
        _mysql.releaseConnection();
        req.records = update_loan;
        next();
      })
      .catch(e => {
        next(e);
      });
  },
  getAllHolidays: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    const start_of_year = moment()
      .startOf("year")
      .format("YYYY-MM-DD");

    const end_of_year = moment()
      .endOf("year")
      .format("YYYY-MM-DD");

    let _stringData = " ";
    if (input.type == "W") {
      _stringData = " and  H.weekoff='Y' ";
    } else if (input.type == "H") {
      _stringData = " and  H.holiday='Y' ";
    }

    _mysql
      .executeQuery({
        query:
          "select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
          holiday_type,religion_id,R.religion_name,R.arabic_religion_name from  hims_d_holiday  H left join\
          hims_d_religion R on H.religion_id=R.hims_d_religion_id where H.record_status='A' and date(holiday_date) \
          between date(?) and date(?) and hospital_id=? order by holiday_date " +
          _stringData,
        values: [start_of_year, end_of_year, input.hospital_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  addHoliday: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    if (
      input.religion_id == "null" ||
      input.religion_id == "" ||
      input.religion_id == null
    ) {
      delete input.religion_id;
    }

    utilities
      .AlgaehUtilities()
      .logger()
      .log("addHoliday: ", "addHoliday");

    _mysql
      .executeQuery({
        query:
          "select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
            holiday_type from  hims_d_holiday  where \
            record_status='A' and date(holiday_date) = date(?) and hospital_id=?",
        values: [input.holiday_date, input.hospital_id],
        printQuery: true
      })
      .then(holiday_details => {
        utilities
          .AlgaehUtilities()
          .logger()
          .log("holiday_details: ", holiday_details);
        if (holiday_details.length > 0) {
          _mysql.releaseConnection();
          req.records = {
            message:
              "holiday is already defind for this :" +
              moment(input.holiday_date).format("DD/MM/YYYY")
          };
          req.flag = 1;
          next();
          return;
        } else {
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_d_holiday` (hospital_id,holiday_date,holiday_description,\
                    weekoff,holiday,holiday_type,religion_id, created_date, created_by, updated_date, updated_by)\
                    VALUE(?,date(?),?,?,?,?,?,?,?,?,?)",
              values: [
                input.hospital_id,
                input.holiday_date,
                input.holiday_description,
                "N",
                "Y",
                input.holiday_type,
                input.religion_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id
              ],
              printQuery: true
            })
            .then(insert_holiday => {
              _mysql.releaseConnection();
              req.records = insert_holiday;
              next();
            })
            .catch(e => {
              next(e);
            });
        }
      })
      .catch(e => {
        next(e);
      });
  },

  addWeekOffs: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    const year = moment("'" + input.year + "'").format("YYYY");

    utilities
      .AlgaehUtilities()
      .logger()
      .log("year: ", year);

    const start_of_year = moment(year)
      .startOf("year")
      .format("YYYY-MM-DD");

    const end_of_year = moment(year)
      .endOf("year")
      .format("YYYY-MM-DD");

    utilities
      .AlgaehUtilities()
      .logger()
      .log("start_of_year: ", start_of_year);
    utilities
      .AlgaehUtilities()
      .logger()
      .log("end_of_year: ", end_of_year);

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

    let newDateList = [];

    utilities
      .AlgaehUtilities()
      .logger()
      .log("inputDays: ", inputDays);

    newDateList = getDaysArray(
      new Date(start_of_year),
      new Date(end_of_year),
      holidays
    );

    utilities
      .AlgaehUtilities()
      .logger()
      .log("newDateList: ", newDateList);
    newDateList.map(v => v.toLocaleString());

    utilities
      .AlgaehUtilities()
      .logger()
      .log("newDateList: ", newDateList);

    _mysql
      .executeQuery({
        query:
          "select hims_d_holiday_id,hospital_id,holiday_date,\
          holiday_description,weekoff,holiday,holiday_type\
          from  hims_d_holiday  where record_status='A' and date(holiday_date) \
          between date(?) and date(?) and hospital_id=? ",
        values: [start_of_year, end_of_year, input.hospital_id],
        printQuery: true
      })
      .then(weekOff_details => {
        utilities
          .AlgaehUtilities()
          .logger()
          .log("weekOff_details: ", weekOff_details);

        if (weekOff_details.length > 0) {
          _mysql.releaseConnection();

          req.records = {
            message: "week off is already defind for the year: " + year
          };
          req.flag = 1;
          next();
          return;
        } else if (newDateList.length > 0) {
          const insurtColumns = ["holiday_date", "created_by", "updated_by"];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_d_holiday(??) VALUES ?",
              values: newDateList,
              includeValues: insurtColumns,
              extraValues: {
                hospital_id: input.hospital_id,
                holiday_description: "Week Off",
                weekoff: "Y",
                holiday: "N",
                holiday_type: "RE",
                created_date: new Date(),
                updated_date: new Date()
              },
              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(insert_weekOff => {
              _mysql.releaseConnection();
              req.records = insert_weekOff;
              next();
            })
            .catch(e => {
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            weekOff_exist: true,
            message: "please select week off days"
          };
          next();
          return;
        }
      })
      .catch(e => {
        next(e);
      });
  },

  deleteHoliday: (req, res, next) => {
    const _mysql = new algaehMysql();

    if (
      req.body.hims_d_holiday_id != "null" &&
      req.body.hims_d_holiday_id != undefined
    ) {
      _mysql
        .executeQuery({
          query: "DELETE FROM hims_d_holiday WHERE hims_d_holiday_id = ?;",
          values: [req.body.hims_d_holiday_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } else {
      req.records = { message: "please provide valid input" };
      req.flag = 1;
      next();
    }
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

  return arr;
}
