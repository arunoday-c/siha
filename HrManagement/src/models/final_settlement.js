import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";

export default {
  finalSettlement: (req, res, next) => {
    const _input = req.query;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_final_settlement_header_id,total_amount,total_earnings,total_deductions,total_loans as total_loan_amount,\
              total_salary, case  total_leave_encash when 0 or total_leave_encash is null then \
              (select total_amount from hims_f_leave_encash_header where employee_id=?) else  total_leave_encash end as total_leave_encash_amount,\
                CASE total_eos when 0 or total_eos is null then (select  COALESCE(payable_amount,0)  from hims_f_end_of_service where employee_id=?) \
              else total_eos end  as gratuity_amount,\
              forfiet,remarks,final_settlement_status,COALESCE(end_of_service_id,(select hims_f_end_of_service_id from hims_f_end_of_service where employee_id=?)) as end_of_service_id, \
                COALESCE(leave_encashment_id,(select hims_f_leave_encash_header_id from hims_f_leave_encash_header where employee_id=?)) as hims_f_leave_encash_header_id FROM hims_f_final_settlement_header where employee_id=?; \
              select salary_type,hims_f_salary_id,COALESCE(net_salary,0)total_salary from hims_f_salary where employee_id=? and salary_type='FS'; \
              select  E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status,\
              E.employee_code,E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
              E.sub_department_id,E.employee_designation_id,E.date_of_birth,SD.sub_department_name,\
              SD.arabic_sub_department_name from hims_d_employee E \
              Left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id \
              left join hims_d_title T on T.his_d_title_id = E.title_id \
              where E.hims_d_employee_id=?",
          values: [
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
            _input.employee_id,
          ],
          printQuery: true,
        })
        .then((headerresult) => {
          const _header = headerresult[0];
          const _employee = headerresult[1];
          const emp = headerresult[2];
          [2];
          // utilities.logger().log("_header: ", _header);
          if (_header.length === 0) {
            // const previusMonthYear = moment()
            //   .add(-1, "months")
            //   .format("MM-YYYY")
            //   .split("-");
            // const prevMonth = previusMonthYear[0];
            // const prevYear = previusMonthYear[1];
            _mysql
              .executeQuery({
                query:
                  "select employee_id,loan_id,application_reason,hims_f_loan_application_id,approved_amount, \
                  loan_amount, installment_amount,pending_loan,loan_tenure,start_month,start_year, \
                  loan_application_date,L.loan_description from hims_f_loan_application, hims_d_loan L \
                  where loan_authorized = 'IS' and loan_closed='N' and pending_loan >0 and employee_id=? \
                  and L.hims_d_loan_id=hims_f_loan_application.loan_id; \
                  select gratuity_in_final_settle from hims_d_end_of_service_options;\
                  select hims_f_salary_id, COALESCE(net_salary,0)total_salary from hims_f_salary where employee_id=? \
                  and salary_type ='FS'; \
                  SELECT hims_f_leave_encash_header_id, sum(total_amount)total_leave_amount FROM hims_f_leave_encash_header \
                  where employee_id =? and authorized='APR' group by hims_f_leave_encash_header_id; \
                  select  E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status,\
                  E.employee_code,E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
                  E.sub_department_id,E.employee_designation_id,E.date_of_birth,SD.sub_department_name,\
                  SD.arabic_sub_department_name from hims_d_employee E \
                  Left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id \
                  left join hims_d_title T on T.his_d_title_id = E.title_id \
                  where E.hims_d_employee_id=? ",
                values: [
                  _input.employee_id,
                  _input.employee_id,
                  _input.employee_id,
                  _input.employee_id,
                ],
              })
              .then((result) => {
                const _loanList = result[0];

                const _options = result[1];
                // utilities.logger().log("_options Y: ", _options);
                const _total_salary_amount =
                  result[2].length === 0 ? 0 : result[2][0]["total_salary"];
                const _hims_f_salary_id =
                  result[2].length === 0
                    ? null
                    : result[2][0]["hims_f_salary_id"];
                const _total_leave_encash =
                  result[3].length === 0
                    ? 0
                    : result[3][0]["total_leave_amount"];
                const _hims_f_leave_encash_header_id =
                  result[3].length === 0
                    ? null
                    : result[3][0]["hims_f_leave_encash_header_id"];
                endOfServiceDicession({
                  result: _options[0],
                  employee_id: _input.employee_id,
                  mysql: _mysql,
                })
                  .then((data) => {
                    // utilities.logger().log("data Y: ", data);
                    const _total_loan_amount =
                      _loanList.length > 0
                        ? _.chain(_loanList).sumBy((s) =>
                            parseFloat(s.pending_loan)
                          )
                        : 0;
                    let _gratuity = 0;
                    let _hims_f_end_of_service_id = null;
                    if (data !== null && data.length > 0) {
                      // utilities.logger().log("data: ", data);
                      _gratuity =
                        data.length === 0
                          ? 0
                          : data[0].calculated_gratutity_amount;
                      _hims_f_end_of_service_id =
                        data.length === 0
                          ? null
                          : data[0].hims_f_end_of_service_id;
                    }
                    req.records = {
                      ..._.first(result[4], 0),
                      employee_status: _.first(emp, 0)["employee_status"],
                      loans: _loanList,
                      total_loan_amount: _total_loan_amount,
                      hims_f_salary_id: _hims_f_salary_id,
                      hims_f_leave_encash_header_id: _hims_f_leave_encash_header_id,
                      hims_f_end_of_service_id: _hims_f_end_of_service_id,
                      gratuity_amount: _gratuity,
                      total_salary: _total_salary_amount,
                      total_leave_encash_amount: _total_leave_encash,
                    };
                    next();
                  })
                  .catch((e) => {
                    _mysql.releaseConnection();
                    next(e);
                  });
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql
              .executeQuery({
                query:
                  "select L.hims_f_final_settle_loan_details_id, M.loan_description,L.balance_amount as pending_loan \
                  from hims_f_final_settle_loan_details as L inner join hims_f_loan_application as A on L.loan_application_id =A.hims_f_loan_application_id \
                  inner join hims_d_loan as M on M.hims_d_loan_id =A.loan_id \
                  where L.final_settlement_header_id=?; \
                  SELECT hims_f_final_settle_earnings_detail_id,earnings_id, D.earning_deduction_description as earning_name, amount \
                  FROM hims_f_final_settle_earnings_detail ,hims_d_earning_deduction D \
                  where D.hims_d_earning_deduction_id = hims_f_final_settle_earnings_detail.earnings_id and \
                  final_settlement_header=?; \
                  SELECT hims_f_final_settle_deductions_detail_id,D.earning_deduction_description as deduction_name,amount,deductions_id FROM \
                  hims_f_final_settle_deductions_detail, hims_d_earning_deduction D where \
                  D.hims_d_earning_deduction_id = hims_f_final_settle_deductions_detail.deductions_id and \
                  final_settlement_header_id=?;",
                values: [
                  _header[0]["hims_f_final_settlement_header_id"],
                  _header[0]["hims_f_final_settlement_header_id"],
                  _header[0]["hims_f_final_settlement_header_id"],
                ],
                printQuery: true,
              })
              .then((details) => {
                _mysql.releaseConnection();

                req.records = {
                  flag:
                    _header[0]["final_settlement_status"] === "PEN"
                      ? "Pending"
                      : _header[0]["final_settlement_status"] === "AUT"
                      ? "Authorize"
                      : _header[0]["final_settlement_status"] === "SET"
                      ? "Settled"
                      : "",
                  // flag: "Settled",
                  remarks: _header[0]["remarks"],
                  data: {
                    hims_f_final_settlement_header_id:
                      _header[0]["hims_f_final_settlement_header_id"],
                    hims_d_employee_id: _input.employee_id,
                    ..._.first(_header, 0),
                    ..._.first(_employee, 0),
                    employee_status: _.first(emp, 0)["employee_status"],
                  },
                  isEnable: true,
                  // _header[0]["final_settlement_status"] === "SET" ||
                  // _header[0]["final_settlement_status"] === "AUT"
                  //   ? false
                  //   : true,
                  disableSave:
                    _header[0]["final_settlement_status"] === "SET" ||
                    _header[0]["final_settlement_status"] === "AUT"
                      ? true
                      : false,
                  loans: details[0],
                  earningList: details[1],
                  deductingList: details[2],
                };

                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //Functionality changed as per discussion on 08-07-2020
  finalSettlemntAdd_depricated: (req, res, next) => {
    const _input = req.body;
    const _mysql = new algaehMysql();
    const utlities = new algaehUtilities();
    try {
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["FINAL_SETTLEMENT"],
          table_name: "hims_f_hrpayroll_numgen",
        })
        .then((generatedNumbers) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };

          _mysql
            .executeQuery({
              query:
                "insert into hims_f_final_settlement_header(`final_settlement_number`,`employee_id`,\
              `settled_date`,`final_settlement_status`,`total_amount`,`total_earnings`,`total_deductions`,\
              `total_loans`,`salary_id`,`total_salary`,`end_of_service_id`,`total_eos`,`leave_encashment_id`,\
              `total_leave_encash`,`employee_status`,`forfiet`,`remarks`,`created_by`,`created_date`,`updated_date`,\
              `updated_by`,`posted`,`posted_date`,`posted_by`,`cancelled`,`cancelled_by`,`cancelled_date`,hospital_id) values(?,?,?,?,\
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                generatedNumbers.FINAL_SETTLEMENT,
                _input.employee_id,
                new Date(),
                "AUT",
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
                _input.cancelled === "Y" ? new Date() : null,
                req.userIdentity.hospital_id,
              ],
            })
            .then((header_result) => {
              req.body.final_settlement = generatedNumbers.FINAL_SETTLEMENT;
              req.body.hims_f_final_settlement_header_id =
                header_result.insertId;

              let query = "";
              for (let i = 0; i < _input.loans.length; i++) {
                query += _mysql.mysqlQueryFormat(
                  "insert into hims_f_final_settle_loan_details(`final_settlement_header_id`,\
                `loan_application_id`,`balance_amount`) values(?,?,?);",
                  [
                    header_result.insertId,
                    _input.loans[i].hims_f_loan_application_id,
                    _input.loans[i].pending_loan,
                  ]
                );

                query += _mysql.mysqlQueryFormat(
                  "update hims_f_loan_application set loan_closed=? where hims_f_loan_application_id=?;",
                  ["Y", _input.loans[i].hims_f_loan_application_id]
                );
              }
              for (let e = 0; e < _input.earnings.length; e++) {
                query += _mysql.mysqlQueryFormat(
                  "insert into hims_f_final_settle_earnings_detail(`final_settlement_header`,\
                  `earnings_id`,`amount`) values(?,?,?);",
                  [
                    header_result.insertId,
                    _input.earnings[e].earnings_id,
                    _input.earnings[e].amount,
                  ]
                );
              }
              for (let d = 0; d < _input.deductions.length; d++) {
                query += _mysql.mysqlQueryFormat(
                  "insert into hims_f_final_settle_deductions_detail(`final_settlement_header_id`,\
                  `deductions_id`,`amount`) values(?,?,?);",
                  [
                    header_result.insertId,
                    _input.deductions[d].deductions_id,
                    _input.deductions[d].amount,
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
                ["Y", _input.employee_id]
              );
              query += _mysql.mysqlQueryFormat(
                "update hims_f_salary set salary_settled=?, final_settlement_id=? where hims_f_salary_id=?;",
                [
                  "Y",
                  req.body.hims_f_final_settlement_header_id,
                  _input.hims_f_salary_id,
                ]
              );

              if (_input.hims_f_end_of_service_id != null) {
                query += _mysql.mysqlQueryFormat(
                  "update hims_f_end_of_service set settled=? where hims_f_end_of_service_id=?",
                  ["Y", _input.hims_f_end_of_service_id]
                );
              }

              _mysql
                .executeQuery({
                  query: query,
                })
                .then((rest) => {
                  req.records = rest;
                  next();
                })
                .catch((e) => {
                  console.log("REsult", e);
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  },
  finalSettlemntAdd: (req, res, next) => {
    const _input = req.body;
    const _mysql = new algaehMysql();
    const { algaeh_d_app_user_id, hospital_id } = req.userIdentity;
    const utlities = new algaehUtilities();
    try {
      const {
        hims_f_final_settlement_header_id,
        loans,
        earnings,
        deductions,
      } = _input;
      _mysql
        .executeQueryWithTransaction({
          query: `update hims_f_final_settlement_header set total_amount=?,total_earnings=?,
      total_deductions=?,total_loans=?,total_salary=?,remarks=?,updated_by=?,updated_date=?,
      final_settlement_status=?,posted=?,posted_date=?,posted_by=?,employee_status=?
      where hims_f_final_settlement_header_id=?;`,
          values: [
            _input.total_amount,
            _input.total_earnings,
            _input.total_deductions,
            _input.total_loans,
            _input.total_salary,
            _input.remarks,
            algaeh_d_app_user_id,
            new Date(),
            "AUT",
            "Y",
            new Date(),
            algaeh_d_app_user_id,
            _input.employee_status,
            hims_f_final_settlement_header_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };

          let insertQuery = "";
          let updateQuery = "";
          let query = "";
          if (Array.isArray(loans)) {
            for (let i = 0; i < loans.length; i++) {
              const item = loans[i];
              if (item.hims_f_final_settle_loan_details_id === undefined) {
                insertQuery += _mysql.mysqlQueryFormat(
                  "insert into hims_f_final_settle_loan_details(`final_settlement_header_id`,\
            `loan_application_id`,`balance_amount`) values(?,?,?);",
                  [
                    hims_f_final_settlement_header_id,
                    item.hims_f_loan_application_id,
                    item.pending_loan,
                  ]
                );
              } else {
                updateQuery += _mysql.mysqlQueryFormat(
                  `update hims_f_final_settle_loan_details set balance_amount=?,loan_application_id=?
             where hims_f_final_settle_loan_details_id=?;`,
                  [
                    item.pending_loan,
                    item.hims_f_loan_application_id,
                    item.hims_f_final_settle_loan_details_id,
                  ]
                );
              }
              query += _mysql.mysqlQueryFormat(
                "update hims_f_loan_application set loan_closed=? where hims_f_loan_application_id=?;",
                ["Y", item.hims_f_loan_application_id]
              );
            }
          }
          if (Array.isArray(earnings)) {
            for (let e = 0; e < earnings.length; e++) {
              const item = earnings[e];
              if (item.hims_f_final_settle_earnings_detail_id === undefined) {
                insertQuery += _mysql.mysqlQueryFormat(
                  "insert into hims_f_final_settle_earnings_detail(`final_settlement_header`,\
          `earnings_id`,`amount`) values(?,?,?);",
                  [
                    hims_f_final_settlement_header_id,
                    item.earnings_id,
                    item.amount,
                  ]
                );
              } else {
                updateQuery += _mysql.mysqlQueryFormat(
                  `update hims_f_final_settle_earnings_detail set amount=?,
          earnings_id=? where hims_f_final_settle_earnings_detail_id=?;`,
                  [
                    item.amount,
                    item.earnings_id,
                    item.hims_f_final_settle_earnings_detail_id,
                  ]
                );
              }
            }
          }

          if (Array.isArray(deductions)) {
            for (let d = 0; d < deductions.length; d++) {
              const item = deductions[d];
              if (item.hims_f_final_settle_deductions_detail_id === undefined) {
                insertQuery += _mysql.mysqlQueryFormat(
                  "insert into hims_f_final_settle_deductions_detail(`final_settlement_header_id`,\
              `deductions_id`,`amount`) values(?,?,?);",
                  [
                    hims_f_final_settlement_header_id,
                    item.deductions_id,
                    item.amount,
                  ]
                );
              } else {
                updateQuery += _mysql.mysqlQueryFormat(
                  `update hims_f_final_settle_deductions_detail set amount=?,deductions_id=? where hims_f_final_settle_deductions_detail_id=?;`,
                  [
                    item.amount,
                    item.deductions_id,
                    item.hims_f_final_settle_deductions_detail_id,
                  ]
                );
              }
            }
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
          console.log("_input", _input);
          query += _mysql.mysqlQueryFormat(
            "update hims_d_employee set settled=? where hims_d_employee_id=?;\
            update hims_f_salary set salary_settled=?, final_settlement_id=? where hims_f_salary_id=?;",
            [
              "Y",
              _input.employee_id,
              "Y",
              _input.hims_f_final_settlement_header_id,
              _input.hims_f_salary_id,
            ]
          );

          if (_input.hims_f_end_of_service_id != null) {
            query += _mysql.mysqlQueryFormat(
              "update hims_f_end_of_service set settled=? where hims_f_end_of_service_id=?;",
              ["Y", _input.hims_f_end_of_service_id]
            );
          }

          _mysql
            .executeQuery({
              query: `${insertQuery}${updateQuery}${query}`,
              printQuery: true,
            })
            .then((rest) => {
              req.records = rest;
              next();
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  },
  finalSettlementSave: (req, res, next) => {
    const _input = req.body;
    const { algaeh_d_app_user_id, hospital_id } = req.userIdentity;
    const _mysql = new algaehMysql();
    try {
      const {
        hims_f_final_settlement_header_id,
        loans,
        earnings,
        deductions,
      } = _input;

      if (
        hims_f_final_settlement_header_id === undefined ||
        hims_f_final_settlement_header_id === null
      ) {
        _mysql
          .generateRunningNumber({
            user_id: algaeh_d_app_user_id,
            numgen_codes: ["FINAL_SETTLEMENT"],
            table_name: "hims_f_hrpayroll_numgen",
          })
          .then((generatedNumbers) => {
            _mysql
              .executeQuery({
                query:
                  "insert into hims_f_final_settlement_header(`final_settlement_number`,`employee_id`,\
            `settled_date`,`final_settlement_status`,`total_amount`,`total_earnings`,`total_deductions`,\
            `total_loans`,`salary_id`,`total_salary`,`end_of_service_id`,`total_eos`,`leave_encashment_id`,\
            `total_leave_encash`,`employee_status`,`forfiet`,`remarks`,`created_by`,`created_date`,`updated_date`,\
            `updated_by`,`posted`,`posted_date`,`posted_by`,`cancelled`,`cancelled_by`,`cancelled_date`,hospital_id) values(?,?,?,?,\
              ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                values: [
                  generatedNumbers.FINAL_SETTLEMENT,
                  _input.employee_id,
                  new Date(),
                  "PEN",
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
                  algaeh_d_app_user_id,
                  new Date(),
                  new Date(),
                  algaeh_d_app_user_id,
                  "N",
                  null,
                  null,
                  "N",
                  null,
                  null,
                  hospital_id,
                ],
                printQuery: true,
              })
              .then((header_result) => {
                req.body.final_settlement = generatedNumbers.FINAL_SETTLEMENT;
                req.body.hims_f_final_settlement_header_id =
                  header_result.insertId;
                let query = "";
                if (Array.isArray(loans)) {
                  for (let i = 0; i < loans.length; i++) {
                    query += _mysql.mysqlQueryFormat(
                      "insert into hims_f_final_settle_loan_details(`final_settlement_header_id`,\
                        `loan_application_id`,`balance_amount`) values(?,?,?);",
                      [
                        header_result.insertId,
                        loans[i].hims_f_loan_application_id,
                        loans[i].pending_loan,
                      ]
                    );
                  }
                }
                if (Array.isArray(earnings)) {
                  for (let e = 0; e < earnings.length; e++) {
                    query += _mysql.mysqlQueryFormat(
                      "insert into hims_f_final_settle_earnings_detail(`final_settlement_header`,\
            `earnings_id`,`amount`) values(?,?,?);",
                      [
                        header_result.insertId,
                        earnings[e].earnings_id,
                        earnings[e].amount,
                      ]
                    );
                  }
                }
                if (Array.isArray(deductions)) {
                  for (let d = 0; d < deductions.length; d++) {
                    query += _mysql.mysqlQueryFormat(
                      "insert into hims_f_final_settle_deductions_detail(`final_settlement_header_id`,\
            `deductions_id`,`amount`) values(?,?,?);",
                      [
                        header_result.insertId,
                        deductions[d].deductions_id,
                        deductions[d].amount,
                      ]
                    );
                  }
                }
                if (query === "") {
                  query = "select 1";
                }
                _mysql
                  .executeQuery({
                    query: query,
                    printQuery: true,
                  })
                  .then((rest) => {
                    _mysql.commitTransaction((error, result) => {
                      if (error) {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                        return;
                      }
                      req.records = rest;
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        _mysql
          .executeQueryWithTransaction({
            query: `update hims_f_final_settlement_header set total_amount=?,total_earnings=?,
          total_deductions=?,total_loans=?,total_salary=?,remarks=?,updated_by=?,updated_date=?,
          end_of_service_id=?,total_eos=?,leave_encashment_id=?,total_leave_encash=?,salary_id=?,
          employee_status=?
          where hims_f_final_settlement_header_id=?;`,
            values: [
              _input.total_amount,
              _input.total_earnings,
              _input.total_deductions,
              _input.total_loans,
              _input.total_salary,
              _input.remarks,
              algaeh_d_app_user_id,
              new Date(),
              _input.end_of_service_id,
              _input.gratuity_amount,
              _input.hims_f_leave_encash_header_id,
              _input.total_leave_encash_amount,
              _input.hims_f_salary_id,
              _input.employee_status,
              hims_f_final_settlement_header_id,
            ],
            printQuery: true,
          })
          .then((updated) => {
            let insertQuery = "";
            let updateQuery = "";
            if (loans !== null) {
              for (let i = 0; i < loans.length; i++) {
                const item = loans[i];
                if (item.hims_f_final_settle_loan_details_id === undefined) {
                  insertQuery += _mysql.mysqlQueryFormat(
                    "insert into hims_f_final_settle_loan_details(`final_settlement_header_id`,\
                  `loan_application_id`,`balance_amount`) values(?,?,?);",
                    [
                      hims_f_final_settlement_header_id,
                      item.hims_f_loan_application_id,
                      item.pending_loan,
                    ]
                  );
                } else {
                  updateQuery += _mysql.mysqlQueryFormat(
                    `update hims_f_final_settle_loan_details set balance_amount=?
                   where hims_f_final_settle_loan_details_id=?;`,
                    [
                      item.pending_loan,
                      item.hims_f_final_settle_loan_details_id,
                    ]
                  );
                }
              }
            }

            if (earnings !== null) {
              for (let e = 0; e < earnings.length; e++) {
                const item = earnings[e];

                if (item.hims_f_final_settle_earnings_detail_id === undefined) {
                  insertQuery += _mysql.mysqlQueryFormat(
                    "insert into hims_f_final_settle_earnings_detail(`final_settlement_header`,\
                `earnings_id`,`amount`) values(?,?,?);",
                    [
                      hims_f_final_settlement_header_id,
                      item.earnings_id,
                      item.amount,
                    ]
                  );
                } else {
                  updateQuery += _mysql.mysqlQueryFormat(
                    `update hims_f_final_settle_earnings_detail set amount=?,
                earnings_id=? where hims_f_final_settle_earnings_detail_id=?;`,
                    [
                      item.amount,
                      item.earnings_id,
                      item.hims_f_final_settle_earnings_detail_id,
                    ]
                  );
                }
              }
            }
            if (deductions !== null) {
              for (let d = 0; d < deductions.length; d++) {
                const item = deductions[d];
                if (
                  item.hims_f_final_settle_deductions_detail_id === undefined
                ) {
                  insertQuery += _mysql.mysqlQueryFormat(
                    "insert into hims_f_final_settle_deductions_detail(`final_settlement_header_id`,\
                    `deductions_id`,`amount`) values(?,?,?);",
                    [
                      hims_f_final_settlement_header_id,
                      item.deductions_id,
                      item.amount,
                    ]
                  );
                } else {
                  updateQuery += _mysql.mysqlQueryFormat(
                    `update hims_f_final_settle_deductions_detail set amount=?,deductions_id=? where hims_f_final_settle_deductions_detail_id=?;`,
                    [
                      item.amount,
                      item.deductions_id,
                      item.hims_f_final_settle_deductions_detail_id,
                    ]
                  );
                }
              }
            }
            if (insertQuery === "" && updateQuery === "") {
              insertQuery = "select 1;";
            }
            _mysql
              .executeQuery({
                query: `${insertQuery}${updateQuery}`,
                printQuery: true,
              })
              .then((executed) => {
                _mysql.commitTransaction((error, resu) => {
                  if (error) {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  } else {
                    req.records = executed;
                    next();
                  }
                });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = req.body;
      _mysql
        .executeQueryWithTransaction({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
        })
        .then((org_data) => {
          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {
            _mysql
              .executeQueryWithTransaction({
                query:
                  "select account, head_id, child_id from finance_accounts_maping \
              where account in ('SAL_PYBLS', 'LV_SAL_PYBL', 'GRAT_PYBL', 'FIN_STL_PYBL');",
              })
              .then((result) => {
                const salary_pay_acc = result.find(
                  (f) => f.account === "SAL_PYBLS"
                );
                const lv_salary_pay_acc = result.find(
                  (f) => f.account === "LV_SAL_PYBL"
                );
                const gratuity_pay_acc = result.find(
                  (f) => f.account === "GRAT_PYBL"
                );
                const final_settle_pay_acc = result.find(
                  (f) => f.account === "FIN_STL_PYBL"
                );

                _mysql
                  .executeQueryWithTransaction({
                    query: `SELECT hims_f_final_settlement_header_id, final_settlement_number, total_salary, total_amount, total_eos, 
                        total_leave_encash, employee_code, full_name, E.hospital_id, E.sub_department_id FROM hims_f_final_settlement_header SH
                        inner join hims_d_employee E on E.hims_d_employee_id = SH.employee_id 
                        where hims_f_final_settlement_header_id=?;
                        select hims_f_final_settlement_header_id, curDate() payment_date,SE.amount as debit_amount, 
                        ED.head_id, ED.child_id, 'DR' as payment_type, 0 as credit_amount, S.hospital_id, E.sub_department_id
                        from hims_f_final_settlement_header s 
                        left join hims_f_final_settle_earnings_detail SE on SE.final_settlement_header = S.hims_f_final_settlement_header_id
                        inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SE.earnings_id 
                        inner join hims_d_employee E on E.hims_d_employee_id = SH.employee_id 
                        where hims_f_final_settlement_header_id=?;
                        select hims_f_final_settlement_header_id, curDate() payment_date, SD.amount as credit_amount, 
                        ED.head_id, ED.child_id, 'CR' as payment_type, 0 as debit_amount ,S.hospital_id, E.sub_department_id
                        from hims_f_final_settlement_header s 
                        left join hims_f_final_settle_deductions_detail SD on SD.final_settlement_header_id = S.hims_f_final_settlement_header_id 
                        inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SD.deductions_id
                        inner join hims_d_employee E on E.hims_d_employee_id = SH.employee_id 
                        where hims_f_final_settlement_header_id=?;
                        select hims_f_final_settlement_header_id, curDate() payment_date, 
                        SL.balance_amount as credit_amount, L.head_id, L.child_id, 'CR' as payment_type, 
                        0 as debit_amount,S.hospital_id, E.sub_department_id from hims_f_final_settlement_header s 
                        left join hims_f_final_settle_loan_details SL on SL.final_settlement_header_id = S.hims_f_final_settlement_header_id
                        left join hims_f_loan_application LA on LA.hims_f_loan_application_id = SL.loan_application_id
                        inner join hims_d_loan L on L.hims_d_loan_id = LA.loan_id 
                        inner join hims_d_employee E on E.hims_d_employee_id = SH.employee_id 
                        where hims_f_final_settlement_header_id = ?;`,
                    values: [
                      inputParam.hims_f_final_settlement_header_id,
                      inputParam.hims_f_final_settlement_header_id,
                      inputParam.hims_f_final_settlement_header_id,
                      inputParam.hims_f_final_settlement_header_id,
                    ],
                    printQuery: true,
                  })
                  .then((headerResult) => {
                    const final_settlement_data = headerResult[0];
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO finance_day_end_header (transaction_date, amount, \
                    voucher_type, document_id, document_number, from_screen, \
                    narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?)",
                        values: [
                          new Date(),
                          final_settlement_data[0].total_amount,
                          "payment",
                          final_settlement_data[0]
                            .hims_f_final_settlement_header_id,
                          final_settlement_data[0].final_settlement_number,
                          inputParam.ScreenCode,
                          "Final Settlement Process for " +
                            final_settlement_data[0].employee_code +
                            "/" +
                            final_settlement_data[0].full_name,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                        ],
                        printQuery: true,
                      })
                      .then((day_end_header) => {
                        const insertSubDetail = [];
                        //Earning, Deduction and loan and Salary Payable Laibility Account
                        insertSubDetail.push(
                          ...headerResult[1], //Earnings
                          ...headerResult[2], //Deductions
                          ...headerResult[3], //Loan
                          {
                            //Salary Payable Laibility Account
                            payment_date: new Date(),
                            head_id: salary_pay_acc.head_id,
                            child_id: salary_pay_acc.child_id,
                            debit_amount: final_settlement_data[0].total_salary,
                            payment_type: "DR",
                            credit_amount: 0,
                            hospital_id: final_settlement_data[0].hospital_id,
                            sub_department_id:
                              final_settlement_data[0].sub_department_id,
                          }
                        );

                        if (
                          parseFloat(final_settlement_data[0].total_eos) > 0
                        ) {
                          //Gratuity
                          insertSubDetail.push({
                            payment_date: new Date(),
                            head_id: gratuity_pay_acc.head_id,
                            child_id: gratuity_pay_acc.child_id,
                            debit_amount: final_settlement_data[0].total_eos,
                            payment_type: "DR",
                            credit_amount: 0,
                            hospital_id: final_settlement_data[0].hospital_id,
                            sub_department_id:
                              final_settlement_data[0].sub_department_id,
                          });
                        }
                        if (
                          parseFloat(
                            final_settlement_data[0].total_leave_encash
                          ) > 0
                        ) {
                          //Encashment
                          insertSubDetail.push({
                            payment_date: new Date(),
                            head_id: lv_salary_pay_acc.head_id,
                            child_id: lv_salary_pay_acc.child_id,
                            debit_amount:
                              final_settlement_data[0].total_leave_encash,
                            payment_type: "DR",
                            credit_amount: 0,
                            hospital_id: final_settlement_data[0].hospital_id,
                            sub_department_id:
                              final_settlement_data[0].sub_department_id,
                          });
                        }

                        if (
                          parseFloat(final_settlement_data[0].total_amount) > 0
                        ) {
                          //Final Settlement account
                          insertSubDetail.push({
                            payment_date: new Date(),
                            head_id: final_settle_pay_acc.head_id,
                            child_id: final_settle_pay_acc.child_id,
                            debit_amount: 0,
                            payment_type: "CR",
                            credit_amount:
                              final_settlement_data[0].total_amount,
                            hospital_id: final_settlement_data[0].hospital_id,
                            sub_department_id:
                              final_settlement_data[0].sub_department_id,
                          });
                        }

                        const IncludeValuess = [
                          "payment_date",
                          "head_id",
                          "child_id",
                          "debit_amount",
                          "payment_type",
                          "credit_amount",
                          "hospital_id",
                          "sub_department_id",
                        ];

                        const month = moment().format("M");
                        const year = moment().format("YYYY");

                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                            values: insertSubDetail,
                            includeValues: IncludeValuess,
                            bulkInsertOrUpdate: true,
                            extraValues: {
                              day_end_header_id: day_end_header.insertId,
                              year: year,
                              month: month,
                            },
                            printQuery: true,
                          })
                          .then((subResult) => {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              // req.records = subResult;
                              next();
                            });
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              // req.records = org_data;
              next();
            });
          }
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  deleteEarnings: (req, res, next) => {
    const {
      hims_f_final_settle_earnings_detail_id,
      hims_f_final_settlement_header_id,
    } = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: `select final_settlement_status from hims_f_final_settlement_header where hims_f_final_settlement_header_id=?`,
          values: [hims_f_final_settlement_header_id],
        })
        .then((result) => {
          const status = result[0]["final_settlement_status"];
          if (status === "PEN") {
            _mysql
              .executeQuery({
                query: `delete from hims_f_final_settle_earnings_detail where hims_f_final_settle_earnings_detail_id=?`,
                values: [hims_f_final_settle_earnings_detail_id],
              })
              .then((result) => {
                _mysql.releaseConnection();
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            next(new Error("Not able to delete"));
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  deleteDeductions: (req, res, next) => {
    const {
      hims_f_final_settle_deductions_detail_id,
      hims_f_final_settlement_header_id,
    } = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: `select final_settlement_status from hims_f_final_settlement_header where hims_f_final_settlement_header_id=?`,
          values: [hims_f_final_settlement_header_id],
        })
        .then((result) => {
          const status = result[0]["final_settlement_status"];
          if (status === "PEN") {
            _mysql
              .executeQuery({
                query: `delete from hims_f_final_settle_deductions_detail where hims_f_final_settle_deductions_detail_id=?`,
                values: [hims_f_final_settle_deductions_detail_id],
              })
              .then((result) => {
                _mysql.releaseConnection();
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            next(new Error("Not able to delete"));
          }
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
};
function endOfServiceDicession(options) {
  const _mysql = options.mysql;
  const utilities = new algaehUtilities();
  return new Promise((resolve, reject) => {
    try {
      utilities
        .logger()
        .log(
          "gratuity_in_final_settle : ",
          options.result.gratuity_in_final_settle
        );
      if (options.result.gratuity_in_final_settle == "Y") {
        _mysql
          .executeQuery({
            query:
              "select hims_f_end_of_service_id,end_of_service_number,calculated_gratutity_amount,payable_amount\
             from hims_f_end_of_service where employee_id=? and gratuity_status != 'PAI'",
            values: [options.employee_id],
            printQuery: true,
          })
          .then((endofServiceResult) => {
            resolve(endofServiceResult);
          })
          .catch((e) => {
            reject(e);
          });
      } else {
        resolve(null);
      }
    } catch (e) {
      next(e);
    }
  });
}
