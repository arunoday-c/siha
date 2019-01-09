import algaehMysql from "algaeh-mysql";
import { debugLog, debugFunction } from "../../../src/utils/logging";
import _ from "lodash";
module.exports = {
  getEncashmentToProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _EncashDetails = req.query;

    /* Select statemwnt  */
    debugLog("_EncashDetails", _EncashDetails);

    _mysql
      .executeQueryWithTransaction({
        query:
          "select hims_f_employee_monthly_leave_id,leave_id,employee_id,`year`,close_balance,encashment_leave from \
          hims_f_employee_monthly_leave where employee_id=? and `year`=?; ",
        values: _.valuesIn(_EncashDetails),
        printQuery: true
      })
      .then(monthlyLeaves => {
        if (monthlyLeaves.length > 0) {
          debugLog("monthlyLeaves", monthlyLeaves);
          for (let i = 0; i < monthlyLeaves.length; i++) {
            let EncashDays = 0;
            _mysql
              .executeQuery({
                query:
                  "select hims_d_leave_id,leave_encash from hims_d_leave where hims_d_leave_id=?;",
                values: [monthlyLeaves[i].leave_id]
              })
              .then(leaveDetails => {
                debugLog("leaveDetails", leaveDetails);
                if (leaveDetails.length > 0) {
                  if (leaveDetails[0].leave_encash == "Y") {
                    debugFunction("EncashMent");

                    if (
                      monthlyLeaves[i].close_balance <
                      monthlyLeaves[i].encashment_leave
                    ) {
                      EncashDays = monthlyLeaves[i].close_balance;
                    } else {
                      EncashDays = monthlyLeaves[i].encashment_leave;
                    }

                    debugLog("EncashDays", EncashDays);
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = leaveDetails;
                      next();
                    });
                    // All Calculation
                  } else {
                    next();
                    debugFunction("No EncashMent");
                  }
                }
              })
              .catch(e => {
                next(e);
              });
          }
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = monthlyLeaves;
            next();
          });
        }
      })
      .catch(e => {
        next(e);
      });
  }
};
