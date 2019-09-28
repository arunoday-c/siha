"use strict";
import extend from "extend";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import logUtils from "../utils/logging";

const { debugLog } = logUtils;
const { releaseDBConnection } = utils;

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

          if (result.length != 0) {
            let service_type_id = "";
            if (input.select_type == "SS" && input.service_type_id != "null") {
              service_type_id =
                "service_type_id=" + input.service_type_id + " and";
            }

            connection.query(
              "select BD.hims_f_billing_header_id,incharge_or_provider as provider_id,hims_f_billing_details_id,BH.bill_number,BH.bill_date,service_type_id as servtype_id,services_id as service_id,quantity,\
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

                if (results.length != 0) {
                  for (let i = 0; i < results.length; i++) {
                    connection.query(
                      " select hims_m_doctor_service_commission_id,op_cash_commission_percent as op_cash_comission_percentage, op_credit_commission_percent as op_crd_comission_percentage,\
                     ip_cash_commission_percent, ip_credit_commission_percent from\
                     hims_m_doctor_service_commission where record_status='A' and provider_id=?  and services_id=? and service_type_id=?",
                      [
                        results[i].provider_id,
                        results[i].service_id,
                        results[i].servtype_id
                      ],
                      (error, service_commission) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }

                        new Promise((resolve, reject) => {
                          try {
                            if (service_commission.length != 0) {
                              results[i] = {
                                ...results[i],
                                ...service_commission[0]
                              };
                              return resolve(results);
                            } else {
                              connection.query(
                                " SELECT hims_m_doctor_service_type_commission_id, op_cash_comission_percent as op_cash_comission_percentage, op_credit_comission_percent as op_crd_comission_percentage, \
                                 ip_cash_commission_percent, ip_credit_commission_percent from hims_m_doctor_service_type_commission where record_status='A'  and provider_id=?\
                               and service_type_id=?",
                                [
                                  results[i].provider_id,
                                  results[i].servtype_id
                                ],
                                (error, sType_comm) => {
                                  if (error) {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  }

                                  if (sType_comm.length != 0) {
                                    results[i] = {
                                      ...results[i],
                                      ...sType_comm[0]
                                    };

                                    return resolve(results);
                                  } else {
                                    results[i] = {
                                      ...results[i],
                                      ...{ commission_not_exist: true }
                                    };
                                    return resolve(results);
                                  }
                                }
                              );
                            }
                          } catch (e) {
                            reject(e);
                          }
                        }).then(result => {
                          if (i == results.length - 1) {
                            req.records = result;
                            releaseDBConnection(db, connection);
                            next();
                          }
                        });
                      }
                    );
                  }
                } else {
                  req.records = results;
                  releaseDBConnection(db, connection);
                  next();
                }
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

//created by irfan: to doctorsCommissionCal
let doctorsCommissionCal = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend([], req.body);
    let outputArray = [];
    for (let i = 0; i < input.length; i++) {
      let op_cash_comission_amount = 0;
      let op_cash_comission = 0;
      let op_crd_comission_amount = 0;
      let op_crd_comission = 0;

      let inputData = input[i];
      if (
        inputData.patient_share != 0 &&
        inputData.op_cash_comission_percentage != 0
      ) {
        op_cash_comission_amount =
          (inputData.patient_share * inputData.op_cash_comission_percentage) /
          100;
        op_cash_comission = op_cash_comission_amount;
      }

      if (
        inputData.company_share != 0 &&
        inputData.op_crd_comission_percentage != 0
      ) {
        op_cash_comission_amount =
          (inputData.company_share * inputData.op_crd_comission_percentage) /
          100;

        op_crd_comission = op_crd_comission_amount;
      }

      inputData.op_cash_comission_amount = op_cash_comission_amount;
      inputData.op_cash_comission = op_cash_comission;
      inputData.op_crd_comission_amount = op_crd_comission_amount;
      inputData.op_crd_comission = op_crd_comission;
      outputArray.push(inputData);

      // debugLog("op_cash_comission_amount:", op_cash_comission_amount);
      // debugLog("op_cash_comission:", op_cash_comission);
    }

    req.records = outputArray;
    next();
  } catch (e) {
    next(e);
  }
};

//created by irfan: performing only calculation
let commissionCalculations = (req, res, next) => {
  try {
    let inputParam = req.body;

    let sendingObject = {};

    let adjust_amount =
      inputParam.adjust_amount === undefined ? 0 : inputParam.adjust_amount;

    debugLog("Input", req.body);
    debugLog("adjust_amount", adjust_amount);

    if (adjust_amount == 0) {
      sendingObject.op_commision = new LINQ(inputParam).Sum(
        d => d.op_cash_comission
      );
      sendingObject.op_credit_comission = new LINQ(inputParam).Sum(
        d => d.op_crd_comission
      );

      sendingObject.gross_comission =
        sendingObject.op_commision + sendingObject.op_credit_comission;

      sendingObject.net_comission = sendingObject.gross_comission;
    } else {
      sendingObject.net_comission =
        inputParam.gross_comission - inputParam.adjust_amount;
    }

    sendingObject.comission_payable = sendingObject.net_comission;

    req.records = sendingObject;
    next();
  } catch (e) {
    next(e);
  }
};

export default {
  getDoctorsCommission,
  doctorsCommissionCal,
  commissionCalculations
};
