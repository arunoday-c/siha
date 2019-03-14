"use strict";
import extend from "extend";
import { whereCondition, deleteRecord, releaseDBConnection } from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { debugLog, debugFunction } from "../utils/logging";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

//created by irfan: to add AlgaehGroupMAster
let addAlgaehGroupMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_group` (app_group_code, app_group_name, app_group_desc, created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?)",
          values: [
            input.app_group_code,
            input.app_group_name,
            input.app_group_desc,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ]
          // printQuery: true
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

//created by irfan: to add addAlgaehRoleMAster
let addAlgaehRoleMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_group` (app_group_id, role_code, role_name, role_discreption,\
            ,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)",
          values: [
            input.app_group_id,
            input.role_code,
            input.role_name,
            input.role_discreption,

            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ]
          // printQuery: true
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

//created by irfan: to get
let getRoleBaseActiveModules = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let superUser = "";
    //for admin login
    if (req.userIdentity.role_type == "AD") {
      superUser = " and access_by <> 'SU'";
    }

    new Promise((resolve, reject) => {
      try {
        if (
          (req.userIdentity.role_type == "SU" &&
            req.userIdentity.user_type == "SU") ||
          (req.userIdentity.role_type == "AD" &&
            req.userIdentity.user_type == "AD")
        ) {
          _mysql
            .executeQuery({
              query:
                "select algaeh_d_module_id, module_name,module_code, icons,other_language  from algaeh_d_app_module\
              where  record_status=md5('A') " +
                superUser +
                " order by display_order "
            })
            .then(result => {
              let outputArray = [];
              if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                  _mysql
                    .executeQuery({
                      query:
                        "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect,other_language, module_id\
                    from algaeh_d_app_screens where record_status='A' and  module_id=?",
                      values: [result[i].algaeh_d_module_id]
                    })
                    .then(screenResult => {
                      const obj = {
                        ...result[i],
                        ...{ ScreenList: screenResult }
                      };

                      outputArray.push(obj);
                      if (i == result.length - 1) {
                        req.records = outputArray;
                        _mysql.releaseConnection();
                        next();
                      }
                    })
                    .catch(error => {
                      _mysql.releaseConnection();
                      next(error);
                    });
                }
              }
            })
            .catch(error => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          resolve({});
        }
      } catch (e) {
        reject(e);
      }
    }).then(modifyRes => {
      _mysql
        .executeQuery({
          query:
            " select algaeh_m_module_role_privilage_mapping_id, module_id,module_code,module_name, icons,module_code,other_language,role_id, view_privilege\
          from algaeh_m_module_role_privilage_mapping MRP\
          inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
          where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?",
          values: [req.userIdentity.role_id]
        })
        .then(result => {
          let outputArray = [];

          debugLog("userIdentity:", req.userIdentity);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              _mysql
                .executeQuery({
                  query:
                    "SELECT algaeh_m_screen_role_privilage_mapping_id, \
                  module_role_map_id, screen_id,screen_code,screen_name,page_to_redirect,other_language, role_id, view_privilege \
                    from \
                  algaeh_m_screen_role_privilage_mapping SRM inner join algaeh_d_app_screens S \
                  on SRM.screen_id=S.algaeh_app_screens_id\
                  where SRM.record_status='A' and S.record_status='A' and module_role_map_id=?",
                  values: [result[i].algaeh_m_module_role_privilage_mapping_id]
                })
                .then(screenResult => {
                  const obj = {
                    ...result[i],
                    ...{ ScreenList: screenResult }
                  };

                  outputArray.push(obj);
                  if (i == result.length - 1) {
                    req.records = outputArray;
                    releaseDBConnection(db, connection);
                    next();
                  }
                })
                .catch(error => {
                  _mysql.releaseConnection();
                  next(error);
                });
            }
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to get
let getRoleBaseInActiveComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "SELECT  SERM.view_privilege, screen_element_id,screen_element_code,screen_element_name,component_code,\
        screen_code, module_code from algaeh_m_scrn_elmnt_role_privilage_mapping SERM\
        inner join algaeh_d_app_scrn_elements  SE on SERM.screen_element_id=SE.algaeh_d_app_scrn_elements_id\
        inner join algaeh_d_app_component C on SE.component_id=C.algaeh_d_app_component_id  \
        inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
        inner join  algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
         where SERM.record_status='A' and SE.record_status='A' and  C.record_status='A'\
         and  S.record_status='A' and M.record_status=md5('A') and role_id=?",
        values: [req.userIdentity.role_id]
      })
      .then(elementsHide => {
        _mysql
          .executeQuery({
            query:
              "SELECT module_code,\
        component_code,screen_code from \
        algaeh_m_component_role_privilage_mapping CRM inner join algaeh_d_app_component C\
         on CRM.component_id=C.algaeh_d_app_component_id\
         inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
         inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
         where  CRM.record_status='A' and C.record_status='A' and  M.record_status= md5('A') and \
         S.record_status='A'  and role_id=?",
            values: [req.userIdentity.role_id]
          })
          .then(componentHide => {
            _mysql.releaseConnection();
            req.records = {
              listOfComponentsToHide: componentHide,
              screenElementsToHide: elementsHide
            };
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

//created by irfan: to add
let addAlgaehModule = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_module` (module_code,display_order, module_name, licence_key, access_by, icons, other_language,  created_date, created_by, updated_date, updated_by, record_status)\
          VALUE(?,?,?,?,?,?,?, ?,?,?,?,md5(?))",
          values: [
            input.module_code,
            input.display_order,
            input.module_name,
            input.licence_key,
            input.access_by,
            input.icons,
            input.other_language,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by,
            "A"
          ]
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
let getAlgaehModules = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "select algaeh_d_module_id, module_name,module_code,display_order, icons,other_language  from algaeh_d_app_module\
          where  record_status=md5('A') " +
            superUser +
            " order by algaeh_d_module_id desc"
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

  //   let superUser = "";
  //   //for admin login
  //   if (req.userIdentity.role_type == "AD") {
  //     superUser = " and   access_by <> 'SU'";
  //   }
  //   debugLog("req.userIdentity:", req.userIdentity);
  //   db.getConnection((error, connection) => {
  //     if (req.userIdentity.role_type != "GN") {
  //       connection.query(
  //         "select algaeh_d_module_id, module_name,module_code,display_order, icons,other_language  from algaeh_d_app_module\
  //             where  record_status=md5('A') " +
  //           superUser +
  //           " order by algaeh_d_module_id desc",
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
  //         message: "You don't have admin Privilege"
  //       };
  //       next();
  //     }
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan: to
let updateAlgaehModules = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.body);

      if (
        req.userIdentity.role_type == "SU" &&
        req.userIdentity.group_type == "SU"
      ) {
        if (
          input.hims_f_dental_treatment_id != "null" ||
          input.hims_f_dental_treatment_id != undefined
        ) {
          connection.query(
            "update hims_f_dental_treatment set  scheduled_date=?, distal=?, incisal=?,\
             occlusal=?, mesial=?, buccal=?, labial=?, cervical=?, palatal=?, lingual=?,\
               updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;",
            [
              input.scheduled_date,

              input.distal,
              input.incisal,
              input.occlusal,
              input.mesial,
              input.buccal,
              input.labial,
              input.cervical,
              input.palatal,
              input.lingual,
              new Date(),
              input.updated_by,
              input.hims_f_dental_treatment_id
            ],
            (error, results) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }

              if (results.affectedRows > 0) {
                req.records = results;
                next();
              } else {
                req.records = { affectedRows: 0 };
                next();
              }
            }
          );
        } else {
          releaseDBConnection(db, connection);
          req.records = { invalid_input: true };
          next();
        }
      } else {
        req.records = {
          validUser: false,
          message: "you dont have admin privilege"
        };
        next();
      }
      //----------------------
    });
  } catch (e) {
    next(e);
  }
};

//==========================

//created by irfan: to add
let addAlgaehScreen = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (
      req.userIdentity.role_type == "SU" &&
      req.userIdentity.group_type == "SU"
    ) {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_screens` (screen_code, screen_name, page_to_redirect, module_id, other_language,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?)",
          values: [
            input.screen_code,
            input.screen_name,
            input.page_to_redirect,
            input.module_id,
            input.other_language,

            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ]
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
  //   let input = extend({}, req.body);

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     if (
  //       req.userIdentity.role_type == "SU" &&
  //       req.userIdentity.group_type == "SU"
  //     ) {
  //       connection.query(
  //         "INSERT INTO `algaeh_d_app_screens` (screen_code, screen_name, page_to_redirect, module_id, other_language,  created_date, created_by, updated_date, updated_by)\
  //           VALUE(?,?,?,?,?,?,?,?,?)",
  //         [
  //           input.screen_code,
  //           input.screen_name,
  //           input.page_to_redirect,
  //           input.module_id,
  //           input.other_language,

  //           new Date(),
  //           input.created_by,
  //           new Date(),
  //           input.updated_by
  //         ],
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
let getAlgaehScreens = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_id, other_language  from algaeh_d_app_screens\
          where  record_status='A'" +
            module_id +
            "  order by algaeh_app_screens_id desc "
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

  //   debugLog("req.userIdentity:", req.userIdentity);

  //   let module_id = "";
  //   if (req.query.module_id != undefined && req.query.module_id != null) {
  //     module_id = ` and module_id=${req.query.module_id} `;
  //   }

  //   db.getConnection((error, connection) => {
  //     if (req.userIdentity.role_type != "GN") {
  //       connection.query(
  //         "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_id, other_language  from algaeh_d_app_screens\
  //             where  record_status='A'" +
  //           module_id +
  //           "  order by algaeh_app_screens_id desc ",
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

//created by irfan: to add
let addAlgaehComponent = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (
      req.userIdentity.role_type == "SU" &&
      req.userIdentity.group_type == "SU"
    ) {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_component` (screen_id, component_code, component_name,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?)",
          values: [
            input.screen_id,
            input.component_code,
            input.component_name,

            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ]
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
  //   let input = extend({}, req.body);

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     if (
  //       req.userIdentity.role_type == "SU" &&
  //       req.userIdentity.group_type == "SU"
  //     ) {
  //       connection.query(
  //         "INSERT INTO `algaeh_d_app_component` (screen_id, component_code, component_name,  created_date, created_by, updated_date, updated_by)\
  //           VALUE(?,?,?,?,?,?,?)",
  //         [
  //           input.screen_id,
  //           input.component_code,
  //           input.component_name,

  //           new Date(),
  //           input.created_by,
  //           new Date(),
  //           input.updated_by
  //         ],
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
let getAlgaehComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let screen_id = "";
    if (req.query.screen_id != undefined && req.query.screen_id != null) {
      screen_id = ` and screen_id=${req.query.screen_id} `;
    }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "select  algaeh_d_app_component_id, screen_id, component_code, component_name  from algaeh_d_app_component\
          where  record_status='A' " +
            screen_id +
            " order by algaeh_d_app_component_id desc "
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

  //   let screen_id = "";
  //   if (req.query.screen_id != undefined && req.query.screen_id != null) {
  //     screen_id = ` and screen_id=${req.query.screen_id} `;
  //   }

  //   debugLog("req.userIdentity:", req.userIdentity);
  //   db.getConnection((error, connection) => {
  //     if (req.userIdentity.role_type != "GN") {
  //       connection.query(
  //         "select  algaeh_d_app_component_id, screen_id, component_code, component_name  from algaeh_d_app_component\
  //             where  record_status='A' " +
  //           screen_id +
  //           " order by algaeh_d_app_component_id desc ",
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

//created by irfan: to add
let addAlgaehScreenElement = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (
      req.userIdentity.role_type == "SU" &&
      req.userIdentity.group_type == "SU"
    ) {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_scrn_elements` ( screen_element_code, screen_element_name, component_id, created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?)",
          values: [
            input.screen_element_code,
            input.screen_element_name,
            input.component_id,

            new Date(),
            input.created_by,
            new Date(),
            input.updated_by
          ]
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
  //   let input = extend({}, req.body);

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     if (
  //       req.userIdentity.role_type == "SU" &&
  //       req.userIdentity.group_type == "SU"
  //     ) {
  //       connection.query(
  //         "INSERT INTO `algaeh_d_app_scrn_elements` ( screen_element_code, screen_element_name, component_id, created_date, created_by, updated_date, updated_by)\
  //           VALUE(?,?,?,?,?,?,?)",
  //         [
  //           input.screen_element_code,
  //           input.screen_element_name,
  //           input.component_id,

  //           new Date(),
  //           input.created_by,
  //           new Date(),
  //           input.updated_by
  //         ],
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
let getAlgaehScreenElement = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let component_id = "";
    if (req.query.component_id != undefined && req.query.component_id != null) {
      component_id = ` and component_id=${req.query.component_id} `;
    }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "select  algaeh_d_app_scrn_elements_id, screen_element_code, screen_element_name, component_id  from algaeh_d_app_scrn_elements\
          where  record_status='A' " +
            component_id +
            " order by algaeh_d_app_scrn_elements_id desc"
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
  //   let component_id = "";
  //   if (req.query.component_id != undefined && req.query.component_id != null) {
  //     component_id = ` and component_id=${req.query.component_id} `;
  //   }
  //   debugLog("req.userIdentity:", req.userIdentity);
  //   db.getConnection((error, connection) => {
  //     if (req.userIdentity.role_type != "GN") {
  //       connection.query(
  //         "select  algaeh_d_app_scrn_elements_id, screen_element_code, screen_element_name, component_id  from algaeh_d_app_scrn_elements\
  //             where  record_status='A' " +
  //           component_id +
  //           " order by algaeh_d_app_scrn_elements_id desc",
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

//created by irfan:
let getFormulas = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select algaeh_d_formulas_id, formula_for, formula from algaeh_d_formulas "
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
  //     connection.query(
  //       "select algaeh_d_formulas_id, formula_for, formula from algaeh_d_formulas ",
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;
  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:
let addFormula = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `algaeh_d_formulas` (algaeh_d_formulas_id, formula_for, formula)\
        VALUE(?,?,?)",
        value: [input.algaeh_d_formulas_id, input.formula_for, input.formula]
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let input = extend({}, req.body);

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }

  //     connection.query(
  //       "INSERT INTO `algaeh_d_formulas` (algaeh_d_formulas_id, formula_for, formula)\
  //         VALUE(?,?,?)",
  //       [input.algaeh_d_formulas_id, input.formula_for, input.formula],
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;

  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:
let updateFormula = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "UPDATE algaeh_d_formulas SET algaeh_d_formulas_id = ?, formula_for = ?,\
        formula = ? WHERE algaeh_d_formulas_id =?;",
        value: [
          input.algaeh_d_formulas_id,
          input.formula_for,
          input.formula,
          input.old_formulas_id
        ]
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let input = extend({}, req.body);

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     debugLog("bode:", req.body);
  //     connection.query(
  //       " UPDATE algaeh_d_formulas SET algaeh_d_formulas_id = ?, formula_for = ?,\
  //        formula = ? WHERE algaeh_d_formulas_id =?;",
  //       [
  //         input.algaeh_d_formulas_id,
  //         input.formula_for,
  //         input.formula,
  //         input.old_formulas_id
  //       ],
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;

  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:
let deleteFormula = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    _mysql
      .executeQuery({
        query: "DELETE FROM algaeh_d_formulas WHERE algaeh_d_formulas_id = ?;",
        value: [input.algaeh_d_formulas_id]
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let input = extend({}, req.body);

  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }

  //     connection.query(
  //       " DELETE FROM algaeh_d_formulas WHERE algaeh_d_formulas_id = ?;",
  //       [input.algaeh_d_formulas_id],
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //         req.records = result;

  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//--------ROLE BASE SCREEN ASSIGNMENT---------------
//created by irfan:
let deleteScreenForRole = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "delete from algaeh_m_screen_role_privilage_mapping where\
        algaeh_m_screen_role_privilage_mapping_id=?",
          value: [input.algaeh_m_screen_role_privilage_mapping_id]
        })
        .then(result => {
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            _mysql.releaseConnection();
            req.records = {
              validUser: false,
              message: "invalid input"
            };
            next();
          }
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      _mysql.releaseConnection();
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
  //   let input = extend({}, req.body);

  //   if (req.userIdentity.role_type != "GN") {
  //     db.getConnection((error, connection) => {
  //       if (error) {
  //         next(error);
  //       }
  //       connection.query(
  //         "delete from algaeh_m_screen_role_privilage_mapping where\
  //          algaeh_m_screen_role_privilage_mapping_id=?",
  //         [input.algaeh_m_screen_role_privilage_mapping_id],
  //         (error, result) => {
  //           releaseDBConnection(db, connection);
  //           if (error) {
  //             next(error);
  //           }
  //           if (result.affectedRows > 0) {
  //             req.records = result;
  //             next();
  //           } else {
  //             req.records = {
  //               validUser: false,
  //               message: "invalid input"
  //             };
  //             next();
  //           }
  //         }
  //       );
  //     });
  //   } else {
  //     req.records = {
  //       validUser: false,
  //       message: "you dont have admin privilege"
  //     };
  //     next();
  //   }
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:
let deleteModuleForRole = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQueryWithTransaction({
          query:
            "delete from algaeh_m_screen_role_privilage_mapping where module_role_map_id=?",
          value: [input.algaeh_m_module_role_privilage_mapping_id]
        })
        .then(result => {
          if (result.affectedRows > 0) {
            _mysql
              .executeQuery({
                query:
                  "delete from algaeh_m_module_role_privilage_mapping where\
                algaeh_m_module_role_privilage_mapping_id=?",
                value: [input.algaeh_m_module_role_privilage_mapping_id]
              })
              .then(result => {
                if (moduleResult.affectedRows > 0) {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = moduleResult;
                    next();
                  });
                } else {
                  _mysql.rollBackTransaction(() => {
                    req.records = {
                      validUser: false,
                      message: "invalid input"
                    };
                    next();
                  });
                }
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql.rollBackTransaction(() => {
              req.records = {
                validUser: false,
                message: "invalid input"
              };
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } else {
      _mysql.releaseConnection();
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
  //   let input = extend({}, req.body);

  //   if (req.userIdentity.role_type != "GN") {
  //     db.getConnection((error, connection) => {
  //       if (error) {
  //         next(error);
  //       }

  //       connection.beginTransaction(error => {
  //         if (error) {
  //           connection.rollback(() => {
  //             releaseDBConnection(db, connection);
  //             next(error);
  //           });
  //         }
  //         connection.query(
  //           "delete from algaeh_m_screen_role_privilage_mapping where module_role_map_id=?",
  //           [input.algaeh_m_module_role_privilage_mapping_id],
  //           (error, result) => {
  //             if (error) {
  //               connection.rollback(() => {
  //                 releaseDBConnection(db, connection);
  //                 next(error);
  //               });
  //             }
  //             // req.records = result;
  //             // next();
  //             if (result.affectedRows > 0) {
  //               connection.query(
  //                 "delete from algaeh_m_module_role_privilage_mapping where\
  //                  algaeh_m_module_role_privilage_mapping_id=?",
  //                 [input.algaeh_m_module_role_privilage_mapping_id],
  //                 (error, moduleResult) => {
  //                   if (error) {
  //                     connection.rollback(() => {
  //                       releaseDBConnection(db, connection);
  //                       next(error);
  //                     });
  //                   }
  //                   if (moduleResult.affectedRows > 0) {
  //                     connection.commit(error => {
  //                       if (error) {
  //                         connection.rollback(() => {
  //                           releaseDBConnection(db, connection);
  //                           next(error);
  //                         });
  //                       }

  //                       releaseDBConnection(db, connection);
  //                       req.records = moduleResult;
  //                       next();
  //                     });
  //                   } else {
  //                     connection.rollback(() => {
  //                       releaseDBConnection(db, connection);
  //                     });
  //                     req.records = {
  //                       validUser: false,
  //                       message: "invalid input"
  //                     };
  //                     next();
  //                   }
  //                 }
  //               );
  //             } else {
  //               connection.rollback(() => {
  //                 releaseDBConnection(db, connection);
  //               });
  //               req.records = {
  //                 validUser: false,
  //                 message: "invalid input"
  //               };
  //               next();
  //             }
  //           }
  //         );
  //       });
  //     });
  //   } else {
  //     req.records = {
  //       validUser: false,
  //       message: "you dont have admin privilege"
  //     };
  //     next();
  //   }
  // } catch (e) {
  //   next(e);
  // }
};

module.exports = {
  addAlgaehGroupMAster,
  addAlgaehRoleMAster,
  addAlgaehModule,
  getRoleBaseActiveModules,
  getRoleBaseInActiveComponents,
  getAlgaehModules,
  addAlgaehScreen,
  getAlgaehScreens,
  addAlgaehComponent,
  getAlgaehComponents,
  addAlgaehScreenElement,
  getAlgaehScreenElement,
  getFormulas,
  addFormula,
  updateFormula,
  deleteFormula,
  deleteScreenForRole,
  deleteModuleForRole
};
