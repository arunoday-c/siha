import httpStatus from "../utils/httpStatus";
import extend from "extend";
import { whereCondition, runningNumber, releaseDBConnection } from "../utils";
import moment from "moment";
import { debuglog, debugFunction } from "util";

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
  discount_percentage: null,
  total_amount: null,
  total_tax: null,
  total_payable: null,
  billing_status: null,
  sheet_discount_amount: null,
  sheet_discount_percentage: null,
  net_amount: null,
  patient_resp: null,
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
  copay_amount: null,
  deductable_amount: null,
  cancel_remarks: null,
  cancel_by: null
};
let billingDetailModel = {
  hims_f_billing_details_id: null,
  hims_f_billing_header_id: null,
  service_type_id: null,
  services_id: null,
  quantity: null,
  unit_cost: null,
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
  updated_date: null
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
                    400,
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

                  if (
                    inputParam.cancel_by != null &&
                    inputParam.cancel_by != ""
                  ) {
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
                      // if()
                      headerResult.insertId;
                    }
                  );
                }
              );

              next();
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addBilling
};
