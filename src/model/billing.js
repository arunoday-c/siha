import httpStatus from "../utils/httpStatus";
import extend from "extend";
import { whereCondition, runningNumber, releaseDBConnection } from "../utils";
import moment from "moment";
import { debugLog, debugFunction } from "../utils/logging";

import { LINQ } from "node-linq";
let billingHeaderModel = {
  hims_f_billing_header_id: null,
  patient_id: null,
  billing_type_id: null,
  visit_id: null,
  bill_number: null,
  incharge_or_provider: null,
  bill_date: null,
  advance_amount: null,
  discount_amount: null,
  sub_total_amount: null,
  total_tax: null,
  net_total: null,
  billing_status: null,
  copay_amount: null,
  deductable_amount: null,
  gross_total: null,
  sheet_discount_amount: null,
  sheet_discount_percentage: null,
  net_amount: null,
  patient_res: null,
  company_res: null,
  sec_company_res: null,
  patient_payable: null,
  company_payable: null,
  sec_company_payable: null,
  patient_tax: null,
  company_tax: null,
  sec_company_tax: null,
  net_tax: null,
  credit_amount: null,
  receiveable_amount: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null,
  cancel_remarks: null,
  cancel_by: null,
  bill_comments: null
};
let billingDetailsModel = {
  hims_f_billing_details_id: null,
  hims_f_billing_header_id: null,
  service_type_id: null,
  services_id: null,
  quantity: null,
  unit_cost: null,
  insurance_yesno: null,
  gross_amount: null,
  discount_amout: null,
  discount_percentage: null,
  net_amout: null,
  copay_percentage: null,
  copay_amount: null,
  deductable_amount: null,
  deductable_percentage: null,
  tax_inclusive: null,
  patient_tax: null,
  company_tax: null,
  total_tax: null,
  patient_resp: null,
  patient_payable: null,
  comapany_resp: null,
  company_payble: null,
  sec_company: null,
  sec_deductable_percentage: null,
  sec_deductable_amount: null,
  sec_company_res: null,
  sec_company_tax: null,
  sec_company_paybale: null,
  sec_copay_percntage: null,
  sec_copay_amount: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null
};
let servicesModel = {
  hims_d_services_id: null,
  service_code: null,
  cpt_code: null,
  service_name: null,
  service_desc: null,
  sub_department_id: null,
  hospital_id: null,
  service_type_id: null,
  standard_fee: null,
  discount: null,
  effective_start_date: null,
  effectice_end_date: null,
  created_by: null,
  created_date: null,
  updated_by: null,
  updated_date: null,
  record_status: null
};

let addBilling = (req, res, next) => {
  let dataBase = null;
  try {
    debugFunction("addBilling");
    let db = dataBase != null ? dataBase : req.db;
    if (db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let inputParam = extend(billingHeaderModel, req.body);

    if (inputParam.details == null || inputParam.details.length == 0) {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service."
        )
      );
    }

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

        connection.query(
          "select hims_f_patient_visit_id,visit_expiery_date from hims_f_patient_visit where hims_f_patient_visit_id=? \
           and record_status='A'",
          [inputParam.hims_f_patient_visit_id],
          (error, records) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }
            let fromDate;
            let toDate;
            fromDate = moment(records[0].visit_expiery_date).format("YYYYMMDD");
            toDate = moment(new Date()).format("YYYYMMDD");

            if (toDate > fromDate) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(
                  httpStatus.generateError(
                    httpStatus.badRequest,
                    "Visit expired please create new visit to process"
                  )
                );
              });
            } else {
              runningNumber(
                connection,
                3,
                "PAT_BILL",
                (error, records, newNumber) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  debuglog("new Bill number : " + newNumber);
                  inputParam["bill_number"] = newNumber;

                  inputParam.sub_total_amount = new LINQ(
                    inputParam.details
                  ).Sum(d => d.gross_amount);
                  inputParam.net_total = new LINQ(inputParam.details).Sum(
                    d => d.net_amount
                  );
                  inputParam.discount_amount = new LINQ(inputParam.details);
                  Sum(d => d.discount_amout);

                  inputParam.total_tax = new LINQ(inputParam.details).Sum(
                    d => d.total_tax
                  );
                  inputParam.patient_tax = new LINQ(inputParam.details).Sum(
                    d => d.patient_tax
                  );
                  inputParam.company_tax = new LINQ(inputParam.details).Sum(
                    d => d.company_tax
                  );
                  inputParam.gross_total = new LINQ(inputParam.details).Sum(
                    d => d.net_amount
                  );
                  inputParam.copay_amount = new LINQ(inputParam.details).Sum(
                    d => d.copay_amount
                  );

                  inputParam.deductable_amount = new LINQ(
                    inputParam.details
                  ).Sum(d => d.deductable_amount);

                  inputParam.patient_resp = new LINQ(inputParam.details).Sum(
                    d => d.deductable_amount
                  );
                  inputParam.company_res = new LINQ(inputParam.details).Sum(
                    d => d.comapany_resp
                  );
                  inputParam.company_res = new LINQ(inputParam.details).Sum(
                    d => d.comapany_resp
                  );
                  inputParam.sec_company_res = new LINQ(inputParam.details).Sum(
                    d => d.sec_company_res
                  );
                  inputParam.patient_payable = new LINQ(inputParam.details).Sum(
                    d => d.patient_payable
                  );
                  inputParam.company_payable = new LINQ(inputParam.details).Sum(
                    d => d.company_payable
                  );
                  inputParam.sec_company_payable = new LINQ(
                    inputParam.details
                  ).Sum(d => d.sec_company_payable);
                  inputParam.sec_company_tax = new LINQ(inputParam.details).Sum(
                    d => d.sec_company_tax
                  );
                  inputParam.sheet_discount_amount =
                    inputParam.sheet_discount_percentage /
                    100 /
                    inputParam.gross_amount;
                  inputParam.net_amount =
                    inputParam.gross_total - inputParam.sheet_discount_amount;
                  inputParam.receiveable_amount =
                    inputParam.net_amount - inputParam.credit_amount;

                  if (
                    inputParam.sheet_discount_amount != 0 &&
                    inputParam.bill_comments == ""
                  ) {
                    next(
                      httpStatus.generateError(
                        httpStatus.badRequest,
                        "Please enter sheet level discount comments. "
                      )
                    );
                  }

                  connection.query(
                    "insert into hims_f_billing_header(patient_id, billing_type_id, visit_id, bill_number \
                  , incharge_or_provider, bill_date, advance_amount, discount_amount, discount_percentage, total_amount \
                  , total_tax, total_payable, billing_status, sheet_discount_amount, sheet_discount_percentage, net_amount \
                  , patient_resp, company_res, sec_company_res, patient_payable, company_payable, sec_company_payable \
                  , patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount \
                  , created_by, created_date, updated_by, updated_date, copay_amount, deductable_amount)vlaue(?,?,?,?\
                    ,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'" +
                      new Date() +
                      "'\
                  ,'" +
                      inputParam.created_by +
                      "','" +
                      new Date() +
                      "',?,?)",
                    [
                      patient_id,
                      inputParam.billing_type_id,
                      inputParam.visit_id,
                      inputParam.bill_number,
                      inputParam.incharge_or_provider,
                      inputParam.bill_date,
                      inputParam.advance_amount,
                      inputParam.discount_amount,
                      inputParam.discount_percentage,
                      inputParam.total_amount,
                      inputParam.total_tax,
                      inputParam.total_payable,
                      inputParam.billing_status,
                      inputParam.sheet_discount_amount,
                      inputParam.sheet_discount_percentage,
                      inputParam.net_amount,
                      inputParam.patient_resp,
                      inputParam.company_res,
                      inputParam.sec_company_res,
                      inputParam.patient_payable,
                      inputParam.company_payable,
                      inputParam.sec_company_payable,
                      inputParam.patient_tax,
                      inputParam.company_tax,
                      inputParam.sec_company_tax,
                      inputParam.net_tax,
                      inputParam.credit_amount,
                      inputParam.receiveable_amount,
                      inputParam.created_by,
                      inputParam.copay_amount,
                      inputParam.deductable_amount
                    ],
                    (error, headerResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      if (
                        headerResult.insertId != nll &&
                        headerResult.insertId != ""
                      ) {
                        let detailsInsert = [];
                        for (let i = 0; i < inputParam.details.length; i++) {
                          detailsInsert.push([inputParam.details[i]]);
                        }

                        connection.query(
                          "insert into hims_f_billing_details (hims_f_billing_header_id, service_type_id,\
                           services_id, quantity, unit_cost, gross_amount, discount_amout, \
                           discount_percentage, net_amout, copay_percentage, copay_amount, \
                           deductable_amount, deductable_percentage, tax_inclusive, patient_tax, \
                           company_tax, total_tax, patient_resp, patient_payable, comapany_resp,\
                           company_payble, sec_company, sec_deductable_percentage, sec_deductable_amount,\
                           sec_company_res, sec_company_tax, sec_company_paybale, sec_copay_percntage, \
                           sec_copay_amount, created_by, created_date, updated_by, updated_date) VALUES ? ",
                          detailsInsert,
                          (error, detailsRecords) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            connection.commit(error => {
                              releaseDBConnection(db, connection);
                              if (error) {
                                connection.rollback(() => {
                                  next(error);
                                });
                              }
                              req.records = result;
                              next();
                            });
                          }
                        );
                      } else {
                        debuglog("Data is not inerted to billing header");
                        next(
                          httpStatus.generateError(
                            httpStatus.badRequest,
                            "Technical issue while billis notinserted"
                          )
                        );
                      }
                    }
                  );
                }
              );
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

let billingCalculations = (req, res, next) => {
  try {
    let inputParam = req.body;
    if (inputParam.length == 0) {
      next(
        httpStatus.generateError(
          httpStatus.badRequest,
          "Please select atleast one service"
        )
      );
    }
    let sendingObject = {};
    sendingObject.sub_total_amount = new LINQ(inputParam).Sum(
      d => d.gross_amount
    );
    sendingObject.net_total = new LINQ(inputParam).Sum(d => d.net_amount);
    sendingObject.discount_amount = new LINQ(inputParam);
    Sum(d => d.discount_amout);

    sendingObject.total_tax = new LINQ(inputParam).Sum(d => d.total_tax);
    sendingObject.patient_tax = new LINQ(inputParam).Sum(d => d.patient_tax);
    sendingObject.company_tax = new LINQ(inputParam).Sum(d => d.company_tax);
    sendingObject.gross_total = new LINQ(inputParam).Sum(d => d.net_amount);
    sendingObject.copay_amount = new LINQ(inputParam).Sum(d => d.copay_amount);

    sendingObject.deductable_amount = new LINQ(inputParam).Sum(
      d => d.deductable_amount
    );

    sendingObject.patient_resp = new LINQ(inputParam).Sum(
      d => d.deductable_amount
    );
    sendingObject.company_res = new LINQ(inputParam).Sum(d => d.comapany_resp);
    sendingObject.company_res = new LINQ(inputParam).Sum(d => d.comapany_resp);
    sendingObject.sec_company_res = new LINQ(inputParam).Sum(
      d => d.sec_company_res
    );
    sendingObject.patient_payable = new LINQ(inputParam).Sum(
      d => d.patient_payable
    );
    sendingObject.company_payable = new LINQ(inputParam).Sum(
      d => d.company_payable
    );
    sendingObject.sec_company_payable = new LINQ(inputParam).Sum(
      d => d.sec_company_payable
    );
    sendingObject.sec_company_tax = new LINQ(inputParam).Sum(
      d => d.sec_company_tax
    );
    sendingObject.sheet_discount_amount =
      sendingObject.sheet_discount_percentage /
      100 /
      sendingObject.gross_amount;
    sendingObject.net_amount =
      sendingObject.gross_total - sendingObject.sheet_discount_amount;
    sendingObject.receiveable_amount =
      sendingObject.net_amount - sendingObject.credit_amount;
    req.records = sendingObject;
    next();
  } catch (e) {
    next(e);
  }
};


//created by irfan: functionality for calculating bill headder and bill details
let getBillDetails = (req, res, next) => {
  debugFunction("getBillDetails");
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let servicesDetails = extend(servicesModel, req.body);
    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "SELECT * FROM `hims_d_services` WHERE `hims_d_services_id`=? ",
        [servicesDetails.hims_d_services_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          let records = result[0];

          extend(billingDetailsModel, {
            quantity: 1,
            unit_cost: records.standard_fee,
            gross_amount: records.standard_fee,
            discount_amout: 0,
            discount_percentage: 0,
            net_amout: records.standard_fee,
            patient_resp: records.standard_fee,
            patient_payable: records.standard_fee
          });

          let sub_total_amount = new LINQ([billingDetailsModel]).Sum(
            s => s.gross_amount
          );
          let gross_total = new LINQ([billingDetailsModel]).Sum(
            s => s.net_amout
          );
          // debugLog("Net amount" + billingDetailsModel.);
          extend(
            billingHeaderModel,
            {
              sub_total_amount: sub_total_amount,
              gross_total: gross_total,
              patient_res: gross_total,
              patient_payable: gross_total,
              sheet_discount_amount: 0,
              sheet_discount_percentage: 0,
              net_amount: 0,
              receiveable_amount: 0
            },
            req.body
          );
          if (billingHeaderModel.sheet_discount_amount > 0) {
            billingHeaderModel.sheet_discount_percentage =
              (gross_total * billingHeaderModel.sheet_discount_amount) / 100;
          } else if (billingHeaderModel.sheet_discount_percentage > 0) {
            billingHeaderModel.sheet_discount_amount =
              gross_total / billingHeaderModel.sheet_discount_percentage;
          }

          billingHeaderModel.net_amount =
            billingHeaderModel.gross_total -
            billingHeaderModel.sheet_discount_amount;

          billingHeaderModel.receiveable_amount =
            billingHeaderModel.net_amount - billingHeaderModel.credit_amount;

          debugLog("Results are recorded...", result);
          req.records = extend(billingHeaderModel, {
            details: [billingDetailsModel]
          });
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addBilling,
  billingCalculations,
  getBillDetails
  
};
