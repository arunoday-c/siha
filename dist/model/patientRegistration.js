"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addPatientToRegisteration = function addPatientToRegisteration(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (errror) {
        next(error);
      }
      insertData(connection, req, res, function (error, result) {
        connection.release();
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};
var updatePatientRegistrstion = function updatePatientRegistrstion(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      updateData(connection, req, function (error, result) {
        connection.release();
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};
//Added by noor New Method

var insertPatientData = function insertPatientData(req, res, next) {
  try {
    (0, _logging.debugFunction)("Insert Patient Registration");
    var inputparam = (0, _extend2.default)({
      hims_d_patient_id: null,
      patient_code: null,
      registration_date: null,
      title_id: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      gender: null,
      religion_id: null,
      date_of_birth: null,
      age: null,
      marital_status: null,
      address1: null,
      address2: null,
      contact_number: null,
      secondary_contact_number: null,
      email: null,
      emergency_contact_name: "",
      emergency_contact_number: "",
      relationship_with_patient: "",
      visa_type_id: null,
      nationality_id: null,
      postal_code: null,
      primary_identity_id: null,
      primary_id_no: null,
      secondary_identity_id: "",
      secondary_id_no: "",
      photo_file: "",
      primary_id_file: "",
      secondary_id_file: "",
      created_by: null,
      created_date: null,
      updated_by: null,
      updated_date: null,
      city_id: null,
      state_id: null,
      country_id: null,
      documents: null
    }, req.body);
    inputparam.registration_date = new Date();

    var options = req.options;

    var db = options == null ? req.db : options.db;

    db.query("INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
    , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
    , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
    , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
    , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
    , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
    , `photo_file`, `primary_id_file`, `secondary_id_file`, `created_by`, `created_date`\
    ,`city_id`,`state_id`,`country_id`)\
     VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);", [inputparam.patient_code, inputparam.registration_date, inputparam.title_id, inputparam.first_name, inputparam.middle_name, inputparam.last_name, inputparam.full_name, inputparam.arabic_name, inputparam.gender, inputparam.religion_id, inputparam.date_of_birth, inputparam.age, inputparam.marital_status, inputparam.address1, inputparam.address2, inputparam.contact_number, inputparam.secondary_contact_number, inputparam.email, inputparam.emergency_contact_name, inputparam.emergency_contact_number, inputparam.relationship_with_patient, inputparam.visa_type_id, inputparam.nationality_id, inputparam.postal_code, inputparam.primary_identity_id, inputparam.primary_id_no, inputparam.secondary_identity_id, inputparam.secondary_id_no, inputparam.photo_file, inputparam.primary_id_file, inputparam.secondary_id_file, inputparam.created_by, new Date(), inputparam.city_id, inputparam.state_id, inputparam.country_id], function (error, result) {
      if (error) {
        if (options == null) {
          db.rollback(function () {
            next(error);
          });
        } else {
          options.onFailure(error);
        }
      } else {
        inputparam.patient_id = result.insertId;
        req.patient_id = result.insertId;
        if (options != null) options.onSuccess(result);else {
          req.records = result;
          next();
        }

        //     let optionString =
        //       "SELECT `algaeh_d_app_config_id`, `param_name`, `param_value` FROM `algaeh_d_app_config` WHERE `record_status` ='A' AND \
        //      param_category='DOCUMENTS' AND param_name='PATIENT_DOC_PATH';";
        //     db.query(
        //       "SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
        // , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
        // , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
        // , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
        // , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
        // , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
        // , `photo_file`, `primary_id_file`, `secondary_id_file` FROM `hims_f_patient`\
        //  WHERE `record_status`='A' AND hims_d_patient_id=? ;" +
        //         optionString,
        //       [inputparam.patient_id],
        //       (error, records) => {
        //         if (error) {
        //           if (options != null) options.omFailure(error);
        //           else {
        //             db.rollback(() => {
        //               next(error);
        //             });
        //           }
        //         }
        //         req["folderPath"] =
        //           records[1][0]["param_value"] +
        //           "/" +
        //           records[0][0]["patient_code"];
        //         req["fileName"] = records[0][0]["patient_code"];
        //         if (options != null) {
        //           options.onSuccess(records);
        //         } else {
        //           req.records = records;
        //           next();
        //         }
        //       }
        //     );
      }
    });
  } catch (e) {
    next(e);
  }
};

//End New Method

var insertData = function insertData(dataBase, req, res, callBack, isCommited, next) {
  var patientModel = {
    hims_d_patient_id: null,
    patient_code: null,
    registration_date: null,
    title_id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    gender: null,
    religion_id: null,
    date_of_birth: null,
    age: null,
    marital_status: null,
    address1: null,
    address2: null,
    contact_number: null,
    secondary_contact_number: null,
    email: null,
    emergency_contact_name: "",
    emergency_contact_number: "",
    relationship_with_patient: "",
    visa_type_id: null,
    nationality_id: null,
    postal_code: null,
    primary_identity_id: null,
    primary_id_no: null,
    secondary_identity_id: "",
    secondary_id_no: "",
    photo_file: "",
    primary_id_file: "",
    secondary_id_file: "",
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    city_id: null,
    state_id: null,
    country_id: null,
    documents: null /*{
                        patientImage:{base64String:"",fileExtention:""},
                        patientPrimaryID:{base64String:"",fileExtention:""},
                        patientSecondaryID:{base64String:"",fileExtention:""}
                      }
                    */
  };
  isCommited = isCommited || false;
  try {
    (0, _logging.debugFunction)("Insert Patient Registration");
    var inputparam = (0, _extend2.default)(patientModel, req.body);
    inputparam.registration_date = new Date();
    dataBase.query("INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
    , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
    , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
    , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
    , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
    , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
    , `photo_file`, `primary_id_file`, `secondary_id_file`, `created_by`, `created_date`\
    ,`city_id`,`state_id`,`country_id`)\
     VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);", [inputparam.patient_code, inputparam.registration_date, inputparam.title_id, inputparam.first_name, inputparam.middle_name, inputparam.last_name, inputparam.full_name, inputparam.arabic_name, inputparam.gender, inputparam.religion_id, inputparam.date_of_birth, inputparam.age, inputparam.marital_status, inputparam.address1, inputparam.address2, inputparam.contact_number, inputparam.secondary_contact_number, inputparam.email, inputparam.emergency_contact_name, inputparam.emergency_contact_number, inputparam.relationship_with_patient,
    // checkIsNull(inputparam.contact_number, 0),
    // checkIsNull(inputparam.secondary_contact_number, 0),
    // checkIsNull(inputparam.email, ""),
    // checkIsNull(inputparam.emergency_contact_name, ""),
    // checkIsNull(inputparam.emergency_contact_number, 0),
    // checkIsNull(inputparam.relationship_with_patient, ""),
    inputparam.visa_type_id, inputparam.nationality_id, inputparam.postal_code, inputparam.primary_identity_id, inputparam.primary_id_no, inputparam.secondary_identity_id, inputparam.secondary_id_no, inputparam.photo_file, inputparam.primary_id_file, inputparam.secondary_id_file,
    // checkIsNull(inputparam.secondary_identity_id, 1),
    // checkIsNull(inputparam.secondary_id_no, ""),
    // checkIsNull(inputparam.photo_file, ""),
    // checkIsNull(inputparam.primary_id_file, ""),
    // checkIsNull(inputparam.secondary_id_file, ""),
    inputparam.created_by, new Date(), inputparam.city_id, inputparam.state_id, inputparam.country_id], function (error, result) {
      (0, _logging.debugLog)("Insert Query executed");
      if (error) {
        if (isCommited) {
          dataBase.rollback(function () {
            next(error);
          });
        } else {
          next(error);
        }
      }
      if (result) {
        var insertId = result.insertId;
        (0, _logging.debugLog)("insertId : " + insertId);
        inputparam.patient_id = insertId;
        var optionString = "SELECT `algaeh_d_app_config_id`, `param_name`, `param_value` FROM `algaeh_d_app_config` WHERE `record_status` ='A' AND \
             param_category='DOCUMENTS' AND param_name='PATIENT_DOC_PATH';";
        dataBase.query("SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
      , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
      , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
      , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
      , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
      , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
      , `photo_file`, `primary_id_file`, `secondary_id_file` FROM `hims_f_patient`\
       WHERE `record_status`='A' AND hims_d_patient_id=? ;" + optionString, [insertId], function (error, records) {
          if (!error) {
            req["folderPath"] = records[1][0]["param_value"] + "/" + records[0][0]["patient_code"];
            req["fileName"] = records[0][0]["patient_code"];
          }
          if (typeof callBack == "function") {
            callBack(error, records);
          }
        });
      }
    });
  } catch (e) {
    next(e);
  }
};
var updateData = function updateData(dataBase, req, callBack) {
  var patientModel = {
    hims_d_patient_id: null,
    patient_code: null,
    registration_date: null,
    title_id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    gender: null,
    religion_id: null,
    date_of_birth: null,
    age: null,
    marital_status: null,
    address1: null,
    address2: null,
    contact_number: null,
    secondary_contact_number: null,
    email: null,
    emergency_contact_name: "",
    emergency_contact_number: "",
    relationship_with_patient: "",
    visa_type_id: null,
    nationality_id: null,
    postal_code: null,
    primary_identity_id: null,
    primary_id_no: null,
    secondary_identity_id: "",
    secondary_id_no: "",
    photo_file: "",
    primary_id_file: "",
    secondary_id_file: "",
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
    city_id: null,
    state_id: null,
    country_id: null,
    documents: null /*{
                        patientImage:{base64String:"",fileExtention:""},
                        patientPrimaryID:{base64String:"",fileExtention:""},
                        patientSecondaryID:{base64String:"",fileExtention:""}
                      }
                    */
  };

  try {
    var inputparam = (0, _extend2.default)(patientModel, req.body);
    dataBase.query("UPDATE `hims_f_patient`\
  SET  `title_id`=?, `first_name`=?, `middle_name`=?, `last_name`=?, `full_name`=?, `arabic_name`=?, \
  `gender`=?, `religion_id`=?, `date_of_birth`=?, `age`=?, `marital_status`=?, `address1`=?, \
  `address2`=?, `contact_number`=?, `secondary_contact_number`=?, `email`=?, \
  `emergency_contact_name`=?, `emergency_contact_number`=?, `relationship_with_patient`=?,\
  `visa_type_id`=?, `nationality_id`=?, `postal_code`=?, `primary_identity_id`=?, \
  `primary_id_no`=?, `secondary_identity_id`=?, `secondary_id_no`=?, `photo_file`=?, \
  `primary_id_file`=?, `secondary_id_file`=?, `updated_by`=?, `updated_date`=?\
  WHERE `hims_d_patient_id`=?;", [inputparam.title_id, inputparam.first_name, inputparam.middle_name, inputparam.last_name, inputparam.full_name, inputparam.arabic_name, inputparam.gender, inputparam.religion_id, inputparam.date_of_birth, inputparam.age, inputparam.marital_status, inputparam.address1, inputparam.address2, inputparam.contact_number, inputparam.secondary_contact_number, inputparam.email, inputparam.emergency_contact_name, inputparam.emergency_contact_number, inputparam.relationship_with_patient, inputparam.visa_type_id, inputparam.nationality_id, inputparam.postal_code, inputparam.primary_identity_id, inputparam.primary_id_no, inputparam.secondary_identity_id, inputparam.secondary_id_no, inputparam.photo_file, inputparam.primary_id_file, inputparam.secondary_id_file, inputparam.updated_by, new Date(), inputparam.hims_d_patient_id], function (error, reesult) {
      if (typeof callBack == "function") callback(error, result);
    });
  } catch (e) {
    next(e);
  }
};
var patientSelect = function patientSelect(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (errror) {
        next(error);
      }
      selectData(connection, req, function (error, result) {
        connection.release();
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

var selectData = function selectData(dataBase, req, callBack) {
  var patientWhereCondition = {
    patient_code: "ALL",
    contact_number: "ALL",
    gender: "ALL"
  };

  try {
    var where = (0, _utils.whereCondition)((0, _extend2.default)(patientWhereCondition, req.query));
    dataBase.query("SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
  , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
  , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
  , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
  , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
  , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
  , `photo_file`, `primary_id_file`, `secondary_id_file`,`city_id`,`state_id`,`country_id` \
   FROM `hims_f_patient`\
   WHERE `record_status`='A' " + where.condition, where.values, function (error, result) {
      if (typeof callBack == "function") {
        callBack(error, result);
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPatientToRegisteration: addPatientToRegisteration,
  updatePatientRegistrstion: updatePatientRegistrstion,
  patientSelect: patientSelect,
  insertData: insertData,
  updateData: updateData,
  selectData: selectData,
  insertPatientData: insertPatientData
};
//# sourceMappingURL=patientRegistration.js.map