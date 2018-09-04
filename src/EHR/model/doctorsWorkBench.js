"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  releaseDBConnection
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
//import { LINQ } from "node-linq";
import moment from "moment";
import { debugFunction, debugLog } from "../../utils/logging";
import formater from "../../keys/keys";
import { decryption } from "../../utils/cryptography";
import { debuglog } from "util";

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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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

//created by:irfan,to get physical examination header& details
let getPhysicalExamination = (req, res, next) => {
  let physicalExaminationHeaderModel = {
    headerId: null
  };

  let physicalExaminationDetailsModel = {
    hims_d_physical_examination_details_id: null,
    physical_examination_header_id: null
  };

  let physicalExaminationSubDetailsModel = {
    hims_d_physical_examination_subdetails_id: null,
    physical_examination_details_id: null
  };

  debugFunction("getPhysicalExamination");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      //if headerId not received then send all details
      if (req.query.headerId == null || req.query.headerId == undefined) {
        connection.query(
          " SELECT * FROM hims_d_physical_examination_header where record_status='A'",
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            req.records = result;
            next();
          }
        );
      }
      //if headerId  received then send specific details and sub details
      else if (req.query.headerId != null) {
        let headerInput = extend(physicalExaminationHeaderModel, req.query);

        connection.query(
          "SELECT * FROM hims_d_physical_examination_header \
      where hims_d_physical_examination_header_id=? and record_status='A'",
          [headerInput.headerId],
          (error, headerResult) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            // req.records = detailResult;

            connection.query(
              "SELECT * FROM hims_d_physical_examination_details where \
         physical_examination_header_id=? and record_status='A'",
              [headerInput.headerId],
              (error, detailResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }

                if (detailResult != null) {
                  let details_id =
                    detailResult[0].hims_d_physical_examination_details_id;
                  debugLog(
                    "detailsId:",
                    detailResult[0].hims_d_physical_examination_details_id
                  );

                  connection.query(
                    "SELECT * FROM hims_d_physical_examination_subdetails where\
                    physical_examination_details_id=? and record_status='A'",
                    [details_id],
                    (error, subDetailResult) => {
                      if (error) {
                        releaseDBConnection(db, connection);
                        next(error);
                      }

                      req.records = {
                        header: headerResult,
                        detail: detailResult,
                        subDetail: subDetailResult
                      };
                      next();
                    }
                  );
                }
              }
            );
          }
        );
      }
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
          cancelled,ordered_date,test_type,created_by,updated_by)values(\
              ?,?,?,?,?,?,?,?,?,?,?)",
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
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
        "insert into hims_d_lab_sample(\
          order_id,sample_id,status,collected,\
          collected_date,created_by,updated_by)values(\
              ?,?,?,?,?,?,?)",
        [
          input.order_id,
          input.sample_id,
          input.status,
          input.collected,
          input.collected_date,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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

//created by:irfan,to get review of system header& details
let getReviewOfSystem = (req, res, next) => {
  let reviewOfSysHeaderModel = {
    headerId: null
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

      //if headerId not received then send all headers
      if (req.query.headerId == null || req.query.headerId == undefined) {
        connection.query(
          " SELECT * FROM hims_d_review_of_system_header where record_status='A'",
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            req.records = result;
            next();
          }
        );
      }
      //if headerId  received then send specific details and sub details
      else if (req.query.headerId != null) {
        let headerInput = extend(reviewOfSysHeaderModel, req.query);

        connection.query(
          "SELECT * FROM hims_d_review_of_system_header \
      where hims_d_review_of_system_header_id=? and record_status='A'",
          [headerInput.headerId],
          (error, headerResult) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            // req.records = detailResult;

            connection.query(
              "SELECT * FROM hims_d_review_of_system_details where \
              review_of_system_heder_id=? and record_status='A'",
              [headerInput.headerId],
              (error, detailResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }

                req.records = {
                  header: headerResult,
                  detail: detailResult
                };
                next();
              }
            );
          }
        );
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add allergic details
let addAllergy = (req, res, next) => {
  let AllergyModel = {
    hims_d_allergiy_id: null,
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
        if (error) {
          next(error);
          releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          encounter_id,review_header_id,review_details_id,created_by,updated_by)values(\
              ?,?,?,?,?)",
        [
          input.encounter_id,
          input.review_header_id,
          input.review_details_id,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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
  let getMydayWhere = {
    provider_id: req.userIdentity.employee_id
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let dateDiff = "";
    if (req.query.fromDate != null && req.query.toDate != null) {
      dateDiff +=
        " date(E.created_date) BETWEEN date('" +
        moment(req.query.fromDate).format(formater.dbFormat.date) +
        "') AND date('" +
        moment(req.query.toDate).format(formater.dbFormat.date) +
        "')";
      delete req.query.fromDate;
      delete req.query.toDate;
    } else if (req.query.toDate != null) {
      dateDiff = " date(E.created_date) = date('" + req.query.toDate + "')";
      delete req.query.toDate;
    }

    let statusFlag = "";
    if (req.query.status == "A") {
      statusFlag = " E.status <> 'V' AND";
      delete req.query.status;
    } else if (req.query.status == "V") {
      statusFlag = " E.status='V' AND";
      delete req.query.status;
    }

    debugLog("req query:", req.query);
    let where = whereCondition(extend(getMydayWhere, req.query));

    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "select  E.hims_f_patient_encounter_id,P.patient_code,P.full_name,E.patient_id ,E.provider_id,E.`status`,E.nurse_examine,E.checked_in,\
         E.payment_type,E.episode_id,E.encounter_id,E.`source`,E.created_date,E.visit_id from hims_f_patient_encounter E\
         INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id  where E.record_status='A' AND " +
          statusFlag +
          "" +
          dateDiff +
          " AND " +
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
      connection.query(
        "UPDATE  hims_f_patient_encounter SET  `status`='W',updated_by=?,updated_date=now() WHERE\
         hims_f_patient_encounter_id=? AND  record_status='A';",
        [req.body.updated_by, req.body.patient_encounter_id],
        (error, result) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
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
        "SELECT P.hims_d_patient_id,P.full_name,P.patient_code,P.gender,P.date_of_birth,P.contact_number,N.nationality,\
        PV.age_in_years,PV.age_in_months,PV.age_in_days,PE.payment_type,PE.created_date as Encounter_Date \
from ( (hims_f_patient P inner join hims_f_patient_encounter PE  on P.hims_d_patient_id=PE.patient_id)\
inner join hims_d_nationality N on N.hims_d_nationality_id=P.nationality_id ) inner join hims_f_patient_visit PV on \
PV.hims_f_patient_visit_id=PE.visit_id where P.hims_d_patient_id=? and PE.episode_id=?;SELECT * FROM hims_f_patient_vitals t,(\
  SELECT max(visit_id) as last_visit,MAX(visittime) as last_visit_time ,date(MAX(visit_date)) as last_visit_date\
  FROM hims_f_patient_vitals  where  patient_id=? ) last_entry    WHERE last_entry.last_visit= t.visit_id;",
        [inputData.patient_id, inputData.episode_id, inputData.patient_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = { patient_profile: result[0], vitals: result[1] };
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
        "select hims_d_hpi_header_id,hpi_description from hims_d_hpi_header where sub_department_id=? and record_status='A';",
        [sub_department_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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
  let chiefComplaintModel = {
    hpi_description: null,
    sub_department_id: null,
    created_by: null,
    updated_by: null
  };

  debugFunction("addNewChiefComplaint");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend(chiefComplaintModel, req.body);

    let header = req.headers["x-app-user-identity"];
    header = decryption(header);
    input.sub_department_id = header.sub_department_id;
    debugLog("sub_department_id:", header.sub_department_id);

    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_hpi_header( hpi_description,\
           sub_department_id,created_by,  updated_by)values(\
              ?,?,?,?)",
        [
          input.hpi_description,
          input.sub_department_id,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            next(error);
            releaseDBConnection(db, connection);
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

// created by : irfan to get chief complaint elements (hpi details)
let getChiefComplaintsElements = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_hpi_details_id,hpi_header_id,element_description,element_type \
        from hims_d_hpi_details  where hpi_header_id=? and record_status='A';",
        [inputData.hpi_header_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

// created by : irfan to ADD chief complaint elements(hpi details)
let addChiefComplaintsElement = (req, res, next) => {
  debugFunction("addChiefComplaintsElement");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_d_hpi_details(hpi_header_id,element_description,element_type,created_by,updated_by) \
        values(?,?,?,?,?)",
        [
          input.hpi_header_id,
          input.element_description,
          input.element_type,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            releaseDBConnection(db, connection);
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

// created by : irfan to ADD  patient-chief complaint
let addPatientChiefComplaints = (req, res, next) => {
  debugFunction("addPatientChiefComplaints");
  let chiefComplaintModel = {
    episode: null,
    chief_complaint_id: null,
    onset_date: null,
    severity: null,
    score: null,
    pain: null,
    comment: null
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        releaseDBConnection(db, connection);
        next(error);
      }

      connection.query(
        "insert into hims_f_episode_chief_complaint (episode_id,chief_complaint_id,onset_date,`interval`,duration,\
          severity,score,pain,comment,created_by,updated_by) \
        values(?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.episode_id,
          input.chief_complaint_id,
          input.onset_date,
          input.interval,
          input.duration,
          input.severity,
          input.score,
          input.pain,
          input.comment,
          input.created_by,
          input.updated_by
        ],
        (error, results) => {
          if (error) {
            releaseDBConnection(db, connection);
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

//created by irfan: to get patient ChiefComplaints
let getPatientChiefComplaints = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select PE.hims_f_patient_encounter_id,PE.patient_id,PE.created_date as Encounter_Date , ecc.episode_id,ecc.hims_f_episode_chief_complaint_id,ecc.chief_complaint_id,hh.hpi_description as chief_complaint_name,ecc.onset_date,ecc.interval,ecc.duration,ecc.severity,\
        ecc.score,ecc.pain,ecc.comment from ( (hims_f_episode_chief_complaint ecc inner join hims_d_hpi_header hh on hh.hims_d_hpi_header_id=ecc.chief_complaint_id )    inner join hims_f_patient_encounter PE on PE.episode_id=ecc.episode_id)\
        where ecc.record_status='A'and ecc.episode_id=? ",
        [inputData.episode_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          req.records = result;
          debugLog("result", result);
          next();
        }
      );
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
        "update hims_f_episode_chief_complaint set record_status='I' where hims_f_episode_chief_complaint_id=?",
        [req.body.hims_f_episode_chief_complaint_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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
let addNewAllergy = (req, res, next) => {
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
        "INSERT INTO `hims_f_patient_allergy` (`patient_id`, `allergy_id`, `created_by`,  `updated_by`)\
        VALUE(?,?,?,?)",
        [
          inputparam.patient_id,
          inputparam.allergy_id,
          inputparam.created_by,
          inputparam.updated_by
        ],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_allergiy_id,allergy_type,\
        allergy_name from hims_d_allergy where record_status='A' and allergy_type=?; ",
        [inputData.allergy_type],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let inputData = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_patient_allergy_id,patient_id,allergy_id,A.allergy_type,A.allergy_name from hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?  and PA.allergy_id=A.hims_d_allergiy_id order by hims_f_patient_allergy_id desc ; ",
        [inputData.patient_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

let updatePatientChiefComplaints = (req, res, next) => {
  try {
    debugFunction("updatePatientChiefComplaints");
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("Input Data", req.body);
    let input = extend(department, req.body);
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
          "UPDATE `hims_f_episode_chief_complaint`\
        SET   episode_id=?,chief_complaint_id=?,onset_date=?,`interval`=?,duration=?,severity=?,score=?,pain=?,chronic=?,\
        complaint_inactive=?,complaint_inactive_date=?,comment=?,updated_date=?,updated_by=?,\
        WHERE record_status='A' AND `hims_f_episode_chief_complaint_id`=?;";
        let inputs = [
          input.episode_id,
          input.chief_complaint_id,
          input.onset_date,
          input.interval,
          input.duration,
          input.severity,
          input.score,
          input.pain,
          input.chronic,
          input.complaint_inactive,
          input.complaint_inactive_date,
          input.comment,
          new Date(),
          input.updated_by
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
            next();
          });
        });
      });
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
  addReviewOfSysHeader,
  addReviewOfSysDetails,
  getReviewOfSystem,
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
  getChiefComplaintsElements,
  addChiefComplaintsElement,
  addPatientChiefComplaints,
  addNewChiefComplaint,
  getPatientChiefComplaints,
  deletePatientChiefComplaints,
  addNewAllergy,
  getAllAllergies,
  getPatientAllergy,
  updatePatientChiefComplaints
};
