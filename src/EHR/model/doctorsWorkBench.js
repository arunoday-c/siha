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

import { logger, debugFunction, debugLog } from "../../utils/logging";

//created by irfan: to add master of physical_examination_header
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

//created by irfan: to add master of physical_examination_details
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

//created by irfan: to add master of physical_examination_subdetails
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

//created by irfan: master of order table
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

//created by irfan: master of sample table
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

//created by irfan: master of Analytes table
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

module.exports = {
  physicalExaminationHeader,
  physicalExaminationDetails,
  physicalExaminationSubDetails,
  getPhysicalExamination,
  addOrder,
  addSample,
  addAnalytes
};
