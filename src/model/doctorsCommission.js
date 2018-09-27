"use strict";
import extend from "extend";
import {
  selectStatement,
  paging,
  whereCondition,
  deleteRecord,
  bulkInputArrayObject,
  releaseDBConnection,
  jsonArrayToObject
} from "../utils";
import moment from "moment";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import { logger, debugFunction, debugLog } from "../utils/logging";

//created by irfan: to get doctors commission
let getDoctorsCommission = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_billing_header_id from hims_f_billing_header where record_status='A'\
           and incharge_or_provider=? and date(bill_date) between ? and ? ",
        [input.incharge_or_provider, input.from_date, input.to_date],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          let bill_header_id_all = new LINQ(result)
            .Where(w => w.hims_f_billing_header_id != null)
            .Select(s => s.hims_f_billing_header_id)
            .ToArray();

          debugLog("bill_header_id_all:", bill_header_id_all);

          if (result.length != 0) {
            let service_type_id = "";
            if (input.select_type == "SS" && input.service_type_id != "null") {
              service_type_id =
                "service_type_id=" + input.service_type_id + " and";
            }

            connection.query(
              "select BD.hims_f_billing_header_id,hims_f_billing_details_id,BH.bill_number,BH.bill_date,service_type_id as servtype_id,services_id as service_id,quantity,\
              unit_cost,gross_amount as extended_cost,discount_amout as discount_amount,net_amout as net_amount,BD.patient_payable as patient_share,company_payble as company_share,sec_company_paybale\
              from hims_f_billing_details BD,hims_f_billing_header BH where BH.record_status='A' and BD.record_status='A' and \
               BD.hims_f_billing_header_id=BH.hims_f_billing_header_id and " +
                service_type_id +
                " BD.hims_f_billing_header_id in (" +
                bill_header_id_all +
                ");",
              (error, results) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                req.records = results;
                next();
              }
            );
          } else {
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
module.exports = { getDoctorsCommission };
