"use strict";
import extend from "extend";
import utils from "../utils";
//import moment from "moment";
import logUtils from "../utils/logging";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
import { LINQ } from "node-linq";
import _ from "lodash";
const { debugLog } = logUtils;
const { releaseDBConnection } = utils;

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
              where  record_status='A'" +
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
          where MRP.record_status='A' and M.record_status='A' and MRP.role_id=?  order by display_order ",
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
    const { role_type, role_id } = req.userIdentity;
    const { from_assignment } = req.query;
    let _roleId = role_id;
    let strQuery = "";
    if (from_assignment === "Y") {
      _roleId = req.query.role_id;
    }

    if (
      (role_type === "SU" && from_assignment === undefined) ||
      from_assignment === "N"
      // ||
      // (role_type === "AD" && from_assignment === undefined) ||
      // from_assignment === "N"
    ) {
      strQuery = `select m.algaeh_d_module_id,m.module_code,m.module_name,m.icons,m.display_order,m.other_language,
      s.algaeh_app_screens_id,s.screen_code,s.screen_name,s.page_to_redirect,s.redirect_url,
      s.other_language as s_other_language,s.child_pages,'' as algaeh_d_app_component_id,'' as component_code,
      '' as component_name,'' as comp_view_previlage,'' as ele_view_previlage,'' as ele_extra_props,
      '' as screen_element_code,'' as screen_element_name,algaeh_app_screens_id as screen_id
      from algaeh_d_app_module as m inner join algaeh_d_app_screens as s
      on s.module_id = m.algaeh_d_module_id  ${
        role_type === "SU"
          ? ""
          : "where m.access_by <> 'SU' and m.record_status='A' and s.record_status='A'"
      }`;
    } else {
      strQuery = `select m.algaeh_d_module_id,m.module_code,m.module_name,m.icons,m.display_order,m.other_language,
      s.algaeh_app_screens_id,s.screen_code,s.screen_name,s.page_to_redirect,s.redirect_url,
      s.other_language as s_other_language,s.child_pages,c.algaeh_d_app_component_id,c.component_code,c.component_name,
      cs.view_privilege as comp_view_previlage,se.view_type as ele_view_previlage,se.extra_props as ele_extra_props,
      e.screen_element_code,e.screen_element_name,sr.screen_id,sr.algaeh_m_screen_role_privilage_mapping_id,
      se.algaeh_d_app_scrn_elements_id,e.props_type,e.extra_props
      from algaeh_m_module_role_privilage_mapping as mr inner 
      join algaeh_d_app_module as  m
      on mr.module_id=m.algaeh_d_module_id and m.record_status = 'A' inner join algaeh_m_screen_role_privilage_mapping as sr
      on  sr.module_role_map_id = mr.algaeh_m_module_role_privilage_mapping_id inner join algaeh_d_app_screens as s
      on s.algaeh_app_screens_id=sr.screen_id and s.record_status='A' left join algaeh_m_component_screen_privilage_mapping as cs
      on cs.algaeh_m_screen_role_privilage_mapping_id =sr.algaeh_m_screen_role_privilage_mapping_id
      left join algaeh_d_app_component as c on c.algaeh_d_app_component_id =cs.component_id
      left join screen_element_scren_module_mapping as se on 
      se.role_id = mr.role_id
      left join algaeh_d_app_scrn_elements as e on e.algaeh_d_app_scrn_elements_id = se.algaeh_d_app_scrn_elements_id
      where mr.role_id=${_roleId} and mr.record_status ='A'  and m.access_by <> 'SU';`;
    }

    _mysql
      .executeQuery({
        query: strQuery,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        if (result.length === 0) {
          req.records = [];
          next();
          return;
        }
        const elements = _.chain(result)
          .groupBy(g => g.algaeh_d_app_scrn_elements_id)
          .map(element => {
            const {
              ele_extra_props,
              ele_view_previlage,
              screen_element_code,
              props_type,
              extra_props
            } = _.head(element);
            let stages = [];

            if (props_type === "S" && ele_view_previlage !== "") {
              const original =
                extra_props !== null ? extra_props.split(",") : [];
              const userStage =
                ele_extra_props !== null ? ele_extra_props.split(",") : [];
              original.forEach((st, stIdx) => {
                const hasStage = userStage.find(t => t === st);
                if (hasStage === undefined) {
                  stages.push({
                    value: stIdx,
                    text: st
                  });
                }
              });
            }
            return {
              screen_element_code,
              props_type,
              ele_view_previlage,
              stages
            };
          })
          .value();

        const records = _.chain(result)
          .groupBy(g => g.algaeh_d_module_id)
          .map(function(detail, key) {
            const first = _.head(detail);
            return {
              module_id: key,
              order: first.display_order,
              module_name: first.module_name,
              module_code: first.module_code,
              icons: first.icons,
              other_language: first.other_language,
              module_plan: first.module_plan,
              ScreenList: _.chain(detail)
                .groupBy(sg => sg.algaeh_app_screens_id)
                .map(screens => {
                  const sec = _.head(screens);
                  const {
                    algaeh_d_module_id,
                    algaeh_m_screen_role_privilage_mapping_id,
                    algaeh_app_screens_id,
                    module_code,
                    module_name,
                    page_to_redirect,
                    s_other_language,
                    screen_code,
                    screen_name,
                    screen_id,
                    redirect_url,
                    algaeh_d_app_scrn_elements_id,
                    child_pages
                  } = sec;

                  return {
                    algaeh_d_module_id,
                    algaeh_m_screen_role_privilage_mapping_id,
                    algaeh_app_screens_id,
                    module_code,
                    module_name,
                    page_to_redirect,
                    s_other_language,
                    screen_code,
                    screen_name,
                    screen_id,
                    redirect_url,
                    child_pages:
                      child_pages !== null ? child_pages.split(",") : [],
                    other_language: sec.s_other_language,
                    components: _.chain(screens)
                      .filter(f => f.algaeh_d_app_component_id !== null)
                      .groupBy(c => c.algaeh_d_app_component_id)
                      .map(comp => {
                        const third = _.head(comp);
                        const {
                          algaeh_d_app_component_id,
                          component_code,
                          component_name,
                          comp_view_previlage,
                          algaeh_app_screens_id,
                          algaeh_d_module_id,
                          algaeh_m_screen_role_privilage_mapping_id
                        } = third;
                        return {
                          algaeh_d_app_component_id,
                          component_code,
                          component_name,
                          comp_view_previlage,
                          algaeh_app_screens_id,
                          algaeh_d_module_id,
                          algaeh_m_screen_role_privilage_mapping_id
                        };
                      })
                  };
                })
              //   detail.map(m => {
              //   return {
              //     ...m,
              //     other_language: m.s_other_language
              //   };
              // })
            };
          })
          .value()
          .sort((a, b) => {
            return a.order - b.order;
          });
        req.records = { result: records, elements };
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });

    //for admin login
    // if (req.userIdentity.role_type == "AD") {
    //   superUser = " and access_by <> 'SU'";
    // }
    // let from_assignment = "N";
    // let role_id = req.userIdentity.role_id;
    // if (req.query.from_assignment == "Y" && req.query.role_id > 0) {
    //   from_assignment = "Y";
    //   role_id = req.query.role_id;
    // }

    // if (
    //   (req.userIdentity.role_type == "SU" &&
    //     req.userIdentity.user_type == "SU" &&
    //     from_assignment == "N") ||
    //   (req.userIdentity.role_type == "AD" && from_assignment == "N")
    // ) {
    //   _mysql
    //     .executeQuery({
    //       query: `select algaeh_d_module_id as module_id, module_name,module_code, icons, other_language, module_plan\
    //        from algaeh_d_app_module where  record_status=md5('A') ${superUser} order by display_order;
    //       select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect,S.other_language, module_id
    //       from algaeh_d_app_module M inner join algaeh_d_app_screens S on M.algaeh_d_module_id =S.module_id
    //       where  M.record_status=md5('A') and S.record_status='A' ${superUser}  order by display_order `,
    //       printQuery: true
    //     })
    //     .then(result => {
    //       _mysql.releaseConnection();
    //       let ResModules = result[0];
    //       let ResScreen = result[1];

    //       let outputArray = [];

    //       if (ResModules.length > 0) {
    //         for (let i = 0; i < ResModules.length; i++) {
    //           const obj = {
    //             ...ResModules[i],
    //             ScreenList: new LINQ(ResScreen)
    //               .Where(w => w.module_id == ResModules[i]["module_id"])
    //               .Select(s => {
    //                 return {
    //                   screen_id: s.algaeh_app_screens_id,
    //                   screen_code: s.screen_code,
    //                   screen_name: s.screen_name,
    //                   page_to_redirect: s.page_to_redirect,
    //                   other_language: s.other_language,
    //                   module_id: s.module_id,
    //                   module_plan: s.module_plan
    //                 };
    //               })
    //               .ToArray()
    //           };

    //           outputArray.push(obj);
    //         }
    //         req.records = outputArray;
    //         next();
    //       } else {
    //         req.records = [];
    //         next();
    //       }
    //     })
    //     .catch(error => {
    //       _mysql.releaseConnection();
    //       next(error);
    //     });
    // } else {
    //   _mysql
    //     .executeQuery({
    //       query:
    //         "select  algaeh_m_module_role_privilage_mapping_id,module_id,module_code,module_name, module_plan,\
    //         icons,module_code,other_language, MRP.module_id from algaeh_m_module_role_privilage_mapping MRP\
    //         inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
    //         where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?  order by display_order;\
    //         SELECT algaeh_m_screen_role_privilage_mapping_id, \
    //         module_role_map_id, screen_id,screen_code,screen_name,page_to_redirect,other_language, SRM.screen_id \
    //         from algaeh_m_module_role_privilage_mapping MRP inner join \
    //         algaeh_m_screen_role_privilage_mapping SRM on MRP.algaeh_m_module_role_privilage_mapping_id=SRM.module_role_map_id\
    //         inner join algaeh_d_app_screens S on SRM.screen_id=S.algaeh_app_screens_id\
    //         where MRP.record_status='A'  and SRM.record_status='A' and S.record_status='A' and  MRP.role_id =?",
    //       values: [role_id, role_id],
    //       printQuery: true
    //     })
    //     .then(result => {
    //       _mysql.releaseConnection();
    //       let ResModules = result[0];
    //       let ResScreen = result[1];

    //       let outputArray = [];
    //       if (ResModules.length > 0) {
    //         for (let i = 0; i < ResModules.length; i++) {
    //           const obj = {
    //             ...ResModules[i],
    //             ScreenList: new LINQ(ResScreen)
    //               .Where(
    //                 w =>
    //                   w.module_role_map_id ==
    //                   ResModules[i]["algaeh_m_module_role_privilage_mapping_id"]
    //               )
    //               .Select(s => {
    //                 return {
    //                   screen_id: s.screen_id,
    //                   screen_code: s.screen_code,
    //                   screen_name: s.screen_name,
    //                   page_to_redirect: s.page_to_redirect,
    //                   other_language: s.other_language,
    //                   algaeh_m_screen_role_privilage_mapping_id:
    //                     s.algaeh_m_screen_role_privilage_mapping_id,
    //                   module_id: s.module_id,
    //                   module_plan: s.module_plan
    //                 };
    //               })
    //               .ToArray()
    //           };

    //           outputArray.push(obj);
    //         }

    //         req.records = outputArray;
    //         next();
    //       } else {
    //         req.records = [];
    //         next();
    //       }
    //     })
    //     .catch(error => {
    //       _mysql.releaseConnection();
    //       next(error);
    //     });
    // }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to get
let getRoleBaseInActiveComponents_OLD = (req, res, next) => {
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
              where  CRM.record_status='A' and C.record_status='A' and  M.record_status= 'A' and\
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
          and  S.record_status='A' and M.record_status='A' and CRM.role_id=?",
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
              where  CRM.record_status='A' and C.record_status='A' and  M.record_status= 'A' and\
              S.record_status='A'  and CRM.role_id=?;\
              SELECT   CRM.role_id, screen_element_code,screen_element_name,component_code,\
          screen_code, module_code from   algaeh_m_component_role_privilage_mapping CRM   \
          inner join algaeh_m_scrn_elmnt_role_privilage_mapping SERM on \
          CRM.algaeh_m_component_role_privilage_mapping_id=SERM.role_id \
              inner join algaeh_d_app_scrn_elements  SE on SERM.element_id=SE.algaeh_d_app_scrn_elements_id\
              inner join algaeh_d_app_component C on SE.component_id=C.algaeh_d_app_component_id  \
              inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
              inner join  algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
          where SERM.record_status='A' and SE.record_status='A' and  C.record_status='A'\
          and  S.record_status='A' and M.record_status='A' and CRM.role_id=?",
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
    const { algaeh_d_app_user_id, role_type } = req.userIdentity;
    if (role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `algaeh_d_app_module` (module_code,display_order, module_name, licence_key, access_by, icons, \
              module_plan, other_language,  created_date, created_by, updated_date, updated_by)\
          VALUE(?,?,?,?,?,?,?, ?,?,?,?,?)",
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
            algaeh_d_app_user_id,
            new Date(),
            algaeh_d_app_user_id
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

let deleteAlgaehModule = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    const { algaeh_d_app_user_id, role_type } = req.userIdentity;
    if (role_type != "GN") {
      _mysql
        .executeQuery({
          query: `select M.module_name,S.screen_name from algaeh_d_app_module as M left join algaeh_d_app_screens as S 
            on M.algaeh_d_module_id = S.module_id where M.algaeh_d_module_id=?;`,
          values: [input.algaeh_d_module_id]
        })
        .then(result => {
          if (result.length > 1) {
            _mysql.releaseConnection();
            const { screen_name } = result[0];
            next(
              new Error(
                `Can't delete this module it is been used by other screen '${screen_name}'`
              )
            );
          } else {
            _mysql
              .executeQuery({
                query: `delete from algaeh_d_app_module where algaeh_d_module_id=?`,
                values: [input.algaeh_d_module_id]
              })
              .then(deleted => {
                _mysql.releaseConnection();
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          }
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
      superUser = " and access_by <> 'SU' and record_status = 'A' ";
    }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "select algaeh_d_module_id, module_name,module_code,display_order, icons,other_language, module_plan,licence_key,record_status  from algaeh_d_app_module\
          where  1=1 " +
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
    let input = req.body;

    // //for admin login
    // if (req.userIdentity.role_type == "AD") {
    //   superUser = " and access_by <> 'SU'";
    // }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query:
            "update algaeh_d_app_module set  display_order=?, module_name=?, \
          updated_date=?,other_language=?,licence_key=?,record_status=?, updated_by=? WHERE `algaeh_d_module_id`=?;",
          values: [
            input.display_order,
            input.module_name,
            new Date(),
            input.other_language,
            input.licence_key,
            input.record_status,
            req.userIdentity.algaeh_d_app_user_id,
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
};

//created by irfan: to
let getAlgaehScreens = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const { role_type } = req.userIdentity;
    if (role_type != "GN") {
      let module_id = "";

      const wherecondition =
        role_type !== "SU"
          ? `where S.record_status='A' and M.record_status='A' and `
          : "";

      if (req.query.module_id != undefined && req.query.module_id != null) {
        module_id = `${wherecondition === "" ? " where " : ""} module_id=${
          req.query.module_id
        } `;
      }
      _mysql
        .executeQuery({
          query:
            "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_name,module_code, S.other_language,\
            S.record_status from algaeh_d_app_screens S inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id \
             " +
            wherecondition +
            module_id +
            "  order by algaeh_app_screens_id desc ",
          printQuery: true
        })
        // .executeQuery({
        //   query: `select M.module_name,M.module_code,M.algaeh_d_module_id,M.module_name,S.screen_name,
        //   S.other_language,S.algaeh_app_screens_id from algaeh_d_app_module as M inner join
        //   algaeh_d_app_screens as S on M.algaeh_d_module_id = S.module_id where M.algaeh_d_module_id = S.module_id`
        // })
        .then(result => {
          _mysql.releaseConnection();
          // const createGroup = _.chain(result)
          //   .groupBy(g => g.algaeh_d_module_id)
          //   .map(detail => {
          //     const {
          //       algaeh_d_module_id,
          //       module_code,
          //       module_name
          //     } = detail[0];
          //     return {
          //       algaeh_d_module_id: algaeh_d_module_id,
          //       module_code: module_code,
          //       module_name: module_name,
          //       ScreenList: detail
          //     };
          //   })
          //   .value();
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

let getAlgaehScreensWithModules = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.userIdentity.role_type != "GN") {
      let module_id = "";
      if (req.query.module_id != undefined && req.query.module_id != null) {
        module_id = ` where module_id=${req.query.module_id} `;
      }
      _mysql
        // .executeQuery({
        //   query:
        //     "select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_name,module_code, S.other_language\
        //     from algaeh_d_app_screens S inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id \
        //     where  S.record_status='A' and M.record_status='A' " +
        //     module_id +
        //     "  order by algaeh_app_screens_id desc "
        // })
        .executeQuery({
          query: `select M.module_name,M.module_code,M.algaeh_d_module_id,M.module_name,S.screen_name as label,
          S.other_language,S.algaeh_app_screens_id from algaeh_d_app_module as M inner join
          algaeh_d_app_screens as S on M.algaeh_d_module_id = S.module_id ${module_id};`
        })
        .then(result => {
          _mysql.releaseConnection();
          const createGroup = _.chain(result)
            .groupBy(g => g.algaeh_d_module_id)
            .map(detail => {
              const {
                algaeh_d_module_id,
                module_code,
                module_name
              } = detail[0];
              return {
                algaeh_d_module_id: algaeh_d_module_id,
                label: module_name,
                module_code: module_code,
                disabled: true,
                module_name: module_name,
                children: detail
              };
            })
            .value();
          req.records = createGroup;
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
            "update algaeh_d_app_screens set screen_name=? ,page_to_redirect=?,other_language=?,updated_date=?,record_status=?, updated_by=? where algaeh_app_screens_id=?",
          values: [
            input.screen_name,
            input.page_to_redirect,

            input.other_language,
            new Date(),
            input.record_status,
            req.userIdentity.algaeh_d_app_user_id,
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
};

//created by nowshad: to add
let updateAlgaehComponent = (req, res, next) => {
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
            "UPDATE algaeh_d_app_component SET record_status = ?, updated_date = ?, updated_by = ? WHERE algaeh_d_app_component_id =?;",
          values: [
            input.record_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.algaeh_d_app_component_id
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
let getAlgaehComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let screen_id = "";
    if (req.query.screen_id != undefined && req.query.screen_id != null) {
      screen_id = ` where and C.screen_id=${req.query.screen_id} `;
    }
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query: `select  algaeh_d_app_component_id, screen_id,S.screen_name, component_code, component_name ,C.record_status
            from algaeh_d_app_component as C inner join algaeh_d_app_screens S 
            on C.screen_id = S.algaeh_app_screens_id
            ${screen_id} order by algaeh_d_app_component_id desc `
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

let getAlgaehComponentsWithScreens = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.userIdentity.role_type != "GN") {
      _mysql
        .executeQuery({
          query: ` select M.algaeh_d_module_id,M.module_code,M.module_name,S.redirect_url,
          S.algaeh_app_screens_id,S.screen_code,S.screen_name,C.component_code,C.algaeh_d_app_component_id,C.component_name as label
          from algaeh_d_app_module as M inner join algaeh_d_app_screens as S
          on M.algaeh_d_module_id = S.module_id inner join algaeh_d_app_component as C
          on S.algaeh_app_screens_id = C.screen_id where M.record_status ='A' and S.record_status='A'
          and C.record_status='A' order by C.algaeh_d_app_component_id desc;`
        })
        .then(result => {
          _mysql.releaseConnection();
          const data = _.chain(result)
            .groupBy(g => g.algaeh_d_module_id)
            .map(detail => {
              const {
                algaeh_d_module_id,
                module_code,
                module_name
              } = detail[0];
              const screens = _.chain(detail)
                .groupBy(g => g.algaeh_app_screens_id)
                .map(scr => {
                  const {
                    screen_name,
                    algaeh_app_screens_id,
                    screen_code,
                    redirect_url
                  } = scr[0];
                  return {
                    label: screen_name,
                    disabled: true,
                    algaeh_app_screens_id: algaeh_app_screens_id,
                    screen_code: screen_code,
                    children: scr
                  };
                });
              return {
                module_code: module_code,
                algaeh_d_module_id: algaeh_d_module_id,
                disabled: true,
                label: module_name,
                module_name: module_name,
                children: screens
              };
            });
          req.records = data;
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
            "INSERT INTO `algaeh_d_app_scrn_elements`(screen_element_code,screen_element_name,component_id, created_date, created_by, updated_date, updated_by,extra_props,props_type)\
          VALUE(?,?,?,?,?,?,?,?,?)",
          values: [
            input.screen_element_code,
            input.screen_element_name,
            input.component_id,
            new Date(),
            input.created_by,
            new Date(),
            input.updated_by,
            input.extra_props,
            input.props_type
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
          query: `select  algaeh_d_app_scrn_elements_id, screen_element_code,e.props_type,e.extra_props,
           screen_element_name, c.component_name  
          from algaeh_d_app_scrn_elements as e inner join algaeh_d_app_component as c 
          on c.algaeh_d_app_component_id = e.component_id
                   where  e.record_status='A' ${component_id} order by algaeh_d_app_scrn_elements_id desc`
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

const moduleScreenAssignment = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const { module_screen, app_group_id, role_id } = req.body;
    if (app_group_id === "" || app_group_id === undefined) {
      next(new Error("No group is defined..."));
      return;
    }
    if (role_id === "" || role_id === undefined) {
      next(new Error("No role is defined..."));
      return;
    }
    const { role_type, algaeh_d_app_user_id } = req.userIdentity;
    if (role_type === "AD" || role_type === "SU") {
      _mysql
        .executeQueryWithTransaction({
          query: `select algaeh_m_module_role_privilage_mapping_id from algaeh_m_module_role_privilage_mapping
        where role_id =?`,
          values: [role_id]
        })
        .then(result => {
          console.log("result", result);
          const module_privilage_map = result.map(
            item => item.algaeh_m_module_role_privilage_mapping_id
          );
          _mysql
            .executeQuery({
              query: `delete from algaeh_m_screen_role_privilage_mapping where module_role_map_id in (?);
              delete from algaeh_m_module_role_privilage_mapping where algaeh_m_module_role_privilage_mapping_id in (?);`,
              values: [
                module_privilage_map.length === 0 ? null : module_privilage_map,
                module_privilage_map.length === 0 ? null : module_privilage_map
              ]
            })
            .then(deleted => {
              let query_module_insertion = "";
              module_screen.forEach(element => {
                query_module_insertion += _mysql.mysqlQueryFormat(
                  `insert into algaeh_m_module_role_privilage_mapping 
            (module_id,role_id,created_by,updated_by) value(?,?,?,?);`,
                  [
                    element.module_id,
                    role_id,
                    algaeh_d_app_user_id,
                    algaeh_d_app_user_id
                  ]
                );
              });
              _mysql
                .executeQuery({
                  query: query_module_insertion
                })
                .then(modulesInserted => {
                  let query_insert = "";
                  for (let m = 0; m < modulesInserted.length; m++) {
                    const module = module_screen[m];
                    for (let s = 0; s < module.ScreenList.length; s++) {
                      query_insert += _mysql.mysqlQueryFormat(
                        `insert into algaeh_m_screen_role_privilage_mapping
                (module_role_map_id,screen_id,created_by,updated_by) value(?,?,?,?);`,
                        [
                          modulesInserted[m]["insertId"],
                          module.ScreenList[s]["screen_id"],
                          algaeh_d_app_user_id,
                          algaeh_d_app_user_id
                        ]
                      );
                    }
                  }
                  _mysql
                    .executeQuery({
                      query: query_insert
                    })
                    .then(detailInsert => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        next();
                      });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } else {
      _mysql.releaseConnection();
      next(new Error("No Permission to add or modify data"));
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
              qry += ` delete from algaeh_m_screen_role_privilage_mapping where algaeh_m_screen_role_privilage_mapping_id in (${input.delete_screens});`;
            }

            if (input.delete_modules.length > 0) {
              qry += ` delete from algaeh_m_screen_role_privilage_mapping where module_role_map_id in ( ${input.delete_modules});
              delete from algaeh_m_module_role_privilage_mapping where algaeh_m_module_role_privilage_mapping_id in (${input.delete_modules});`;
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
        } else if (delRes !== null) {
          //commit

          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = delRes;
            next();
          });
        } else {
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
let getHrmsAuthLevels = (req, res, next) => {
  const curr_db = keyPath.default.mysqlDb.database;
  const _mysql = new algaehMysql({ path: keyPath });
  if (req.userIdentity.role_type != "GN") {
    _mysql
      .executeQuery({
        query:
          " select TABLE_NAME from information_schema.TABLES\
        where table_schema = ? and  TABLE_NAME='hims_d_hrms_options'",
        values: [curr_db],
        printQuery: true
      })
      .then(dbExist => {
        if (dbExist.length > 0) {
          _mysql
            .executeQuery({
              query:
                " select  leave_level,loan_level from hims_d_hrms_options;",
              printQuery: true
            })
            .then(result => {
              _mysql.releaseConnection();
              if (result.length > 0) {
                const leave_levels = [];
                const loan_levels = [];
                switch (result[0]["leave_level"]) {
                  case "1":
                    leave_levels.push(
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "2":
                    leave_levels.push(
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "3":
                    leave_levels.push(
                      { name: "Level 3", value: "3" },
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "4":
                    leave_levels.push(
                      { name: "Level 4", value: "4" },
                      { name: "Level 3", value: "3" },
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "5":
                    leave_levels.push(
                      { name: "Level 5", value: "5" },
                      { name: "Level 4", value: "4" },
                      { name: "Level 3", value: "3" },
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;

                  default:
                    leave_levels.push({ name: "None", value: "N" });
                }
                switch (result[0]["loan_level"]) {
                  case "1":
                    loan_levels.push(
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "2":
                    loan_levels.push(
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "3":
                    loan_levels.push(
                      { name: "Level 3", value: "3" },
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "4":
                    loan_levels.push(
                      { name: "Level 4", value: "4" },
                      { name: "Level 3", value: "3" },
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;
                  case "5":
                    loan_levels.push(
                      { name: "Level 5", value: "5" },
                      { name: "Level 4", value: "4" },
                      { name: "Level 3", value: "3" },
                      { name: "Level 2", value: "2" },
                      { name: "Level 1", value: "1" },
                      { name: "None", value: "N" }
                    );
                    break;

                  default:
                    leave_levels.push({ name: "None", value: "N" });
                }

                req.records = { leave_levels, loan_levels };
                next();
              } else {
                req.records = {
                  leave_levels: [{ name: "None", value: "N" }],
                  loan_levels: [{ name: "None", value: "N" }]
                };
                next();
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            leave_levels: [{ name: "None", value: "N" }],
            loan_levels: [{ name: "None", value: "N" }]
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  } else {
    req.records = {
      validUser: false,
      message: "you dont have admin privilege"
    };
    next();
  }
};

let addLisMachineConfiguration = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_lis_configuration` (machine_name, communication_type, hl7_supported, check_sum, \
              connection_type, stat_flag, rotine_flag, result_extension, order_mode, file_upload, com_port_name, \
              brud_rate, ser_result_part_loc, host_ip_address, port_no, tcp_result_part_loc, driver_name, \
              description, hospital_id, created_date, created_by, updated_date, updated_by) \
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.machine_name,
          input.communication_type,
          input.hl7_supported,
          input.check_sum,
          input.connection_type,
          input.stat_flag,
          input.rotine_flag,
          input.result_extension,
          input.order_mode,
          input.file_upload,
          input.com_port_name,
          input.brud_rate,
          input.ser_result_part_loc,
          input.host_ip_address,
          input.port_no,
          input.tcp_result_part_loc,
          input.driver_name,
          input.description,
          input.hospital_id,
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getLisMachineConfiguration = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "SELECT LC.*, H.hospital_name FROM hims_d_lis_configuration LC \
          inner join hims_d_hospital H on H.hims_d_hospital_id = LC.hospital_id"
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
};

let updateLisMachineConfiguration = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "update hims_d_lis_configuration set machine_name=?, communication_type=?, hl7_supported=?, check_sum=?, \
            connection_type=?, stat_flag=?, rotine_flag=?, result_extension=?, order_mode=?, file_upload=?, com_port_name=?, \
            brud_rate=?, ser_result_part_loc=?, host_ip_address=?, port_no=?, tcp_result_part_loc=?, driver_name=?, \
            description=?, hospital_id=?, updated_date=?, updated_by=? where hims_d_lis_configuration_id=?",
        values: [
          input.machine_name,
          input.communication_type,
          input.hl7_supported,
          input.check_sum,
          input.connection_type,
          input.stat_flag,
          input.rotine_flag,
          input.result_extension,
          input.order_mode,
          input.file_upload,
          input.com_port_name,
          input.brud_rate,
          input.ser_result_part_loc,
          input.host_ip_address,
          input.port_no,
          input.tcp_result_part_loc,
          input.driver_name,
          input.description,
          input.hospital_id,
          new Date(),
          input.updated_by,
          input.hims_d_lis_configuration_id
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

const moduleScreensAssigToRoles = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const { role_id } = req.body;
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getComponentsForScreen = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { screen_id } = req.query;
  try {
    _mysql
      .executeQuery({
        query: `select component_name,algaeh_d_app_component_id from algaeh_d_app_component where screen_id=? and record_status='A';`,
        values: [screen_id]
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
};

const assignComponentScreenPermissions = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const {
      algaeh_m_screen_role_privilage_mapping_id,
      compoment_list
    } = req.body;
    if (!Array.isArray(compoment_list)) {
      next(new Error("Please provide proper components in list"));
      return;
    }
    if (compoment_list.length === 0) {
      next(new Error("No Components exists for process."));
      return;
    }
    const { algaeh_d_app_user_id } = req.userIdentity;
    let query = "";
    for (let i = 0; i < compoment_list.length; i++) {
      const { view_privilege, algaeh_d_app_component_id } = compoment_list[i];
      query += _mysql.mysqlQueryFormat(
        `insert into algaeh_m_component_screen_privilage_mapping
      (component_id,algaeh_m_screen_role_privilage_mapping_id,
        view_privilege,created_by,created_date,updated_by,updated_date) 
        value(?,?,?,?,?,?,?);`,
        [
          algaeh_d_app_component_id,
          algaeh_m_screen_role_privilage_mapping_id,
          view_privilege,
          algaeh_d_app_user_id,
          new Date(),
          algaeh_d_app_user_id,
          new Date()
        ]
      );
    }
    _mysql
      .executeQuery({
        query: query,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
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
//created by:IRFAN
const getScreensWithComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: `select algaeh_app_screens_id,screen_code, screen_name ,
        algaeh_d_app_component_id,component_code,screen_id,component_name,
        SE.algaeh_d_app_scrn_elements_id,SE.screen_element_code,SE.screen_element_name,SE.props_type,SE.extra_props
         from algaeh_d_app_screens S left join 
        algaeh_d_app_component C on S.algaeh_app_screens_id=C.screen_id and C.record_status='A'
        left join algaeh_d_app_scrn_elements as SE on SE.component_id = C.algaeh_d_app_component_id 
        where S.module_id=? and  S.record_status='A'; `,
        //   "select algaeh_app_screens_id,screen_code, screen_name ,\
        // algaeh_d_app_component_id,component_code,screen_id,component_name from algaeh_d_app_screens S left join \
        // algaeh_d_app_component C on S.algaeh_app_screens_id=C.screen_id and C.record_status='A'\
        // where S.module_id=? and  S.record_status='A'; ",
        values: [req.query.module_id],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        const createGroup = _.chain(result)
          .groupBy(g => g.algaeh_app_screens_id)
          .map(screen => {
            const {
              algaeh_app_screens_id,
              screen_name,
              screen_code
            } = screen[0];

            const compo = _.chain(screen)
              .filter(f => f.algaeh_d_app_component_id !== null)
              .groupBy(g => g.algaeh_d_app_component_id)
              .map(component => {
                const {
                  algaeh_d_app_component_id,
                  screen_id,
                  component_name,
                  component_code,
                  screen_code
                } = component[0];
                const elem = _.chain(component)
                  .filter(f => f.algaeh_d_app_scrn_elements_id !== null)
                  .groupBy(g => g.algaeh_d_app_scrn_elements_id)
                  .map(elements => {
                    const {
                      extra_props,
                      props_type,
                      screen_element_name,
                      algaeh_d_app_scrn_elements_id
                    } = elements[0];

                    return {
                      extra_props,
                      props_type,
                      screen_element_name,
                      algaeh_d_app_scrn_elements_id,
                      extraPropsList:
                        extra_props !== null && extra_props !== ""
                          ? extra_props.split(",").map((m, index) => {
                              return {
                                label: m,
                                value: index,
                                checked: false
                              };
                            })
                          : []
                    };
                  })
                  .value();
                return {
                  algaeh_d_app_component_id,
                  screen_id,
                  component_name,
                  component_code,
                  screen_code,
                  elements: elem
                };
              })
              .value();

            // const compo = screen
            //   .filter(f => f.algaeh_d_app_component_id > 0)
            //   .map(m => {

            //     return {
            //       algaeh_d_app_component_id: m.algaeh_d_app_component_id,
            //       screen_id: m.screen_id,
            //       component_name: m.component_name,
            //       component_code: m.component_code,
            //       screen_code: m.screen_code
            //     };
            //   });

            return {
              algaeh_app_screens_id: algaeh_app_screens_id,
              screen_name: screen_name,
              screen_code: screen_code,
              componentList: compo
            };
          })
          .value();

        req.records = createGroup;

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

//created by:IRFAN
const addScreensAndComponents = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const input = req.body;

    const screenList = [];
    const componentList = [];

    const deleteScreenList = ["0"];
    const deleteComponentList = ["0"];

    let module_role_map_id = input.algaeh_m_module_role_privilage_mapping_id;

    if (input.checked == false) {
      _mysql
        .executeQuery({
          query: `delete from algaeh_m_module_role_privilage_mapping where 
        algaeh_m_module_role_privilage_mapping_id=?`,
          values: [input.algaeh_m_module_role_privilage_mapping_id],
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
      // console.log("input.checked", input.checked);
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT  IGNORE INTO `algaeh_m_module_role_privilage_mapping` (module_id, role_id,\
              created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
          values: [
            input.module_id,
            input.role_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ]
          // printQuery: true
        })
        .then(result => {
          if (result.insertId > 0) {
            module_role_map_id = result.insertId;
          }

          input.screen_list.forEach(f => {
            if (f.checked == true) {
              screenList.push({
                module_role_map_id: module_role_map_id,
                screen_id: f.algaeh_app_screens_id,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              });
              f.componentList.forEach(comp => {
                if (comp.checked == undefined || comp.checked == false) {
                  componentList.push({
                    algaeh_d_app_component_id: comp.algaeh_d_app_component_id,
                    screen_id: comp.screen_id
                  });
                } else if (
                  comp.checked == true &&
                  comp.algaeh_m_component_screen_privilage_mapping_id > 0
                ) {
                  deleteComponentList.push(
                    comp.algaeh_m_component_screen_privilage_mapping_id
                  );
                }
              });
            } else if (
              f.checked == false &&
              f.algaeh_m_screen_role_privilage_mapping_id > 0
            ) {
              deleteScreenList.push(
                f.algaeh_m_screen_role_privilage_mapping_id
              );
            }
          });
          const qryStr = `delete from algaeh_m_screen_role_privilage_mapping where 
          algaeh_m_screen_role_privilage_mapping_id  in (${deleteScreenList}); 
          delete from algaeh_m_component_screen_privilage_mapping where 
          algaeh_m_component_screen_privilage_mapping_id  in (${deleteComponentList});`;

          const insurtColumns = [
            "module_role_map_id",
            "screen_id",
            "created_by",
            "created_date",
            "updated_by",
            "updated_date"
          ];

          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT  IGNORE INTO `algaeh_m_screen_role_privilage_mapping` (??) VALUES ? ",
              values: screenList,
              includeValues: insurtColumns,
              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(screenRes => {
              _mysql
                .executeQuery({
                  query:
                    "select algaeh_m_screen_role_privilage_mapping_id,screen_id from\
                    algaeh_m_screen_role_privilage_mapping where module_role_map_id=?;" +
                    qryStr,
                  values: [module_role_map_id],
                  printQuery: true
                })
                .then(mappedScreen => {
                  const insertCopmonent = [];
                  mappedScreen[0].forEach(item => {
                    componentList.forEach(f => {
                      if (item.screen_id == f.screen_id) {
                        insertCopmonent.push({
                          component_id: f.algaeh_d_app_component_id,
                          algaeh_m_screen_role_privilage_mapping_id:
                            item.algaeh_m_screen_role_privilage_mapping_id,
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          created_date: new Date(),
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_date: new Date()
                        });
                      }
                    });
                  });

                  if (insertCopmonent.length > 0) {
                    const insertColumns = [
                      "component_id",
                      "algaeh_m_screen_role_privilage_mapping_id",
                      "created_by",
                      "created_date",
                      "updated_by",
                      "updated_date"
                    ];
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  IGNORE INTO `algaeh_m_component_screen_privilage_mapping` (??) VALUES ? ;",
                        values: insertCopmonent,
                        includeValues: insertColumns,
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(compRes => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = compRes;
                          next();
                        });
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = screenRes;
                      next();
                    });
                  }
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

const addScreensAndComponents_new = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    const input = req.body;

    const screenList = [];
    const componentList = [];

    const deleteScreenList = ["0"];
    const deleteComponentList = ["0"];

    let module_role_map_id = input.algaeh_m_module_role_privilage_mapping_id;

    if (input.checked == false) {
      _mysql
        .executeQuery({
          query: `delete from algaeh_m_module_role_privilage_mapping where 
        algaeh_m_module_role_privilage_mapping_id=?`,
          values: [input.algaeh_m_module_role_privilage_mapping_id]
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
      _mysql
        .executeQueryWithTransaction({
          query:
            "INSERT  IGNORE INTO `algaeh_m_module_role_privilage_mapping` (module_id, role_id,\
              created_by, created_date, updated_by, updated_date) VALUE(?,?,?,?,?,?); ",
          values: [
            input.module_id,
            input.role_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
          ],
          printQuery: true
        })
        .then(result => {
          if (result.insertId > 0) {
            module_role_map_id = result.insertId;
          }

          input.screen_list.forEach(f => {
            if (f.checked == true) {
              screenList.push({
                module_role_map_id: module_role_map_id,
                screen_id: f.algaeh_app_screens_id,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date()
              });
              f.componentList.forEach(comp => {
                if (comp.checked == undefined || comp.checked == false) {
                  componentList.push({
                    algaeh_d_app_component_id: comp.algaeh_d_app_component_id,
                    screen_id: comp.screen_id
                  });
                } else if (
                  comp.checked == true &&
                  comp.algaeh_m_component_screen_privilage_mapping_id > 0
                ) {
                  deleteComponentList.push(
                    comp.algaeh_m_component_screen_privilage_mapping_id
                  );
                }
              });
            } else if (
              f.checked == false &&
              f.algaeh_m_screen_role_privilage_mapping_id > 0
            ) {
              deleteScreenList.push(
                f.algaeh_m_screen_role_privilage_mapping_id
              );
            }
          });

          const qryStr = `delete from algaeh_m_screen_role_privilage_mapping where 
          algaeh_m_screen_role_privilage_mapping_id  in (${deleteScreenList}); 
          delete from algaeh_m_component_screen_privilage_mapping where 
          algaeh_m_component_screen_privilage_mapping_id  in (${deleteComponentList});`;

          const insurtColumns = [
            "module_role_map_id",
            "screen_id",
            "created_by",
            "created_date",
            "updated_by",
            "updated_date"
          ];

          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT  IGNORE INTO `algaeh_m_screen_role_privilage_mapping` (??) VALUES ? ",
              values: screenList,
              includeValues: insurtColumns,
              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(screenRes => {
              _mysql
                .executeQuery({
                  query:
                    "select algaeh_m_screen_role_privilage_mapping_id,screen_id from\
                    algaeh_m_screen_role_privilage_mapping where module_role_map_id=?;" +
                    qryStr,
                  values: [module_role_map_id],
                  printQuery: true
                })
                .then(mappedScreen => {
                  const insertCopmonent = [];
                  mappedScreen[0].forEach(item => {
                    componentList.forEach(f => {
                      if (item.screen_id == f.screen_id) {
                        insertCopmonent.push({
                          component_id: f.algaeh_d_app_component_id,
                          algaeh_m_screen_role_privilage_mapping_id:
                            item.algaeh_m_screen_role_privilage_mapping_id,
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          created_date: new Date(),
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_date: new Date()
                        });
                      }
                    });
                  });

                  if (insertCopmonent.length > 0) {
                    const insertColumns = [
                      "component_id",
                      "algaeh_m_screen_role_privilage_mapping_id",
                      "created_by",
                      "created_date",
                      "updated_by",
                      "updated_date"
                    ];
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  IGNORE INTO `algaeh_m_component_screen_privilage_mapping` (??) VALUES ? ;",
                        values: insertCopmonent,
                        includeValues: insertColumns,
                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(compRes => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = compRes;
                          next();
                        });
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = screenRes;
                      next();
                    });
                  }
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by:IRFAN
const getCurrentAssignedScreenAndComponent = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.query.role_id > 0 && req.query.module_id > 0) {
      _mysql
        .executeQuery({
          query: `select M.algaeh_m_module_role_privilage_mapping_id,M.module_id,M.role_id,
          S.algaeh_m_screen_role_privilage_mapping_id,S. module_role_map_id,S.screen_id, 
          C.algaeh_m_component_screen_privilage_mapping_id,
          C. component_id, C.algaeh_m_screen_role_privilage_mapping_id as screen_role_map_id
          from algaeh_m_module_role_privilage_mapping M 
          inner join algaeh_m_screen_role_privilage_mapping S
          on M.algaeh_m_module_role_privilage_mapping_id=S.module_role_map_id
          left join algaeh_m_component_screen_privilage_mapping C on
          S.algaeh_m_screen_role_privilage_mapping_id=C.algaeh_m_screen_role_privilage_mapping_id
          where M.role_id=? and M.module_id=? `,
          values: [req.query.role_id, req.query.module_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();

          if (result.length > 0) {
            const createGroup = _.chain(result)
              .groupBy(g => g.screen_id)
              .map(screen => {
                const {
                  algaeh_m_screen_role_privilage_mapping_id,
                  module_role_map_id,
                  screen_id
                } = screen[0];

                const compo = screen
                  .filter(
                    f => f.algaeh_m_component_screen_privilage_mapping_id > 0
                  )
                  .map(m => {
                    return {
                      screen_role_map_id: m.screen_role_map_id,
                      algaeh_d_app_component_id: m.component_id,
                      algaeh_m_component_screen_privilage_mapping_id:
                        m.algaeh_m_component_screen_privilage_mapping_id,
                      checked: false
                    };
                  });

                return {
                  algaeh_m_screen_role_privilage_mapping_id: algaeh_m_screen_role_privilage_mapping_id,
                  module_role_map_id: module_role_map_id,
                  algaeh_app_screens_id: screen_id,
                  checked: true,
                  componentList: compo
                };
              })
              .value();

            req.records = {
              role_id: result[0]["role_id"],
              module_id: result[0]["module_id"],
              algaeh_m_module_role_privilage_mapping_id:
                result[0]["algaeh_m_module_role_privilage_mapping_id"],
              screen_list: createGroup
            };
          } else {
            req.records = {};
          }
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please select Role and Module "
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
const getAllAssignedScrens = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { role_id } = req.query;
  try {
    _mysql
      .executeQuery({
        query: `select distinct s.algaeh_app_screens_id,s.screen_code,s.screen_name,
        default_land_screen_id
         from algaeh_m_screen_role_privilage_mapping as sr inner join 
        algaeh_d_app_screens as s on sr.screen_id = 
        s.algaeh_app_screens_id and s.record_status ='A' and sr.record_status='A'
        inner join algaeh_m_module_role_privilage_mapping as mr 
        on mr.algaeh_m_module_role_privilage_mapping_id = sr.module_role_map_id
        and mr.record_status ='A' inner join  algaeh_d_app_roles as r 
        on r.app_d_app_roles_id = mr.role_id and r.record_status='A'
         where mr.role_id=?;`,
        values: [role_id]
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
};

const updateLandingScreen = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { landing_page, role_id } = req.body;
  const { algaeh_d_app_user_id } = req.userIdentity;
  try {
    _mysql
      .executeQuery({
        query: `update algaeh_d_app_roles set default_land_screen_id=?,
        updated_by=?,updated_date=? 
        where app_d_app_roles_id=?`,
        values: [landing_page, algaeh_d_app_user_id, new Date(), role_id]
      })
      .then(result => {
        _mysql.releaseConnection();
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
const getScreenElementsRoles = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { role_id } = req.query;
  try {
    _mysql
      .executeQuery({
        query: `select s.screen_name,s.algaeh_app_screens_id, se.algaeh_d_app_scrn_elements_id,se.screen_element_code,se.screen_element_name,
        se.extra_props,se.props_type,c.component_name,c.component_code,esm.screen_element_scren_module_mapping_id,
        esm.view_type as user_view_type,esm.extra_props as user_extra_props,
        case when esm.screen_element_scren_module_mapping_id is null then true else false end checked
         from algaeh_d_app_scrn_elements as se inner join 
        algaeh_d_app_component as c on se.component_id = c.algaeh_d_app_component_id
         and c.record_status='A' and se.record_status='A' 
         inner join algaeh_d_app_screens as s on s.algaeh_app_screens_id= c.screen_id and s.record_status='A'
        left join screen_element_scren_module_mapping as esm
        on esm.algaeh_d_app_scrn_elements_id = se.algaeh_d_app_scrn_elements_id
        where  (esm.role_Id=? or esm.role_Id is null);`,
        values: [role_id]
      })
      .then(result => {
        _mysql.releaseConnection();
        const rest = _.chain(result)
          .groupBy(g => g.algaeh_app_screens_id)
          .map(m => {
            const first = m[0];
            const { screen_name, algaeh_app_screens_id } = first;
            return {
              screen_name,
              algaeh_app_screens_id,
              component: _.chain(m)
                .groupBy(g => g.component_code)
                .map(c => {
                  const comp = c[0];
                  const {
                    component_name,
                    component_code,
                    algaeh_app_screens_id
                  } = comp;
                  return {
                    component_name,
                    component_code,
                    algaeh_app_screens_id,
                    elements: _.chain(c)
                      .groupBy(g => g.algaeh_d_app_scrn_elements_id)
                      .map(e => {
                        const ele = e[0];
                        const {
                          algaeh_d_app_scrn_elements_id,
                          screen_element_code,
                          screen_element_name,
                          extra_props,
                          props_type,
                          user_extra_props,
                          checked,
                          screen_element_scren_module_mapping_id
                        } = ele;
                        let stages = [];
                        if (props_type === "S" && extra_props !== "") {
                          const userStage =
                            user_extra_props !== null
                              ? user_extra_props.split(",")
                              : [];
                          stages = extra_props.split(",").map((s, idx) => {
                            const finder = userStage.find(f => f === s);
                            let interner = {
                              checked: true,
                              value: idx,
                              text: s
                            };
                            if (finder !== undefined) {
                              interner["checked"] = false;
                            }
                            return interner;
                          });
                        }

                        return {
                          algaeh_d_app_scrn_elements_id,
                          screen_element_code,
                          screen_element_name,
                          screen_element_scren_module_mapping_id,
                          isStaged: stages.length === 0 ? false : true,
                          stages,
                          checked: checked === "1" ? true : false
                        };
                      })
                      .value()
                  };
                })
                .value()
            };
          })
          .value();
        req.records = rest; //result;
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
const updateScreenElementRoles = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { role_id, assignedScreenElements } = req.body;
  try {
    let accessItem = "";
    let removeItem = "";
    for (let i = 0; i < assignedScreenElements.length; i++) {
      const { component } = assignedScreenElements[i];
      for (let j = 0; j < component.length; j++) {
        const { elements } = component[j];
        for (let e = 0; e < elements.length; e++) {
          const {
            stages,
            checked,
            screen_element_scren_module_mapping_id,
            algaeh_d_app_scrn_elements_id
          } = elements[e];
          if (screen_element_scren_module_mapping_id !== null) {
            removeItem += _mysql.mysqlQueryFormat(
              `delete from screen_element_scren_module_mapping 
                 where screen_element_scren_module_mapping_id=?;`,
              [screen_element_scren_module_mapping_id]
            );
          }

          if (stages.length === 0) {
            if (checked === false) {
              accessItem += _mysql.mysqlQueryFormat(
                `insert ignore into screen_element_scren_module_mapping 
                    (algaeh_d_app_scrn_elements_id,role_Id,view_type) value
                    (?,?,?);`,
                [algaeh_d_app_scrn_elements_id, role_id, "H"]
              );
            }
          } else {
            let extraProps = "";
            const allCheck = stages.filter(f => f.checked === false);
            for (let a = 0; a < allCheck.length; a++) {
              const { text } = allCheck[a];
              if (allCheck.length - 1 !== a) {
                extraProps += text + ",";
              } else {
                extraProps += text;
              }
            }
            accessItem += _mysql.mysqlQueryFormat(
              `insert ignore into screen_element_scren_module_mapping 
                     (algaeh_d_app_scrn_elements_id,role_Id,extra_props) value
                     (?,?,?);`,
              [algaeh_d_app_scrn_elements_id, role_id, extraProps]
            );
          }
        }
      }
    }
    const _query = removeItem + accessItem;
    if (_query !== "") {
      _mysql
        .executeQuery({
          query: removeItem + accessItem,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = {
            success: true,
            message: "Successully Updated"
          };
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      _mysql.releaseConnection();
      req.records = {
        success: true,
        message: "Nothing Updated"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  updateScreenElementRoles,
  getAlgaehScreensWithModules,
  addAlgaehGroupMAster,
  updateAlgaehGroupMAster,
  deleteAlgaehGroupMAster,
  addAlgaehRoleMAster,
  updateAlgaehRoleMAster,
  deleteAlgaehRoleMAster,
  deleteAlgaehModule,
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
  getAlgaehComponentsWithScreens,
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
  getHrmsAuthLevels,
  addLisMachineConfiguration,
  getLisMachineConfiguration,
  updateLisMachineConfiguration,
  moduleScreenAssignment,
  getComponentsForScreen,
  assignComponentScreenPermissions,
  getScreensWithComponents,
  addScreensAndComponents,
  getCurrentAssignedScreenAndComponent,
  getAllAssignedScrens,
  updateLandingScreen,
  getScreenElementsRoles,
  updateAlgaehComponent
};
