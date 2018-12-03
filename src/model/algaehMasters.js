"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { debugLog, debugFunction } from "../utils/logging";

//created by irfan: to add AlgaehGroupMAster
let addAlgaehGroupMAster = (req, res, next) => {
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
        "INSERT INTO `algaeh_d_app_group` (app_group_code, app_group_name, app_group_desc, group_type,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)",
        [
          input.app_group_code,
          input.app_group_name,
          input.app_group_desc,
          input.group_type,
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

//created by irfan: to get master complete modules
let getAlgaehModuleBACKUP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select algaeh_d_module_id, module_name, licence_key  from algaeh_d_app_module\
        where  record_status=md5('A') ",
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let outputArray = [];
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              connection.query(
                "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_id\
                from algaeh_d_app_screens where record_status='A' and  module_id=?",
                [result[i].algaeh_d_module_id],
                (error, screenResult) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }
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
                }
              );
            }
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to get
let getRoleBaseActiveModulesBACKUP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        " select algaeh_m_module_role_privilage_mapping_id, module_id,module_name, icons,module_code,role_id, view_privilege\
        from algaeh_m_module_role_privilage_mapping MRP\
        inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
        where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?",
        [req.userIdentity.role_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let outputArray = [];

          debugLog("roolo:", req.userIdentity.role_id);
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              connection.query(
                "SELECT algaeh_m_screen_role_privilage_mapping_id, privilege_code, privilege_type,\
                module_role_map_id, screen_id,screen_code,screen_name, role_id, delete_privilege, add_privilege, view_privilege, \
                update_privilege, print_privilege, access_email from \
                algaeh_m_screen_role_privilage_mapping SRM inner join algaeh_d_app_screens S \
                on SRM.screen_id=S.algaeh_app_screens_id\
                where SRM.record_status='A' and S.record_status='A' and module_role_map_id=?",
                [result[i].algaeh_m_module_role_privilage_mapping_id],
                (error, screenResult) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }
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
                }
              );
            }
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to get
let getRoleBaseActiveModules = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      let superUser = "";
      //for admin login
      if (req.userIdentity.role_type == "AD") {
        superUser = " and   access_by <> 'SU'";
      }

      new Promise((resolve, reject) => {
        try {
          if (
            req.userIdentity.role_type == "SU" ||
            req.userIdentity.role_type == "AD"
          ) {
            debugLog("ADMIN  if concondition");
            debugLog("role type:", req.userIdentity);

            connection.query(
              "select algaeh_d_module_id, module_name,module_code, icons,other_language  from algaeh_d_app_module\
              where  record_status=md5('A') " +
                superUser,
              (error, result) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                let outputArray = [];
                if (result.length > 0) {
                  for (let i = 0; i < result.length; i++) {
                    connection.query(
                      "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect,other_language, module_id\
                      from algaeh_d_app_screens where record_status='A' and  module_id=?",
                      [result[i].algaeh_d_module_id],
                      (error, screenResult) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }
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
                      }
                    );
                  }
                } else {
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                }
              }
            );
          } else {
            resolve({});
          }
        } catch (e) {
          reject(e);
        }
      }).then(modifyRes => {
        debugLog("genreal  if concondition");
        connection.query(
          " select algaeh_m_module_role_privilage_mapping_id, module_id,module_code,module_name, icons,module_code,other_language,role_id, view_privilege\
        from algaeh_m_module_role_privilage_mapping MRP\
        inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
        where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?",
          [req.userIdentity.role_id],
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            let outputArray = [];

            debugLog("roolo:", req.userIdentity);
            if (result.length > 0) {
              for (let i = 0; i < result.length; i++) {
                connection.query(
                  "SELECT algaeh_m_screen_role_privilage_mapping_id, \
                module_role_map_id, screen_id,screen_code,screen_name,page_to_redirect,other_language, role_id, view_privilege \
                  from \
                algaeh_m_screen_role_privilage_mapping SRM inner join algaeh_d_app_screens S \
                on SRM.screen_id=S.algaeh_app_screens_id\
                where SRM.record_status='A' and S.record_status='A' and module_role_map_id=?",
                  [result[i].algaeh_m_module_role_privilage_mapping_id],
                  (error, screenResult) => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }
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
                  }
                );
              }
            } else {
              releaseDBConnection(db, connection);
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

//created by irfan: to get
let getRoleBaseInActiveComponents = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "SELECT  SERM.view_privilege, screen_element_id,screen_element_code,screen_element_name,component_code,\
        screen_code, module_code from algaeh_m_scrn_elmnt_role_privilage_mapping SERM\
        inner join algaeh_d_app_scrn_elements  SE on SERM.screen_element_id=SE.algaeh_d_app_scrn_elements_id\
        inner join algaeh_d_app_component C on SE.component_id=C.algaeh_d_app_component_id  \
        inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
        inner join  algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
         where SERM.record_status='A' and SE.record_status='A' and  C.record_status='A'\
         and  S.record_status='A' and M.record_status=md5('A') and role_id=?",
        [req.userIdentity.role_id],
        (error, elementsHide) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          connection.query(
            "SELECT module_code,\
            component_code,screen_code from \
            algaeh_m_component_role_privilage_mapping CRM inner join algaeh_d_app_component C\
             on CRM.component_id=C.algaeh_d_app_component_id\
             inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
             inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
             where  CRM.record_status='A' and C.record_status='A' and  M.record_status= md5('A') and \
             S.record_status='A'  and role_id=?",
            [req.userIdentity.role_id],
            (error, componentHide) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }

              releaseDBConnection(db, connection);
              req.records = {
                listOfComponentsToHide: componentHide,
                screenElementsToHide: elementsHide
              };
              next();
            }
          );
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
let addAlgaehModule = (req, res, next) => {
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
        "INSERT INTO `algaeh_d_app_module` (module_code, module_name, licence_key, access_by, icons, other_language,  created_date, created_by, updated_date, updated_by, record_status)\
            VALUE(?,?,?,?,?,?, ?,?,?,?,md5(?))",
        [
          input.module_code,
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
  addAlgaehGroupMAster,
  addAlgaehModule,
  getRoleBaseActiveModules,
  getRoleBaseInActiveComponents
};
