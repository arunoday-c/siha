import algaehMysql from "algaeh-mysql";
import _ from "lodash";

import moment from "moment";
module.exports = {
  getMiscEarningDeductions: (req, res, next) => {
    const _mysql = new algaehMysql();
    let _stringData = " ";
    let intValue = [];
    if (req.query.component_category != null) {
      _stringData = " and component_category=? ";
      intValue.push(req.query.component_category);
    } else if (req.query.miscellaneous_component != null) {
      _stringData = " and miscellaneous_component=? ";
      intValue.push(req.query.miscellaneous_component);
    } else if (req.query.component_type != null) {
      _stringData = " and component_type=? ";
      intValue.push(req.query.component_type);
    }

    _mysql
      .executeQuery({
        query:
          "select hims_d_earning_deduction_id,earning_deduction_code,earning_deduction_description,\
          short_desc,component_category,calculation_method,component_frequency,calculation_type,\
          component_type,shortage_deduction_applicable,overtime_applicable,limit_applicable,limit_amount,\
          process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
          round_off_amount from hims_d_earning_deduction\
          where record_status='A' " +
          _stringData,
        values: intValue,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
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
        _mysql.releaseConnection();
        next(e);
      });
  },

  addLoanMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

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
        _mysql.releaseConnection();
        next(e);
      });
  },

  updateLoanMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

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
        _mysql.releaseConnection();
        next(e);
      });
  },
  getAllHolidays: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    const year =
      input.year > 0
        ? input.year
        : moment()
            .startOf("year")
            .format("YYYY-MM-DD");

    const start_of_year = moment(year, "YYYY")
      .startOf("year")
      .format("YYYY-MM-DD");

    const end_of_year = moment(year, "YYYY")
      .endOf("year")
      .format("YYYY-MM-DD");

    let _stringData = " ";
    if (input.type == "W") {
      _stringData = " and  H.weekoff='Y' and  H.holiday='N' ";
    } else if (input.type == "H") {
      _stringData = " and  H.weekoff='N' and  H.holiday='Y' ";
    }

    _mysql
      .executeQuery({
        query: `select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
          holiday_type,religion_id,R.religion_name,R.arabic_religion_name from  hims_d_holiday  H left join\
          hims_d_religion R on H.religion_id=R.hims_d_religion_id where H.record_status='A' and date(holiday_date) \
          between date(?) and date(?) and hospital_id=? ${_stringData} order by holiday_date ;\
          select day from (select dayname(holiday_date) as day FROM hims_d_holiday  where \
          weekoff='Y' and hospital_id=? and date(holiday_date) \
          between date(?) and date(?) limit 7) as A group by day;  `,
        values: [
          start_of_year,
          end_of_year,
          input.hospital_id,
          input.hospital_id,
          start_of_year,
          end_of_year
        ],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = { weekoffs: result[0], days: result[1] };
        next();
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  addHoliday: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    if (!input.religion_id > 0) {
      delete input.religion_id;
    }

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
    let input = req.body;
    console.log("input:", input);
    //  const year = moment("'" + input.year + "'").format("YYYY");

    const start_of_year = moment(input.year, "YYYY")
      .startOf("year")
      .format("YYYY-MM-DD");

    const end_of_year = moment(input.year, "YYYY")
      .endOf("year")
      .format("YYYY-MM-DD");

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

    newDateList = getDaysArray(
      new Date(start_of_year),
      new Date(end_of_year),
      holidays
    );

    _mysql
      .executeQuery({
        query:
          "select hims_d_holiday_id,hospital_id,holiday_date,\
          holiday_description,weekoff,holiday,holiday_type\
          from  hims_d_holiday  where record_status='A' and date(holiday_date) \
          between date(?) and date(?) and hospital_id=? and weekoff='Y';",
        values: [start_of_year, end_of_year, input.hospital_id],
        printQuery: true
      })
      .then(weekOff_details => {
        if (weekOff_details.length > 0) {
          _mysql.releaseConnection();

          req.records = {
            message: "week off is already defind for the year: " + input.year
          };
          req.flag = 1;
          next();
          return;
        } else if (newDateList.length > 0) {
          const insurtColumns = ["holiday_date"];

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
                updated_date: new Date(),
                created_by: req.userIdentity.algaeh_d_app_user_id,
                updated_by: req.userIdentity.algaeh_d_app_user_id
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
  },

  getEarningDeduction: (req, res, next) => {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select hims_d_earning_deduction_id,earning_deduction_code,earning_deduction_description,\
          short_desc,component_category,calculation_method,component_frequency,calculation_type, specific_nationality, nationality_id,\
          component_type,shortage_deduction_applicable, miscellaneous_component, overtime_applicable,limit_applicable,limit_amount,\
          process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
          round_off_amount,formula, print_report, print_order_by, annual_salary_comp from hims_d_earning_deduction\
          where record_status='A'  order by hims_d_earning_deduction_id desc",
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

  addEarningDeduction: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "INSERT  INTO hims_d_earning_deduction (earning_deduction_code,earning_deduction_description,short_desc,\
            component_category,calculation_method, miscellaneous_component, formula,component_frequency,calculation_type,component_type,\
            shortage_deduction_applicable,overtime_applicable,limit_applicable,limit_amount,\
            process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
            round_off_amount, specific_nationality, nationality_id, print_report, print_order_by, annual_salary_comp,created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.earning_deduction_code,
          input.earning_deduction_description,
          input.short_desc,
          input.component_category,
          input.calculation_method,
          input.miscellaneous_component,
          input.formula,
          input.component_frequency,
          input.calculation_type,
          input.component_type,
          input.shortage_deduction_applicable,
          input.overtime_applicable,
          input.limit_applicable,
          input.limit_amount,
          input.process_limit_required,
          input.process_limit_days,
          input.general_ledger,
          input.allow_round_off,
          input.round_off_type,
          input.round_off_amount,
          input.specific_nationality,
          input.nationality_id,
          input.print_report,
          input.print_order_by,
          input.annual_salary_comp,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
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

  updateEarningDeduction: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "update hims_d_earning_deduction set  earning_deduction_code=?,earning_deduction_description=?,short_desc=?,\
          component_category=?,calculation_method=?,miscellaneous_component=?,component_frequency=?,calculation_type=?,\
          component_type=?,shortage_deduction_applicable=?,overtime_applicable=?,limit_applicable=?,\
          limit_amount=?,process_limit_required=?,process_limit_days=?,general_ledger=?,\
          allow_round_off=?,round_off_type=?,round_off_amount=?,specific_nationality=?, nationality_id=?, \
          print_report=?,print_order_by=?,annual_salary_comp=?,record_status=?,\
            updated_date=?, updated_by=?  WHERE  hims_d_earning_deduction_id = ?",
        values: [
          input.earning_deduction_code,
          input.earning_deduction_description,
          input.short_desc,
          input.component_category,
          input.calculation_method,
          input.miscellaneous_component,
          input.component_frequency,
          input.calculation_type,
          input.component_type,
          input.shortage_deduction_applicable,
          input.overtime_applicable,
          input.limit_applicable,
          input.limit_amount,
          input.process_limit_required,
          input.process_limit_days,
          input.general_ledger,
          input.allow_round_off,
          input.round_off_type,
          input.round_off_amount,
          input.specific_nationality,
          input.nationality_id,
          input.print_report,
          input.print_order_by,
          input.annual_salary_comp,
          input.record_status,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_earning_deduction_id
        ],
        printQuery: true
      })
      .then(update_loan => {
        _mysql.releaseConnection();
        req.records = update_loan;
        next();
      })
      .catch(e => {
        next(e);
      });
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
