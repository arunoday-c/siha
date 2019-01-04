import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  releaseDBConnection,
  deleteRecord,
  jsonArrayToObject
} from "../utils";
import httpStatus from "../utils/httpStatus";
import { debugLog } from "../utils/logging";
import Promise from "bluebird";
import mysql from "mysql";
import department from "../controller/department";

//api to add employee
let addEmployee = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "INSERT hims_d_employee(employee_code,title_id,first_name,middle_name,last_name,\
          full_name,arabic_name,employee_designation_id,license_number,sex,date_of_birth,date_of_joining,date_of_resignation,address,\
          address2,pincode,city_id,state_id,country_id,primary_contact_no,secondary_contact_no,email,emergancy_contact_person,emergancy_contact_no,\
          blood_group,isdoctor,employee_status,effective_start_date,effective_end_date,created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.employee_code,
            input.title_id,
            input.first_name,
            input.middle_name,
            input.last_name,
            input.full_name,
            input.arabic_name,
            input.employee_designation_id,
            input.license_number,
            input.sex,
            input.date_of_birth != null
              ? new Date(input.date_of_birth)
              : input.date_of_birth,
            input.date_of_joining,
            input.date_of_resignation,
            input.address,
            input.address2,
            input.pincode,
            input.city_id,
            input.state_id,
            input.country_id,
            input.primary_contact_no,
            input.secondary_contact_no,
            input.email,
            input.emergancy_contact_person,
            input.emergancy_contact_no,
            input.blood_group,
            input.isdoctor,
            input.employee_status,
            input.effective_start_date != null
              ? new Date(input.effective_start_date)
              : input.effective_start_date,
            input.effective_end_date != null
              ? new Date(input.effective_end_date)
              : input.effective_end_date,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            if (result.insertId != null && req.body.deptDetails.length > 0) {
              const insurtColumns = [
                "services_id",
                "sub_department_id",
                "category_speciality_id",
                "user_id",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_m_employee_department_mappings(" +
                  insurtColumns.join(",") +
                  ",employee_id,created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: req.body.deptDetails,
                    newFieldToInsert: [result.insertId, new Date(), new Date()],
                    req: req
                  })
                ],
                (error, departResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  new Promise((resolve, reject) => {
                    try {
                      if (input.serviceComm.length > 0) {
                        const insurtColumns = [
                          "services_id",
                          "service_type_id",
                          "op_cash_commission_percent",
                          "op_credit_commission_percent",
                          "ip_cash_commission_percent",
                          "ip_credit_commission_percent",
                          "created_by",
                          "updated_by"
                        ];

                        connection.query(
                          "INSERT INTO hims_m_doctor_service_commission(" +
                            insurtColumns.join(",") +
                            ",provider_id,created_date,updated_date) VALUES ?",
                          [
                            jsonArrayToObject({
                              sampleInputObject: insurtColumns,
                              arrayObj: req.body.serviceComm,
                              newFieldToInsert: [
                                result.insertId,
                                new Date(),
                                new Date()
                              ],
                              req: req
                            })
                          ],
                          (error, serviceCommResult) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            return resolve(serviceCommResult);
                          }
                        );
                      } else {
                        return resolve(departResult);
                      }
                    } catch (e) {
                      reject(e);
                    }
                  }).then(results => {
                    if (input.servTypeCommission.length > 0) {
                      const insurtColumns = [
                        "service_type_id",
                        "op_cash_comission_percent",
                        "op_credit_comission_percent",
                        "ip_cash_commission_percent",
                        "ip_credit_commission_percent",
                        "created_by",
                        "updated_by"
                      ];

                      connection.query(
                        "INSERT INTO hims_m_doctor_service_type_commission(" +
                          insurtColumns.join(",") +
                          ",provider_id,created_date,updated_date) VALUES ?",
                        [
                          jsonArrayToObject({
                            sampleInputObject: insurtColumns,
                            arrayObj: req.body.servTypeCommission,
                            newFieldToInsert: [
                              result.insertId,
                              new Date(),
                              new Date()
                            ],
                            req: req
                          })
                        ],
                        (error, serviceTypeCommResult) => {
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
                            req.records = serviceTypeCommResult;
                            next();
                          });
                        }
                      );
                    } else {
                      connection.commit(error => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        releaseDBConnection(db, connection);
                        req.records = results;
                        next();
                      });
                    }
                  });
                }
              );
            } else {
              req.records = result;
              releaseDBConnection(db, connection);
              next();
            }

            // connection.query(
            //   "SELECT * FROM hims_d_employee WHERE hims_d_employee_id=?",
            //   [result["insertId"]],
            //   (error, resultBack) => {
            //     releaseDBConnection(db, connection);
            //     if (error) {
            //       next(error);
            //     }
            //     req.records = resultBack;
            //     next();
            //   }
            // );
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:api to
let addEmployeeMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (
      req.body.license_number == "null" ||
      req.body.license_number == "" ||
      req.body.license_number == null
    ) {
      delete req.body.license_number;
    }
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_employee (employee_code,full_name,arabic_name,\
          date_of_birth,sex,primary_contact_no,email,blood_group,nationality,religion_id,\
          marital_status,present_address,present_address2,present_pincode,present_city_id,\
          present_state_id,present_country_id,permanent_address,permanent_address2,permanent_pincode,\
          permanent_city_id,permanent_state_id,permanent_country_id,isdoctor,license_number, \
          date_of_joining,appointment_type,employee_type,reliving_date,notice_period,date_of_resignation,\
          company_bank_id,employee_bank_name,employee_bank_ifsc_code,employee_account_number,mode_of_payment,\
          accomodation_provided,hospital_id,created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.employee_code,
          input.full_name,
          input.arabic_name,
          input.date_of_birth,
          input.sex,
          input.primary_contact_no,
          input.email,
          input.blood_group,
          input.nationality,
          input.religion_id,
          input.marital_status,
          input.present_address,
          input.present_address2,
          input.present_pincode,
          input.present_city_id,
          input.present_state_id,
          input.present_country_id,
          input.permanent_address,
          input.permanent_address2,
          input.permanent_pincode,
          input.permanent_city_id,
          input.permanent_state_id,
          input.permanent_country_id,
          input.isdoctor,
          input.license_number,
          input.date_of_joining,
          input.appointment_type,
          input.employee_type,
          input.reliving_date,
          input.notice_period,
          input.date_of_resignation,
          input.company_bank_id,
          input.employee_bank_name,
          input.employee_bank_ifsc_code,
          input.employee_account_number,
          input.mode_of_payment,
          input.accomodation_provided,
          input.hospital_id,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:api to
let addEmployeeInfoBAckup28_december = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        new Promise((resolve, reject) => {
          try {
            debugLog("first");
            if (input.deptDetails.length > 0) {
              const insurtColumns = [
                "services_id",
                "sub_department_id",
                "category_speciality_id",
                "employee_designation_id",
                "reporting_to_id",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_m_employee_department_mappings(" +
                  insurtColumns.join(",") +
                  ",`employee_id`,created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: input.deptDetails,
                    newFieldToInsert: [
                      input.hims_d_employee_id,
                      new Date(),
                      new Date()
                    ],
                    req: req
                  })
                ],
                (error, result) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  if (result.length > 0) {
                    resolve(result);
                  } else {
                    resolve({});
                  }
                }
              );
            } else {
              resolve({});
            }
          } catch (e) {
            reject(e);
          }
        })
          .then(departmntResult => {
            debugLog("second");
            if (input != "null" && input != undefined) {
              connection.query(
                " UPDATE hims_d_employee SET airfare_process=?,contract_type=?,emergency_contact_no=?,\
              emergency_contact_person=?,employee_designation_id=?,employee_group_id=?,\
              entitled_daily_ot=?,exclude_machine_data=?,exit_date=?,gratuity_applicable=?,\
              hospital_id=?,late_coming_rule=?,leave_salary_process=?,overtime_group_id=?,reporting_to_id=?,\
              secondary_contact_no=?,sub_department_id=?,suspend_salary=?,title_id=?,weekoff_from=?,\
              updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_id=?",

                [
                  input.airfare_process,
                  input.contract_type,
                  input.emergency_contact_no,
                  input.emergency_contact_person,
                  input.employee_designation_id,
                  input.employee_group_id,

                  input.entitled_daily_ot,
                  input.exclude_machine_data,
                  input.exit_date,
                  input.gratuity_applicable,
                  input.hospital_id,
                  input.late_coming_rule,
                  input.leave_salary_process,
                  input.overtime_group_id,
                  input.reporting_to_id,
                  input.secondary_contact_no,
                  input.sub_department_id,
                  input.suspend_salary,
                  input.title_id,
                  input.weekoff_from,
                  new Date(),
                  input.updated_by,
                  input.hims_d_employee_id
                ],
                (error, empResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  return;
                }
              );
            } else {
              return;
            }
          })
          .then(employResult => {
            debugLog("third");
            if (input.idDetails.length > 0) {
              const insurtColumns = [
                "identity_documents_id",
                "identity_number",
                "valid_upto",
                "issue_date",
                "alert_required",
                "alert_date",

                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_d_employee_identification (" +
                  insurtColumns.join(",") +
                  ",`employee_id`,created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: input.idDetails,
                    newFieldToInsert: [
                      input.hims_d_employee_id,
                      new Date(),
                      new Date()
                    ],
                    req: req
                  })
                ],
                (error, Identity_Result) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  return;
                }
              );
            } else {
              return;
            }
          })
          .then(Identity_Result => {
            debugLog("fourth");

            if (input.dependentDetails.length > 0) {
              const insurtColumns = [
                "dependent_type",
                "dependent_name",
                "dependent_identity_type",
                "dependent_identity_no",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_d_employee_dependents (" +
                  insurtColumns.join(",") +
                  ",`employee_id`,created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: input.idDetails,
                    newFieldToInsert: [
                      input.hims_d_employee_id,
                      new Date(),
                      new Date()
                    ],
                    req: req
                  })
                ],
                (error, Identity_Result) => {
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
                    req.records = result;
                    next();
                  });
                }
              );
            } else {
              connection.commit(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                releaseDBConnection(db, connection);
                req.records = result;
                next();
              });
            }
          });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:api to
let addEmployeeInfo = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        new Promise((resolve, reject) => {
          try {
            debugLog("first");
            if (input.deptDetails.length > 0) {
              const insurtColumns = [
                "services_id",
                "sub_department_id",
                "category_speciality_id",
                "employee_designation_id",
                "reporting_to_id",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_m_employee_department_mappings(" +
                  insurtColumns.join(",") +
                  ",`employee_id`,created_date,updated_date) VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: input.deptDetails,
                    newFieldToInsert: [
                      input.hims_d_employee_id,
                      new Date(),
                      new Date()
                    ],
                    req: req
                  })
                ],
                (error, result) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  if (result.length > 0) {
                    resolve(result);
                  } else {
                    resolve({});
                  }
                }
              );
            } else {
              resolve({});
            }
          } catch (e) {
            reject(e);
          }
        }).then(departmntResult => {
          debugLog("second");
          if (input != "null" && input != undefined) {
            connection.query(
              " UPDATE hims_d_employee SET employee_group_id=?,employee_designation_id=?,\
                reporting_to_id=?,sub_department_id=?,\
              updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_id=?",

              [
                input.employee_group_id,
                input.employee_designation_id,
                input.reporting_to_id,
                input.sub_department_id,
                new Date(),
                input.updated_by,
                input.hims_d_employee_id
              ],
              (error, empResult) => {
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
                  req.records = departmntResult;
                  next();
                });
              }
            );
          } else {
            connection.commit(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              releaseDBConnection(db, connection);
              req.records = departmntResult;
              next();
            });
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by adnan:api to add employee groups
let addEmployeeGroups = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_employee_group(group_description,monthly_accrual_days,airfare_eligibility,airfare_amount,\
            created_date,created_by,updated_date,updated_by) values(\
              ?,?,?,?,?,?,?,?)",
        [
          input.group_description,
          input.monthly_accrual_days,
          input.airfare_eligibility,
          input.airfare_amount,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;

          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getEmployeeGroups = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_employee_group_id, group_description,\
         monthly_accrual_days, airfare_eligibility, airfare_amount from hims_d_employee_group\
        where record_status='A'  order by hims_d_employee_group_id desc",

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let updateEmployeeGroup = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_employee_group_id != "null" &&
      input.hims_d_employee_group_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_d_employee_group SET group_description = ?,\
           monthly_accrual_days = ?, airfare_eligibility = ?, airfare_amount = ?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_group_id = ?",

          [
            input.group_description,
            input.monthly_accrual_days,
            input.airfare_eligibility,
            input.airfare_amount,
            new Date(),
            input.updated_by,
            input.hims_d_employee_group_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by:irfan to delete
let deleteEmployeeGroup = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_employee_group_id != "null" &&
      input.hims_d_employee_group_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_employee_group",
          id: req.body.hims_d_employee_group_id,
          query:
            "UPDATE hims_d_employee_group SET  record_status='I' WHERE hims_d_employee_group_id=?",
          values: [req.body.hims_d_employee_group_id]
        },
        result => {
          req.records = result;
          next();
        },
        error => {
          next(error);
        },
        true
      );
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

// api to fetch employee
let getEmployee = (req, res, next) => {
  let employeeWhereCondition = {
    employee_code: "ALL",

    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_resignation: "ALL",
    primary_contact_no: "ALL",
    email: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }
    let parameters = extend(
      employeeWhereCondition,
      req.Wherecondition == null ? {} : req.Wherecondition
    );
    let condition = whereCondition(extend(parameters, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM hims_d_employee WHERE record_status ='A' AND " +
          condition.condition +
          " " +
          pagePaging,
        values: condition.values
      },
      result => {
        for (let i = 0; i < result.length; i++) {
          result[i].employee_id = result[i].hims_d_employee_id;
        }

        req.records = result;
        next();
      },
      error => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//created by irfan: to update Employee
let updateEmployee = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        connection.query(
          "UPDATE hims_d_employee SET employee_code=?,full_name=?,arabic_name=?,\
          date_of_birth=?,sex=?,primary_contact_no=?,email=?,blood_group=?,nationality=?,religion_id=?,\
          marital_status=?,present_address=?,present_address2=?,present_pincode=?,present_city_id=?,\
          present_state_id=?,present_country_id=?,permanent_address=?,permanent_address2=?,permanent_pincode=?,\
          permanent_city_id=?,permanent_state_id=?,permanent_country_id=?,isdoctor=?,license_number=?, \
          date_of_joining=?,appointment_type=?,employee_type=?,reliving_date=?,notice_period=?,date_of_resignation=?,\
          company_bank_id=?,employee_bank_name=?,employee_bank_ifsc_code=?,employee_account_number=?,mode_of_payment=?,\
          accomodation_provided=?,hospital_id=?,gross_salary=?,total_earnings=?,total_deductions=?,total_contributions=?,\
          net_salary=?,cost_to_company=?,leave_salary_process=?,late_coming_rule=?,airfare_process=?,\
          exclude_machine_data=?,gratuity_applicable=?,suspend_salary=?,pf_applicable=?,employee_group_id=?, \
          reporting_to_id=?,sub_department_id=?,employee_designation_id=?,updated_date=?,updated_by=?\
          WHERE record_status='A' and  hims_d_employee_id=?",
          [
            input.employee_code,
            input.full_name,
            input.arabic_name,
            input.date_of_birth,
            input.sex,
            input.primary_contact_no,
            input.email,
            input.blood_group,
            input.nationality,
            input.religion_id,
            input.marital_status,
            input.present_address,
            input.present_address2,
            input.present_pincode,
            input.present_city_id,
            input.present_state_id,
            input.present_country_id,
            input.permanent_address,
            input.permanent_address2,
            input.permanent_pincode,
            input.permanent_city_id,
            input.permanent_state_id,
            input.permanent_country_id,
            input.isdoctor,
            input.license_number,
            input.date_of_joining,
            input.appointment_type,
            input.employee_type,
            input.reliving_date,
            input.notice_period,
            input.date_of_resignation,
            input.company_bank_id,
            input.employee_bank_name,
            input.employee_bank_ifsc_code,
            input.employee_account_number,
            input.mode_of_payment,
            input.accomodation_provided,
            input.hospital_id,

            input.gross_salary,
            input.total_earnings,
            input.total_deductions,
            input.total_contributions,
            input.net_salary,
            input.cost_to_company,

            input.leave_salary_process,
            input.late_coming_rule,
            input.airfare_process,
            input.exclude_machine_data,
            input.gratuity_applicable,
            input.suspend_salary,
            input.pf_applicable,

            input.employee_group_id,
            input.reporting_to_id,
            input.sub_department_id,
            input.employee_designation_id,

            new Date(),
            input.updated_by,
            input.hims_d_employee_id
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            if (result.length != 0) {
              return new Promise((resolve, reject) => {
                if (input.insertdeptDetails.length > 0) {
                  const insurtColumns = [
                    "employee_id",
                    "services_id",
                    "sub_department_id",
                    "category_speciality_id",
                    "user_id",
                    "employee_designation_id",
                    "reporting_to_id",
                    "from_date",
                    "created_by",
                    "updated_by"
                  ];

                  connection.query(
                    "INSERT INTO hims_m_employee_department_mappings(" +
                      insurtColumns.join(",") +
                      ",created_date,updated_date) VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: insurtColumns,
                        arrayObj: req.body.insertdeptDetails,
                        newFieldToInsert: [new Date(), new Date()],
                        req: req
                      })
                    ],
                    (error, insertDepartResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      return resolve(insertDepartResult);
                    }
                  );
                } else {
                  resolve(result);
                }
              })
                .then(resultFrmInsertDept => {
                  debugLog("inside One then");

                  if (input.updatedeptDetails.length > 0) {
                    debugLog("inside updatedeptDetails");
                    let inputParam = extend([], req.body.updatedeptDetails);
                    let qry = "";

                    for (let i = 0; i < input.updatedeptDetails.length; i++) {
                      debugLog("qry: ", qry);
                      qry += mysql.format(
                        "UPDATE `hims_m_employee_department_mappings` SET services_id=?,`sub_department_id`=?,\
                        `category_speciality_id`=?,`employee_designation_id`=?,`reporting_to_id`=?,`to_date`=?,\
                        `dep_status`=?, `record_status`=?,`updated_date`=?,`updated_by`=? \
                        where record_status='A' and hims_d_employee_department_id=?;",
                        [
                          inputParam[i].services_id,
                          inputParam[i].sub_department_id,
                          inputParam[i].category_speciality_id,
                          inputParam[i].employee_designation_id,
                          inputParam[i].reporting_to_id,
                          inputParam[i].to_date,
                          inputParam[i].dep_status,
                          inputParam[i].record_status,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          inputParam[i].hims_d_employee_department_id
                        ]
                      );
                      debugLog("qry: ", qry);
                    }

                    debugLog("qry: ", qry);

                    connection.query(qry, (error, updateDeptDetailResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                    });
                  }
                })
                .then(updateDeptDetailResult => {
                  debugLog("inside 2 then");

                  if (input.insertserviceComm.length > 0) {
                    debugLog("inside insertserviceComm");
                    const insurtColumns = [
                      "provider_id",
                      "services_id",
                      "service_type_id",
                      "op_cash_commission_percent",
                      "op_credit_commission_percent",
                      "ip_cash_commission_percent",
                      "ip_credit_commission_percent",
                      "created_by",
                      "updated_by"
                    ];

                    connection.query(
                      "INSERT INTO hims_m_doctor_service_commission(" +
                        insurtColumns.join(",") +
                        ",created_date,updated_date) VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertserviceComm,
                          newFieldToInsert: [new Date(), new Date()],
                          req: req
                        })
                      ],
                      (error, serviceCommResult) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        //--
                      }
                    );
                  }
                })
                .then(serviceCommResult => {
                  debugLog("inside 3 then");

                  if (input.updateserviceComm.length > 0) {
                    debugLog("inside updateserviceComm");
                    let inputParam = extend([], req.body.updateserviceComm);
                    let qry = "";

                    for (
                      let i = 0;
                      i < req.body.updateserviceComm.length;
                      i++
                    ) {
                      qry += mysql.format(
                        "UPDATE `hims_m_doctor_service_commission` SET services_id=?,\
                      `service_type_id`=?,`op_cash_commission_percent`=?,`op_credit_commission_percent`=?,`ip_cash_commission_percent`=?,\
                      `ip_credit_commission_percent`=?,record_status`=?,\
                      updated_date=?,updated_by=? where record_status='A' and hims_m_doctor_service_commission_id=?;",
                        [
                          inputParam[i].services_id,
                          inputParam[i].service_type_id,
                          inputParam[i].op_cash_commission_percent,
                          inputParam[i].op_credit_commission_percent,
                          inputParam[i].ip_cash_commission_percent,
                          inputParam[i].ip_credit_commission_percent,
                          inputParam[i].record_status,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          inputParam[i].hims_m_doctor_service_commission_id
                        ]
                      );
                    }

                    connection.query(qry, (error, updateServiceCommResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                    });
                  }
                })
                .then(updateServiceCommResult => {
                  debugLog("inside 4 then");
                  if (input.insertservTypeCommission.length > 0) {
                    debugLog("inside insertservTypeCommission");
                    const insurtColumns = [
                      "provider_id",
                      "service_type_id",
                      "op_cash_comission_percent",
                      "op_credit_comission_percent",
                      "ip_cash_commission_percent",
                      "ip_credit_commission_percent",
                      "created_by",
                      "updated_by"
                    ];

                    connection.query(
                      "INSERT INTO hims_m_doctor_service_type_commission(" +
                        insurtColumns.join(",") +
                        ",created_date,updated_date) VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertservTypeCommission,
                          newFieldToInsert: [new Date(), new Date()],
                          req: req
                        })
                      ],
                      (error, insrtServiceTypeCommResult) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        //-
                      }
                    );
                  }
                })
                .then(insrtServiceTypeCommResult => {
                  debugLog("inside 5 then");
                  if (input.updateservTypeCommission.length > 0) {
                    debugLog("inside updateservTypeCommission");
                    let inputParam = extend(
                      [],
                      req.body.updateservTypeCommission
                    );
                    let qry = "";

                    for (
                      let i = 0;
                      i < req.body.updateservTypeCommission.length;
                      i++
                    ) {
                      qry += mysql.format(
                        "UPDATE `hims_m_doctor_service_type_commission` SET \
                      `service_type_id`=?,`op_cash_comission_percent`=?,`op_credit_comission_percent`=?,`ip_cash_commission_percent`=?,\
                      `ip_credit_commission_percent`=?,record_status`=?,\
                      updated_date=?,updated_by=? where record_status='A' and hims_m_doctor_service_type_commission_id=?;",
                        [
                          inputParam[i].service_type_id,
                          inputParam[i].op_cash_comission_percent,
                          inputParam[i].op_credit_comission_percent,
                          inputParam[i].ip_cash_commission_percent,
                          inputParam[i].ip_credit_commission_percent,
                          inputParam[i].record_status,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          inputParam[i].hims_m_doctor_service_type_commission_id
                        ]
                      );
                    }

                    connection.query(qry, (error, updateServiceCommResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                    });
                  }
                })
                .then(updateServiceCommResult => {
                  debugLog("inside insertearnComp then");

                  if (input.insertearnComp.length > 0) {
                    const insurtColumns = [
                      "employee_id",
                      "earnings_id",
                      "amount",
                      "formula",
                      "allocate",
                      "calculation_method",
                      "calculation_type",
                      "revision_type",
                      "revision_date",
                      "revised_amount",
                      "applicable_annual_leave"
                    ];

                    connection.query(
                      "INSERT INTO hims_d_employee_earnings(" +
                        insurtColumns.join(",") +
                        ") VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertearnComp,
                          req: req
                        })
                      ],
                      (error, insertearncomponent) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        //--
                      }
                    );
                  }
                })
                .then(insertearncomponent => {
                  debugLog("inside insertDeductionComp then");

                  if (input.insertDeductionComp.length > 0) {
                    const insurtColumns = [
                      "employee_id",
                      "deductions_id",
                      "amount",
                      "formula",
                      "allocate",
                      "calculation_method",
                      "calculation_type",
                      "revision_type",
                      "revision_date",
                      "revised_amount"
                    ];

                    connection.query(
                      "INSERT INTO hims_d_employee_deductions(" +
                        insurtColumns.join(",") +
                        ") VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertDeductionComp,
                          req: req
                        })
                      ],
                      (error, insertDeductionComp) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        //--
                      }
                    );
                  }
                })
                .then(insertDeductionComp => {
                  debugLog("inside insertContributeComp then");

                  if (input.insertContributeComp.length > 0) {
                    const insurtColumns = [
                      "employee_id",
                      "contributions_id",
                      "amount",
                      "formula",
                      "allocate",
                      "calculation_method",
                      "calculation_type",
                      "revision_type",
                      "revision_date",
                      "revised_amount"
                    ];

                    connection.query(
                      "INSERT INTO hims_d_employee_contributions(" +
                        insurtColumns.join(",") +
                        ") VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertContributeComp,
                          req: req
                        })
                      ],
                      (error, insertContributeComp) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        //--
                      }
                    );
                  }
                })
                .then(insertContributeComp => {
                  debugLog("inside insertIdDetails then");

                  if (input.insertIdDetails.length > 0) {
                    const insurtColumns = [
                      "employee_id",
                      "identity_documents_id",
                      "identity_number",
                      "valid_upto",
                      "issue_date",
                      "alert_required",
                      "alert_date"
                    ];

                    connection.query(
                      "INSERT INTO hims_d_employee_identification(" +
                        insurtColumns.join(",") +
                        ",created_date,created_by,updated_date,updated_by) VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertIdDetails,
                          req: req,
                          newFieldToInsert: [
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id
                          ]
                        })
                      ],
                      (error, insertIdDetails) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                      }
                    );
                  }
                })
                .then(insertIdDetails => {
                  debugLog("inside insertDependentDetails then");

                  if (input.insertDependentDetails.length > 0) {
                    const insurtColumns = [
                      "employee_id",
                      "dependent_type",
                      "dependent_name",
                      "dependent_identity_type",
                      "dependent_identity_no"
                    ];

                    connection.query(
                      "INSERT INTO hims_d_employee_dependents(" +
                        insurtColumns.join(",") +
                        ",created_date,created_by,updated_date,updated_by) VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: req.body.insertDependentDetails,
                          req: req,
                          newFieldToInsert: [
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id
                          ]
                        })
                      ],
                      (error, insertDependentDetails) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                      }
                    );
                  }
                })
                .finally(allResult => {
                  debugLog("inside finally");
                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    releaseDBConnection(db, connection);
                    req.records = result;
                    next();
                  });
                });
            } else {
              req.records = result;
              releaseDBConnection(db, connection);
              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get eployee details
// let getEmployeeDetails = (req, res, next) => {
//   let employeeWhereCondition = {
//     employee_code: "ALL",
//     sex: "ALL",
//     blood_group: "ALL",
//     employee_status: "ALL",
//     date_of_joining: "ALL",
//     date_of_resignation: "ALL",
//     primary_contact_no: "ALL",
//     email: "ALL"
//   };
//   try {
//     if (req.db == null) {
//       next(httpStatus.dataBaseNotInitilizedError());
//     }
//     let db = req.db;

//     let where = whereCondition(extend(employeeWhereCondition, req.query));

//     db.getConnection((error, connection) => {
//       connection.query(
//         "SELECT E.hims_d_employee_id,E.employee_code,E.title_id,E.full_name,E.arabic_name,E.employee_designation_id,\
//         E.license_number,E.sex,E.religion_id,E.marital_status,E.date_of_birth,E.date_of_joining,E.date_of_resignation,E.present_address,E.present_address2,\
//         E.present_pincode,E.present_state_id,E.present_country_id,\
//         E.permanent_address , E.permanent_address2, E.permanent_pincode, E.permanent_city_id, E.permanent_state_id,\
//         E.permanent_country_id, E.primary_contact_no, E.secondary_contact_no,E.email,\
//         E.emergency_contact_person,E.emergency_contact_no,E.blood_group,\
//         E.isdoctor,E.employee_status,E.exclude_machine_data ,E.company_bank_id ,E.employee_bank_name , E.effective_start_date,E.effective_end_date,\
//         E.employee_bank_ifsc_code , E.employee_account_number, E.mode_of_payment, E.accomodation_provided,\
//          E.late_coming_rule, E.leave_salary_process, E.entitled_daily_ot, E.suspend_salary, E.gratuity_applicable, E.contract_type, E.employee_group_id,\
//          E.weekoff_from,E.overtime_group_id, E.reporting_to_id, E.hospital_id,\
//         ED.hims_d_employee_department_id,ED.employee_id,ED.sub_department_id,ED.category_speciality_id,ED.user_id,\
//          ED.services_id,ED.employee_designation_id,ED.reporting_to_id,ED.from_date,ED.end_date,ED.dep_status,\
//          CS.hims_m_category_speciality_mappings_id,CS.category_id,CS.speciality_id,\
//         CS.category_speciality_status,CS.effective_start_date,CS.effective_end_date\
//         from hims_d_employee E,hims_m_employee_department_mappings ED,hims_m_category_speciality_mappings CS\
//          Where E.record_status='A' and ED.record_status='A' and CS.record_status='A' and E.hims_d_employee_id=ED.employee_id\
//           and ED.category_speciality_id=CS.hims_m_category_speciality_mappings_id AND " +
//           where.condition +
//           "order by E.hims_d_employee_id desc ",
//         where.values,
//         (error, result) => {
//           releaseDBConnection(db, connection);
//           if (error) {
//             next(error);
//           }

//           req.records = result;
//           next();
//         }
//       );
//     });
//   } catch (e) {
//     next(e);
//   }
// };

//created by Nowshad: to get eployee details
let getEmployeeDetails = (req, res, next) => {
  let employeeWhereCondition = {
    employee_code: "ALL",
    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_resignation: "ALL",
    primary_contact_no: "ALL",
    email: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(employeeWhereCondition, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from hims_d_employee Where record_status='A' AND " +
          where.condition +
          "order by E.hims_d_employee_id desc ",
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get eployee details
let getEmployeeCategory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_m_category_speciality_mappings_id, category_id, speciality_id ,C.hims_employee_category_id,C.employee_category_code,C.employee_category_name,\
        C.employee_category_desc from hims_m_category_speciality_mappings CS,hims_d_employee_category C\
         where CS.record_status='A' and C.record_status='A' and  CS.category_id=C.hims_employee_category_id and speciality_id=?",
        [req.query.speciality_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Doctor Service Commission
let getDoctorServiceCommission = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_m_doctor_service_commission_id,provider_id,services_id,service_type_id,op_cash_commission_percent,\
        op_credit_commission_percent,ip_cash_commission_percent,ip_credit_commission_percent\
         from hims_m_doctor_service_commission where record_status='A'and provider_id=?",
        [input.provider_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get Doctor Service  type Commission
let getDoctorServiceTypeCommission = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_m_doctor_service_type_commission_id,provider_id,service_type_id,\
        op_cash_comission_percent,op_credit_comission_percent,ip_cash_commission_percent,ip_credit_commission_percent\
         from hims_m_doctor_service_type_commission where record_status='A' and provider_id=?",
        [input.provider_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:api to
let addEarningDeduction = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_earning_deduction (earning_deduction_code,earning_deduction_description,short_desc,\
          component_category,calculation_method, miscellaneous_component, formula,component_frequency,calculation_type,component_type,\
          shortage_deduction_applicable,overtime_applicable,limit_applicable,limit_amount,\
          process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
          round_off_amount, created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.earning_deduction_code,
          input.earning_deduction_description,
          input.short_desc,
          input.component_category,
          input.calculation_method,
          input.miscellaneous_component,
          input.formula,
          input.component_frequency,
          input.calculation_type,
          input.component_type,
          input.shortage_deduction_applicable,
          input.overtime_applicable,
          input.limit_applicable,
          input.limit_amount,
          input.process_limit_required,
          input.process_limit_days,
          input.general_ledger,
          input.allow_round_off,
          input.round_off_type,
          input.round_off_amount,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getEarningDeduction = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_earning_deduction_id,earning_deduction_code,earning_deduction_description,\
        short_desc,component_category,calculation_method,component_frequency,calculation_type,\
        component_type,shortage_deduction_applicable, miscellaneous_component, overtime_applicable,limit_applicable,limit_amount,\
        process_limit_required,process_limit_days,general_ledger,allow_round_off,round_off_type,\
        round_off_amount from hims_d_earning_deduction\
        where record_status='A'  order by hims_d_earning_deduction_id desc",

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let updateEarningDeduction = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_earning_deduction_id != "null" &&
      input.hims_d_earning_deduction_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "update hims_d_earning_deduction set  earning_deduction_code=?,earning_deduction_description=?,short_desc=?,\
          component_category=?,calculation_method=?,component_frequency=?,calculation_type=?,\
          component_type=?,shortage_deduction_applicable=?,overtime_applicable=?,limit_applicable=?,\
          limit_amount=?,process_limit_required=?,process_limit_days=?,general_ledger=?,\
          allow_round_off=?,round_off_type=?,round_off_amount=?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_earning_deduction_id = ?",

          [
            input.earning_deduction_code,
            input.earning_deduction_description,
            input.short_desc,
            input.component_category,
            input.calculation_method,
            input.component_frequency,
            input.calculation_type,
            input.component_type,
            input.shortage_deduction_applicable,
            input.overtime_applicable,
            input.limit_applicable,
            input.limit_amount,
            input.process_limit_required,
            input.process_limit_days,
            input.general_ledger,
            input.allow_round_off,
            input.round_off_type,
            input.round_off_amount,

            new Date(),
            input.updated_by,
            input.hims_d_earning_deduction_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by:irfan to delete
let deleteEarningDeduction = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_earning_deduction_id != "null" &&
      input.hims_d_earning_deduction_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_earning_deduction",
          id: req.body.hims_d_earning_deduction_id,
          query:
            "UPDATE hims_d_earning_deduction SET  record_status='I' WHERE hims_d_earning_deduction_id=?",
          values: [req.body.hims_d_earning_deduction_id]
        },
        result => {
          req.records = result;
          next();
        },
        error => {
          next(error);
        },
        true
      );
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:api to
let addEmployeeIdentification = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_employee_identification (employee_id,identity_documents_id,\
          identity_number,valid_upto,issue_date,alert_required,alert_date,\
          created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.employee_id,
          input.identity_documents_id,
          input.identity_number,
          input.valid_upto,
          input.issue_date,
          input.alert_required,
          input.alert_date,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getEmployeeIdentification = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (req.query.employee_id != "null" && req.query.employee_id != undefined) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_employee_identification_id,employee_id,\
        identity_documents_id,identity_number,valid_upto,issue_date,alert_required,\
        alert_date from hims_d_employee_identification\
        where record_status='A' and  employee_id=? order by hims_d_employee_identification_id desc",
          [req.query.employee_id],

          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let updateEmployeeIdentification = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_employee_identification_id != "null" &&
      input.hims_d_employee_identification_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "update hims_d_employee_identification set  identity_documents_id=?,\
          identity_number=?,valid_upto=?,issue_date=?,alert_required=?,alert_date=?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_identification_id = ?",

          [
            input.identity_documents_id,
            input.identity_number,
            input.valid_upto,
            input.issue_date,
            input.alert_required,
            input.alert_date,
            new Date(),
            input.updated_by,
            input.hims_d_employee_identification_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by:irfan to delete
let deleteEmployeeIdentification = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_employee_identification_id != "null" &&
      input.hims_d_employee_identification_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_employee_identification",
          id: req.body.hims_d_employee_identification_id,
          query:
            "UPDATE hims_d_employee_identification SET  record_status='I' WHERE hims_d_employee_identification_id=?",
          values: [req.body.hims_d_employee_identification_id]
        },
        result => {
          if (result.records.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        },
        error => {
          next(error);
        },
        true
      );
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let addLoanMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_loan (loan_code,loan_description,\
          loan_account,loan_limit_type,loan_maximum_amount,\
          created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?)",
        [
          input.loan_code,
          input.loan_description,
          input.loan_account,
          input.loan_limit_type,
          input.loan_maximum_amount,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let getLoanMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_loan_id,loan_code,\
          loan_description,loan_account,loan_limit_type,loan_maximum_amount,loan_status from hims_d_loan\
        where record_status='A' order by hims_d_loan_id desc",

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let updateLoanMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (input.hims_d_loan_id != "null" && input.hims_d_loan_id != undefined) {
      db.getConnection((error, connection) => {
        connection.query(
          "update hims_d_loan set  hims_d_loan_id=?,\
          loan_code=?,loan_description=?,loan_account=?,loan_limit_type=?,loan_maximum_amount=?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_loan_id = ?",

          [
            input.hims_d_loan_id,
            input.loan_code,
            input.loan_description,
            input.loan_account,
            input.loan_limit_type,
            input.loan_maximum_amount,
            new Date(),
            input.updated_by,
            input.hims_d_loan_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let deleteLoanMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (input.hims_d_loan_id != "null" && input.hims_d_loan_id != undefined) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_loan",
          id: req.body.hims_d_loan_id,
          query:
            "UPDATE hims_d_loan SET  record_status='I' WHERE hims_d_loan_id=?",
          values: [req.body.hims_d_loan_id]
        },
        result => {
          if (result.records.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        },
        error => {
          next(error);
        },
        true
      );
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let getEmployeeWorkExperience = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.query);

    let employee_id = "";

    if (input.employee_id != "null" && input.employee_id != undefined) {
      employee_id = input.employee_id;
    } else {
      employee_id = req.userIdentity.employee_id;
    }

    if (employee_id != "" && employee_id != undefined) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_employee_experience_id,employee_id,\
          from_date,to_date,previous_company_name,designation,experience_years, experience_months from hims_d_employee_experience\
          where record_status='A' and employee_id=?",
          employee_id,
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let addEmployeeWorkExperience = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_employee_experience (employee_id, previous_company_name,from_date,\
          to_date,designation,experience_years, experience_months,\
          created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.employee_id,
          input.previous_company_name,
          input.from_date,
          input.to_date,
          input.designation,
          input.experience_years,
          input.experience_months,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let deleteEmployeeWorkExperience = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_employee_experience_id != "null" &&
      input.hims_d_employee_experience_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_employee_experience",
          id: req.body.hims_d_employee_experience_id,
          query:
            "UPDATE hims_d_employee_experience SET  record_status='I' WHERE hims_d_employee_experience_id=?",
          values: [req.body.hims_d_employee_experience_id]
        },
        result => {
          if (result.records.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        },
        error => {
          next(error);
        },
        true
      );
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let updateEmployeeWorkExperience = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_employee_experience_id != "null" &&
      input.hims_d_employee_experience_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "update hims_d_employee_experience set  hims_d_employee_experience_id=?,\
          employee_id=?,from_date=?,to_date=?,previous_company_name=?,designation=?,\
          experience_years=?, experience_months=?, updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_experience_id = ?",

          [
            input.hims_d_employee_experience_id,
            input.employee_id,
            input.from_date,
            input.to_date,
            input.previous_company_name,
            input.designation,
            input.experience_years,
            input.experience_months,
            new Date(),
            input.updated_by,
            input.hims_d_employee_experience_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan

//, created_date, created_by, updated_date, updated_by, record_status

let getEmployeeEducation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.query);

    let employee_id = "";

    if (input.employee_id != "null" && input.employee_id != undefined) {
      employee_id = input.employee_id;
    } else {
      employee_id = req.userIdentity.employee_id;
    }

    if (employee_id != "" && employee_id != undefined) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_employee_education_id,employee_id,\
          qualification,qualitfication_type,year,university from hims_d_employee_education\
          where record_status='A' and employee_id=?",
          employee_id,
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let addEmployeeEducation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT  INTO hims_d_employee_education (employee_id, qualification,qualitfication_type,\
          year,university,\
          created_date,created_by,updated_date,updated_by) values(\
            ?,?,?,?,?,?,?,?,?)",
        [
          input.employee_id,
          input.qualification,
          input.qualitfication_type,
          input.year,
          input.university,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let deleteEmployeeEducation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_employee_education_id != "null" &&
      input.hims_d_employee_education_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_employee_education",
          id: req.body.hims_d_employee_education_id,
          query:
            "UPDATE hims_d_employee_education SET  record_status='I' WHERE hims_d_employee_education_id=?",
          values: [req.body.hims_d_employee_education_id]
        },
        result => {
          if (result.records.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        },
        error => {
          next(error);
        },
        true
      );
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by Adnan
let updateEmployeeEducation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_employee_education_id != "null" &&
      input.hims_d_employee_education_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "update hims_d_employee_education set  hims_d_employee_education_id=?,\
          employee_id=?,qualification=?,qualitfication_type=?,year=?,university=?,\
          updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_employee_education_id = ?",

          [
            input.hims_d_employee_education_id,
            input.employee_id,
            input.qualification,
            input.qualitfication_type,
            input.year,
            input.university,
            new Date(),
            input.updated_by,
            input.hims_d_employee_education_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

let getEmployeeDepartments = (req, res, next) => {
  let employeeWhereCondition = {
    employee_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(employeeWhereCondition, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT ED.hims_d_employee_department_id,ED.employee_id,ED.sub_department_id,ED.category_speciality_id,ED.user_id,\
         ED.services_id,ED.employee_designation_id,ED.reporting_to_id,ED.from_date,ED.to_date,ED.dep_status,\
         CS.hims_m_category_speciality_mappings_id,CS.category_id,CS.speciality_id,\
        CS.category_speciality_status,CS.effective_start_date,CS.effective_end_date \
        from hims_m_employee_department_mappings ED,hims_m_category_speciality_mappings CS\
         Where ED.record_status='A' and CS.record_status='A' \
          and ED.category_speciality_id=CS.hims_m_category_speciality_mappings_id AND " +
          where.condition,
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let getPayrollComponents = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from hims_d_employee_earnings where employee_id = ?; SELECT * from hims_d_employee_deductions where employee_id = ?; \
        SELECT * from hims_d_employee_contributions where employee_id = ?;",
        [input.employee_id, input.employee_id, input.employee_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("result: ", result);

          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let getFamilyIdentification = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from hims_d_employee_identification where employee_id = ?; \
        SELECT * from hims_d_employee_dependents where employee_id = ?;",
        [input.employee_id, input.employee_id, input.employee_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addEmployee,
  addEmployeeMaster,
  getEmployee,
  updateEmployee,
  getEmployeeDetails,
  getEmployeeCategory,
  getDoctorServiceCommission,
  getDoctorServiceTypeCommission,
  addEmployeeGroups,
  getEmployeeGroups,
  updateEmployeeGroup,
  deleteEmployeeGroup,
  addEarningDeduction,
  getEarningDeduction,
  updateEarningDeduction,
  deleteEarningDeduction,
  addEmployeeIdentification,
  getEmployeeIdentification,
  updateEmployeeIdentification,
  deleteEmployeeIdentification,
  addEmployeeInfo,
  addLoanMaster,
  getLoanMaster,
  updateLoanMaster,
  deleteLoanMaster,
  getEmployeeWorkExperience,
  addEmployeeWorkExperience,
  deleteEmployeeWorkExperience,
  updateEmployeeWorkExperience,
  updateEmployeeEducation,
  deleteEmployeeEducation,
  addEmployeeEducation,
  getEmployeeEducation,
  getEmployeeDepartments,
  getPayrollComponents,
  getFamilyIdentification
};
