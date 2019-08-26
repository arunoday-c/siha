"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";
import moment from "moment";
import { debugFunction, debugLog } from "../../utils/logging";

import { decryption } from "../../utils/cryptography";
import mysql from "mysql";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
import _ from "lodash";
import { resolveTxt } from "dns";
//created by irfan: to add  physical_examination_header
let physicalExaminationHeader = (req, res, next) => {
  let physicalExaminationHeaderModel = {
    hims_d_physical_examination_header: null,
    examination_type: null,
    description: null,
    sub_department_id: null,
    assesment_type: null,
    mandatory: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("physicalExaminationHeader");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(physicalExaminationHeaderModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_physical_examination_header(\
            examination_type,description,sub_department_id,assesment_type,\
            mandatory,created_by,updated_by)values(\
            ?,?,?,?,?,?,?)",
        [
          input.examination_type,
          input.description,
          input.sub_department_id,
          input.assesment_type,
          input.mandatory,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
let physicalExaminationDetails = (req, res, next) => {
  let physicalExaminationDetailsModel = {
    hims_d_physical_examination_details_id: null,
    physical_examination_header_id: null,
    description: null,
    mandatory: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("physicalExaminationDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(physicalExaminationDetailsModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_physical_examination_details(\
            physical_examination_header_id,description,mandatory,created_by,updated_by)values(\
              ?,?,?,?,?)",
        [
          input.physical_examination_header_id,
          input.description,
          input.mandatory,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  physical_examination_subdetails
let physicalExaminationSubDetails = (req, res, next) => {
  let physicalExaminationSubDetailsModel = {
    hims_d_physical_examination_subdetails_id: null,
    physical_examination_details_id: null,
    description: null,
    mandatory: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("physicalExaminationSubDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(physicalExaminationSubDetailsModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_physical_examination_subdetails(\
            physical_examination_details_id,\
            description,mandatory,created_by,updated_by)values(\
                ?,?,?,?,?)",
        [
          input.physical_examination_details_id,
          input.description,
          input.mandatory,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add order
let addOrder = (req, res, next) => {
  let hims_f_lab_orderModel = {
    hims_f_lab_order_id: null,
    patient_id: null,
    visit_id: null,
    provider_id: null,
    service_id: null,
    status: null,
    billed: null,
    cancelled: null,
    ordered_date: null,
    test_type: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addOrder");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(hims_f_lab_orderModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_f_lab_order(\
          patient_id,visit_id,provider_id,service_id,status,billed,\
          cancelled,ordered_date,test_type,created_by,updated_by,hospital_id)values(\
              ?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.patient_id,
          input.visit_id,
          input.provider_id,
          input.service_id,
          input.status,
          input.billed,
          input.cancelled,
          input.ordered_date,
          input.test_type,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add sample
let addSample = (req, res, next) => {
  let hims_d_lab_sampleModel = {
    hims_d_lab_sample_id: null,
    order_id: null,
    sample_id: null,
    status: null,
    collected: null,
    collected_date: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addSample");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(hims_d_lab_sampleModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_f_lab_sample(\
          order_id,sample_id,status,collected,\
          collected_date,created_by,updated_by,hospital_id)values(\
              ?,?,?,?,?,?,?,?)",
        [
          input.order_id,
          input.sample_id,
          input.status,
          input.collected,
          input.collected_date,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add Analytes
let addAnalytes = (req, res, next) => {
  let AnalytesModel = {
    hims_d_lab_analytes_id: null,
    sample_id: null,
    analyte_id: null,
    result: null,
    text: null,
    status: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addAnalytes");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(AnalytesModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_lab_analytes(\
          sample_id,analyte_id,result,text,status,created_by,updated_by)values(\
              ?,?,?,?,?,?,?)",
        [
          input.sample_id,
          input.analyte_id,
          input.result,
          input.text,
          input.status,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add ReviewOfSysHeader
let addReviewOfSysHeader = (req, res, next) => {
  let reviewOfSysHeaderModel = {
    description: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addReviewOfSysHeader");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(reviewOfSysHeaderModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_review_of_system_header(\
          description,created_by,updated_by)values(\
              ?,?,?)",
        [input.description, input.created_by, input.updated_by],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add ReviewOfSysDetails
let addReviewOfSysDetails = (req, res, next) => {
  let reviewOfSysDetailsModel = {
    review_of_system_heder_id: null,
    description: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addReviewOfSysDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(reviewOfSysDetailsModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_review_of_system_details(\
          review_of_system_heder_id,description,created_by,updated_by)values(\
              ?,?,?,?)",
        [
          input.review_of_system_heder_id,
          input.description,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add allergic details
let addAllergy = (req, res, next) => {
  let AllergyModel = {
    hims_d_allergy_id: null,
    allergy_type: null,
    allergy_name: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addAllergy");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(AllergyModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_allergy(\
          allergy_type,allergy_name,created_by,updated_by)values(\
              ?,?,?,?)",
        [
          input.allergy_type,
          input.allergy_name,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to get allergic details
let getAllergyDetails = (req, res, next) => {
  debugFunction("getAllergyDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query("SELECT * FROM hims_d_allergy", (error, results) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        debugLog("Results fetched");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add chronical conditions
let addChronicalConditions = (req, res, next) => {
  let ChronicalConditionsModel = {
    hims_d_chronic_conditions_id: null,
    name: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addChronicalConditions");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(ChronicalConditionsModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_chronic_conditions(\
          name,created_by,updated_by)values(\
              ?,?,?)",
        [input.name, input.created_by, input.updated_by],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to get chronical conditions
let getChronicalConditions = (req, res, next) => {
  debugFunction("getChronicalConditions");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "SELECT * FROM hims_d_chronic_conditions;",
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results fetched");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add encounter review
let addEncounterReview = (req, res, next) => {
  let EncounterReviewMOdel = {
    hims_f_encounter_review_id: null,
    encounter_id: null,
    review_header_id: null,
    review_details_id: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addEncounterReview");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(EncounterReviewMOdel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_f_encounter_review(\
          encounter_id,review_header_id,review_details_id,created_by,updated_by,hospital_id)values(\
              ?,?,?,?,?,?)",
        [
          input.encounter_id,
          input.review_header_id,
          input.review_details_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
        ],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to getEncounterReview
let getEncounterReview = (req, res, next) => {
  debugFunction("getEncounterReview");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }
      let encounter_id = req.query.encounter_id;
      connection.query(
        "SELECT * FROM hims_f_encounter_review where encounter_id=?",
        [encounter_id],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results fetched");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: get MYDAY in doctors work bench , to show list of todays patients
let getMyDay = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let _query = "";
    _query += _mysql.mysqlQueryFormat(
      " provider_id=? and sub_department_id=? and ",
      [req.userIdentity.employee_id, req.userIdentity.sub_department_id]
    );
    if (
      req.query.fromDate != null &&
      req.query.fromDate != "" &&
      req.query.fromDate != undefined &&
      (req.query.toDate != null &&
        req.query.fromDate != "" &&
        req.query.fromDate != undefined)
    )
      _query += _mysql.mysqlQueryFormat(
        "date(E.created_date) BETWEEN date(?) and date(?)",
        [
          moment(new Date(req.query.fromDate)).format(
            keyPath.default.dbFormat.date
          ),
          moment(new Date(req.query.toDate)).format(
            keyPath.default.dbFormat.date
          )
        ]
      );
    else if (
      req.query.toDate != null &&
      req.query.toDate != "" &&
      req.query.toDate != undefined
    ) {
      _query += _mysql.mysqlQueryFormat("date(E.created_date) = date(?)", [
        moment(new Date(req.query.toDate)).format(keyPath.default.dbFormat.date)
      ]);
    }
    if (req.query.status == "A") {
      _query += _mysql.mysqlQueryFormat("E.status <> 'V' AND");
    } else if (req.query.status == "V") {
      _query += _mysql.mysqlQueryFormat("E.status=? AND", ["V"]);
    }

    _mysql
      .executeQuery({
        query:
          "select  E.hims_f_patient_encounter_id, P.patient_code, P.full_name, P.gender, P.age, E.patient_id,\
            V.appointment_patient, V.new_visit_patient, E.provider_id, E.`status`, E.nurse_examine, E.checked_in,\
            E.payment_type, E.episode_id, E.encounter_id, E.`source`, E.updated_date as encountered_date, \
            E.visit_id, sub_department_id, SD.chart_type, SD.vitals_mandatory,	P.primary_id_no, \
	          ID.identity_document_name, V.visit_expiery_date, V.visit_status from hims_f_patient_encounter E\
            INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
            inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id  \
            inner join hims_d_sub_department SD on sub_department_id=SD.hims_d_sub_department_id  \
            left join hims_d_identity_document ID on  \
            ID.hims_d_identity_document_id = P.primary_identity_id \
            where E.cancelled='N' and E.record_status='A' AND  V.record_status='A' and v.hospital_id=? AND " +
          _query,
        values: [req.userIdentity.hospital_id],
        printQuery: true
      })
      .then(result => {
        let final_result = null;
        if (result.length == 0) {
          final_result = {
            provider_id: req.userIdentity.employee_id,
            sub_department_id: req.userIdentity.sub_department_id
          };
        } else {
          final_result = result;
        }
        _mysql.releaseConnection();
        req.records = final_result;
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

//created by irfan: to update patient encounter status to WIP
let updatdePatEncntrStatus = (req, res, next) => {
  try {
    debugFunction("updatdePatEncntrStatus");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let currentEncounterNo = null;

      connection.query(
        "SELECT encounter_id FROM algaeh_d_app_config where param_name='VISITEXPERIDAY';",
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          currentEncounterNo = result[0].encounter_id;
          console.log("currentEncounterNo:", currentEncounterNo);

          if (currentEncounterNo > 0) {
            let nextEncounterNo = currentEncounterNo + 1;
            console.log("nextEncounterNo:", nextEncounterNo);

            connection.query(
              "update algaeh_d_app_config set encounter_id=?,updated_by=?,updated_date=? where param_name='VISITEXPERIDAY'",
              [nextEncounterNo, req.body.updated_by, new Date()],
              (error, updateResult) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                if (updateResult != null) {
                  connection.query(
                    "UPDATE  hims_f_patient_encounter SET `checked_in` = 'Y', `status`='W', encounter_id=?,\
                     updated_by=?, updated_date=? WHERE hims_f_patient_encounter_id=? AND  record_status='A';",
                    [
                      currentEncounterNo,
                      req.body.updated_by,
                      new Date(),
                      req.body.patient_encounter_id
                    ],
                    (error, result) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = { encounter_id: currentEncounterNo };
                      next();
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get patient profile
let getPatientProfile = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT P.hims_d_patient_id,P.full_name,P.patient_code,P.vat_applicable,P.gender,P.date_of_birth,P.contact_number,N.nationality,\
        PV.age_in_years,PV.age_in_months,PV.age_in_days, PV.sub_department_id, PE.payment_type,PE.updated_date as Encounter_Date \
        from ( (hims_f_patient P inner join hims_f_patient_encounter PE  on P.hims_d_patient_id=PE.patient_id)\
        inner join hims_d_nationality N on N.hims_d_nationality_id=P.nationality_id ) inner join hims_f_patient_visit PV on \
        PV.hims_f_patient_visit_id=PE.visit_id  where P.hims_d_patient_id=? and PE.episode_id=?;",
        [inputData.patient_id, inputData.episode_id],
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

//created by irfan: to  get Patient Vitals
let getPatientVitalsOLD = (req, res, next) => {
  let selectWhere = {
    patient_id: "ALL",
    visit_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    // let inputData = extend({}, req.query);

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select * from hims_f_patient_vitals where " +
          where.condition +
          " order by visit_date desc, visit_time desc;",
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

//created by irfan: to  get Patient Vitals
let getPatientVitals = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputs = req.query;
    _mysql
      .executeQuery({
        query:
          "select count(hims_d_vitals_header_id) cnt from hims_d_vitals_header where record_status='A'"
      })
      .then(rec => {
        const _limit = (rec.length > 0 ? rec[0]["cnt"] : 0) * 5;

        let sqlQuery = _mysql.mysqlQueryFormat(
          "select hims_f_patient_vitals_id, patient_id, visit_id, visit_date, visit_time,PV.updated_Date,\
case_type, vital_id,PH.vitals_name,vital_short_name,PH.uom, vital_value, vital_value_one, vital_value_two, formula_value,PH.sequence_order,PH.display from \
hims_f_patient_vitals PV,hims_d_vitals_header PH where PV.record_status='A' and \
PH.record_status='A' and PV.vital_id=PH.hims_d_vitals_header_id  "
        );
        if (inputs.visit_id != null) {
          sqlQuery += _mysql.mysqlQueryFormat(" and visit_id=?", [
            inputs.visit_id
          ]);
        }
        if (inputs.patient_id != null) {
          sqlQuery += _mysql.mysqlQueryFormat(" and patient_id=?", [
            inputs.patient_id
          ]);
        }
        sqlQuery += _mysql.mysqlQueryFormat(
          " group by visit_date , vital_id order by hims_f_patient_vitals_id  desc LIMIT 0," +
            _limit +
            ";"
        );
        _mysql
          .executeQuery({ query: sqlQuery, printQuery: true })
          .then(result => {
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
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

//created by irfan: to  getPatientAllergies
let getPatientAllergies = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, allergy_inactive,A.allergy_type,A.allergy_name from\
        hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?\
        and PA.allergy_id=A.hims_d_allergy_id order by hims_f_patient_allergy_id desc;",
        [inputData.patient_id],
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

//created by irfan: to  getPatientDiet
let getPatientDiet = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_f_patient_diet_id, patient_id, episode_id, diet_id, comments, till_date, DM.hims_d_diet_description,DM.diet_status,DM.hims_d_diet_note FROM\
        hims_f_patient_diet PD,hims_d_diet_master DM where patient_id=? and episode_id=? and DM.record_status='A'\
        and DM.hims_d_diet_master_id=PD.diet_id",
        [inputData.patient_id, inputData.episode_id],
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

//created by irfan: to  getPatientDiagnosis
let getPatientDiagnosis = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,icd.icd_code , icd.icd_description ,\
        diagnosis_type, final_daignosis from hims_f_patient_diagnosis pd,hims_d_icd icd where pd.record_status='A'\
        and patient_id=? and episode_id=? and pd.daignosis_id=icd.hims_d_icd_id;",
        [inputData.patient_id, inputData.episode_id],
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
//created by irfan: to get chief complaints(HPI header) against (doctors)sub-department_id
let getChiefComplaints = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let sub_department_id = req.userIdentity.sub_department_id;
    debugLog("sub_dp_id:", sub_department_id);
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_hpi_header_id,hpi_description,created_date from hims_d_hpi_header where sub_department_id=? and record_status='A';",
        [sub_department_id],
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

//created by irfan:  to add new chief complaints (hpi header)
let addNewChiefComplaint = (req, res, next) => {
  debugFunction("addNewChiefComplaint");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    let header = req.headers["x-app-user-identity"];
    header = decryption(header);
    input.sub_department_id = header.sub_department_id;
    debugLog("sub_department_id:", header.sub_department_id);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      const insurtColumns = ["hpi_description", "created_by", "updated_by"];

      connection.query(
        "INSERT INTO hims_d_hpi_header(" +
          insurtColumns.join(",") +
          ",`sub_department_id`,created_date,update_date) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [input.sub_department_id, new Date(), new Date()],
            req: req
          })
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          debugLog("Results are recorded...");
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to ADD  patient-chief complaint
let addPatientChiefComplaints = (req, res, next) => {
  debugFunction("addPatientChiefComplaints");

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    //let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      const insurtColumns = [
        "episode_id",
        "patient_id",
        "chief_complaint_id",
        "icd_code_id",
        "onset_date",
        "duration",
        "interval",
        "severity",
        "score",
        "pain",
        "comment",
        "complaint_type",
        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_episode_chief_complaint(`" +
          insurtColumns.join("`,`") +
          "`,created_date,updated_date,hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [
              new Date(),
              new Date(),
              req.userIdentity.hospital_id
            ],
            req: req
          })
        ],
        (error, Result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = Result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get patient ChiefComplaints
let getPatientChiefComplaints = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let inputData = req.query;
  try {
    _mysql
      .executeQuery({
        query:
          "select hh.hims_d_hpi_header_id,hh.hpi_description as chief_complaint_name,PE.hims_f_patient_encounter_id,PE.patient_id,\
          max(PE.updated_date) as Encounter_Date , ecc.hims_f_episode_chief_complaint_id,ecc.episode_id,ecc.chief_complaint_id,\
          ecc.onset_date,ecc.`interval`,ecc.duration,ecc.severity,ecc.score,ecc.pain,ecc.`comment`,ecc.`chronic`,ecc.`complaint_inactive`,ecc.`complaint_inactive_date`\
          from ( (hims_f_episode_chief_complaint ecc inner join hims_d_hpi_header hh on hh.hims_d_hpi_header_id=ecc.chief_complaint_id )    inner join hims_f_patient_encounter PE on PE.episode_id=ecc.episode_id)\
          where ecc.record_status='A'and ecc.episode_id=? group by chief_complaint_id ",
        values: [inputData.episode_id],
        printQuery: true
      })
      .then(result => {
        // utilities.logger().log("result: ", result);
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get patient ChiefComplaints
let getPatientBasicChiefComplaints = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let inputData = req.query;
  try {
    _mysql
      .executeQuery({
        query:
          "select * from hims_f_episode_chief_complaint where episode_id=?",
        values: [inputData.episode_id],
        printQuery: true
      })
      .then(result => {
        // utilities.logger().log("result: ", result);
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to DELETE patient ChiefComplaints
let deletePatientChiefComplaints = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    //let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "update hims_f_episode_chief_complaint set record_status='I',updated_date=?,updated_by=? where `record_status`='A' and hims_f_episode_chief_complaint_id=?",
        [
          new Date(),
          req.body.updated_by,
          req.body.hims_f_episode_chief_complaint_id
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

//created by irfan: to add new allergy for a patient
let addPatientNewAllergy = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_f_patient_allergy` (`patient_id`, `allergy_id`, onset, onset_date, severity, `comment`,\
         allergy_inactive,created_date,`created_by`,updated_date,`updated_by`,hospital_id)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.patient_id,
          inputparam.allergy_id,
          inputparam.onset,
          inputparam.onset_date,
          inputparam.severity,
          inputparam.comment,
          inputparam.allergy_inactive,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
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

//created by irfan: to get all allergies
let getAllAllergies = (req, res, next) => {
  let selectWhere = {
    allergy_type: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_allergy_id,allergy_type,\
        allergy_name from hims_d_allergy where record_status='A' AND" +
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

//created by irfan: to get all allergies
let getPatientAllergy = (req, res, next) => {
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    let inputData = extend({}, req.query);
    const _mysql = new algaehMysql({ path: keyPath });
    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, allergy_inactive,A.allergy_type,A.allergy_name from\
    hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?\
    and PA.allergy_id=A.hims_d_allergy_id order by hims_f_patient_allergy_id desc; ",
        values: [inputData.patient_id]
      })
      .then(result => {
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });

    //   db.getConnection((error, connection) => {
    //     connection.query(
    //       "select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, allergy_inactive,A.allergy_type,A.allergy_name from\
    //       hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?\
    //       and PA.allergy_id=A.hims_d_allergy_id order by hims_f_patient_allergy_id desc; ",
    //       [inputData.patient_id],
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
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan: to add updatePatientChiefComplaints
let updatePatientChiefComplaints = (req, res, next) => {
  try {
    debugFunction("updatePatientChiefComplaints");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        let inputParam = extend([], req.body.chief_complaints);

        let qry = "";

        for (let i = 0; i < req.body.chief_complaints.length; i++) {
          const _complaint_inactive_date =
            inputParam[i].complaint_inactive_date != null
              ? inputParam[i].complaint_inactive_date
              : null;
          qry += mysql.format(
            "UPDATE `hims_f_episode_chief_complaint` SET episode_id=?, chief_complaint_id=?, onset_date=?, \
            `interval`=?, duration=?,severity=?, score=?, pain=?, chronic=?, complaint_inactive=?,\
            complaint_inactive_date=?,comment=?,complaint_type=?,\
            updated_date=?,updated_by=? where hims_f_episode_chief_complaint_id=?;",
            [
              inputParam[i].episode_id,
              inputParam[i].chief_complaint_id,
              inputParam[i].onset_date,
              inputParam[i].interval,
              inputParam[i].duration,
              inputParam[i].severity,
              inputParam[i].score,
              inputParam[i].pain,
              inputParam[i].chronic,
              inputParam[i].complaint_inactive,
              _complaint_inactive_date,
              inputParam[i].comment,
              inputParam[i].complaint_type,
              moment().format("YYYY-MM-DD HH:mm"),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam[i].hims_f_episode_chief_complaint_id
            ]
          );
        }

        connection.query(qry, (error, updateResult) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          connection.commit(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            releaseDBConnection(db, connection);
            req.records = updateResult;
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add patient_diagnosis
let addPatientDiagnosis = (req, res, next) => {
  debugLog("addPatientDiagnosis");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      const insurtColumns = [
        "patient_id",
        "episode_id",
        "daignosis_id",
        "diagnosis_type",
        "final_daignosis",
        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_patient_diagnosis(" +
          insurtColumns.join(",") +
          ",hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [req.userIdentity.hospital_id],
            req: req
          })
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

//created by irfan: to add patient encounter review
let addPatientROS = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_f_encounter_review` (patient_id,episode_id,review_header_id,\
          review_details_id,`comment`,created_date,created_by,updated_date,updated_by,hospital_id)\
        VALUE(?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.patient_id,
          inputparam.episode_id,
          inputparam.review_header_id,
          inputparam.review_details_id,
          inputparam.comment,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id
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

//created by irfan: to update PatientDiagnosis
let updatePatientDiagnosis = (req, res, next) => {
  try {
    debugFunction("updatePatientDiagnosis");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        let queryBuilder =
          "update hims_f_patient_diagnosis set diagnosis_type=?,\
           final_daignosis=?,updated_date=?,updated_by=?, record_status=? where `record_status`='A' and hims_f_patient_diagnosis_id=?;";
        let inputs = [
          input.diagnosis_type,
          input.final_daignosis,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_f_patient_diagnosis_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.commit(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get ROS header& details
let getReviewOfSystem = (req, res, next) => {
  let selectWhere = {
    hims_d_review_of_system_header_id: "ALL"
  };

  debugFunction("getReviewOfSystem");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let ROS_header = req.query.hims_d_review_of_system_header_id;
      let where = whereCondition(extend(selectWhere, req.query));
      debugLog("ROS_header:", ROS_header);
      if (ROS_header == "null" || ROS_header === undefined) {
        connection.query(
          "SELECT hims_d_review_of_system_header_id, description FROM hims_d_review_of_system_header where record_status='A'",
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      } else {
        connection.query(
          "select RH.hims_d_review_of_system_header_id,RH.description as header_description,RD.hims_d_review_of_system_details_id,RD.description as detail_description from\
        hims_d_review_of_system_header RH,hims_d_review_of_system_details RD where\
         RH.hims_d_review_of_system_header_id=RD.review_of_system_heder_id and RD.record_status='A' and RH.record_status='A' and" +
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
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get Patient ROS
let getPatientROS = (req, res, next) => {
  debugFunction("getPatientROS");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.query);

      connection.query(
        "select hims_f_encounter_review_id, review_header_id,RH.description as  header_description,review_details_id ,\
        RD.description as  detail_description,comment,ER.patient_id,ER.episode_id from ((hims_f_encounter_review ER \
          inner join hims_d_review_of_system_details RD on ER.review_details_id=RD.hims_d_review_of_system_details_id)\
         inner join hims_d_review_of_system_header RH on ER.review_header_id=RH.hims_d_review_of_system_header_id)\
          where ER.record_status='A' and ER.patient_id=? and ER.episode_id=?",
        [input.patient_id, input.episode_id],
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

//created by irfan: to update Patient ROS
let updatePatientROS = (req, res, next) => {
  try {
    debugFunction("updatePatientROS");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        let queryBuilder =
          " update hims_f_encounter_review set patient_id=?, episode_id=?,review_header_id=?,review_details_id=?,`comment`=?,\
          updated_date=?,updated_by=?, record_status=? where `record_status`='A' and hims_f_encounter_review_id=?;";
        let inputs = [
          input.patient_id,
          input.episode_id,
          input.review_header_id,
          input.review_details_id,
          input.comment,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_f_encounter_review_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.commit(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add patient vitals
let addPatientVitalsOLD = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO `hims_f_patient_vitals` (`patient_id`, `visit_id`, `visit_date`, `visit_time`,\
         `case_type`, `height`, `weight`, `bmi`, `oxysat`, `temperature_from`, `temperature_farenhiet`, \
         `temperature_celsisus`,  `systolic`, `diastolic`,systolic_stand, diastolic_stand, systolic_supine, diastolic_supine, glucose_fbs, glucose_rbs,\
          glucose_pbs, head_circumference, bsa, heart_rate, respiratory_rate,`created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.patient_id,
          inputparam.visit_id,
          inputparam.visit_date,
          inputparam.visit_time,
          inputparam.case_type,
          inputparam.height,
          inputparam.weight,
          inputparam.bmi,
          inputparam.oxysat,
          inputparam.temperature_from,
          inputparam.temperature_farenhiet,
          inputparam.temperature_celsisus,
          inputparam.systolic,
          inputparam.diastolic,

          inputparam.systolic_stand,
          inputparam.diastolic_stand,
          inputparam.systolic_supine,
          inputparam.diastolic_supine,
          inputparam.glucose_fbs,
          inputparam.glucose_rbs,
          inputparam.glucose_pbs,
          inputparam.head_circumference,
          inputparam.bsa,
          inputparam.heart_rate,
          inputparam.respiratory_rate,

          new Date(),
          inputparam.created_by,
          new Date(),
          inputparam.updated_by
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
//created by irfan: to add patient vitals
let addPatientVitals = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      const insurtColumns = [
        "patient_id",
        "visit_id",
        "visit_date",
        "visit_time",
        "case_type",
        "vital_id",
        "vital_value",
        "vital_value_one",
        "vital_value_two",
        "formula_value",
        "created_by",
        "updated_by"
      ];

      const _query = mysql.format(
        "INSERT INTO hims_f_patient_vitals(" +
          insurtColumns.join(",") +
          ",created_date,updated_date,hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body,
            newFieldToInsert: [
              new Date(),
              new Date(),
              req.userIdentity.hospital_id
            ],

            req: req
          })
        ]
      );
      connection.query(
        _query,
        // "INSERT INTO hims_f_patient_vitals(" +
        //   insurtColumns.join(",") +
        //   ",created_date,updated_date) VALUES ?",
        // [
        //   jsonArrayToObject({
        //     sampleInputObject: insurtColumns,
        //     arrayObj: inputparam,
        //     newFieldToInsert: [new Date(), new Date()],
        //     req: req
        //   })
        // ]
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add patient physical examination
let addPatientPhysicalExamination = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputparam = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "INSERT INTO hims_f_episode_examination (`patient_id`, `episode_id`, `exam_header_id`, \
        `exam_details_id`, `exam_subdetails_id`, `comments`, `created_date`, `created_by`, `updated_date`, `updated_by`,hospital_id) \
        VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        [
          inputparam.patient_id,
          inputparam.episode_id,
          inputparam.exam_header_id,
          inputparam.exam_details_id,
          inputparam.exam_subdetails_id,
          inputparam.comments,
          new Date(),
          inputparam.created_by,
          new Date(),
          inputparam.updated_by,
          req.userIdentity.hospital_id
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

//created by irfan: to updatePatientAllergy
let updatePatientAllergy = (req, res, next) => {
  try {
    debugFunction("updatePatientAllergy");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        let queryBuilder =
          "update hims_f_patient_allergy set allergy_inactive=?,\
          `comment`=?,onset=?,severity=?,onset_date=?, updated_date=?,updated_by=?, record_status=? where `record_status`='A' and  hims_f_patient_allergy_id=?;";
        let inputs = [
          input.allergy_inactive,
          input.comment,
          input.onset,
          input.severity,
          input.onset_date,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_f_patient_allergy_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          connection.commit(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get physical examination
let getPhysicalExamination = (req, res, next) => {
  try {
    debugFunction("getPhysicalExamination");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.query);
    let input = extend({}, req.query);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let queryBuilder = "";

      let input = req.query;

      debugLog("separtment:", req.userIdentity.sub_department_id);

      if (
        input.hims_d_physical_examination_details_id == "null" &&
        input.hims_d_physical_examination_header_id == "null"
      ) {
        queryBuilder =
          "SELECT hims_d_physical_examination_header_id, examination_type, \
            description as header_description, sub_department_id, assesment_type, \
            mandatory as header_mandatory FROM hims_d_physical_examination_header where record_status='A'and examination_type='G';\
            SELECT hims_d_physical_examination_header_id, examination_type,description as header_description, sub_department_id, assesment_type,\
            mandatory as header_mandatory FROM hims_d_physical_examination_header where record_status='A'and examination_type='S' and sub_department_id='" +
          req.userIdentity.sub_department_id +
          "';";
        debugLog("only physical header");
      } else if (
        input.hims_d_physical_examination_header_id != "null" &&
        input.hims_d_physical_examination_details_id == "null"
      ) {
        queryBuilder =
          "SELECT hims_d_physical_examination_details_id, physical_examination_header_id,\
          description as detail_description, mandatory as detail_mandatory FROM hims_d_physical_examination_details\
           where   record_status='A' and  physical_examination_header_id='" +
          input.hims_d_physical_examination_header_id +
          "';";
        debugLog("only detail ");
      } else if (input.hims_d_physical_examination_details_id != "null") {
        queryBuilder =
          "SELECT hims_d_physical_examination_subdetails_id, physical_examination_details_id, description as sub_detail_description,\
          mandatory as sub_detail_mandatory from hims_d_physical_examination_subdetails where record_status='A' and physical_examination_details_id='" +
          input.hims_d_physical_examination_details_id +
          "'";
        debugLog("only sub -detail ");
      }
      debugLog("Query Physical Exam", queryBuilder);
      connection.query(queryBuilder, (error, result) => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        releaseDBConnection(db, connection);
        debugLog("result", result[1]);

        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Noor: to get all physical examination
let getAllPhysicalExamination = (req, res, next) => {
  try {
    debugFunction("getPhysicalExamination");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      const _all = req.query.allDept == "G" ? "" : " and sub_department_id=?";
      let queryBuilder =
        "SELECT hims_d_physical_examination_header_id,\
      examination_type,h.description,assesment_type,\
      h.mandatory,hims_d_physical_examination_details_id,\
      d.description as dtl_description,\
      sd.description as sub_dtl_description,\
      sd.mandatory ,sd.hims_d_physical_examination_subdetails_id FROM hims_d_physical_examination_header h left outer join  hims_d_physical_examination_details d \
      on h.hims_d_physical_examination_header_id = d.physical_examination_header_id left outer join \
      hims_d_physical_examination_subdetails sd  on sd.physical_examination_details_id=d.hims_d_physical_examination_details_id \
       where \
      h.record_status='A' " +
        _all;
      connection.query(
        queryBuilder,
        [req.userIdentity.sub_department_id],
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

let addDietAdvice = (req, res, next) => {
  let dietadvice = {
    hims_f_patient_diet_id: null,
    patient_id: null,
    episode_id: null,
    diet_id: null,
    comments: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(dietadvice, req.body);
    connection.query(
      "INSERT INTO `hims_f_patient_diet` (`patient_id`, `episode_id`,`diet_id`, `comments`, `till_date` \
      , `created_by` ,`created_date`,updated_date,updated_by,hospital_id) \
   VALUES ( ?, ?, ?, ?, ?, ?,?, ?,?,?)",
      [
        inputParam.patient_id,
        inputParam.episode_id,
        inputParam.diet_id,
        inputParam.comments,
        inputParam.till_date,
        inputParam.created_by,
        new Date(),
        new Date(),
        inputParam.updated_by,
        req.userIdentity.hospital_id
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

let deleteDietAdvice = (req, res, next) => {
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = req.body;
    connection.query(
      "DELETE FROM  `hims_f_patient_diet`  WHERE `hims_f_patient_diet_id`=?;",
      [inputParam.hims_f_patient_diet_id],
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

let getEpisodeDietAdvice = (req, res, next) => {
  let Diet = {
    hims_f_patient_diet_id: "ALL",
    patient_id: "ALL",
    episode_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let pagePaging = "";
    if (req.paging != null) {
      let Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    let condition = whereCondition(extend(Diet, req.query));
    selectStatement(
      {
        db: req.db,
        query:
          "SELECT * FROM `hims_f_patient_diet` WHERE `record_status`='A' AND " +
          condition.condition +
          " " +
          pagePaging,
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

let addReferalDoctor = (req, res, next) => {
  let referraldoc = {
    hims_f_patient_referral_id: null,
    patient_id: null,
    episode_id: null,
    referral_type: null,
    sub_department_id: null,
    hospital_name: null,
    reason: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(referraldoc, req.body);
    connection.query(
      "INSERT INTO `hims_f_patient_referral` (`patient_id`, `episode_id`,`referral_type`, `sub_department_id`, \
      `doctor_id` ,`hospital_name`, `reason`, `created_by` ,`created_date`,`hospital_id`,`updated_by`,`updated_date`,`record_status`,`external_doc_name`) \
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)",
      [
        inputParam.patient_id,
        inputParam.episode_id,
        inputParam.referral_type,
        inputParam.sub_department_id,
        inputParam.doctor_id,
        inputParam.hospital_name,
        inputParam.reason,
        inputParam.created_by,
        new Date(),
        req.userIdentity.hospital_id,
        inputParam.created_by,
        new Date(),
        "A",
        inputParam.external_doc_name
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

let addFollowUp = (req, res, next) => {
  let followup = {
    hims_f_patient_followup_id: null,
    patient_id: null,
    episode_id: null,
    doctor_id: null,
    followup_type: null,
    followup_date: null,
    reason: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(followup, req.body);
    connection.query(
      "INSERT INTO `hims_f_patient_followup` (`patient_id`, `doctor_id`, `episode_id`, `followup_type`, \
       `followup_date`, `sub_department_id`, `reason`, `created_by` ,`created_date`,hospital_id) \
      VALUES ( ?, ?, ?, ?, ?, ?,?, ?, ?, ?)",
      [
        inputParam.patient_id,
        inputParam.doctor_id,
        inputParam.episode_id,
        inputParam.followup_type,
        inputParam.followup_date,
        inputParam.sub_department_id,
        inputParam.reason,
        inputParam.created_by,
        new Date(),
        req.userIdentity.hospital_id
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

//created by:irfan,to get Patient physical examination
let getPatientPhysicalExamination = (req, res, next) => {
  debugFunction("getPatientPhysicalExamination");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.query);

      // select hims_f_episode_examination_id,  comments ,\
      //   hims_d_physical_examination_header_id, PH.examination_type, PH.description as header_description,PH.sub_department_id, PH.assesment_type, PH.mandatory as header_mandatory,\
      //               hims_d_physical_examination_details_id,PD.description as detail_description, PD.mandatory as detail_mandatory,\
      //               hims_d_physical_examination_subdetails_id,PS.description as subdetail_description, PS.mandatory as subdetail_mandatory \
      //               from hims_f_episode_examination EE,hims_d_physical_examination_header PH ,hims_d_physical_examination_details PD,hims_d_physical_examination_subdetails PS\
      //               where EE.exam_header_id=PH.hims_d_physical_examination_header_id and EE.exam_details_id=PD.hims_d_physical_examination_details_id and EE.exam_subdetails_id=PS.hims_d_physical_examination_subdetails_id and \
      //               EE.record_status='A' and EE.patient_id= ? and EE.episode_id=?
      connection.query(
        "select hims_f_episode_examination_id, patient_id, episode_id, exam_header_id, exam_details_id,exam_subdetails_id, comments ,\
        hims_d_physical_examination_header_id, PH.examination_type, PH.description as header_description,PH.sub_department_id, PH.assesment_type, PH.mandatory as header_mandatory,\
                    hims_d_physical_examination_details_id,PD.description as detail_description, PD.mandatory as detail_mandatory,\
                    hims_d_physical_examination_subdetails_id,PS.description as subdetail_description, PS.mandatory as subdetail_mandatory\
                    from  ((hims_f_episode_examination EE  join hims_d_physical_examination_header PH on EE.exam_header_id=PH.hims_d_physical_examination_header_id) left join hims_d_physical_examination_details PD on\
                      EE.exam_details_id=PD.hims_d_physical_examination_details_id )\
                    left join hims_d_physical_examination_subdetails PS on EE.exam_subdetails_id=PS.hims_d_physical_examination_subdetails_id \
                   where  EE.record_status='A' and EE.patient_id= ? and EE.episode_id=?",
        [input.patient_id, input.episode_id],
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

//created by irfan: to update or delete Patient physical examination
let updatePatientPhysicalExam = (req, res, next) => {
  try {
    debugFunction("updatePatientPhysicalExam");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        let queryBuilder =
          "UPDATE `hims_f_episode_examination` SET  `patient_id`=?,\
          `episode_id`=?, `exam_header_id`=?, `exam_details_id`=?, `exam_subdetails_id`=?, `comments`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=? WHERE `record_status`='A' and `hims_f_episode_examination_id`=?;";
        let inputs = [
          input.patient_id,
          input.episode_id,
          input.exam_header_id,
          input.exam_details_id,
          input.exam_subdetails_id,
          input.comments,
          new Date(),
          input.updated_by,
          input.record_status,
          input.hims_f_episode_examination_id
        ];

        connection.query(queryBuilder, inputs, (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          connection.commit(error => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            req.records = result;
            releaseDBConnection(db, connection);
            next();
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get
let getVitalsHeaderMaster = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;

    _mysql
      .executeQuery({
        query:
          "with vitals (hims_d_vitals_header_id,vitals_name, uom, general,display,mandatory,vital_short_name) as \
    ( \
    SELECT H.hims_d_vitals_header_id, vitals_name, uom, general,display,mandatory,vital_short_name FROM hims_d_vitals_header H \
     where general='Y' and H.record_status='A' \
      UNION ALL \
      select H.hims_d_vitals_header_id, vitals_name, uom, general,display,mandatory,vital_short_name from hims_d_vitals_header H,hims_m_department_vital_mapping M \
     where general='N' and H.record_status='A' and H.hims_d_vitals_header_id =M.vital_header_id and  M.department_id=?  \
    ) \
    SELECT hims_d_vitals_header_id,vitals_name, uom, general,display,mandatory,vital_short_name from vitals",
        values: [req.userIdentity.sub_department_id]
      })
      .then(result => {
        const vitalDetails = new LINQ(result)
          .Select(s => {
            return s.hims_d_vitals_header_id;
          })
          .ToArray();
        _mysql
          .executeQuery({
            query:
              "select hims_d_vitals_details_id,vitals_header_id,gender,min_age,max_age,min_value,max_value from hims_d_vitals_details where vitals_header_id in (?)",
            values: [vitalDetails],
            printQuery: true
          })
          .then(detailResult => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
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

//created by irfan: to add patient_historty
let addPatientHistory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let input = extend({}, req.body);

      const insurtColumns = [
        "history_type",
        "remarks",
        "created_by",
        "updated_by"
      ];

      connection.query(
        "INSERT INTO hims_f_patient_history(" +
          insurtColumns.join(",") +
          ",patient_id,provider_id, created_date,updated_date,hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.patient_history,
            newFieldToInsert: [
              input.patient_id,
              input.provider_id,
              new Date(),
              new Date(),
              req.userIdentity.hospital_id
            ],
            req: req
          })
        ],

        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results are recorded...");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getPatientHistory
let getPatientHistoryBACKUP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_history_id,history_type, provider_id, patient_id, remarks from hims_f_patient_history\
        where record_status='A' and patient_id=?",
        [req.query.patient_id],
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
//created by irfan: to getPatientHistory
let getPatientHistory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select \
        	hims_f_patient_history_id, \
        	history_type, \
        	provider_id, \
        	concat(T.title,' ', E.full_name) as provider_name, \
        	patient_id,\
        	remarks, \
        	PH.created_date \
        from \
        	hims_f_patient_history as PH \
        	inner join  hims_d_employee as E \
        	on PH.provider_id = E.hims_d_employee_id \
        	left join hims_d_title as T \
        	on T.his_d_title_id = E.title_id \
        where \
        	PH.provider_id = E.hims_d_employee_id \
        	and PH.record_status = 'A' \
        	and E.record_status = 'A' \
        	and  patient_id =?;",
        [req.query.patient_id],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          let history = _.chain(result)
            .groupBy(g => g.history_type)
            .map(function(detail, key) {
              return {
                groupType: key,
                groupName:
                  key == "SOH"
                    ? "Social History"
                    : key === "MEH"
                    ? "Medical History"
                    : key === "SGH"
                    ? "Surgical History"
                    : key === "FMH"
                    ? "Family History"
                    : key === "BRH"
                    ? "Birth History"
                    : "",
                groupDetail: detail
              };
            })
            .value();

          req.records = history;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let getFollowUp = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputData = req.query;
    let strQuery =
      "SELECT p.patient_code,p.full_name, p.registration_date,p.gender,p.date_of_birth,p.contact_number, \
      E.full_name as employee_name, SD.sub_department_name FROM hims_f_patient_followup PF, \
      hims_f_patient p, hims_d_sub_department SD , hims_d_employee E where PF.patient_id = p.hims_d_patient_id \
      and SD.hims_d_sub_department_id=PF.sub_department_id and E.hims_d_employee_id=PF.doctor_id ";

    if (
      inputData.date_of_recall != undefined ||
      inputData.date_of_recall != null
    ) {
      strQuery +=
        " and date(followup_date)= date('" + inputData.date_of_recall + "')";
    }

    if (inputData.doctor_id != null) {
      strQuery += " and PF.doctor_id='" + inputData.doctor_id + "'";
    }

    if (inputData.sub_department_id != null) {
      strQuery +=
        " and PF.sub_department_id='" + inputData.sub_department_id + "'";
    }
    _mysql
      .executeQuery({
        query: strQuery,
        printQuery: true
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
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let inputData = extend({}, req.query);
  //
  //   // let followup_date = "date(inputData.date_of_recall)"";
  //
  //   debugLog("strQuery: ", strQuery);
  //   db.getConnection((error, connection) => {
  //     connection.query(strQuery, [inputData.doctor_id], (error, result) => {
  //       releaseDBConnection(db, connection);
  //       if (error) {
  //         next(error);
  //       }
  //       req.records = result;
  //       next();
  //     });
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan: to get
let getPatientEpisodeSummary = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_f_episode_chief_complaint_id, ECC.episode_id, ECC.patient_id, chief_complaint_id, \
        onset_date, `interval`, duration, severity, score, pain, chronic, complaint_inactive ,\
        full_name as patient_name,arabic_name,gender,age\
        ,hims_f_patient_visit_id,visit_date ,sub_department_name,comment from\
        hims_f_episode_chief_complaint  ECC\
        inner join hims_f_patient P on ECC.patient_id=P.hims_d_patient_id \
        inner join hims_f_patient_visit V on ECC.episode_id=V.episode_id\
        inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
        where ECC.episode_id=?    group by  ECC.chief_complaint_id ",
        [req.query.episode_id],
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

//created by Nowshad: to Update Notes in Patient encounter
let updatePatientEncounter = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputData = req.body;
    let strQuery = _mysql.mysqlQueryFormat(
      "UPDATE hims_f_patient_encounter Set "
    );

    if (inputData.examination_notes != null) {
      strQuery += _mysql.mysqlQueryFormat("examination_notes=?", [
        inputData.examination_notes
      ]);
    }
    if (inputData.assesment_notes != null) {
      const putComma = inputData.examination_notes != null ? "," : "";
      strQuery += _mysql.mysqlQueryFormat(putComma + "assesment_notes =?", [
        inputData.assesment_notes
      ]);
    }

    if (inputData.significant_signs != null) {
      const putComma =
        inputData.examination_notes != null
          ? ","
          : inputData.assesment_notes != null
          ? ","
          : "";
      strQuery += _mysql.mysqlQueryFormat(putComma + "significant_signs = ?", [
        inputData.significant_signs
      ]);
    }

    if (inputData.other_signs != null) {
      const putComma =
        inputData.examination_notes != null
          ? ","
          : inputData.assesment_notes != null
          ? ","
          : inputData.significant_signs != null
          ? ","
          : "";
      strQuery += _mysql.mysqlQueryFormat(putComma + "other_signs = ?", [
        inputData.other_signs
      ]);
    }
    strQuery += " where encounter_id=?";

    _mysql
      .executeQuery({
        query: strQuery,
        values: [inputData.encounter_id],
        printQuery: true
      })
      .then(result => {
        // utilities.logger().log("result: ", result);
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
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let inputData = extend({}, req.body);
  //   let strQuery = "";
  //   if (inputData.examination_notes != null) {
  //     strQuery += "examination_notes = '" + inputData.examination_notes + "'";
  //   }
  //   if (inputData.assesment_notes != null) {
  //     strQuery += "assesment_notes = '" + inputData.assesment_notes + "'";
  //   }

  //   if (inputData.significant_signs != null) {
  //     strQuery += "significant_signs = '" + inputData.significant_signs + "'";
  //   }

  //   if (inputData.other_signs != null) {
  //     // strQuery !== "" ? " and" : "";
  //     strQuery += " , other_signs = '" + inputData.other_signs + "'";
  //   }

  //   if (strQuery != "") {
  //     db.getConnection((error, connection) => {
  //       connection.query(
  //         "UPDATE hims_f_patient_encounter Set " +
  //           strQuery +
  //           " where encounter_id=?",
  //         [inputData.encounter_id],
  //         (error, result) => {
  //           releaseDBConnection(db, connection);
  //           if (error) {
  //             next(error);
  //           }
  //           req.records = result;
  //           debugLog("result", result);
  //           next();
  //         }
  //       );
  //     });
  //   } else {
  //     next();
  //     return;
  //   }
  // } catch (e) {
  //   next(e);
  // }
};

//created by Nowshad: to get
let getPatientEncounter = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "SELECT examination_notes,assesment_notes, other_signs, significant_signs FROM hims_f_patient_encounter where encounter_id=?;",
        [req.query.encounter_id],
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

//created by irfan:  to get allergic details
let getSummaryFollowUp = (req, res, next) => {
  debugFunction("getAllergyDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "SELECT * FROM hims_f_patient_followup where episode_id=?;",
        [req.query.episode_id],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("Results fetched");
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
let addSickLeave = (req, res, next) => {
  let addSickLeave = {};

  debugFunction("addSickLeave");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(addSickLeave, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "SELECT * FROM hims_f_patient_sick_leave where patient_id=? and visit_id=?;",
        [input.patient_id, input.visit_id],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          if (results.length == 0) {
            connection.query(
              "insert into hims_f_patient_sick_leave(patient_id, visit_id, episode_id, from_date, \
                to_date, no_of_days, remarks)values(?, ?, ?, ?, ?, ?, ?)",
              [
                input.patient_id,
                input.visit_id,
                input.episode_id,
                input.from_date,
                input.to_date,
                input.no_of_days,
                input.remarks
              ],
              (error, results) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                debugLog("Results are recorded...");
                req.records = results;
                next();
              }
            );
          } else {
            req.records = results;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
let getSickLeave = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "SELECT * FROM hims_f_patient_sick_leave where patient_id=? and visit_id=?;",
        [req.query.patient_id, req.query.visit_id],
        (error, results) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          req.records = results;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  physicalExaminationHeader,
  physicalExaminationDetails,
  physicalExaminationSubDetails,
  getPhysicalExamination,
  addOrder,
  addSample,
  addAnalytes,
  addAllergy,
  getAllergyDetails,
  addChronicalConditions,
  getChronicalConditions,
  addEncounterReview,
  getEncounterReview,
  getMyDay,
  updatdePatEncntrStatus,
  getPatientProfile,
  getChiefComplaints,
  getFollowUp,

  addPatientChiefComplaints,
  addNewChiefComplaint,
  getPatientChiefComplaints,
  deletePatientChiefComplaints,
  addPatientNewAllergy,
  getAllAllergies,
  getPatientAllergy,
  updatePatientChiefComplaints,
  addPatientDiagnosis,
  addPatientROS,
  getPatientROS,
  updatePatientROS,
  addReviewOfSysHeader,
  addReviewOfSysDetails,
  getReviewOfSystem,
  updatePatientDiagnosis,
  addPatientVitals,
  addPatientPhysicalExamination,
  updatePatientAllergy,
  addDietAdvice,
  getEpisodeDietAdvice,
  addReferalDoctor,
  addFollowUp,
  getPatientPhysicalExamination,
  updatePatientPhysicalExam,
  getPatientVitals,
  getPatientAllergies,
  getPatientDiagnosis,
  getPatientDiet,
  getAllPhysicalExamination,
  getVitalsHeaderMaster,
  addPatientHistory,
  getPatientHistory,
  getPatientEpisodeSummary,

  updatePatientEncounter,
  getPatientEncounter,
  getPatientBasicChiefComplaints,
  deleteDietAdvice,
  getSummaryFollowUp,
  addSickLeave,
  getSickLeave
};
