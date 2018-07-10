import extend from "extend";
import { whereCondition, releaseDBConnection, deleteRecord } from "../utils";
import httpStatus from "../utils/httpStatus";

let selectStatement = (req, res, next) => {
  let whereStatement = {
    hims_d_visit_type_id: "ALL",
    visit_type_code: "ALL",
    visit_type_desc: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(whereStatement, req.query));
      connection.query(
        "SELECT `hims_d_visit_type_id`, `visit_type_code`, `visit_type_desc`,`visit_status`,`arabic_visit_type_desc`\
       , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_visit_type`  WHERE record_status='A' AND " +
          where.condition,
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

let addVisit = (req, res, next) => {
  let visitType = {
    hims_d_visit_type_id: null,
    visit_type_code: null,
    visit_type_desc: null,
    hims_d_visit_type: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    visit_status: "A"
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(visitType, req.body);
    connection.query(
      "INSERT INTO `hims_d_visit_type` (`visit_type_code`, `visit_type_desc`, `hims_d_visit_type`, `created_by` \
     , `created_date`,`visit_status`) \
   VALUES ( ?, ?, ?, ?, ?,?)",
      [
        inputParam.visit_type_code,
        inputParam.visit_type_desc,
        inputParam.hims_d_visit_type,
        inputParam.created_by,
        new Date(),
        inputParam.visit_status
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
};

let updateVisit = (req, res, next) => {
  let visitType = {
    hims_d_visit_type_id: null,
    visit_type_code: null,
    visit_type_desc: null,
    hims_d_visit_type: null,
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    record_status: null,
    visit_status: "A"
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(visitType, req.body);
    connection.query(
      "UPDATE `hims_d_visit_type` \
     SET `visit_type_desc`=?, `hims_d_visit_type`=?,  `updated_by`=?, `updated_date`=?,visit_status=? \
     WHERE `record_status`='A' and `hims_d_visit_type_id`=?",
      [
        inputParam.visit_type_desc,
        inputParam.hims_d_visit_type,
        inputParam.updated_by,
        new Date(),
        inputParam.visit_status,
        inputParam.hims_d_visit_type_id
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
};
let deleteVisitType = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_visit_type",
        id: req.body.hims_d_visit_type_id,
        query:
          "UPDATE hims_d_visit_type SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_visit_type_id=?",
        values: [req.body.updated_by, new Date(), req.body.hims_d_visit_type_id]
      },
      result => {
        req.records = result;
        next();
      },
      error => {
        next(error);
      }
    );
  } catch (e) {
    next(e);
  }
};

module.exports = {
  selectStatement,
  addVisit,
  updateVisit,
  deleteVisitType
};
