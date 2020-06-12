import algaehMysql from "algaeh-mysql";
// import _ from "lodash";
// import moment from "moment";
// import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  uploadEmployeeGratuity: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const rawdata = req.body.map(item => {
        return {
          ...item, acc_gratuity: item.gratuity_amount
        }
      });

      const input = rawdata
        .filter(item => {
          return (
            !parseInt(item.employee_id) > 0 ||
            !parseInt(item.month) > 0 ||
            parseInt(item.month) > 12 ||
            !parseInt(item.year) > 0
          );
        })
        .map(m => {
          return m.employee_code;
        });

      if (input.length > 0) {
        req.records = {
          invalid_input: true,
          message: `Please Provide valid input for ${input}`
        };
        next();
      } else {
        const insurtColumns = [
          "employee_id",
          "year",
          "month",
          "gratuity_amount",
          "acc_gratuity"
        ];

        _mysql
          .executeQuery({
            query:
              " INSERT INTO hims_f_gratuity_provision (??) VALUES ?  ON DUPLICATE KEY UPDATE \
              gratuity_amount=values(gratuity_amount), acc_gratuity=values(acc_gratuity);",
            values: rawdata,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            printQuery: true
          })
          .then(finalResult => {
            _mysql.releaseConnection();
            req.records = finalResult;
            next();
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      next(e);
    }
  },
  //created by irfan:
  uploadEmployeeLeaveSalary: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const rawdata = req.body;

      const input = rawdata
        .filter(item => {
          return item.employee_id > 0;
        })
        .map(m => {
          return {
            ...m,
            leave_days: m.balance_leave_days,
            leave_salary_amount: m.balance_leave_salary_amount,
            airticket_amount: m.balance_airticket_amount
          };
        });

      if (input.length > 0) {
        const insurtColumns = [
          "employee_id",
          "leave_days",
          "leave_salary_amount",
          "airticket_amount",
          "balance_leave_days",
          "balance_leave_salary_amount",
          "balance_airticket_amount",
          "airfare_months",
          "hospital_id"
        ];

        _mysql
          .executeQuery({
            query:
              " INSERT INTO hims_f_employee_leave_salary_header (??) VALUES ?  ON DUPLICATE KEY UPDATE \
              leave_days=values(leave_days),leave_salary_amount=values(leave_salary_amount),\
              airticket_amount=values(airticket_amount),balance_leave_days=values(balance_leave_days),\
              balance_leave_salary_amount=values(balance_leave_salary_amount),\
              balance_airticket_amount=values(balance_airticket_amount),airfare_months=values(airfare_months);",
            values: input,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            printQuery: false
          })
          .then(finalResult => {
            _mysql.releaseConnection();
            req.records = finalResult;
            next();
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: `Please Provide valid input `
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  //created by irfan:
  uploadEmployeeLeaveBalance: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const rawdata = req.body;

      let strQuery = "";
      rawdata.forEach(item => {
        let x;
        for (x in item) {
          if (x > 0 && item[x] != "N") {
            strQuery += `update hims_f_employee_monthly_leave set close_balance=${item[x]} where year=${item.year} and leave_id=${x} and employee_id=${item.employee_id};\n `;
          }
        }
      });

      if (strQuery == "") {
        req.records = {
          invalid_input: true,
          message: `Please Provide valid input `
        };
        next();
      } else {
        _mysql
          .executeQuery({
            query: strQuery,
            printQuery: false
          })
          .then(finalResult => {
            _mysql.releaseConnection();
            req.records = finalResult[0];
            next();
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      next(e);
    }
  }
};
