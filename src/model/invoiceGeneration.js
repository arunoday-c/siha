"use strict";
import extend from "extend";
import {
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen,
  whereCondition
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";
import Promise from "bluebird";

//created by irfan: to getVisitWiseBillDetailS
let getVisitWiseBillDetailS_BACKUP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_billing_header_id, patient_id, visit_id, bill_number, incharge_or_provider,\
          bill_date, advance_amount, advance_adjust, discount_amount, sub_total_amount, total_tax,\
           net_total, billing_status, copay_amount, deductable_amount, sec_copay_amount, sec_deductable_amount, \
           gross_total, sheet_discount_amount, sheet_discount_percentage, net_amount, patient_res, company_res, \
           sec_company_res, patient_payable, company_payable, sec_company_payable, patient_tax, company_tax, sec_company_tax,\
           net_tax, credit_amount, receiveable_amount, balance_due, receipt_header_id, cancel_remarks, cancel_by, bill_comments\
           from hims_f_billing_header where record_status='A' and visit_id=?",
        [req.query.visit_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            let outputArray = [];

            for (let i = 0; i < result.length; i++) {
              connection.query(
                "select hims_f_billing_details_id, hims_f_billing_header_id, service_type_id, services_id, quantity,\
                  unit_cost, insurance_yesno, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage,\
                  copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax,\
                    patient_resp, patient_payable, comapany_resp, company_payble, sec_company, sec_deductable_percentage, \
                    sec_deductable_amount, sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage,\
                    sec_copay_amount, pre_approval, commission_given from hims_f_billing_details where record_status='A'\
                    and hims_f_billing_header_id=?",
                [result[i]["hims_f_billing_header_id"]],
                (error, detailResult) => {
                  if (error) {
                    releaseDBConnection(db, connection);
                    next(error);
                  }

                  outputArray.push({ ...result[i], detailBill: detailResult });

                  if (i == result.length - 1) {
                    releaseDBConnection(db, connection);
                    req.records = outputArray;
                    next();
                  }
                }
              );
            }
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to getVisitWiseBillDetailS
let getVisitWiseBillDetailS = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_billing_header_id, patient_id, visit_id from hims_f_billing_header where record_status='A' and invoice_generated='N' and visit_id=?",
        [req.query.visit_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            let bill_header_ids = new LINQ(result)
              .Select(s => s.hims_f_billing_header_id)
              .ToArray();

            // select hims_f_billing_details_id, hims_f_billing_header_id, service_type_id, services_id, quantity,\
            // unit_cost, insurance_yesno, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage,\
            // copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax,\
            //   patient_resp, patient_payable, comapany_resp, company_payble, sec_company, sec_deductable_percentage, \
            //   sec_deductable_amount, sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage,\
            //   sec_copay_amount, pre_approval, commission_given from hims_f_billing_details where record_status='A'

            connection.query(
              "select hims_f_billing_details_id, hims_f_billing_header_id, BD.service_type_id ,ST.service_type, services_id,S.service_name, quantity,\
              unit_cost, insurance_yesno, gross_amount, discount_amout, discount_percentage, net_amout, copay_percentage,\
              copay_amount, deductable_amount, deductable_percentage, tax_inclusive, patient_tax, company_tax, total_tax,\
                patient_resp, patient_payable, comapany_resp, company_payble, sec_company, sec_deductable_percentage, \
                sec_deductable_amount, sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage,\
                sec_copay_amount, pre_approval, commission_given from hims_f_billing_details BD,hims_d_service_type ST,hims_d_services S\
                where BD.record_status='A' and ST.record_status='A' and S.record_status='A' and \
                BD.service_type_id=ST.hims_d_service_type_id and BD.services_id=S.hims_d_services_id\
                    and hims_f_billing_header_id in (?)",
              [bill_header_ids],
              (error, detailResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }

                releaseDBConnection(db, connection);
                req.records = detailResult;
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = result;
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Insert Invoice Generation
let addInvoiceGeneration = (req, res, next) => {
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
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        let requestCounter = 1;

        return new Promise((resolve, reject) => {
          runningNumberGen({
            db: connection,
            counter: requestCounter,
            module_desc: ["INV_NUM"],
            onFailure: error => {
              reject(error);
            },
            onSuccess: result => {
              resolve(result);
            }
          });
        }).then(result => {
          let documentCode = result[0].completeNumber;
          debugLog("documentCode:", documentCode);
          debugLog("input:", input);
          let today = moment().format("YYYY-MM-DD");
          debugLog("input:", input);
          connection.query(
            "INSERT INTO `hims_f_invoice_header` (invoice_number,invoice_date,patient_id,visit_id,gross_amount,discount_amount,\
              net_amount, patient_resp,patient_tax, patient_payable, company_resp, company_tax, company_payable, \
              sec_company_resp, sec_company_tax, sec_company_payable,insurance_provider_id, sub_insurance_id, network_id, network_office_id, \
              created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              documentCode,
              new Date(input.invoice_date),
              input.patient_id,
              input.visit_id,
              input.gross_amount,
              input.discount_amount,
              input.net_amount,
              input.patient_resp,
              input.patient_tax,
              input.patient_payable,
              input.company_resp,
              input.company_tax,
              input.company_payable,
              input.sec_company_resp,
              input.sec_company_tax,
              input.sec_company_payable,

              input.insurance_provider_id,
              input.sub_insurance_id,
              input.network_id,
              input.network_office_id,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ],
            (error, headerResult) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (headerResult.insertId != null) {
                const insurtColumns = [
                  "bill_header_id",
                  "bill_detail_id",
                  "service_type_id",
                  "service_id",
                  "quantity",
                  "gross_amount",
                  "discount_amount",
                  "net_amount",
                  "patient_resp",
                  "patient_tax",
                  "patient_payable",
                  "company_resp",
                  "company_tax",
                  "company_payable",
                  "sec_company_resp",
                  "sec_company_tax",
                  "sec_company_payable"
                ];

                connection.query(
                  "INSERT INTO hims_f_invoice_details(" +
                    insurtColumns.join(",") +
                    ",invoice_header_id) VALUES ?",
                  [
                    jsonArrayToObject({
                      sampleInputObject: insurtColumns,
                      arrayObj: req.body.Invoice_Detail,
                      newFieldToInsert: [headerResult.insertId],
                      req: req
                    })
                  ],
                  (error, detailResult) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    let _tempBillHeaderIds = new LINQ(req.body.Invoice_Detail)
                      .Select(s => s.hims_f_billing_header_id)
                      .ToArray();

                    let billHeaderIds = _tempBillHeaderIds.filter(
                      (item, pos) => {
                        return _tempBillHeaderIds.indexOf(item) == pos;
                      }
                    );

                    if (detailResult.affectedRows > 0) {
                      connection.query(
                        "UPDATE hims_f_billing_header SET invoice_generated = 'Y' ,updated_date=?, updated_by=?\
                      WHERE record_status='A' and  hims_f_billing_header_id in (?);\
                      UPDATE hims_f_patient_visit SET invoice_generated='Y',visit_status='C',updated_date=?, updated_by=? WHERE record_status='A' and hims_f_patient_visit_id = ?; ",
                        [
                          new Date(),
                          input.updated_by,
                          billHeaderIds,
                          new Date(),
                          input.updated_by,
                          input.visit_id
                        ],
                        (error, invoiceFlagResult) => {
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
                            req.records = {
                              invoice_number: documentCode,
                              hims_f_invoice_header_id: headerResult.insertId
                            };
                            next();
                          });
                        }
                      );
                    } else {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        req.records = { error: "error occured" };
                        next();
                      });
                    }

                    // connection.commit(error => {
                    //   if (error) {
                    //     connection.rollback(() => {
                    //       releaseDBConnection(db, connection);
                    //       next(error);
                    //     });
                    //   }
                    //   releaseDBConnection(db, connection);
                    //   req.records = {
                    //     invoice_number: documentCode,
                    //     hims_f_invoice_header_id: headerResult.insertId
                    //   };
                    //   next();
                    // });
                  }
                );
              } else {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get Pharmacy Requisition Entry
let getInvoiceGeneration = (req, res, next) => {
  let selectWhere = {
    invoice_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    debugLog("where", where);
    db.getConnection((error, connection) => {
      connection.query(
        "SELECT * from  hims_f_invoice_header\
          where " +
          where.condition,
        where.values,
        (error, headerResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          debugLog("result: ", headerResult);
          if (headerResult.length != 0) {
            debugLog(
              "hims_f_invoice_header_id: ",
              headerResult[0].hims_f_invoice_header_id
            );
            connection.query(
              "select * from hims_f_invoice_details where invoice_header_id=?",
              headerResult[0].hims_f_invoice_header_id,
              (error, Invoice_Detail) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = {
                  ...headerResult[0],
                  ...{ Invoice_Detail }
                };
                releaseDBConnection(db, connection);
                next();
              }
            );
          } else {
            req.records = headerResult;
            releaseDBConnection(db, connection);
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: to backup on 15/dec/2018
let getInvoicesForClaimsBACKUP = (req, res, next) => {
  let selectWhere = {
    sub_insurance_id: "ALL"
  };

  if (
    req.query.patient_id != "null" ||
    (req.query.from_date != "null" && req.query.to_date != "null") ||
    req.query.sub_insurance_id != "null" ||
    req.query.insurance_provider_id != "null"
  ) {
    if (req.query.patient_id != "null" && req.query.patient_id != undefined) {
      req.query["IH.patient_id"] = req.query.patient_id;
    }
    delete req.query.patient_id;

    if (
      req.query.insurance_provider_id != "null" &&
      req.query.insurance_provider_id != undefined
    ) {
      req.query["IH.insurance_provider_id"] = req.query.insurance_provider_id;
    }
    delete req.query.insurance_provider_id;

    let invoice_date = "";

    if (
      req.query.from_date != "null" &&
      req.query.to_date != "null" &&
      req.query.from_date != undefined &&
      req.query.to_date != undefined
    ) {
      invoice_date = ` date(invoice_date) between date('${
        req.query.from_date
      }') and date('${req.query.to_date}') and `;
    }
    delete req.query.from_date;
    delete req.query.to_date;
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }

      let db = req.db;

      let where = whereCondition(extend(selectWhere, req.query));

      db.getConnection((error, connection) => {
        connection.query(
          "SELECT hims_f_invoice_header_id, invoice_number, invoice_date, IH.patient_id, visit_id,\
         IH.insurance_provider_id, IH.sub_insurance_id, IH.network_id, IH.network_office_id, gross_amount,\
         discount_amount, patient_resp, patient_tax, patient_payable, company_resp, company_tax, \
         company_payable, sec_company_resp, sec_company_tax, sec_company_payable, submission_date,\
         submission_ammount, remittance_date, remittance_ammount, denial_ammount,\
         P.patient_code,P.full_name as patient_name,P.arabic_name as arabic_patient_name,P.contact_number ,\
         V.visit_code,insurance_provider_name,arabic_provider_name as arabic_insurance_provider_name ,\
         insurance_sub_code as sub_insurance_provider_code,insurance_sub_name as sub_insurance_provider,\
         arabic_sub_name as arabic_sub_insurance_provider, network_type,arabic_network_type,\
         NET_OF.price_from,NET_OF.employer,NET_OF.policy_number\
        from  hims_f_invoice_header IH  inner join hims_f_patient P on IH.patient_id=P.hims_d_patient_id and\
        P.record_status='A'  inner join hims_f_patient_visit V on IH.visit_id=V.hims_f_patient_visit_id and\
        V.record_status='A' left join hims_d_insurance_provider IP on IH.insurance_provider_id=IP.hims_d_insurance_provider_id\
        and IP.record_status='A' left join hims_d_insurance_sub SI on IH.sub_insurance_id=SI.hims_d_insurance_sub_id\
        and SI.record_status='A' left join hims_d_insurance_network NET on IH.network_id=NET.hims_d_insurance_network_id\
        and NET.record_status='A' left join hims_d_insurance_network_office NET_OF on IH.network_office_id=NET_OF.hims_d_insurance_network_office_id\
        and NET_OF.record_status='A' where " +
            invoice_date +
            where.condition,
          where.values,

          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            let outputArray = [];
            if (result.length > 0) {
              for (let i = 0; i < result.length; i++) {
                connection.query(
                  "SELECT hims_f_invoice_details_id, invoice_header_id, bill_header_id, bill_detail_id,\
                  service_id, quantity, gross_amount, discount_amount, patient_resp, patient_tax, patient_payable,\
                  company_resp, company_tax, company_payable, sec_company_resp, sec_company_tax, sec_company_payable,\
                  ID.service_type_id,ST.service_type_code, ST.service_type, ST. arabic_service_type,\
                  S.cpt_code,C.cpt_desc,C.prefLabel  \
                  from hims_f_invoice_details ID  inner join hims_d_service_type ST on \
                   ID.service_type_id=ST.hims_d_service_type_id inner join hims_d_services S on\
                     ID.service_id=S.hims_d_services_id  left join hims_d_cpt_code C on S.cpt_code=C.cpt_code\
                  where invoice_header_id=?",
                  [result[i].hims_f_invoice_header_id],

                  (error, invoiceDetails) => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }

                    outputArray.push({ ...result[i], invoiceDetails });

                    if (i == result.length - 1) {
                      releaseDBConnection(db, connection);
                      req.records = outputArray;
                      next();
                    }
                  }
                );
              }
            } else {
              releaseDBConnection(db, connection);
              req.records = result;
              next();
            }
          }
        );
      });
    } catch (e) {
      next(e);
    }
  } else {
    req.records = { invalid_input: true };
    next();
  }
};

//created by irfan:
let getInvoicesForClaims = (req, res, next) => {
  let selectWhere = {
    sub_insurance_id: "ALL"
  };

  if (
    req.query.patient_id != "null" ||
    (req.query.from_date != "null" && req.query.to_date != "null") ||
    req.query.sub_insurance_id != "null" ||
    req.query.insurance_provider_id != "null"
  ) {
    if (req.query.patient_id != "null" && req.query.patient_id != undefined) {
      req.query["IH.patient_id"] = req.query.patient_id;
    }
    delete req.query.patient_id;

    if (
      req.query.insurance_provider_id != "null" &&
      req.query.insurance_provider_id != undefined
    ) {
      req.query["IH.insurance_provider_id"] = req.query.insurance_provider_id;
    }
    delete req.query.insurance_provider_id;

    let invoice_date = "";

    if (
      req.query.from_date != "null" &&
      req.query.to_date != "null" &&
      req.query.from_date != undefined &&
      req.query.to_date != undefined
    ) {
      invoice_date = ` date(invoice_date) between date('${
        req.query.from_date
      }') and date('${req.query.to_date}') and `;
    }
    delete req.query.from_date;
    delete req.query.to_date;
    try {
      if (req.db == null) {
        next(httpStatus.dataBaseNotInitilizedError());
      }

      let db = req.db;

      let where = whereCondition(extend(selectWhere, req.query));

      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
            "SELECT hims_f_invoice_header_id, invoice_number, invoice_date, IH.patient_id, visit_id,\
            IH.insurance_provider_id, IH.sub_insurance_id, IH.network_id, IH.network_office_id, gross_amount,\
            discount_amount, patient_resp, patient_tax, patient_payable, company_resp, company_tax, \
            company_payable, sec_company_resp, sec_company_tax, sec_company_payable, submission_date,\
            submission_ammount, remittance_date, remittance_ammount, denial_ammount,claim_validated,\
            P.patient_code,P.full_name as patient_name,P.arabic_name as arabic_patient_name,P.contact_number ,\
            V.visit_code,V.episode_id,V.doctor_id,E.full_name as doctor_name,E.employee_code,insurance_provider_name,\
            arabic_provider_name as arabic_insurance_provider_name ,\
            insurance_sub_code as sub_insurance_provider_code,insurance_sub_name as sub_insurance_provider,\
            arabic_sub_name as arabic_sub_insurance_provider, network_type,arabic_network_type,\
            NET_OF.price_from,NET_OF.employer,NET_OF.policy_number\
           from  hims_f_invoice_header IH  inner join hims_f_patient P on IH.patient_id=P.hims_d_patient_id and\
           P.record_status='A'  inner join hims_f_patient_visit V on IH.visit_id=V.hims_f_patient_visit_id and\
           V.record_status='A' inner join hims_d_employee E on V.doctor_id=E.hims_d_employee_id and E.record_status='A'         \
           left join hims_d_insurance_provider IP on IH.insurance_provider_id=IP.hims_d_insurance_provider_id\
           and IP.record_status='A' left join hims_d_insurance_sub SI on IH.sub_insurance_id=SI.hims_d_insurance_sub_id\
           and SI.record_status='A' left join hims_d_insurance_network NET on IH.network_id=NET.hims_d_insurance_network_id\
           and NET.record_status='A' left join hims_d_insurance_network_office NET_OF on IH.network_office_id=NET_OF.hims_d_insurance_network_office_id\
           and NET_OF.record_status='A' where " +
              invoice_date +
              where.condition,
            where.values,

            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              let outputArray = [];
              if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                  connection.query(
                    "SELECT hims_f_invoice_details_id, invoice_header_id, bill_header_id, bill_detail_id,\
                  service_id, quantity, gross_amount, discount_amount, patient_resp, patient_tax, patient_payable,\
                  company_resp, company_tax, company_payable, sec_company_resp, sec_company_tax, sec_company_payable,\
                  ID.service_type_id,ST.service_type_code, ST.service_type, ST. arabic_service_type,\
                  S.cpt_code,C.cpt_desc,C.prefLabel  \
                  from hims_f_invoice_details ID  inner join hims_d_service_type ST on \
                   ID.service_type_id=ST.hims_d_service_type_id inner join hims_d_services S on\
                     ID.service_id=S.hims_d_services_id  left join hims_d_cpt_code C on S.cpt_code=C.cpt_code\
                  where invoice_header_id=?",
                    [result[i].hims_f_invoice_header_id],

                    (error, invoiceDetails) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }

                      connection.query(
                        "select hims_f_invoice_icd_id, invoice_header_id from hims_f_invoice_icd \
                        where record_status='A' and invoice_header_id=?",
                        [result[i].hims_f_invoice_header_id],

                        (error, invoiceICD) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }
                          if (invoiceICD.length > 0) {
                            // go ahead next
                            // and commit
                            debugLog("invoiceICD:", invoiceICD);

                            outputArray.push({ ...result[i], invoiceDetails });

                            if (i == result.length - 1) {
                              connection.commit(error => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                releaseDBConnection(db, connection);
                                req.records = outputArray;
                                next();
                              });
                            }
                          } else {
                            connection.query(
                              "select hims_f_patient_diagnosis_id, patient_id, episode_id, daignosis_id, diagnosis_type, final_daignosis\
                             from hims_f_patient_diagnosis where record_status='A' and episode_id=? and patient_id=?",
                              [result[i].episode_id, result[i].patient_id],

                              (error, patientDiagnosys) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                debugLog("patientDiagnosys:", patientDiagnosys);
                                if (patientDiagnosys.length > 0) {
                                  debugLog("asfetr");
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
                                    "INSERT INTO hims_f_invoice_icd(" +
                                      insurtColumns.join(",") +
                                      ",invoice_header_id,created_date,updated_date) VALUES ?",
                                    [
                                      jsonArrayToObject({
                                        sampleInputObject: insurtColumns,
                                        arrayObj: patientDiagnosys,
                                        newFieldToInsert: [
                                          result[i].hims_f_invoice_header_id,
                                          new Date(),
                                          new Date()
                                        ],
                                        req: req
                                      })
                                    ],
                                    (error, addDiagnosys) => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }
                                      //----------------- commit
                                      debugLog("addDiagnosys:", addDiagnosys);
                                      outputArray.push({
                                        ...result[i],
                                        invoiceDetails
                                      });

                                      if (i == result.length - 1) {
                                        connection.commit(error => {
                                          if (error) {
                                            connection.rollback(() => {
                                              releaseDBConnection(
                                                db,
                                                connection
                                              );
                                              next(error);
                                            });
                                          }

                                          releaseDBConnection(db, connection);
                                          req.records = outputArray;
                                          next();
                                        });
                                      }
                                    }
                                  );
                                } else {
                                  outputArray.push({
                                    ...result[i],
                                    invoiceDetails
                                  });

                                  if (i == result.length - 1) {
                                    connection.commit(error => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }

                                      releaseDBConnection(db, connection);
                                      req.records = outputArray;
                                      next();
                                    });
                                  }
                                }
                              }
                            );
                          }
                        }
                      );
                      ///============================================

                      //----------------------------------------------------
                    }
                  );
                }
              } else {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              }
            }
          );
        });
      });
    } catch (e) {
      next(e);
    }
  } else {
    req.records = { invalid_input: true };
    next();
  }
};

//created by irfan:
let getPatientIcdForInvoice = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (
      req.query.invoice_header_id != "null" &&
      req.query.invoice_header_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          " select hims_f_invoice_icd_id, invoice_header_id, patient_id, episode_id,\
        daignosis_id, diagnosis_type, final_daignosis,ICD.icd_code,ICD.icd_description,\
        ICD.icd_level,ICD.icd_type from hims_f_invoice_icd INV,hims_d_icd ICD \
        where INV.record_status='A' and ICD.record_status='A' and  INV.daignosis_id=ICD.hims_d_icd_id and \
        invoice_header_id=?",
          [req.query.invoice_header_id],
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
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getVisitWiseBillDetailS,
  addInvoiceGeneration,
  getInvoiceGeneration,
  getInvoicesForClaims,
  getPatientIcdForInvoice
};
