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

import mysql from "mysql";
import moment from "moment";
import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

//created by irfan: check pre-aproval status and get PreAproval List
let getPreAprovalList = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";

    if (req.query.created_date != null) {
      _stringData +=
        " and date(SA.created_date) between date('" +
        req.query.created_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      _stringData += " and date(SA.created_date) <= date(now())";
    }
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_service_approval_id,ordered_services_id,insurance_provider_id,network_id,\
        insurance_network_office_id,valid_upto,\
        service_id,SR.service_code, icd_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
        PAT.patient_code,PAT.full_name, refer_no, gross_amt,billing_updated,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
        apprv_status,SA.created_date,SA.created_by, SD.chart_type, SD.sub_department_name, \
        PI.primary_card_number as card_no \
        from ((hims_f_service_approval SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
        inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id \
        inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id \
        inner join hims_m_patient_insurance_mapping PI on PI.patient_visit_id=SA.visit_id \
        inner join hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) \
        WHERE SA.record_status='A' " +
          _stringData,
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
  //
  //   req.query["date(SA.created_date)"] = req.query.created_date;
  //   req.query["SA.doctor_id"] = req.query.doctor_id;
  //   req.query["SA.patient_id"] = req.query.patient_id;
  //   delete req.query.created_date;
  //   delete req.query.doctor_id;
  //   delete req.query.patient_id;
  //
  //   let where = whereCondition(extend(preAprovalWhere, req.query));
  //
  //   debugLog("where conditn:", where);
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     db.query(
  //       "SELECT hims_f_service_approval_id,ordered_services_id,insurance_provider_id,network_id,\
  //       insurance_network_office_id,valid_upto,\
  //       service_id,SR.service_code, icd_code, requested_date, requested_by, requested_mode,\
  //       requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
  //       PAT.patient_code,PAT.full_name, refer_no, gross_amt,billing_updated,\
  //       net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
  //       apprv_status,SA.created_date,SA.created_by, SD.chart_type, SD.sub_department_name, \
  //       PI.primary_card_number as card_no \
  //       from ((hims_f_service_approval SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
  //       inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id \
  //       inner join hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id \
  //       inner join hims_m_patient_insurance_mapping PI on PI.patient_visit_id=SA.visit_id \
  //       inner join hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) \
  //       WHERE SA.record_status='A' AND " +
  //         where.condition,
  //       where.values,
  //
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //
  //         req.records = result;
  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan: check pre-aproval status and get PreAproval List
let getMedicationAprovalList = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.created_date != null) {
      _stringData +=
        " and date(SA.created_date) between date('" +
        req.query.created_date +
        "') AND date('" +
        req.query.to_date +
        "')";
    } else {
      _stringData += " and date(SA.created_date) <= date(now())";
    }
    if (req.query.item_id != null) {
      _stringData += " and SA.item_id=?";
      inputValues.push(req.query.item_id);
    }
    if (req.query.visit_id != null) {
      _stringData += " and SA.visit_id=?";
      inputValues.push(req.query.visit_id);
    }
    if (req.query.pharmacy_pos_detail_id != null) {
      _stringData += " and SA.pharmacy_pos_detail_id=?";
      inputValues.push(req.query.pharmacy_pos_detail_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_medication_approval_id,approved_qty,prescription_detail_id,insurance_provider_id,sub_insurance_id,\
        network_id,insurance_network_office_id,\
        service_id,SR.service_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
        PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
        apprv_status,SA.created_date,SA.created_by, SD.chart_type,billing_updated \
        from ((hims_f_medication_approval SA left join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
        inner join \
        hims_d_services SR on SR.hims_d_services_id=SA.service_id left join \
        hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id left join \
        hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) WHERE SA.record_status='A' " +
          _stringData,
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
  // let preAprovalWhere = {
  //   service_id: "ALL"
  // };
  // try {
  //   if (req.db == null) {
  //     next(httpStatus.dataBaseNotInitilizedError());
  //   }
  //   let db = req.db;
  //
  //   req.query["date(SA.created_date)"] = req.query.created_date;
  //   req.query["SA.doctor_id"] = req.query.doctor_id;
  //   req.query["SA.patient_id"] = req.query.patient_id;
  //
  //   delete req.query.created_date;
  //   delete req.query.doctor_id;
  //   delete req.query.patient_id;
  //
  //   let where = whereCondition(extend(preAprovalWhere, req.query));
  //
  //   debugLog("where conditn:", where);
  //   db.getConnection((error, connection) => {
  //     if (error) {
  //       next(error);
  //     }
  //     db.query(
  //       "SELECT hims_f_medication_approval_id,approved_qty,prescription_detail_id,insurance_provider_id,sub_insurance_id,\
  //       network_id,insurance_network_office_id,\
  //       service_id,SR.service_code, requested_date, requested_by, requested_mode,\
  //       requested_quantity, submission_type, insurance_service_name, SA.doctor_id, SA.patient_id,visit_id,\
  //       PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
  //       net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason,\
  //       apprv_status,SA.created_date,SA.created_by, SD.chart_type,billing_updated \
  //       from ((hims_f_medication_approval SA left join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) \
  //       inner join \
  //       hims_d_services SR on SR.hims_d_services_id=SA.service_id left join \
  //       hims_f_patient_visit V on V.hims_f_patient_visit_id=SA.visit_id left join \
  //       hims_d_sub_department SD on SD.hims_d_sub_department_id=V.sub_department_id) WHERE SA.record_status='A' AND " +
  //         where.condition,
  //       where.values,
  //
  //       (error, result) => {
  //         releaseDBConnection(db, connection);
  //         if (error) {
  //           next(error);
  //         }
  //
  //         req.records = result;
  //         next();
  //       }
  //     );
  //   });
  // } catch (e) {
  //   next(e);
  // }
};

//created by irfan:UPDATE PREAPPROVAL
let updatePreApproval = (req, res, next) => {
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

let insertOrderedServices = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = { ...req.body };

    const IncludeValues = [
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
      "teeth_number",
      "d_treatment_id"
    ];

    _mysql
      .executeQueryWithTransaction({
        query: "INSERT INTO hims_f_ordered_services(??) VALUES ?",
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
        req.connection = {
          connection: _mysql.connection,
          isTransactionConnection: _mysql.isTransactionConnection,
          pool: _mysql.pool,
          path: keyPath
        };
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
                "SELECT OS.hims_f_ordered_services_id, OS.services_id, OS.created_date, OS.service_type_id, OS.test_type, \
              S.physiotherapy_service from hims_f_ordered_services OS inner join hims_d_services S where \
              S.hims_d_services_id = OS.services_id and `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
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
                      hims_f_ordered_services_id: new LINQ(
                        ResultOfFetchOrderIds
                      )
                        .Where(w => w.services_id == s.services_id)
                        .FirstOrDefault().hims_f_ordered_services_id
                    }
                  };
                })
                .ToArray();
              if (detailsPush.length > 0) {
                const insurtCols = [
                  "hims_f_ordered_services_id",
                  "service_id",
                  "visit_id",
                  "insurance_provider_id",
                  "insurance_network_office_id",
                  "icd_code",
                  "requested_quantity",
                  "insurance_service_name",
                  "doctor_id",
                  "patient_id",
                  "ser_gross_amt",
                  "ser_net_amount",
                  "services_id"
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_service_approval(??) VALUES ?",
                    values: detailsPush,
                    includeValues: insurtCols,
                    replcaeKeys: {
                      services_id: "service_id",
                      ser_gross_amt: "gross_amt",
                      ser_net_amount: "net_amount",
                      hims_f_ordered_services_id: "ordered_services_id"
                    },
                    extraValues: {
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      created_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date()
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })
                  .then(resultPreAprvl => {
                    req.records = { resultPreAprvl, ResultOfFetchOrderIds };
                    next();
                  })
                  .catch(error => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              } else {
                req.records = { resultOrder, ResultOfFetchOrderIds };
                next();
              }
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          req.records = { resultOrder, ResultOfFetchOrderIds };
          next();
        }
      })
      .catch(error => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
};

//created by irfan: insert ordered services and pre-approval services for insurance
let insertOrderedServicesBackUp = (req, res, next) => {
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
    "teeth_number",
    "d_treatment_id"
  ];

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

          if (services.length > 0) {
            servicesForPreAproval.push(patient_id);
            servicesForPreAproval.push(doctor_id);
            servicesForPreAproval.push(visit_id);
            servicesForPreAproval.push(services);

            connection.query(
              "SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
                 where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
              servicesForPreAproval,
              (error, ResultOfFetchOrderIds) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }

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
                  req.records = { resultOrder, ResultOfFetchOrderIds };
                  next();
                }
              }
            );
          } else {
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
          "SELECT  OS.`hims_f_ordered_services_id`, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`,\
           OS.`service_type_id`, OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, \
           OS.`insurance_provider_id`, OS.`insurance_sub_id`, OS.`network_id`, \
           OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
           OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`,\
           OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`,\
           OS.`deductable_amount`, OS.`deductable_percentage`, OS.`tax_inclusive`, OS.`patient_tax`,\
           OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
           OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`,\
           OS.`sec_deductable_amount`, OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`,\
           OS.`sec_copay_percntage`, OS.`sec_copay_amount`, OS.`created_by`, OS.`created_date`, OS.`updated_by`,\
           OS.`updated_date`, OS.`record_status`, S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`,\
           S.`service_name`, S.`arabic_service_name`, S.`service_desc`, S.`sub_department_id`, S.`hospital_id`,\
           S.`service_type_id`, S.`procedure_type`, S.`standard_fee`, S.`followup_free_fee`, \
           S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, S.`vat_percent`, S.`service_status`,\
           OS.`trans_package_detail_id` FROM `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
           OS.services_id = S.hims_d_services_id and OS.`record_status`='A'  " +
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
            "SELECT  OS.`hims_f_ordered_services_id`, OS.`hims_f_ordered_services_id` as ordered_services_id,\
             OS.`patient_id`, OS.`visit_id`,OS.`trans_package_detail_id`,\
          OS.`doctor_id`, OS.`service_type_id`, OS.`services_id`, OS.`test_type`, OS.`insurance_yesno`, \
          OS.`insurance_provider_id`, OS.`insurance_sub_id`, OS.`d_treatment_id`,\
          OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`, OS.`pre_approval`, OS.`apprv_status`, \
          OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`, OS.`discount_amout`, OS.`discount_percentage`, \
          OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`, OS.`deductable_amount`, OS.`deductable_percentage`, \
          OS.`tax_inclusive`, OS.`patient_tax`, OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`, \
          OS.`comapany_resp`, OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
          OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,OS.teeth_number,OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`, \
          OS.`record_status`,S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`, S.`arabic_service_name`, \
          S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`, S.`procedure_type`, S.`standard_fee`, \
          S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`, S.`vat_applicable`, S.`vat_percent`, S.`service_status`,\
          S.`physiotherapy_service` FROM `hims_f_ordered_services` OS,  `hims_d_services` S WHERE \
          OS.services_id = S.hims_d_services_id and  OS.`record_status`='A' and visit_id=? AND OS.`billed`='N'; \
            SELECT  OS.`hims_f_ordered_inventory_id` as ordered_inventory_id, OS.`patient_id`, OS.`visit_id`,\
          OS.`doctor_id`, OS.`service_type_id`, OS.`trans_package_detail_id`,\
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
          OS.`record_status`='A' and item_notchargable='N' and  OS.visit_id=? AND OS.`billed`='N';\
            SELECT  OS.`hims_f_package_header_id` as ordered_package_id, OS.`patient_id`, OS.`visit_id`, OS.`doctor_id`,\
          OS.`service_type_id`, OS.`services_id`, OS.`insurance_yesno`, OS.`insurance_provider_id`,\
          OS.`insurance_sub_id`, OS.`network_id`, OS.`insurance_network_office_id`, OS.`policy_number`,\
          OS.`pre_approval`, OS.`apprv_status`, OS.`billed`, OS.`quantity`, OS.`unit_cost`, OS.`gross_amount`,\
          OS.`discount_amout`, OS.`discount_percentage`, OS.`net_amout`, OS.`copay_percentage`, OS.`copay_amount`,\
          OS.`deductable_amount`, OS.`deductable_percentage`, OS.`tax_inclusive`, OS.`patient_tax`,\
          OS.`company_tax`, OS.`total_tax`, OS.`patient_resp`, OS.`patient_payable`,OS.`comapany_resp`,\
          OS.`company_payble`, OS.`sec_company`, OS.`sec_deductable_percentage`, OS.`sec_deductable_amount`,\
          OS.`sec_company_res`, OS.`sec_company_tax`, OS.`sec_company_paybale`, OS.`sec_copay_percntage`, OS.`sec_copay_amount`,OS.`created_by`, OS.`created_date`, OS.`updated_by`, OS.`updated_date`,\
          OS.`record_status`, S.`hims_d_services_id`, S.`service_code`, S.`cpt_code`, S.`service_name`,\
          S.`arabic_service_name`, S.`service_desc`, S.`sub_department_id`, S.`hospital_id`, S.`service_type_id`,\
          S.`procedure_type`, S.`standard_fee`, S.`followup_free_fee`, S.`followup_paid_fee`, S.`discount`,\
          S.`vat_applicable`, S.`vat_percent`, S.`service_status` FROM `hims_f_package_header` OS, \
          `hims_d_services` S WHERE OS.services_id = S.hims_d_services_id and  OS.`record_status`='A' \
          and visit_id=? AND OS.`billed`='N' AND OS.package_visit_type='S';",
          values: [req.query.visit_id, req.query.visit_id, req.query.visit_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          let final_Result = result[0].concat(result[1]);
          final_Result = final_Result.concat(result[2]);
          req.records = final_Result;
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
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    new Promise((resolve, reject) => {
      try {
        getBillDetailsFunctionality(req, res, next, resolve);
      } catch (e) {
        reject(e);
      }
    }).then(result => {
      let inputParam = result.billdetails[0];

      let input = extend({}, req.body[0]);

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_ordered_services SET service_type_id=?, services_id=?, insurance_yesno=?, \
              pre_approval=?, apprv_status=?, quantity=?, unit_cost=?, gross_amount=?, discount_amout=?,\
              discount_percentage=?, net_amout=?, copay_percentage=?, copay_amount=?, deductable_amount=?,\
              deductable_percentage=?, tax_inclusive=?, patient_tax=?, company_tax=?, total_tax=?, \
              patient_resp=?, patient_payable=?, comapany_resp=?, company_payble=?, sec_company=?, \
              sec_deductable_percentage=?, sec_deductable_amount=?, sec_company_res=?, sec_company_tax=?,\
              sec_company_paybale=?, sec_copay_percntage=?, sec_copay_amount=?, updated_date=?, updated_by=? \
              WHERE `record_status`='A' AND `hims_f_ordered_services_id`=?; \
              UPDATE hims_f_service_approval SET billing_updated ='Y' where hims_f_service_approval_id=?;",
          values: [
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
            input.hims_f_ordered_services_id,
            input.hims_f_service_approval_id
          ],
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
    });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

//ordered services update as billed
let updateOrderedServicesBilled = (req, res, next) => {
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

    if (qry != "") {
      connection.query(qry, (error, result) => {
        releaseDBConnection(db, connection);
        if (error) {
          next(error);
        }

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
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.body[0]);

    let insurance_yesno = input.apprv_status === "RJ" ? "N" : "N";

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_prescription_detail SET apprv_status = ?, insured=?, approved_amount=?,pre_approval = 'N' WHERE `hims_f_prescription_detail_id`=?; UPDATE hims_f_medication_approval SET billing_updated ='Y' where hims_f_medication_approval_id=?;",
        values: [
          input.apprv_status,
          insurance_yesno,
          input.approved_amount,
          input.hims_f_prescription_detail_id,
          input.hims_f_medication_approval_id
        ],
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

//created by:irfan
let addPackage = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  let input = req.body;

  try {
    if (input.length > 0) {
      input.forEach(val => {
        if (!val.package_detail.length > 0) {
          req.records = {
            invalid_input: true,
            message: "Please provide valid  package detail"
          };
          next();
          return;
        }
      });

      for (let i = 0; i < input.length; i++) {
        _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO `hims_f_package_header` (package_id,patient_id,visit_id,doctor_id,service_type_id,services_id,insurance_yesno,\
                insurance_provider_id,\
                insurance_sub_id,network_id,insurance_network_office_id,policy_number,pre_approval,\
                billed,quantity,unit_cost,gross_amount,discount_amout,discount_percentage,net_amout,\
                copay_percentage, copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax ,patient_resp, patient_payable, comapany_resp,\
                company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount, sec_company_res,\
                sec_company_tax, sec_company_paybale, sec_copay_percntage, sec_copay_amount, advance_amount, balance_amount, actual_utilize_amount, utilize_amount, actual_amount, package_type,\
                package_visit_type, pack_expiry_date, hospital_id,created_by, created_date,updated_by,updated_date)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
              ?,?,?,?,?,?,?)",
            values: [
              input[i].package_id,
              input[i].patient_id,
              input[i].visit_id,
              input[i].doctor_id,
              input[i].service_type_id,
              input[i].services_id,
              input[i].insurance_yesno,
              input[i].insurance_provider_id,
              input[i].insurance_sub_id,
              input[i].network_id,
              input[i].insurance_network_office_id,
              input[i].policy_number,
              input[i].pre_approval,
              input[i].billed,
              input[i].quantity,
              input[i].unit_cost,
              input[i].gross_amount,
              input[i].discount_amout,
              input[i].discount_percentage,
              input[i].net_amout,
              input[i].copay_percentage,
              input[i].copay_amount,
              input[i].deductable_amount,
              input[i].deductable_percentage,
              input[i].tax_inclusive,
              input[i].patient_tax,
              input[i].company_tax,
              input[i].total_tax,
              input[i].patient_resp,
              input[i].patient_payable,
              input[i].comapany_resp,
              input[i].company_payble,
              input[i].sec_company,
              input[i].sec_deductable_percentage,
              input[i].sec_deductable_amount,
              input[i].sec_company_res,
              input[i].sec_company_tax,
              input[i].sec_company_paybale,
              input[i].sec_copay_percntage,
              input[i].sec_copay_amount,
              input[i].advance_amount,
              input[i].balance_amount,
              0,
              input[i].utilize_amount,
              input[i].actual_amount,
              input[i].package_type,
              input[i].package_visit_type,
              input[i].pack_expiry_date,
              req.userIdentity.hospital_id,

              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
            ],
            printQuery: true
          })
          .then(headerRes => {
            if (headerRes.insertId > 0) {
              const insurtColumns = [
                "package_header_id",
                "service_type_id",
                "service_id",
                "service_amount",
                "qty",
                "tot_service_amount",
                "appropriate_amount",
                "available_qty"
              ];

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_f_package_detail (??) VALUES ?",
                  values: input[i]["package_detail"],
                  includeValues: insurtColumns,
                  extraValues: {
                    package_header_id: headerRes.insertId
                  },
                  bulkInsertOrUpdate: true
                })
                .then(detailRes => {
                  if (detailRes.affectedRows > 0) {
                    if (i == input.length - 1) {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = detailRes;
                        next();
                      });
                    }
                  } else {
                    _mysql.rollBackTransaction(() => {
                      req.records = {
                        invalid_input: true,
                        message: "inValid package details"
                      };
                      next();
                      return;
                    });
                  }
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              _mysql.rollBackTransaction(() => {
                req.records = {
                  invalid_input: true,
                  message: "Provide valid package"
                };
                next();
                return;
              });
            }
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      }
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid Input"
      };

      next();
      return;
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
//created by:irfan
let getPatientPackage = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let str = "";
    if (req.query.patient_id > 0) {
      str += ` and H.patient_id=${req.query.patient_id} `;
    }
    if (req.query.hims_f_package_header_id > 0) {
      str += ` and H.hims_f_package_header_id=${
        req.query.hims_f_package_header_id
      } `;
    }

    if (req.query.visit_id > 0) {
      str += ` and H.visit_id=${req.query.visit_id} `;
    }
    if (req.query.package_type == "S" || req.query.package_type == "D") {
      str += ` and H.package_type='${req.query.package_type}' `;
    }
    if (
      req.query.package_visit_type == "S" ||
      req.query.package_visit_type == "M"
    ) {
      str += ` and H.package_visit_type='${req.query.package_visit_type}' `;
    }

    if (req.query.closed != null) {
      str += ` and H.closed='${req.query.closed}' `;
    }
    _mysql
      .executeQuery({
        query: `select hims_f_package_header_id, package_id, patient_id, visit_id, doctor_id, service_type_id,\
              services_id, insurance_yesno, insurance_provider_id, insurance_sub_id, network_id,\
              insurance_network_office_id, policy_number, pre_approval, apprv_status, billed, quantity, \
              unit_cost, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage, \
              copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax,\
              total_tax, patient_resp,patient_payable,comapany_resp, company_payble, sec_company,\
              sec_deductable_percentage, sec_deductable_amount, sec_company_res,sec_company_tax, \
              sec_company_paybale, sec_copay_percntage, sec_copay_amount, H.advance_amount, balance_amount,\ actual_utilize_amount, actual_amount, utilize_amount, closed,closed_type,closed_remarks,\
              H.package_type,H.package_visit_type,PM.advance_amount as collect_advance, H.hospital_id,\
              PM.package_name,P.full_name,P.patient_code, PM.cancellation_policy, \
              PM.cancellation_amount as can_amt, PM.package_code from hims_f_package_header H, \
              hims_d_package_header PM, hims_f_patient P where H.patient_id = P.hims_d_patient_id \
              and PM.hims_d_package_header_id = H.package_id and  H.record_status='A'\
              and H.hospital_id=?  ${str};
              select D.*,0 as quantity, D.service_id as services_id from hims_f_package_header H  \
              inner join hims_f_package_detail D\
              on H.hims_f_package_header_id=D.package_header_id where H.record_status='A'\
              and H.hospital_id=?  ${str};  `,
        values: [req.userIdentity.hospital_id, req.userIdentity.hospital_id],
        printQuery: true
      })
      .then(result => {
        let header = result[0];
        let details = result[1];
        const outputArray = [];
        header.forEach(item => {
          const package_details = details.filter(detail => {
            return (
              detail["package_header_id"] == item["hims_f_package_header_id"]
            );
          });

          outputArray.push({ ...item, package_details });
        });

        _mysql.releaseConnection();
        req.records = outputArray;
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

//Delete ordered services
let deleteOrderService = (req, res, next) => {
  try {
    const _mysql = new algaehMysql({ path: keyPath });
    try {
      let strQuery = "";
      let strQry = "";
      if (req.body.service_type == "LAB") {
        strQuery += _mysql.mysqlQueryFormat(
          "SELECT hims_f_lab_order_id from hims_f_lab_order where ordered_services_id=?;",
          [req.body.hims_f_ordered_services_id]
        );
      } else if (req.body.service_type == "RAD") {
        strQuery += _mysql.mysqlQueryFormat(
          "SELECT hims_f_rad_order_id from hims_f_rad_order where ordered_services_id=?;",
          [req.body.hims_f_ordered_services_id]
        );
      } else {
        strQuery += "SELECT 1;";
      }

      if (req.body.trans_package_detail_id != null) {
        strQuery += _mysql.mysqlQueryFormat(
          "SELECT utilized_qty,available_qty from hims_f_package_detail where hims_f_package_detail_id=?;",
          [req.body.trans_package_detail_id]
        );
      } else {
        strQuery += "SELECT 1;";
      }
      _mysql
        .executeQueryWithTransaction({
          query: strQuery,
          printQuery: true
        })
        .then(result => {
          let first_result = result[0][0];

          if (req.body.service_type == "LAB") {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_ord_analytes where order_id=?; DELETE FROM hims_f_lab_sample where order_id=?;\
              DELETE FROM hims_f_lab_order where hims_f_lab_order_id=?; DELETE FROM hims_f_ordered_services \
              where hims_f_ordered_services_id=?;",
              [
                first_result.hims_f_lab_order_id,
                first_result.hims_f_lab_order_id,
                first_result.hims_f_lab_order_id,
                req.body.hims_f_ordered_services_id
              ]
            );
          } else if (req.body.service_type == "RAD") {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_rad_order where hims_f_rad_order_id=?;\
              DELETE FROM hims_f_ordered_services where hims_f_ordered_services_id=?;",
              [
                first_result.hims_f_rad_order_id,
                req.body.hims_f_ordered_services_id
              ]
            );
          } else {
            strQry += _mysql.mysqlQueryFormat(
              "DELETE FROM hims_f_ordered_services where hims_f_ordered_services_id=?;",
              [req.body.hims_f_ordered_services_id]
            );
          }

          if (req.body.trans_package_detail_id != null) {
            let second_result = result[1][0];
            let utilized_qty =
              parseFloat(second_result.utilized_qty) -
              parseFloat(req.body.quantity);
            let available_qty =
              parseFloat(second_result.available_qty) +
              parseFloat(req.body.quantity);
            strQry += _mysql.mysqlQueryFormat(
              "UPDATE hims_f_package_detail set utilized_qty=?, available_qty=? \
              where hims_f_package_detail_id=?;",
              [utilized_qty, available_qty, req.body.trans_package_detail_id]
            );
          }

          _mysql
            .executeQuery({
              query: strQry,
              printQuery: true
            })
            .then(delete_result => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = delete_result;
                next();
              });
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  } catch (e) {
    next(e);
  }
};

let insertPhysiotherapyServices = (req, res, next) => {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };
    let Services =
      req.records.ResultOfFetchOrderIds == null
        ? req.body.billdetails
        : req.records.ResultOfFetchOrderIds;

    const physothServices = [
      ...new Set(
        new LINQ(Services)
          .Where(w => w.physiotherapy_service == "Y")
          .Select(s => {
            return {
              ordered_services_id: s.hims_f_ordered_services_id || null,
              patient_id: req.body.patient_id,
              referred_doctor_id: req.body.incharge_or_provider,
              visit_id: req.body.visit_id,
              billed: req.body.billed,
              ordered_date: s.created_date,
              hospital_id: req.userIdentity.hospital_id
            };
          })
          .ToArray()
      )
    ];

    const IncludeValues = [
      "ordered_services_id",
      "patient_id",
      "visit_id",
      "referred_doctor_id",
      "billed",
      "ordered_date",
      "hospital_id"
    ];

    if (physothServices.length > 0) {
      _mysql
        .executeQuery({
          query: "INSERT INTO hims_f_physiotherapy_header(??) VALUES ?",
          values: physothServices,
          includeValues: IncludeValues,
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(insert_physiotherapy => {
          next();
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      next();
    }
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
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
  load_orders_for_bill,
  addPackage,
  getPatientPackage,
  deleteOrderService,
  insertPhysiotherapyServices
};
