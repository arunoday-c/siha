import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  deleteRecord,
  selectStatement,
  paging
} = utils;

let selectPattypeStatement = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    // let condition = whereCondition(extend({}, req.query));
    let query =
      "SELECT SQL_CALC_FOUND_ROWS `hims_d_patient_type_id`, `patient_type_code`, `patitent_type_desc`,`arabic_patitent_type_desc`\
    , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_patient_type`  WHERE record_status='A';" +
      pagePaging +
      " " +
      "SELECT FOUND_ROWS() total_pages";

    debugLog("Love", query);
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT SQL_CALC_FOUND_ROWS `hims_d_patient_type_id`, `patient_type_code`, `patitent_type_desc`,`arabic_patitent_type_desc`\
        , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_patient_type`  WHERE record_status='A';" +
          pagePaging +
          " " +
          "SELECT FOUND_ROWS() total_pages"
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

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     let where = whereCondition(extend(whereStatement, req.query));
  //     connection.query(
  //       "SELECT `hims_d_patient_type_id`, `patient_type_code`, `patitent_type_desc`,`arabic_patitent_type_desc`\
  //      , `created_by`, `created_date`, `updated_by`, `updated_date` FROM `hims_d_patient_type`  WHERE record_status='A' AND " +
  //         where.condition,
  //       where.values,
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

let addPatientType = (req, res, next) => {
  let visitType = {
    hims_d_patient_type_id: null,
    patient_type_code: null,
    patitent_type_desc: null,
    arabic_patitent_type_desc: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

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
      "INSERT INTO `hims_d_patient_type` (`patient_type_code`, `patitent_type_desc`, `arabic_patitent_type_desc`, `created_by` \
     , `created_date`) \
   VALUES ( ?, ?, ?, ?, ?)",
      [
        inputParam.patient_type_code,
        inputParam.patitent_type_desc,
        inputParam.arabic_patitent_type_desc,
        inputParam.created_by,
        new Date()
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

let updatePatientType = (req, res, next) => {
  let visitType = {
    hims_d_patient_type_id: null,
    patient_type_code: null,
    patitent_type_desc: null,
    arabic_patitent_type_desc: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

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
      "UPDATE `hims_d_patient_type` \
     SET `patitent_type_desc`=?, `arabic_patitent_type_desc`=?,  `updated_by`=?, `updated_date`=?\
     WHERE `record_status`='A' and `hims_d_patient_type_id`=?",
      [
        inputParam.patitent_type_desc,
        inputParam.arabic_patitent_type_desc,
        inputParam.updated_by,
        new Date(),
        inputParam.hims_d_patient_type_id
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
let deletePatientType = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    debugLog(
      "req.body.hims_d_patient_type_id",
      req.body.hims_d_patient_type_id
    );
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_patient_type",
        id: req.body.hims_d_patient_type_id,
        query:
          "UPDATE hims_d_patient_type SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_patient_type_id=?",
        values: [
          req.body.updated_by,
          new Date(),
          req.body.hims_d_patient_type_id
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

let getPatientType = (req, res, next) => {
  let whereStatement = {
    hims_d_patient_type_id: "ALL",
    patient_type_code: "ALL",
    patitent_type_desc: "ALL"
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
        "SELECT * FROM `hims_d_patient_type`  \
       WHERE record_status='A' AND " +
          where.condition +
          " order by hims_d_patient_type_id desc",
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
  selectPattypeStatement,
  addPatientType,
  updatePatientType,
  deletePatientType,
  getPatientType
};
