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
        values: [_EncashDetails.employee_id, _EncashDetails.year],
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
                    _mysql
                      .executeQuery({
                        query:
                          "select hims_d_leave_encashment_id,earnings_id,percent from hims_d_leave_encashment where leave_header_id=?;",
                        values: [monthlyLeaves[i].leave_id]
                      })
                      .then(leaveEancashDetails => {
                        debugLog("leaveEancashDetails", leaveEancashDetails);
                        if (leaveEancashDetails.length > 0) {
                          for (let k = 0; k < leaveEancashDetails.length; k++) {
                            let perdayAmount = 0;
                            let EncashAmount = 0;
                            _mysql
                              .executeQuery({
                                query:
                                  "select hims_d_employee_earnings_id,amount from hims_d_employee_earnings where \
                                employee_id=? and earnings_id=?;",
                                values: [
                                  _EncashDetails[i].employee_id,
                                  leaveEancashDetails[K].earnings_id
                                ]
                              })
                              .then(empEarnings => {
                                debugLog("empEarnings", empEarnings);
                                if (
                                  monthlyLeaves[i].close_balance <
                                  monthlyLeaves[i].encashment_leave
                                ) {
                                  EncashDays = monthlyLeaves[i].close_balance;
                                } else {
                                  EncashDays =
                                    monthlyLeaves[i].encashment_leave;
                                }
                                perdayAmount = empEarnings[0].amount * 12;
                                debugLog("perdayAmount", perdayAmount);
                                perdayAmount = perdayAmount / 365;
                                debugLog("perdayAmount", perdayAmount);

                                perdayAmount =
                                  perdayAmount *
                                  leaveEancashDetails[K].earnings_id;
                                debugLog("perdayAmount", perdayAmount);
                                perdayAmount = perdayAmount / 100;
                                debugLog("perdayAmount", perdayAmount);
                                EncashAmount = perdayAmount * EncashDays;

                                debugLog("EncashDays", EncashDays);
                                debugLog("EncashAmount", EncashAmount);

                                // leaveEancashDetails[0].earnings_id
                                // leaveEancashDetails[0].percent

                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = leaveEancashDetails;
                                  next();
                                });
                              })
                              .catch(e => {
                                next(e);
                              });
                          }
                        }
                      })
                      .catch(e => {
                        next(e);
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
