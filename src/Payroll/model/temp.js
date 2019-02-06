//created by irfan:
processYearlyLeave: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  utilities.logger().log("leaveHeadResult: ", "leaveHeadResult");

  let year = "";

  let yearArray = [];
  let monthlyArray = [];

  let employee_id = "";

  let AllEmployees = [];
  let AllLeaves = [];
  let AllYearlyLeaves = [];
  let AllMonthlyLeaves = [];

  if (req.query.employee_id > 0) {
    employee_id = ` and hims_d_employee_id=${req.query.employee_id}; `;
  }

  if (req.query.year > 0) {
    year = req.query.year;

    _mysql
      .executeQuery({
        query:
          "select hims_d_employee_id, employee_code,full_name  as employee_name,\
                employee_status,date_of_joining ,hospital_id ,employee_type,sex\
                from hims_d_employee where employee_status <>'I' and  record_status='A' " +
          employee_id +
          ";\
                select L.hims_d_leave_id,L.leave_code,LD.employee_type,LD.gender,LD.eligible_days from hims_d_leave  L \
                inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A' ;\
                select hims_f_employee_yearly_leave_id,employee_id,`year` from hims_f_employee_yearly_leave\
                 where record_status='A' and `year`=? ;\
                 select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
                hims_f_employee_monthly_leave where   `year`=?; ",
        values: [year, year],
        printQuery: true
      })
      .then(allResult => {
        AllEmployees = allResult[0];
        AllLeaves = allResult[1];
        AllYearlyLeaves = allResult[2];
        AllMonthlyLeaves = allResult[3];
        if (AllEmployees.length > 0) {
          new Promise((resolve, reject) => {
            try {
              for (let i = 0; i < AllEmployees.length; i++) {
                // fetch all the fileds of apllicable_leavs
                const apllicable_leavsDetail = new LINQ(AllLeaves)
                  .Where(
                    w =>
                      w.employee_type == AllEmployees[i]["employee_type"] &&
                      (w.gender == AllEmployees[i]["sex"] || w.gender == "BOTH")
                  )
                  .Select(s => {
                    return {
                      hims_d_leave_id: s.hims_d_leave_id,
                      eligible_days: s.eligible_days,
                      eligible_days: s.eligible_days
                    };
                  })
                  .ToArray();

                // fetch only leave ids of apllicable_leavs
                const apllicable_leavs = new LINQ(AllLeaves)
                  .Where(
                    w =>
                      w.employee_type == AllEmployees[i]["employee_type"] &&
                      (w.gender == AllEmployees[i]["sex"] || w.gender == "BOTH")
                  )
                  .Select(s => s.hims_d_leave_id)
                  .ToArray();

                if (apllicable_leavs.length > 0) {
                  debugLog("here");

                  let new_leave_ids = apllicable_leavs.filter((item, pos) => {
                    return apllicable_leavs.indexOf(item) == pos;
                  });
                  //  debugLog("new_leave_ids:", new_leave_ids);
                  //step1---checking if yearly leave is  already processed for this employee
                  const yearlyLvExist = new LINQ(AllYearlyLeaves)
                    .Where(
                      w =>
                        w.employee_id ==
                          AllEmployees[i]["hims_d_employee_id"] &&
                        w.year == year
                    )
                    .Select(s => s.hims_f_employee_yearly_leave_id)
                    .ToArray().length;

                  // debugLog("yearlyLvExist:", yearlyLvExist);
                  //if yearly leave is  not processed for this employee process now
                  if (yearlyLvExist < 1) {
                    yearArray.push({
                      employee_id: AllEmployees[i].hims_d_employee_id,
                      year: year
                    });
                  }

                  //step2----checking if monthly leave is  already processed for this employee
                  const monthlyLvExist = new LINQ(AllMonthlyLeaves)
                    .Where(
                      w =>
                        w.employee_id ==
                          AllEmployees[i]["hims_d_employee_id"] &&
                        w.year == year
                    )
                    .Select(s => s.leave_id)
                    .ToArray();

                  // debugLog("monthlyLvExist:", monthlyLvExist);
                  if (monthlyLvExist.length > 0) {
                    // const old_leave_ids = new LINQ(
                    //   monthlyLvExist
                    // )
                    //   .Select(s => s.leave_id)
                    //   .ToArray();

                    //   debugLog("old_leave_ids:", old_leave_ids);

                    // remove existing leave ids from applicable leave ids
                    let leaves_to_insert = new_leave_ids.filter(
                      val => !monthlyLvExist.includes(val)
                    );

                    const _leaves = leaves_to_insert.map(item => {
                      return _.chain(apllicable_leavsDetail)
                        .find(o => {
                          return o.hims_d_leave_id == item;
                        })

                        .omit(_.isNull)
                        .value();
                    });
                    //  debugLog("_leaves:", _leaves);
                    monthlyArray.push(
                      ...new LINQ(_leaves)
                        .Where(w => w.hims_d_leave_id > 0)
                        .Select(s => {
                          return {
                            employee_id: AllEmployees[i].hims_d_employee_id,
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
                      ...new LINQ(apllicable_leavsDetail)
                        .Where(w => w.hims_d_leave_id > 0)
                        .Select(s => {
                          return {
                            employee_id: AllEmployees[i].hims_d_employee_id,
                            year: year,
                            leave_id: s.hims_d_leave_id,
                            total_eligible: s.eligible_days,
                            close_balance: s.eligible_days
                          };
                        })
                        .ToArray()
                    );
                  }
                }

                if (i == AllEmployees.length - 1) {
                  //insert in two tables
                  resolve(yearArray);
                }
              }
            } catch (e) {
              reject(e);
            }
          }).then(arrayResult => {
            new Promise((resolve, reject) => {
              try {
                if (yearArray.length > 0) {
                  const insurtColumns = ["employee_id", "year"];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO hims_f_employee_yearly_leave(??) VALUES ?",
                      values: yearArray,
                      includeValues: insurtColumns,
                      extraValues: {
                        created_date: new Date(),
                        updated_date: new Date(),
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_by: req.userIdentity.algaeh_d_app_user_id
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(yearResult => {
                      utilities.logger().log("detailResult: ", detailResult);

                      if (yearResult.affectedRows > 0) {
                        resolve({ yearResult });
                      } else {
                        _mysql.rollBackTransaction(() => {
                          req.records = {
                            invalid_data: true,
                            message: "interuption in proccessing year "
                          };
                          next();
                          return;
                        });
                      }

                      // if (detailResult.insertId > 0) {
                      //   resolve({ detailResult });
                      // } else {
                      //   _mysql.rollBackTransaction(() => {
                      //     req.records = {
                      //       invalid_data: true,
                      //       message: "please send correct leave details data"
                      //     };
                      //     next();
                      //     return;
                      //   });
                      // }
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
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

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO hims_f_employee_monthly_leave(??) VALUES ?",
                        values: monthlyArray,
                        includeValues: insurtColumns,

                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(monthResult => {
                        utilities.logger().log("monthResult: ", monthResult);

                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = monthResult;
                          next();
                        });
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    //commit

                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
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
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "No Employees found"
          };
          next();
          return;
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  } else {
    req.records = {
      invalid_input: true,
      message: "Please Provide valid year "
    };

    next();
    return;
  }
};
