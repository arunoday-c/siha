"use strict";
import extend from "extend";
import { deleteRecord, releaseDBConnection, whereCondition } from "../utils";

import httpStatus from "../utils/httpStatus";

import { debugLog } from "../utils/logging";

//created by irfan: to add shift master
let addShiftMaster = (req, res, next) => {
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
        "INSERT INTO `hims_d_shift` (shift_code,shift_description,arabic_name,\
          in_time1, out_time1, in_time2, out_time2,shift_end_day, break, break_start, break_end, shift_abbreviation,\
          created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.shift_code,
          input.shift_description,
          input.arabic_name,
          input.in_time1,
          input.out_time1,
          input.in_time2,
          input.out_time2,
          input.shift_end_day,
          input.break,
          input.break_start,
          input.break_end,
          input.shift_abbreviation,
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
//created by irfan: to addCounterMaster
let addCounterMaster = (req, res, next) => {
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
        "INSERT INTO `hims_d_counter` (counter_code,counter_description,arabic_name,     created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)",
        [
          input.counter_code,
          input.counter_description,
          input.arabic_name,
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

//created by irfan: to getCounterMaster
let getCounterMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_counter_id,counter_code,counter_description,arabic_name,counter_status from \
          hims_d_counter where record_status='A' order by hims_d_counter_id desc;",

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

//created by irfan: to getShiftMaster
let getShiftMaster = (req, res, next) => {
  let selectWhere = {
    hims_d_shift_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_shift_id, shift_code, shift_description, arabic_name, shift_status, in_time1,\
         out_time1, in_time2, out_time2, break, break_start, break_end,shift_end_day, shift_abbreviation, created_date, created_by, updated_date, updated_by, record_status from \
          hims_d_shift where record_status='A' and " +
          where.condition +
          "order by hims_d_shift_id desc",
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

//created by irfan: to updateShiftMaster
let updateShiftMaster = (req, res, next) => {
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
        "UPDATE `hims_d_shift` SET shift_code=?, shift_description=?, arabic_name=?, shift_status=?,\
        in_time1=?, out_time1=?, in_time2=?, out_time2=?,shift_end_day=?,\
        break=?, break_start=?, break_end=?, shift_abbreviation=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_shift_id`=?;",
        [
          input.shift_code,
          input.shift_description,
          input.arabic_name,
          input.shift_status,
          input.in_time1,
          input.out_time1,
          input.in_time2,
          input.out_time2,
          input.shift_end_day,
          input.break,
          input.break_start,
          input.break_end,
          input.shift_abbreviation,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_shift_id
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  updateCounterMaster
let updateCounterMaster = (req, res, next) => {
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
        "UPDATE `hims_d_counter` SET counter_code=?, counter_description=?, arabic_name=?, counter_status=?,\
             updated_date=?, updated_by=? ,`record_status`=? WHERE  `record_status`='A' and `hims_d_counter_id`=?;",
        [
          input.counter_code,
          input.counter_description,
          input.arabic_name,
          input.counter_status,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_d_counter_id
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let getCashiers = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // select algaeh_d_app_group_id,EDM.user_id as cashier_id,G.group_type,hims_d_employee_id,\
    // employee_code,E.full_name as cashier_name from algaeh_d_app_group G \
    // inner join algaeh_m_group_user_mappings GUP\
    // on G.algaeh_d_app_group_id=GUP.app_group_id \
    // inner join hims_m_employee_department_mappings EDM on GUP.user_id=EDM.user_id\
    // inner join hims_d_employee  E on EDM.employee_id=E.hims_d_employee_id\
    // where group_type in('C','FD') order by cashier_id desc;
    db.getConnection((error, connection) => {
      if (req.userIdentity.role_type != "GN") {
        connection.query(
          "select algaeh_d_app_group_id,EDM.user_id as cashier_id,G.group_type,hims_d_employee_id,\
        employee_code,E.full_name as cashier_name          \
        from algaeh_d_app_group G         inner join algaeh_d_app_roles R\
        on G.algaeh_d_app_group_id=R.app_group_id     \
        inner join algaeh_m_role_user_mappings RU on R.app_d_app_roles_id=RU.role_id     \
        inner join hims_m_employee_department_mappings EDM on RU.user_id=EDM.user_id\
        inner join hims_d_employee  E on EDM.employee_id=E.hims_d_employee_id\
        where group_type in('C') order by cashier_id desc",

          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let addCashierToShift = (req, res, next) => {
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
        "INSERT INTO `hims_m_cashier_shift` (cashier_id, shift_id, year,month,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?)",
        [
          input.cashier_id,
          input.shift_id,
          input.year,
          input.month,
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

//created by irfan: to
let getCashiersAndShiftMAP = (req, res, next) => {
  // let selectWhere = {
  //   hims_m_cashier_shift_id: "ALL",
  //   cashier_id: "ALL",
  //   month: "ALL",
  //   year: "ALL"
  // };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let str = "";
    if (req.query.for == "T") {
      str = ` and curdate() between from_date and to_date and CS.cashier_id=${
        req.userIdentity.algaeh_d_app_user_id
      } `;
    }

    //let where = whereCondition(extend(selectWhere, req.query));
    db.getConnection((error, connection) => {
      connection.query(
        `select hims_m_cashier_shift_id ,cashier_id,shift_id,from_date,to_date,\
        E.full_name as cashier_name,shift_description,S.arabic_name\
        from hims_m_cashier_shift CS inner join algaeh_d_app_user U on CS.cashier_id=U.algaeh_d_app_user_id\
        inner join  hims_d_employee E on U.employee_id=E.hims_d_employee_id\
        inner join hims_d_shift S on CS.shift_id=S.hims_d_shift_id\
        where CS.record_status='A' ${str}`,

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

//created by irfan: to
let updateCashiersAndShiftMAP = (req, res, next) => {
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
        "UPDATE `hims_m_cashier_shift` SET  shift_id=?,\
           updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_m_cashier_shift_id`=?;",
        [
          input.shift_id,
          new Date(),
          input.updated_by,
          input.hims_m_cashier_shift_id
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

//created by irfan: to
let deleteCashiersAndShiftMAP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_m_cashier_shift",
        id: req.body.hims_m_cashier_shift_id,
        query:
          "UPDATE hims_m_cashier_shift SET  record_status='I' WHERE hims_m_cashier_shift_id=?",
        values: [req.body.hims_m_cashier_shift_id]
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

module.exports = {
  addShiftMaster,
  addCounterMaster,
  getCounterMaster,
  getShiftMaster,
  updateShiftMaster,
  updateCounterMaster,
  getCashiers,
  addCashierToShift,
  getCashiersAndShiftMAP,
  updateCashiersAndShiftMAP,
  deleteCashiersAndShiftMAP
};
