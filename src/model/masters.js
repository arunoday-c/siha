import { whereCondition, releaseDBConnection } from "../utils";
import extend from "extend";
import httpStatus from "../utils/httpStatus";
let titleWhere = {
  his_d_title_id: "ALL",
  title: "ALL"
};
let titleMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(titleWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT `his_d_title_id`, `title` FROM `hims_d_title` WHERE `record_status`='A' AND " +
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

let countryWhere = {
  hims_d_country_id: "ALL",
  country_code: "ALL",
  country_name: "ALL",
  status: "ALL"
};
let countryMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(countryWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_d_country_id`, `country_code`, `country_name`, `status` FROM `hims_d_country` WHERE `record_status`='A' AND " +
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

let stateWhere = {
  hims_d_state_id: "ALL",
  state_code: "ALL",
  state_name: "ALL",
  country_id: "ALL"
};
let stateMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(stateWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_d_state_id`, `state_code`, `state_name`, `country_id` FROM `hims_d_state` WHERE `record_status`='A' AND " +
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
let cityWhere = {
  hims_d_city_id: "ALL",
  city_code: "ALL",
  city_name: "ALL",
  state_id: "ALL"
};
let cityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(cityWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_d_city_id`, `city_code`, `city_name`, `state_id` FROM `hims_d_city` WHERE `record_status`='A' AND " +
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

let nationalityWhere = {
  hims_d_nationality_id: "ALL",
  nationality_code: "ALL",
  nationality: "ALL"
};
let nationalityMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(nationalityWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT `hims_d_nationality_id`, `nationality_code`, `nationality` FROM `hims_d_nationality` WHERE `record_status`='A' AND " +
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

let religionWhere = {
  hims_d_religion_id: "ALL",
  religion_code: "ALL",
  religion_name: "ALL"
};
let relegionMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(religionWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_d_religion_id`, `religion_code`, `religion_name` FROM `hims_d_religion` WHERE `record_status`='A' AND " +
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

let auogenWhere = {
  hims_f_app_numgen_id: "ALL",
  numgen_code: "ALL",
  module_desc: "ALL"
};
let autoGenMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(auogenWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_f_app_numgen_id`, `numgen_code`, `module_desc`, `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`, `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`, `pervious_num` FROM `hims_f_app_numgen` WHERE `record_status`='A' AND " +
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

let visaWhere = {
  hims_d_visa_type_id: "ALL",
  visa_type_code: "ALL",
  visa_desc: "ALL",
  visa_type: "ALL"
};
let visaMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = whereCondition(extend(visaWhere, req.query));
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.query(
        "SELECT `hims_d_visa_type_id`, `visa_type_code`, `visa_type`, `visa_desc`, `created_by`, \
        `created_date`, `updated_by`, `updated_date`, `visa_status` FROM `hims_d_visa_type` \
         WHERE `record_status`='A' AND " +
          where.condition,
        where.values,
        (error, result) => {
          connection.release();
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

let inputClicnicalNonClinicalDept = {
  department_type: "ALL"
};

let clinicalNonClinicalAll = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let where = extend(inputClicnicalNonClinicalDept, req.query);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let connectionString = "";
      if (where.department_type == "CLINICAL") {
        connectionString = " and hims_d_department.department_type='CLINICAL' ";
      } else if (where.department_type == "NON-CLINICAL") {
        connectionString =
          " and hims_d_department.department_type='NON-CLINICAL' ";
      }

      connection.query(
        "select hims_d_sub_department.hims_d_sub_department_id ,sub_department_code,sub_department_name\
       ,sub_department_desc,hims_d_sub_department.department_id,hims_d_department.department_type \
       from hims_d_sub_department,hims_d_department where \
       hims_d_sub_department.department_id=hims_d_department.hims_d_department_id \
       and hims_d_department.record_status='A' and sub_department_status='A' \
       " +
          connectionString,
        (error, result) => {
          connection.release();
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

module.exports = {
  titleMaster,
  countryMaster,
  stateMaster,
  cityMaster,
  relegionMaster,
  nationalityMaster,
  autoGenMaster,
  visaMaster,
  clinicalNonClinicalAll
};
