"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
//import moment from "moment";

//import { LINQ } from "node-linq";


var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add AlgaehGroupMAster
var addAlgaehGroupMAster = function addAlgaehGroupMAster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (req.userIdentity.role_type != "GN") {
        connection.query("INSERT INTO `algaeh_d_app_group` (app_group_code, app_group_name, app_group_desc, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)", [input.app_group_code, input.app_group_name, input.app_group_desc, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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

//created by irfan: to add addAlgaehRoleMAster
var addAlgaehRoleMAster = function addAlgaehRoleMAster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (req.userIdentity.role_type != "GN") {
        connection.query("INSERT INTO `algaeh_d_app_group` (app_group_id, role_code, role_name, role_discreption,\
                     ,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)", [input.app_group_id, input.role_code, input.role_name, input.role_discreption, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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

//created by irfan: to get master complete modules
var getAlgaehModuleBACKUP = function getAlgaehModuleBACKUP(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("select algaeh_d_module_id, module_name, licence_key  from algaeh_d_app_module\
        where  record_status=md5('A') ", function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        var outputArray = [];
        if (result.length > 0) {
          var _loop = function _loop(i) {
            connection.query("select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_id\
                from algaeh_d_app_screens where record_status='A' and  module_id=?", [result[i].algaeh_d_module_id], function (error, screenResult) {
              if (error) {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              }
              var obj = _extends({}, result[i], { ScreenList: screenResult });

              outputArray.push(obj);
              if (i == result.length - 1) {
                req.records = outputArray;
                (0, _utils.releaseDBConnection)(db, connection);
                next();
              }
            });
          };

          for (var i = 0; i < result.length; i++) {
            _loop(i);
          }
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = result;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to get
var getRoleBaseActiveModulesBACKUP = function getRoleBaseActiveModulesBACKUP(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query(" select algaeh_m_module_role_privilage_mapping_id, module_id,module_name, icons,module_code,role_id, view_privilege\
        from algaeh_m_module_role_privilage_mapping MRP\
        inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
        where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?", [req.userIdentity.role_id], function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }
        var outputArray = [];

        (0, _logging.debugLog)("roolo:", req.userIdentity.role_id);
        if (result.length > 0) {
          var _loop2 = function _loop2(i) {
            connection.query("SELECT algaeh_m_screen_role_privilage_mapping_id, privilege_code, privilege_type,\
                module_role_map_id, screen_id,screen_code,screen_name, role_id, delete_privilege, add_privilege, view_privilege, \
                update_privilege, print_privilege, access_email from \
                algaeh_m_screen_role_privilage_mapping SRM inner join algaeh_d_app_screens S \
                on SRM.screen_id=S.algaeh_app_screens_id\
                where SRM.record_status='A' and S.record_status='A' and module_role_map_id=?", [result[i].algaeh_m_module_role_privilage_mapping_id], function (error, screenResult) {
              if (error) {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              }
              var obj = _extends({}, result[i], { ScreenList: screenResult });

              outputArray.push(obj);
              if (i == result.length - 1) {
                req.records = outputArray;
                (0, _utils.releaseDBConnection)(db, connection);
                next();
              }
            });
          };

          for (var i = 0; i < result.length; i++) {
            _loop2(i);
          }
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
          req.records = result;
          next();
        }
      });
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan: to get
var getRoleBaseActiveModules = function getRoleBaseActiveModules(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      var superUser = "";
      //for admin login
      if (req.userIdentity.role_type == "AD") {
        superUser = " and   access_by <> 'SU'";
      }

      new Promise(function (resolve, reject) {
        try {
          if (req.userIdentity.role_type == "SU" && req.userIdentity.user_type == "SU" || req.userIdentity.role_type == "AD" && req.userIdentity.user_type == "AD") {
            (0, _logging.debugLog)("role type:", req.userIdentity);

            connection.query("select algaeh_d_module_id, module_name,module_code, icons,other_language  from algaeh_d_app_module\
              where  record_status=md5('A') " + superUser + " order by display_order ", function (error, result) {
              if (error) {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              }
              var outputArray = [];
              if (result.length > 0) {
                var _loop3 = function _loop3(i) {
                  connection.query("select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect,other_language, module_id\
                      from algaeh_d_app_screens where record_status='A' and  module_id=?", [result[i].algaeh_d_module_id], function (error, screenResult) {
                    if (error) {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    }
                    var obj = _extends({}, result[i], { ScreenList: screenResult });

                    outputArray.push(obj);
                    if (i == result.length - 1) {
                      req.records = outputArray;
                      (0, _utils.releaseDBConnection)(db, connection);
                      next();
                    }
                  });
                };

                for (var i = 0; i < result.length; i++) {
                  _loop3(i);
                }
              } else {
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = result;
                next();
              }
            });
          } else {
            resolve({});
          }
        } catch (e) {
          reject(e);
        }
      }).then(function (modifyRes) {
        (0, _logging.debugLog)("genreal  if ");
        connection.query(" select algaeh_m_module_role_privilage_mapping_id, module_id,module_code,module_name, icons,module_code,other_language,role_id, view_privilege\
        from algaeh_m_module_role_privilage_mapping MRP\
        inner join algaeh_d_app_module M on MRP.module_id=M.algaeh_d_module_id\
        where MRP.record_status='A' and M.record_status=md5('A') and MRP.role_id=?", [req.userIdentity.role_id], function (error, result) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }
          var outputArray = [];

          (0, _logging.debugLog)("userIdentity:", req.userIdentity);
          if (result.length > 0) {
            var _loop4 = function _loop4(i) {
              connection.query("SELECT algaeh_m_screen_role_privilage_mapping_id, \
                module_role_map_id, screen_id,screen_code,screen_name,page_to_redirect,other_language, role_id, view_privilege \
                  from \
                algaeh_m_screen_role_privilage_mapping SRM inner join algaeh_d_app_screens S \
                on SRM.screen_id=S.algaeh_app_screens_id\
                where SRM.record_status='A' and S.record_status='A' and module_role_map_id=?", [result[i].algaeh_m_module_role_privilage_mapping_id], function (error, screenResult) {
                if (error) {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                }
                var obj = _extends({}, result[i], { ScreenList: screenResult });

                outputArray.push(obj);
                if (i == result.length - 1) {
                  req.records = outputArray;
                  (0, _utils.releaseDBConnection)(db, connection);
                  next();
                }
              });
            };

            for (var i = 0; i < result.length; i++) {
              _loop4(i);
            }
          } else {
            (0, _utils.releaseDBConnection)(db, connection);
            req.records = result;
            next();
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
var getRoleBaseInActiveComponents = function getRoleBaseInActiveComponents(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }

    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("SELECT  SERM.view_privilege, screen_element_id,screen_element_code,screen_element_name,component_code,\
        screen_code, module_code from algaeh_m_scrn_elmnt_role_privilage_mapping SERM\
        inner join algaeh_d_app_scrn_elements  SE on SERM.screen_element_id=SE.algaeh_d_app_scrn_elements_id\
        inner join algaeh_d_app_component C on SE.component_id=C.algaeh_d_app_component_id  \
        inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
        inner join  algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
         where SERM.record_status='A' and SE.record_status='A' and  C.record_status='A'\
         and  S.record_status='A' and M.record_status=md5('A') and role_id=?", [req.userIdentity.role_id], function (error, elementsHide) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        connection.query("SELECT module_code,\
            component_code,screen_code from \
            algaeh_m_component_role_privilage_mapping CRM inner join algaeh_d_app_component C\
             on CRM.component_id=C.algaeh_d_app_component_id\
             inner join algaeh_d_app_screens S on C.screen_id=S.algaeh_app_screens_id\
             inner join algaeh_d_app_module M on S.module_id=M.algaeh_d_module_id\
             where  CRM.record_status='A' and C.record_status='A' and  M.record_status= md5('A') and \
             S.record_status='A'  and role_id=?", [req.userIdentity.role_id], function (error, componentHide) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }

          (0, _utils.releaseDBConnection)(db, connection);
          req.records = {
            listOfComponentsToHide: componentHide,
            screenElementsToHide: elementsHide
          };
          next();
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
var addAlgaehModule = function addAlgaehModule(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (req.userIdentity.role_type == "SU" && req.userIdentity.group_type == "SU") {
        connection.query("INSERT INTO `algaeh_d_app_module` (module_code, module_name, licence_key, access_by, icons, other_language,  created_date, created_by, updated_date, updated_by, record_status)\
            VALUE(?,?,?,?,?,?, ?,?,?,?,md5(?))", [input.module_code, input.module_name, input.licence_key, input.access_by, input.icons, input.other_language, new Date(), input.created_by, new Date(), input.updated_by, "A"], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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
var getAlgaehModules = function getAlgaehModules(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var superUser = "";
    //for admin login
    if (req.userIdentity.role_type == "AD") {
      superUser = " and   access_by <> 'SU'";
    }
    (0, _logging.debugLog)("req.userIdentity:", req.userIdentity);
    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select algaeh_d_module_id, module_name,module_code, icons,other_language  from algaeh_d_app_module\
              where  record_status=md5('A') " + superUser + " order by algaeh_d_module_id desc", function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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
var updateAlgaehModules = function updateAlgaehModules(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.body);

      if (req.userIdentity.role_type == "SU" && req.userIdentity.group_type == "SU") {
        if (input.hims_f_dental_treatment_id != "null" || input.hims_f_dental_treatment_id != undefined) {
          connection.query("update hims_f_dental_treatment set  scheduled_date=?, distal=?, incisal=?,\
             occlusal=?, mesial=?, buccal=?, labial=?, cervical=?, palatal=?, lingual=?,\
               updated_date=?, updated_by=? WHERE  `record_status`='A' and `hims_f_dental_treatment_id`=?;", [input.scheduled_date, input.distal, input.incisal, input.occlusal, input.mesial, input.buccal, input.labial, input.cervical, input.palatal, input.lingual, new Date(), input.updated_by, input.hims_f_dental_treatment_id], function (error, results) {
            (0, _utils.releaseDBConnection)(db, connection);
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
          });
        } else {
          (0, _utils.releaseDBConnection)(db, connection);
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
var addAlgaehScreen = function addAlgaehScreen(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (req.userIdentity.role_type == "SU" && req.userIdentity.group_type == "SU") {
        connection.query("INSERT INTO `algaeh_d_app_screens` (screen_code, screen_name, page_to_redirect, module_id, other_language,  created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?)", [input.screen_code, input.screen_name, input.page_to_redirect, input.module_id, input.other_language, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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
var getAlgaehScreens = function getAlgaehScreens(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("req.userIdentity:", req.userIdentity);

    var module_id = "";
    if (req.query.module_id != undefined && req.query.module_id != null) {
      module_id = " and module_id=" + req.query.module_id + " ";
    }

    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select algaeh_app_screens_id, screen_code, screen_name, page_to_redirect, module_id, other_language  from algaeh_d_app_screens\
              where  record_status='A'" + module_id + "  order by algaeh_app_screens_id desc ", function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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

//created by irfan: to add
var addAlgaehComponent = function addAlgaehComponent(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (req.userIdentity.role_type == "SU" && req.userIdentity.group_type == "SU") {
        connection.query("INSERT INTO `algaeh_d_app_component` (screen_id, component_code, component_name,  created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)", [input.screen_id, input.component_code, input.component_name, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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
var getAlgaehComponents = function getAlgaehComponents(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var screen_id = "";
    if (req.query.screen_id != undefined && req.query.screen_id != null) {
      screen_id = " and screen_id=" + req.query.screen_id + " ";
    }

    (0, _logging.debugLog)("req.userIdentity:", req.userIdentity);
    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select  algaeh_d_app_component_id, screen_id, component_code, component_name  from algaeh_d_app_component\
              where  record_status='A' " + screen_id + " order by algaeh_d_app_component_id desc ", function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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

//created by irfan: to add
var addAlgaehScreenElement = function addAlgaehScreenElement(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      if (req.userIdentity.role_type == "SU" && req.userIdentity.group_type == "SU") {
        connection.query("INSERT INTO `algaeh_d_app_scrn_elements` ( screen_element_code, screen_element_name, component_id, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?)", [input.screen_element_code, input.screen_element_name, input.component_id, new Date(), input.created_by, new Date(), input.updated_by], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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
var getAlgaehScreenElement = function getAlgaehScreenElement(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var component_id = "";
    if (req.query.component_id != undefined && req.query.component_id != null) {
      component_id = " and component_id=" + req.query.component_id + " ";
    }
    (0, _logging.debugLog)("req.userIdentity:", req.userIdentity);
    db.getConnection(function (error, connection) {
      if (req.userIdentity.role_type != "GN") {
        connection.query("select  algaeh_d_app_scrn_elements_id, screen_element_code, screen_element_name, component_id  from algaeh_d_app_scrn_elements\
              where  record_status='A' " + component_id + " order by algaeh_d_app_scrn_elements_id desc", function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
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

//created by irfan:
var getFormulas = function getFormulas(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("select algaeh_d_formulas_id, formula_for, formula from algaeh_d_formulas ", function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var addFormula = function addFormula(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `algaeh_d_formulas` (algaeh_d_formulas_id, formula_for, formula)\
          VALUE(?,?,?)", [input.algaeh_d_formulas_id, input.formula_for, input.formula], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;

        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var updateFormula = function updateFormula(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      (0, _logging.debugLog)("bode:", req.body);
      connection.query(" UPDATE algaeh_d_formulas SET algaeh_d_formulas_id = ?, formula_for = ?,\
         formula = ? WHERE algaeh_d_formulas_id =?;", [input.algaeh_d_formulas_id, input.formula_for, input.formula, input.old_formulas_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;

        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var deleteFormula = function deleteFormula(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query(" DELETE FROM algaeh_d_formulas WHERE algaeh_d_formulas_id = ?;", [input.algaeh_d_formulas_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;

        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//--------ROLE BASE SCREEN ASSIGNMENT---------------

module.exports = {
  addAlgaehGroupMAster: addAlgaehGroupMAster,
  addAlgaehRoleMAster: addAlgaehRoleMAster,
  addAlgaehModule: addAlgaehModule,
  getRoleBaseActiveModules: getRoleBaseActiveModules,
  getRoleBaseInActiveComponents: getRoleBaseInActiveComponents,
  getAlgaehModules: getAlgaehModules,
  addAlgaehScreen: addAlgaehScreen,
  getAlgaehScreens: getAlgaehScreens,
  addAlgaehComponent: addAlgaehComponent,
  getAlgaehComponents: getAlgaehComponents,
  addAlgaehScreenElement: addAlgaehScreenElement,
  getAlgaehScreenElement: getAlgaehScreenElement,
  getFormulas: getFormulas,
  addFormula: addFormula,
  updateFormula: updateFormula,
  deleteFormula: deleteFormula
};
//# sourceMappingURL=algaehMasters.js.map