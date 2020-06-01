import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { whereCondition, releaseDBConnection, deleteRecord } = utils;

let selectIcdcptCodes = (req, res, next) => {
  let whereStatement = {
    hims_d_icd_id: "ALL",
    icd_code: "ALL",
    icd_description: "ALL",
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
        "SELECT * FROM `hims_d_icd`  \
       WHERE record_status='A' AND " +
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

let insertIcdcptCodes = (req, res, next) => {
  let Icdcpts = {
    hims_d_icd_id: null,
    icd_code: null,
    icd_description: null,
    long_icd_description: null,
    icd_level: null,
    icd_type: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(Icdcpts, req.body);
    connection.query(
      "INSERT INTO `hims_d_icd` (`icd_code`, `icd_description`,`long_icd_description`, `icd_level`, `icd_type` \
      , `created_by` ,`created_date`) \
   VALUES ( ?, ?, ?, ?, ?, ?, ?)",
      [
        inputParam.icd_code,
        inputParam.icd_description,
        inputParam.long_icd_description,
        inputParam.icd_level,
        inputParam.icd_type,
        inputParam.created_by,
        new Date(),
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

let updateIcdcptCodes = (req, res, next) => {
  let Icdcpts = {
    hims_d_icd_id: null,
    icd_code: null,
    icd_description: null,
    long_icd_description: null,
    icd_level: null,
    icd_type: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id,
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(Icdcpts, req.body);
    connection.query(
      "UPDATE `hims_d_icd` \
     SET `icd_code`=?,  `icd_description`=?,`long_icd_description`=?, `icd_level`=?,`icd_type`=?, \
     `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `hims_d_icd_id`=?",
      [
        inputParam.icd_code,
        inputParam.icd_description,
        inputParam.long_icd_description,
        inputParam.icd_level,
        inputParam.icd_type,
        inputParam.updated_by,
        new Date(),
        inputParam.hims_d_icd_id,
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
let deleteIcdcptCodes = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    deleteRecord(
      {
        db: req.db,
        tableName: "hims_d_icd",
        id: req.body.hims_d_icd_id,
        query:
          "UPDATE hims_d_icd SET  record_status='I', \
         updated_by=?,updated_date=? WHERE hims_d_icd_id=?",
        values: [req.body.updated_by, new Date(), req.body.hims_d_icd_id],
      },
      (result) => {
        req.records = result;
        next();
      },
      (error) => {
        next(error);
      },
      true
    );
  } catch (e) {
    next(e);
  }
};

//Cpt Code

let selectCptCodes = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = req.query;
    let _query = "";

    if (input.hims_d_cpt_code_id > 0) {
      _query += ` and hims_d_cpt_code_id=${input.hims_d_cpt_code_id} `;
    }

    if (input.cpt_code) {
      _query += ` and cpt_code=${input.cpt_code} `;
    }

    _mysql
      .executeQuery({
        query:
          "SELECT * FROM hims_d_cpt_code WHERE record_status='A' " + _query,

        printQuery: false,
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

let insertCptCodes = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputParam = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_d_cpt_code` (`cpt_code`, `cpt_desc`,`long_cpt_desc`, `prefLabel`,   \
         `created_by` ,`created_date`) VALUES ( ?, ?, ?, ?, ?,  ?)",
        values: [
          inputParam.cpt_code,
          inputParam.cpt_desc,
          inputParam.long_cpt_desc,
          inputParam.prefLabel,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
        ],
        printQuery: false,
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

let updateCptCodes = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputParam = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_d_cpt_code` \
        SET `cpt_code`=?,  `cpt_desc`=?,`long_cpt_desc`=?, `prefLabel`=?,`cpt_status`=?, \
        `updated_by`=?, `updated_date`=? WHERE `record_status`='A' and `hims_d_cpt_code_id`=?",
        values: [
          inputParam.cpt_code,
          inputParam.cpt_desc,
          inputParam.long_cpt_desc,
          inputParam.prefLabel,
          inputParam.cpt_status,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.hims_d_cpt_code_id,
        ],
        printQuery: false,
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

let deleteCptCodes = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputParam = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_d_cpt_code SET  record_status='I', \
        updated_by=?,updated_date=? WHERE hims_d_cpt_code_id=?",
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.hims_d_cpt_code_id,
        ],
        printQuery: false,
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
  selectIcdcptCodes,
  insertIcdcptCodes,
  updateIcdcptCodes,
  deleteIcdcptCodes,

  selectCptCodes,
  insertCptCodes,
  updateCptCodes,
  deleteCptCodes,
};
