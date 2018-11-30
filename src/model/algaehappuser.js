import { whereCondition, releaseDBConnection, selectStatement } from "../utils";
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
          " order by algaeh_d_app_user_id desc " +
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

//created by irfan: to
let getLoginUserMaster = (req, res, next) => {
  let selectWhere = {
    algaeh_m_group_user_mappings_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT algaeh_m_group_user_mappings_id, app_group_id,app_group_name, user_id, username,\
        user_display_name, effective_start_date, role_id,role_name\
        from algaeh_m_group_user_mappings GUM ,algaeh_d_app_user U,algaeh_d_app_group G,algaeh_d_app_roles R\
        where GUM.user_id=U.algaeh_d_app_user_id and GUM.app_group_id=G.algaeh_d_app_group_id\
        and GUM.role_id=R.app_d_app_roles_id and  GUM.record_status='A' and U.record_status='A' \
        and G.record_status='A' and R.record_status='A' and " +
          where.condition +
          " order by algaeh_m_group_user_mappings_id desc",
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
          where.condition +
          " order by algaeh_d_app_user_id desc",
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

    let adminUSer = "";

    if (req.userIdentity.role_type == "AD") {
      adminUSer = " and   group_type <> 'AD'";
    }

    db.getConnection((error, connection) => {
      connection.query(
        "select algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc,\
        group_type, app_group_status  from algaeh_d_app_group where record_status='A'\
        and group_type <>'SU'  " +
          adminUSer +
          " AND" +
          where.condition +
          " order by algaeh_d_app_group_id desc",
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

    let adminUSer = "";

    if (req.userIdentity.role_type == "AD") {
      adminUSer = " and   role_type <> 'AD'";
    }
    debugLog("dd:", req.userIdentity);
    db.getConnection((error, connection) => {
      if (req.userIdentity.role_type != "GN") {
        connection.query(
          "select app_d_app_roles_id, role_code, role_name, role_discreption, role_type\
        from algaeh_d_app_roles where record_status='A' and  role_type <>'SU' " +
            adminUSer +
            " order by app_d_app_roles_id desc",
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
let createUserLogin = (req, res, next) => {
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
          "INSERT INTO `algaeh_d_app_user` (username,user_display_name,effective_start_date, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?)",
          [
            input.username,
            input.user_display_name,
            input.effective_start_date,
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
            debugLog("result:", result);
            if (result.insertId != null && result.insertId != undefined) {
              connection.query(
                "INSERT INTO `algaeh_d_app_password` ( userid,password,created_date, created_by, updated_date, updated_by)\
                VALUE(?,md5(?),?,?,?,?)",
                [
                  result.insertId,
                  input.password,
                  new Date(),
                  input.created_by,
                  new Date(),
                  input.updated_by
                ],
                (error, pwdResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  debugLog("pwdResult:", pwdResult);
                  if (
                    pwdResult.insertId != null &&
                    pwdResult.insertId != undefined
                  ) {
                    connection.query(
                      "INSERT INTO `algaeh_m_group_user_mappings` ( app_group_id, user_id, role_id,created_date, created_by, updated_date, updated_by)\
                      VALUE(?,?,?,?,?,?,?)",
                      [
                        input.app_group_id,
                        result.insertId,
                        input.role_id,
                        new Date(),
                        input.created_by,
                        new Date(),
                        input.updated_by
                      ],
                      (error, finalResult) => {
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
                          req.records = finalResult;
                          next();
                        });
                      }
                    );
                  } else {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                    req.records = pwdResult;
                    next();
                  }
                }
              );
            } else {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
              req.records = result;
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
module.exports = {
  selectAppUsers,
  selectLoginUser,
  selectAppGroup,
  selectRoles,
  createUserLogin,
  getLoginUserMaster
};
