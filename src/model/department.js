"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
// import $ from "jquery";
import { logger, debugFunction, debugLog } from "../utils/logging";

let addDepartment = (req, res, next) => {
  let subDepartment = {
    hims_d_sub_department_id: null,
    sub_department_code: null,
    sub_department_name: null,
    sub_department_desc: null,
    department_id: null,
    effective_start_date: null,
    effective_end_date: null,
    sub_department_status: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  let department = {
    hims_d_department_id: null,
    department_code: null,
    department_name: null,
    department_desc: null,
    department_type: null,
    hospital_id: null,
    effective_start_date: null,
    effective_end_date: null,
    department_status: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    sub_department: [subDepartment]
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let departmentDetails = extend(department, req.body);
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
          "INSERT INTO hims_d_department(department_code \
        ,department_name \
        ,department_desc \
        ,department_type \
        ,hospital_id \
        ,effective_start_date \
        ,effective_end_date \
        ,department_status \
        ,created_date \
        ,created_by \
        ) VALUE(?,?,?,?,?,?,?,?,?,?)",
          [
            departmentDetails.department_code,
            departmentDetails.department_name,
            departmentDetails.department_desc,
            departmentDetails.department_type,
            departmentDetails.hospital_id,
            departmentDetails.effective_start_date,
            departmentDetails.effective_end_date,
            departmentDetails.department_status,
            new Date(),
            departmentDetails.created_by
          ],
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            if (result != null) {
              departmentDetails.hims_d_department_id = result.insertId;

              connection.commit(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                connection.query(
                  "SELECT `hims_d_department_id`, `department_code`\
            , `department_name`, `department_desc`, `department_type`, `hospital_id`\
            , `effective_start_date`, `effective_end_date`, `department_status`\
             FROM `hims_d_department` WHERE hims_d_department_id=?;\
             SELECT `hims_d_sub_department_id`, `sub_department_code`, `sub_department_name`,`arabic_sub_department_name`\
             ,`sub_department_desc`, `department_id`, `effective_start_date`\
             , `effective_end_date`, `sub_department_status` FROM `hims_d_sub_department` WHERE department_id=?;",
                  [
                    departmentDetails.hims_d_department_id,
                    departmentDetails.hims_d_department_id
                  ],
                  (error, resultTables) => {
                    releaseDBConnection(db, connection);
                    if (error) {
                      next(error);
                    }
                    req.records = resultTables;
                    next();
                  }
                );
              });
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};
let updateDepartment = (req, res, next) => {
  let department = {
    hims_d_department_id: null,
    department_code: null,
    department_name: null,
    department_desc: null,
    department_type: null,
    hospital_id: null,
    effective_start_date: null,
    effective_end_date: null,
    department_status: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
    sub_department: [subDepartment]
  };

  try {
    debugFunction("updateDepartment");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let departmentDetails = extend(department, req.body);
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
        let queryBuilder =
          "UPDATE `hims_d_department`\
        SET   `department_name`=?, `department_desc`=?, `department_type`=?\
        ,`hospital_id`=?, `effective_start_date`=?, `effective_end_date`=? \
        ,`department_status`=?, `updated_date`=?, `updated_by`=?\
        WHERE record_status='A' AND `hims_d_department_id`=?;";
        let inputs = [
          departmentDetails.department_name,
          departmentDetails.department_desc,
          departmentDetails.department_type,
          departmentDetails.hospital_id,
          departmentDetails.effective_start_date,
          departmentDetails.effective_end_date,
          departmentDetails.department_status,
          new Date(),
          departmentDetails.updated_by,
          departmentDetails.hims_d_department_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
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
            connection.query(
              "SELECT `hims_d_department_id`, `department_code`\
        , `department_name`, `department_desc`, `department_type`, `hospital_id`\
        , `effective_start_date`, `effective_end_date`, `department_status`\
         FROM `hims_d_department` WHERE hims_d_department_id=?;",
              [departmentDetails.hims_d_department_id],
              (error, resultSelect) => {
                releaseDBConnection(db, connection);

                if (error) {
                  next(error);
                }
                req.records = resultSelect;
                next();
              }
            );
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};
let deleteDepartment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_department",
        id: req.body.hims_d_department_id,
        query:
          "UPDATE hims_d_department SET  record_status='I' WHERE hims_d_department_id=?",
        values: [req.body.hims_d_department_id]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      }
    );
  } catch (e) {
    next(e);
  }
};

let departWhereCondition = {
  department_code: "ALL",
  department_name: "ALL",
  department_desc: "ALL",
  department_type: "ALL",
  effective_start_date: "ALL",
  effective_end_date: "ALL",
  department_status: "ALL"
};

let selectDepartment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }
    debugFunction("inside selectDepartment");
    let condition = whereCondition(extend(departWhereCondition, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT `hims_d_department_id`, `department_code`, `department_name`\
    , `department_desc`, `department_type`, `hospital_id`, `effective_start_date`\
    , `effective_end_date`, `department_status`,`created_date` FROM `hims_d_department` WHERE record_status ='A' AND " +
          condition.condition +
          " " +
          pagePaging,
        values: condition.values
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
  } catch (e) {
    next(e);
  }
};

let selectSubDepartment = (req, res, next) => {
  let subDepartmentWhereCondition = {
    hims_d_sub_department_id: "ALL",
    sub_department_code: "ALL",
    sub_department_name: "ALL",
    sub_department_desc: "ALL",
    department_id: "ALL",
    effective_start_date: "ALL",
    effective_end_date: "ALL",
    sub_department_status: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    debugFunction("inside selectSubDepartment");
    let condition = whereCondition(
      extend(subDepartmentWhereCondition, req.query)
    );
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT `hims_d_sub_department_id`, `sub_department_code`\
        , `sub_department_name`, `arabic_sub_department_name`, `sub_department_desc`, `department_id`\
         , `effective_start_date`, `effective_end_date`, `sub_department_status`\
         FROM `hims_d_sub_department` WHERE record_status ='A' AND " +
          condition.condition,
        values: condition.values
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
  } catch (e) {
    next(e);
  }
};

let addSubDepartment = (req, res, next) => {
  // let subDepartment = {
  //   hims_d_sub_department_id: null,
  //   sub_department_code: null,
  //   sub_department_name: null,
  //   sub_department_desc: null,
  //   department_id: null,
  //   effective_start_date: null,
  //   effective_end_date: null,
  //   sub_department_status: null,
  //   created_by: req.userIdentity.algaeh_d_app_user_id,
  //   updated_by: req.userIdentity.algaeh_d_app_user_id
  // };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let subDepartmentDetails = extend({}, req.body);
    ///1
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      //2
      connection.query(
        "SELECT hims_d_department_id from hims_d_department where hims_d_department_id =?",
        [subDepartmentDetails.department_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          if (result.length != 0) {
            connection.query(
              "INSERT INTO hims_d_sub_department(`sub_department_code`\
        , `sub_department_name`\
        , `sub_department_desc`,arabic_sub_department_name\
        , `department_id`\
        , `effective_start_date`\
        , `effective_end_date`\
        , `sub_department_status`\
        , `created_date`\
        , `created_by`,updated_date,updated_by)VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                subDepartmentDetails.sub_department_code,
                subDepartmentDetails.sub_department_name,
                subDepartmentDetails.sub_department_desc,
                subDepartmentDetails.arabic_sub_department_name,
                subDepartmentDetails.department_id,
                subDepartmentDetails.effective_start_date,
                subDepartmentDetails.effective_end_date,
                subDepartmentDetails.sub_department_status,
                new Date(),
                subDepartmentDetails.created_by,
                new Date(),
                subDepartmentDetails.updated_by
              ],
              (error, resdata) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                req.records = resdata;
                next();
              }
            );
          } else {
            next(
              httpStatus.generateError(
                httpStatus.notFound,
                "No such deparment exists"
              )
            );
          }
        }
      );
    });
    //3
  } catch (e) {
    next(e);
  }
};
let updateSubDepartment = (req, res, next) => {
  // let subDepartment = {
  //   hims_d_sub_department_id: null,
  //   sub_department_code: null,
  //   sub_department_name: null,
  //   sub_department_desc: null,
  //   department_id: null,
  //   effective_start_date: null,
  //   effective_end_date: null,
  //   sub_department_status: null,

  //   created_by: req.userIdentity.algaeh_d_app_user_id,

  //   updated_by: req.userIdentity.algaeh_d_app_user_id
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let subDepartmentDetails = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_sub_department`\
   SET `sub_department_name`=?, `sub_department_desc`=?,arabic_sub_department_name=?\
   , `effective_start_date`=?, `effective_end_date`=? \
   , `sub_department_status`=?,`updated_date`=?, `updated_by`=?\
   WHERE `record_status`='A' AND `hims_d_sub_department_id`=? ;",
        [
          subDepartmentDetails.sub_department_name,
          subDepartmentDetails.sub_department_desc,
          subDepartmentDetails.arabic_sub_department_name,
          subDepartmentDetails.effective_start_date,
          subDepartmentDetails.effective_end_date,
          subDepartmentDetails.sub_department_status,
          new Date(),
          subDepartmentDetails.updated_by,
          subDepartmentDetails.hims_d_sub_department_id
        ],
        (error, result) => {
          connection.release();
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

//created by:Noor to get sub departments
let selectdoctors = (req, res, next) => {
  let inputClicnicalNonClinicalDept = {
    department_type: "ALL"
  };
  debugFunction("selectdoctors");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = extend(inputClicnicalNonClinicalDept, req.query);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let connectionString = "";
      if (where.department_type == "CLINICAL") {
        connectionString = " and hims_d_department.department_type='CLINICAL' ";
      } else if (where.department_type == "NON-CLINICAL") {
        connectionString =
          " and hims_d_department.department_type='NON-CLINICAL' ";
      }

      // connection.query(
      //   "select hims_d_sub_department.hims_d_sub_department_id ,sub_department_code,sub_department_name\
      //    ,sub_department_desc, arabic_sub_department_name, hims_d_sub_department.department_id,hims_d_department.department_type \
      //    from hims_d_sub_department,hims_d_department where \
      //    hims_d_sub_department.department_id=hims_d_department.hims_d_department_id \
      //    and hims_d_department.record_status='A' and sub_department_status='A' \
      //    " +
      //     connectionString,
      //   (error, result) => {
      //     if (error) {
      //       connection.release();
      //       next(error);
      //     }
      //     // req.records = result;
      //     //sbdepartment = extend(sbdepartment, result.body);
      //     // console.log(sbdepartment);
      //     //next();
      //   }
      // );

      connection.query(
        "select hims_m_employee_department_mappings.employee_id,\
         hims_m_employee_department_mappings.sub_department_id,\
      concat( hims_d_employee.first_name,' ',\
      hims_d_employee.middle_name,' ',\
      hims_d_employee.last_name) full_name,\
      hims_d_employee.arabic_name,\
      hims_d_employee.services_id,\
      hims_d_sub_department.department_id,\
      hims_d_sub_department.sub_department_name,\
      hims_d_sub_department.arabic_sub_department_name\
      from hims_m_employee_department_mappings,\
      hims_d_employee,hims_d_sub_department,hims_d_department,\
      hims_d_employee_category,hims_m_category_speciality_mappings\
      where\
      hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      and hims_m_employee_department_mappings.employee_id = hims_d_employee.hims_d_employee_id \
      and hims_d_sub_department.hims_d_sub_department_id= hims_m_employee_department_mappings.sub_department_id\
      and hims_m_employee_department_mappings.record_status='A'\
      and hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      and hims_d_sub_department.record_status='A'\
      and hims_d_employee.record_status ='A'\
      and hims_d_sub_department.sub_department_status='A'\
      and hims_d_employee.employee_status='A'\
      and hims_d_department.department_type='CLINICAL'\
      and hims_d_employee.isdoctor='Y'\
      group by hims_m_employee_department_mappings.employee_id,hims_m_employee_department_mappings.sub_department_id;",
        (error, results) => {
          connection.release();
          if (error) {
            next(error);
          }

          let departments = new LINQ(results).GroupBy(g => g.sub_department_id);
          let doctors = new LINQ(results).GroupBy(g => g.employee_id);
          // .SelectMany(s => {
          //   return s;
          // })
          // .ToArray();
          // .Select(s => {
          //   debugLog("log of ", s);
          //   return {
          //     sub_department_id: s.sub_department_id,
          //     sub_department_name: s.sub_department_name,
          //     employee_id: s.employee_id
          //   };
          // });
          //.ToArray();

          req.records = { departments: departments, doctors: doctors };
          //extend(sbdepartment, doctorsInfo);
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan to get sub departments
let selectdoctorsDATA = (req, res, next) => {
  let inputClicnicalNonClinicalDept = {
    department_type: "ALL"
  };
  debugFunction("selectdoctors");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = extend(inputClicnicalNonClinicalDept, req.query);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let connectionString = "";
      if (where.department_type == "CLINICAL") {
        connectionString = " and hims_d_department.department_type='CLINICAL' ";
      } else if (where.department_type == "NON-CLINICAL") {
        connectionString =
          " and hims_d_department.department_type='NON-CLINICAL' ";
      }

      connection.query(
        "select hims_d_sub_department.hims_d_sub_department_id ,sub_department_code,sub_department_name\
         ,sub_department_desc, arabic_sub_department_name, hims_d_sub_department.department_id,hims_d_department.department_type \
         from hims_d_sub_department,hims_d_department where \
         hims_d_sub_department.department_id=hims_d_department.hims_d_department_id \
         and hims_d_department.record_status='A' and sub_department_status='A' \
         " +
          connectionString,
        (error, result) => {
          if (error) {
            connection.release();
            next(error);
          }
          req.records = result;
          //sbdepartment = extend(sbdepartment, result.body);
          // console.log(sbdepartment);
          debugLog("result of sub", result);
          next();
        }
      );

      // connection.query(
      //   "select hims_m_employee_department_mappings.employee_id,\
      //    hims_m_employee_department_mappings.sub_department_id,\
      // concat( hims_d_employee.first_name,' ',\
      // hims_d_employee.middle_name,' ',\
      // hims_d_employee.last_name) full_name,\
      // hims_d_employee.arabic_name,\
      // hims_d_employee.services_id,\
      // hims_d_sub_department.department_id,\
      // hims_d_sub_department.sub_department_name,\
      // hims_d_sub_department.arabic_sub_department_name\
      // from hims_m_employee_department_mappings,\
      // hims_d_employee,hims_d_sub_department,hims_d_department,\
      // hims_d_employee_category,hims_m_category_speciality_mappings\
      // where\
      // hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      // and hims_m_employee_department_mappings.employee_id = hims_d_employee.hims_d_employee_id \
      // and hims_d_sub_department.hims_d_sub_department_id= hims_m_employee_department_mappings.sub_department_id\
      // and hims_m_employee_department_mappings.record_status='A'\
      // and hims_d_department.hims_d_department_id = hims_d_sub_department.department_id\
      // and hims_d_sub_department.record_status='A'\
      // and hims_d_employee.record_status ='A'\
      // and hims_d_sub_department.sub_department_status='A'\
      // and hims_d_employee.employee_status='A'\
      // and hims_d_department.department_type='CLINICAL'\
      // and hims_d_employee.isdoctor='Y'\
      // group by hims_m_employee_department_mappings.employee_id,hims_m_employee_department_mappings.sub_department_id;",
      //   (error, results) => {
      //     connection.release();
      //     if (error) {
      //       next(error);
      //     }

      //     let departments = new LINQ(results).GroupBy(g => g.sub_department_id);
      //     let doctors = new LINQ(results).GroupBy(g => g.employee_id);
      //     // .SelectMany(s => {
      //     //   return s;
      //     // })
      //     // .ToArray();
      //     // .Select(s => {
      //     //   debugLog("log of ", s);
      //     //   return {
      //     //     sub_department_id: s.sub_department_id,
      //     //     sub_department_name: s.sub_department_name,
      //     //     employee_id: s.employee_id
      //     //   };
      //     // });
      //     //.ToArray();

      //     req.records = { departments: departments, doctors: doctors };
      //     //extend(sbdepartment, doctorsInfo);
      //     next();
      //   }
      // );
    });
  } catch (e) {
    next(e);
  }
};
module.exports = {
  addDepartment,
  updateDepartment,
  selectDepartment,
  selectSubDepartment,
  addSubDepartment,
  updateSubDepartment,
  deleteDepartment,
  selectdoctors
};
