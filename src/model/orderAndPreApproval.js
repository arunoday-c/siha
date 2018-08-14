"use strict";
import extend from "extend";
import {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import moment from "moment";

import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";

import { logger, debugFunction, debugLog } from "../utils/logging";

//created by irfan: insert ordered services and pre-approval services for insurance
let oldinsert = (req, res, next) => {
  const insurtColumns = [
    "patient_id",
    "visit_id",
    "doctor_id",
    "service_type_id",
    "services_id",
    "insurance_yesno",
    "insurance_company",
    "insurance_sub_company",
    "network_id",
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
    "created_by",
    "updated_by"
  ];

  debugFunction("insertOrderedServices");
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
            ") VALUES ?",
          [
            jsonArrayToObject({
              sampleInputObject: insurtColumns,
              arrayObj: req.body
            })
          ],
          (error, resultOrder) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            let servicesForPreAproval = new LINQ(req.body)
              .Where(g => g.pre_approval == "Y")
              .ToArray();

            //if request for pre-aproval needed
            if (servicesForPreAproval.length > 0) {
              const insurtCols = [
                "service_id",
                "insurance_provider_id",
                "insurance_network_office_id",
                "icd_code",
                "requested_date",
                "requested_by",
                "requested_mode",
                "requested_quantity",
                "submission_type",
                "insurance_service_name",
                "doctor_id",
                "patient_id",
                "refer_no",
                "gross_amt",
                "net_amount",
                "approved_amount",
                "approved_no",
                "apprv_remarks",
                "apprv_date",
                "rejected_reason",
                "apprv_status",
                "created_by",
                "updated_by"
              ];

              connection.query(
                "INSERT INTO hims_f_service_approval(" +
                  insurtCols.join(",") +
                  ") VALUES ?",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtCols,
                    arrayObj: servicesForPreAproval,
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
                      }
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

                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    req.records = resultPreAprvl;
                    next();
                  });
                }
              );
            } else {
              connection.commit(error => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }
                req.records = resultOrder;
                next();
              });
              // req.records = result;
              // next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan: check pre-aproval status and get PreAproval List
let getPreAprovalList = (req, res, next) => {
  let preAprovalWhere = {
    service_id: "ALL",
    doctor_id: "ALL",
    patient_id: "ALL"
  };

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    req.query["date(SA.created_date)"] = req.query.created_date;
    delete req.query.created_date;

    debugLog("req query:", req.query);

    let where = whereCondition(extend(preAprovalWhere, req.query));

    debugLog("where conditn:", where);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }
      db.query(
        "SELECT hims_f_service_approval_id,ordered_services_id,insurance_provider_id,insurance_network_office_id, service_id,SR.service_code, icd_code, requested_date, requested_by, requested_mode,\
        requested_quantity, submission_type, insurance_service_name, doctor_id, patient_id, PAT.patient_code,PAT.full_name, refer_no, gross_amt,\
        net_amount, approved_amount, approved_no, apprv_remarks, apprv_date, rejected_reason, apprv_status,SA.created_date,SA.created_by\
        from ((hims_f_service_approval SA inner join hims_f_patient PAT ON SA.patient_id=PAT.hims_d_patient_id) inner join hims_d_services SR on SR.hims_d_services_id=SA.service_id) WHERE SA.record_status='A' AND " +
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
  const insurtCols = [
    "service_id",
    "insurance_provider_id",
    "insurance_network_office_id",
    "icd_code",
    "insurance_service_name",
    "doctor_id",
    "patient_id",
    "gross_amt",
    "net_amount",
    "created_by",
    "updated_by"
  ];
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
        qry +=
          " UPDATE `hims_f_service_approval` SET service_id='" +
          inputParam[i].service_id +
          "',insurance_provider_id='" +
          inputParam[i].insurance_provider_id +
          "',insurance_network_office_id=\
'" +
          inputParam[i].insurance_network_office_id +
          "', icd_code='" +
          inputParam[i].icd_code +
          "',insurance_service_name=\
'" +
          inputParam[i].insurance_service_name +
          "',doctor_id='" +
          inputParam[i].doctor_id +
          "',patient_id='" +
          inputParam[i].patient_id +
          "'\
,gross_amt='" +
          inputParam[i].gross_amt +
          "',net_amount='" +
          inputParam[i].net_amount +
          "',requested_date=\
          '" +
          inputParam[i].requested_date +
          "',requested_by=\
          '" +
          inputParam[i].requested_by +
          "',requested_mode=\
          '" +
          inputParam[i].requested_mode +
          "',requested_quantity=\
          '" +
          inputParam[i].requested_quantity +
          "',submission_type=\
          '" +
          inputParam[i].submission_type +
          "',refer_no=\
          '" +
          inputParam[i].refer_no +
          "',approved_amount=\
          '" +
          inputParam[i].approved_amount +
          "',apprv_remarks=\
          '" +
          inputParam[i].apprv_remarks +
          "',apprv_date=\
          '" +
          inputParam[i].apprv_date +
          "',rejected_reason=\
          '" +
          inputParam[i].rejected_reason +
          "',apprv_status=\
          '" +
          inputParam[i].apprv_status +
          "',updated_date='" +
          new Date() +
          "',updated_by='" +
          inputParam[i].updated_by +
          "' WHERE hims_f_service_approval_id='" +
          inputParam[i].hims_f_service_approval_id +
          "';";
      }

      connection.query(qry, (error, result) => {
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

//created by irfan: insert ordered services and pre-approval services for insurance
let insertOrderedServices = (req, res, next) => {
  const insurtColumns = [
    "patient_id",
    "visit_id",
    "doctor_id",
    "service_type_id",
    "services_id",
    "insurance_yesno",
    "insurance_company",
    "insurance_sub_company",
    "network_id",
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
    "created_by",
    "updated_by"
  ];

  debugFunction("add order");
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
            ") VALUES ?",
          [
            jsonArrayToObject({
              sampleInputObject: insurtColumns,
              arrayObj: req.body
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

            let services = new LINQ(req.body)
              .Where(g => g.pre_approval == "Y")
              .Select(s => {
                patient_id = s.patient_id;
                doctor_id = s.doctor_id;
                visit_id = s.visit_id;
                return s.services_id;
              })
              .ToArray();

            servicesForPreAproval.push(patient_id);
            servicesForPreAproval.push(doctor_id);
            servicesForPreAproval.push(visit_id);
            servicesForPreAproval.push(services);

            debugLog(" servicesForPreAproval", servicesForPreAproval);

            connection.query(
              "SELECT hims_f_ordered_services_id,services_id from hims_f_ordered_services\
                 where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
              servicesForPreAproval,
              (error, ResultOfFetchOrderIds) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                debugLog("Query ", connection);
                debugLog("Results are recorded...", ResultOfFetchOrderIds);

                let detailsPush = new LINQ(req.body)
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
                    "gross_amt",
                    "net_amount",
                    "created_by",
                    "updated_by"
                  ];

                  connection.query(
                    "INSERT INTO hims_f_service_approval(" +
                      insurtCols.join(",") +
                      ") VALUES ?",
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

                      connection.commit(error => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }
                        req.records = resultPreAprvl;
                        next();
                      });
                    }
                  );
                } else {
                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    req.records = resultOrder;
                    next();
                  });
                  // req.records = result;
                  // next();
                }

                // req.records = detailsPush;
                // next();
              }
            );
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

let selectOrderServices = (req, res, next) => {
  let selectWhere = {
    visit_id: "ALL"
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

module.exports = {
  insertOrderedServices,
  getPreAprovalList,
  updatePreApproval,
  selectOrderServices
};
