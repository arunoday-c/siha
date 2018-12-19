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
          full_name,arabic_name,employee_designation_id,license_number,sex,date_of_birth,date_of_joining,date_of_leaving,address,\
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
            input.date_of_leaving,
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
            updated_date=?, updated_by=?  WHERE hims_d_employee_group_id = ?",

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
    first_name: "ALL",
    middle_name: "ALL",
    last_name: "ALL",
    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_leaving: "ALL",
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
          "UPDATE hims_d_employee SET employee_code=?,title_id=?,first_name=?,middle_name=?,last_name=?,\
        full_name=?,arabic_name=?,employee_designation_id=?,license_number=?,sex=?,date_of_birth=?,date_of_joining=?\
        ,date_of_leaving=?,address=?,address2=?,pincode=?,city_id=?,state_id=?,country_id=?,primary_contact_no=?,\
        secondary_contact_no=?,email=?,emergancy_contact_person=?,emergancy_contact_no=?,blood_group=?,isdoctor=?,\
        employee_status=?,effective_start_date=?,effective_end_date=?,updated_date=?,updated_by=?,record_status=? WHERE record_status='A' and  hims_d_employee_id=?",
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
            input.date_of_birth,
            input.date_of_joining,
            input.date_of_leaving,
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
            input.effective_start_date,
            input.effective_end_date,
            new Date(),
            input.updated_by,
            input.record_status,
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
                  debugLog("inside 1 then");

                  if (input.updatedeptDetails.length > 0) {
                    debugLog("inside updatedeptDetails");
                    let inputParam = extend([], req.body.updatedeptDetails);
                    let qry = "";

                    for (
                      let i = 0;
                      i < req.body.updatedeptDetails.length;
                      i++
                    ) {
                      qry +=
                        "UPDATE `hims_m_employee_department_mappings` SET employee_id='" +
                        inputParam[i].employee_id +
                        "', services_id='" +
                        inputParam[i].services_id +
                        "', sub_department_id='" +
                        inputParam[i].sub_department_id +
                        "', category_speciality_id='" +
                        inputParam[i].category_speciality_id +
                        "', user_id='" +
                        inputParam[i].user_id +
                        "', record_status='" +
                        inputParam[i].record_status +
                        "', updated_date='" +
                        new Date().toLocaleString() +
                        "',updated_by=\
'" +
                        req.body.updated_by +
                        "' WHERE record_status='A' and hims_d_employee_department_id='" +
                        inputParam[i].hims_d_employee_department_id +
                        "';";
                    }

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
                .then(updateDeptResult => {
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
                      qry +=
                        "UPDATE `hims_m_doctor_service_commission` SET provider_id='" +
                        inputParam[i].provider_id +
                        "', services_id='" +
                        inputParam[i].services_id +
                        "', service_type_id='" +
                        inputParam[i].service_type_id +
                        "', op_cash_commission_percent='" +
                        inputParam[i].op_cash_commission_percent +
                        "', op_credit_commission_percent='" +
                        inputParam[i].op_credit_commission_percent +
                        "', ip_cash_commission_percent='" +
                        inputParam[i].ip_cash_commission_percent +
                        "', ip_credit_commission_percent='" +
                        inputParam[i].ip_credit_commission_percent +
                        "', record_status='" +
                        inputParam[i].record_status +
                        "', updated_date='" +
                        new Date().toLocaleString() +
                        "',updated_by=\
'" +
                        req.body.updated_by +
                        "' WHERE record_status='A' and hims_m_doctor_service_commission_id='" +
                        inputParam[i].hims_m_doctor_service_commission_id +
                        "';";
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
                      qry +=
                        "UPDATE `hims_m_doctor_service_type_commission` SET provider_id='" +
                        inputParam[i].provider_id +
                        "', service_type_id='" +
                        inputParam[i].service_type_id +
                        "', op_cash_comission_percent='" +
                        inputParam[i].op_cash_comission_percent +
                        "', op_credit_comission_percent='" +
                        inputParam[i].op_credit_comission_percent +
                        "', ip_cash_commission_percent='" +
                        inputParam[i].ip_cash_commission_percent +
                        "', ip_credit_commission_percent='" +
                        inputParam[i].ip_credit_commission_percent +
                        "', record_status='" +
                        inputParam[i].record_status +
                        "', updated_date='" +
                        new Date().toLocaleString() +
                        "',updated_by=\
'" +
                        req.body.updated_by +
                        "' WHERE record_status='A' and hims_m_doctor_service_type_commission_id='" +
                        inputParam[i].hims_m_doctor_service_type_commission_id +
                        "';";
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
let getEmployeeDetails = (req, res, next) => {
  let employeeWhereCondition = {
    employee_code: "ALL",
    first_name: "ALL",
    middle_name: "ALL",
    last_name: "ALL",
    sex: "ALL",
    blood_group: "ALL",
    employee_status: "ALL",
    date_of_joining: "ALL",
    date_of_leaving: "ALL",
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
        "SELECT E.hims_d_employee_id,E.employee_code,E.title_id,E.first_name,E.middle_name,E.last_name,E.full_name,E.arabic_name,E.employee_designation_id,\
        E.license_number,E.sex,E.date_of_birth,E.date_of_joining,E.date_of_leaving,E.present_address,E.present_address2,\
        E.present_pincode,E.present_pincode,E.present_state_id,E.present_country_id,\
        E.permanent_address , E.permanent_address2, E.permanent_pincode, E.permanent_city_id, E.permanent_state_id,\
        E.permanent_country_id, E.primary_contact_no, E.secondary_contact_no,E.email,\
        E.emergency_contact_person,E.emergency_contact_no,E.blood_group,\
        E.isdoctor,E.employee_status,E.exclude_machine_data ,E.company_bank_id ,E.employee_bank_name , E.effective_start_date,E.effective_end_date,\
        E.employee_bank_ifsc_code , E.employee_account_number, E.mode_of_payment, E.accomodation_provided,\
         E.late_coming_rule, E.leave_salary_process, E.entitled_daily_ot, E.suspend_salary, E.gratuity_applicable, E.contract_type, E.employee_group_id,\
         E.weekoff_from,E.overtime_group_id, E.reporting_to_id, E.hospital_id,\
        ED.hims_d_employee_department_id,ED.employee_id,ED.sub_department_id,ED.category_speciality_id,ED.user_id,\
         ED.services_id,CS.hims_m_category_speciality_mappings_id,CS.category_id,CS.speciality_id,\
        CS.category_speciality_status,CS.effective_start_date,CS.effective_end_date\
        from hims_d_employee E,hims_m_employee_department_mappings ED,hims_m_category_speciality_mappings CS\
         Where E.record_status='A' and ED.record_status='A' and CS.record_status='A' and E.hims_d_employee_id=ED.employee_id\
          and ED.category_speciality_id=CS.hims_m_category_speciality_mappings_id AND " +
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

module.exports = {
  addEmployee,
  getEmployee,
  updateEmployee,
  getEmployeeDetails,
  getEmployeeCategory,
  getDoctorServiceCommission,
  getDoctorServiceTypeCommission,
  addEmployeeGroups,
  getEmployeeGroups,
  updateEmployeeGroup,
  deleteEmployeeGroup
};
