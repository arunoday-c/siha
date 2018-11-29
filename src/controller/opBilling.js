import { Router } from "express";
import { releaseConnection, generateDbConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { addOpBIlling, selectBill, getPednigBills } from "../model/opBilling";
import { updateOrderedServicesBilled } from "../model/orderAndPreApproval";
import { debugFunction, debugLog } from "../utils/logging";
import { updateRadOrderedBilled } from "../model/radiology";
import { updateLabOrderedBilled } from "../model/laboratory";
import { insertRadOrderedServices } from "../model/radiology";
import { insertLadOrderedServices } from "../model/laboratory";
import { getReceiptEntry } from "../model/receiptentry";
import extend from "extend";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to save opBilling
  //TODO change middle ware to promisify function --added by noor
  api.post(
    "/addOpBIlling",
    generateDbConnection,
    addOpBIlling,
    updateOrderedServicesBilled,
    updateLabOrderedBilled,
    (req, res, next) => {
      if (req.records.LAB != null && req.records.LAB == true) {
        insertLadOrderedServices(req, res, next);
      } else {
        next();
      }
    },
    updateRadOrderedBilled,
    (req, res, next) => {
      if (req.records.RAD != null && req.records.RAD == true) {
        insertRadOrderedServices(req, res, next);
      } else {
        next();
      }
    },

    (req, res, next) => {
      let connection = req.connection;
      connection.commit(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        } else {
          res.status(httpStatus.ok).json({
            success: true,
            records: req.body
          });
          next();
        }
      });
    },
    releaseConnection
  );

  // if(req.records.LAB != null && req.records.LAB = "false"){

  // }

  // created by Nowshad: to  getPednigBills
  api.get(
    "/getPednigBills",
    getPednigBills,
    (req, res, next) => {
      let result = req.records;
      res.status(httpStatus.ok).json({
        success: true,
        records: result
      });
      next();
    },
    releaseConnection
  );

  api.get(
    "/get",
    generateDbConnection,
    selectBill,
    getReceiptEntry,
    (req, res, next) => {
      debugLog("test: ", "test");
      let connection = req.connection;
      connection.commit(error => {
        debugLog("error: ", error);
        if (error) {
          connection.rollback(() => {
            next(error);
          });
        } else {
          if (req.records == null) {
            next(
              httpStatus.generateError(httpStatus.notFound, "No records found")
            );
          } else {
            if (req.records != null && req.records.length != 0) {
              let groupStatus = new LINQ(req.records).GroupBy(
                g => g.hims_f_billing_header_id
              );
              let objKey = Object.keys(groupStatus);
              let billObj = new Object();

              for (let i = 0; i < objKey.length; i++) {
                let linqData = new LINQ(req.records).Where(
                  w => w.hims_f_billing_header_id == objKey[i]
                );
                let dtl = { billdetails: linqData.ToArray() };

                let s = linqData.FirstOrDefault();

                debugLog("billObj: ", billObj);
                billObj = extend(
                  {
                    hims_f_billing_header_id: s.hims_f_billing_header_id,
                    patient_id: s.patient_id,
                    full_name: s.full_name,
                    patient_type: s.patient_type,
                    mode_of_pay: s.insured == "Y" ? "Insured" : "Self",
                    billing_type_id: s.billing_type_id,
                    visit_id: s.visit_id,
                    bill_number: s.bill_number,
                    incharge_or_provider: s.incharge_or_provider,
                    bill_date: s.bill_date,
                    advance_amount: s.advance_amount,
                    advance_adjust: s.advance_adjust,
                    discount_amount: s.discount_amount,
                    sub_total_amount: s.sub_total_amount,
                    total_tax: s.total_tax,
                    net_total: s.net_total,
                    billing_status: s.billing_status,
                    copay_amount: s.copay_amount,
                    deductable_amount: s.deductable_amount,
                    sec_copay_amount: s.sec_copay_amount,
                    sec_deductable_amount: s.sec_deductable_amount,
                    gross_total: s.gross_total,
                    sheet_discount_amount: s.sheet_discount_amount,
                    sheet_discount_percentage: s.sheet_discount_percentage,
                    net_amount: s.net_amount,
                    patient_res: s.patient_res,
                    company_res: s.company_res,
                    sec_company_res: s.sec_company_res,
                    patient_payable: s.patient_payable,
                    patient_payable_h: s.patient_payable,
                    company_payable: s.company_payable,
                    sec_company_payable: s.sec_company_payable,
                    patient_tax: s.patient_tax,
                    company_tax: s.company_tax,
                    sec_company_tax: s.sec_company_tax,
                    net_tax: s.net_tax,
                    credit_amount: s.credit_amount,
                    receiveable_amount: s.receiveable_amount,
                    patient_code: s.patient_code,
                    bill_comments: s.bill_comments
                  },
                  dtl
                );
              }

              debugLog("billObj: ", billObj);

              let _receptEntry = req.receptEntry;

              let result = { ..._receptEntry, ...billObj };

              delete req.receptEntry;
              debugLog("OP result : ", result);
              res.status(httpStatus.ok).json({
                success: true,
                records: result
              });
              next();
            }
          }
        }
      });
    },
    releaseConnection
  );

  /////
  return api;
};
