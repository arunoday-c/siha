"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../utils");

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  documents: null /*{
                      patientImage:{base64String:"",fileExtention:""},
                      patientPrimaryID:{base64String:"",fileExtention:""},
                      patientSecondaryID:{base64String:"",fileExtention:""}
                    }
                  */
};

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
var insertData = function insertData(dataBase, req, res, callBack, isCommited, next) {
  isCommited = isCommited || false;
  try {
    (0, _logging.debugFunction)("Insert Patient Registration");
    var inputparam = (0, _extend2.default)(patientModel, req.body);
    dataBase.query("INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
    , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
    , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
    , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
    , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
    , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
    , `photo_file`, `primary_id_file`, `secondary_id_file`, `created_by`, `created_date`)\
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);", [inputparam.patient_code, inputparam.registration_date, inputparam.title_id, inputparam.first_name, inputparam.middle_name, inputparam.last_name, inputparam.gender, inputparam.religion_id, inputparam.date_of_birth, inputparam.age, inputparam.marital_status, inputparam.address1, inputparam.address2, (0, _utils.checkIsNull)(inputparam.contact_number, 0), (0, _utils.checkIsNull)(inputparam.secondary_contact_number, 0), (0, _utils.checkIsNull)(inputparam.email, ""), (0, _utils.checkIsNull)(inputparam.emergency_contact_name, ""), (0, _utils.checkIsNull)(inputparam.emergency_contact_number, 0), (0, _utils.checkIsNull)(inputparam.relationship_with_patient, ""), inputparam.visa_type_id, inputparam.nationality_id, inputparam.postal_code, inputparam.primary_identity_id, inputparam.primary_id_no, (0, _utils.checkIsNull)(inputparam.secondary_identity_id, 1), (0, _utils.checkIsNull)(inputparam.secondary_id_no, ""), (0, _utils.checkIsNull)(inputparam.photo_file, ""), (0, _utils.checkIsNull)(inputparam.primary_id_file, ""), (0, _utils.checkIsNull)(inputparam.secondary_id_file, ""), inputparam.created_by, new Date()], function (error, result) {
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
        var optionString = "";
        //Accessing global object
        if (applicationObject.documentsPath == null) optionString = "SELECT `algaeh_d_app_config_id`, `param_name`, `param_value` FROM `algaeh_d_app_config` WHERE `record_status` ='A' AND param_category='DOCUMENTS';";
        dataBase.query("SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
      , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
      , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
      , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
      , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
      , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
      , `photo_file`, `primary_id_file`, `secondary_id_file` FROM `hims_f_patient`\
       WHERE `record_status`='A' AND hims_d_patient_id=? ;" + optionString, [insertId], function (error, records) {
          if (!error) {
            if (inputparam.documents != null) {
              if (inputparam.documents.patientImage != null) {
                if (inputparam.documents.patientImage.base64String != "") {
                  (0, _utils.base64DecodeToFile)({
                    code: records[0]["patient_code"],
                    file: records[0]["patient_code"] + "_Image_" + inputparam.documents.patientImage.fileExtention,
                    base64String: inputparam.documents.patientImage.base64String,
                    callBack: function callBack(error, output) {
                      if (error) {
                        _logging.logger.log("error", "Patient Image insertion Error \n %s", JSON.stringify(error));
                      }
                      (0, _logging.debugLog)("Patient Image is created " + JSON.stringify(output));
                    }
                  });
                }
              }
              if (inputparam.documents.patientPrimaryID != null) {
                if (inputparam.documents.patientPrimaryID.base64String != "") {
                  (0, _utils.base64DecodeToFile)({
                    code: records[0]["patient_code"],
                    file: records[0]["patient_code"] + "_PrimaryID_" + inputparam.documents.patientPrimaryID.fileExtention,
                    base64String: inputparam.documents.patientPrimaryID.base64String,
                    callBack: function callBack(error, output) {
                      if (error) {
                        _logging.logger.log("error", "Patient Primary Id insertion Error \n %s", JSON.stringify(error));
                      }
                      (0, _logging.debugLog)("Patient Primary ID is created " + JSON.stringify(output));
                    }
                  });
                }
              }

              if (inputparam.documents.patientSecondaryID != null) {
                if (inputparam.documents.patientSecondaryID.base64String != "") {
                  (0, _utils.base64DecodeToFile)({
                    code: records[0]["patient_code"],
                    file: records[0]["patient_code"] + "_SecondaryID_" + inputparam.documents.patientSecondaryID.fileExtention,
                    base64String: inputparam.documents.patientSecondaryID.base64String,
                    callBack: function callBack(error, output) {
                      if (error) {
                        _logging.logger.log("error", "Patient Secondary Id insertion Error \n %s", JSON.stringify(error));
                      }
                      (0, _logging.debugLog)("Patient Secondary ID is created " + JSON.stringify(output));
                    }
                  });
                }
              }
            }
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
  try {
    var inputparam = (0, _extend2.default)(patientModel, req.body);
    dataBase.query("UPDATE `hims_f_patient`\
  SET  `title_id`=?, `first_name`=?, `middle_name`=?, `last_name`=?, `gender`=?,\
  `religion_id`=?, `date_of_birth`=?, `age`=?, `marital_status`=?, `address1`=?, \
  `address2`=?, `contact_number`=?, `secondary_contact_number`=?, `email`=?, \
  `emergency_contact_name`=?, `emergency_contact_number`=?, `relationship_with_patient`=?,\
  `visa_type_id`=?, `nationality_id`=?, `postal_code`=?, `primary_identity_id`=?, \
  `primary_id_no`=?, `secondary_identity_id`=?, `secondary_id_no`=?, `photo_file`=?, \
  `primary_id_file`=?, `secondary_id_file`=?, `updated_by`=?, `updated_date`=?\
  WHERE `hims_d_patient_id`=?;", [inputparam.title_id, inputparam.first_name, inputparam.middle_name, inputparam.last_name, inputparam.gender, inputparam.religion_id, inputparam.date_of_birth, inputparam.age, inputparam.marital_status, inputparam.address1, inputparam.address2, inputparam.contact_number, inputparam.secondary_contact_number, inputparam.email, inputparam.emergency_contact_name, inputparam.emergency_contact_number, inputparam.relationship_with_patient, inputparam.visa_type_id, inputparam.nationality_id, inputparam.postal_code, inputparam.primary_identity_id, inputparam.primary_id_no, inputparam.secondary_identity_id, inputparam.secondary_id_no, inputparam.photo_file, inputparam.primary_id_file, inputparam.secondary_id_file, inputparam.updated_by, new Date(), inputparam.hims_d_patient_id], function (error, reesult) {
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
var patientWhereCondition = {
  patient_code: "ALL",
  contact_number: "ALL",
  gender: "ALL"
};

var selectData = function selectData(dataBase, req, callBack) {
  try {
    var where = (0, _utils.whereCondition)((0, _extend2.default)(patientWhereCondition, req.query));
    dataBase.query("SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
  , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
  , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
  , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
  , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
  , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
  , `photo_file`, `primary_id_file`, `secondary_id_file` FROM `hims_f_patient`\
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
  selectData: selectData
};
//# sourceMappingURL=patientRegistration.js.map