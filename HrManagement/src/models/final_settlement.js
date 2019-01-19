import utlities from "algaeh-utilities";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
module.exports = {
  finalSettlement: (req, res, next) => {
    const _input = req.query;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select employee_id,loan_id,application_reason,hims_f_loan_application_id,approved_amount, loan_amount,\
            installment_amount,pending_loan,loan_tenure,start_month,start_year,loan_application_date,L.loan_description \
            from hims_f_loan_application,hims_d_loan L where loan_authorized = 'APR' and loan_closed='N' and loan_amount >0 \
            and employee_id=? and L.hims_d_loan_id=hims_f_loan_application.loan_id; \
            select gratuity_in_final_settle from hims_d_hrms_options;\
            select hims_f_salary_id, sum(net_salary)total_salary from hims_f_salary where employee_id=? \
            and salary_settled='N' and salary_paid='N' group by employee_id; \
            SELECT hims_f_leave_encash_header_id, sum(total_amount)total_leave_amount FROM hims_f_leave_encash_header \
            where employee_id =? and authorized='APR' group by employee_id; \
            select  E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status,\
E.employee_code,E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
  E.sub_department_id,E.employee_designation_id,E.date_of_birth,SD.sub_department_name,SD.arabic_sub_department_name \
  from hims_d_employee E Left join hims_d_sub_department SD \
 on SD.hims_d_sub_department_id = E.sub_department_id \
 left join hims_d_title T \
 on T.his_d_title_id = E.title_id \
 where E.hims_d_employee_id=? ",
          values: [
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
            _input.employee_id
          ]
        })
        .then(result => {
          const _loanList = result[0];
          const _options = result[1];
          const _total_salary_amount =
            result[2].length === 0 ? 0 : result[2][0]["total_salary"];
          const _hims_f_salary_id =
            result[2].length === 0 ? null : result[2][0]["hims_f_salary_id"];
          const _total_leave_encash =
            result[3].length === 0 ? 0 : result[3][0]["total_leave_amount"];
          const _hims_f_leave_encash_header_id =
            result[3].length === 0
              ? null
              : result[3][0]["hims_f_leave_encash_header_id"];
          endOfServiceDicession({
            result: _options[0],
            employee_id: _input.employee_id,
            mysql: _mysql
          })
            .then(data => {
              const _total_loan_amount = _.chain(_loanList).sumBy(
                s => s.pending_loan
              );
              let _gratuity = 0;
              let _hims_f_end_of_service_id = null;
              if (data !== null) {
                _gratuity =
                  data.length === 0 ? 0 : data[0].calculated_gratutity_amount;
                _hims_f_end_of_service_id =
                  data.length === 0 ? null : data[0].hims_f_end_of_service_id;
              }
              req.records = {
                ..._.first(result[4], 0),
                loans: _loanList,
                total_loan_amount: _total_loan_amount,
                hims_f_salary_id: _hims_f_salary_id,
                hims_f_leave_encash_header_id: _hims_f_leave_encash_header_id,
                hims_f_end_of_service_id: _hims_f_end_of_service_id,
                gratuity_amount: _gratuity,
                total_salary: _total_salary_amount,
                total_leave_encash_amount: _total_leave_encash
              };
              next();
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  finalSettlemntAdd: (req, res, next) => {
    const _input = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .generateRunningNumber({
          modules: ["FINAL_SETTLEMENT"]
        })
        .then(newNumber => {
          if (newNumber.length === 0) {
            _mysql.rollBackTransaction(() => {
              next(
                utlities
                  .AlgaehUtilities()
                  .httpStatus()
                  .generateError(
                    utlities.AlgaehUtilities().httpStatus().forbidden,
                    "Please add options for final settlement"
                  )
              );
              return;
            });
          }
          /*_input.total_amount = net total amout  ie net amount (net earnings + total deductions)
            _input.total_earnings = total earnings ie net earnings (total salary + grauitity + leave encashed + sum of earnings)
          */
          _mysql
            .executeQuery({
              query:
                "insert into hims_f_final_settlement_header(`final_settlement_number`,`employee_id`,\
              `settled_date`,`final_settlement_status`,`total_amount`,`total_earnings`,`total_deductions`,\
              `total_loans`,`salary_id`,`total_salary`,`end_of_service_id`,`total_eos`,`leave_encashment_id`,\
              `total_leave_encash`,`employee_status`,`forfiet`,`remarks`,`created_by`,`created_date`,`updated_date`,\
              `updated_by`,`posted`,`posted_date`,`posted_by`,`cancelled`,`cancelled_by`,`cancelled_date`)",
              values: [
                newNumber[0],
                _input.employee_id,
                new Date(),
                "SET",
                _input.total_amount,
                _input.total_earnings,
                _input.total_deductions,
                _input.total_loans,
                _input.hims_f_salary_id,
                _input.total_salary,
                _input.end_of_service_id,
                _input.gratuity_amount,
                _input.hims_f_leave_encash_header_id,
                _input.total_leave_encash_amount,
                _input.employee_status,
                _input.forfiet,
                _input.remarks,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                _input.posted,
                _input.posted === "Y" ? new Date() : null,
                _input.posted === "Y"
                  ? req.userIdentity.algaeh_d_app_user_id
                  : null,
                _input.cancelled,
                _input.cancelled === "Y"
                  ? req.userIdentity.algaeh_d_app_user_id
                  : null,
                _input.cancelled === "Y" ? new Date() : null
              ]
            })
            .then(header_result => {
              let query = "";
              for (let i = 0; i < _input.loans.length; i++) {
                query += _mysql.mysqlQueryFormat(
                  "nsert into hims_f_final_settle_loan_details(`final_settlement_header_id`,\
                `loan_application_id`,`balance_amount`) values(?);",
                  [
                    header_result.insertId,
                    _input.loans[i].hims_f_loan_application_id,
                    _input.loans[i].pending_loan
                  ]
                );

                query += _mysql.mysqlQueryFormat(
                  "update hims_f_loan_application set loan_closed=? where hims_f_loan_application_id=?;",
                  ["Y", hims_f_loan_application_id]
                );
              }
              for (let e = 0; e < _input.earnings.length; e++) {
                query += _mysql.mysqlQueryFormat(
                  "nsert into hims_f_final_settle_earnings_detail(`final_settlement_header`,\
                  `earnings_id`,`amount`) values(?);",
                  [
                    header_result.insertId,
                    _input.earnings[e].hims_f_loan_application_id,
                    _input.earnings[e].amount
                  ]
                );
              }
              for (let d = 0; d < _input.deductions.length; d++) {
                query += _mysql.mysqlQueryFormat(
                  "nsert into hims_f_final_settle_deductions_detail(`final_settlement_header_id`,\
                  `deductions_id`,`amount`) values(?);",
                  [
                    header_result.insertId,
                    _input.deductions[d].deductions_id,
                    _input.deductions[d].amount
                  ]
                );
              }
              if (
                _input.hims_f_leave_encash_header_id !== null &&
                _input.hims_f_leave_encash_header_id !== "" &&
                _input.hims_f_leave_encash_header_id !== 0
              ) {
                query += _mysql.mysqlQueryFormat(
                  "update hims_f_leave_encash_header set authorized=? where hims_f_leave_encash_header_id=?;",
                  ["SET", _input.hims_f_leave_encash_header_id]
                );
              }
              query += _mysql.mysqlQueryFormat(
                "update hims_d_employee set settled=? where hims_d_employee_id=?;",
                ["Y", _input.hims_d_employee_id]
              );
              query += _mysql.mysqlQueryFormat(
                "update hims_f_salary set salary_settled=? where hims_f_salary_id=?;",
                ["Y", _input.hims_f_salary_id]
              );
              if (_input.hims_f_end_of_service_id !== null) {
                query += _mysql.mysqlQueryFormat(
                  "update hims_f_end_of_service set settled=? where hims_f_end_of_service_id=?",
                  ["Y", _input.hims_f_end_of_service_id]
                );
              }

              _mysql
                .executeQuery({
                  query: query
                })
                .then(res => {
                  _mysql.commitTransaction((error, resu) => {
                    if (error) {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    } else {
                      req.records = res;
                      next();
                    }
                  });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  }
};
function endOfServiceDicession(options) {
  const _mysql = options.mysql;
  return new Promise((resolve, reject) => {
    if (options.result.gratuity_in_final_settle === "Y") {
      _mysql
        .executeQuery({
          query:
            "select hims_f_end_of_service_id,end_of_service_number,calculated_gratutity_amount,payable_amount\
             from hims_f_end_of_service where employee_id=? and gratuity_status != 'PAI'",
          values: [options.employee_id]
        })
        .then(endofServiceResult => {
          resolve(endofServiceResult);
        })
        .catch(e => {
          reject(e);
        });
    } else {
      resolve(null);
    }
  });
}
