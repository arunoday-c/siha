import { Router } from "express";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { addOpBIlling, selectBill, getPednigBills } from "../model/opBilling";
import { insertLadOrderedServices } from "../model/laboratory";
import { updateOrderedServicesBilled } from "../model/orderAndPreApproval";
import { insertRadOrderedServices } from "../model/radiology";
import { debugFunction, debugLog } from "../utils/logging";
import extend from "extend";
export default ({ config, db }) => {
  let api = Router();

  // created by irfan : to save opBilling
  //TODO change middle ware to promisify function --added by noor
  api.post(
    "/addOpBIlling",
    addOpBIlling,
    insertLadOrderedServices,
    insertRadOrderedServices,
    updateOrderedServicesBilled,
    (req, res, next) => {
      res.status(httpStatus.ok).json({
        success: true,
        records: req.body
      });
      next();
    },
    releaseConnection
  );

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
    selectBill,
    (req, res, next) => {
      if (req.records == null) {
        next(httpStatus.generateError(httpStatus.notFound, "No records found"));
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

            billObj = extend(
              {
                hims_f_billing_header_id: s.hims_f_billing_header_id,
                patient_id: s.patient_id,
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
                // cancel_remarks: s.cancel_remarks,
                // cancel_by: s.cancel_by,
                bill_comments: s.bill_comments
              },
              dtl
            );
          }

          res.status(httpStatus.ok).json({
            success: true,
            records: billObj
          });
          next();
        }
      }
    },
    releaseConnection
  );

  /////
  return api;
};
