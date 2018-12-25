import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
module.exports = {
  //created by irfan: to
  processAttendance: (req, res, next) => {
    const _mysql = new algaehMysql();
    let yearAndMonth = req.query.yearAndMonth;
    delete req.query.yearAndMonth;

    const startOfMonth = moment(yearAndMonth)
      .startOf("month")
      .format("YYYY-MM-DD");

    const endOfMonth = moment(yearAndMonth)
      .endOf("month")
      .format("YYYY-MM-DD");

    const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
    const month_name = moment(yearAndMonth).format("MMMM");
    const month_number = moment(yearAndMonth).format("MM");
    const year = moment(yearAndMonth).format("YYYY");

    let selectWhere = {
      date_of_joining: endOfMonth,
      exit_date: startOfMonth,
      date_of_joining1: endOfMonth,
      hospital_id: "ALL",
      sub_department_id: "ALL",
      hims_d_employee_id: "ALL",
      ...req.query
    };

    _mysql
      .executeQueryWithTransaction({
        query:
          "select hims_d_employee_id, employee_code,full_name  as employee_name,\
      employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,exit_date from hims_d_employee where employee_status <>'I'\
      and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
      (date(date_of_joining) <= date(?) and exit_date is null)) and  record_status='A' AND ( hospital_id=? OR 1=1) \
      AND ( sub_department_id=? OR 1=1) AND ( hims_d_employee_id=? OR 1=1)",
        values: _.valuesIn(selectWhere),
        printQuery: true
      })
      .then(empResult => {
        if (empResult.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_d_holiday_id, hospital_id, holiday_date, holiday_descritpion,\
          weekoff, holiday, holiday_type, religion_id from \
       hims_d_holiday where record_status='A' and  \
          date(holiday_date) between date(?) and date(?) \
          and (weekoff='Y' or holiday='Y') and hospital_id=?",
              values: [startOfMonth, endOfMonth, empResult[0]["hospital_id"]],
              printQuery: true
            })
            .then(holidayResult => {
              for (let i = 0; i < empResult.length; i++) {
                let emp_absent_days = "0";
                let emp_total_holidays = "0";
                let total_week_off = "0";
                let paid_leave = "0";
                let unpaid_leave = "0";
                let total_leaves = "0";
                let present_days = "0";
                let paid_days = "0";
                _mysql
                  .executeQuery({
                    query:
                      "select hims_f_absent_id, employee_id, absent_date, from_session, to_session,\
              reason, cancel ,count(employee_id) as absent_days\
              from hims_f_absent where record_status='A' and cancel='N' and employee_id=?\
              and date(absent_date) between date(?) and date(?) group by  employee_id",
                    values: [
                      empResult[i]["hims_d_employee_id"],
                      startOfMonth,
                      endOfMonth
                    ],
                    printQuery: true
                  })
                  .then(absentResult => {
                    if (absentResult.length > 0) {
                      emp_absent_days = absentResult[0].absent_days;
                    }
                    //HOLIDAYS CALCULATION------------------------------------------
                    let other_religion_holidays = _.result(
                      _.find(holidayResult, obj => {
                        return (
                          obj.weekoff == "N" &&
                          obj.holiday == "Y" &&
                          obj.holiday_type == "RS" &&
                          obj.religion_id != empResult[i]["religion_id"]
                        );
                      }),
                      "hims_d_holiday_id"
                    );
                    console.log(
                      "other_religion_holidays",
                      other_religion_holidays
                    );
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                    });
                  })
                  .catch(e => {
                    next(e);
                  });
              }
            })
            .catch(e => {
              next(e);
            });
        }
      })
      .catch(e => {
        next(e);
      });
  }
};
