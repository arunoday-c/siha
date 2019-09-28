import utils from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
import cacheUtils from "../utils/caching";

const { deleteFromCache } = cacheUtils;
const { releaseDBConnection, deleteRecord } = utils;

let insertToAppgen = (req, res, next) => {
  let modelAppGen = {
    hims_f_app_numgen_id: null,
    numgen_code: null,
    module_desc: null,
    prefix: null,
    intermediate_series: null,
    postfix: null,
    length: null,
    increment_by: null,
    numgen_seperator: null,
    postfix_start: null,
    postfix_end: null,
    current_num: null,
    pervious_num: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
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
      let inputParam = extend(modelAppGen, req.body);
      connection.query(
        "INSERT INTO `hims_f_app_numgen` (`numgen_code`, `module_desc`\
      , `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`\
      , `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`\
      , `pervious_num`, `created_by`, `created_date`)\
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          inputParam.numgen_code,
          inputParam.module_desc,
          inputParam.prefix,
          inputParam.intermediate_series,
          inputParam.postfix,
          inputParam.length,
          inputParam.increment_by,
          inputParam.numgen_seperator,
          inputParam.postfix_start,
          inputParam.postfix_end,
          inputParam.current_num,
          inputParam.pervious_num,
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
  } catch (e) {
    next(e);
  }
};
let updateToAppgen = (req, res, next) => {
  let modelAppGen = {
    hims_f_app_numgen_id: null,
    numgen_code: null,
    module_desc: null,
    prefix: null,
    intermediate_series: null,
    postfix: null,
    length: null,
    increment_by: null,
    numgen_seperator: null,
    postfix_start: null,
    postfix_end: null,
    current_num: null,
    pervious_num: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id
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
      let inputParam = extend(modelAppGen, req.body);
      connection.query(
        "UPDATE `hims_f_app_numgen` \
          SET  `numgen_code`=?, `module_desc`=?, `prefix`=?, \
          `intermediate_series`=?, `postfix`=?, `length`=?, `increment_by`=?,\
          `numgen_seperator`=?, `postfix_start`=?, `postfix_end`=?, \
          `current_num`=?, `pervious_num`=?,  `updated_by`=?, `updated_date`=? \
          WHERE  `record_status`='A' AND `hims_f_app_numgen_id`=?",
        [
          inputParam.numgen_code,
          inputParam.module_desc,
          inputParam.prefix,
          inputParam.intermediate_series,
          inputParam.postfix,
          inputParam.length,
          inputParam.increment_by,
          inputParam.numgen_seperator,
          inputParam.postfix_start,
          inputParam.postfix_end,
          inputParam.current_num,
          inputParam.pervious_num,
          inputParam.updated_by,
          new Date(),
          inputParam.hims_f_app_numgen_id
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

let addVisa = (req, res, next) => {
  let visaType = {
    hims_d_visa_type_id: null,
    visa_type_code: null,
    visa_type: null,
    visa_desc: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    visa_status: "A"
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
      let inputParam = extend(visaType, req.body);
      connection.query(
        "INSERT INTO `hims_d_visa_type` ( `visa_type_code`, `visa_type`, `visa_desc`, `created_by`, `created_date`,`visa_status`) \
     VALUES (?, ?, ?, ?, ?,?)",
        [
          inputParam.visa_type_code,
          inputParam.visa_type,
          inputParam.visa_desc,
          inputParam.created_by,
          new Date(),
          inputParam.visa_status
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

      deleteFromCache("visa");
    });
  } catch (e) {
    next(e);
  }
};

let updateVisa = (req, res, next) => {
  let visaType = {
    hims_d_visa_type_id: null,
    visa_type_code: null,
    visa_type: null,
    visa_desc: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

    visa_status: "A"
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
      let inputParam = extend(visaType, req.body);
      connection.query(
        "UPDATE `hims_d_visa_type` \
        SET `visa_type`=?, `arabic_visa_type` = ?, `updated_by`=?, `updated_date`=? \
        ,`visa_status` =? \
        WHERE `record_status`='A' and `hims_d_visa_type_id`=?",
        [
          inputParam.visa_type,
          inputParam.arabic_visa_type,
          inputParam.updated_by,
          new Date(),
          inputParam.visa_status,
          inputParam.hims_d_visa_type_id
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
      deleteFromCache("visa");
    });
  } catch (e) {
    next(e);
  }
};

let deleteVisa = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_visa_type",
        id: req.body.hims_d_visa_type_id,
        query:
          "UPDATE hims_d_visa_type SET  record_status='I', \
          updated_by=?,updated_date=? WHERE hims_d_visa_type_id=?",
        values: [req.body.updated_by, new Date(), req.body.hims_d_visa_type_id]
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
    deleteFromCache("visa");
  } catch (e) {
    next(e);
  }
};

export default {
  insertToAppgen,
  updateToAppgen,
  updateVisa,
  addVisa,
  deleteVisa
};
