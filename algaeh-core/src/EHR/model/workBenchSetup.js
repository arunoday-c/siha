"use strict";
import extend from "extend";
import utils from "../../utils";

import algaehMysql from "algaeh-mysql";

const { whereCondition, jsonArrayToObject } = utils;

//created by irfan: to add vital header
let addVitalMasterHeader = (req, res, next) => {
  try {
    let input = extend({}, req.body);
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_vitals_header` (vitals_name, uom,general,display,created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?,?)",
        values: [
          input.vitals_name,
          input.uom,
          input.general,
          input.display,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getVitalMasterHeader
let getVitalMasterHeader = (req, res, next) => {
  let selectWhere = {
    hims_d_vitals_header_id: "ALL",
  };
  try {
    const _mysql = new algaehMysql();

    let where = whereCondition(extend(selectWhere, req.query));

    _mysql
      .executeQuery({
        query:
          "select hims_d_vitals_header_id,uom, vitals_name,general,display FROM hims_d_vitals_header where record_status='A' AND" +
          where.condition +
          " order by hims_d_vitals_header_id desc",
        values: [...where.values],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to deleteVitalMasterHeader
let deleteVitalMasterHeader = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_vitals_header SET  record_status='I' WHERE hims_d_vitals_header_id=?",
        values: [req.body.hims_d_vitals_header_id],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to updateVitalMasterHeader
let updateVitalMasterHeader = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_vitals_header` SET vitals_name=?,uom=?,general=?,display=?,\
      updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_header_id`=?;",
        values: [
          input.vitals_name,
          input.uom,
          input.general,
          input.display,
          new Date(),
          input.updated_by,
          input.hims_d_vitals_header_id,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add vital detail
let addVitalMasterDetail = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_vitals_details` (vitals_header_id, gender, min_age, max_age, min_value, max_value, created_date, created_by, updated_date, updated_by)\
      VALUE(?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.vitals_header_id,
          input.gender,
          input.min_age,
          input.max_age,
          input.min_value,
          input.max_value,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getVitalMasterHeader
let getVitalMasterDetail = (req, res, next) => {
  let selectWhere = {
    vitals_header_id: "ALL",
  };
  try {
    const _mysql = new algaehMysql();

    let where = whereCondition(extend(selectWhere, req.query));

    _mysql
      .executeQuery({
        query:
          "select hims_d_vitals_details_id, vitals_header_id, gender, min_age, max_age, min_value, max_value FROM hims_d_vitals_details where record_status='A' AND" +
          where.condition +
          " order by vitals_header_id desc",
        values: where.values,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to deleteVitalMasterDetail
let deleteVitalMasterDetail = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_vitals_details SET  record_status='I' WHERE hims_d_vitals_details_id=?",
        values: [req.body.hims_d_vitals_details_id],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to updateVitalMasterDetail
let updateVitalMasterDetail = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);
    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_vitals_details` SET  vitals_header_id=?, gender=?, min_age=?, max_age=?, min_value=?, max_value=?,\
      updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_details_id`=?;",
        values: [
          input.vitals_header_id,
          input.gender,
          input.min_age,
          input.max_age,
          input.min_value,
          input.max_value,
          new Date(),
          input.updated_by,
          input.hims_d_vitals_details_id,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add
let addDepartmentVitalMap = (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = extend({}, req.body);

    const insurtColumns = ["vital_header_id", "created_by", "updated_by"];

    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_m_department_vital_mapping(" +
          insurtColumns.join(",") +
          ",`department_id`,created_date,updated_date) VALUES ?",
        values: [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.vitals,
            newFieldToInsert: [input.department_id, new Date(), new Date()],
            req: req,
          }),
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to
let getDepartmentVitalMap = (req, res, next) => {
  let selectWhere = {
    hims_m_department_vital_mapping_id: "ALL",
  };
  try {
    const _mysql = new algaehMysql();
    let where = whereCondition(extend(selectWhere, req.query));
    _mysql
      .executeQuery({
        query:
          "select hims_m_department_vital_mapping_id,department_id,vital_header_id FROM hims_m_department_vital_mapping where record_status='A' AND" +
          where.condition +
          " order by hims_m_department_vital_mapping_id desc",
        values: where.values,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

export default {
  addVitalMasterHeader,
  addVitalMasterDetail,
  getVitalMasterHeader,
  getVitalMasterDetail,
  deleteVitalMasterHeader,
  deleteVitalMasterDetail,
  updateVitalMasterHeader,
  updateVitalMasterDetail,
  addDepartmentVitalMap,
  getDepartmentVitalMap,
};
