"use strict";
import extend from "extend";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";

import { getBillDetailsFunctionality } from "../model/billing";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import { debugFunction, debugLog } from "../utils/logging";
import mysql from "mysql";
import moment from "moment";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

//created by irfan: check pre-aproval status and get PreAproval List
let getPreAprovalList = (req, res, next) => {
  let preAprovalWhere = {
    service_id: "ALL"
    // doctor_id: "ALL",
    // patient_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    req.query["date(SA.created_date)"] = req.query.created_date;
    req.query["SA.doctor_id"] = req.query.doctor_id;
    req.query["SA.patient_id"] = req.query.patient_id;
    delete req.query.created_date;
    delete req.query.doctor_id;
    delete req.query.patient_id;

    console.log("req query:", req.query);

    let where = whereCondition(extend(preAprovalWhere, req.query));

    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_service_approval_id,ordered_services_id,insurance_provider_id,network_id,\
        insurance_network_office_id,valid_upto,\
        service_id,SR.service_code, icd_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
        PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
        apprv_status,SA.created_date,SA.created_by, SD.chart_type \
        from ((hims_f_service_approval SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
        inner join \
        hims_d_services SR on SR.hims_d_services_id=SA.service_id inner join \
        hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id inner join \
        hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) WHERE SA.record_status='A' AND " +
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

//created by irfan: check pre-aproval status and get PreAproval List
let getMedicationAprovalList = (req, res, next) => {
  let preAprovalWhere = {
    service_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    req.query["date(SA.created_date)"] = req.query.created_date;
    req.query["SA.doctor_id"] = req.query.doctor_id;
    req.query["SA.patient_id"] = req.query.patient_id;
    if (req.query.item_id != null) {
      req.query["SA.item_id"] = req.query.item_id;
      delete req.query.item_id;
    }

    if (req.query.visit_id != null) {
      req.query["SA.visit_id"] = req.query.visit_id;
      delete req.query.visit_id;
    }

    if (req.query.pharmacy_pos_detail_id != null) {
      req.query["SA.pharmacy_pos_detail_id"] = req.query.pharmacy_pos_detail_id;
      delete req.query.pharmacy_pos_detail_id;
    }

    delete req.query.created_date;
    delete req.query.doctor_id;
    delete req.query.patient_id;

    console.log("req query:", req.query);

    let where = whereCondition(extend(preAprovalWhere, req.query));

    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_medication_approval_id,prescription_detail_id,insurance_provider_id,sub_insurance_id,\
        network_id,insurance_network_office_id,\
        service_id,SR.service_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
        PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
        apprv_status,SA.created_date,SA.created_by, SD.chart_type \
        from ((hims_f_medication_approval SA left join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
        inner join \
        hims_d_services SR on SR.hims_d_services_id=SA.service_id left join \
        hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id left join \
        hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) WHERE SA.record_status='A' AND " +
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

//created by irfan:UPDATE PREAPPROVAL
let updatePreApproval = (req, res, next) => {
  debugFunction("updatePreApproval");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let inputParam = extend({}, req.body);

      let qry = "";

      for (let i = 0; i < req.body.length; i++) {
        let _appDate =
          inputParam[i].apprv_date != null ? inputParam[i].apprv_date : null;
        qry += mysql.format(
          "UPDATE `hims_f_service_approval` SET service_id=?, insurance_provider_id=?, insurance_network_office_id=?,\
          icd_code=?,insurance_service_name=?,doctor_id=?,patient_id=?,gross_amt=?,net_amount=?,requested_date=?,\
          requested_by=?, requested_mode=?,requested_quantity=?,submission_type=?,refer_no=?,approved_amount=?,\
          apprv_remarks=?,apprv_date=?,rejected_reason=?, apprv_status=?, approved_no=?, valid_upto = ?,\
          updated_date=?, updated_by=? \
          where hims_f_service_approval_id=?;",
          [
            inputParam[i].service_id,
            inputParam[i].insurance_provider_id,
            inputParam[i].insurance_network_office_id,
            inputParam[i].icd_code,
            inputParam[i].insurance_service_name,
            inputParam[i].doctor_id,
            inputParam[i].patient_id,
            inputParam[i].gross_amt,
            inputParam[i].net_amount,
            inputParam[i].requested_date,
            req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].requested_mode,
            inputParam[i].requested_quantity,
            inputParam[i].submission_type,
            inputParam[i].refer_no,
            inputParam[i].approved_amount,
            inputParam[i].apprv_remarks,
            _appDate,
            inputParam[i].rejected_reason,
            inputParam[i].apprv_status,
            inputParam[i].approved_no,
            inputParam[i].valid_upto,
            moment().format("YYYY-MM-DD HH:mm"),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].hims_f_service_approval_id
          ]
        );
      }
      debugLog("qry: ", qry);
      connection.query(qry, (error, result) => {
        releaseDBConnection(db, connection);
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

//created by irfan:UPDATE PREAPPROVAL
let updateMedicinePreApproval = (req, res, next) => {
  debugFunction("updatePreApproval");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let inputParam = extend({}, req.body);

      let qry = "";

      for (let i = 0; i < req.body.length; i++) {
        let _appDate =
          inputParam[i].apprv_date != null ? inputParam[i].apprv_date : null;

        let _requested_date =
          inputParam[i].requested_date != null
            ? inputParam[i].requested_date
            : null;
        qry += mysql.format(
          "UPDATE `hims_f_medication_approval` SET requested_date=?,\
          requested_by=?, requested_mode=?,requested_quantity=?,submission_type=?,refer_no=?,approved_amount=?,\
          apprv_remarks=?,apprv_date=?,rejected_reason=?, apprv_status=?, approved_no=?, updated_date=?, updated_by=? \
          where hims_f_medication_approval_id=?;",
          [
            _requested_date,
            req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].requested_mode,
            inputParam[i].requested_quantity,
            inputParam[i].submission_type,
            inputParam[i].refer_no,
            inputParam[i].approved_amount,
            inputParam[i].apprv_remarks,
            _appDate,
            inputParam[i].rejected_reason,
            inputParam[i].apprv_status,
            inputParam[i].approved_no,
            moment().format("YYYY-MM-DD HH:mm"),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].hims_f_medication_approval_id
          ]
        );
      }
      debugLog("qry: ", qry);
      connection.query(qry, (error, result) => {
        releaseDBConnection(db, connection);
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

//created by irfan: insert ordered services and pre-approval services for insurance
let insertOrderedServices = (req, res, next) => {
  const insurtColumns = [
    "patient_id",
    "visit_id",
    "doctor_id",
    "service_type_id",
    "services_id",
    "test_type",
    "insurance_yesno",
    "insurance_provider_id",
    "insurance_sub_id",
    "network_id",
    "insurance_network_office_id",
    "policy_number",
    "pre_approval",
    "quantity",
    "unit_cost",
    "gross_amount",
    "discount_amout",
    "discount_percentage",
    "net_amout",
    "copay_percentage",
    "copay_amount",
    "deductable_amount",
    "deductable_percentage",
    "tax_inclusive",
    "patient_tax",
    "company_tax",
    "total_tax",
    "patient_resp",
    "patient_payable",
    "comapany_resp",
    "company_payble",
    "sec_company",
    "sec_deductable_percentage",
    "sec_deductable_amount",
    "sec_company_res",
    "sec_company_tax",
    "sec_company_paybale",
    "sec_copay_percntage",
    "sec_copay_amount",
    "teeth_number"
  ];

  debugFunction("add order");
  debugLog("request body:", req.body);
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let connection = req.connection;

    connection.beginTransaction(error => {
      if (error) {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      }

      debugLog("bodyy:", req.body.billdetails);
      debugLog("insurtColumns: ", insurtColumns);
      connection.query(
        "INSERT INTO hims_f_ordered_services(" +
          insurtColumns.join(",") +
          ",created_by,updated_by,hospital_id) VALUES ?",
        [
          jsonArrayToObject({
            sampleInputObject: insurtColumns,
            arrayObj: req.body.billdetails,
            req: req,
            newFieldToInsert: [
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity.algaeh_d_app_user_id,
              req.userIdentity["x-branch"]
            ]
          })
        ],
        (error, resultOrder) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          let servicesForPreAproval = [];
          let patient_id;
          let doctor_id;
          let visit_id;

          let services = new LINQ(req.body.billdetails)
            .Select(s => {
              patient_id = s.patient_id;
              doctor_id = s.doctor_id;
              visit_id = s.visit_id;
              return s.services_id;
            })
            .ToArray();
          debugLog("services:", services);
          if (services.length > 0) {
            servicesForPreAproval.push(patient_id);
            servicesForPreAproval.push(doctor_id);
            servicesForPreAproval.push(visit_id);
            servicesForPreAproval.push(services);

            debugLog(" servicesForPreAproval", servicesForPreAproval);

            connection.query(
              "SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
                 where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
              servicesForPreAproval,
              (error, ResultOfFetchOrderIds) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                debugLog("Query ", connection);
                debugLog("Results are recorded...", ResultOfFetchOrderIds);

                let detailsPush = new LINQ(req.body.billdetails)
                  .Where(g => g.pre_approval == "Y")
                  .Select(s => {
                    return {
                      ...s,
                      ...{
                        hims_f_ordered_services_id: new LINQ(
                          ResultOfFetchOrderIds
                        )
                          .Where(w => w.services_id == s.services_id)
                          .FirstOrDefault().hims_f_ordered_services_id
                      }
                    };
                  })
                  .ToArray();

                //if request for pre-aproval needed
                if (detailsPush.length > 0) {
                  const insurtCols = [
                    "ordered_services_id",
                    "service_id",
                    "insurance_provider_id",
                    "insurance_network_office_id",
                    "icd_code",
                    "requested_quantity",
                    "insurance_service_name",
                    "doctor_id",
                    "patient_id",
                    "visit_id",
                    "gross_amt",
                    "net_amount"
                  ];

                  connection.query(
                    "INSERT INTO hims_f_service_approval(" +
                      insurtCols.join(",") +
                      ",created_by,updated_by) VALUES ?",
                    [
                      jsonArrayToObject({
                        sampleInputObject: insurtCols,
                        arrayObj: detailsPush,
                        replaceObject: [
                          {
                            originalKey: "service_id",
                            NewKey: "services_id"
                          },
                          {
                            originalKey: "gross_amt",
                            NewKey: "ser_gross_amt"
                          },
                          {
                            originalKey: "net_amount",
                            NewKey: "ser_net_amount"
                          },
                          {
                            originalKey: "ordered_services_id",
                            NewKey: "hims_f_ordered_services_id"
                          }
                        ],
                        req: req,
                        newFieldToInsert: [
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.algaeh_d_app_user_id
                        ]
                      })
                    ],
                    (error, resultPreAprvl) => {
                      if (error) {
                        debugLog("Error 1 Here result ", error);
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      req.records = { resultPreAprvl, ResultOfFetchOrderIds };
                      next();
                    }
                  );
                } else {
                  debugLog("Commit result ");
                  req.records = { resultOrder, ResultOfFetchOrderIds };
                  next();
                }
              }
            );
          } else {
            debugFunction("Else: ");

            req.records = { resultOrder, ResultOfFetchOrderIds };
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

let selectOrderServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.visit_id != null) {
      _stringData += " and visit_id=?";
      inputValues.push(req.query.visit_id);
    }

    if (req.query.service_type_id != null) {
      _stringData += " and OS.service_type_id=?";
      inputValues.push(req.query.service_type_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT  OS.`hims_f_ordered_services_id`, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`service_type_id`, \
        OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
        OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
        OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
        OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
        OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
        OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
        OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
        OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
        S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
        S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
        S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
        S.`vat_percent`, S.`service_status` FROM `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
        OS.services_id = S.hims_d_services_id and \
        OS.`record_status`='A'  " +
          _stringData,
        values: inputValues,
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
};

// let selectOrderServices = (req, res, next) => {
//   let selectWhere = {
//     visit_id: "ALL",
//     service_type_id: "ALL",
//     billed: "N"
//   };
//
//   try {
//     if (req.db == null) {
//       next(httpStatus.dataBaseNotInitilizedError());
//     }
//     let db = req.db;
//     db.getConnection((error, connection) => {
//       if (error) {
//         next(error);
//       }
//       let where = whereCondition(extend(selectWhere, req.query));
//       connection.query(
//         "SELECT  OS.`hims_f_ordered_services_id`,OS.`hims_f_ordered_services_id` as ordered_services_id,\
//         OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`service_type_id`, \
//         OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
//         OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, \
//         OS.`apprv_status`, OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`,\
//         OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`,\
//         OS.`deductable_percentage`, OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
//         OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
//         S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
//         S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
//         S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
//         S.`vat_percent`, S.`service_status`, OS.teeth_number FROM \
//         `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
//         OS.services_id = S.hims_d_services_id and \
//         OS.`record_status`='A' AND OS.`billed`='N' AND " +
//           where.condition,
//         where.values,
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

let selectOrderServicesbyDoctor = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.visit_id != null) {
      _stringData += " and visit_id=?";
      inputValues.push(req.query.visit_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT  OS.`hims_f_ordered_services_id`, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`service_type_id`, \
        OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
        OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
        OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
        OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
        OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
        OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
        OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
        OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
        S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
        S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
        S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
        S.`vat_percent`, S.`service_status` FROM `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
        OS.services_id = S.hims_d_services_id and \
        OS.`record_status`='A'  " +
          _stringData,
        values: inputValues,
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
};

let getVisitConsumable = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.visit_id != null) {
      _stringData += " and visit_id=?";
      inputValues.push(req.query.visit_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT  OS.`hims_f_ordered_inventory_id`, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`, OS.`service_type_id`, \
        OS.`services_id`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
        OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
        OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
        OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
        OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
        OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
        OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
        OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
        OS.item_notchargable,\
        S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
        S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
        S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
        S.`vat_percent`, S.`service_status` FROM `hims_f_ordered_inventory` OS,  `hims_d_services` S WHERE \
        OS.services_id = S.hims_d_services_id and \
        OS.`record_status`='A'  " +
          _stringData,
        values: inputValues,
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
};

let load_orders_for_bill = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    if (req.query.visit_id > 0) {
      _mysql
        .executeQuery({
          query:
            "SELECT  OS.`hims_f_ordered_services_id` as ordered_services_id, OS.`patient_id`, OS.`visit_id`,\
          OS.`doctor_id`, OS.`service_type_id`, OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, \
          OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
          OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
          OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
          OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
          OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
          OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
          OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
          OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
          S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
          S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
          S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
          S.`vat_percent`, S.`service_status` FROM `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
          OS.services_id = S.hims_d_services_id and  OS.`record_status`='A' and visit_id=? AND OS.`billed`='N'; \
            SELECT  OS.`hims_f_ordered_inventory_id` as ordered_inventory_id, OS.`patient_id`, OS.`visit_id`,\
          OS.`doctor_id`, OS.`service_type_id`, \
          OS.`services_id`, OS.`insurance_yesno`, OS.`insurance_provider_id`, OS.`insurance_sub_id`, \
          OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`,\
          OS.`apprv_status`, OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`,\
          OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`,\
          OS.`deductable_amount`, OS.`deductable_percentage`, \
          OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
          OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
          OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,\
          OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, OS.`record_status`,\
          OS.item_notchargable,\
          S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
          S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, \
          S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, \
          S.`vat_percent`, S.`service_status` FROM `hims_f_ordered_inventory` OS,  `hims_d_services` S WHERE \
          OS.services_id = S.hims_d_services_id and \
          OS.`record_status`='A' and item_notchargable='N' and  OS.visit_id=? AND OS.`billed`='N';",
          values: [req.query.visit_id, req.query.visit_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result[0].concat(result[1]);
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please send valid visit id"
      };
      next();
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getOrderServices = (req, res, next) => {
  let selectWhere = {
    visit_id: "ALL",
    insurance_yesno: "ALL",
    service_type_id: "ALL",
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
      let where = whereCondition(extend(selectWhere, req.query));
      connection.query(
        "SELECT  * FROM `hims_f_ordered_services` \
       WHERE `record_status`='A' AND " +
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

//ordered services update
let updateOrderedServices = (req, res, next) => {
  debugFunction("updateOrderedServices");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      new Promise((resolve, reject) => {
        try {
          getBillDetailsFunctionality(req, res, next, resolve);
        } catch (e) {
          reject(e);
        }
      }).then(result => {
        let inputParam = result.billdetails[0];
        debugLog("call back result", inputParam);

        let input = extend({}, req.body[0]);
        debugLog("id:", input.hims_f_ordered_services_id);

        connection.query(
          "UPDATE hims_f_ordered_services SET service_type_id=?,services_id=?,insurance_yesno=?,\
          pre_approval=?,apprv_status=?,quantity=?,unit_cost=?,gross_amount=?,discount_amout=?,discount_percentage=?,net_amout=?,\
          copay_percentage=?,copay_amount=?,deductable_amount=?,deductable_percentage=?,tax_inclusive=?,patient_tax=?,company_tax=?,total_tax=?,patient_resp=?,patient_payable=?,\
          comapany_resp=?,company_payble=?,sec_company=?,sec_deductable_percentage=?,sec_deductable_amount=?,sec_company_res=?,sec_company_tax=?,sec_company_paybale=?,\
          sec_copay_percntage=?,sec_copay_amount=?,updated_date=?, updated_by=? WHERE `record_status`='A' AND `hims_f_ordered_services_id`=? ",
          [
            inputParam.service_type_id,
            inputParam.services_id,
            inputParam.insurance_yesno,
            inputParam.pre_approval,
            input.apprv_status,
            inputParam.quantity,
            inputParam.unit_cost,
            inputParam.gross_amount,
            inputParam.discount_amout,
            inputParam.discount_percentage,
            inputParam.net_amout,
            inputParam.copay_percentage,
            inputParam.copay_amount,
            inputParam.deductable_amount,
            inputParam.deductable_percentage,
            inputParam.tax_inclusive,
            inputParam.patient_tax,
            inputParam.company_tax,
            inputParam.total_tax,
            inputParam.patient_resp,
            inputParam.patient_payable,
            inputParam.comapany_resp,
            inputParam.company_payble,
            inputParam.sec_company,
            inputParam.sec_deductable_percentage,
            inputParam.sec_deductable_amount,
            inputParam.sec_company_res,
            inputParam.sec_company_tax,
            inputParam.sec_company_paybale,
            inputParam.sec_copay_percntage,
            inputParam.sec_copay_amount,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_ordered_services_id
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
    });
  } catch (e) {
    next(e);
  }
};

//ordered services update as billed
let updateOrderedServicesBilled = (req, res, next) => {
  debugFunction("updateOrderedServicesBilled");

  debugLog("Bill Data: ", req.body.billdetails);
  let OrderServices = new LINQ(req.body.billdetails)
    .Where(w => w.hims_f_ordered_services_id != null)
    .Select(s => {
      return {
        hims_f_ordered_services_id: s.hims_f_ordered_services_id,
        billed: "Y",
        updated_date: new Date(),
        updated_by: req.userIdentity.algaeh_d_app_user_id
      };
    })
    .ToArray();

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;

    let qry = "";

    for (let i = 0; i < OrderServices.length; i++) {
      qry += mysql.format(
        "UPDATE `hims_f_ordered_services` SET billed=?,\
      updated_date=?,updated_by=? where hims_f_ordered_services_id=?;",
        [
          OrderServices[i].billed,
          moment().format("YYYY-MM-DD HH:mm"),
          OrderServices[i].updated_by,
          OrderServices[i].hims_f_ordered_services_id
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
        req.records = result;
        next();
      });
    } else {
      req.records = {};
      next();
    }
  } catch (e) {
    next(e);
  }
};

//ordered services update as billed
let updatePrescriptionDetail = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let input = extend({}, req.body[0]);

      connection.query(
        "UPDATE hims_f_prescription_detail SET apprv_status = ?, approved_amount=?,pre_approval = 'N' WHERE `hims_f_prescription_detail_id`=? ",
        [
          input.apprv_status,
          input.approved_amount,
          input.hims_f_prescription_detail_id
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

let insertInvOrderedServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = { ...req.body };

    let IncludeValues = [
      "patient_id",
      "visit_id",
      "doctor_id",
      "inventory_item_id",
      "inventory_location_id",
      "inventory_uom_id",
      "service_type_id",
      "item_notchargable",
      "batchno",
      "expirydt",
      "grnno",
      "services_id",
      "insurance_yesno",
      "insurance_provider_id",
      "insurance_sub_id",
      "network_id",
      "insurance_network_office_id",
      "policy_number",
      "pre_approval",
      "quantity",
      "unit_cost",
      "gross_amount",
      "discount_amout",
      "discount_percentage",
      "net_amout",
      "copay_percentage",
      "copay_amount",
      "deductable_amount",
      "deductable_percentage",
      "tax_inclusive",
      "patient_tax",
      "company_tax",
      "total_tax",
      "patient_resp",
      "patient_payable",
      "comapany_resp",
      "company_payble",
      "sec_company",
      "sec_deductable_percentage",
      "sec_deductable_amount",
      "sec_company_res",
      "sec_company_tax",
      "sec_company_paybale",
      "sec_copay_percntage",
      "sec_copay_amount"
    ];

    _mysql
      .executeQuery({
        query: "INSERT INTO hims_f_ordered_inventory(??) VALUES ?",
        values: input.billdetails,
        includeValues: IncludeValues,
        extraValues: {
          created_by: req.userIdentity.algaeh_d_app_user_id,
          created_date: new Date(),
          updated_by: req.userIdentity.algaeh_d_app_user_id,
          updated_date: new Date(),
          hospital_id: req.userIdentity.hospital_id
        },
        bulkInsertOrUpdate: true,
        printQuery: true
      })
      .then(resultOrder => {
        let servicesForPreAproval = [];
        let patient_id;
        let doctor_id;
        let visit_id;

        let services = new LINQ(req.body.billdetails)
          .Select(s => {
            patient_id = s.patient_id;
            doctor_id = s.doctor_id;
            visit_id = s.visit_id;
            return s.services_id;
          })
          .ToArray();

        if (services.length > 0) {
          servicesForPreAproval.push(patient_id);
          servicesForPreAproval.push(doctor_id);
          servicesForPreAproval.push(visit_id);
          servicesForPreAproval.push(services);

          _mysql
            .executeQuery({
              query:
                "SELECT hims_f_ordered_inventory_id,services_id,created_date, service_type_id from hims_f_ordered_inventory\
              where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
              values: servicesForPreAproval,
              printQuery: true
            })
            .then(ResultOfFetchOrderIds => {
              let detailsPush = new LINQ(req.body.billdetails)
                .Where(g => g.pre_approval == "Y")
                .Select(s => {
                  return {
                    ...s,
                    ...{
                      hims_f_ordered_inventory_id: new LINQ(
                        ResultOfFetchOrderIds
                      )
                        .Where(w => w.services_id == s.services_id)
                        .FirstOrDefault().hims_f_ordered_inventory_id
                    }
                  };
                })
                .ToArray();
              if (detailsPush.length > 0) {
                const insurtCols = [
                  "ordered_services_id",
                  "service_id",
                  "insurance_provider_id",
                  "insurance_network_office_id",
                  "icd_code",
                  "requested_quantity",
                  "insurance_service_name",
                  "doctor_id",
                  "patient_id",
                  "gross_amt",
                  "net_amount"
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_service_approval(??) VALUES ?",
                    values: detailsPush,
                    includeValues: insurtCols,
                    replcaeKeys: [
                      {
                        service_id: "services_id",
                        gross_amt: "ser_gross_amt",
                        net_amount: "ser_net_amount",
                        hims_f_ordered_inventory: "hims_f_ordered_inventory_id"
                      }
                    ],
                    extraValues: {
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      created_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date()
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })
                  .then(result => {
                    _mysql.releaseConnection();
                    req.body.inventory_stock_detail = input.billdetails;
                    req.records = result;
                    next();
                  })
                  .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                  });
              } else {
                _mysql.releaseConnection();
                req.body.inventory_stock_detail = input.billdetails;
                req.records = { resultOrder, ResultOfFetchOrderIds };
                next();
              }

              // _mysql.releaseConnection();
              // req.records = result;
              // next();
            })
            .catch(error => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          req.body.inventory_stock_detail = input.billdetails;
          req.records = { resultOrder, ResultOfFetchOrderIds };
          next();
        }
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

module.exports = {
  insertOrderedServices,
  getPreAprovalList,
  updatePreApproval,
  selectOrderServices,
  updateOrderedServices,
  updateOrderedServicesBilled,
  getOrderServices,
  selectOrderServicesbyDoctor,
  getMedicationAprovalList,
  updateMedicinePreApproval,
  updatePrescriptionDetail,
  getVisitConsumable,
  insertInvOrderedServices,
  load_orders_for_bill
};
