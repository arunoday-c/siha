import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import logUtils from "../utils/logging";

const { debugLog, debugFunction } = logUtils;
const { whereCondition, releaseDBConnection } = utils;

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
//Added by noor New Method

let insertPatientData = (req, res, next) => {
  try {
    debugFunction("Insert Patient Registration");
    debugLog("Insert Patient Registration", req.body);

    let inputparam = extend(
      {
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
        vat_applicable: "N",
        created_by: req.userIdentity.algaeh_d_app_user_id,

        updated_by: req.userIdentity.algaeh_d_app_user_id,

        city_id: null,
        state_id: null,
        country_id: null,
        documents: null
      },
      req.body
    );
    inputparam.registration_date = new Date();

    let options = req.options;

    let db = options == null ? req.db : options.db;

    db.query(
      "INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
    , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
    , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
    , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
    , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
    , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
    , `photo_file`, `primary_id_file`, `secondary_id_file`, `patient_type`,`vat_applicable`, `created_by`, `created_date`\
    ,`city_id`,`state_id`,`country_id`)\
     VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);",
      [
        inputparam.patient_code,
        inputparam.registration_date != null
          ? new Date(inputparam.registration_date)
          : inputparam.registration_date,
        inputparam.title_id,
        inputparam.first_name,
        inputparam.middle_name,
        inputparam.last_name,
        inputparam.full_name,
        inputparam.arabic_name,
        inputparam.gender,
        inputparam.religion_id,
        inputparam.date_of_birth != null
          ? new Date(inputparam.date_of_birth)
          : inputparam.date_of_birth,
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
        inputparam.patient_type,
        inputparam.vat_applicable,
        inputparam.created_by,
        new Date(),
        inputparam.city_id,
        inputparam.state_id,
        inputparam.country_id
      ],
      (error, result) => {
        if (error) {
          if (options == null) {
            db.rollback(() => {
              next(error);
            });
          } else {
            options.onFailure(error);
          }
        } else {
          inputparam.patient_id = result.insertId;
          req.patient_id = result.insertId;
          req.body.patient_id = req.patient_id;
          if (options != null) options.onSuccess(result);
          else {
            req.records = result;
            connection.release();
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
      }
    );
  } catch (e) {
    next(e);
  }
};

//End New Method

let insertData = (dataBase, req, res, callBack, isCommited, next) => {
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
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

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
    debugFunction("Insert Patient Registration");
    let inputparam = extend(patientModel, req.body);
    inputparam.registration_date = new Date();
    dataBase.query(
      "INSERT INTO `hims_f_patient` (`patient_code`, `registration_date`\
    , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
    , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
    , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
    , `relationship_with_patient`, `vat_applicable`,`visa_type_id`, `nationality_id`, `postal_code`\
    , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
    , `photo_file`, `primary_id_file`, `secondary_id_file`, `created_by`, `created_date`\
    ,`city_id`,`state_id`,`country_id`)\
     VALUES (?,?,?,?, ?, ?, ?, ?, ?,?,?, ,? ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);",
      [
        inputparam.patient_code,
        inputparam.registration_date,
        inputparam.title_id,
        inputparam.first_name,
        inputparam.middle_name,
        inputparam.last_name,
        inputparam.full_name,
        inputparam.arabic_name,
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
        inputparam.vat_applicable,
        // checkIsNull(inputparam.contact_number, 0),
        // checkIsNull(inputparam.secondary_contact_number, 0),
        // checkIsNull(inputparam.email, ""),
        // checkIsNull(inputparam.emergency_contact_name, ""),
        // checkIsNull(inputparam.emergency_contact_number, 0),
        // checkIsNull(inputparam.relationship_with_patient, ""),
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
        // checkIsNull(inputparam.secondary_identity_id, 1),
        // checkIsNull(inputparam.secondary_id_no, ""),
        // checkIsNull(inputparam.photo_file, ""),
        // checkIsNull(inputparam.primary_id_file, ""),
        // checkIsNull(inputparam.secondary_id_file, ""),
        inputparam.created_by,
        new Date(),
        inputparam.city_id,
        inputparam.state_id,
        inputparam.country_id
      ],
      (error, result) => {
        debugLog("Insert Query executed");
        if (error) {
          if (isCommited) {
            dataBase.rollback(() => {
              connection.release();
              next(error);
            });
          } else {
            connection.release();
            next(error);
          }
        }
        if (result) {
          let insertId = result.insertId;
          debugLog("insertId : " + insertId);
          inputparam.patient_id = insertId;
          let optionString =
            "SELECT `algaeh_d_app_config_id`, `param_name`, `param_value` FROM `algaeh_d_app_config` WHERE `record_status` ='A' AND \
             param_category='DOCUMENTS' AND param_name='PATIENT_DOC_PATH';";
          dataBase.query(
            "SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
      , `title_id`, `first_name`, `middle_name`, `last_name`, `full_name`, `arabic_name`, `gender`, `religion_id`\
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
                req["folderPath"] =
                  records[1][0]["param_value"] +
                  "/" +
                  records[0][0]["patient_code"];
                req["fileName"] = records[0][0]["patient_code"];
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
    created_by: req.userIdentity.algaeh_d_app_user_id,

    updated_by: req.userIdentity.algaeh_d_app_user_id,

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
    let inputparam = extend(patientModel, req.body);
    dataBase.query(
      "UPDATE `hims_f_patient`\
  SET  `title_id`=?, `first_name`=?, `middle_name`=?, `last_name`=?, `full_name`=?, `arabic_name`=?, \
  `gender`=?, `religion_id`=?, `date_of_birth`=?, `age`=?, `marital_status`=?, `address1`=?, \
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
        inputparam.full_name,
        inputparam.arabic_name,
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
      (error, result) => {
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
      if (error) {
        next(error);
      }
      selectData(connection, req, (error, result) => {
        connection.release();
        if (error) {
          releaseDBConnection(db, connection);
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

let selectData = (dataBase, req, callBack) => {
  let patientWhereCondition = {
    patient_code: "ALL",
    contact_number: "ALL",
    gender: "ALL"
  };

  try {
    let where = whereCondition(extend(patientWhereCondition, req.query));
    dataBase.query(
      "SELECT `hims_d_patient_id`, `patient_code`, `registration_date`\
  , `title_id`, `first_name`, `middle_name`, `last_name`, arabic_name,full_name,`gender`, `religion_id`\
  , `date_of_birth`, `age`, `marital_status`, `address1`, `address2`, `contact_number`\
  , `secondary_contact_number`, `email`, `emergency_contact_name`, `emergency_contact_number`\
  , `relationship_with_patient`, `visa_type_id`, `nationality_id`, `postal_code`\
  , `primary_identity_id`, `primary_id_no`, `secondary_identity_id`, `secondary_id_no`\
  , `photo_file`, `primary_id_file`, `secondary_id_file`,`city_id`,`state_id`,`country_id`,`vat_applicable` \
   FROM `hims_f_patient`\
   WHERE `record_status`='A' and " +
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

export default {
  addPatientToRegisteration,
  updatePatientRegistrstion,
  patientSelect,
  insertData,
  updateData,
  selectData,
  insertPatientData
};
