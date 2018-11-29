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
//import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";

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
        "INSERT INTO `algaeh_d_app_module` (algaeh_d_module_id,module_name, licence_key, created_date, created_by, updated_date, updated_by, record_status)\
            VALUE(?,?,?,?,?,?,?,md5(?))",
        [
          input.algaeh_d_module_id,
          input.module_name,
          input.licence_key,

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

//created by irfan: to get
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
                "select algaeh_app_screens_id, screen_code, screen_name, screen_desc, module_id\
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
let getAlgaehModule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        " select algaeh_m_module_role_privilage_mapping_id, module_id,module_name, role_id, view_privilege\
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
                module_role_map_id, screen_id,screen_name, role_id, delete_privilege, add_privilege, view_privilege, \
                update_privilege, print_privilege, access_email, privilege_status from \
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

module.exports = { addAlgaehGroupMAster, addAlgaehModule, getAlgaehModule };
