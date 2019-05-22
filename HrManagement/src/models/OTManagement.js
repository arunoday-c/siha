import algaehMysql from "algaeh-mysql";
import _ from "lodash";
module.exports = {
  InsertOTManagement: (req, res, next) => {
    const _input = req.body;
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQueryWithTransaction({
          query:
            "insert into hims_f_overtime_header(`employee_id`,\
              `year`,`month`,`overtime_type`,`total_ot_hours`,`ot_hours`,\
              `weekof_ot_hours`,`holiday_ot_hours`,`status`,`overtime_payment_type`,`leave_id`,`comp_off_leaves`,\
              `created_by`,`created_date`,hospital_id) \
              values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            _input.employee_id,
            _input.year,
            _input.month,
            _input.overtime_type,
            _input.total_ot_hours,
            _input.ot_hours,
            _input.weekof_ot_hours,
            _input.holiday_ot_hours,
            _input.status,
            _input.overtime_payment_type,
            _input.leave_id,
            _input.comp_off_leaves,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.hospital_id
          ],
          printQuery: true
        })
        .then(header_result => {
          let query = "";
          for (let i = 0; i < _input.monthlyOverTime.length; i++) {
            query += _mysql.mysqlQueryFormat(
              "insert into hims_f_overtime_detail(`overtime_header_id`,\
                `overtime_date`,`from_time`,`to_time`,`overtime_hours`,`ot_hours`,`weekoff_ot_hours`,`holiday_ot_hours`) \
                values(?,?,?,?,?,?,?,?);",
              [
                header_result.insertId,
                _input.monthlyOverTime[i].overtime_date,
                _input.monthlyOverTime[i].from_time,
                _input.monthlyOverTime[i].to_time,

                _input.monthlyOverTime[i].overtime_hours,

                _input.monthlyOverTime[i].ot_hours,
                _input.monthlyOverTime[i].weekoff_ot_hours,
                _input.monthlyOverTime[i].holiday_ot_hours
              ]
            );
          }

          _mysql
            .executeQuery({
              query: query
            })
            .then(rest => {
              _mysql.commitTransaction((error, resu) => {
                if (error) {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                } else {
                  req.records = rest;
                  next();
                }
              });
            })
            .catch(e => {
              console.log("REsult", e);
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
