import extend from "extend";
import {
  selectStatement,
  whereCondition,
  releaseDBConnection,
  deleteRecord
} from "../utils";
import httpStatus from "../utils/httpStatus";
let identityDoc = {
  hims_d_identity_document_id: null,
  identity_document_code: null,
  identity_document_name: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null
};
let addIdentity = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let db = req.db;
    let insertDoc = extend(identityDoc, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "INSERT INTO `hims_d_identity_document` \
            (`identity_document_code`, `identity_document_name`, `created_by`, `created_date`)\
            VALUE (?, ?, ?, ?)",
        [
          insertDoc.identity_document_code,
          insertDoc.identity_document_name,
          insertDoc.created_by,
          new Date()
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          insertDoc.hims_d_identity_document_id = result.insertId;
          connection.query(
            "SELECT `hims_d_identity_document_id`, `identity_document_code`,\
         `identity_document_name` \
         FROM `hims_d_identity_document` WHERE `record_status`='A' AND \
         `hims_d_identity_document_id`=? ",
            [insertDoc.hims_d_identity_document_id],
            (error, resultData) => {
              releaseDBConnection(db, connection);
              if (error) {
                next(error);
              }
              req.records = resultData;
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
let updateIdentity = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let updateIdentityDoc = extend(identityDoc, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_identity_document`\
    SET  `identity_document_name`=?, `updated_by`=?, `updated_date`=?\
    WHERE `record_status`='A' AND `hims_d_identity_document_id`=?;",
        [
          updateIdentityDoc.identity_document_name,
          updateIdentityDoc.updated_by,
          new Date(),
          updateIdentityDoc.hims_d_identity_document_id
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

let selectWhereCondition = {
  hims_d_identity_document_id: "ALL",
  identity_document_code: "ALL",
  identity_document_name: "ALL"
};
let selectIdentity = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let condition = whereCondition(extend(selectWhereCondition, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT `hims_d_identity_document_id`, `identity_document_code`, `identity_document_name`\
          ,`created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_identity_document` WHERE record_status ='A' AND " +
          condition.condition,
        values: condition.values
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

let deleteIdentity = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_identity_document",
        id: req.body.hims_d_identity_document_id,
        query:
          "UPDATE hims_d_identity_document SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_identity_document_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_identity_document_id
        ]
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
  addIdentity,
  updateIdentity,
  selectIdentity,
  deleteIdentity
};
