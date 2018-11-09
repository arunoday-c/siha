"use strict";
import extend from "extend";
import {
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
//import moment from "moment";
import httpStatus from "../utils/httpStatus";
//import { LINQ } from "node-linq";
import { debugLog } from "../utils/logging";

//created by irfan: to getVisitWiseBillDetailS
let getVisitWiseBillDetailS = (req, res, next) => {
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

module.exports = { getVisitWiseBillDetailS };
