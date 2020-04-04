import utils from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import algaehMysql from "algaeh-mysql";
import mysql from "mysql";
import _ from "lodash";
import moment from "moment";
const keyPath = require("algaeh-keys/keys");
import algaehMail from "algaeh-utilities/mail-send";
const { whereCondition, releaseDBConnection, selectStatement } = utils;

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
            employee_code,full_name,E.email,E.work_email, role_name,app_group_name,algaeh_m_role_user_mappings_id , app_d_app_roles_id, \
            UM.hospital_id, hims_m_user_employee_id, R.app_group_id, RU.role_id from  hims_m_user_employee UM \
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
        algaeh_d_app_user_id = ` and algaeh_d_app_user_id=${req.query.algaeh_d_app_user_id} `;
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
        algaeh_d_app_group_id = ` and algaeh_d_app_user_id=${req.query.algaeh_d_app_group_id} `;
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

      // if (req.userIdentity.role_type == "AD") {
      //   adminUSer = " and   role_type <> 'AD' ";
      // }

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
let createUserLogin_OLD = (req, res, next) => {
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

      if (req.userIdentity.user_type == "AD" && input.user_type != "AD") {
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
let createUserLogin_old = (req, res, next) => {
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

      if (req.userIdentity.user_type == "AD" && input.user_type == "AD") {
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
                  let new_password = "12345";
                  if (process.env.NODE_ENV == "production") {
                    new_password = generatePwd();
                  }

                  connection.query(
                    "INSERT INTO `algaeh_d_app_password` ( userid,password,created_date, created_by, updated_date, updated_by)\
                VALUE(?,md5(?),?,?,?,?)",
                    [
                      result.insertId,
                      new_password,
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
                                VALUE(?,?,?,?,?,?);\
                                select trim(email)as email  from hims_d_employee where hims_d_employee_id=?;                                ",
                                [
                                  result.insertId,

                                  input.hospital_id,
                                  input.created_by,
                                  new Date(),
                                  input.updated_by,
                                  new Date(),
                                  input.employee_id
                                ],
                                (error, user_employee_res) => {
                                  if (error) {
                                    connection.rollback(() => {
                                      releaseDBConnection(db, connection);
                                      next(error);
                                    });
                                  }

                                  // "production"
                                  if (
                                    user_employee_res[1][0]["email"] != null &&
                                    process.env.NODE_ENV == "production"
                                  ) {
                                    sendMailFunction(
                                      input.username,
                                      new_password,
                                      "",
                                      user_employee_res[1][0]["email"]
                                    )
                                      .then(rs => {
                                        console.log("resultemail:", rs);
                                      })
                                      .catch(e => {
                                        console.log("resultemail:", e);
                                      });

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
                                  } else {
                                    console.log("new_password:", new_password);

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

let createUserLogin = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;

    if (req.userIdentity.user_type == "AD" && input.user_type == "AD") {
      req.records = {
        validUser: false,
        message: "You don't have rights to add this user"
      };
      next();
    } else {
      if (req.userIdentity.role_type != "GN") {
        _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO `algaeh_d_app_user` (username, user_display_name,employee_id,\
                 user_type, effective_start_date,\
                created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?)",
            values: [
              input.username,
              input.user_display_name,
              input.employee_id,
              input.user_type,
              new Date(),
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ],
            printQuery: true
          })
          .then(result => {
            if (result.insertId != null && result.insertId != undefined) {
              let new_password = generatePwd(input.username); //"12345";
              // if (process.env.NODE_ENV == "production") {
              //   new_password = generatePwd();
              // }

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO `algaeh_d_app_password` ( userid,password,created_date, created_by, updated_date, \
                      updated_by) VALUE(?,md5(?),?,?,?,?)",
                  values: [
                    result.insertId,
                    new_password,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id
                  ],
                  printQuery: true
                })
                .then(pwdResult => {
                  if (pwdResult.insertId > 0 && input.role_id > 0) {
                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO `algaeh_m_role_user_mappings` ( user_id,  role_id, created_date, created_by, \
                            updated_date, updated_by) VALUE(?,?,?,?,?,?)",
                        values: [
                          result.insertId,
                          input.role_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id
                        ],
                        printQuery: true
                      })
                      .then(finalResult => {
                        if (finalResult.insertId > 0 && input.employee_id > 0) {
                          const insurtColumns = ["login_user", "hospital_id"];
                          // let strGrnQry = mysql.format(
                          //   "select trim(email)as email  from hims_d_employee where hims_d_employee_id=?;",
                          //   [input.employee_id]
                          // );
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO hims_m_user_employee (??) VALUES ? ; ",
                              // +
                              // strGrnQry,
                              values: input.branch_data,
                              includeValues: insurtColumns,
                              extraValues: {
                                employee_id: input.employee_id,
                                user_id: result.insertId,
                                created_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                                created_date: new Date(),
                                updated_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                                updated_date: new Date()
                              },
                              bulkInsertOrUpdate: true,
                              printQuery: true
                            })
                            .then(user_employee_res => {
                              const email = input.password_email;
                              process.env.NODE_ENV === "production"
                                ? input.password_email
                                : "syednoor.algaeh@gmail.com";
                              if (
                                // user_employee_res[1][0]["email"] != null &&
                                //  process.env.NODE_ENV == "production"
                                email !== ""
                              ) {
                                new algaehMail()
                                  .to(email)
                                  .subject("Login Credentials")
                                  .templateHbs("userWelcome.hbs", {
                                    name: input.username,
                                    Password: new_password
                                  })
                                  .send()
                                  .then(result => {
                                    console.log("Email sent : ", result);
                                  })
                                  .catch(error => {
                                    console.error("Email error", error);
                                  });

                                // sendMailFunction(
                                //   input.username,
                                //   new_password,
                                //   "",
                                //   email

                                // )
                                //   .then(rs => {
                                //     console.log("resultemail:", rs);
                                //   })
                                //   .catch(e => {
                                //     console.log("resultemail:", e);
                                //   });

                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = user_employee_res;
                                  next();
                                });
                              } else {
                                console.log("new_password:", new_password);

                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = user_employee_res;
                                  next();
                                });
                              }
                            })
                            .catch(e => {
                              _mysql.rollBackTransaction(() => {
                                next(e);
                              });
                            });
                        } else {
                          _mysql.rollBackTransaction(() => {
                            req.records = {
                              validUser: false,
                              message: "Please Select a employee"
                            };
                            next();
                          });
                        }
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    _mysql.rollBackTransaction(() => {
                      req.records = {
                        validUser: false,
                        message: "Please Select a Role"
                      };
                      next();
                    });
                  }
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              _mysql.rollBackTransaction(() => {
                req.records = {
                  validUser: false,
                  message: "Please enter valid password"
                };
                next();
              });
            }
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        req.records = {
          validUser: false,
          message: "You don't have Admin Privilege"
        };
        next();
      }
    }
  } catch (e) {
    next(e);
  }
};

let verifyUserNameExists = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const { username, hims_d_employee_id } = req.query;
    // console.log("hims_d_employee_id", hims_d_employee_id);
    _mysql
      .executeQuery({
        query: `select employee_id,username from algaeh_d_app_user where LOWER(username) = LOWER(?)`,
        values: [username],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        const record = result.find(
          f => String(f.employee_id) === hims_d_employee_id
        );
        console.log("record", record);
        req.records =
          result.length !== 0 && record === undefined
            ? false
            : result.length === 0 && record === undefined
            ? true
            : false;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
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
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (input.algaeh_d_app_user_id > 0) {
      _mysql
        .executeQueryWithTransaction({
          query:
            "update algaeh_d_app_user set user_status=?, updated_date=?, updated_by=? where algaeh_d_app_user_id=?;",
          values: [
            input.user_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.algaeh_d_app_user_id
          ],
          printQuery: true
        })
        .then(result => {
          if (result.affectedRows > 0) {
            let strQry = mysql.format(
              "update algaeh_m_role_user_mappings set role_id=?, updated_date=?, updated_by=? \
              where algaeh_m_role_user_mappings_id=?;",
              [
                input.role_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                input.algaeh_m_role_user_mappings_id
              ]
            );
            if (input.delete_branch_data.length > 0) {
              let user_employee_id = _.map(input.delete_branch_data, o => {
                return o.hims_m_user_employee_id;
              });

              strQry += mysql.format(
                "DELETE FROM hims_m_user_employee where hims_m_user_employee_id in (?);",
                [user_employee_id]
              );
            }

            const insurtColumns = ["hospital_id"];
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_m_user_employee (??) VALUES ? ; " + strQry,
                values: input.branch_data,
                includeValues: insurtColumns,
                extraValues: {
                  user_id: input.algaeh_d_app_user_id,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date()
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(user_employee_res => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = user_employee_res;
                  next();
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
            // _mysql
            //   .executeQuery({
            //     query:
            //       "update algaeh_m_role_user_mappings set role_id=?, updated_date=?, updated_by=? \
            //       where algaeh_m_role_user_mappings_id=?; " + strQry,
            //     values: [
            //       input.user_status,
            //       new Date(),
            //       req.userIdentity.algaeh_d_app_user_id,
            //       input.algaeh_d_app_user_id,

            //     ],
            //     printQuery: true
            //   })
            //   .then(result => {
            //     _mysql.releaseConnection();
            //     if (result[0].affectedRows > 0) {
            //       req.records = result;
            //     } else {
            //       req.records = {
            //         validUser: false,
            //         message: "Please Provide valid user id"
            //       };
            //     }
            //     next();
            //   })
            //   .catch(error => {
            //     _mysql.releaseConnection();
            //     next(error);
            //   });
          } else {
            _mysql.releaseConnection();
            req.records = {
              validUser: false,
              message: "Please Provide valid user id"
            };
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        validUser: false,
        message: "Please Provide valid user id"
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

  //   db.getConnection((error, connection) => {
  //     if (
  //       req.body.algaeh_d_app_user_id > 0 &&
  //       req.body.user_display_name != null
  //     ) {
  //       connection.query(
  //         "update algaeh_d_app_user set user_display_name=?,user_status=?,updated_date=?,updated_by=? where\
  //         record_status='A' and algaeh_d_app_user_id=?",
  //         [
  //           req.body.user_display_name,
  //           req.body.user_status,
  //           new Date(),
  //           req.userIdentity.algaeh_d_app_user_id,
  //           req.body.algaeh_d_app_user_id
  //         ],
  //         (error, result) => {
  //           if (error) {
  //             releaseDBConnection(db, connection);
  //             next(error);
  //           }
  //           releaseDBConnection(db, connection);

  //           if (result.affectedRows > 0) {
  //             req.records = result;
  //           } else {
  //             req.records = {
  //               validUser: false,
  //               message: "Please Provide valid user id"
  //             };
  //           }
  //           next();
  //         }
  //       );

  //       ///------------------
  //     } else {
  //       req.records = {
  //         validUser: false,
  //         message: "You are not a valid user id"
  //       };
  //       next();
  //     }
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

let verifyEmployeeEmailID = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const { email_id, hims_d_employee_id } = req.body;
    _mysql
      .executeQuery({
        query: `select employee_code,full_name from hims_d_employee
      where email=? or work_email=?`,
        values: [email_id, email_id]
      })
      .then(result => {
        if (result.length > 0) {
          _mysql.releaseConnection();
          const { full_name, employee_code } = result[0];
          next(
            new Error(
              `Provided is email ID already in use for ${full_name},Employee Code ${employee_code} `
            )
          );
          return;
        }
        _mysql
          .executeQuery({
            query: `update hims_d_employee set work_email=? where hims_d_employee_id =?`,
            values: [email_id, hims_d_employee_id]
          })
          .then(data => {
            _mysql.releaseConnection();
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  selectAppUsers,
  selectLoginUser,
  selectAppGroup,
  selectRoles,
  createUserLogin,
  getLoginUserMaster,
  changePassword,
  updateUser,
  verifyEmployeeEmailID,
  verifyUserNameExists
};

function generatePwd(userName) {
  const first = userName
    .trim()
    .substring(0, 4)
    .toLowerCase();
  const mmyy = moment().format("MMYY");
  return `${first}${mmyy}`;
  // return Math.random()
  //   .toString(36)
  //   .slice(-8);
}

function sendMailFunction(n_name, n_Password, n_from_mail, n_to_mail) {
  return new Promise((resolve, reject) => {
    const nodemailer = require("nodemailer");
    const hbs = require("nodemailer-express-handlebars");
    const mydata = {
      name: n_name,
      Password: n_Password
    };
    const proxy =
      process.env.EMAIL_PROXY === undefined
        ? {}
        : { proxy: process.env.EMAIL_PROXY };
    const pass =
      process.env.EMAIL_PASS === undefined
        ? "heagla100%"
        : process.env.EMAIL_PASS;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: "false",
      port: 465,
      auth: {
        user: "we@algaeh.com",
        pass: pass
      }
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".handlebars",
          partialsDir: "./src/model/views/",
          layoutsDir: "./src/model/views/",
          defaultLayout: "index.handlebars"
        },
        viewPath: "./src/model/views/"
      })
    );

    let mailOptions = {
      from: "we@algaeh.com",
      to: n_to_mail,
      subject: "HRMS Application Credentials",
      template: "index",
      context: {
        name: mydata.name,
        Password: mydata.Password
      }
    };

    transporter.sendMail(mailOptions, function(e, r) {
      transporter.close();
      if (e) {
        console.log(e);
        const data = {
          error: true,
          message: e
        };
        reject(data);
      } else {
        //console.log(r);
        const data = {
          error: false,
          message: "Password is sent to your email"
        };

        resolve(data);
      }
    });
  });
}
