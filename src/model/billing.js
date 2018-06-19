import httpStatus from "../utils/httpStatus";
import extend from "extend";
import { whereCondition, runningNumber, releaseDBConnection } from "../utils";
import moment from "moment";
import { debuglog, debugFunction } from "util";
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

let addBilling = (req, res, next) => {
  let dataBase = null;
  try {
    debugFunction("addBilling");
    let db = dataBase != null ? dataBase : req.db;
    if (db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let inputParam = extend(billingHeaderModel, req.body);

    if (inputParam.details == null && inputParam.details.length == 0) {
      next(
        httpStatus(httpStatus.badRequest, "Please select atleast one service.")
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
            let fromDate = moment(records[0].visit_expiery_date).format(
              "YYYYMMDD"
            );
            let toDate = moment(new Date()).format("YYYYMMDD");
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

module.exports = {
  addBilling,
  billingCalculations
};
