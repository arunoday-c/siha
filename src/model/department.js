import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} from "../utils";
import httpStatus from "../utils/httpStatus";
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
  created_date: null,
  created_by: null,
  updated_date: null,
  updated_by: null,
  record_status: null,
  sub_department: [subDepartment]
};
let subDepartment = {
  hims_d_sub_department_id: null,
  sub_department_code: null,
  sub_department_name: null,
  sub_department_desc: null,
  department_id: null,
  effective_start_date: null,
  effective_end_date: null,
  sub_department_status: null,
  created_date: null,
  created_by: null,
  updated_date: null,
  updated_by: null,
  record_status: null
};
let addDepartment = (req, res, next) => {
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
             SELECT `hims_d_sub_department_id`, `sub_department_code`, `sub_department_name`\
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
          department.department_status,
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
    next(error);
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

let selectSubDepartment = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let condition = whereCondition(
      extend(subDepartmentWhereCondition, req.query)
    );
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT `hims_d_sub_department_id`, `sub_department_code`\
        , `sub_department_name`, `sub_department_desc`, `department_id`\
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
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let subDepartmentDetails = extend(subDepartment, req.body);
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
        , `sub_department_desc`\
        , `department_id`\
        , `effective_start_date`\
        , `effective_end_date`\
        , `sub_department_status`\
        , `created_date`\
        , `created_by`)VALUE(?,?,?,?,?,?,?,?,?)",
              [
                subDepartmentDetails.sub_department_code,
                subDepartmentDetails.sub_department_name,
                subDepartmentDetails.sub_department_desc,
                subDepartmentDetails.department_id,
                subDepartmentDetails.effective_start_date,
                subDepartmentDetails.effective_end_date,
                subDepartmentDetails.sub_department_status,
                new Date(),
                subDepartmentDetails.created_by
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
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let subDepartmentDetails = extend(subDepartment, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_sub_department`\
   SET `sub_department_name`=?, `sub_department_desc`=?\
   , `effective_start_date`=?, `effective_end_date`=? \
   , `sub_department_status`=?,`updated_date`=?, `updated_by`=?\
   WHERE `record_status`='A' AND `hims_d_sub_department_id`=? ;",
        [
          subDepartmentDetails.sub_department_name,
          subDepartmentDetails.sub_department_desc,
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

module.exports = {
  addDepartment,
  updateDepartment,
  selectDepartment,
  selectSubDepartment,
  addSubDepartment,
  updateSubDepartment,
  deleteDepartment
};
