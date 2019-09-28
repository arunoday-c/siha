"use strict";
import extend from "extend";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";
//import { LINQ } from "node-linq";
// import moment from "moment";
// import formater from "../../keys/keys";
// import { decryption } from "../../utils/cryptography";

const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  deleteRecord,
  jsonArrayToObject
} = utils;

//created by irfan: to add vital header
let addVitalMasterHeader = (req, res, next) => {
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
        "INSERT INTO `hims_d_vitals_header` (vitals_name, uom,general,display,created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?)",
        [
          input.vitals_name,
          input.uom,
          input.general,
          input.display,
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

//created by irfan: to getVitalMasterHeader
let getVitalMasterHeader = (req, res, next) => {
  let selectWhere = {
    hims_d_vitals_header_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_vitals_header_id,uom, vitals_name,general,display FROM hims_d_vitals_header where record_status='A' AND" +
          where.condition +
          " order by hims_d_vitals_header_id desc",
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

//created by irfan: to deleteVitalMasterHeader
let deleteVitalMasterHeader = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_vitals_header",
        id: req.body.hims_d_vitals_header_id,
        query:
          "UPDATE hims_d_vitals_header SET  record_status='I' WHERE hims_d_vitals_header_id=?",
        values: [req.body.hims_d_vitals_header_id]
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

//created by irfan: to updateVitalMasterHeader
let updateVitalMasterHeader = (req, res, next) => {
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
        "UPDATE `hims_d_vitals_header` SET vitals_name=?,uom=?,general=?,display=?,\
             updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_header_id`=?;",
        [
          input.vitals_name,
          input.uom,
          input.general,
          input.display,
          new Date(),
          input.updated_by,
          input.hims_d_vitals_header_id
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

//created by irfan: to add vital detail
let addVitalMasterDetail = (req, res, next) => {
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
        "INSERT INTO `hims_d_vitals_details` (vitals_header_id, gender, min_age, max_age, min_value, max_value, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          input.vitals_header_id,
          input.gender,
          input.min_age,
          input.max_age,
          input.min_value,
          input.max_value,
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

//created by irfan: to getVitalMasterHeader
let getVitalMasterDetail = (req, res, next) => {
  let selectWhere = {
    vitals_header_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_vitals_details_id, vitals_header_id, gender, min_age, max_age, min_value, max_value FROM hims_d_vitals_details where record_status='A' AND" +
          where.condition +
          " order by vitals_header_id desc",
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

//created by irfan: to deleteVitalMasterDetail
let deleteVitalMasterDetail = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_vitals_details",
        id: req.body.hims_d_vitals_details_id,
        query:
          "UPDATE hims_d_vitals_details SET  record_status='I' WHERE hims_d_vitals_details_id=?",
        values: [req.body.hims_d_vitals_details_id]
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

//created by irfan: to updateVitalMasterDetail
let updateVitalMasterDetail = (req, res, next) => {
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
        "UPDATE `hims_d_vitals_details` SET  vitals_header_id=?, gender=?, min_age=?, max_age=?, min_value=?, max_value=?,\
             updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vitals_details_id`=?;",
        [
          input.vitals_header_id,
          input.gender,
          input.min_age,
          input.max_age,
          input.min_value,
          input.max_value,
          new Date(),
          input.updated_by,
          input.hims_d_vitals_details_id
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
let addDepartmentVitalMap = (req, res, next) => {
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

      const insurtColumns = ["vital_header_id", "created_by", "updated_by"];

      connection.query(
        "INSERT INTO hims_m_department_vital_mapping(" +
          insurtColumns.join(",") +
          ",`department_id`,created_date,updated_date) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.vitals,
            newFieldToInsert: [input.department_id, new Date(), new Date()],
            req: req
          })
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          debugLog("Results are recorded...");
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
let getDepartmentVitalMap = (req, res, next) => {
  let selectWhere = {
    hims_m_department_vital_mapping_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_m_department_vital_mapping_id,department_id,vital_header_id FROM hims_m_department_vital_mapping where record_status='A' AND" +
          where.condition +
          " order by hims_m_department_vital_mapping_id desc",
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
  getDepartmentVitalMap
};
