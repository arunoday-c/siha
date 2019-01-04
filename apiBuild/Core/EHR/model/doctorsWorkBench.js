"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _logging = require("../../utils/logging");

var _keys = require("../../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _cryptography = require("../../utils/cryptography");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan: to add  physical_examination_header
var physicalExaminationHeader = function physicalExaminationHeader(req, res, next) {
  var physicalExaminationHeaderModel = {
    hims_d_physical_examination_header: null,
    examination_type: null,
    description: null,
    sub_department_id: null,
    assesment_type: null,
    mandatory: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("physicalExaminationHeader");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(physicalExaminationHeaderModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_physical_examination_header(\
            examination_type,description,sub_department_id,assesment_type,\
            mandatory,created_by,updated_by)values(\
            ?,?,?,?,?,?,?)", [input.examination_type, input.description, input.sub_department_id, input.assesment_type, input.mandatory, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
var physicalExaminationDetails = function physicalExaminationDetails(req, res, next) {
  var physicalExaminationDetailsModel = {
    hims_d_physical_examination_details_id: null,
    physical_examination_header_id: null,
    description: null,
    mandatory: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("physicalExaminationDetails");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(physicalExaminationDetailsModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_physical_examination_details(\
            physical_examination_header_id,description,mandatory,created_by,updated_by)values(\
              ?,?,?,?,?)", [input.physical_examination_header_id, input.description, input.mandatory, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add  physical_examination_subdetails
var physicalExaminationSubDetails = function physicalExaminationSubDetails(req, res, next) {
  var physicalExaminationSubDetailsModel = {
    hims_d_physical_examination_subdetails_id: null,
    physical_examination_details_id: null,
    description: null,
    mandatory: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("physicalExaminationSubDetails");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(physicalExaminationSubDetailsModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_physical_examination_subdetails(\
            physical_examination_details_id,\
            description,mandatory,created_by,updated_by)values(\
                ?,?,?,?,?)", [input.physical_examination_details_id, input.description, input.mandatory, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add order
var addOrder = function addOrder(req, res, next) {
  var hims_f_lab_orderModel = {
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

  (0, _logging.debugFunction)("addOrder");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(hims_f_lab_orderModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_f_lab_order(\
          patient_id,visit_id,provider_id,service_id,status,billed,\
          cancelled,ordered_date,test_type,created_by,updated_by)values(\
              ?,?,?,?,?,?,?,?,?,?,?)", [input.patient_id, input.visit_id, input.provider_id, input.service_id, input.status, input.billed, input.cancelled, input.ordered_date, input.test_type, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add sample
var addSample = function addSample(req, res, next) {
  var hims_d_lab_sampleModel = {
    hims_d_lab_sample_id: null,
    order_id: null,
    sample_id: null,
    status: null,
    collected: null,
    collected_date: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addSample");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(hims_d_lab_sampleModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_lab_sample(\
          order_id,sample_id,status,collected,\
          collected_date,created_by,updated_by)values(\
              ?,?,?,?,?,?,?)", [input.order_id, input.sample_id, input.status, input.collected, input.collected_date, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add Analytes
var addAnalytes = function addAnalytes(req, res, next) {
  var AnalytesModel = {
    hims_d_lab_analytes_id: null,
    sample_id: null,
    analyte_id: null,
    result: null,
    text: null,
    status: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addAnalytes");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(AnalytesModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_lab_analytes(\
          sample_id,analyte_id,result,text,status,created_by,updated_by)values(\
              ?,?,?,?,?,?,?)", [input.sample_id, input.analyte_id, input.result, input.text, input.status, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add ReviewOfSysHeader
var addReviewOfSysHeader = function addReviewOfSysHeader(req, res, next) {
  var reviewOfSysHeaderModel = {
    description: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addReviewOfSysHeader");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(reviewOfSysHeaderModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_review_of_system_header(\
          description,created_by,updated_by)values(\
              ?,?,?)", [input.description, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add ReviewOfSysDetails
var addReviewOfSysDetails = function addReviewOfSysDetails(req, res, next) {
  var reviewOfSysDetailsModel = {
    review_of_system_heder_id: null,
    description: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addReviewOfSysDetails");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(reviewOfSysDetailsModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_review_of_system_details(\
          review_of_system_heder_id,description,created_by,updated_by)values(\
              ?,?,?,?)", [input.review_of_system_heder_id, input.description, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add allergic details
var addAllergy = function addAllergy(req, res, next) {
  var AllergyModel = {
    hims_d_allergy_id: null,
    allergy_type: null,
    allergy_name: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addAllergy");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(AllergyModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_allergy(\
          allergy_type,allergy_name,created_by,updated_by)values(\
              ?,?,?,?)", [input.allergy_type, input.allergy_name, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to get allergic details
var getAllergyDetails = function getAllergyDetails(req, res, next) {
  (0, _logging.debugFunction)("getAllergyDetails");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("SELECT * FROM hims_d_allergy", function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results fetched");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add chronical conditions
var addChronicalConditions = function addChronicalConditions(req, res, next) {
  var ChronicalConditionsModel = {
    hims_d_chronic_conditions_id: null,
    name: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addChronicalConditions");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(ChronicalConditionsModel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_d_chronic_conditions(\
          name,created_by,updated_by)values(\
              ?,?,?)", [input.name, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to get chronical conditions
var getChronicalConditions = function getChronicalConditions(req, res, next) {
  (0, _logging.debugFunction)("getChronicalConditions");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("SELECT * FROM hims_d_chronic_conditions;", function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results fetched");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to add encounter review
var addEncounterReview = function addEncounterReview(req, res, next) {
  var EncounterReviewMOdel = {
    hims_f_encounter_review_id: null,
    encounter_id: null,
    review_header_id: null,
    review_details_id: null,
    created_by: null,
    updated_by: null
  };

  (0, _logging.debugFunction)("addEncounterReview");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)(EncounterReviewMOdel, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      connection.query("insert into hims_f_encounter_review(\
          encounter_id,review_header_id,review_details_id,created_by,updated_by)values(\
              ?,?,?,?,?)", [input.encounter_id, input.review_header_id, input.review_details_id, input.created_by, input.updated_by], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:  to getEncounterReview
var getEncounterReview = function getEncounterReview(req, res, next) {
  (0, _logging.debugFunction)("getEncounterReview");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }
      var encounter_id = req.query.encounter_id;
      connection.query("SELECT * FROM hims_f_encounter_review where encounter_id=?", [encounter_id], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results fetched");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: get MYDAY in doctors work bench , to show list of todays patients
var getMyDay = function getMyDay(req, res, next) {
  var getMydayWhere = {
    provider_id: req.userIdentity.employee_id,
    sub_department_id: req.userIdentity.sub_department_id
  };

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var dateDiff = "";
    if (req.query.fromDate != null && req.query.toDate != null) {
      dateDiff += " date(E.created_date) BETWEEN date('" + (0, _moment2.default)(req.query.fromDate).format(_keys2.default.dbFormat.date) + "') AND date('" + (0, _moment2.default)(req.query.toDate).format(_keys2.default.dbFormat.date) + "')";
      delete req.query.fromDate;
      delete req.query.toDate;
    } else if (req.query.toDate != null) {
      dateDiff = " date(E.created_date) = date('" + req.query.toDate + "')";
      delete req.query.toDate;
    }

    var statusFlag = "";
    if (req.query.status == "A") {
      statusFlag = " E.status <> 'V' AND";
      delete req.query.status;
    } else if (req.query.status == "V") {
      statusFlag = " E.status='V' AND";
      delete req.query.status;
    }

    var where = (0, _utils.whereCondition)((0, _extend2.default)(getMydayWhere, req.query));

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      db.query("select  E.hims_f_patient_encounter_id,P.patient_code,P.full_name,E.patient_id ,V.appointment_patient,E.provider_id,E.`status`,E.nurse_examine,E.checked_in,\
         E.payment_type,E.episode_id,E.encounter_id,E.`source`,E.updated_date as encountered_date,E.visit_id ,sub_department_id from hims_f_patient_encounter E\
         INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
            inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id  where E.record_status='A' AND  V.record_status='A' AND " + statusFlag + "" + dateDiff + " AND " + where.condition + " order by E.updated_date desc", where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to update patient encounter status to WIP
var updatdePatEncntrStatus = function updatdePatEncntrStatus(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatdePatEncntrStatus");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      var currentEncounterNo = null;

      connection.query("SELECT encounter_id FROM algaeh_d_app_config where param_name='VISITEXPERIDAY';", function (error, result) {
        if (error) {
          (0, _utils.releaseDBConnection)(db, connection);
          next(error);
        }

        currentEncounterNo = result[0].encounter_id;
        (0, _logging.debugLog)("currentEncounterNo:", currentEncounterNo);

        if (currentEncounterNo > 0) {
          var nextEncounterNo = currentEncounterNo + 1;
          (0, _logging.debugLog)("nextEncounterNo:", nextEncounterNo);

          connection.query("update algaeh_d_app_config set encounter_id=?,updated_by=?,updated_date=? where param_name='VISITEXPERIDAY'", [nextEncounterNo, req.body.updated_by, new Date()], function (error, updateResult) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }

            if (updateResult != null) {
              connection.query("UPDATE  hims_f_patient_encounter SET  `status`='W',encounter_id=?,updated_by=?,updated_date=? WHERE\
         hims_f_patient_encounter_id=? AND  record_status='A';", [currentEncounterNo, req.body.updated_by, new Date(), req.body.patient_encounter_id], function (error, result) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = result;
                next();
              });
            }
          });
        }
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get patient profile
var getPatientProfile = function getPatientProfile(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("SELECT P.hims_d_patient_id,P.full_name,P.patient_code,P.vat_applicable,P.gender,P.date_of_birth,P.contact_number,N.nationality,\
        PV.age_in_years,PV.age_in_months,PV.age_in_days,PE.payment_type,PE.updated_date as Encounter_Date \
from ( (hims_f_patient P inner join hims_f_patient_encounter PE  on P.hims_d_patient_id=PE.patient_id)\
inner join hims_d_nationality N on N.hims_d_nationality_id=P.nationality_id ) inner join hims_f_patient_visit PV on \
PV.hims_f_patient_visit_id=PE.visit_id where P.hims_d_patient_id=? and PE.episode_id=?;", [inputData.patient_id, inputData.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to  get Patient Vitals
var getPatientVitalsOLD = function getPatientVitalsOLD(req, res, next) {
  var selectWhere = {
    patient_id: "ALL",
    visit_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    // let inputData = extend({}, req.query);

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select * from hims_f_patient_vitals where " + where.condition + " order by visit_date desc, visit_time desc;", where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to  get Patient Vitals
var getPatientVitals = function getPatientVitals(req, res, next) {
  var selectWhere = {
    patient_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    // let inputData = extend({}, req.query);

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("select count(hims_d_vitals_header_id) cnt from hims_d_vitals_header where record_status='A'", function (error, rec) {
        if (error) {
          next(error);
        }
        var _limit = (rec.length > 0 ? rec[0]["cnt"] : 0) * 5;
        connection.query("select hims_f_patient_vitals_id, patient_id, visit_id, visit_date, visit_time,\
case_type, vital_id,PH.vitals_name,vital_short_name,PH.uom, vital_value, vital_value_one, vital_value_two, formula_value from \
hims_f_patient_vitals PV,hims_d_vitals_header PH where PV.record_status='A' and \
PH.record_status='A' and PV.vital_id=PH.hims_d_vitals_header_id and " + where.condition + " group by visit_date , vital_id order by visit_date , visit_time desc LIMIT 0," + _limit + ";", where.values, function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to  getPatientAllergies
var getPatientAllergies = function getPatientAllergies(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, allergy_inactive,A.allergy_type,A.allergy_name from\
        hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?\
        and PA.allergy_id=A.hims_d_allergy_id order by hims_f_patient_allergy_id desc;", [inputData.patient_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to  getPatientDiet
var getPatientDiet = function getPatientDiet(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_f_patient_diet_id, patient_id, episode_id, diet_id, comments, till_date, DM.hims_d_diet_description,DM.diet_status,DM.hims_d_diet_note FROM\
        hims_f_patient_diet PD,hims_d_diet_master DM where patient_id=? and episode_id=? and DM.record_status='A'\
        and DM.hims_d_diet_master_id=PD.diet_id", [inputData.patient_id, inputData.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to  getPatientDiagnosis
var getPatientDiagnosis = function getPatientDiagnosis(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,icd.icd_code , icd.icd_description ,\
        diagnosis_type, final_daignosis from hims_f_patient_diagnosis pd,hims_d_icd icd where pd.record_status='A'\
        and patient_id=? and episode_id=? and pd.daignosis_id=icd.hims_d_icd_id;", [inputData.patient_id, inputData.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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
//created by irfan: to get chief complaints(HPI header) against (doctors)sub-department_id
var getChiefComplaints = function getChiefComplaints(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var sub_department_id = req.userIdentity.sub_department_id;
    (0, _logging.debugLog)("sub_dp_id:", sub_department_id);
    db.getConnection(function (error, connection) {
      connection.query("select hims_d_hpi_header_id,hpi_description,created_date from hims_d_hpi_header where sub_department_id=? and record_status='A';", [sub_department_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan:  to add new chief complaints (hpi header)
var addNewChiefComplaint = function addNewChiefComplaint(req, res, next) {
  (0, _logging.debugFunction)("addNewChiefComplaint");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    var header = req.headers["x-app-user-identity"];
    header = (0, _cryptography.decryption)(header);
    input.sub_department_id = header.sub_department_id;
    (0, _logging.debugLog)("sub_department_id:", header.sub_department_id);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      var insurtColumns = ["hpi_description", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_d_hpi_header(" + insurtColumns.join(",") + ",`sub_department_id`,created_date,update_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body,
        newFieldToInsert: [input.sub_department_id, new Date(), new Date()],
        req: req
      })], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        (0, _logging.debugLog)("Results are recorded...");
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

// created by : irfan to ADD  patient-chief complaint
var addPatientChiefComplaints = function addPatientChiefComplaints(req, res, next) {
  (0, _logging.debugFunction)("addPatientChiefComplaints");

  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    //let input = extend({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      }

      var insurtColumns = ["episode_id", "patient_id", "chief_complaint_id", "icd_code_id", "onset_date", "duration", "interval", "severity", "score", "pain", "comment", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_f_episode_chief_complaint(`" + insurtColumns.join("`,`") + "`,created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body,
        newFieldToInsert: [new Date(), new Date()],
        req: req
      })], function (error, Result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = Result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get patient ChiefComplaints
var getPatientChiefComplaints = function getPatientChiefComplaints(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hh.hims_d_hpi_header_id,hh.hpi_description as chief_complaint_name,PE.hims_f_patient_encounter_id,PE.patient_id,\
        max(PE.updated_date) as Encounter_Date , ecc.hims_f_episode_chief_complaint_id,ecc.episode_id,ecc.chief_complaint_id,\
        ecc.onset_date,ecc.`interval`,ecc.duration,ecc.severity,ecc.score,ecc.pain,ecc.`comment`,ecc.`chronic`,ecc.`complaint_inactive`,ecc.`complaint_inactive_date`\
        from ( (hims_f_episode_chief_complaint ecc inner join hims_d_hpi_header hh on hh.hims_d_hpi_header_id=ecc.chief_complaint_id )    inner join hims_f_patient_encounter PE on PE.episode_id=ecc.episode_id)\
        where ecc.record_status='A'and ecc.episode_id=? group by chief_complaint_id ", [inputData.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        (0, _logging.debugLog)("result", result);
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to DELETE patient ChiefComplaints
var deletePatientChiefComplaints = function deletePatientChiefComplaints(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    //let inputData = extend({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("update hims_f_episode_chief_complaint set record_status='I',updated_date=?,updated_by=? where `record_status`='A' and hims_f_episode_chief_complaint_id=?", [new Date(), req.body.updated_by, req.body.hims_f_episode_chief_complaint_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to add new allergy for a patient
var addPatientNewAllergy = function addPatientNewAllergy(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputparam = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_f_patient_allergy` (`patient_id`, `allergy_id`, onset, onset_date, severity, `comment`, allergy_inactive,created_date,`created_by`,updated_date,`updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?)", [inputparam.patient_id, inputparam.allergy_id, inputparam.onset, inputparam.onset_date, inputparam.severity, inputparam.comment, inputparam.allergy_inactive, new Date(), inputparam.created_by, new Date(), inputparam.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to get all allergies
var getAllAllergies = function getAllAllergies(req, res, next) {
  var selectWhere = {
    allergy_type: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));

    db.getConnection(function (error, connection) {
      connection.query("select hims_d_allergy_id,allergy_type,\
        allergy_name from hims_d_allergy where record_status='A' AND" + where.condition, where.values, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to get all allergies
var getPatientAllergy = function getPatientAllergy(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, allergy_inactive,A.allergy_type,A.allergy_name from\
        hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?\
        and PA.allergy_id=A.hims_d_allergy_id order by hims_f_patient_allergy_id desc; ", [inputData.patient_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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
//created by irfan: to add updatePatientChiefComplaints
var updatePatientChiefComplaints = function updatePatientChiefComplaints(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatePatientChiefComplaints");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        var inputParam = (0, _extend2.default)([], req.body.chief_complaints);

        var qry = "";

        for (var i = 0; i < req.body.chief_complaints.length; i++) {
          var _complaint_inactive_date = inputParam[i].complaint_inactive_date != null ? "'" + inputParam[i].complaint_inactive_date + "'" : null;
          qry += "UPDATE `hims_f_episode_chief_complaint` SET  episode_id='" + inputParam[i].episode_id + "', chief_complaint_id='" + inputParam[i].chief_complaint_id + "', onset_date='" + inputParam[i].onset_date + "', `interval`='" + inputParam[i].interval + "', duration='" + inputParam[i].duration + "', severity='" + inputParam[i].severity + "', score='" + inputParam[i].score + "', pain='" + inputParam[i].pain + "', chronic='" + inputParam[i].chronic + "', complaint_inactive='" + inputParam[i].complaint_inactive + "', complaint_inactive_date=" + _complaint_inactive_date + "\
            , comment='" + inputParam[i].comment + "', updated_date='" + new Date().toLocaleString() + "',updated_by=\
'" + req.body.updated_by + "' WHERE hims_f_episode_chief_complaint_id='" + inputParam[i].hims_f_episode_chief_complaint_id + "';";
        }

        connection.query(qry, function (error, updateResult) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _utils.releaseDBConnection)(db, connection);
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
var addPatientDiagnosis = function addPatientDiagnosis(req, res, next) {
  (0, _logging.debugLog)("addPatientDiagnosis");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      var insurtColumns = ["patient_id", "episode_id", "daignosis_id", "diagnosis_type", "final_daignosis", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_f_patient_diagnosis(" + insurtColumns.join(",") + ") VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body,
        req: req
      })], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to add patient encounter review
var addPatientROS = function addPatientROS(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputparam = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_f_encounter_review` (patient_id,episode_id,review_header_id,review_details_id,`comment`,created_date,created_by,updated_date,updated_by)\
        VALUE(?,?,?,?,?,?,?,?,?)", [inputparam.patient_id, inputparam.episode_id, inputparam.review_header_id, inputparam.review_details_id, inputparam.comment, new Date(), inputparam.created_by, new Date(), inputparam.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to update PatientDiagnosis
var updatePatientDiagnosis = function updatePatientDiagnosis(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatePatientDiagnosis");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.body);
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var queryBuilder = "update hims_f_patient_diagnosis set diagnosis_type=?,\
           final_daignosis=?,updated_date=?,updated_by=?, record_status=? where `record_status`='A' and hims_f_patient_diagnosis_id=?;";
        var inputs = [input.diagnosis_type, input.final_daignosis, new Date(), input.updated_by, input.record_status, input.hims_f_patient_diagnosis_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _utils.releaseDBConnection)(db, connection);
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
var getReviewOfSystem = function getReviewOfSystem(req, res, next) {
  var selectWhere = {
    hims_d_review_of_system_header_id: "ALL"
  };

  (0, _logging.debugFunction)("getReviewOfSystem");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var ROS_header = req.query.hims_d_review_of_system_header_id;
      var where = (0, _utils.whereCondition)((0, _extend2.default)(selectWhere, req.query));
      (0, _logging.debugLog)("ROS_header:", ROS_header);
      if (ROS_header == "null" || ROS_header === undefined) {
        connection.query("SELECT hims_d_review_of_system_header_id, description FROM hims_d_review_of_system_header where record_status='A'", function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      } else {
        connection.query("select RH.hims_d_review_of_system_header_id,RH.description as header_description,RD.hims_d_review_of_system_details_id,RD.description as detail_description from\
        hims_d_review_of_system_header RH,hims_d_review_of_system_details RD where\
         RH.hims_d_review_of_system_header_id=RD.review_of_system_heder_id and RD.record_status='A' and RH.record_status='A' and" + where.condition, where.values, function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

//created by:irfan,to get Patient ROS
var getPatientROS = function getPatientROS(req, res, next) {
  (0, _logging.debugFunction)("getPatientROS");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.query);

      connection.query("select hims_f_encounter_review_id, review_header_id,RH.description as  header_description,review_details_id ,\
        RD.description as  detail_description,comment,ER.patient_id,ER.episode_id from ((hims_f_encounter_review ER \
          inner join hims_d_review_of_system_details RD on ER.review_details_id=RD.hims_d_review_of_system_details_id)\
         inner join hims_d_review_of_system_header RH on ER.review_header_id=RH.hims_d_review_of_system_header_id)\
          where ER.record_status='A' and ER.patient_id=? and ER.episode_id=?", [input.patient_id, input.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to update Patient ROS
var updatePatientROS = function updatePatientROS(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatePatientROS");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.body);
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        var queryBuilder = " update hims_f_encounter_review set patient_id=?, episode_id=?,review_header_id=?,review_details_id=?,`comment`=?,\
          updated_date=?,updated_by=?, record_status=? where `record_status`='A' and hims_f_encounter_review_id=?;";
        var inputs = [input.patient_id, input.episode_id, input.review_header_id, input.review_details_id, input.comment, new Date(), input.updated_by, input.record_status, input.hims_f_encounter_review_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _utils.releaseDBConnection)(db, connection);
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
var addPatientVitalsOLD = function addPatientVitalsOLD(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputparam = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO `hims_f_patient_vitals` (`patient_id`, `visit_id`, `visit_date`, `visit_time`,\
         `case_type`, `height`, `weight`, `bmi`, `oxysat`, `temperature_from`, `temperature_farenhiet`, \
         `temperature_celsisus`,  `systolic`, `diastolic`,systolic_stand, diastolic_stand, systolic_supine, diastolic_supine, glucose_fbs, glucose_rbs,\
          glucose_pbs, head_circumference, bsa, heart_rate, respiratory_rate,`created_date`, `created_by`, `updated_date`, `updated_by`)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [inputparam.patient_id, inputparam.visit_id, inputparam.visit_date, inputparam.visit_time, inputparam.case_type, inputparam.height, inputparam.weight, inputparam.bmi, inputparam.oxysat, inputparam.temperature_from, inputparam.temperature_farenhiet, inputparam.temperature_celsisus, inputparam.systolic, inputparam.diastolic, inputparam.systolic_stand, inputparam.diastolic_stand, inputparam.systolic_supine, inputparam.diastolic_supine, inputparam.glucose_fbs, inputparam.glucose_rbs, inputparam.glucose_pbs, inputparam.head_circumference, inputparam.bsa, inputparam.heart_rate, inputparam.respiratory_rate, new Date(), inputparam.created_by, new Date(), inputparam.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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
//created by irfan: to add patient vitals
var addPatientVitals = function addPatientVitals(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputparam = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      // connection.query(
      //   "INSERT INTO `hims_f_patient_vitals` (patient_id, visit_id, visit_date, visit_time, case_type,\
      //     vital_id, vital_value, vital_value_one, vital_value_two, formula_value,`created_date`, `created_by`, `updated_date`, `updated_by`)\
      //   VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      //   [
      //     inputparam.patient_id,
      //     inputparam.visit_id,
      //     inputparam.visit_date,
      //     inputparam.visit_time,
      //     inputparam.case_type,
      //     inputparam.vital_id,
      //     inputparam.vital_value,
      //     inputparam.vital_value_one,
      //     inputparam.vital_value_two,
      //     inputparam.formula_value,
      //     new Date(),
      //     inputparam.created_by,
      //     new Date(),
      //     inputparam.updated_by
      //   ],
      //   (error, result) => {
      //     releaseDBConnection(db, connection);
      //     if (error) {
      //       next(error);
      //     }
      //     req.records = result;
      //     next();
      //   }
      // );

      var insurtColumns = ["patient_id", "visit_id", "visit_date", "visit_time", "case_type", "vital_id", "vital_value", "vital_value_one", "vital_value_two", "formula_value", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_f_patient_vitals(" + insurtColumns.join(",") + ",created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body,
        newFieldToInsert: [new Date(), new Date()],
        req: req
      })], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to add patient physical examination
var addPatientPhysicalExamination = function addPatientPhysicalExamination(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputparam = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.query("INSERT INTO hims_f_episode_examination (`patient_id`, `episode_id`, `exam_header_id`, \
        `exam_details_id`, `exam_subdetails_id`, `comments`, `created_date`, `created_by`, `updated_date`, `updated_by`) \
        VALUE(?,?,?,?,?,?,?,?,?,?)", [inputparam.patient_id, inputparam.episode_id, inputparam.exam_header_id, inputparam.exam_details_id, inputparam.exam_subdetails_id, inputparam.comments, new Date(), inputparam.created_by, new Date(), inputparam.updated_by], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to updatePatientAllergy
var updatePatientAllergy = function updatePatientAllergy(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatePatientAllergy");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.body);
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var queryBuilder = "update hims_f_patient_allergy set allergy_inactive=?,\
          `comment`=?,onset=?,severity=?,onset_date=?, updated_date=?,updated_by=?, record_status=? where `record_status`='A' and  hims_f_patient_allergy_id=?;";
        var inputs = [input.allergy_inactive, input.comment, input.onset, input.severity, input.onset_date, new Date(), input.updated_by, input.record_status, input.hims_f_patient_allergy_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _utils.releaseDBConnection)(db, connection);
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
var getPhysicalExamination = function getPhysicalExamination(req, res, next) {
  try {
    (0, _logging.debugFunction)("getPhysicalExamination");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.query);
    var input = (0, _extend2.default)({}, req.query);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      var queryBuilder = "";

      var input = req.query;

      (0, _logging.debugLog)("separtment:", req.userIdentity.sub_department_id);

      if (input.hims_d_physical_examination_details_id == "null" && input.hims_d_physical_examination_header_id == "null") {
        queryBuilder = "SELECT hims_d_physical_examination_header_id, examination_type, \
            description as header_description, sub_department_id, assesment_type, \
            mandatory as header_mandatory FROM hims_d_physical_examination_header where record_status='A'and examination_type='G';\
            SELECT hims_d_physical_examination_header_id, examination_type,description as header_description, sub_department_id, assesment_type,\
            mandatory as header_mandatory FROM hims_d_physical_examination_header where record_status='A'and examination_type='S' and sub_department_id='" + req.userIdentity.sub_department_id + "';";
        (0, _logging.debugLog)("only physical header");
      } else if (input.hims_d_physical_examination_header_id != "null" && input.hims_d_physical_examination_details_id == "null") {
        queryBuilder = "SELECT hims_d_physical_examination_details_id, physical_examination_header_id,\
          description as detail_description, mandatory as detail_mandatory FROM hims_d_physical_examination_details\
           where   record_status='A' and  physical_examination_header_id='" + input.hims_d_physical_examination_header_id + "';";
        (0, _logging.debugLog)("only detail ");
      } else if (input.hims_d_physical_examination_details_id != "null") {
        queryBuilder = "SELECT hims_d_physical_examination_subdetails_id, physical_examination_details_id, description as sub_detail_description,\
          mandatory as sub_detail_mandatory from hims_d_physical_examination_subdetails where record_status='A' and physical_examination_details_id='" + input.hims_d_physical_examination_details_id + "'";
        (0, _logging.debugLog)("only sub -detail ");
      }
      (0, _logging.debugLog)("Query Physical Exam", queryBuilder);
      connection.query(queryBuilder, function (error, result) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        (0, _utils.releaseDBConnection)(db, connection);
        (0, _logging.debugLog)("result", result[1]);

        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Noor: to get all physical examination
var getAllPhysicalExamination = function getAllPhysicalExamination(req, res, next) {
  try {
    (0, _logging.debugFunction)("getPhysicalExamination");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var _all = req.query.allDept == "G" ? "" : " and sub_department_id=?";
      var queryBuilder = "SELECT hims_d_physical_examination_header_id,\
      examination_type,h.description,assesment_type,\
      h.mandatory,hims_d_physical_examination_details_id,\
      d.description as dtl_description,\
      sd.description as sub_dtl_description,\
      sd.mandatory ,sd.hims_d_physical_examination_subdetails_id FROM hims_d_physical_examination_header h left outer join  hims_d_physical_examination_details d \
      on h.hims_d_physical_examination_header_id = d.physical_examination_header_id left outer join \
      hims_d_physical_examination_subdetails sd  on sd.physical_examination_details_id=d.hims_d_physical_examination_details_id \
       where \
      h.record_status='A' " + _all;
      connection.query(queryBuilder, [req.userIdentity.sub_department_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

var addDietAdvice = function addDietAdvice(req, res, next) {
  var dietadvice = {
    hims_f_patient_diet_id: null,
    patient_id: null,
    episode_id: null,
    diet_id: null,
    comments: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(dietadvice, req.body);
    connection.query("INSERT INTO `hims_f_patient_diet` (`patient_id`, `episode_id`,`diet_id`, `comments`, `till_date` \
      , `created_by` ,`created_date`,updated_date,updated_by) \
   VALUES ( ?, ?, ?, ?, ?, ?, ?,?,?)", [inputParam.patient_id, inputParam.episode_id, inputParam.diet_id, inputParam.comments, inputParam.till_date, inputParam.created_by, new Date(), new Date(), inputParam.updated_by], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var getEpisodeDietAdvice = function getEpisodeDietAdvice(req, res, next) {
  var Diet = {
    hims_f_patient_diet_id: "ALL",
    patient_id: "ALL",
    episode_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = (0, _utils.paging)(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(Diet, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT * FROM `hims_f_patient_diet` WHERE `record_status`='A' AND " + condition.condition + " " + pagePaging,
      values: condition.values
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

var addReferalDoctor = function addReferalDoctor(req, res, next) {
  var referraldoc = {
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
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(referraldoc, req.body);
    connection.query("INSERT INTO `hims_f_patient_referral` (`patient_id`, `episode_id`,`referral_type`, `sub_department_id`, \
      `doctor_id` ,`hospital_name`, `reason`, `created_by` ,`created_date`) \
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)", [inputParam.patient_id, inputParam.episode_id, inputParam.referral_type, inputParam.sub_department_id, inputParam.doctor_id, inputParam.hospital_name, inputParam.reason, inputParam.created_by, new Date()], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

var addFollowUp = function addFollowUp(req, res, next) {
  var followup = {
    hims_f_patient_followup_id: null,
    patient_id: null,
    doctor_id: null,
    followup_type: null,
    followup_date: null,
    reason: null,
    created_by: req.userIdentity.algaeh_d_app_user_id,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  if (req.db == null) {
    next(_httpStatus2.default.dataBaseNotInitilizedError());
  }
  var db = req.db;
  db.getConnection(function (error, connection) {
    if (error) {
      next(error);
    }
    var inputParam = (0, _extend2.default)(followup, req.body);
    connection.query("INSERT INTO `hims_f_patient_followup` (`patient_id`, `doctor_id`,`followup_type`, \
       `followup_date`, `reason`, `created_by` ,`created_date`) \
      VALUES ( ?, ?, ?, ?, ?, ?, ?)", [inputParam.patient_id, inputParam.doctor_id, inputParam.followup_type, inputParam.followup_date, inputParam.reason, inputParam.created_by, new Date()], function (error, result) {
      (0, _utils.releaseDBConnection)(db, connection);
      if (error) {
        next(error);
      }
      req.records = result;
      next();
    });
  });
};

//created by:irfan,to get Patient physical examination
var getPatientPhysicalExamination = function getPatientPhysicalExamination(req, res, next) {
  (0, _logging.debugFunction)("getPatientPhysicalExamination");
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.query);

      // select hims_f_episode_examination_id,  comments ,\
      //   hims_d_physical_examination_header_id, PH.examination_type, PH.description as header_description,PH.sub_department_id, PH.assesment_type, PH.mandatory as header_mandatory,\
      //               hims_d_physical_examination_details_id,PD.description as detail_description, PD.mandatory as detail_mandatory,\
      //               hims_d_physical_examination_subdetails_id,PS.description as subdetail_description, PS.mandatory as subdetail_mandatory \
      //               from hims_f_episode_examination EE,hims_d_physical_examination_header PH ,hims_d_physical_examination_details PD,hims_d_physical_examination_subdetails PS\
      //               where EE.exam_header_id=PH.hims_d_physical_examination_header_id and EE.exam_details_id=PD.hims_d_physical_examination_details_id and EE.exam_subdetails_id=PS.hims_d_physical_examination_subdetails_id and \
      //               EE.record_status='A' and EE.patient_id= ? and EE.episode_id=?
      connection.query("select hims_f_episode_examination_id, patient_id, episode_id, exam_header_id, exam_details_id,exam_subdetails_id, comments ,\
        hims_d_physical_examination_header_id, PH.examination_type, PH.description as header_description,PH.sub_department_id, PH.assesment_type, PH.mandatory as header_mandatory,\
                    hims_d_physical_examination_details_id,PD.description as detail_description, PD.mandatory as detail_mandatory,\
                    hims_d_physical_examination_subdetails_id,PS.description as subdetail_description, PS.mandatory as subdetail_mandatory\
                    from  ((hims_f_episode_examination EE  join hims_d_physical_examination_header PH on EE.exam_header_id=PH.hims_d_physical_examination_header_id) left join hims_d_physical_examination_details PD on\
                      EE.exam_details_id=PD.hims_d_physical_examination_details_id )\
                    left join hims_d_physical_examination_subdetails PS on EE.exam_subdetails_id=PS.hims_d_physical_examination_subdetails_id \
                   where  EE.record_status='A' and EE.patient_id= ? and EE.episode_id=?", [input.patient_id, input.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to update or delete Patient physical examination
var updatePatientPhysicalExam = function updatePatientPhysicalExam(req, res, next) {
  try {
    (0, _logging.debugFunction)("updatePatientPhysicalExam");
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    (0, _logging.debugLog)("Input Data", req.body);
    var input = (0, _extend2.default)({}, req.body);
    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        var queryBuilder = "UPDATE `hims_f_episode_examination` SET  `patient_id`=?,\
          `episode_id`=?, `exam_header_id`=?, `exam_details_id`=?, `exam_subdetails_id`=?, `comments`=?,\
          `updated_date`=?, `updated_by`=?, `record_status`=? WHERE `record_status`='A' and `hims_f_episode_examination_id`=?;";
        var inputs = [input.patient_id, input.episode_id, input.exam_header_id, input.exam_details_id, input.exam_subdetails_id, input.comments, new Date(), input.updated_by, input.record_status, input.hims_f_episode_examination_id];

        connection.query(queryBuilder, inputs, function (error, result) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }

          connection.commit(function (error) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            req.records = result;
            (0, _utils.releaseDBConnection)(db, connection);
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
var getVitalsHeaderMaster = function getVitalsHeaderMaster(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      connection.query("with vitals (hims_d_vitals_header_id,vitals_name, uom, general,display,mandatory,vital_short_name) as \
        ( \
        SELECT H.hims_d_vitals_header_id, vitals_name, uom, general,display,mandatory,vital_short_name FROM hims_d_vitals_header H \
         where general='Y' and H.record_status='A' \
          UNION ALL \
          select H.hims_d_vitals_header_id, vitals_name, uom, general,display,mandatory,vital_short_name from hims_d_vitals_header H,hims_m_department_vital_mapping M \
         where general='N' and H.record_status='A' and H.hims_d_vitals_header_id =M.vital_header_id and  M.department_id=?  \
        ) \
        SELECT hims_d_vitals_header_id,vitals_name, uom, general,display,mandatory,vital_short_name from vitals", [req.userIdentity.sub_department_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to add patient_historty
var addPatientHistory = function addPatientHistory(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }
      var input = (0, _extend2.default)({}, req.body);

      var insurtColumns = ["history_type", "remarks", "created_by", "updated_by"];

      connection.query("INSERT INTO hims_f_patient_history(" + insurtColumns.join(",") + ",patient_id,provider_id, created_date,updated_date) VALUES ?", [(0, _utils.jsonArrayToObject)({
        sampleInputObject: insurtColumns,
        arrayObj: req.body.patient_history,
        newFieldToInsert: [input.patient_id, input.provider_id, new Date(), new Date()],
        req: req
      })], function (error, results) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        (0, _logging.debugLog)("Results are recorded...");
        req.records = results;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getPatientHistory
var getPatientHistoryBACKUP = function getPatientHistoryBACKUP(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("select hims_f_patient_history_id,history_type, provider_id, patient_id, remarks from hims_f_patient_history\
        where record_status='A' and patient_id=?", [req.query.patient_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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
//created by irfan: to getPatientHistory
var getPatientHistory = function getPatientHistory(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("select hims_f_patient_history_id,history_type, provider_id,E.full_name as provider_name, patient_id, remarks from hims_f_patient_history PH,\
        hims_d_employee E where  PH.provider_id= E.hims_d_employee_id and PH.record_status='A' and E.record_status='A' and  \
         patient_id=? ", [req.query.patient_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        var social = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.history_type == "SOH";
        }).Select(function (s) {
          return {
            hims_f_patient_history_id: s.hims_f_patient_history_id,
            history_type: s.history_type,
            provider_id: s.provider_id,
            provider_name: s.provider_name,
            patient_id: s.patient_id,
            remarks: s.remarks
          };
        }).ToArray();
        (0, _logging.debugLog)("social:", social);

        var medical = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.history_type == "MEH";
        }).Select(function (s) {
          return {
            hims_f_patient_history_id: s.hims_f_patient_history_id,
            history_type: s.history_type,
            provider_id: s.provider_id,
            provider_name: s.provider_name,
            patient_id: s.patient_id,
            remarks: s.remarks
          };
        }).ToArray();
        (0, _logging.debugLog)("medical:", medical);

        var surgical = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.history_type == "SGH";
        }).Select(function (s) {
          return {
            hims_f_patient_history_id: s.hims_f_patient_history_id,
            history_type: s.history_type,
            provider_id: s.provider_id,
            provider_name: s.provider_name,
            patient_id: s.patient_id,
            remarks: s.remarks
          };
        }).ToArray();
        (0, _logging.debugLog)("surgical:", surgical);

        var family = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.history_type == "FMH";
        }).Select(function (s) {
          return {
            hims_f_patient_history_id: s.hims_f_patient_history_id,
            history_type: s.history_type,
            provider_id: s.provider_id,
            provider_name: s.provider_name,
            patient_id: s.patient_id,
            remarks: s.remarks
          };
        }).ToArray();
        (0, _logging.debugLog)("family:", family);

        var birth = new _nodeLinq.LINQ(result).Where(function (w) {
          return w.history_type == "BRH";
        }).Select(function (s) {
          return {
            hims_f_patient_history_id: s.hims_f_patient_history_id,
            history_type: s.history_type,
            provider_id: s.provider_id,
            provider_name: s.provider_name,
            patient_id: s.patient_id,
            remarks: s.remarks
          };
        }).ToArray();
        (0, _logging.debugLog)("birth:", birth);

        req.records = { social: social, medical: medical, surgical: surgical, family: family, birth: birth };
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

var getFollowUp = function getFollowUp(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var inputData = (0, _extend2.default)({}, req.query);

    // let followup_date = "date(inputData.date_of_recall)"";
    var strQuery = "SELECT p.patient_code,p.full_name, p.registration_date,p.gender,p.date_of_birth,p.contact_number \
      FROM hims_f_patient_followup, hims_f_patient p where hims_f_patient_followup.patient_id = p.hims_d_patient_id \
      and hims_f_patient_followup.doctor_id=?";

    if (inputData.date_of_recall != undefined || inputData.date_of_recall != null) {
      var followup_date = "date(followup_date)= date('" + inputData.date_of_recall + "')";

      strQuery = strQuery + " and " + followup_date;
    }

    (0, _logging.debugLog)("strQuery: ", strQuery);
    db.getConnection(function (error, connection) {
      connection.query(strQuery, [inputData.doctor_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

//created by irfan: to get
var getPatientEpisodeSummary = function getPatientEpisodeSummary(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    db.getConnection(function (error, connection) {
      connection.query("SELECT hims_f_episode_chief_complaint_id, ECC.episode_id, ECC.patient_id, chief_complaint_id, \
        onset_date, `interval`, duration, severity, score, pain, chronic, complaint_inactive ,\
        hpi_description as chief_complaint,full_name as patient_name,arabic_name,gender,age\
        ,hims_f_patient_visit_id,visit_date ,sub_department_name from\
        hims_f_episode_chief_complaint  ECC\
        inner join hims_d_hpi_header HH on ECC.chief_complaint_id =HH.hims_d_hpi_header_id \
        inner join hims_f_patient P on ECC.patient_id=P.hims_d_patient_id \
        inner join hims_f_patient_visit V on ECC.episode_id=V.episode_id\
        inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
        where ECC.episode_id=?    group by  ECC.chief_complaint_id ", [req.query.episode_id], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
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

module.exports = {
  physicalExaminationHeader: physicalExaminationHeader,
  physicalExaminationDetails: physicalExaminationDetails,
  physicalExaminationSubDetails: physicalExaminationSubDetails,
  getPhysicalExamination: getPhysicalExamination,
  addOrder: addOrder,
  addSample: addSample,
  addAnalytes: addAnalytes,
  addAllergy: addAllergy,
  getAllergyDetails: getAllergyDetails,
  addChronicalConditions: addChronicalConditions,
  getChronicalConditions: getChronicalConditions,
  addEncounterReview: addEncounterReview,
  getEncounterReview: getEncounterReview,
  getMyDay: getMyDay,
  updatdePatEncntrStatus: updatdePatEncntrStatus,
  getPatientProfile: getPatientProfile,
  getChiefComplaints: getChiefComplaints,
  getFollowUp: getFollowUp,

  addPatientChiefComplaints: addPatientChiefComplaints,
  addNewChiefComplaint: addNewChiefComplaint,
  getPatientChiefComplaints: getPatientChiefComplaints,
  deletePatientChiefComplaints: deletePatientChiefComplaints,
  addPatientNewAllergy: addPatientNewAllergy,
  getAllAllergies: getAllAllergies,
  getPatientAllergy: getPatientAllergy,
  updatePatientChiefComplaints: updatePatientChiefComplaints,
  addPatientDiagnosis: addPatientDiagnosis,
  addPatientROS: addPatientROS,
  getPatientROS: getPatientROS,
  updatePatientROS: updatePatientROS,
  addReviewOfSysHeader: addReviewOfSysHeader,
  addReviewOfSysDetails: addReviewOfSysDetails,
  getReviewOfSystem: getReviewOfSystem,
  updatePatientDiagnosis: updatePatientDiagnosis,
  addPatientVitals: addPatientVitals,
  addPatientPhysicalExamination: addPatientPhysicalExamination,
  updatePatientAllergy: updatePatientAllergy,
  addDietAdvice: addDietAdvice,
  getEpisodeDietAdvice: getEpisodeDietAdvice,
  addReferalDoctor: addReferalDoctor,
  addFollowUp: addFollowUp,
  getPatientPhysicalExamination: getPatientPhysicalExamination,
  updatePatientPhysicalExam: updatePatientPhysicalExam,
  getPatientVitals: getPatientVitals,
  getPatientAllergies: getPatientAllergies,
  getPatientDiagnosis: getPatientDiagnosis,
  getPatientDiet: getPatientDiet,
  getAllPhysicalExamination: getAllPhysicalExamination,
  getVitalsHeaderMaster: getVitalsHeaderMaster,
  addPatientHistory: addPatientHistory,
  getPatientHistory: getPatientHistory,
  getPatientEpisodeSummary: getPatientEpisodeSummary
};
//# sourceMappingURL=doctorsWorkBench.js.map