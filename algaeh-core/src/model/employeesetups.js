import extend from "extend";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";
import utils from "../utils";

const {
  selectStatement,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} = utils;
const { debugLog } = logUtils;

let getDesignations = (req, res, next) => {
  let desgn = {
    hims_d_designation_id: "ALL"
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

    let condition = whereCondition(extend(desgn, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT hims_d_designation_id, designation_code, designation , created_date FROM `hims_d_designation` WHERE `record_status`='A' AND " +
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
//created by irfan:api to
let addDesignation = (req, res, next) => {
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
        "INSERT  INTO hims_d_designation (designation_code, designation, \
          created_date,created_by,updated_date,updated_by) values(\
          ?,?,?,?,?,?)",
        [
          input.designation_code,
          input.designation,
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
//created by:irfan to delete
let deleteDesignation = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_designation_id != "null" &&
      input.hims_d_designation_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_designation",
          id: req.body.hims_d_designation_id,
          query:
            "UPDATE hims_d_designation SET  record_status='I' WHERE hims_d_designation_id=?",
          values: [req.body.hims_d_designation_id]
        },
        result => {
          if (result.records.affectedRows > 0) {
            debugLog("result", result);
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };

            debugLog("els");
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
let getEmpSpeciality = (req, res, next) => {
  let select = {
    hims_d_employee_speciality_id: "ALL",
    sub_department_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let condition = whereCondition(extend(select, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT hims_d_employee_speciality_id, sub_department_id, speciality_code, speciality_name, \
          arabic_name, speciality_desc, speciality_status FROM `hims_d_employee_speciality` WHERE `record_status`='A' AND " +
          condition.condition +
          " order by hims_d_employee_speciality_id desc ",
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

let getEmpCategory = (req, res, next) => {
  let select = {
    hims_employee_category_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let condition = whereCondition(extend(select, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT hims_employee_category_id, employee_category_code, employee_category_name, arabic_name,\
           employee_category_desc, employee_category_status\
          FROM `hims_d_employee_category` WHERE `record_status`='A' AND " +
          condition.condition +
          " order by hims_employee_category_id desc ",
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

//created by adnan to get overtime groups
let getOvertimeGroups = (req, res, next) => {
  let select = {
    hims_d_overtime_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let condition = whereCondition(extend(select, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT hims_d_overtime_group_id, overtime_group_code, overtime_group_description, overtime_group_status,\
          working_day_hour, weekoff_day_hour, holiday_hour, working_day_rate , weekoff_day_rate, holiday_rate,\
          payment_type\
          FROM `hims_d_overtime_group` WHERE `record_status`='A' AND " +
          condition.condition +
          " order by hims_d_overtime_group_id desc ",
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

//created by adnan to add overtime groups
let addOvertimeGroups = (req, res, next) => {
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
        "INSERT  INTO hims_d_overtime_group (overtime_group_code, overtime_group_description,\
          working_day_hour, weekoff_day_hour, holiday_hour, working_day_rate , weekoff_day_rate, holiday_rate, payment_type,\
          created_date,created_by,updated_date,updated_by) values(\
          ?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.overtime_group_code,
          input.overtime_group_description,
          input.working_day_hour,
          input.weekoff_day_hour,
          input.holiday_hour,
          input.working_day_rate,
          input.weekoff_day_rate,
          input.holiday_rate,
          input.payment_type,
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

//created by adnan to delete overtime groups
let deleteOvertimeGroups = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    if (
      input.hims_d_overtime_group_id != "null" &&
      input.hims_d_overtime_group_id != undefined
    ) {
      deleteRecord(
        {
          db: req.db,
          tableName: "hims_d_overtime_group",
          id: req.body.hims_d_overtime_group_id,
          query:
            "UPDATE hims_d_overtime_group SET  record_status='I' WHERE hims_d_overtime_group_id=?",
          values: [req.body.hims_d_overtime_group_id]
        },
        result => {
          if (result.records.affectedRows > 0) {
            debugLog("result", result);
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };

            debugLog("els");
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

let updateOvertimeGroups = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_overtime_group_id != "null" &&
      input.hims_d_overtime_group_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_d_overtime_group SET overtime_group_code = ?,\
          overtime_group_description = ?, working_day_hour = ?, weekoff_day_hour = ?, holiday_hour = ? , working_day_rate = ?,\
          weekoff_day_rate = ?, holiday_rate = ?, payment_type = ?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_overtime_group_id = ?",

          [
            input.overtime_group_code,
            input.overtime_group_description,
            input.working_day_hour,
            input.weekoff_day_hour,
            input.holiday_hour,
            input.working_day_rate,
            input.weekoff_day_rate,
            input.holiday_rate,
            input.payment_type,
            new Date(),
            input.updated_by,
            input.hims_d_overtime_group_id
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

export default {
  getDesignations,
  getEmpSpeciality,
  getEmpCategory,
  addDesignation,
  deleteDesignation,
  getOvertimeGroups,
  addOvertimeGroups,
  deleteOvertimeGroups,
  updateOvertimeGroups
};
