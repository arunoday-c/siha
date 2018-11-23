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

module.exports = {
  selectAppUsers,
  selectLoginUser
};
