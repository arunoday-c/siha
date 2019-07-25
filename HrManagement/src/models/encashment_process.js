import algaehMysql from "algaeh-mysql";
import _ from "lodash";

module.exports = {
  getEncashmentToProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _EncashDetails = req.query;

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select * from hims_f_leave_encash_header where employee_id=? and year=? ;",
        values: [_EncashDetails.employee_id, _EncashDetails.year],
        printQuery: true
      })
      .then(leave_Encash => {
        if (leave_Encash.length > 0) {
          let Leave_Encash_Header = leave_Encash;

          _mysql
            .executeQuery({
              query:
                "select leave_id,leave_days, leave_amount, airfare_amount, airfare_months, total_amount, \
                leavems.leave_description from hims_f_leave_encash_detail, hims_d_leave leavems where  \
                leavems.hims_d_leave_id = hims_f_leave_encash_detail.leave_id and leave_encash_header_id=?;",
              values: [leave_Encash[0].hims_f_leave_encash_header_id],
              printQuery: true
            })
            .then(result => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = [
                  {
                    Exists: true,
                    Leave_Encash_Header: Leave_Encash_Header,
                    Leave_Encash_Detail: result
                  }
                ];
                next();
              });
            })
            .catch(e => {
              next(e);
            });
        } else {
          _mysql
            .executeQuery({
              query:
                "select hims_f_employee_monthly_leave_id,leave_id,hims_f_employee_monthly_leave.employee_id,`year`,close_balance,encashment_leave, \
              leaEncash.earnings_id, leaEncash.percent, empEarn.amount,\
              CASE when close_balance < encashment_leave then sum( ((empEarn.amount *12/365)*(leaEncash.percent/100))*close_balance) else \
              sum(((empEarn.amount *12/365)*(leaEncash.percent/100))*encashment_leave)  end leave_amount , case when close_balance < encashment_leave then\
              close_balance else encashment_leave end leave_days from \
              hims_f_employee_monthly_leave, hims_d_leave lea, hims_d_leave_encashment leaEncash, hims_d_employee_earnings empEarn where \
              hims_f_employee_monthly_leave.employee_id=? and `year`=? and hims_f_employee_monthly_leave.leave_id = lea.hims_d_leave_id and lea.leave_encash='Y' and\
              hims_f_employee_monthly_leave.leave_id = leaEncash.leave_header_id and leaEncash.earnings_id = empEarn.earnings_id and \
              empEarn.employee_id=hims_f_employee_monthly_leave.employee_id group by leave_id ;",
              values: [_EncashDetails.employee_id, _EncashDetails.year]
              // printQuery: true
            })
            .then(monthlyLeaves => {
              _mysql.releaseConnection();

              req.records = monthlyLeaves.map(data => {
                return {
                  ...data,
                  total_amount: data.leave_amount
                };
              });

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

  getLeaveEncashLevels: (req, res, next) => {
    try {
      let userPrivilege = req.userIdentity.leave_authorize_privilege;

      let auth_levels = [];
      switch (userPrivilege) {
        case "AL1":
          auth_levels.push({ name: "Level 1", value: 1 });
          break;
        case "AL2":
          auth_levels.push(
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
        case "AL3":
          auth_levels.push(
            { name: "Level 3", value: 3 },
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
      }

      req.records = { auth_levels };
      next();
    } catch (e) {
      next(e);
    }
  },

  InsertLeaveEncashment: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };
    let encashment_number = "";

    _mysql
      .generateRunningNumber({
        modules: ["LEAVE_ENCASH"],
        tableName: "hims_f_app_numgen",
        identity: {
          algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
          hospital_id: req.userIdentity["x-branch"]
        }
      })
      .then(generatedNumbers => {
        encashment_number = generatedNumbers[0];
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_leave_encash_header` (encashment_number, employee_id, encashment_date,\
                year, total_amount, authorized1, authorized2, authorized,hospital_id)\
          VALUE(?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers[0],
              inputParam.employee_id,
              inputParam.encashment_date,
              inputParam.year,
              inputParam.total_amount,
              inputParam.authorized1,
              inputParam.authorized2,
              inputParam.authorized,
              req.userIdentity.hospital_id
            ]
          })
          .then(inserted_encash => {
            _mysql
              .executeQuery({
                query: "INSERT INTO hims_f_leave_encash_detail(??) VALUES ?",
                values: inputParam.encashDetail,
                includeValues: [
                  "leave_id",
                  "leave_days",
                  "leave_amount",
                  "total_amount"
                ],
                extraValues: {
                  leave_encash_header_id: inserted_encash.insertId
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(resultContribute => {
                let result = { encashment_number: encashment_number };
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = result;
                  next();
                });
              });
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(error => {
        next(error);
      });
  },

  getLeaveEncash: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let leaveEncash_header = [];

    let _stringData =
      inputParam.authorized1 != null ? " and authorized1=? " : "";
    _stringData += inputParam.authorized2 != null ? " and authorized2=? " : "";

    _stringData += inputParam.employee_id != null ? " and employee_id=? " : "";

    _stringData +=
      inputParam.hospital_id != null ? " and emp.hospital_id=? " : "";

    _stringData +=
      inputParam.sub_department_id != null
        ? " and emp.sub_department_id=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select hims_f_leave_encash_header_id,encashment_number, employee_id, encashment_date, year, total_amount,\
          emp.employee_code, emp.full_name from hims_f_leave_encash_header, hims_d_employee emp where \
          hims_f_leave_encash_header.employee_id = emp.hims_d_employee_id and `year` = ? " +
          _stringData,
        values: _.valuesIn(inputParam),
        printQuery: true
      })
      .then(leave_Encash => {
        if (leave_Encash.length > 0) {
          const Encash_header_id = leave_Encash.map(item => {
            return item.hims_f_leave_encash_header_id;
          });
          leaveEncash_header = leave_Encash;

          _mysql
            .executeQuery({
              query:
                "select * from hims_f_leave_encash_detail, hims_d_leave leavems where leave_encash_header_id in (?) \
                and leavems.hims_d_leave_id = hims_f_leave_encash_detail.leave_id;",
              values: [Encash_header_id],
              printQuery: true
            })
            .then(result => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = [
                  {
                    leaveEncash_header: leaveEncash_header,
                    leaveEncash_detail: result
                  }
                ];
                next();
              });
            })
            .catch(e => {
              next(e);
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = leaveEncash_header;
            next();
          });
        }
      })
      .catch(e => {
        next(e);
      });
  },
  UpdateLeaveEncash: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };

    let strQuery = "";
    let values = [];

    if (inputParam.auth_level == "1") {
      strQuery =
        "UPDATE hims_f_leave_encash_header SET authorized1 = ?,authorized1_by=?,authorized1_date=? where hims_f_leave_encash_header_id=?";

      values.push(
        inputParam.authorized,
        req.userIdentity.algaeh_d_app_user_id,
        new Date(),
        inputParam.hims_f_leave_encash_header_id
      );
    } else if (inputParam.auth_level == "2") {
      strQuery =
        "UPDATE hims_f_leave_encash_header SET authorized2 = ?,authorized2_by=?,authorized2_date=?, authorized=? where hims_f_leave_encash_header_id=?";

      values.push(
        inputParam.authorized,
        req.userIdentity.algaeh_d_app_user_id,
        new Date(),
        inputParam.authorized,
        inputParam.hims_f_leave_encash_header_id
      );
    }
    _mysql
      .executeQuery({
        query: strQuery,
        values: values,
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
  }
};
