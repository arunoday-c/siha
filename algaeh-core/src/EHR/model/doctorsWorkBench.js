"use strict";
import extend from "extend";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";
import moment from "moment";
import logUtils from "../../utils/logging";

import cryptoUtils from "../../utils/cryptography";
import mysql from "mysql";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");
import _ from "lodash";
import { resolveTxt } from "dns";

const { decryption } = cryptoUtils;
const { debugFunction, debugLog } = logUtils;
const {
  selectStatement,
  paging,
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
} = utils;

//created by irfan: to add  physical_examination_header
let physicalExaminationHeader = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  // let physicalExaminationHeaderModel = {
  //   hims_d_physical_examination_header: null,
  //   examination_type: null,
  //   description: null,
  //   sub_department_id: null,
  //   assesment_type: null,
  //   mandatory: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  let input = req.body;

  // debugFunction("physicalExaminationHeader");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(physicalExaminationHeaderModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_physical_examination_header(\
            examination_type,description,sub_department_id,assesment_type,\
            mandatory,created_by,updated_by)values(\
            ?,?,?,?,?,?,?)",
        values: [
          input.examination_type,
          input.description,
          input.sub_department_id,
          input.assesment_type,
          input.mandatory,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
      })
      //         (error, results) => {
      //           releaseDBConnection(db, connection);
      //           if (error) {
      //             next(error);
      //           }
      //           debugLog("Results are recorded...");
      //           req.records = results;
      //           next();
      //         }
      //       );
      //     });
      //   } catch (e) {
      //     next(e);
      //   }
      // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
let physicalExaminationDetails = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // let physicalExaminationDetailsModel = {
  //   hims_d_physical_examination_details_id: null,
  //   physical_examination_header_id: null,
  //   description: null,
  //   mandatory: null,
  //   created_by: null,
  //   updated_by: null,
  // };

  debugFunction("physicalExaminationDetails");
  let input = req.body;
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(physicalExaminationDetailsModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_physical_examination_details(\
            physical_examination_header_id,description,mandatory,created_by,updated_by)values(\
              ?,?,?,?,?)",
        values: [
          input.physical_examination_header_id,
          input.description,
          input.mandatory,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
      })
      //         (error, results) => {
      //           releaseDBConnection(db, connection);
      //           if (error) {
      //             next(error);
      //           }
      //           debugLog("Results are recorded...");
      //           req.records = results;
      //           next();
      //         }
      //       );
      //     });
      //   } catch (e) {
      //     next(e);
      //   }
      // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add  physical_examination_subdetails
let physicalExaminationSubDetails = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // let physicalExaminationSubDetailsModel = {
  //   hims_d_physical_examination_subdetails_id: null,
  //   physical_examination_details_id: null,
  //   description: null,
  //   mandatory: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  let input = req.body;

  debugFunction("physicalExaminationSubDetails");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(physicalExaminationSubDetailsModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_physical_examination_subdetails(\
            physical_examination_details_id,\
            description,mandatory,created_by,updated_by)values(\
                ?,?,?,?,?)",
        values: [
          input.physical_examination_details_id,
          input.description,
          input.mandatory,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:  to add order
let addOrder = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // let hims_f_lab_orderModel = {
  //   hims_f_lab_order_id: null,
  //   patient_id: null,
  //   visit_id: null,
  //   provider_id: null,
  //   service_id: null,
  //   status: null,
  //   billed: null,
  //   cancelled: null,
  //   ordered_date: null,
  //   test_type: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  let input = req.body;

  // debugFunction("addOrder");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(hims_f_lab_orderModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_f_lab_order(\
          patient_id,visit_id,provider_id,service_id,status,billed,\
          cancelled,ordered_date,test_type,created_by,updated_by,hospital_id)values(\
              ?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
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
          req.userIdentity.hospital_id,
        ],
        printQuery: true,
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add sample
let addSample = (req, res, next) => {
  // let hims_d_lab_sampleModel = {
  //   hims_d_lab_sample_id: null,
  //   order_id: null,
  //   sample_id: null,
  //   status: null,
  //   collected: null,
  //   collected_date: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  const _mysql = new algaehMysql({ path: keyPath });

  // debugFunction("addSample");
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let input = extend(hims_d_lab_sampleModel, req.body);
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       releaseDBConnection(db, connection);
  //       next(error);
  //     }
  let input = req.body;
  //     connection.query(
  try {
    _mysql
      .executeQuery({
        query:
          "insert into hims_f_lab_sample(\
          order_id,sample_id,status,collected,\
          collected_date,created_by,updated_by,hospital_id)values(\
              ?,?,?,?,?,?,?,?)",
        value: [
          input.order_id,
          input.sample_id,
          input.status,
          input.collected,
          input.collected_date,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add Analytes
let addAnalytes = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  // let AnalytesModel = {
  //   hims_d_lab_analytes_id: null,
  //   sample_id: null,
  //   analyte_id: null,
  //   result: null,
  //   text: null,
  //   status: null,
  //   created_by: null,
  //   updated_by: null,
  // };

  // debugFunction("addAnalytes");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(AnalytesModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_lab_analytes(\
          sample_id,analyte_id,result,text,status,created_by,updated_by)values(\
              ?,?,?,?,?,?,?)",
        values: [
          input.sample_id,
          input.analyte_id,
          input.result,
          input.text,
          input.status,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add ReviewOfSysHeader
let addReviewOfSysHeader = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // let reviewOfSysHeaderModel = {
  //   description: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  let input = req.body;

  // debugFunction("addReviewOfSysHeader");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(reviewOfSysHeaderModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_review_of_system_header(\
          description,created_by,updated_by)values(\
              ?,?,?)",
        values: [
          input.description,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add ReviewOfSysDetails
let addReviewOfSysDetails = (req, res, next) => {
  // let reviewOfSysDetailsModel = {
  //   review_of_system_heder_id: null,
  //   description: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  // debugFunction("addReviewOfSysDetails");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(reviewOfSysDetailsModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_review_of_system_details(\
          review_of_system_heder_id,description,created_by,updated_by)values(\
              ?,?,?,?)",
        values: [
          input.review_of_system_heder_id,
          input.description,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:  to add allergic details
let addAllergy = (req, res, next) => {
  // let AllergyModel = {
  //   hims_d_allergy_id: null,
  //   allergy_type: null,
  //   allergy_name: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  // debugFunction("addAllergy");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(AllergyModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_allergy(\
          allergy_type,allergy_name,created_by,updated_by)values(\
              ?,?,?,?)",
        values: [
          input.allergy_type,
          input.allergy_name,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:  to get allergic details
let getAllergyDetails = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // debugFunction("getAllergyDetails");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;

    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_d_allergy",
        //          (error, results) => {
        //         releaseDBConnection(db, connection);
        //         if (error) {
        //           next(error);
        //         }
        //         debugLog("Results fetched");
        //         req.records = results;
        //         next();
        //       });
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:  to add chronical conditions
let addChronicalConditions = (req, res, next) => {
  // let ChronicalConditionsModel = {
  //   hims_d_chronic_conditions_id: null,
  //   name: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  // debugFunction("addChronicalConditions");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // let input = extend(ChronicalConditionsModel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_d_chronic_conditions(\
          name,created_by,updated_by)values(\
              ?,?,?)",
        values: [
          input.name,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
        ],

        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan:  to get chronical conditions
let getChronicalConditions = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // debugFunction("getChronicalConditions");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;

    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_d_chronic_conditions;",
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results fetched");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:  to add encounter review
let addEncounterReview = (req, res, next) => {
  // let EncounterReviewMOdel = {
  //   hims_f_encounter_review_id: null,
  //   encounter_id: null,
  //   review_header_id: null,
  //   review_details_id: null,
  //   created_by: null,
  //   updated_by: null,
  // };
  const _mysql = new algaehMysql({ path: keyPath });
  // let input = req.body;

  // debugFunction("addEncounterReview");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    let input = extend(EncounterReviewMOdel, req.body);
    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "insert into hims_f_encounter_review(\
          encounter_id,review_header_id,review_details_id,created_by,updated_by,hospital_id)values(\
              ?,?,?,?,?,?)",
        values: [
          input.encounter_id,
          input.review_header_id,
          input.review_details_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results are recorded...");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan:  to getEncounterReview
let getEncounterReview = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  // debugFunction("getEncounterReview");
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;

    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }
    //   let encounter_id = req.query.encounter_id;
    //   connection.query(
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_f_encounter_review where encounter_id=?",
        values: [req.query.encounter_id],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           debugLog("Results fetched");
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan: get MYDAY in doctors work bench , to show list of todays patients
let getMyDay = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { employee_id, sub_department_id, from_app } = req.query;
  let requestValues = [
    req.userIdentity.employee_id,
    req.userIdentity.sub_department_id,
  ];
  if (from_app === "mobileapp") {
    requestValues = [employee_id, sub_department_id];
  }

  try {
    let _query = "";
    _query += _mysql.mysqlQueryFormat(
      " provider_id=? and sub_department_id=? and ",
      requestValues
    );
    if (
      req.query.fromDate != null &&
      req.query.fromDate != "" &&
      req.query.fromDate != undefined &&
      req.query.toDate != null &&
      req.query.fromDate != "" &&
      req.query.fromDate != undefined
    )
      _query += _mysql.mysqlQueryFormat(
        "date(E.created_date) BETWEEN date(?) and date(?)",
        [
          moment(new Date(req.query.fromDate)).format(
            keyPath.default.dbFormat.date
          ),
          moment(new Date(req.query.toDate)).format(
            keyPath.default.dbFormat.date
          ),
        ]
      );
    else if (
      req.query.toDate != null &&
      req.query.toDate != "" &&
      req.query.toDate != undefined
    ) {
      _query += _mysql.mysqlQueryFormat("date(E.created_date) = date(?)", [
        moment(new Date(req.query.toDate)).format(
          keyPath.default.dbFormat.date
        ),
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
            where E.cancelled='N' and E.record_status='A' AND  V.record_status='A' and V.hospital_id=? AND " +
          _query,
        values: [req.userIdentity.hospital_id],
        printQuery: true,
      })
      .then((result) => {
        let final_result = null;
        if (result.length == 0) {
          final_result = {
            provider_id: req.userIdentity.employee_id,
            sub_department_id: req.userIdentity.sub_department_id,
          };
        } else {
          final_result = result;
        }
        _mysql.releaseConnection();
        req.records = final_result;
        next();
      })
      .catch((error) => {
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
    const _mysql = new algaehMysql({ path: keyPath });

    _mysql
      .executeQueryWithTransaction({
        query: `SELECT encounter_id FROM algaeh_d_app_config where param_name='VISITEXPERIDAY' for update; `,
        printQuery: true,
      })
      .then((result) => {
        let currentEncounterNo = result[0].encounter_id;
        let nextEncounterNo = parseInt(currentEncounterNo) + 1;
        _mysql
          .executeQueryWithTransaction({
            query: `update algaeh_d_app_config set encounter_id=?,updated_by=?,updated_date=? where param_name='VISITEXPERIDAY';
            UPDATE  hims_f_patient_encounter SET checked_in = 'Y', status='W', encounter_id=?, updated_by=?, updated_date=? 
            WHERE hims_f_patient_encounter_id=? AND  record_status='A'; `,
            values: [
              nextEncounterNo,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              currentEncounterNo,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.body.patient_encounter_id,
            ],
            printQuery: true,
          })
          .then((resultd) => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = { encounter_id: currentEncounterNo };
              next();
            });
          })
          .catch((e) => {
            mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch((e) => {
        mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to get patient profile
let getPatientProfile = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    let inputData = extend({}, req.query);

    // db.getConnection((error, connection) => {
    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "SELECT P.hims_d_patient_id,P.full_name,P.patient_code,P.vat_applicable,P.gender,P.date_of_birth,P.contact_number,N.nationality,\
        PV.age_in_years,PV.age_in_months,PV.age_in_days, PV.sub_department_id, PE.payment_type,PE.updated_date as Encounter_Date \
        from ( (hims_f_patient P inner join hims_f_patient_encounter PE  on P.hims_d_patient_id=PE.patient_id)\
        inner join hims_d_nationality N on N.hims_d_nationality_id=P.nationality_id ) inner join hims_f_patient_visit PV on \
        PV.hims_f_patient_visit_id=PE.visit_id  where P.hims_d_patient_id=? and PE.episode_id=?;",
        values: [inputData.patient_id, inputData.episode_id],
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
    _mysql.releaseConnection();
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
          "select count(hims_d_vitals_header_id) cnt from hims_d_vitals_header where record_status='A'",
        printQuery: true,
      })
      .then((rec) => {
        const _limit = (rec.length > 0 ? rec[0]["cnt"] : 0) * 5;

        let strQuery = "";
        if (inputs.visit_id > 0) {
          strQuery += " and visit_id= " + inputs.visit_id;
        }
        if (inputs.patient_id > 0) {
          strQuery += " and patient_id= " + inputs.patient_id;
        }
        _mysql
          .executeQuery({
            query: `select hims_f_patient_vitals_id, patient_id, visit_id, visit_date, visit_time, PV.updated_by, PV.updated_Date,\
          case_type, vital_id, PH.vitals_name, vital_short_name, PH.uom, vital_value, vital_value_one, vital_value_two, \
          formula_value, PH.sequence_order, PH.display, AU.user_display_name from hims_f_patient_vitals PV \
          inner join hims_d_vitals_header PH on PV.vital_id=PH.hims_d_vitals_header_id  \
          left join algaeh_d_app_user AU on AU.algaeh_d_app_user_id=PV.updated_by  \
          where PV.record_status='A' and PH.record_status='A' ${strQuery}
           group by visit_date , vital_id order by hims_f_patient_vitals_id  desc LIMIT 0,${_limit} ;`,
            printQuery: true,
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
      })
      .catch((error) => {
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
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let inputData = req.query;

    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, \
          allergy_inactive,A.allergy_type,A.allergy_name from hims_f_patient_allergy PA, hims_d_allergy A \
          where PA.record_status='A' and patient_id=? and PA.allergy_id=A.hims_d_allergy_id \
          order by hims_f_patient_allergy_id desc;",
        values: [inputData.patient_id],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }

  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let inputData = extend({}, req.query);

  //   db.getConnection((error, connection) => {
  //     connection.query(
  //       "select hims_f_patient_allergy_id,patient_id,allergy_id, onset, onset_date, severity, comment, allergy_inactive,A.allergy_type,A.allergy_name from\
  //       hims_f_patient_allergy PA,hims_d_allergy A where PA.record_status='A' and patient_id=?\
  //       and PA.allergy_id=A.hims_d_allergy_id order by hims_f_patient_allergy_id desc;",
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
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan: to  getPatientDiet
let getPatientDiet = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;

    let inputData = extend({}, req.query);

    // db.getConnection((error, connection) => {
    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_patient_diet_id, patient_id, episode_id, diet_id, comments, till_date, DM.hims_d_diet_description,DM.diet_status,DM.hims_d_diet_note FROM\
        hims_f_patient_diet PD,hims_d_diet_master DM where patient_id=? and episode_id=? and DM.record_status='A'\
        and DM.hims_d_diet_master_id=PD.diet_id",
        values: [inputData.patient_id, inputData.episode_id],
        //         (error, result) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = result;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to  getPatientDiagnosis
let getPatientDiagnosis = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    let inputData = extend({}, req.query);

    // db.getConnection((error, connection) => {
    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id,icd.icd_code , icd.icd_description ,\
        diagnosis_type, final_daignosis from hims_f_patient_diagnosis pd,hims_d_icd icd where pd.record_status='A'\
        and patient_id=? and episode_id=? and pd.daignosis_id=icd.hims_d_icd_id;",
        values: [inputData.patient_id, inputData.episode_id],
        //         (error, result) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = result;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};
//created by irfan: to get chief complaints(HPI header) against (doctors)sub-department_id
let getChiefComplaints = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query:
          "select hims_d_hpi_header_id,hpi_description,created_date from hims_d_hpi_header where \
          sub_department_id=? and record_status='A';",
        values: [req.userIdentity.sub_department_id],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
  // try {
  //   const _mysql = new algaehMysql({ path: keyPath });
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //   let sub_department_id = req.userIdentity.sub_department_id;
  //   debugLog("sub_dp_id:", sub_department_id);
  //   db.getConnection((error, connection) => {
  //     connection.query(
  //       "select hims_d_hpi_header_id,hpi_description,created_date from hims_d_hpi_header where sub_department_id=? and record_status='A';",
  //       [sub_department_id],
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
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:  to add new chief complaints (hpi header)
//created by irfan:  to add new chief complaints (hpi header)
let addNewChiefComplaint = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.body;

    let header = req.headers["x-app-user-identity"];
    header = decryption(header);
    let sub_department_id = header.sub_department_id;

    const insurtColumns = ["hpi_description", "created_by", "updated_by"];

    _mysql
      .executeQuery({
        query: "INSERT INTO hims_d_hpi_header(??) VALUES ?",
        values: input,
        includeValues: insurtColumns,
        printQuery: false,
        bulkInsertOrUpdate: true,
        extraValues: {
          sub_department_id: sub_department_id,
          created_date: new Date(),
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
        },
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
    _mysql.releaseConnection();
    next(e);
  }
};
// created by : irfan to ADD  patient-chief complaint
let addPatientChiefComplaints = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
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
    ];

    _mysql
      .executeQuery({
        query: "INSERT INTO hims_f_episode_chief_complaint(??) VALUES ?",

        values: req.body,
        includeValues: insurtColumns,
        printQuery: false,
        bulkInsertOrUpdate: true,
        extraValues: {
          created_date: new Date(),
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          hospital_id: req.userIdentity.hospital_id,
        },
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
    _mysql.releaseConnection();
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
        printQuery: true,
      })
      .then((result) => {
        // utilities.logger().log("result: ", result);
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
        printQuery: true,
      })
      .then((result) => {
        // utilities.logger().log("result: ", result);
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

//created by irfan: to DELETE patient ChiefComplaints
let deletePatientChiefComplaints = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    //let inputData = extend({}, req.query);

    // db.getConnection((error, connection) => {
    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "update hims_f_episode_chief_complaint set record_status='I',updated_date=?,updated_by=? where `record_status`='A' and hims_f_episode_chief_complaint_id=?",
        values: [
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.body.hims_f_episode_chief_complaint_id,
        ],
        //         (error, result) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = result;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add new allergy for a patient
let addPatientNewAllergy = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    let inputparam = extend({}, req.body);

    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_patient_allergy` (`patient_id`, `allergy_id`, onset, onset_date, severity, `comment`,\
         allergy_inactive,created_date,`created_by`,updated_date,`updated_by`,hospital_id)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
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
          req.userIdentity.hospital_id,
        ],
        //         (error, result) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = result;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to get all allergies
let getAllAllergies = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let strQuery = "";
    if (req.query.allergy_type !== null) {
      strQuery = ` AND allergy_type = '${req.query.allergy_type}'`;
    }
    _mysql
      .executeQuery({
        query:
          "select hims_d_allergy_id, allergy_type, allergy_name \
          from hims_d_allergy where record_status='A';",
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }

  // let selectWhere = {
  //   allergy_type: "ALL"
  // };
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;

  //   let where = whereCondition(extend(selectWhere, req.query));
  //   console.log("req.query", req.query)
  //   console.log("where", where)
  //   db.getConnection((error, connection) => {
  //     connection.query(
  //       "select hims_d_allergy_id,allergy_type,\
  //       allergy_name from hims_d_allergy where record_status='A' AND" +
  //       where.condition,
  //       where.values,
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
  // } catch (e) {
  //   next(e);
  // }
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
        values: [inputData.patient_id],
      })
      .then((result) => {
        req.records = result;
        next();
      })
      .catch((error) => {
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
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputParam = req.body.chief_complaints;
    let chief_len = inputParam.length;
    let qry = "";

    for (let i = 0; i < chief_len; i++) {
      const _complaint_inactive_date =
        inputParam[i].complaint_inactive_date != null
          ? inputParam[i].complaint_inactive_date
          : null;
      qry += _mysql.mysqlQueryFormat(
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
          inputParam[i].hims_f_episode_chief_complaint_id,
        ]
      );
    }

    _mysql
      .executeQueryWithTransaction({
        query: qry,
        printQuery: true,
      })
      .then((result) => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add patient_diagnosis
let addPatientDiagnosis = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    const insurtColumns = [
      "patient_id",
      "episode_id",
      "daignosis_id",
      "diagnosis_type",
      "final_daignosis",
    ];

    _mysql
      .executeQuery({
        query: "INSERT INTO hims_f_patient_diagnosis(??) VALUES ?",
        values: req.body,
        includeValues: insurtColumns,
        printQuery: false,
        bulkInsertOrUpdate: true,
        extraValues: {
          created_date: new Date(),
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          hospital_id: req.userIdentity.hospital_id,
        },
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add patient encounter review
let addPatientROS = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    let inputparam = extend({}, req.body);

    // db.getConnection((error, connection) => {
    //   if (error) {
    //     next(error);
    //   }

    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_encounter_review` (patient_id,episode_id,review_header_id,\
          review_details_id,`comment`,created_date,created_by,updated_date,updated_by,hospital_id)\
        VALUE(?,?,?,?,?,?,?,?,?,?)",
        values: [
          inputparam.patient_id,
          inputparam.episode_id,
          inputparam.review_header_id,
          inputparam.review_details_id,
          inputparam.comment,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
        //         (error, result) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = result;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to update PatientDiagnosis
let updatePatientDiagnosis = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  try {
    _mysql
      .executeQuery({
        query:
          "update hims_f_patient_diagnosis set diagnosis_type=?, final_daignosis=?,\
        updated_date=?,updated_by=?, record_status=? where `record_status`='A' and hims_f_patient_diagnosis_id=?;",
        values: [
          input.diagnosis_type,
          input.final_daignosis,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.record_status,
          input.hims_f_patient_diagnosis_id,
        ],
        printQuery: true,
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

//created by:irfan,to get ROS header& details

let getReviewOfSystem = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let strQry = "select 1";

    if (req.query.hims_d_review_of_system_header_id > 0) {
      strQry =
        "SELECT hims_d_review_of_system_header_id, description FROM hims_d_review_of_system_header\
       where record_status='A' and hims_d_review_of_system_header_id=" +
        req.query.hims_d_review_of_system_header_id;
    } else {
      strQry =
        "select RH.hims_d_review_of_system_header_id,RH.description as header_description,RD.hims_d_review_of_system_details_id,RD.description as detail_description from\
      hims_d_review_of_system_header RH,hims_d_review_of_system_details RD where\
       RH.hims_d_review_of_system_header_id=RD.review_of_system_heder_id and RD.record_status='A' and RH.record_status='A'";
    }

    _mysql
      .executeQuery({
        query: strQry,
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by:irfan,to get Patient ROS
let getPatientROS = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.query;

  try {
    _mysql
      .executeQuery({
        query:
          "select hims_f_encounter_review_id, review_header_id,RH.description as  header_description,review_details_id ,\
        RD.description as  detail_description,comment,ER.patient_id,ER.episode_id from ((hims_f_encounter_review ER \
          inner join hims_d_review_of_system_details RD on ER.review_details_id=RD.hims_d_review_of_system_details_id)\
         inner join hims_d_review_of_system_header RH on ER.review_header_id=RH.hims_d_review_of_system_header_id)\
          where ER.record_status='A' and ER.patient_id=? and ER.episode_id=?;",
        values: [input.patient_id, input.episode_id],

        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to update Patient ROS
let updatePatientROS = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  try {
    _mysql
      .executeQuery({
        query:
          " update hims_f_encounter_review set patient_id=?, episode_id=?,review_header_id=?,review_details_id=?,`comment`=?,\
        updated_date=?,updated_by=?, record_status=? where `record_status`='A' and hims_f_encounter_review_id=?;",
        values: [
          input.patient_id,
          input.episode_id,
          input.review_header_id,
          input.review_details_id,
          input.comment,
          req.userIdentity.algaeh_d_app_user_id,
          input.record_status,
          input.hims_f_encounter_review_id,
        ],

        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add patient vitals
let addPatientVitals = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

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
  ];

  try {
    _mysql
      .executeQuery({
        query: "INSERT INTO hims_f_patient_vitals(??) VALUES ?",
        values: input,
        includeValues: insurtColumns,
        printQuery: false,
        bulkInsertOrUpdate: true,
        extraValues: {
          hospital_id: req.userIdentity.hospital_id,
          created_date: new Date(),
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
        },
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add patient physical examination
let addPatientPhysicalExamination = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputparam = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_f_episode_examination (`patient_id`, `episode_id`, `exam_header_id`, \
        `exam_details_id`, `exam_subdetails_id`, `comments`, `created_date`, `created_by`, `updated_date`, `updated_by`,hospital_id) \
        VALUE(?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          inputparam.patient_id,
          inputparam.episode_id,
          inputparam.exam_header_id,
          inputparam.exam_details_id,
          inputparam.exam_subdetails_id,
          inputparam.comments,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to updatePatientAllergy
let updatePatientAllergy = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  try {
    _mysql
      .executeQuery({
        query:
          "update hims_f_patient_allergy set allergy_inactive=?,\
        `comment`=?,onset=?,severity=?,onset_date=?, updated_date=?,updated_by=?, \
        record_status=? where `record_status`='A' and  hims_f_patient_allergy_id=?;",
        values: [
          input.allergy_inactive,
          input.comment,
          input.onset,
          input.severity,
          input.onset_date,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.record_status,
          input.hims_f_patient_allergy_id,
        ],

        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to get physical examination
let getPhysicalExamination = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.query;

    let queryBuilder = "";

    if (
      !input.hims_d_physical_examination_details_id > 0 &&
      !input.hims_d_physical_examination_header_id > 0
    ) {
      queryBuilder =
        "SELECT hims_d_physical_examination_header_id, examination_type, \
          description as header_description, sub_department_id, assesment_type, \
          mandatory as header_mandatory FROM hims_d_physical_examination_header where record_status='A'and examination_type='G';\
          SELECT hims_d_physical_examination_header_id, examination_type,description as header_description, sub_department_id, assesment_type,\
          mandatory as header_mandatory FROM hims_d_physical_examination_header where record_status='A'and examination_type='S' and sub_department_id='" +
        req.userIdentity.sub_department_id +
        "';";
    } else if (
      input.hims_d_physical_examination_header_id > 0 &&
      !input.hims_d_physical_examination_details_id == "null"
    ) {
      queryBuilder =
        "SELECT hims_d_physical_examination_details_id, physical_examination_header_id,\
        description as detail_description, mandatory as detail_mandatory FROM hims_d_physical_examination_details\
         where   record_status='A' and  physical_examination_header_id='" +
        input.hims_d_physical_examination_header_id +
        "';";
    } else if (input.hims_d_physical_examination_details_id > 0) {
      queryBuilder =
        "SELECT hims_d_physical_examination_subdetails_id, physical_examination_details_id, description as sub_detail_description,\
        mandatory as sub_detail_mandatory from hims_d_physical_examination_subdetails where record_status='A' and physical_examination_details_id='" +
        input.hims_d_physical_examination_details_id +
        "'";
    }

    _mysql
      .executeQuery({
        query: queryBuilder,
        values: [req.query.patient_id],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:
let getAllPhysicalExamination = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    const _all = req.query.allDept == "G" ? "" : " and sub_department_id=?";
    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_physical_examination_header_id,\
        examination_type,h.description,assesment_type,\
        h.mandatory,hims_d_physical_examination_details_id,\
        d.description as dtl_description,\
        sd.description as sub_dtl_description,\
        sd.mandatory ,sd.hims_d_physical_examination_subdetails_id FROM hims_d_physical_examination_header h left outer join  hims_d_physical_examination_details d \
        on h.hims_d_physical_examination_header_id = d.physical_examination_header_id left outer join \
        hims_d_physical_examination_subdetails sd  on sd.physical_examination_details_id=d.hims_d_physical_examination_details_id \
         where         h.record_status='A' " +
          _all,
        values: [req.userIdentity.sub_department_id],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

let addDietAdvice = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputParam = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_patient_diet` (`patient_id`, `episode_id`,`diet_id`, `comments`, `till_date` \
      , `created_by` ,`created_date`,updated_date,updated_by,hospital_id) \
   VALUES ( ?, ?, ?, ?, ?, ?,?, ?,?,?)",
        values: [
          inputParam.patient_id,
          inputParam.episode_id,
          inputParam.diet_id,
          inputParam.comments,
          inputParam.till_date,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
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
    _mysql.releaseConnection();
    next(e);
  }
};

let deleteDietAdvice = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputParam = req.body;
    _mysql
      .executeQuery({
        query:
          "DELETE FROM  `hims_f_patient_diet`  WHERE `hims_f_patient_diet_id`=?;",
        values: [inputParam.hims_f_patient_diet_id],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

let getEpisodeDietAdvice = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.query;

    let str = "";

    if (input.hims_f_patient_diet_id) {
      str += " and hims_f_patient_diet_id=" + input.hims_f_patient_diet_id;
    }
    if (input.patient_id) {
      str += " and patient_id=" + input.patient_id;
    }
    if (input.episode_id) {
      str += " and episode_id=" + input.episode_id;
    }

    _mysql
      .executeQuery({
        query: `SELECT * FROM hims_f_patient_diet WHERE record_status='A' ${str} ;`,
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

let addReferalDoctor = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputParam = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_patient_referral` (`patient_id`, `episode_id`,`referral_type`, `sub_department_id`, \
        `doctor_id` ,`hospital_name`, `reason`, `created_by` ,`created_date`,`hospital_id`,`updated_by`,`updated_date`,`external_doc_name`) \
        VALUES (  ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?);",
        values: [
          inputParam.patient_id,
          inputParam.episode_id,
          inputParam.referral_type,
          inputParam.sub_department_id,
          inputParam.doctor_id,
          inputParam.hospital_name,
          inputParam.reason,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.hospital_id,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.external_doc_name,
        ],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

let addFollowUp = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let inputParam = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_patient_followup` (`patient_id`, `doctor_id`, `episode_id`, `followup_type`, \
        `followup_date`, `sub_department_id`, `reason`, `created_by` ,`created_date`,hospital_id) \
       VALUES ( ?, ?, ?, ?, ?, ?,?, ?, ?, ?);",
        values: [
          inputParam.patient_id,
          inputParam.doctor_id,
          inputParam.episode_id,
          inputParam.followup_type,
          inputParam.followup_date,
          inputParam.sub_department_id,
          inputParam.reason,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.hospital_id,
        ],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by:irfan,to get Patient physical examination

let getPatientPhysicalExamination = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.query;
  try {
    _mysql
      .executeQuery({
        query:
          "select hims_f_episode_examination_id, patient_id, episode_id, exam_header_id, exam_details_id,exam_subdetails_id, comments ,\
        hims_d_physical_examination_header_id, PH.examination_type, PH.description as header_description,PH.sub_department_id, PH.assesment_type, PH.mandatory as header_mandatory,\
        hims_d_physical_examination_details_id,PD.description as detail_description, PD.mandatory as detail_mandatory,\
        hims_d_physical_examination_subdetails_id,PS.description as subdetail_description, PS.mandatory as subdetail_mandatory\
        from  ((hims_f_episode_examination EE  join hims_d_physical_examination_header PH on EE.exam_header_id=PH.hims_d_physical_examination_header_id) left join hims_d_physical_examination_details PD on\
        EE.exam_details_id=PD.hims_d_physical_examination_details_id )\
        left join hims_d_physical_examination_subdetails PS on EE.exam_subdetails_id=PS.hims_d_physical_examination_subdetails_id \
        where  EE.record_status='A' and EE.patient_id= ? and EE.episode_id=?",
        values: [input.patient_id, input.episode_id],
        printQuery: true,
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to update or delete Patient physical examination
let updatePatientPhysicalExam = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_f_episode_examination` SET  `patient_id`=?,\
        `episode_id`=?, `exam_header_id`=?, `exam_details_id`=?, `exam_subdetails_id`=?, `comments`=?,\
        `updated_date`=?, `updated_by`=?, `record_status`=? WHERE `record_status`='A' and `hims_f_episode_examination_id`=?;",
        values: [
          input.patient_id,
          input.episode_id,
          input.exam_header_id,
          input.exam_details_id,
          input.exam_subdetails_id,
          input.comments,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.record_status,
          input.hims_f_episode_examination_id,
        ],
        printQuery: true,
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
    _mysql.releaseConnection();
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
        values: [req.userIdentity.sub_department_id],
      })
      .then((result) => {
        const vitalDetails = new LINQ(result)
          .Select((s) => {
            return s.hims_d_vitals_header_id;
          })
          .ToArray();
        _mysql
          .executeQuery({
            query:
              "select hims_d_vitals_details_id,vitals_header_id,gender,min_age,max_age,min_value,max_value from hims_d_vitals_details where vitals_header_id in (?)",
            values: [vitalDetails],
            printQuery: true,
          })
          .then((detailResult) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      })
      .catch((error) => {
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
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let patient_history = req.body.patient_history;
    const insurtColumns = ["history_type", "remarks"];

    _mysql
      .executeQuery({
        query: "INSERT INTO hims_f_patient_history(??) VALUES ?",
        values: patient_history,
        includeValues: insurtColumns,
        printQuery: false,
        bulkInsertOrUpdate: true,
        extraValues: {
          patient_id: req.body.patient_id,
          provider_id: req.body.provider_id,
          hospital_id: req.userIdentity.hospital_id,
          created_date: new Date(),
          created_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
        },
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to getPatientHistory
let getPatientHistory = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    _mysql
      .executeQuery({
        query: `select hims_f_patient_history_id, history_type, provider_id, 
 concat(T.title,' ', E.full_name) as provider_name, patient_id, remarks, 
 PH.created_date       from  hims_f_patient_history as PH  inner join  hims_d_employee as E 
 on PH.provider_id = E.hims_d_employee_id  left join hims_d_title as T 
 on T.his_d_title_id = E.title_id       where  PH.provider_id = E.hims_d_employee_id 
 and PH.record_status = 'A'  and E.record_status = 'A'  and  patient_id =?;`,
        values: [req.query.patient_id],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        let history = _.chain(result)
          .groupBy((g) => g.history_type)
          .map(function (detail, key) {
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
              groupDetail: detail,
            };
          })
          .value();

        req.records = history;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
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
        printQuery: true,
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
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;
    // db.getConnection((error, connection) => {
    //   connection.query(
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_episode_chief_complaint_id, ECC.episode_id, ECC.patient_id, chief_complaint_id, \
        onset_date, `interval`, duration, severity, score, pain, chronic, complaint_inactive ,\
        full_name as patient_name,arabic_name,gender,age\
        ,hims_f_patient_visit_id,visit_date ,sub_department_name,comment from\
        hims_f_episode_chief_complaint  ECC\
        inner join hims_f_patient P on ECC.patient_id=P.hims_d_patient_id \
        inner join hims_f_patient_visit V on ECC.episode_id=V.episode_id\
        inner join hims_d_sub_department SD on V.sub_department_id=SD.hims_d_sub_department_id\
        where ECC.episode_id=?    group by  ECC.chief_complaint_id ",
        values: [req.query.episode_id],
        //         (error, result) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = result;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
  } catch (error) {
    next(error);
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
        inputData.examination_notes,
      ]);
    }
    if (inputData.assesment_notes != null) {
      const putComma = inputData.examination_notes != null ? "," : "";
      strQuery += _mysql.mysqlQueryFormat(putComma + "assesment_notes =?", [
        inputData.assesment_notes,
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
        inputData.significant_signs,
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
        inputData.other_signs,
      ]);
    }
    strQuery += " where encounter_id=?";

    _mysql
      .executeQuery({
        query: strQuery,
        values: [inputData.encounter_id],
        printQuery: true,
      })
      .then((result) => {
        // utilities.logger().log("result: ", result);
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
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
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    _mysql
      .executeQuery({
        query:
          "SELECT examination_notes,assesment_notes, other_signs,\
         significant_signs FROM hims_f_patient_encounter where encounter_id=?;",
        values: [req.query.encounter_id],
        printQuery: true,
      })
      .then((result) => {
        req.records = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan:  to get allergic details
let getSummaryFollowUp = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_f_patient_followup where episode_id=?;",
        values: [req.query.episode_id],
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
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
let addSickLeave = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    let input = req.body;
    _mysql
      .executeQuery({
        query:
          "SELECT * FROM hims_f_patient_sick_leave where patient_id=? and visit_id=?;",
        values: [input.patient_id, input.visit_id],
      })
      .then((result) => {
        if (result.length > 0) {
          req.records = [];
          next();
        } else {
          _mysql
            .executeQuery({
              query:
                "insert into hims_f_patient_sick_leave(patient_id, visit_id, episode_id, from_date, \
              to_date, no_of_days, remarks)values(?, ?, ?, ?, ?, ?, ?)",
              values: [
                input.patient_id,
                input.visit_id,
                input.episode_id,
                input.from_date,
                input.to_date,
                input.no_of_days,
                input.remarks,
              ],
            })
            .then((resultd) => {
              _mysql.releaseConnection();
              req.records = resultd;
              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        }
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//created by irfan: to add  physical_examination_details
let getSickLeave = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    // if (req.db == null) {
    //   next(httpStatus.dataBaseNotInitilizedError());
    // }
    // let db = req.db;

    // db.getConnection((error, connection) => {
    //   if (error) {
    //     releaseDBConnection(db, connection);
    //     next(error);
    //   }

    // connection.query(
    _mysql
      .executeQuery({
        query:
          "SELECT * FROM hims_f_patient_sick_leave where patient_id=? and visit_id=?;",
        values: [req.query.patient_id, req.query.visit_id],
        //         (error, results) => {
        //           releaseDBConnection(db, connection);
        //           if (error) {
        //             next(error);
        //           }
        //           req.records = results;
        //           next();
        //         }
        //       );
        //     });
        //   } catch (e) {
        //     next(e);
        //   }
        // };
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
  } catch (error) {
    next(error);
  }
};

let getActiveEncounters = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const { hospital_id, provider_id } = req.query;
  try {
    _mysql
      .executeQuery({
        query:
          "select E.hims_f_patient_encounter_id, P.patient_code, P.full_name, P.gender, P.age, E.patient_id,\
          V.appointment_patient, V.new_visit_patient, E.provider_id, E.`status`, E.nurse_examine, E.checked_in,\
          E.payment_type, E.episode_id, E.encounter_id, E.`source`, E.updated_date as encountered_date,\
          V.visit_expiery_date, V.visit_status from hims_f_patient_encounter E \
          INNER JOIN hims_f_patient P ON E.patient_id=P.hims_d_patient_id \
          inner join hims_f_patient_visit V on E.visit_id=V.hims_f_patient_visit_id \
          inner join hims_d_sub_department SD on sub_department_id=SD.hims_d_sub_department_id \
          left join hims_d_identity_document ID on ID.hims_d_identity_document_id = P.primary_identity_id \
          where E.cancelled='N' and E.record_status='A' AND  V.record_status='A' and date(E.updated_date) between \
          DATE_SUB(current_date(), INTERVAL (select param_value from algaeh_d_app_config where param_name='VISITEXPERIDAY') DAY) \
          and date(current_date()) and E.provider_id = ? and  E.`status` in ('W','CO') and E.hospital_id=?; \
          ",
        values: [provider_id, hospital_id],
        printQuery: true,
      })
      .then((result) => {
        req.records = result;
        _mysql.releaseConnection();
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
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
  getActiveEncounters,
  updatePatientEncounter,
  getPatientEncounter,
  getPatientBasicChiefComplaints,
  deleteDietAdvice,
  getSummaryFollowUp,
  addSickLeave,
  getSickLeave,
};
