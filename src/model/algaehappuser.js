import { whereCondition, releaseDBConnection, selectStatement } from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import { logger, debugFunction, debugLog } from "../utils/logging";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

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
let getLoginUserMasterOLD = (req, res, next) => {
  let selectWhere = {
    algaeh_m_role_user_mappings_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    //   SELECT algaeh_m_role_user_mappings_id, user_id,username, user_display_name,\
    //   effective_start_date, role_id, role_code, role_name, role_discreption,  \
    //  app_group_id, app_group_code, app_group_name, app_group_desc\
    //  from algaeh_m_role_user_mappings RU ,algaeh_d_app_user U,algaeh_d_app_group G,\
    //  algaeh_d_app_roles R WHERE  RU.role_id=R.app_d_app_roles_id \
    //  AND R.app_group_id=G.algaeh_d_app_group_id AND RU.user_id=U.algaeh_d_app_user_id

    let adminUSer = "";
    if (req.userIdentity.role_type != "SU") {
      adminUSer = " and   group_type <> 'SU' and role_type <>'SU' ";
    }

    db.getConnection((error, connection) => {
      connection.query(
        "select  algaeh_d_app_user_id,username,user_display_name,user_type,user_status,hims_d_employee_id,\
        employee_code,full_name,role_name,app_group_name,algaeh_m_role_user_mappings_id,\
        hims_m_user_employee_id from  hims_m_user_employee UM inner join hims_d_employee E \
        on UM.employee_id=E.hims_d_employee_id inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id\
        inner join algaeh_m_role_user_mappings RU  on  UM.user_id=RU.user_id inner join algaeh_d_app_roles R on  \
        RU.role_id=R.app_d_app_roles_id inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
        where E.record_status='A' and U.record_status='A' " +
          adminUSer +
          "and " +
          where.condition +
          " order by algaeh_m_role_user_mappings_id desc",
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
let getLoginUserMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.userIdentity.role_type != "GN") {
      let adminUSer = "";
      if (req.userIdentity.role_type != "SU") {
        adminUSer = " and   group_type <> 'SU' and role_type <>'SU' ";
      }

      _mysql
        .executeQuery({
          query:
            "select  algaeh_d_app_user_id,username,user_display_name,user_type,user_status,hims_d_employee_id,\
            employee_code,full_name,role_name,app_group_name,algaeh_m_role_user_mappings_id,\
            hims_m_user_employee_id from  hims_m_user_employee UM \
            inner join algaeh_d_app_user U on UM.user_id=U.algaeh_d_app_user_id\
            inner join hims_d_employee E on U.employee_id=E.hims_d_employee_id\
            inner join algaeh_m_role_user_mappings RU  on  UM.user_id=RU.user_id \
            inner join algaeh_d_app_roles R on  RU.role_id=R.app_d_app_roles_id\
            inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id \
            where E.record_status='A' and U.record_status='A' " +
            adminUSer +
            " order by  algaeh_d_app_user_id desc",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        validUser: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan: to  select un-used user logins
// Not in use
let selectLoginUser = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      let adminUSer = "";
      if (req.userIdentity.role_type == "AD") {
        adminUSer = "  and user_type <>'SU' and user_type <>'AD' ";
      }

      let algaeh_d_app_user_id = "";
      if (
        req.query.algaeh_d_app_user_id != undefined &&
        req.query.algaeh_d_app_user_id != null
      ) {
        algaeh_d_app_user_id = ` and algaeh_d_app_user_id=${
          req.query.algaeh_d_app_user_id
        } `;
      }

      _mysql
        .executeQuery({
          query:
            "select algaeh_d_app_user_id, username, user_display_name,  user_status, user_type from algaeh_d_app_user\
            where algaeh_d_app_user_id not in (select  user_id from \
            hims_m_employee_department_mappings where user_id is not null) \
            and algaeh_d_app_user.record_status='A' and user_status='A'" +
            adminUSer +
            algaeh_d_app_user_id +
            " order by algaeh_d_app_user_id desc",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        validUser: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to
let selectAppGroup = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.userIdentity.role_type != "GN") {
      let adminUSer = "";
      if (req.userIdentity.role_type == "AD") {
        adminUSer = " and   group_type <> 'AD' ";
      }

      let algaeh_d_app_group_id = "";
      if (req.query.algaeh_d_app_group_id > 0) {
        algaeh_d_app_group_id = ` and algaeh_d_app_user_id=${
          req.query.algaeh_d_app_group_id
        } `;
      }

      _mysql
        .executeQuery({
          query:
            "select algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc,\
          group_type, app_group_status  from algaeh_d_app_group where record_status='A'  and group_type <>'SU'  " +
            adminUSer +
            algaeh_d_app_group_id +
            " order by algaeh_d_app_group_id desc",
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        validUser: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
  // let selectWhere = {
  //   algaeh_d_app_group_id: "ALL"
  // };
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;

  //   let where = whereCondition(extend(selectWhere, req.query));

  //   let adminUSer = "";

  //   if (req.userIdentity.role_type == "AD") {
  //     adminUSer = " and   group_type <> 'AD'  and group_type <>'SU' ";
  //   }

  //   db.getConnection((error, connection) => {
  //     if (req.userIdentity.role_type != "GN") {
  //       connection.query(
  //         "select algaeh_d_app_group_id, app_group_code, app_group_name, app_group_desc,\
  //       group_type, app_group_status  from algaeh_d_app_group where record_status='A'\
  //         " +
  //           adminUSer +
  //           " AND" +
  //           where.condition +
  //           " order by algaeh_d_app_group_id desc",
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
  //     } else {
  //       req.records = {
  //         validUser: false,
  //         message: "you dont have admin privilege"
  //       };
  //       next();
  //     }
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan: to
let selectRoles = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      let adminUSer = "";

      if (req.userIdentity.role_type == "AD") {
        adminUSer = " and   role_type <> 'AD' ";
      }

      let group_id = "";
      if (req.query.algaeh_d_app_group_id > 0) {
        group_id = ` and  app_group_id=${req.query.algaeh_d_app_group_id} `;
      }

      _mysql
        .executeQuery({
          query: `select app_d_app_roles_id,G.app_group_name,role_code,role_name,role_discreption,role_type, \
            loan_authorize_privilege, leave_authorize_privilege, edit_monthly_attendance from algaeh_d_app_roles R \
            inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
            where R.record_status='A'   and  role_type <>'SU' ${group_id}            ${adminUSer} \
            order by app_d_app_roles_id desc`,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        validUser: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //
  //   let adminUSer = "";
  //
  //   if (req.userIdentity.role_type == "AD") {
  //     adminUSer = " and   role_type <> 'AD' ";
  //   }
  //
  //   let group_id = "";
  //   if (req.query.algaeh_d_app_group_id > 0) {
  //     group_id = ` and  app_group_id=${req.query.algaeh_d_app_group_id} `;
  //   }
  //
  //   db.getConnection((error, connection) => {
  //     if (req.userIdentity.role_type != "GN") {
  //       connection.query(
  //         `select app_d_app_roles_id,G.app_group_name,role_code,role_name,role_discreption,role_type\
  //         , loan_authorize_privilege, leave_authorize_privilege, edit_monthly_attendance from algaeh_d_app_roles R inner join algaeh_d_app_group G on R.app_group_id=G.algaeh_d_app_group_id\
  //          where R.record_status='A'   and  role_type <>'SU' ${group_id}            ${adminUSer} \
  //            order by app_d_app_roles_id desc`,
  //
  //         (error, result) => {
  //           releaseDBConnection(db, connection);
  //           if (error) {
  //             next(error);
  //           }
  //           req.records = result;
  //           next();
  //         }
  //       );
  //     } else {
  //       req.records = {
  //         validUser: false,
  //         message: "you dont have admin privilege"
  //       };
  //       next();
  //     }
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan: to
let createUserLogin = (req, res, next) => {
  // const _mysql = new algaehMysql();
  try {
    // _mysql.executeQueryWithTransaction()

    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      if (
        req.userIdentity.algaeh_d_app_user_id == "AD" &&
        input.user_type != "AD"
      ) {
        req.records = {
          validUser: false,
          message: "You don't have rights to add this user"
        };
        next();
      } else {
        if (req.userIdentity.role_type != "GN") {
          connection.beginTransaction(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            connection.query(
              "INSERT INTO `algaeh_d_app_user` (username, user_display_name,employee_id, user_type, effective_start_date, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?)",
              [
                input.username,
                input.user_display_name,
                input.employee_id,
                input.user_type,
                new Date(),
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

                if (result.insertId != null && result.insertId != undefined) {
                  connection.query(
                    "INSERT INTO `algaeh_d_app_password` ( userid,password,created_date, created_by, updated_date, updated_by)\
                VALUE(?,md5(?),?,?,?,?)",
                    [
                      result.insertId,
                      "12345",
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

                      if (pwdResult.insertId > 0 && input.role_id > 0) {
                        connection.query(
                          "INSERT INTO `algaeh_m_role_user_mappings` ( user_id,  role_id,created_date, created_by, updated_date, updated_by)\
                      VALUE(?,?,?,?,?,?)",
                          [
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

                            //--------

                            if (
                              finalResult.insertId > 0 &&
                              input.employee_id > 0
                            ) {
                              connection.query(
                                "INSERT INTO `hims_m_user_employee` (user_id,hospital_id,created_by,created_date,updated_by,updated_date)\
                      VALUE(?,?,?,?,?,?)",
                                [
                                  result.insertId,

                                  input.hospital_id,
                                  input.created_by,
                                  new Date(),
                                  input.updated_by,
                                  new Date()
                                ],
                                (error, user_employee_res) => {
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
                                    req.records = user_employee_res;
                                    next();
                                  });
                                }
                              );
                            } else {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                              req.records = {
                                validUser: false,
                                message: "Please Select a employee"
                              };
                              next();
                            }
                            //--------
                          }
                        );
                      } else {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                        req.records = {
                          validUser: false,
                          message: "Please Select a Role"
                        };
                        next();
                      }
                    }
                  );
                } else {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                  req.records = {
                    validUser: false,
                    message: "Please enter valid password"
                  };
                  next();
                }
              }
            );
          });
        } else {
          req.records = {
            validUser: false,
            message: "You don't have Admin Privilege"
          };
          next();
        }
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let changePassword = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (req.userIdentity.algaeh_d_app_user_id > 0) {
        connection.query(
          "select algaeh_d_app_password_id from algaeh_d_app_password  where userid=? and  password=md5(?);",
          [req.userIdentity.algaeh_d_app_user_id, req.body.oldPassword],
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            // req.records = result;
            // next();
            if (result.length > 0) {
              connection.query(
                "update algaeh_d_app_password set password=md5(?),updated_by=?,\
                updated_date=? where userid=?",
                [
                  req.body.password,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id
                ],
                (error, result) => {
                  releaseDBConnection(db, connection);
                  if (error) {
                    next(error);
                  }
                  // req.records = result;
                  // next();

                  if (result.affectedRows > 0) {
                    req.records = result;
                    next();
                  } else {
                    req.records = {
                      validUser: false,
                      message: "Please Provide valid user id"
                    };
                    next();
                  }
                }
              );
            } else {
              releaseDBConnection(db, connection);
              req.records = {
                validUser: false,
                message: "Current password doesn't match"
              };
              next();
            }
          }
        );

        ///------------------
      } else {
        req.records = {
          validUser: false,
          message: "You are not a valid user id"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to
let updateUser = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (
        req.body.algaeh_d_app_user_id > 0 &&
        req.body.user_display_name != null
      ) {
        connection.query(
          "update algaeh_d_app_user set user_display_name=?,user_status=?,updated_date=?,updated_by=? where\
          record_status='A' and algaeh_d_app_user_id=?",
          [
            req.body.user_display_name,
            req.body.user_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            req.body.algaeh_d_app_user_id
          ],
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            releaseDBConnection(db, connection);

            if (result.affectedRows > 0) {
              req.records = result;
            } else {
              req.records = {
                validUser: false,
                message: "Please Provide valid user id"
              };
            }
            next();
          }
        );

        ///------------------
      } else {
        req.records = {
          validUser: false,
          message: "You are not a valid user id"
        };
        next();
      }
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
  getLoginUserMaster,
  changePassword,
  updateUser
};

function generatePwd() {
  return Math.random()
    .toString(36)
    .slice(-8);
}
