import algaehMysql from "algaeh-mysql";
import _ from "lodash";

export default {
  getEncashmentToProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _EncashDetails = req.query;

    /* Select statemwnt  */
    _mysql
      .executeQuery({
        query:
          "select hims_f_employee_monthly_leave_id,leave_id,ML.employee_id,`year`,close_balance,\
            leaEncash.earnings_id, leaEncash.percent, empEarn.amount, lea.leave_description,  \
            sum( ((empEarn.amount *12/365)*(leaEncash.percent/100))*close_balance) as leave_amount , \
            close_balance as leave_days from hims_f_employee_monthly_leave ML, hims_d_leave lea, \
            hims_d_leave_encashment leaEncash, hims_d_employee_earnings empEarn where ML.employee_id=? and \
            `year`=? and ML.leave_id = lea.hims_d_leave_id and lea.leave_encash='Y' and \
            ML.leave_id = leaEncash.leave_header_id and leaEncash.earnings_id = empEarn.earnings_id and \
            empEarn.employee_id=ML.employee_id group by leave_id ;",
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
        _mysql.releaseConnection();
        next(e);
      });
  },

  getEncashmentToProcess_new: (req, res, next) => {
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
                "select leave_id,leave_days, leave_amount, airfare_amount, airfare_months, total_amount, close_balance,\
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
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql
            .executeQuery({
              query:
                "select hims_f_employee_monthly_leave_id,leave_id,ML.employee_id,`year`,close_balance,\
                leaEncash.earnings_id, leaEncash.percent, empEarn.amount, lea.leave_description,  \
                sum( ((empEarn.amount *12/365)*(leaEncash.percent/100))*close_balance) as leave_amount , \
                close_balance as leave_days from hims_f_employee_monthly_leave ML, hims_d_leave lea, \
                hims_d_leave_encashment leaEncash, hims_d_employee_earnings empEarn where ML.employee_id=149 and \
                `year`=2019 and ML.leave_id = lea.hims_d_leave_id and lea.leave_encash='Y' and \
                ML.leave_id = leaEncash.leave_header_id and leaEncash.earnings_id = empEarn.earnings_id and \
                empEarn.employee_id=ML.employee_id group by leave_id ;",
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
              _mysql.releaseConnection();
              next(e);
            });
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  getLeaveEncashLevels: (req, res, next) => {
    try {
      // let userPrivilege = req.userIdentity.leave_authorize_privilege;
      let userPrivilege = req.query.leave_encash_level;
      console.log("userPrivilege", userPrivilege);
      let auth_levels = [];
      switch (userPrivilege) {
        case "1":
          auth_levels.push({ name: "Level 1", value: 1 });
          break;
        case "2":
          auth_levels.push(
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
          hospital_id: req.userIdentity.hospital_id
        }
      })
      .then(generatedNumbers => {
        encashment_number = generatedNumbers[0];
        let encashDetail = inputParam.encashDetail;
        let strQuery = "";

        for (let i = 0; i < encashDetail.length; i++) {
          let close_balance =
            parseFloat(encashDetail[i].close_balance) -
            parseFloat(encashDetail[i].leave_days);
          strQuery += _mysql.mysqlQueryFormat(
            "UPDATE hims_f_employee_monthly_leave set close_balance=? where  hims_f_employee_monthly_leave_id=?;",
            [close_balance, encashDetail[i].hims_f_employee_monthly_leave_id]
          );
        }
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_leave_encash_header` (encashment_number, employee_id, encashment_date,\
                year, total_amount, authorized1, authorized2, authorized,hospital_id)\
          VALUE(?,?,?,?,?,?,?,?,?); " +
              strQuery,
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
            ],
            printQuery: true
          })
          .then(result => {
            let inserted_encash = result[0];
            _mysql
              .executeQuery({
                query: "INSERT INTO hims_f_leave_encash_detail(??) VALUES ?; ",
                values: inputParam.encashDetail,
                includeValues: [
                  "leave_id",
                  "close_balance",
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
  },

  getLeaveEncash: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let leaveEncash_header = [];

    let _stringData =
      inputParam.authorized1 != null ? " and authorized1=? " : "";
    _stringData += inputParam.authorized2 != null ? " and authorized2=? " : "";

    _stringData += inputParam.employee_id != null ? " and employee_id=? " : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select hims_f_leave_encash_header_id,encashment_number, employee_id, encashment_date, year, total_amount,\
          emp.employee_code, emp.full_name, authorized, D.designation from hims_f_leave_encash_header EH \
          inner join hims_d_employee emp on EH.employee_id = emp.hims_d_employee_id \
          inner join hims_d_designation D on D.hims_d_designation_id = emp.employee_designation_id \
          where EH.hospital_id = ? and date(encashment_date) between date(?) and date(?) and authorized=?" +
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
              _mysql.rollBackTransaction(() => {
                next(e);
              });
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
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },
  UpdateLeaveEncash: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };

    let strQuery = "";
    let values = [];

    if (inputParam.auth_level == "1") {
      if (inputParam.leave_encash_level === "1") {
        strQuery =
          "UPDATE hims_f_leave_encash_header SET authorized1 = ?,authorized1_by=?,authorized1_date=?, authorized=? \
          where hims_f_leave_encash_header_id=?";

        values.push(
          inputParam.authorized,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.authorized,
          inputParam.hims_f_leave_encash_header_id
        );
      } else {
        strQuery =
          "UPDATE hims_f_leave_encash_header SET authorized1 = ?,authorized1_by=?,authorized1_date=? \
          where hims_f_leave_encash_header_id=?";

        values.push(
          inputParam.authorized,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.hims_f_leave_encash_header_id
        );
      }
    } else if (inputParam.auth_level == "2") {
      strQuery =
        "UPDATE hims_f_leave_encash_header SET authorized2 = ?,authorized2_by=?,authorized2_date=?, authorized=? \
        where hims_f_leave_encash_header_id=?";

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
        _mysql.releaseConnection();
        next(e);
      });
  },

  calculateEncashmentAmount: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _EncashDetails = req.query;

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select hims_f_employee_monthly_leave_id,leave_id,ML.employee_id,`year`,close_balance,\
            leaEncash.earnings_id, leaEncash.percent, empEarn.amount, lea.leave_description,  \
            sum( ((empEarn.amount *12/365)*(leaEncash.percent/100))* ?) as leave_amount , \
            ? as leave_days from hims_f_employee_monthly_leave ML, hims_d_leave lea, \
            hims_d_leave_encashment leaEncash, hims_d_employee_earnings empEarn where ML.employee_id=? and \
            `year`=? and ML.leave_id = lea.hims_d_leave_id and lea.leave_encash='Y' and \
            ML.leave_id = leaEncash.leave_header_id and leaEncash.earnings_id = empEarn.earnings_id and \
            empEarn.employee_id=ML.employee_id group by leave_id ;",
        values: [
          _EncashDetails.leave_days,
          _EncashDetails.leave_days,
          _EncashDetails.employee_id,
          _EncashDetails.year
        ],
        printQuery: true
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
        _mysql.releaseConnection();
        next(e);
      });
  }
};
