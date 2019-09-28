"use strict";
import utils from "../../utils";
import extend from "extend";
import httpStatus from "../../utils/httpStatus";
import logUtils from "../../utils/logging";
import moment from "moment";
//import { getBillDetailsFunctionality } from "../../model/billing";
import comModels from "./commonFunction";
import Promise from "bluebird";

const { updateIntoItemLocation } = comModels;
const { debugLog } = logUtils;
const {
  whereCondition,
  releaseDBConnection,
  jsonArrayToObject,
  runningNumberGen
} = utils;

//created by Nowshad: to Insert Sales Entry
let addsalesReturn = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    debugLog("inside", "add stock");
    let connection = req.connection;

    let requestCounter = 1;

    return new Promise((resolve, reject) => {
      runningNumberGen({
        db: connection,
        counter: requestCounter,
        module_desc: ["POS_RET_NUM"],
        onFailure: error => {
          reject(error);
        },
        onSuccess: result => {
          resolve(result);
        }
      });
    }).then(result => {
      let documentCode = result[0].completeNumber;
      debugLog("documentCode:", documentCode);

      let year = moment().format("YYYY");
      debugLog("onlyyear:", year);

      let today = moment().format("YYYY-MM-DD");
      debugLog("today:", today);

      let month = moment().format("MM");
      debugLog("month:", month);
      let period = month;

      debugLog("period:", period);
      connection.query(
        "INSERT INTO `hims_f_pharmcy_sales_return_header` (sales_return_number,sales_return_date,from_pos_id,patient_id,visit_id,ip_id,`year`,period,\
                location_id, location_type, sub_total, discount_percentage, discount_amount, net_total, copay_amount, patient_responsibility,\
                patient_tax, patient_payable,company_responsibility,company_tax,company_payable,comments, sec_company_responsibility,\
                sec_company_tax,sec_company_payable,sec_copay_amount,net_tax,gross_total,sheet_discount_amount,\
                sheet_discount_percentage,net_amount,credit_amount,payable_amount, card_number,effective_start_date,effective_end_date,\
                insurance_provider_id, sub_insurance_provider_id, network_id, network_type, network_office_id, policy_number, \
                secondary_card_number, secondary_effective_start_date, secondary_effective_end_date, secondary_insurance_provider_id,\
                secondary_network_id, secondary_network_type, secondary_sub_insurance_provider_id, secondary_network_office_id, \
                reciept_id,created_date,created_by,updated_date,updated_by) \
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          documentCode,
          today,
          input.from_pos_id,
          input.patient_id,
          input.visit_id,
          input.ip_id,
          year,
          period,
          input.location_id,
          input.location_type,
          input.sub_total,
          input.discount_percentage,
          input.discount_amount,
          input.net_total,
          input.copay_amount,
          input.patient_responsibility,
          input.patient_tax,
          input.patient_payable,
          input.company_responsibility,
          input.company_tax,
          input.company_payable,
          input.comments,
          input.sec_company_responsibility,
          input.sec_company_tax,
          input.sec_company_payable,
          input.sec_copay_amount,
          input.net_tax,
          input.gross_total,
          input.sheet_discount_amount,
          input.sheet_discount_percentage,
          input.net_amount,
          input.credit_amount,
          input.payable_amount,
          input.card_number,
          input.effective_start_date,
          input.effective_end_date,
          input.insurance_provider_id,
          input.sub_insurance_provider_id,
          input.network_id,
          input.network_type,
          input.network_office_id,
          input.policy_number,
          input.secondary_card_number,
          input.secondary_effective_start_date,
          input.secondary_effective_end_date,
          input.secondary_insurance_provider_id,
          input.secondary_network_id,
          input.secondary_network_type,
          input.secondary_sub_insurance_provider_id,
          input.secondary_network_office_id,
          req.records.receipt_header_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ],
        (error, headerResult) => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          debugLog(" Sales header id :", headerResult);

          if (headerResult.insertId != null) {
            const insurtColumns = [
              "item_id",
              "item_category",
              "item_group_id",
              "service_id",
              "grn_no",
              "barcode",
              "expiry_date",
              "batchno",
              "uom_id",
              "quantity",
              "return_quantity",
              "insurance_yesno",
              "tax_inclusive",
              "unit_cost",
              "extended_cost",
              "discount_percent",
              "discount_amount",
              "net_extended_cost",
              "copay_percent",
              "copay_amount",
              "patient_responsibility",
              "patient_tax",
              "patient_payable",
              "company_responsibility",
              "company_tax",
              "company_payable",
              "sec_copay_percent",
              "sec_copay_amount",
              "sec_company_responsibility",
              "sec_company_tax",
              "sec_company_payable"
            ];

            connection.query(
              "INSERT INTO hims_f_pharmacy_sales_return_detail(" +
                insurtColumns.join(",") +
                ",sales_return_header_id) VALUES ?",
              [
                jsonArrayToObject({
                  sampleInputObject: insurtColumns,
                  arrayObj: req.body.pharmacy_stock_detail,
                  newFieldToInsert: [headerResult.insertId],
                  req: req
                })
              ],
              (error, detailResult) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                req.records = {
                  sales_return_number: documentCode,
                  hims_f_pharmcy_sales_return_header_id: headerResult.insertId,
                  receipt_number: req.records.receipt_number,
                  year: year,
                  period: period
                };
                next();

                // connection.commit(error => {
                //   if (error) {
                //     connection.rollback(() => {
                //       releaseDBConnection(db, connection);
                //       next(error);
                //     });
                //   }
                //   releaseDBConnection(db, connection);
                //   req.records = {
                //     sales_return_number: documentCode,
                //     hims_f_pharmcy_sales_return_header_id:
                //       headerResult.insertId,
                //     receipt_number: req.records.receipt_number,
                //     year: year,
                //     period: period
                //   };
                //   next();
                // });
              }
            );
          } else {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to get Pharmacy POS Entry
let getsalesReturn = (req, res, next) => {
  let selectWhere = {
    sales_return_number: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let where = whereCondition(extend(selectWhere, req.query));

    let connection = req.connection;

    debugLog("where: ", where);
    connection.query(
      "SELECT hims_f_pharmcy_sales_return_header_id, reciept_id, PH.from_pos_id, PH.sales_return_number,PH.patient_id,P.patient_code,\
      P.full_name as full_name,PH.visit_id,V.visit_code,PH.ip_id,PH.sales_return_date,PH.`year`,\
      PH.period,PH.location_id,L.location_description,PH.location_type,PH.sub_total,PH.discount_percentage,PH.discount_amount,PH.net_total,\
      PH.copay_amount,PH.patient_responsibility,PH.patient_tax,PH.patient_payable,PH.company_responsibility,PH.company_tax,\
      PH.company_payable,PH.comments,PH.sec_company_responsibility,PH.sec_company_tax,PH.sec_company_payable,\
      PH.sec_copay_amount,PH.net_tax,PH.gross_total,PH.sheet_discount_amount,PH.sheet_discount_percentage,\
      PH.net_amount,PH.credit_amount,PH.payable_amount,PH.posted,PH.card_number,PH.effective_start_date,\
      PH.effective_end_date,PH.insurance_provider_id,PH.sub_insurance_provider_id,PH.network_id,PH.network_type,\
      PH.network_office_id,PH.policy_number,PH.secondary_card_number,PH.secondary_effective_start_date,\
      PH.secondary_effective_end_date,PH.secondary_insurance_provider_id,PH.secondary_network_id,PH.secondary_network_type,\
      PH.secondary_sub_insurance_provider_id,PH.secondary_network_office_id, POS.pos_number from  \
      hims_f_pharmcy_sales_return_header PH inner join hims_d_pharmacy_location L on PH.location_id=L.hims_d_pharmacy_location_id \
      left outer join hims_f_patient_visit V on PH.visit_id=V.hims_f_patient_visit_id \
      left outer join hims_f_patient P on PH.patient_id=P.hims_d_patient_id\
      inner join hims_f_pharmacy_pos_header POS on PH.from_pos_id=POS.hims_f_pharmacy_pos_header_id\
      where PH.record_status='A' and L.record_status='A' and  " +
        where.condition,
      where.values,
      (error, headerResult) => {
        if (error) {
          releaseDBConnection(db, connection);
          next(error);
        }

        debugLog("result header: ", headerResult);
        if (headerResult.length != 0) {
          debugLog(
            "hims_f_pharmcy_sales_return_header_id: ",
            headerResult[0].hims_f_pharmcy_sales_return_header_id
          );
          connection.query(
            "select * from hims_f_pharmacy_sales_return_detail where sales_return_header_id=?",
            headerResult[0].hims_f_pharmcy_sales_return_header_id,
            (error, pharmacy_stock_detail) => {
              if (error) {
                releaseDBConnection(db, connection);
                next(error);
              }

              debugLog("reciept_id: ", headerResult[0].reciept_id);

              req.records = {
                ...headerResult[0],
                ...{ pharmacy_stock_detail },
                ...{
                  hims_f_receipt_header_id: headerResult[0].reciept_id
                }
              };
              releaseDBConnection(db, connection);
              next();
            }
          );
        } else {
          req.records = headerResult;
          releaseDBConnection(db, connection);
          next();
        }
      }
    );
  } catch (e) {
    next(e);
  }
};

//created by Nowshad: to Update  Sales Return Entry
let updatesalesReturn = (req, res, next) => {
  let salesReturn = {
    posted: null,
    updated_by: req.userIdentity.algaeh_d_app_user_id
  };

  req.body.hims_f_pharmcy_sales_return_header_id =
    req.records.hims_f_pharmcy_sales_return_header_id;
  req.body.transaction_id = req.records.hims_f_pharmcy_sales_return_header_id;
  req.body.year = req.records.year;
  req.body.period = req.records.period;

  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let connection = req.connection;
    return new Promise((resolve, reject) => {
      let inputParam = extend(salesReturn, req.body);

      debugLog("posted", inputParam.posted);
      debugLog("pharmacy_stock_detail", req.body.pharmacy_stock_detail);
      connection.query(
        "UPDATE `hims_f_pharmcy_sales_return_header` SET `posted`=?, `updated_by`=?, `updated_date`=? \
          WHERE `record_status`='A' and `hims_f_pharmcy_sales_return_header_id`=?",
        [
          inputParam.posted,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.hims_f_pharmcy_sales_return_header_id
        ],
        (error, result) => {
          debugLog("error", error);
          releaseDBConnection(db, connection);
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    })
      .then(output => {
        return new Promise((resolve, reject) => {
          debugLog("output", output);
          req.options = {
            db: connection,
            onFailure: error => {
              reject(error);
            },
            onSuccess: result => {
              resolve(result);
            }
          };

          updatePOSDetail(req, res, next);
        });
      })
      .then(posoutput => {
        return new Promise((resolve, reject) => {
          debugLog("posoutput", posoutput);
          req.options = {
            db: connection,
            onFailure: error => {
              reject(error);
            },
            onSuccess: result => {
              resolve(result);
            }
          };

          updateIntoItemLocation(req, res, next);
        })
          .then(records => {
            req.salesReturn = records;
            next();
            // connection.commit(error => {
            //   if (error) {
            //     releaseDBConnection(db, connection);
            //     next(error);
            //   }
            //   req.salesReturn = records;
            //   releaseDBConnection(db, connection);
            //   next();
            // });
          })
          .catch(error => {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          });
      })
      .catch(error => {
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          next(error);
        });
      });
  } catch (e) {
    next(e);
  }
};

//created by nowshad: insert item moment history
let updatePOSDetail = (req, res, next) => {
  let db = req.options == null ? req.db : req.options.db;
  try {
    let inputParam = extend({}, req.body);
    debugLog("inputParam", inputParam);
    const newDtls = inputParam.pharmacy_stock_detail;
    debugLog("before History Insert Data", newDtls);

    let updateString = "";

    for (let i = 0; i < newDtls.length; i++) {
      updateString +=
        "UPDATE hims_f_pharmacy_pos_detail SET `return_quantity`='" +
        newDtls[i].return_quantity +
        "',\
    `return_extended_cost` = '" +
        newDtls[i].return_extended_cost +
        "',`return_discount_amt`='" +
        newDtls[i].return_discount_amt +
        "',\
    `return_net_extended_cost`='" +
        newDtls[i].return_net_extended_cost +
        "',`return_pat_responsibility`='" +
        newDtls[i].return_pat_responsibility +
        "',\
    `return_company_responsibility`='" +
        newDtls[i].return_company_responsibility +
        "',`return_sec_company_responsibility`='" +
        newDtls[i].return_sec_company_responsibility +
        "',`return_done`='Y' WHERE \
    `pharmacy_pos_header_id`='" +
        inputParam.from_pos_id +
        "' AND `item_id`='" +
        newDtls[i].item_id +
        "' ;";
    }
    debugLog("updateString", updateString);
    db.query(updateString, (error, detailResult) => {
      debugLog("error", detailResult);
      if (error) {
        if (req.options == null) {
          db.rollback(() => {
            releaseDBConnection(req.db, db);
            next(error);
          });
        } else {
          req.options.onFailure(error);
        }
      }

      if (req.options == null) {
        req.records = detailResult;
        releaseDBConnection(req.db, db);
        next();
      } else {
        req.options.onSuccess(detailResult);
      }
    });
  } catch (e) {
    next(e);
  }
};

export default {
  addsalesReturn,
  getsalesReturn,
  updatesalesReturn
};
