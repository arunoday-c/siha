import { LINQ } from "node-linq";
import algaehMysql from "algaeh-mysql";

const keyPath = require("algaeh-keys/keys");

let titleMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.his_d_title_id != null) {
      _stringData += " and his_d_title_id=?";
      inputValues.push(req.query.his_d_title_id);
    }
    if (req.query.title != null) {
      _stringData += " and title=?";
      inputValues.push(req.query.title);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT `his_d_title_id`, `title`, `arabic_title` FROM `hims_d_title` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let countryMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_country_id != null) {
      _stringData += " and hims_d_country_id=?";
      inputValues.push(req.query.hims_d_country_id);
    }
    if (req.query.country_code != null) {
      _stringData += " and country_code=?";
      inputValues.push(req.query.country_code);
    }
    if (req.query.country_name != null) {
      _stringData += " and country_name=?";
      inputValues.push(req.query.country_name);
    }
    if (req.query.status != null) {
      _stringData += " and status=?";
      inputValues.push(req.query.status);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT `hims_d_country_id`, `country_code`, `country_name`, `status` FROM `hims_d_country` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let stateMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_state_id != null) {
      _stringData += " and hims_d_state_id=?";
      inputValues.push(req.query.hims_d_state_id);
    }
    if (req.query.state_code != null) {
      _stringData += " and state_code=?";
      inputValues.push(req.query.state_code);
    }
    if (req.query.state_name != null) {
      _stringData += " and state_name=?";
      inputValues.push(req.query.state_name);
    }
    if (req.query.country_id != null) {
      _stringData += " and country_id=?";
      inputValues.push(req.query.country_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT `hims_d_state_id`, `state_code`, `state_name`, `country_id` FROM `hims_d_state` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let cityMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_city_id != null) {
      _stringData += " and hims_d_city_id=?";
      inputValues.push(req.query.hims_d_city_id);
    }
    if (req.query.city_code != null) {
      _stringData += " and city_code=?";
      inputValues.push(req.query.city_code);
    }
    if (req.query.city_name != null) {
      _stringData += " and city_name=?";
      inputValues.push(req.query.city_name);
    }
    if (req.query.state_id != null) {
      _stringData += " and state_id=?";
      inputValues.push(req.query.state_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT `hims_d_city_id`, `city_code`, `city_name`, `state_id` FROM `hims_d_city` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let nationalityMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_nationality_id != null) {
      _stringData += " and hims_d_nationality_id=?";
      inputValues.push(req.query.hims_d_nationality_id);
    }
    if (req.query.nationality_code != null) {
      _stringData += " and nationality_code=?";
      inputValues.push(req.query.nationality_code);
    }
    if (req.query.nationality != null) {
      _stringData += " and nationality=?";
      inputValues.push(req.query.nationality);
    }

    _mysql
      .executeQuery({
        query:
          "SELECT `hims_d_nationality_id`, `nationality_code`, `nationality`,`arabic_nationality` FROM `hims_d_nationality` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let relegionMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_religion_id != null) {
      _stringData += " and hims_d_religion_id=?";
      inputValues.push(req.query.hims_d_religion_id);
    }
    if (req.query.religion_code != null) {
      _stringData += " and religion_code=?";
      inputValues.push(req.query.religion_code);
    }
    if (req.query.religion_name != null) {
      _stringData += " and religion_name=?";
      inputValues.push(req.query.religion_name);
    }

    _mysql
      .executeQuery({
        query:
          "SELECT `hims_d_religion_id`, `religion_code`, `religion_name`,`arabic_religion_name` FROM `hims_d_religion` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let autoGenMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_f_app_numgen_id != null) {
      _stringData += " and hims_f_app_numgen_id=?";
      inputValues.push(req.query.hims_f_app_numgen_id);
    }
    if (req.query.numgen_code != null) {
      _stringData += " and numgen_code=?";
      inputValues.push(req.query.numgen_code);
    }
    if (req.query.module_desc != null) {
      _stringData += " and module_desc=?";
      inputValues.push(req.query.module_desc);
    }

    _mysql
      .executeQuery({
        query:
          "SELECT `hims_f_app_numgen_id`, `numgen_code`, `module_desc`, `prefix`, `intermediate_series`, `postfix`, `length`, `increment_by`, `numgen_seperator`, `postfix_start`, `postfix_end`, `current_num`, `pervious_num` FROM `hims_f_app_numgen` WHERE `record_status`='A' " +
          _stringData,
        values: inputValues
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

let visaMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_visa_type_id != null) {
      _stringData += " and hims_d_visa_type_id=?";
      inputValues.push(req.query.hims_d_visa_type_id);
    }
    if (req.query.visa_type_code != null) {
      _stringData += " and visa_type_code=?";
      inputValues.push(req.query.visa_type_code);
    }
    if (req.query.visa_type != null) {
      _stringData += " and visa_type=?";
      inputValues.push(req.query.visa_type);
    }

    _mysql
      .executeQuery({
        query:
          "SELECT `hims_d_visa_type_id`, `visa_type_code`, `visa_type`, `arabic_visa_type`, \
             `created_by`, `created_date`, `updated_by`, `updated_date`, `visa_status` FROM \
             `hims_d_visa_type` WHERE `record_status`='A' AND " +
          _stringData +
          " order by hims_d_visa_type_id desc",
        values: inputValues
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

let clinicalNonClinicalAll = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let connectionString = "";
    if (where.department_type == "CLINICAL") {
      connectionString = " and hims_d_department.department_type='CLINICAL' ";
    } else if (where.department_type == "NON-CLINICAL") {
      connectionString =
        " and hims_d_department.department_type='NON-CLINICAL' ";
    }

    _mysql
      .executeQuery({
        query:
          "select hims_d_sub_department.hims_d_sub_department_id ,sub_department_code,sub_department_name\
        ,sub_department_desc, arabic_sub_department_name, hims_d_sub_department.department_id,hims_d_department.department_type \
        from hims_d_sub_department,hims_d_department where \
        hims_d_sub_department.department_id=hims_d_department.hims_d_department_id \
        and hims_d_department.record_status='A' and sub_department_status='A' \
        " +
          connectionString
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

let countryStateCity = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select  hims_d_country_id,country_name,arabic_country_name  from hims_d_country where status='A';\
        select hims_d_state_id,state_name,arabic_state_name,country_id  from hims_d_state where record_status='A';\
        select  hims_d_city_id,city_name,city_arabic_name,state_id  from hims_d_city where record_status='A';"
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

//created by irfan: to  kill all the database-connections
let killDbConnections = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: "SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST  "
      })
      .then(result => {
        let idList = new LINQ(result)
          .Where(w => w.COMMAND == "Sleep")
          .Select(s => s.ID)
          .ToArray();

        let qry = "";
        for (let i = 0; i < idList.length; i++) {
          qry += "kill " + idList[i] + ";";
        }

        if (idList.length > 0) {
          _mysql
            .executeQuery({
              query: qry
            })
            .then(data => {
              _mysql.releaseConnection();
              req.records = "all process deleted";
              next();
            })
            .catch(error => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          req.records = result;
          next();
        }
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

export default {
  titleMaster,
  countryMaster,
  stateMaster,
  cityMaster,
  relegionMaster,
  nationalityMaster,
  autoGenMaster,
  visaMaster,
  clinicalNonClinicalAll,
  countryStateCity,
  killDbConnections
};
