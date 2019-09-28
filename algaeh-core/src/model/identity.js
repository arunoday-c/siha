import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugLog } = logUtils;
const {
  selectStatement,
  whereCondition,
  runningNumber,
  releaseDBConnection,
  deleteRecord
} = utils;

let addIdentity = (req, res, next) => {
  let identityDoc = {
    hims_d_identity_document_id: null,
    identity_document_code: null,
    identity_document_name: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

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

      runningNumber(req.db, 6, "IDEN_DOC", (error, records, newNumber) => {
        debugLog("newNumber:" + newNumber);
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        if (records.length != 0) {
          req.query.identity_document_code = newNumber;
          req.body.identity_document_code = newNumber;
          insertDoc.identity_document_code = newNumber;
        }

        connection.query(
          "INSERT INTO `hims_d_identity_document` \
            (`identity_document_code`, `identity_document_name`, `arabic_identity_document_name`, `created_by`\
            , `created_date`,`identity_status`)\
            VALUE (?, ?, ?, ?,?,?)",
          [
            insertDoc.identity_document_code,
            insertDoc.identity_document_name,
            insertDoc.arabic_identity_document_name,
            insertDoc.created_by,
            new Date(),
            insertDoc.identity_status
          ],
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            insertDoc.hims_d_identity_document_id = result.insertId;
            connection.query(
              "SELECT `hims_d_identity_document_id`, `identity_document_code`,\
         `identity_document_name`, `arabic_identity_document_name`,`identity_status` \
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
    });
  } catch (e) {
    next(e);
  }
};
let updateIdentity = (req, res, next) => {
  let identityDoc = {
    hims_d_identity_document_id: null,
    identity_document_code: null,
    identity_document_name: null,
    arabic_identity_document_name: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let updateIdentityDoc = extend(identityDoc, req.body);
    debugLog("updateIdentityDoc", updateIdentityDoc);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }
      connection.query(
        "UPDATE `hims_d_identity_document`\
    SET  `identity_document_name`=?, `arabic_identity_document_name` = ?,`updated_by`=?, `updated_date`=? \
    ,`identity_status` = ? \
    WHERE `record_status`='A' AND `hims_d_identity_document_id`=?;",
        [
          updateIdentityDoc.identity_document_name,
          updateIdentityDoc.arabic_identity_document_name,
          updateIdentityDoc.updated_by,
          new Date(),
          updateIdentityDoc.identity_status,
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

let selectIdentity = (req, res, next) => {
  let selectWhereCondition = {
    hims_d_identity_document_id: "ALL",
    identity_document_code: "ALL",
    identity_document_name: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let condition = whereCondition(extend(selectWhereCondition, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT `hims_d_identity_document_id`, `identity_document_code`, `identity_document_name`, `arabic_identity_document_name`, `identity_status`\
          ,`created_by`, `created_date`, `updated_by`, `updated_date`,`identity_status` FROM `hims_d_identity_document` WHERE record_status ='A' AND " +
          condition.condition +
          " order by hims_d_identity_document_id desc",
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
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

export default {
  addIdentity,
  updateIdentity,
  selectIdentity,
  deleteIdentity
};
