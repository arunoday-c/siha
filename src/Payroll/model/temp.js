for (let i = 0; i < employees.length; i++) {
  new Promise((resolve, reject) => {
    try {
      connection.query(
        " select L.hims_d_leave_id,L.leave_code,LD.employee_type,LD.gender,LD.eligible_days from hims_d_leave  L \
        inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A' \
      where (LD.employee_type=?  and  (LD.gender=? or LD.gender='BOTH' )) ;",
        [employees[i].employee_type, employees[i].sex],

        (error, leaveRes) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog("leaveRes:", leaveRes);
          if (leaveRes.length > 0) {
            const apllicable_leavs = new LINQ(leaveRes)
              .Select(s => s.hims_d_leave_id)
              .ToArray();

            debugLog("apllicable_leavs:", apllicable_leavs);
            let new_leave_ids = apllicable_leavs.filter((item, pos) => {
              return apllicable_leavs.indexOf(item) == pos;
            });

            debugLog("new_leave_ids:", new_leave_ids);
            new Promise((resolve, reject) => {
              try {
                // check if data already thier im year and monthly table
                connection.query(
                  " select hims_f_employee_yearly_leave_id,employee_id,`year` from hims_f_employee_yearly_leave\
                    where record_status='A' and employee_id=? and `year`=? ; \
                     select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
                    hims_f_employee_monthly_leave where employee_id=? and `year`=?;",
                  [
                    employees[i].hims_d_employee_id,
                    year,
                    employees[i].hims_d_employee_id,
                    year
                  ],

                  (error, yearOrLeavExist) => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }
                    // if monthly table data exist

                    if (yearOrLeavExist[1].length > 0) {
                      const old_leave_ids = new LINQ(yearOrLeavExist[1])
                        .Select(s => s.leave_id)
                        .ToArray();

                      debugLog("old_leave_ids:", old_leave_ids);

                      // remove existing leave ids from applicable leave ids
                      let leaves_to_insert = new_leave_ids.filter(
                        val => !old_leave_ids.includes(val)
                      );
                      debugLog("leaves_to_insert:", leaves_to_insert);

                      const _leaves = leaves_to_insert.map(item => {
                        return _.chain(leaveRes)
                          .find(o => {
                            return o.hims_d_leave_id == item;
                          })

                          .omit(_.isNull)
                          .value();
                      });
                      debugLog("_leaves:", _leaves);
                      monthlyArray.push(
                        ...new LINQ(_leaves)
                          .Where(w => w.hims_d_leave_id > 0)
                          .Select(s => {
                            return {
                              employee_id: employees[i].hims_d_employee_id,
                              year: year,
                              leave_id: s.hims_d_leave_id,
                              total_eligible: s.eligible_days,
                              close_balance: s.eligible_days
                            };
                          })
                          .ToArray()
                      );
                    } else {
                      // if monthly table data not exist
                      monthlyArray.push(
                        ...new LINQ(leaveRes)
                          .Where(w => w.hims_d_leave_id > 0)
                          .Select(s => {
                            return {
                              employee_id: employees[i].hims_d_employee_id,
                              year: year,
                              leave_id: s.hims_d_leave_id,
                              total_eligible: s.eligible_days,
                              close_balance: s.eligible_days
                            };
                          })
                          .ToArray()
                      );
                    }

                    if (yearOrLeavExist[0].length < 1) {
                      yearArray.push({
                        employee_id: employees[i].hims_d_employee_id,
                        year: year
                      });
                    }

                    if (i == employees.length - 1) {
                      //insert in two tables
                      resolve(yearArray);
                    }
                  }
                );
              } catch (e) {
                reject(e);
              }
            }).then(insertyearlyMonthly => {
              connection.beginTransaction(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                new Promise((resolve, reject) => {
                  try {
                    if (yearArray.length > 0) {
                      const insurtColumns = ["employee_id", "year"];

                      connection.query(
                        "INSERT INTO hims_f_employee_yearly_leave(" +
                          insurtColumns.join(",") +
                          ",created_date,updated_date,created_by,updated_by) VALUES ?",
                        [
                          jsonArrayToObject({
                            sampleInputObject: insurtColumns,
                            arrayObj: yearArray,
                            newFieldToInsert: [
                              new Date(),
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              req.userIdentity.algaeh_d_app_user_id
                            ]
                          })
                        ],
                        (error, yearResult) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }

                          if (yearResult.affectedRows > 0) {
                            resolve({ yearResult });
                          } else {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }
                        }
                      );
                    } else {
                      resolve({});
                    }
                  } catch (e) {
                    reject(e);
                  }
                }).then(resultofYearInsert => {
                  new Promise((resolve, reject) => {
                    try {
                      if (monthlyArray.length > 0) {
                        //functionality plus commit

                        const insurtColumns = [
                          "employee_id",
                          "year",
                          "leave_id",
                          "total_eligible",
                          "close_balance"
                        ];

                        connection.query(
                          "INSERT INTO hims_f_employee_monthly_leave(" +
                            insurtColumns.join(",") +
                            ") VALUES ?",
                          [
                            jsonArrayToObject({
                              sampleInputObject: insurtColumns,
                              arrayObj: monthlyArray
                            })
                          ],
                          (error, monthResult) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            connection.commit(error => {
                              if (error) {
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                });
                              }
                              releaseDBConnection(db, connection);
                              req.records = monthResult;
                              next();
                            });
                          }
                        );
                      } else {
                        //commit

                        connection.commit(error => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }

                          releaseDBConnection(db, connection);

                          if (Object.keys(resultofYearInsert).length === 0) {
                            req.records = {
                              already_processed: true,
                              message: "Leave already processed"
                            };
                            next();
                          } else {
                            req.records = resultofYearInsert;
                            next();
                          }
                        });
                      }
                    } catch (e) {
                      reject(e);
                    }
                  }).then(resultMonthlyInsert => {
                    //pppppppppppp
                  });
                });
              });
            });
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  }).then(result => {
    //pppppppppppp
  });
}
