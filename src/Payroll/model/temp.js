if (input.status == "A") {
  const month_number = moment(input.from_date).format("M");
  const month_name = moment(input.from_date).format("MMMM");
  let updaid_leave_duration = 0;
  let id = 0;
  new Promise((resolve, reject) => {
    try {
      connection.query(
        "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
        hims_f_salary where `month`=? and `year`=? and employee_id=? ",
        [month_number, input.year, input.employee_id],
        (error, salResult) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          if (salResult.length > 0 && salResult[0]["salary_processed"] == "Y") {
            connection.query(
              "insert into hims_f_pending_leave (employee_id, year, month,leave_header_id) VALUE(?,?,?,?)",

              [
                input.employee_id,
                input.year,
                month_number,
                input.hims_f_leave_application_id
              ],
              (error, resultPL) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                if (resultPL.insertId > 0) {
                  id = resultPL.insertId;
                  resolve(resultPL);
                } else {
                  req.records = {
                    invalid_input: true,
                    message: "unpaid leave error"
                  };
                  next();
                  return;
                }
              }
            );

            //insert
          } else {
            resolve(salResult);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  }).then(pendingUpdaidResult => {
    //---START OF-------normal authrization

    new Promise((resolve, reject) => {
      req.options = {
        db: connection,
        onFailure: error => {
          reject(error);
        },
        onSuccess: result => {
          resolve(result);
        }
      };
      calculateLeaveDays(req, res, next);
    }).then(deductionResult => {
      new Promise((resolve, reject) => {
        try {
          debugLog(" wow deduc:", deductionResult);

          if (deductionResult.invalid_input == true) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
            });
            req.records = deductionResult;
            next();
            return;
          } else {
            resolve(deductionResult);
          }
        } catch (e) {
          reject(e);
        }
      }).then(deductionResult => {
        updaid_leave_duration = new LINQ(
          deductionResult.monthWiseCalculatedLeaveDeduction
        )
          .Where(w => w.month_name == month_name)
          .Select(s => s.finalLeave)
          .FirstOrDefault();

        debugLog("updaid_leave_duration:", updaid_leave_duration);

        let monthArray = new LINQ(
          deductionResult.monthWiseCalculatedLeaveDeduction
        )
          .Select(s => s.month_name)
          .ToArray();

        debugLog("monthArray:", monthArray);

        if (monthArray.length > 0) {
          connection.query(
            `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
             from hims_f_employee_monthly_leave where
            employee_id=? and year=? and leave_id=?`,
            [input.employee_id, input.year, input.leave_id],
            (error, leaveData) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              debugLog("leaveData:", leaveData);

              if (
                leaveData.length > 0 &&
                parseFloat(deductionResult.calculatedLeaveDays) <=
                  parseFloat(leaveData[0]["close_balance"])
              ) {
                let newCloseBal =
                  parseFloat(leaveData[0]["close_balance"]) -
                  parseFloat(deductionResult.calculatedLeaveDays);

                let newAvailTillDate =
                  parseFloat(leaveData[0]["availed_till_date"]) +
                  parseFloat(deductionResult.calculatedLeaveDays);

                let oldMonthsData = [];

                debugLog("oldMonthsData:", oldMonthsData);

                debugLog("kkk");
                for (let i = 0; i < monthArray.length; i++) {
                  Object.keys(leaveData[0]).map(key => {
                    if (key == monthArray[i]) {
                      debugLog(key, leaveData[0][key]);

                      oldMonthsData.push({
                        month_name: key,
                        finalLeave: leaveData[0][key]
                      });
                    }
                  });
                }
                debugLog("oldMonthsData:", oldMonthsData);

                let mergemonths = oldMonthsData.concat(
                  deductionResult.monthWiseCalculatedLeaveDeduction
                );

                debugLog("mergemonths:", mergemonths);

                let finalData = {};
                _.chain(mergemonths)
                  .groupBy(g => g.month_name)
                  .map(item => {
                    finalData[
                      _.get(_.find(item, "month_name"), "month_name")
                    ] = _.sumBy(item, s => {
                      return s.finalLeave;
                    });
                  })
                  .value();
                debugLog("finalData:", finalData);

                connection.query(
                  " update hims_f_leave_application set status='APR' where record_status='A' \
                and hims_f_leave_application_id=" +
                    input.hims_f_leave_application_id +
                    ";update hims_f_employee_monthly_leave set ?  where \
                hims_f_employee_monthly_leave_id='" +
                    leaveData[0].hims_f_employee_monthly_leave_id +
                    "';update hims_f_pending_leave set updaid_leave_duration=" +
                    updaid_leave_duration +
                    " where hims_f_pending_leave_id=" +
                    id +
                    "",
                  {
                    ...finalData,
                    close_balance: newCloseBal,
                    availed_till_date: newAvailTillDate
                  },
                  (error, finalRes) => {
                    if (error) {
                      debugLog("errr:");
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    debugLog("pakka:");
                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = finalRes;
                      next();
                    });
                  }
                );
              } else {
                //invalid data
                req.records = {
                  invalid_input: true,
                  message: "leave balance is low"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        } else {
          //invalid data

          req.records = {
            invalid_input: true,
            message: "please provide valid month"
          };
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next();
          });
        }
      });
    });
  });
  //---END OF-------normal authrization
}
