"use strict";
import extend from "extend";

import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

//created by irfan:
let addDiagram = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (
      input.hims_d_employee_speciality_id > 0 &&
      input.image_desc != undefined
    ) {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_speciality_wise_diagrams` (image_desc,image_link,hims_d_employee_speciality_id,created_by,created_date,update_by,update_date)\
                VALUE(?,?,?,?,?,?,?)",
          values: [
            input.image_desc,
            input.image_link,
            input.hims_d_employee_speciality_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date()
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
        invalidInput: true,
        message: "provide valid input"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:
let getDiagrams = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select diagram_id,image_desc,image_link,\
            D.hims_d_employee_speciality_id,speciality_name from hims_d_speciality_wise_diagrams D\
            inner join hims_d_employee_speciality S on D.hims_d_employee_speciality_id=S.hims_d_employee_speciality_id"
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

//created by irfan:
let updateDiagram = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (input.diagram_id > 0) {
      _mysql
        .executeQuery({
          query:
            "update hims_d_speciality_wise_diagrams set\
            image_desc=?,image_link=?,hims_d_employee_speciality_id=?,update_by=?,update_date=?\
            where diagram_id=?",
          values: [
            input.image_desc,
            input.image_link,
            input.hims_d_employee_speciality_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.diagram_id
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
        invalidInput: true,
        message: "provide valid input"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan:
let deleteDiagram = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.body;
    if (input.diagram_id > 0) {
      _mysql
        .executeQuery({
          query:
            "delete from hims_d_speciality_wise_diagrams where diagram_id=?",
          values: [input.diagram_id]
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
        invalidInput: true,
        message: "provide valid input"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
export default { addDiagram, getDiagrams, updateDiagram, deleteDiagram };
