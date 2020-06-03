"use strict";
import extend from "extend";
import utils from "../utils";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import appsettings from "../utils/appsettings.json";
import logUtils from "../utils/logging";
import mysql from "mysql";
import moment from "moment";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

const { debugFunction, debugLog } = logUtils;
const { whereCondition, releaseDBConnection, jsonArrayToObject } = utils;

//created by nowshad: to get lad orders for sample collection
let getRadOrderedServices = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let whereOrder = "";
    if (req.query.from_date != undefined) {
      whereOrder =
        "date(ordered_date) between date('" +
        req.query.from_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      whereOrder = "date(ordered_date) <= date(now())";
    }

    delete req.query.from_date;
    delete req.query.to_date;
    let where = whereCondition(req.query);

    debugLog("where Dates:", whereOrder);
    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_rad_order_id,patient_id,visit_id,provider_id, template_id, billed, service_id,SR.service_code,SR.service_name,\
        status, cancelled, ordered_by, ordered_date, test_type, technician_id, scheduled_date_time,scheduled_by,arrived_date,arrived,validate_by,\
        validate_date_time,attended_by,attended_date_time,exam_start_date_time,exam_end_date_time,exam_status,report_type,\
        PAT.patient_code,PAT.full_name,PAT.date_of_birth,PAT.gender\
        from ((hims_f_rad_order SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) inner join \
        hims_d_services SR on SR.hims_d_services_id=SA.service_id) WHERE " +
        whereOrder +
        (where.condition == "" ? "" : " AND " + where.condition),
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
let insertRadOrderedServices = (req, res, next) => {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };
    const IncludeValues = [
      "ordered_services_id",
      "patient_id",
      "visit_id",
      "provider_id",
      "service_id",
      "billed",
      "ordered_date",
      "ordered_by",
      "test_type"
    ];
    let Services = req.records.ResultOfFetchOrderIds || req.body.billdetails;

    const radServices = new LINQ(Services)
      .Where(
        w =>
          w.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Radiology
      )
      .Select(s => {
        return {
          ordered_services_id: s.hims_f_ordered_services_id || null,
          patient_id: req.body.patient_id,
          provider_id: req.body.incharge_or_provider,
          visit_id: req.body.visit_id,
          service_id: s.services_id,
          billed: req.body.billed,
          ordered_date: new Date(),
          ordered_by: s.ordered_by,
          test_type: s.test_type
        };
      })
      .ToArray();

    if (radServices.length > 0) {
      _mysql
        .executeQuery({
          query: "INSERT INTO hims_f_rad_order(??) VALUES ?",
          values: radServices,
          includeValues: IncludeValues,
          extraValues: {
            created_by: req.userIdentity.algaeh_d_app_user_id,
            updated_by: req.userIdentity.algaeh_d_app_user_id
          },
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(insert_rad_order => {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = insert_rad_order;
            next();
          });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      _mysql.commitTransaction(() => {
        _mysql.releaseConnection();
        req.records = radServices;
        next();
      });
    }
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
};
let insertRadOrderedServicesBackUp = (req, res, next) => {
  const insurtColumns = [
    "ordered_services_id",
    "patient_id",
    "visit_id",
    "provider_id",
    "service_id",
    "billed",
    "ordered_date",
    "ordered_by",
    "test_type"
  ];
  debugLog("ResultOfFetchOrderIds: ", req.records.ResultOfFetchOrderIds);

  let Services = req.records.ResultOfFetchOrderIds || req.body.billdetails;
  const radServices = new LINQ(Services)
    .Where(
      w =>
        w.service_type_id ==
        appsettings.hims_d_service_type.service_type_id.Radiology
    )
    .Select(s => {
      return {
        ordered_services_id: s.hims_f_ordered_services_id || null,
        patient_id: req.body.patient_id,
        provider_id: req.body.incharge_or_provider,
        visit_id: req.body.visit_id,
        service_id: s.services_id,
        billed: req.body.billed,
        ordered_date: s.created_date,
        ordered_by: req.userIdentity.algaeh_d_app_user_id,
        test_type: s.test_type
      };
    })
    .ToArray();
  debugLog("radServices: ", radServices);
  let connection = req.connection;
  if (radServices.length > 0) {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    debugLog("insurtColumns", insurtColumns.join(","));
    debugLog("radServices", radServices);
    connection.query(
      "INSERT INTO hims_f_rad_order(" +
      insurtColumns.join(",") +
      ",created_by,updated_by)  VALUES ?",
      [
        jsonArrayToObject({
          sampleInputObject: insurtColumns,
          arrayObj: radServices,
          req: req,
          newFieldToInsert: [
            req.userIdentity.algaeh_d_app_user_id,
            req.userIdentity.algaeh_d_app_user_id
          ]
        })
      ],
      (error, result) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }
        req.records = result;
        releaseDBConnection(db, connection);
        next();
      }
    );
  } else {
    next();
  }
};

let updateRadOrderedServices = (req, res, next) => {
  let RadList = {
    hims_f_rad_order_id: null,
    status: null,
    cancelled: null,
    scheduled_date_time: null,
    scheduled_by: null,
    arrived_date: null,
    arrived: null,
    validate_by: null,
    validate_date_time: null,
    attended_by: null,
    attended_date_time: null,
    technician_id: null,
    exam_start_date_time: null,
    exam_end_date_time: null,
    exam_status: null,
    report_type: null,
    template_id: null
  };
  if (req.db == null) {
    next(httpStatus.dataBaseNotInitilizedError());
  }

  //req.userIdentity.algaeh_d_app_user_id
  let db = req.db;
  db.getConnection((error, connection) => {
    if (error) {
      next(error);
    }
    let inputParam = extend(RadList, req.body);

    if (inputParam.scheduled_by == null && inputParam.status == "S") {
      inputParam.scheduled_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (inputParam.validate_by == null && inputParam.status == "RA") {
      inputParam.validate_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (
      inputParam.attended_by == null &&
      inputParam.status == "V" &&
      inputParam.report_type == "AD"
    ) {
      inputParam.attended_by = req.userIdentity.algaeh_d_app_user_id;
    }
    if (inputParam.status == "UP") {
      inputParam.technician_id = req.userIdentity.algaeh_d_app_user_id;
    }

    debugLog("inputParam: ", inputParam);
    connection.query(
      "UPDATE `hims_f_rad_order` \
     SET `status`=?,  `cancelled`=?,`scheduled_date_time`=?, `scheduled_by`=?, `arrived_date`=?,`arrived`=?,\
     `validate_by`=?, `validate_date_time` = ?, `attended_by`=?,`attended_date_time`=?,`exam_start_date_time`=?, \
     `exam_end_date_time`=?, `exam_status`=?, `report_type`=?,`technician_id`=?, `template_id`=?\
     WHERE `hims_f_rad_order_id`=?",
      [
        inputParam.status,
        inputParam.cancelled,
        inputParam.scheduled_date_time,
        inputParam.scheduled_by,
        inputParam.arrived_date,
        inputParam.arrived,
        inputParam.validate_by,
        inputParam.validate_date_time,
        inputParam.attended_by,
        inputParam.attended_date_time,
        inputParam.exam_start_date_time,
        inputParam.exam_end_date_time,
        inputParam.exam_status,
        inputParam.report_type,
        inputParam.technician_id,
        inputParam.template_id,
        inputParam.hims_f_rad_order_id
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

let getRadTemplateList = (req, res, next) => {
  let whereStatement = {
    services_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      let where = whereCondition(extend(whereStatement, req.query));

      debugLog("inputparam: ", where);
      connection.query(
        "SELECT distinct TD.template_name, TD.template_html, IT.hims_d_investigation_test_id,TD.hims_d_rad_template_detail_id \
         FROM hims_d_investigation_test IT, \
        hims_d_rad_template_detail TD  WHERE IT.hims_d_investigation_test_id = TD.test_id AND " +
        where.condition,
        where.values,
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
          debugLog("result: ", result);
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let updateRadOrderedBilled = (req, res, next) => {
  debugFunction("updateRadOrderedBilled");

  debugLog("Bill Data: ", req.body.billdetails);
  let OrderServices = new LINQ(req.body.billdetails)
    .Where(
      w =>
        w.hims_f_ordered_services_id != null &&
        w.service_type_id ==
        appsettings.hims_d_service_type.service_type_id.Radiology
    )
    .Select(s => {
      return {
        ordered_services_id: s.hims_f_ordered_services_id,
        billed: "Y",
        updated_date: new Date(),
        updated_by: req.userIdentity.algaeh_d_app_user_id
      };
    })
    .ToArray();

  debugLog("Rad Order Services: ", OrderServices);

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;

    let qry = "";

    for (let i = 0; i < OrderServices.length; i++) {
      qry += mysql.format(
        "UPDATE `hims_f_rad_order` SET billed=?,\
      updated_date=?,updated_by=? where ordered_services_id=?;",
        [
          OrderServices[i].billed,
          moment().format("YYYY-MM-DD HH:mm"),
          OrderServices[i].updated_by,
          OrderServices[i].ordered_services_id
        ]
      );
    }
    debugLog("Query", qry);
    if (qry != "") {
      connection.query(qry, (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }
        debugLog("Query Result ", result);
        req.records = { result, RAD: false };
        next();
      });
    } else {
      req.records = { RAD: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

export default {
  getRadOrderedServices,
  getRadTemplateList,
  insertRadOrderedServices,
  updateRadOrderedServices,
  updateRadOrderedBilled
};
