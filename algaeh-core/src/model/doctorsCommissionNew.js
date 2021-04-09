"use strict";
import extend from "extend";
// import httpStatus from "../utils/httpStatus";
import { LINQ } from "node-linq";
import algaehMysql from "algaeh-mysql";
import moment from "moment";
import mysql from "mysql";

const keyPath = require("algaeh-keys/keys");

let getDoctorsCommission = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.query);

    _mysql
      .executeQuery({
        query:
          "select hims_f_billing_header_id from hims_f_billing_header where record_status='A'\
            and incharge_or_provider=? and date(bill_date) between ? and ? ",
        values: [input.incharge_or_provider, input.from_date, input.to_date],
        printQuery: true,
      })
      .then((result) => {
        //   _mysql.releaseConnection();

        let bill_header_id_all = new LINQ(result)
          .Where((w) => w.hims_f_billing_header_id != null)
          .Select((s) => s.hims_f_billing_header_id)
          .ToArray();
        if (bill_header_id_all.length != 0) {
          let service_type_id = "";
          if (input.select_type == "SS" && input.service_type_id != "null") {
            service_type_id =
              "BD.service_type_id=" + input.service_type_id + " and";
          }
          _mysql
            .executeQuery({
              query: `select BD.hims_f_billing_header_id,S.service_cost,incharge_or_provider as provider_id,hims_f_billing_details_id,BH.bill_number,BH.bill_date,BD.service_type_id as servtype_id,services_id as service_id,quantity,
              unit_cost,gross_amount as extended_cost,discount_amout as discount_amount,net_amout as net_amount,BD.patient_payable as patient_share,company_payble as company_share,sec_company_paybale
              from hims_f_billing_header BH
              inner join hims_f_billing_details BD on BD.hims_f_billing_header_id=BH.hims_f_billing_header_id
              left join hims_d_services  S on  BD.services_id=S.hims_d_services_id where BD.commission_given='N' and BH.record_status='A' and BD.record_status='A' and              
             ${service_type_id} BD.hims_f_billing_header_id in (?)`,
              values: [bill_header_id_all],
              printQuery: true,
            })
            .then((detailResult) => {
              if (detailResult.length != 0) {
                for (let i = 0; i < detailResult.length; i++) {
                  // detailResult.map((detailresult[i]) => {
                  _mysql
                    .executeQuery({
                      query: `select hims_m_doctor_service_commission_id,op_cash_commission_percent as op_cash_comission_percentage, op_credit_commission_percent as op_crd_comission_percentage,
                      ip_cash_commission_percent, ip_credit_commission_percent from\
                      hims_m_doctor_service_commission where record_status='A' and provider_id=?  and services_id=? and service_type_id=?`,
                      values: [
                        detailResult[i].provider_id,
                        detailResult[i].service_id,
                        detailResult[i].servtype_id,
                      ],
                      printQuery: true,
                    })
                    .then((service_commission) => {
                      const final_result = async () => {
                        try {
                          if (service_commission.length != 0) {
                            detailResult[i] = {
                              ...detailResult[i],
                              ...service_commission[0],
                            };
                            return detailResult;
                          } else {
                            const sType_comm = await _mysql
                              .executeQuery({
                                query: `SELECT hims_m_doctor_service_type_commission_id, op_cash_comission_percent as op_cash_comission_percentage, op_credit_comission_percent as op_crd_comission_percentage, 
                                ip_cash_commission_percent, ip_credit_commission_percent from hims_m_doctor_service_type_commission where record_status='A'  and provider_id=?
                              and service_type_id=?`,
                                values: [
                                  detailResult[i].provider_id,
                                  detailResult[i].servtype_id,
                                ],
                                printQuery: true,
                              })
                              .catch((error) => {
                                throw error;
                              });
                            // .then((sType_comm) => {
                            if (sType_comm.length != 0) {
                              detailResult[i] = {
                                ...detailResult[i],
                                ...sType_comm[0],
                              };

                              return detailResult;
                            } else {
                              detailResult[i] = {
                                ...detailResult[i],
                                ...{ commission_not_exist: true },
                              };
                              return detailResult;
                            }
                            // })
                            // .catch((error) => {
                            //   _mysql.releaseConnection();
                            //   next(error);
                            // });
                          }
                        } catch (e) {
                          reject(e);
                        }
                      };

                      final_result().then((result) => {
                        if (i == detailResult.length - 1) {
                          req.records = result;
                          _mysql.releaseConnection();
                          next();
                        }
                      });
                    })
                    .catch((err) => {
                      _mysql.releaseConnection();
                      next(err);
                    });
                  // });
                }
              } else {
                _mysql.releaseConnection();
                next();
              }
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          req.records = result;
          next();
        }
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
let doctorsCommissionCal = (req, res, next) => {
  try {
    let input = extend([], req.body);
    let outputArray = [];
    for (let i = 0; i < input.length; i++) {
      let op_cash_comission_amount = 0;
      let op_cash_comission = 0;
      let op_crd_comission_amount = 0;
      let op_crd_comission = 0;

      let inputData = input[i];
      if (
        inputData.service_cost != 0 &&
        inputData.op_cash_comission_percentage != 0
      ) {
        op_cash_comission_amount =
          (inputData.service_cost * inputData.op_cash_comission_percentage) /
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

let commissionCalculations = (req, res, next) => {
  try {
    let inputParam = req.body;

    let sendingObject = {};

    let adjust_amount =
      inputParam.adjust_amount === undefined ? 0 : inputParam.adjust_amount;

    if (adjust_amount == 0) {
      sendingObject.op_commision = new LINQ(inputParam).Sum(
        (d) => d.op_cash_comission
      );
      sendingObject.op_credit_comission = new LINQ(inputParam).Sum(
        (d) => d.op_crd_comission
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
let addDoctorsCommission = (req, res, next) => {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };
    let comission_code = "";

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["DOC_COMM"],
        table_name: "hims_f_app_numgen",
      })
      .then((generatedNumbers) => {
        comission_code = generatedNumbers.DOC_COMM;

        _mysql
          .executeQuery({
            query: `INSERT INTO hims_f_doctor_comission_header ( comission_code, provider_id, from_date, to_date, case_type,
                selected_service_type,op_commision, ip_comission, op_credit_comission,ip_credit_comission, net_turn_over,gross_comission,
                adjust_amount,net_comission,tax_percentage,tax_amount,comission_payable,created_by, created_date,updated_by,updated_date,hospital_id) 
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            values: [
              comission_code,
              inputParam.provider_id,
              moment(inputParam.from_date).format("YYYY-MM-DD"),
              moment(inputParam.to_date).format("YYYY-MM-DD"),
              inputParam.case_type,
              inputParam.service_type,
              inputParam.op_commision,
              inputParam.ip_comission,
              inputParam.op_credit_comission,
              inputParam.ip_credit_comission,
              inputParam.net_turn_over,
              inputParam.gross_comission,
              inputParam.adjust_amount,
              inputParam.net_comission,
              inputParam.tax_percentage,
              inputParam.tax_amount,
              inputParam.comission_payable,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.hospital_id,
            ],
            printQuery: true,
          })
          .then((headerResult) => {
            let qry = "";
            let updateBillingDetails = inputParam.commissionDetails;
            updateBillingDetails.map((item) => {
              qry += mysql.format(
                `update hims_f_billing_details set commission_given='Y' where hims_f_billing_details_id=?;`,
                [item.hims_f_billing_details_id]
              );
            });

            _mysql
              .executeQuery({
                query: qry,
                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .then((result) => {
                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
            let IncludeValues = [
              "bill_number",
              "bill_date",
              "servtype_id",
              "service_id",
              "quantity",
              "unitcost",
              "extended_cost",
              "discount_amount",
              "patient_share",
              "company_share",
              "net_amount",
              "service_cost",
              "op_cash_comission_type",
              "op_cash_comission_percentage",
              "op_cash_comission_amount",
              "op_cash_comission",
              "op_crd_comission_percentage",
              "op_crd_comission_amount",
              "op_crd_comission",
            ];
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_doctor_comission_detail(??) VALUES ?",
                values: inputParam.commissionDetails,
                includeValues: IncludeValues,
                extraValues: {
                  doctor_comission_header_id: headerResult.insertId,
                },
                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .then(() => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    comission_code: comission_code,
                    hims_f_doctor_comission_header: headerResult.insertId,
                    // receipt_number: req.records.receipt_number,
                  };
                });
                next();
                //   });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
};
const getGeneratedCommission = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let input = extend({}, req.query);

    _mysql
      .executeQuery({
        query: `select *  from hims_f_doctor_comission_header  where comission_code=?`,
        values: [input.comission_code],
        printQuery: true,
      })
      .then((headerResult) => {
        _mysql
          .executeQuery({
            query: `select * from hims_f_doctor_comission_detail where doctor_comission_header_id=?`,
            values: [headerResult[0].hims_f_doctor_comission_header_id],
          })
          .then((result) => {
            req.records = {
              ...headerResult[0],
              detailResult: result,
            };
            _mysql.releaseConnection();
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  getDoctorsCommission,
  doctorsCommissionCal,
  commissionCalculations,
  addDoctorsCommission,
  getGeneratedCommission,
};
