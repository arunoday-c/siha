import {
  whereCondition,
  releaseDBConnection,
  selectStatement
  
} from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../utils/logging";

let selectAppUsers = (req, res, next) => {
  let labSection = {
    algaeh_d_app_user_id: "ALL"
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

    let condition = whereCondition(extend(labSection, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `algaeh_d_app_user` WHERE `record_status`='A' AND " +
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

//created by irfan: to  select un-used user logins
let selectLoginUser = (req, res, next) => {
  let selectWhere = {
    algaeh_d_app_user_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * from algaeh_d_app_user where algaeh_d_app_user_id not in (select  user_id from \
          hims_m_employee_department_mappings where user_id is not null) \
          and algaeh_d_app_user.record_status='A' and user_status='A' AND" +
          where.condition +" order by algaeh_d_app_user_id desc",
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

//created by irfan: to  
let selectAppGroup = (req, res, next) => {
  let selectWhere = {
    algaeh_d_app_group_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc,\
        group_type, app_group_status  from algaeh_d_app_group where record_status='A'\
        and group_type <>'SU'   AND" +
          where.condition +" order by algaeh_d_app_group_id desc",
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

//created by irfan: to  
let selectRoles = (req, res, next) => {

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;


    db.getConnection((error, connection) => {
      connection.query(
        "select app_d_app_roles_id, role_code, role_name, role_discreption, super_user\
        from algaeh_d_app_roles where record_status='A' order by app_d_app_roles_id desc" ,
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
let createLoginCredentials = (req, res, next) => {
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
        "INSERT INTO `hims_d_appointment_room` (description, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?)",
        [
          input.description,
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
module.exports = {
  selectAppUsers,
  selectLoginUser,
  selectAppGroup,
  selectRoles
};
