import extend from "extend";
import { whereCondition, checkIsNull, base64DecodeToFile } from "../utils";
import httpStatus from "../utils/httpStatus";
import { logger, debugLog, debugFunction } from "../utils/logging";
let patientModel = {
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

let addPatientToRegisteration = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (errror) {
        next(error);
      }
      insertData(connection, req, res, (error, result) => {
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
let updatePatientRegistrstion = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      updateData(connection, req, (error, result) => {
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
let insertData = (dataBase, req, res, callBack, isCommited, next) => {
  isCommited = isCommited || false;
  try {
    debugFunction("Insert Patient Registration");
    let inputparam = extend(patientModel, req.body);
    dataBase.query(
      "INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
    , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
    , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
    , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
    , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
    , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
    , `photo_file`, `primary_id_file`, `secondary_id_file`, `created_by`, `created_date`)\
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);",
      [
        inputparam.patient_code,
        inputparam.registration_date,
        inputparam.title_id,
        inputparam.first_name,
        inputparam.middle_name,
        inputparam.last_name,
        inputparam.gender,
        inputparam.religion_id,
        inputparam.date_of_birth,
        inputparam.age,
        inputparam.marital_status,
        inputparam.address1,
        inputparam.address2,
        checkIsNull(inputparam.contact_number, 0),
        checkIsNull(inputparam.secondary_contact_number, 0),
        checkIsNull(inputparam.email, ""),
        checkIsNull(inputparam.emergency_contact_name, ""),
        checkIsNull(inputparam.emergency_contact_number, 0),
        checkIsNull(inputparam.relationship_with_patient, ""),
        inputparam.visa_type_id,
        inputparam.nationality_id,
        inputparam.postal_code,
        inputparam.primary_identity_id,
        inputparam.primary_id_no,
        checkIsNull(inputparam.secondary_identity_id, 1),
        checkIsNull(inputparam.secondary_id_no, ""),
        checkIsNull(inputparam.photo_file, ""),
        checkIsNull(inputparam.primary_id_file, ""),
        checkIsNull(inputparam.secondary_id_file, ""),
        inputparam.created_by,
        new Date()
      ],
      (error, result) => {
        debugLog("Insert Query executed");
        if (error) {
          if (isCommited) {
            dataBase.rollback(() => {
              next(error);
            });
          } else {
            next(error);
          }
        }
        if (result) {
          let insertId = result.insertId;
          debugLog("insertId : " + insertId);
          let optionString = "";
          //Accessing global object
          if (applicationObject.documentsPath == null)
            optionString =
              "SELECT `algaeh_d_app_config_id`, `param_name`, `param_value` FROM `algaeh_d_app_config` WHERE `record_status` ='A' AND param_category='DOCUMENTS';";
          dataBase.query(
            "SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
      , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
      , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
      , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
      , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
      , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
      , `photo_file`, `primary_id_file`, `secondary_id_file` FROM `hims_f_patient`\
       WHERE `record_status`='A' AND hims_d_patient_id=? ;" +
              optionString,
            [insertId],
            (error, records) => {
              if (!error) {
                if (inputparam.documents != null) {
                  if (inputparam.documents.patientImage != null) {
                    if (inputparam.documents.patientImage.base64String != "") {
                      base64DecodeToFile({
                        code: records[0]["patient_code"],
                        file:
                          records[0]["patient_code"] +
                          "_Image_" +
                          inputparam.documents.patientImage.fileExtention,
                        base64String:
                          inputparam.documents.patientImage.base64String,
                        callBack: function(error, output) {
                          if (error) {
                            logger.log(
                              "error",
                              "Patient Image insertion Error \n %s",
                              JSON.stringify(error)
                            );
                          }
                          debugLog(
                            "Patient Image is created " + JSON.stringify(output)
                          );
                        }
                      });
                    }
                  }
                  if (inputparam.documents.patientPrimaryID != null) {
                    if (
                      inputparam.documents.patientPrimaryID.base64String != ""
                    ) {
                      base64DecodeToFile({
                        code: records[0]["patient_code"],
                        file:
                          records[0]["patient_code"] +
                          "_PrimaryID_" +
                          inputparam.documents.patientPrimaryID.fileExtention,
                        base64String:
                          inputparam.documents.patientPrimaryID.base64String,
                        callBack: function(error, output) {
                          if (error) {
                            logger.log(
                              "error",
                              "Patient Primary Id insertion Error \n %s",
                              JSON.stringify(error)
                            );
                          }
                          debugLog(
                            "Patient Primary ID is created " +
                              JSON.stringify(output)
                          );
                        }
                      });
                    }
                  }

                  if (inputparam.documents.patientSecondaryID != null) {
                    if (
                      inputparam.documents.patientSecondaryID.base64String != ""
                    ) {
                      base64DecodeToFile({
                        code: records[0]["patient_code"],
                        file:
                          records[0]["patient_code"] +
                          "_SecondaryID_" +
                          inputparam.documents.patientSecondaryID.fileExtention,
                        base64String:
                          inputparam.documents.patientSecondaryID.base64String,
                        callBack: function(error, output) {
                          if (error) {
                            logger.log(
                              "error",
                              "Patient Secondary Id insertion Error \n %s",
                              JSON.stringify(error)
                            );
                          }
                          debugLog(
                            "Patient Secondary ID is created " +
                              JSON.stringify(output)
                          );
                        }
                      });
                    }
                  }
                }
              }
              if (typeof callBack == "function") {
                callBack(error, records);
              }
            }
          );
        }
      }
    );
  } catch (e) {
    next(e);
  }
};
let updateData = (dataBase, req, callBack) => {
  try {
    let inputparam = extend(patientModel, req.body);
    dataBase.query(
      "UPDATE `hims_f_patient`\
  SET  `title_id`=?, `first_name`=?, `middle_name`=?, `last_name`=?, `gender`=?,\
  `religion_id`=?, `date_of_birth`=?, `age`=?, `marital_status`=?, `address1`=?, \
  `address2`=?, `contact_number`=?, `secondary_contact_number`=?, `email`=?, \
  `emergency_contact_name`=?, `emergency_contact_number`=?, `relationship_with_patient`=?,\
  `visa_type_id`=?, `nationality_id`=?, `postal_code`=?, `primary_identity_id`=?, \
  `primary_id_no`=?, `secondary_identity_id`=?, `secondary_id_no`=?, `photo_file`=?, \
  `primary_id_file`=?, `secondary_id_file`=?, `updated_by`=?, `updated_date`=?\
  WHERE `hims_d_patient_id`=?;",
      [
        inputparam.title_id,
        inputparam.first_name,
        inputparam.middle_name,
        inputparam.last_name,
        inputparam.gender,
        inputparam.religion_id,
        inputparam.date_of_birth,
        inputparam.age,
        inputparam.marital_status,
        inputparam.address1,
        inputparam.address2,
        inputparam.contact_number,
        inputparam.secondary_contact_number,
        inputparam.email,
        inputparam.emergency_contact_name,
        inputparam.emergency_contact_number,
        inputparam.relationship_with_patient,
        inputparam.visa_type_id,
        inputparam.nationality_id,
        inputparam.postal_code,
        inputparam.primary_identity_id,
        inputparam.primary_id_no,
        inputparam.secondary_identity_id,
        inputparam.secondary_id_no,
        inputparam.photo_file,
        inputparam.primary_id_file,
        inputparam.secondary_id_file,
        inputparam.updated_by,
        new Date(),
        inputparam.hims_d_patient_id
      ],
      (error, reesult) => {
        if (typeof callBack == "function") callback(error, result);
      }
    );
  } catch (e) {
    next(e);
  }
};
let patientSelect = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (errror) {
        next(error);
      }
      selectData(connection, req, (error, result) => {
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
let patientWhereCondition = {
  patient_code: "ALL",
  contact_number: "ALL",
  gender: "ALL"
};

let selectData = (dataBase, req, callBack) => {
  try {
    let where = whereCondition(extend(patientWhereCondition, req.query));
    dataBase.query(
      "SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
  , `title_id`, `first_name`, `middle_name`, `last_name`, `gender`, `religion_id`\
  , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
  , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
  , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
  , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
  , `photo_file`, `primary_id_file`, `secondary_id_file` FROM `hims_f_patient`\
   WHERE `record_status`='A' " +
        where.condition,
      where.values,
      (error, result) => {
        if (typeof callBack == "function") {
          callBack(error, result);
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addPatientToRegisteration,
  updatePatientRegistrstion,
  patientSelect,
  insertData,
  updateData,
  selectData
};
