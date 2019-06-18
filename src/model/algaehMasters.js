"use strict";
import extend from "extend";
import { whereCondition, deleteRecord, releaseDBConnection } from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { debugLog, debugFunction } from "../utils/logging";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
import { LINQ } from "node-linq";

//created by irfan: to add AlgaehGroupMAster
let addAlgaehGroupMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_group` (app_group_code, app_group_name, app_group_desc,group_type, created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?)",
          values: [
            input.app_group_code,
            input.app_group_name,
            input.app_group_desc,
            input.group_type,
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

//created by irfan: to
let updateAlgaehGroupMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);

    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_group set app_group_name=?,app_group_desc=?,group_type=?,\
            updated_by=?,updated_date=? where algaeh_d_app_group_id=?",
          values: [
            input.app_group_name,
            input.app_group_desc,
            input.group_type,
            input.updated_by,
            new Date(),
            input.algaeh_d_app_group_id
          ],
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
let deleteAlgaehGroupMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);

    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_group set record_status='I', updated_by=?,updated_date=? where algaeh_d_app_group_id=?",
          values: [input.updated_by, new Date(), input.algaeh_d_app_group_id]
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
      if (req.userIdentity.role_type == "AD" && input.role_type == "AD") {
        req.records = {
          validUser: false,
          message: "You cant add another Admin"
        };
        next();
      } else {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `algaeh_d_app_roles` (app_group_id, role_code, role_name, role_discreption,\
              role_type, loan_authorize_privilege, leave_authorize_privilege, edit_monthly_attendance,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              input.app_group_id,
              input.role_code,
              input.role_name,
              input.role_discreption,
              input.role_type,
              input.loan_authorize_privilege,
              input.leave_authorize_privilege,
              input.edit_monthly_attendance,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
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
      }
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
//created by irfan: to add updateAlgaehRoleMAster
let updateAlgaehRoleMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      if (req.userIdentity.role_type == "AD" && input.role_type == "AD") {
        req.records = {
          validUser: false,
          message: "You cant add another Admin"
        };
        next();
      } else {
        _mysql
          .executeQuery({
            query:
              "update algaeh_d_app_roles set role_name=?,role_discreption=?,role_type=?,\
              loan_authorize_privilege=?, leave_authorize_privilege=?, edit_monthly_attendance=?,updated_by=?, updated_date=?\
              where app_d_app_roles_id=?",
            values: [
              input.role_name,
              input.role_discreption,
              input.role_type,
              input.loan_authorize_privilege,
              input.leave_authorize_privilege,
              input.edit_monthly_attendance,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              input.app_d_app_roles_id
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
      }
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
let deleteAlgaehRoleMAster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);

    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_roles set record_status='I', updated_by=?,updated_date=? where app_d_app_roles_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.app_d_app_roles_id
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
let deleteUserLogin = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);


    // "delete from hims_m_user_employee where  user_id=?;\
    // delete from algaeh_m_role_user_mappings where  user_id=?;\
    // delete from algaeh_d_app_password where  userid=?;\
    // update algaeh_d_app_user set username= concat('DEL-',username),\
    // user_display_name=concat(user_display_name,': empId-',?), record_status='I' ,updated_by=?,updated_date=?\
    // where  algaeh_d_app_user_id=?",

    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_user set user_status='I' ,updated_by=?,updated_date=?\
            where  algaeh_d_app_user_id=?",
          values: [
          
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.user_id
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

//created by irfan: to get
let getRoleBaseActiveModulesOLD = (req, res, next) => {
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
          where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?  order by display_order ",
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
let getRoleBaseActiveModules = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let superUser = "";
    //for admin login
    if (req.userIdentity.role_type == "AD") {
      superUser = " and access_by <> 'SU'";
    }

    let from_assignment = "N";
    let role_id = req.userIdentity.role_id;
    if (req.query.from_assignment == "Y" && req.query.role_id > 0) {
      from_assignment = "Y";
      role_id = req.query.role_id;
    }

    if (
      (req.userIdentity.role_type == "SU" &&
        req.userIdentity.user_type == "SU" &&
        from_assignment == "N") ||
      (req.userIdentity.role_type == "AD" && from_assignment == "N")
    ) {
      _mysql
        .executeQuery({
          query: `select algaeh_d_module_id as module_id, module_name,module_code, icons, other_language, module_plan\
           from algaeh_d_app_module where  record_status=md5('A') ${superUser} order by display_order;
          select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect,S.other_language, module_id
          from algaeh_d_app_module M inner join algaeh_d_app_screens S on M.algaeh_d_module_id =S.module_id
          where  M.record_status=md5('A') and S.record_status='A' ${superUser}  order by display_order `
        })
        .then(result => {
          _mysql.releaseConnection();
          let ResModules = result[0];
          let ResScreen = result[1];

          let outputArray = [];

          if (ResModules.length > 0) {
            for (let i = 0; i < ResModules.length; i++) {
              const obj = {
                ...ResModules[i],
                ScreenList: new LINQ(ResScreen)
                  .Where(w => w.module_id == ResModules[i]["module_id"])
                  .Select(s => {
                    return {
                      screen_id: s.algaeh_app_screens_id,
                      screen_code: s.screen_code,
                      screen_name: s.screen_name,
                      page_to_redirect: s.page_to_redirect,
                      other_language: s.other_language,
                      module_id: s.module_id,
                      module_plan: s.module_plan
                    };
                  })
                  .ToArray()
              };

              outputArray.push(obj);
            }
            req.records = outputArray;
            next();
          } else {
            req.records = [];
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      _mysql
        .executeQuery({
          query:
            "select  algaeh_m_module_role_privilage_mapping_id,module_id,module_code,module_name, module_plan,\
            icons,module_code,other_language, MRP.module_id from algaeh_m_module_role_privilage_mapping MRP\
            inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
            where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?  order by display_order;\
            SELECT algaeh_m_screen_role_privilage_mapping_id, \
            module_role_map_id, screen_id,screen_code,screen_name,page_to_redirect,other_language, SRM.screen_id \
            from algaeh_m_module_role_privilage_mapping MRP inner join \
            algaeh_m_screen_role_privilage_mapping SRM on MRP.algaeh_m_module_role_privilage_mapping_id=SRM.module_role_map_id\
            inner join algaeh_d_app_screens S on SRM.screen_id=S.algaeh_app_screens_id\
            where MRP.record_status='A'  and SRM.record_status='A' and S.record_status='A' and  MRP.role_id =?",
          values: [role_id, role_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          let ResModules = result[0];
          let ResScreen = result[1];

          let outputArray = [];
          // console.log("userIdentity:", req.userIdentity);
          if (ResModules.length > 0) {
            for (let i = 0; i < ResModules.length; i++) {
              const obj = {
                ...ResModules[i],
                ScreenList: new LINQ(ResScreen)
                  .Where(
                    w =>
                      w.module_role_map_id ==
                      ResModules[i]["algaeh_m_module_role_privilage_mapping_id"]
                  )
                  .Select(s => {
                    return {
                      screen_id: s.screen_id,
                      screen_code: s.screen_code,
                      screen_name: s.screen_name,
                      page_to_redirect: s.page_to_redirect,
                      other_language: s.other_language,
                      algaeh_m_screen_role_privilage_mapping_id:
                        s.algaeh_m_screen_role_privilage_mapping_id,
                      module_id: s.module_id,
                      module_plan: s.module_plan
                    };
                  })
                  .ToArray()
              };

              outputArray.push(obj);
            }

            req.records = outputArray;
            next();
          } else {
            req.records = [];
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to get
let getRoleBaseInActiveComponentsOLD = (req, res, next) => {
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

//created by irfan: to get
let getRoleBaseInActiveComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let from_assignment = "N";
    let role_id = req.userIdentity.role_id;
    if (req.query.from_assignment == "Y" && req.query.role_id > 0) {
      from_assignment = "Y";
      role_id = req.query.role_id;
    }

    _mysql
      .executeQuery({
        query:
          "   SELECT algaeh_m_component_role_privilage_mapping_id,module_code,screen_code,component_code,view_privilege from\
          algaeh_m_component_role_privilage_mapping CRM inner join algaeh_d_app_component C\
              on CRM.component_id=C.algaeh_d_app_component_id\
              inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
              inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
              where  CRM.record_status='A' and C.record_status='A' and  M.record_status= md5('A') and\
              S.record_status='A'  and CRM.role_id=?;\
              SELECT   component_role_map_id, screen_element_code,screen_element_name,component_code,\
          screen_code, module_code from algaeh_m_component_role_privilage_mapping CRM   \
          inner join algaeh_m_scrn_elmnt_role_privilage_mapping SERM on \
          CRM.algaeh_m_component_role_privilage_mapping_id=SERM.component_role_map_id \
              inner join algaeh_d_app_scrn_elements  SE on SERM.screen_element_id=SE.algaeh_d_app_scrn_elements_id\
              inner join algaeh_d_app_component C on SE.component_id=C.algaeh_d_app_component_id  \
              inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
              inner join  algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
          where SERM.record_status='A' and SE.record_status='A' and  C.record_status='A'\
          and  S.record_status='A' and M.record_status=md5('A') and CRM.role_id=?",
        values: [role_id, role_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        let components = result[0];
        let elements = result[1];
        let outputArray = [];
        for (let i = 0; i < components.length; i++) {
          if (components[i]["view_privilege"] == "Y") {
            let screenElementsToHide = new LINQ(elements)
              .Where(
                w =>
                  w.component_role_map_id ==
                  components[i]["algaeh_m_component_role_privilage_mapping_id"]
              )
              .Select(s => {
                return {
                  screen_element_code: s.screen_element_code,
                  screen_element_name: s.screen_element_name,
                  component_code: s.component_code,
                  screen_code: s.screen_code,
                  module_code: s.module_code
                };
              })
              .ToArray();

            outputArray.push({
              ...components[i],
              screenElementsToHide: screenElementsToHide
            });
          } else {
            outputArray.push(components[i]);
          }
        }

        req.records = outputArray;
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

//created by irfan: to add
let addAlgaehModule = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_module` (module_code,display_order, module_name, licence_key, access_by, icons, \
              module_plan, other_language,  created_date, created_by, updated_date, updated_by, record_status)\
          VALUE(?,?,?,?,?,?,?, ?,?,?,?,md5(?))",
          values: [
            input.module_code,
            input.display_order,
            input.module_name,
            input.licence_key,
            input.access_by,
            input.icons,
            input.module_plan,
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
    let superUser = "";
    //for admin login
    if (req.userIdentity.role_type == "AD") {
      superUser = " and access_by <> 'SU'";
    }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "select algaeh_d_module_id, module_name,module_code,display_order, icons,other_language, module_plan  from algaeh_d_app_module\
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
};

//created by irfan: to
let updateAlgaehModules = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);

    // //for admin login
    // if (req.userIdentity.role_type == "AD") {
    //   superUser = " and access_by <> 'SU'";
    // }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_module set  display_order=?, module_plan=?, \
          updated_date=?, updated_by=? WHERE `algaeh_d_module_id`=?;",
          values: [
            input.display_order,
            input.module_plan,
            new Date(),
            input.updated_by,
            input.algaeh_d_module_id
          ],
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
      let module_id = "";
      if (req.query.module_id != undefined && req.query.module_id != null) {
        module_id = ` and module_id=${req.query.module_id} `;
      }
      _mysql
        .executeQuery({
          query:
            "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_name,module_code, S.other_language\
            from algaeh_d_app_screens S inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
            where  S.record_status='A' and M.record_status=md5('A') " +
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
};

//created by irfan: to
let updateAlgaehScreen = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);

    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_screens set screen_name=? ,page_to_redirect=?,other_language=?,\
            updated_by=?,updated_date=? where algaeh_app_screens_id=?",
          values: [
            input.screen_name,
            input.page_to_redirect,

            input.other_language,
            input.updated_by,
            new Date(),
            input.algaeh_app_screens_id
          ],
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
let deleteAlgaehScreen = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body);

    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_screens set record_status='I', updated_by=?,updated_date=? where algaeh_app_screens_id=?",
          values: [input.updated_by, new Date(), input.algaeh_app_screens_id]
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

//created by irfan:
let assignScreensBAckup = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let modules = req.body.inputs;
    let execute_query = "";
    if (req.userIdentity.role_type != "GN") {
      if (modules != undefined && modules.length > 0) {
        for (let i = 0; i < modules.length; i++) {
          execute_query += _mysql.mysqlQueryFormat(
            "INSERT INTO `algaeh_m_module_role_privilage_mapping` (module_id, role_id, privilege_description, created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?,?); ",
            [
              modules[i]["module_id"],
              req.body.role_id,
              req.body.privilege_description,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
            ]
          );
        }

        _mysql
          .executeQueryWithTransaction({
            query: execute_query
          })
          .then(headerResult => {
            let execute_detail_query = "";
            if (headerResult.length > 0) {
              for (let k = 0; k < headerResult.length; k++) {
                for (let m = 0; m < modules[k]["screen_ids"].length; m++) {
                  execute_detail_query += _mysql.mysqlQueryFormat(
                    " INSERT INTO `algaeh_m_screen_role_privilage_mapping` (module_role_map_id, screen_id, created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
                    [
                      headerResult[k]["insertId"],
                      modules[k]["screen_ids"][m],
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date()
                    ]
                  );
                }
              }
              _mysql
                .executeQueryWithTransaction({
                  query: execute_detail_query
                })
                .then(detailResult => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = detailResult[0];
                    next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              //inserion error

              _mysql.rollBackTransaction(() => {
                next(error);
              });
              req.records = {
                invalid_input: true,
                message: "insertion error ,send valid input"
              };
              next();
              return;
            }
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please send valid input"
        };
        next();
        return;
      }
    } else {
      req.records = {
        invalid_input: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:
let assignScreens = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let execute_query = "";

    let input = req.body;
    if (req.userIdentity.role_type != "GN") {
      new Promise((resolve, reject) => {
        try {
          if (
            input.delete_modules.length > 0 ||
            input.delete_screens.length > 0 ||
            input.update_screens.length > 0
          ) {
            let qry = "";

            if (input.delete_screens.length > 0) {
              qry += ` delete from algaeh_m_screen_role_privilage_mapping where algaeh_m_screen_role_privilage_mapping_id in (${
                input.delete_screens
              });`;
            }

            if (input.delete_modules.length > 0) {
              qry += ` delete from algaeh_m_screen_role_privilage_mapping where module_role_map_id in ( ${
                input.delete_modules
              });
              delete from algaeh_m_module_role_privilage_mapping where algaeh_m_module_role_privilage_mapping_id in (${
                input.delete_modules
              });`;
            }

            if (input.update_screens.length > 0) {
              for (let i = 0; i < input.update_screens.length; i++) {
                for (
                  let k = 0;
                  k < input.update_screens[i]["insert_screens"].length;
                  k++
                ) {
                  qry += _mysql.mysqlQueryFormat(
                    " INSERT IGNORE INTO `algaeh_m_screen_role_privilage_mapping` (module_role_map_id, screen_id, created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
                    [
                      input.update_screens[i][
                        "algaeh_m_module_role_privilage_mapping_id"
                      ],
                      input.update_screens[i]["insert_screens"][k],
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date()
                    ]
                  );
                }
              }
            }

            _mysql
              .executeQueryWithTransaction({
                query: qry,
                printQuery: true
              })
              .then(deleteResult => {
                resolve(deleteResult);
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      }).then(delRes => {
        //-------------------------

        let modules = req.body.inputs;
        if (modules != undefined && modules.length > 0) {
          for (let i = 0; i < modules.length; i++) {
            execute_query += _mysql.mysqlQueryFormat(
              "INSERT  IGNORE INTO `algaeh_m_module_role_privilage_mapping` (module_id, role_id,  created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
              [
                modules[i]["module_id"],
                req.body.role_id,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ]
            );
          }

          _mysql
            .executeQueryWithTransaction({
              query: execute_query
            })
            .then(firstRes => {
              let execute_detail_query = "";
              let headerResult = [];
              if (firstRes.affectedRows > 0) {
                headerResult.push(firstRes);
              } else {
                headerResult = firstRes;
              }

              if (headerResult.length > 0) {
                for (let k = 0; k < headerResult.length; k++) {
                  for (let m = 0; m < modules[k]["screen_ids"].length; m++) {
                    execute_detail_query += _mysql.mysqlQueryFormat(
                      " INSERT IGNORE INTO `algaeh_m_screen_role_privilage_mapping` (module_role_map_id, screen_id, created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
                      [
                        headerResult[k]["insertId"],
                        modules[k]["screen_ids"][m],
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date()
                      ]
                    );
                  }
                }
                _mysql
                  .executeQueryWithTransaction({
                    query: execute_detail_query,
                    printQuery: true
                  })
                  .then(detailResult => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = detailResult;
                      next();
                    });
                  })
                  .catch(error => {
                    console.log("error:", error);
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              } else {
                //inserion error

                _mysql.rollBackTransaction(() => {
                  console.log("error3:", error);
                  next(error);
                });
                req.records = {
                  invalid_input: true,
                  message: "insertion error ,send valid input"
                };
                next();
                return;
              }
            })
            .catch(error => {
              console.log("error4:", error);
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else if (delRes !== null) {
          //commit

          console.log("wwwww:", "wwwww");
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = delRes;
            next();
          });
        } else {
          console.log("error99:", "error");
          // _mysql.rollBackTransaction(() => {
          //   next(error);
          // });

          req.records = {
            invalid_input: true,
            message: "Please send valid input"
          };
          next();
          return;
        }
      });
    } else {
      req.records = {
        invalid_input: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:
let assignComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let components = req.body.inputs;
    let execute_query = "";
    if (req.userIdentity.role_type != "GN") {
      if (components != undefined && components.length > 0) {
        for (let i = 0; i < components.length; i++) {
          execute_query += _mysql.mysqlQueryFormat(
            "INSERT INTO `algaeh_m_component_role_privilage_mapping` (component_id,role_id,view_privilege, created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?,?); ",
            [
              components[i]["component_id"],
              req.body.role_id,
              components[i]["view_privilege"],
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
            ]
          );
        }

        _mysql
          .executeQueryWithTransaction({
            query: execute_query
          })
          .then(headerResult => {
            let execute_detail_query = "";

            if (headerResult.length > 0) {
              for (let k = 0; k < headerResult.length; k++) {
                if (components[k]["view_privilege"] == "Y") {
                  for (
                    let m = 0;
                    m < components[k]["screen_elements"].length;
                    m++
                  ) {
                    execute_detail_query += _mysql.mysqlQueryFormat(
                      " INSERT INTO `algaeh_m_scrn_elmnt_role_privilage_mapping` (component_role_map_id, screen_element_id, created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
                      [
                        headerResult[k]["insertId"],
                        components[k]["screen_elements"][m],
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date()
                      ]
                    );
                  }
                }
              }
              _mysql
                .executeQueryWithTransaction({
                  query: execute_detail_query
                })
                .then(detailResult => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = detailResult[0];
                    next();
                  });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              //inserion error

              _mysql.rollBackTransaction(() => {
                next(error);
              });
              req.records = {
                invalid_input: true,
                message: "insertion error ,send valid input"
              };
              next();
              return;
            }
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please send valid input"
        };
        next();
        return;
      }
    } else {
      req.records = {
        invalid_input: false,
        message: "you dont have admin privilege"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};


//created by irfan:
let method1 = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  _mysql
    .executeQueryWithTransaction({
      query: " call method1 (?,?)",
      values: [input.amount, req.userIdentity.username],
      printQuery: true
    })
    .then(res2 => {
      _mysql.commitTransaction(() => {
        _mysql.releaseConnection();
        req.records = res2;
        next();
      });
    })
    .catch(e => {
      console.log("error", e);
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    });
};
module.exports = {
  addAlgaehGroupMAster,
  updateAlgaehGroupMAster,
  deleteAlgaehGroupMAster,
  addAlgaehRoleMAster,
  updateAlgaehRoleMAster,
  deleteAlgaehRoleMAster,

  addAlgaehModule,
  getRoleBaseActiveModules,
  getRoleBaseInActiveComponents,
  getAlgaehModules,
  addAlgaehScreen,
  getAlgaehScreens,
  updateAlgaehScreen,
  deleteAlgaehScreen,
  addAlgaehComponent,
  getAlgaehComponents,
  addAlgaehScreenElement,
  getAlgaehScreenElement,
  getFormulas,
  addFormula,
  updateFormula,
  deleteFormula,
  deleteScreenForRole,
  deleteModuleForRole,
  assignScreens,
  assignComponents,
  updateAlgaehModules,
  deleteUserLogin,
  method1
};
