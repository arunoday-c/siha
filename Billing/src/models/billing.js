import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";
import { LINQ } from "node-linq";
import extend from "extend";
import _ from "lodash";
import mysql from "mysql";
import moment from "moment";

export default {
  newReceiptData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      if (req.body.consultation == "N") {
        next();
        return;
      }
      let inputParam = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
              created_by, created_date, updated_by, updated_date,  counter_id, shift_id,hospital_id ) \
              VALUES (?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.receipt_number,
            new Date(),
            inputParam.total_amount,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.counter_id,
            inputParam.shift_id,
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((headerRcptResult) => {
          // utilities.logger().log("headerRcptResult: ", headerRcptResult);

          if (
            headerRcptResult.insertId != null &&
            headerRcptResult.insertId != ""
          ) {
            req.body.receipt_header_id = headerRcptResult.insertId;
            const receptSample = [
              "card_check_number",
              "bank_card_id",
              "expiry_date",
              "pay_type",
              "amount",
            ];

            _mysql
              .executeQuery({
                query: "INSERT INTO hims_f_receipt_details(??) VALUES ?",
                values: inputParam.receiptdetails,
                includeValues: receptSample,
                extraValues: {
                  hims_f_receipt_header_id: headerRcptResult.insertId,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date(),
                },
                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .then((RcptDetailsRecords) => {
                if (req.connection == null) {
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  req.records = headerRcptResult;
                  next();
                  // });
                } else {
                  next();
                }
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          }
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  checkServiceExists: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };

      let strQuery = "";
      if (inputParam.service_type_id == 5) {
        strQuery = `SELECT hims_f_lab_order_id FROM hims_f_lab_order where visit_id= ${inputParam.visit_id} and service_id=${inputParam.services_id};`;
      } else if (inputParam.service_type_id == 11) {
        strQuery = `SELECT hims_f_rad_order_id FROM hims_f_rad_order where visit_id= ${inputParam.visit_id} and service_id=${inputParam.services_id};`;
      } else if (inputParam.service_type_id == 14) {
        strQuery = `SELECT hims_f_package_header_id FROM hims_f_package_header where visit_id= ${inputParam.visit_id} and services_id=${inputParam.services_id};`;
      }
      if (strQuery == "") {
        _mysql.releaseConnection();
        req.records = { exists: false };
        next();
        return;
      }
      _mysql
        .executeQuery({
          query: strQuery,
          printQuery: true,
        })
        .then((headerRcptResult) => {
          _mysql.releaseConnection();
          if (headerRcptResult.length > 0) {
            req.records = { exists: true };
          } else {
            req.records = { exists: false };
          }
          next();
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  addBillData: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    const utilities = new algaehUtilities();
    try {
      if (req.body.consultation == "N") {
        next();
        return;
      }
      let inputParam = { ...req.body };
      if (inputParam.net_amount > 0) {
        if (
          inputParam.billdetails == null ||
          inputParam.billdetails.length == 0
        ) {
          const errorGen = utilities
            .httpStatus()
            .generateError(
              httpStatus.badRequest,
              "Please select atleast one service."
            );
          _mysql.rollBackTransaction(() => {
            next(errorGen);
          });
          return;
        }
      }

      if (
        inputParam.sheet_discount_amount != 0 &&
        inputParam.bill_comments == ""
      ) {
        const errorGene = utilities
          .httpStatus()
          .generateError(
            httpStatus.badRequest,
            "Please enter sheet level discount comments. "
          );

        _mysql.rollBackTransaction(() => {
          next(errorGene);
        });
        return;
      }
      let strQuery = "select 1=1;";
      if (inputParam.advance_adjust > 0) {
        strQuery = `SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id='${inputParam.patient_id}';`;
      }

      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_f_billing_header ( patient_id, visit_id, bill_number,receipt_header_id,\
              incharge_or_provider, bill_date, advance_amount,advance_adjust, pack_advance_adjust, \
              pack_advance_amount, discount_amount, sub_total_amount, total_tax,  billing_status, \
              sheet_discount_amount, sheet_discount_percentage, net_amount, net_total \
              , company_res, sec_company_res, patient_res, patient_payable, company_payable, sec_company_payable \
              , patient_tax, s_patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, receiveable_amount,\
              balance_credit, from_bill_id, shift_id, created_by, created_date, updated_by, updated_date, copay_amount,\
              deductable_amount,hospital_id)\
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); " +
            strQuery,
          values: [
            inputParam.patient_id,
            inputParam.visit_id,
            inputParam.bill_number,
            inputParam.receipt_header_id,
            inputParam.incharge_or_provider,
            new Date(),
            inputParam.advance_amount,
            inputParam.advance_adjust === "" ? 0 : inputParam.advance_adjust,
            inputParam.pack_advance_adjust,
            inputParam.pack_advance_amount === ""
              ? 0
              : inputParam.pack_advance_amount,
            inputParam.discount_amount === "" ? 0 : inputParam.discount_amount,
            inputParam.sub_total_amount,
            inputParam.total_tax,
            inputParam.billing_status,
            inputParam.sheet_discount_amount === ""
              ? 0
              : inputParam.sheet_discount_amount,
            inputParam.sheet_discount_percentage === ""
              ? 0
              : inputParam.sheet_discount_percentage,
            inputParam.net_amount,
            inputParam.net_total,
            inputParam.company_res,
            inputParam.sec_company_res,
            inputParam.patient_res,
            inputParam.patient_payable,
            inputParam.company_payable,
            inputParam.sec_company_payable,
            inputParam.patient_tax,
            inputParam.s_patient_tax,
            inputParam.company_tax,
            inputParam.sec_company_tax,
            inputParam.net_tax,
            inputParam.credit_amount,
            inputParam.receiveable_amount,
            inputParam.balance_credit,
            inputParam.from_bill_id,
            inputParam.shift_id,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.copay_amount,
            inputParam.deductable_amount,
            req.userIdentity.hospital_id,
          ],
          printQuery: true,
        })
        .then((insert_result) => {
          const headerResult = insert_result[0];
          const pat_advance = insert_result[1];

          req.body.hims_f_billing_header_id = headerResult.insertId;
          req.body.bill_date = new Date();
          let strQry = "";
          if (inputParam.advance_adjust > 0) {
            inputParam.advance_amount =
              pat_advance[0].advance_amount - inputParam.advance_adjust;

            strQry = `UPDATE  hims_f_patient SET  advance_amount='${inputParam.advance_amount}' 
              WHERE hims_d_patient_id='${inputParam.patient_id}';`;
          }

          let IncludeValues = [
            "hims_f_billing_header_id",
            "service_type_id",
            "services_id",
            "quantity",
            "unit_cost",
            "insurance_yesno",
            "gross_amount",
            "discount_amout",
            "discount_percentage",
            "net_amout",
            "copay_percentage",
            "copay_amount",
            "deductable_amount",
            "deductable_percentage",
            "tax_inclusive",
            "patient_tax",
            "s_patient_tax",
            "company_tax",
            "total_tax",
            "patient_resp",
            "patient_payable",
            "comapany_resp",
            "company_payble",
            "sec_company",
            "sec_deductable_percentage",
            "sec_deductable_amount",
            "sec_company_res",
            "sec_company_tax",
            "sec_company_paybale",
            "sec_copay_percntage",
            "sec_copay_amount",
            "teeth_number",
            "ordered_services_id",
            "ordered_inventory_id",
            "ordered_package_id",
            "created_by",
            "created_date",
            "updated_by",
            "updated_date",
          ];

          // console.log("inputParam.billdetails", inputParam.billdetails)
          let newDtls = new LINQ(inputParam.billdetails)
            .Select((s) => {
              return {
                hims_f_billing_header_id: headerResult.insertId,
                service_type_id: s.service_type_id,
                services_id: s.services_id,
                quantity: s.quantity,
                unit_cost: s.unit_cost,
                insurance_yesno: s.insurance_yesno,
                gross_amount: s.gross_amount,
                discount_amout: s.discount_amout,
                discount_percentage: s.discount_percentage,
                net_amout: s.net_amout,
                copay_percentage: s.copay_percentage,
                copay_amount: s.copay_amount,
                deductable_amount: s.deductable_amount,
                deductable_percentage: s.deductable_percentage,
                tax_inclusive: s.tax_inclusive == 0 ? "N" : s.tax_inclusive,
                patient_tax: s.patient_tax,
                s_patient_tax: s.s_patient_tax,
                company_tax: s.company_tax,
                total_tax: s.total_tax,
                patient_resp: s.patient_resp,
                patient_payable: s.patient_payable,
                comapany_resp: s.comapany_resp,
                company_payble: s.company_payble,
                sec_company: s.sec_company == 0 ? "N" : s.sec_company,
                sec_deductable_percentage: s.sec_deductable_percentage,
                sec_deductable_amount: s.sec_deductable_amount,
                sec_company_res: s.sec_company_res,
                sec_company_tax: s.sec_company_tax,
                sec_company_paybale: s.sec_company_paybale,
                sec_copay_percntage: s.sec_copay_percntage,
                sec_copay_amount: s.sec_copay_amount,
                teeth_number: s.teeth_number,
                created_by: req.userIdentity.algaeh_d_app_user_id,
                created_date: new Date(),
                updated_by: req.userIdentity.algaeh_d_app_user_id,
                updated_date: new Date(),
                ordered_services_id: s.ordered_services_id,
                ordered_inventory_id: s.ordered_inventory_id,
                ordered_package_id: s.ordered_package_id,
              };
            })
            .ToArray();

          // let detailsInsert = [];

          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_billing_details(??) VALUES ? ;" + strQry,
              values: newDtls,
              includeValues: IncludeValues,
              bulkInsertOrUpdate: true,
              printQuery: true,
            })
            .then((detailsRecords) => {
              // utilities.logger().log("detailsRecords Bill: ", detailsRecords);
              if (req.connection == null) {
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                req.records = headerResult;
                next();

                // });
              } else {
                next();
              }
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  billingCalculations: (req, res, next) => {
    try {
      const utilities = new algaehUtilities();

      let decimal_places = req.userIdentity.decimal_places;

      let hasCalculateall =
        req.body.intCalculateall == undefined ? true : req.body.intCalculateall;
      let inputParam =
        req.body.intCalculateall == undefined ? req.body.billdetails : req.body;
      if (inputParam.length == 0) {
        next(
          utilities
            .httpStatus()
            .generateError(
              httpStatus.badRequest,
              "Please select atleast one service"
            )
        );
        return;
      }
      let sendingObject = {};
      // utilities.logger().log("inputParam: ", inputParam);

      // utilities.logger().log("hasCalculateall: ", hasCalculateall);
      if (hasCalculateall == true) {
        sendingObject.sub_total_amount = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.gross_amount)
        );

        sendingObject.net_total = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.net_amout)
        );
        // utilities.logger().log("net_total: ", sendingObject.net_total);
        sendingObject.discount_amount = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.discount_amout)
        );
        sendingObject.gross_total = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.patient_payable)
        );

        // Primary Insurance
        sendingObject.copay_amount = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.copay_amount)
        );
        sendingObject.deductable_amount = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.deductable_amount)
        );

        // Secondary Insurance
        sendingObject.sec_copay_amount = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.sec_copay_amount)
        );
        sendingObject.sec_deductable_amount = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.sec_deductable_amount)
        );

        // Responsibilities
        sendingObject.patient_res = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.patient_resp)
        );
        sendingObject.company_res = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.comapany_resp)
        );
        sendingObject.sec_company_res = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.sec_company_res)
        );

        // Tax Calculation
        sendingObject.total_tax = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.total_tax)
        );

        sendingObject.patient_tax = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.patient_tax)
        );

        sendingObject.s_patient_tax = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.s_patient_tax)
        );

        sendingObject.company_tax = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.company_tax)
        );

        sendingObject.sec_company_tax = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.sec_company_tax)
        );

        // Payables
        sendingObject.patient_payable = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.patient_payable)
        );

        sendingObject.company_payble = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.company_payble)
        );

        sendingObject.company_payable = new LINQ(inputParam).Sum(
          (d) => d.company_payble
        );

        sendingObject.sec_company_paybale = new LINQ(inputParam).Sum((d) =>
          parseFloat(d.sec_company_paybale)
        );
        // Sheet Level Discount Nullify
        sendingObject.sheet_discount_amount = 0;
        sendingObject.sheet_discount_percentage = 0;
        sendingObject.advance_adjust = 0;
        sendingObject.net_amount = sendingObject.patient_payable;
        if (inputParam.credit_amount > 0) {
          sendingObject.receiveable_amount =
            sendingObject.net_amount - inputParam.credit_amount;
        } else {
          sendingObject.receiveable_amount = sendingObject.net_amount;
        }

        //Reciept
        sendingObject.cash_amount = sendingObject.receiveable_amount;
        sendingObject.total_amount = sendingObject.receiveable_amount;

        sendingObject.unbalanced_amount = 0;
        sendingObject.card_amount = 0;
        sendingObject.cheque_amount = 0;

        sendingObject.patient_payable = utilities.decimalPoints(
          sendingObject.patient_payable,
          decimal_places
        );
        sendingObject.total_tax = utilities.decimalPoints(
          sendingObject.total_tax,
          decimal_places
        );

        sendingObject.patient_tax = utilities.decimalPoints(
          sendingObject.patient_tax,
          decimal_places
        );

        sendingObject.s_patient_tax = utilities.decimalPoints(
          sendingObject.s_patient_tax,
          decimal_places
        );

        sendingObject.company_tax = utilities.decimalPoints(
          sendingObject.company_tax,
          decimal_places
        );
        sendingObject.sec_company_tax = utilities.decimalPoints(
          sendingObject.sec_company_tax,
          decimal_places
        );
      } else {
        //Reciept

        if (inputParam.isReceipt == false) {
          // Sheet Level Discount Nullify
          sendingObject.sheet_discount_percentage = 0;
          sendingObject.sheet_discount_amount = 0;

          if (inputParam.sheet_discount_amount > 0) {
            sendingObject.sheet_discount_percentage =
              (inputParam.sheet_discount_amount / inputParam.gross_total) * 100;
            sendingObject.sheet_discount_percentage = parseFloat(
              parseFloat(sendingObject.sheet_discount_percentage).toFixed(3)
            );
            sendingObject.sheet_discount_amount =
              inputParam.sheet_discount_amount;
          } else if (inputParam.sheet_discount_percentage > 0) {
            sendingObject.sheet_discount_percentage =
              inputParam.sheet_discount_percentage;
            sendingObject.sheet_discount_amount =
              (inputParam.gross_total * inputParam.sheet_discount_percentage) /
              100;
          }

          sendingObject.sheet_discount_amount = utilities.decimalPoints(
            sendingObject.sheet_discount_amount,
            decimal_places
          );

          sendingObject.sheet_discount_percentage = utilities.decimalPoints(
            sendingObject.sheet_discount_percentage,
            decimal_places
          );

          console.log("sendingObject", sendingObject);
          console.log("inputParam", inputParam);

          sendingObject.net_amount =
            parseFloat(inputParam.gross_total) -
            sendingObject.sheet_discount_amount;

          sendingObject.net_amount = utilities.decimalPoints(
            sendingObject.net_amount,
            decimal_places
          );

          if (inputParam.credit_amount > 0) {
            if (inputParam.pack_advance_adjust > 0) {
              sendingObject.receiveable_amount =
                sendingObject.net_amount -
                parseFloat(inputParam.advance_adjust) -
                parseFloat(inputParam.credit_amount) -
                parseFloat(inputParam.pack_advance_adjust);
            } else {
              sendingObject.receiveable_amount =
                sendingObject.net_amount -
                parseFloat(inputParam.advance_adjust) -
                parseFloat(inputParam.credit_amount);
            }
          } else {
            if (inputParam.pack_advance_adjust > 0) {
              sendingObject.receiveable_amount =
                sendingObject.net_amount -
                parseFloat(inputParam.advance_adjust) -
                parseFloat(inputParam.pack_advance_adjust);
            } else {
              sendingObject.receiveable_amount =
                sendingObject.net_amount -
                parseFloat(inputParam.advance_adjust);
            }
          }

          console.log("sendingObject", sendingObject);

          sendingObject.receiveable_amount = utilities.decimalPoints(
            sendingObject.receiveable_amount,
            decimal_places
          );

          sendingObject.cash_amount = sendingObject.receiveable_amount;
          sendingObject.card_amount = 0;
          sendingObject.cheque_amount = 0;
        } else {
          sendingObject.card_amount = inputParam.card_amount;
          sendingObject.cheque_amount = inputParam.cheque_amount;
          sendingObject.cash_amount = inputParam.cash_amount;
          sendingObject.receiveable_amount = Number(
            inputParam.receiveable_amount.toFixed(3)
          );
        }

        sendingObject.total_amount =
          sendingObject.cash_amount +
          sendingObject.card_amount +
          sendingObject.cheque_amount;

        sendingObject.unbalanced_amount =
          sendingObject.receiveable_amount - sendingObject.total_amount;
      }

      req.records = sendingObject;
      next();
    } catch (e) {
      next(e);
    }
  },

  patientAdvanceRefund: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };

      // const utilities = new algaehUtilities();
      // utilities.logger().log("inputParam Receipt: ", inputParam);

      if (
        inputParam.receiptdetails == null ||
        inputParam.receiptdetails.length == 0
      ) {
        next(
          utilities
            .httpStatus()
            .generateError(
              httpStatus.badRequest,
              "Please select atleast one service."
            )
        );
      }
      let Module_Name = "";
      //Advance
      if (inputParam.pay_type == "R") {
        Module_Name = "RECEIPT";
      } else if (inputParam.pay_type == "P") {
        Module_Name = "REFUND";
      }

      req["adv_refnd"] = "Y";
      // console.log("deination:", req.mySQl);
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: [Module_Name],
          table_name: "hims_f_app_numgen",
        })
        .then((generatedNumbers) => {
          req.body["receipt_number"] = generatedNumbers[Module_Name];
          req.body["bill_number"] = generatedNumbers[Module_Name];
          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
                  created_by, created_date, updated_by, updated_date,  counter_id, shift_id, pay_type,hospital_id) \
                  VALUES (?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                generatedNumbers[Module_Name],
                new Date(),
                inputParam.total_amount,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.counter_id,
                inputParam.shift_id,
                inputParam.pay_type,
                req.userIdentity.hospital_id,
              ],
              printQuery: true,
            })
            .then((headerRcptResult) => {
              req.connection = {
                connection: _mysql.connection,
                isTransactionConnection: _mysql.isTransactionConnection,
                pool: _mysql.pool,
              };
              if (
                headerRcptResult.insertId != null &&
                headerRcptResult.insertId != ""
              ) {
                req.body.receipt_header_id = headerRcptResult.insertId;
                const receptSample = [
                  "card_check_number",
                  "expiry_date",
                  "pay_type",
                  "amount",
                  "created_by",
                  "updated_by",
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_receipt_details(??) VALUES ?",
                    values: inputParam.receiptdetails,
                    includeValues: receptSample,
                    extraValues: {
                      hims_f_receipt_header_id: headerRcptResult.insertId,
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((RcptDetailsRecords) => {
                    _mysql
                      .executeQuery({
                        query:
                          "INSERT  INTO hims_f_patient_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
                            transaction_type, advance_amount, created_by, \
                            created_date, updated_by, update_date,  hospital_id) VALUES (?,?,?,?,?,?,?,?,?) ;\
                            SELECT advance_amount FROM hims_f_patient WHERE hims_d_patient_id=?",
                        values: [
                          inputParam.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParam.transaction_type,
                          inputParam.advance_amount,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.hospital_id,
                          inputParam.hims_f_patient_id,
                        ],
                        printQuery: true,
                      })
                      .then((Insert_Advance) => {
                        let existingAdvance =
                          Insert_Advance[1][0].advance_amount;

                        if (existingAdvance != null) {
                          if (inputParam.transaction_type == "AD") {
                            inputParam.advance_amount =
                              parseFloat(inputParam.advance_amount) +
                              parseFloat(existingAdvance);
                          } else if (inputParam.transaction_type == "RF") {
                            inputParam.advance_amount =
                              existingAdvance -
                              parseFloat(inputParam.advance_amount);
                          }
                        }

                        _mysql
                          .executeQuery({
                            query:
                              "UPDATE  `hims_f_patient` SET  `advance_amount`=?, \
                                        `updated_by`=?, `updated_date`=? WHERE `hims_d_patient_id`=?",
                            values: [
                              inputParam.advance_amount,
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              inputParam.hims_f_patient_id,
                            ],
                            printQuery: true,
                          })
                          .then((update_advance) => {
                            req.records = {
                              receipt_number: generatedNumbers[Module_Name],
                              total_advance_amount: inputParam.advance_amount,
                            };
                            next();
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getBillDetailsBACKUP19_july_2019: (req, res, next) => {
    try {
      // const utilities = new algaehUtilities();

      new Promise((resolve, reject) => {
        try {
          // utilities.logger().log("getBillDetails: ");
          getBillDetailsFunctionality(req, res, next, resolve);
        } catch (e) {
          reject(e);
        }
      }).then((result) => {
        req.records = result;
        next();
      });
    } catch (e) {
      next(e);
    }
  },
  //created by:Irfan
  addCashHandover_backup: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    // const utilities = new algaehUtilities();

    try {
      let inputParam = { ...req.body };
      // req.body.receipt_header_id
      //  utilities.logger().log("inputParam Cash: ", inputParam);

      if (
        inputParam.receiptdetails == null ||
        inputParam.receiptdetails.length == 0
      ) {
        req.records = {
          internal_error: true,
          message: "No receipt details",
        };
        _mysql.rollBackTransaction(() => {});
        next();
        return;
      } else if (
        req.userIdentity.group_type == "C" ||
        req.userIdentity.group_type == "FD" ||
        req.userIdentity.user_type == "C"
      ) {
        let hims_f_cash_handover_detail_id = "";
        _mysql
          .executeQuery({
            query:
              "select hims_f_cash_handover_detail_id, cash_handover_header_id, casher_id, shift_status,open_date\
              from  hims_f_cash_handover_detail where record_status='A'  and hospital_id=? and\
              date(open_date)=CURDATE()  and casher_id=? and shift_status='O';\
              select hims_f_cash_handover_header_id from hims_f_cash_handover_header where\
            shift_id=? and date(daily_handover_date)=CURDATE() and hospital_id=? ;",
            values: [
              req.userIdentity.hospital_id,
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.shift_id,
              req.userIdentity.hospital_id,
            ],
            printQuery: true,
          })
          .then((reslt) => {
            let checkShiftStatus = reslt[0];
            let shift_header = reslt[1];
            if (checkShiftStatus.length > 0) {
              hims_f_cash_handover_detail_id =
                checkShiftStatus[0].hims_f_cash_handover_detail_id;
            }
            new Promise((resolve, reject) => {
              try {
                if (!checkShiftStatus.length > 0) {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT IGNORE INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                        created_date, created_by, updated_date, updated_by,hospital_id)\
                       VALUE(?,?,?,?,?,?,?)",
                      values: [
                        inputParam.shift_id,
                        new Date(),
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        req.userIdentity.hospital_id,
                      ],
                      printQuery: true,
                    })
                    .then((headerCashHandover) => {
                      let header_id = null;
                      if (headerCashHandover.insertId > 0) {
                        header_id = headerCashHandover.insertId;
                      } else if (shift_header.length > 0) {
                        header_id =
                          shift_header[0].hims_f_cash_handover_header_id;
                      }

                      if (header_id > 0) {
                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                              shift_status,open_date,  expected_cash, expected_card,  expected_cheque, \
                              no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                            values: [
                              header_id,
                              req.userIdentity.algaeh_d_app_user_id,
                              "O",
                              new Date(),
                              0,
                              0,
                              0,
                              0,
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              req.userIdentity.hospital_id,
                            ],
                            printQuery: true,
                          })
                          .then((CashHandoverDetails) => {
                            if (CashHandoverDetails.insertId > 0) {
                              hims_f_cash_handover_detail_id =
                                CashHandoverDetails.insertId;
                            }

                            resolve(CashHandoverDetails);
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                              reject(error);
                            });
                          });
                      }
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                        reject(error);
                      });
                    });
                } else if (checkShiftStatus.length > 0) {
                  resolve({});
                }
              } catch (e) {
                _mysql.rollBackTransaction(() => {
                  reject(e);
                });
              }
            }).then((result) => {
              let expected_cash = 0;
              let expected_card = 0;
              let expected_cheque = 0;
              let no_of_cheques = 0;

              expected_cash = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CA")
                .Sum((s) => parseFloat(s.amount));

              expected_card = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CD")
                .Sum((s) => parseFloat(s.amount));

              expected_cheque = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CH")
                .Sum((s) => parseFloat(s.amount));

              no_of_cheques = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CH")
                .ToArray().length;

              _mysql
                .executeQuery({
                  query:
                    "select expected_cash,expected_card, expected_cheque, no_of_cheques from \
                  hims_f_cash_handover_detail where record_status='A' and hims_f_cash_handover_detail_id=?",
                  values: [hims_f_cash_handover_detail_id],
                  printQuery: true,
                })
                .then((selectCurrentCash) => {
                  expected_cash += parseFloat(
                    selectCurrentCash[0].expected_cash
                  );
                  expected_card += parseFloat(
                    selectCurrentCash[0].expected_card
                  );
                  expected_cheque += parseFloat(
                    selectCurrentCash[0].expected_cheque
                  );
                  no_of_cheques += parseFloat(
                    selectCurrentCash[0].no_of_cheques
                  );

                  _mysql
                    .executeQuery({
                      query:
                        "update hims_f_cash_handover_detail set expected_cash=?,expected_card=?,\
                  expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
                  and hims_f_cash_handover_detail_id=?;\
                  update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                      values: [
                        expected_cash,
                        expected_card,
                        expected_cheque,
                        no_of_cheques,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        hims_f_cash_handover_detail_id,
                        hims_f_cash_handover_detail_id,
                        req.body.receipt_header_id,
                      ],
                      printQuery: true,
                    })
                    .then((updateResult) => {
                      if (req.connection == null) {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = updateResult;
                          next();
                        });
                      } else {
                        if (req.records) {
                          req.records["internal_error"] = false;
                        } else {
                          req.records = {
                            internal_error: false,
                          };
                        }

                        next();
                      }
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        if (req.connection == null) {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = {
              internal_error: true,
              message: "Current user is not a Cashier in",
            };
            next();
          });
        } else {
          req.records = {
            internal_error: true,
            message: "Current user is not a Cashier",
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  reVertCashHandover: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);

    const inputParam = req.body;

    try {
      if (req.userIdentity.user_type == "C" && inputParam.shift_id > 0) {
        if (inputParam.receiptdetails.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_f_cash_handover_header_id, shift_id, daily_handover_date,\
                hims_f_cash_handover_detail_id, D.casher_id,D.shift_status,D.open_date,\
                D.expected_cash,D.expected_card,D.no_of_cheques,D.collected_cash,D.refunded_cash\
                from hims_f_cash_handover_header H left join hims_f_cash_handover_detail D \
                on H.hims_f_cash_handover_header_id=D.cash_handover_header_id\
                and date(D.open_date)=CURDATE()  and casher_id=? and shift_status='O' and D.record_status='A'\
                where H.shift_id=? and date(H.daily_handover_date)=CURDATE() and H.hospital_id=? ",
              values: [
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.shift_id,
                req.userIdentity.hospital_id,
              ],
              printQuery: true,
            })
            .then((result) => {
              console.log("result", result);
              let collected_cash = 0;
              let expected_card = 0;

              collected_cash = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CA")
                .Sum((s) => parseFloat(s.amount));

              expected_card = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CD")
                .Sum((s) => parseFloat(s.amount));

              expected_card =
                result[0].expected_card === null
                  ? 0
                  : parseFloat(result[0].expected_card) - expected_card;
              collected_cash =
                result[0].collected_cash === null
                  ? 0
                  : parseFloat(result[0].collected_cash) - collected_cash;

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "update hims_f_cash_handover_detail set collected_cash=?,expected_card=?,\
                    updated_date=?,updated_by=? where record_status='A' \
                  and hims_f_cash_handover_detail_id=?;\
                  update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                              where hims_f_cash_handover_detail_id=?;",
                  values: [
                    collected_cash,
                    expected_card,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    result[0]["hims_f_cash_handover_detail_id"],
                    result[0]["hims_f_cash_handover_detail_id"],
                  ],
                  printQuery: true,
                })
                .then((updateResult) => {
                  if (req.records) {
                    req.records["internal_error"] = false;
                  } else {
                    req.records = {
                      internal_error: false,
                    };
                  }

                  next();
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });

                  //  console.log("er3 :", error);
                });
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          req.records = {
            internal_error: true,
            message: "No receipt details",
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      } else {
        req.records = {
          internal_error: true,
          message: "Current user is not a Cashier",
        };
        _mysql.rollBackTransaction(() => {
          next();
        });
      }
    } catch (e) {
      // console.log("error:", e);
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  revertOldCashHandover: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);

    const inputParam = req.body;

    try {
      if (req.userIdentity.user_type == "C" && inputParam.shift_id > 0) {
        if (inputParam.receiptdetails.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select RD.* from hims_f_billing_header BH \
                inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
                where BH.hims_f_billing_header_id=?; ",
              values: [inputParam.from_bill_id],
              printQuery: true,
            })
            .then((receipt_result) => {
              _mysql
                .executeQuery({
                  query:
                    "select hims_f_cash_handover_header_id, shift_id, daily_handover_date,\
                hims_f_cash_handover_detail_id, D.casher_id,D.shift_status,D.open_date,\
                D.expected_cash,D.expected_card,D.no_of_cheques,D.collected_cash,D.refunded_cash\
                from hims_f_cash_handover_header H left join hims_f_cash_handover_detail D \
                on H.hims_f_cash_handover_header_id=D.cash_handover_header_id\
                and date(D.open_date)=CURDATE()  and casher_id=? and shift_status='O' and D.record_status='A'\
                where H.shift_id=? and date(H.daily_handover_date)=CURDATE() and H.hospital_id=? ",
                  values: [
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.shift_id,
                    req.userIdentity.hospital_id,
                  ],
                  printQuery: true,
                })
                .then((result) => {
                  console.log("1", result);
                  let collected_cash = 0;
                  let expected_card = 0;
                  console.log("2", receipt_result);
                  collected_cash = new LINQ(receipt_result)
                    .Where((w) => w.pay_type == "CA")
                    .Sum((s) => parseFloat(s.amount));

                  console.log("3");
                  expected_card = new LINQ(receipt_result)
                    .Where((w) => w.pay_type == "CD")
                    .Sum((s) => parseFloat(s.amount));

                  console.log("4");
                  expected_card =
                    parseFloat(result[0].expected_card) - expected_card;
                  collected_cash =
                    parseFloat(result[0].collected_cash) - collected_cash;

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "update hims_f_cash_handover_detail set collected_cash=?,expected_card=?,\
                    updated_date=?,updated_by=? where record_status='A' \
                  and hims_f_cash_handover_detail_id=?;\
                  update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                              where hims_f_cash_handover_detail_id=?;",
                      values: [
                        collected_cash,
                        expected_card,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        result[0]["hims_f_cash_handover_detail_id"],
                        result[0]["hims_f_cash_handover_detail_id"],
                      ],
                      printQuery: true,
                    })
                    .then((updateResult) => {
                      if (req.records) {
                        req.records["internal_error"] = false;
                      } else {
                        req.records = {
                          internal_error: false,
                        };
                      }

                      next();
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          req.records = {
            internal_error: true,
            message: "No receipt details",
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      } else {
        req.records = {
          internal_error: true,
          message: "Current user is not a Cashier",
        };
        _mysql.rollBackTransaction(() => {
          next();
        });
      }
    } catch (e) {
      // console.log("error:", e);
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  //created by:Irfan
  addCashHandover: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);

    // const utilities = new algaehUtilities();

    const inputParam = req.body;

    if (req.body.consultation == "N") {
      req.records = {
        internal_error: false,
      };
      next();
      return;
    }
    try {
      if (req.userIdentity.user_type == "C" && inputParam.shift_id > 0) {
        if (inputParam.receiptdetails.length > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_f_cash_handover_header_id, shift_id, daily_handover_date,\
                hims_f_cash_handover_detail_id, D.casher_id,D.shift_status,D.open_date,\
                D.expected_cheque,D.expected_card,D.no_of_cheques,D.collected_cash,D.refunded_cash\
                from hims_f_cash_handover_header H left join hims_f_cash_handover_detail D \
                on H.hims_f_cash_handover_header_id=D.cash_handover_header_id\
                and date(D.open_date)=CURDATE()  and casher_id=? and shift_status='O' and D.record_status='A'\
                where H.shift_id=? and date(H.daily_handover_date)=CURDATE() and H.hospital_id=? ",
              values: [
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.shift_id,
                req.userIdentity.hospital_id,
              ],
              printQuery: true,
            })
            .then((result) => {
              let collected_cash = 0;
              let expected_card = 0;
              let expected_cheque = 0;
              let no_of_cheques = 0;

              //update Details
              let whichQuery = "UD";

              if (!result.length > 0) {
                //insert header and details
                whichQuery = "IHD";
              } else if (
                result.length > 0 &&
                !result[0]["hims_f_cash_handover_detail_id"] > 0
              ) {
                //insert details
                whichQuery = "ID";
              }

              collected_cash = new LINQ(inputParam.receiptdetails)
                .Where((w) => w.pay_type == "CA")
                .Sum((s) => parseFloat(s.amount));
              //console.log("collected_cash:", collected_cash);
              if (inputParam.pay_type == "P") {
                switch (whichQuery) {
                  case "IHD":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                            created_date, created_by, updated_date, updated_by,hospital_id)\
                          VALUE(?,?,?,?,?,?,?)",
                        values: [
                          inputParam.shift_id,
                          new Date(),
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id,
                        ],
                        printQuery: true,
                      })
                      .then((headerRes) => {
                        if (headerRes.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                            shift_status,open_date,  refunded_cash,created_date, created_by, updated_date, updated_by,hospital_id)\
                            VALUE(?,?,?,?,?,?,?,?,?,?)",
                              values: [
                                headerRes.insertId,
                                req.userIdentity.algaeh_d_app_user_id,
                                "O",
                                new Date(),
                                collected_cash,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.hospital_id,
                              ],
                              printQuery: true,
                            })
                            .then((handoverDetails) => {
                              if (handoverDetails.insertId > 0) {
                                _mysql
                                  .executeQuery({
                                    query:
                                      "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                                    update hims_f_receipt_header set cash_handover_detail_id=? where\
                                       hims_f_receipt_header_id=?;",
                                    values: [
                                      handoverDetails.insertId,
                                      handoverDetails.insertId,
                                      req.body.receipt_header_id,
                                    ],
                                    printQuery: true,
                                  })
                                  .then((updateRecept) => {
                                    if (
                                      req.connection == null ||
                                      req.adv_refnd == "Y"
                                    ) {
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        if (req.adv_refnd !== "Y") {
                                          req.records = updateRecept;
                                        }
                                        next();
                                      });
                                    } else {
                                      if (req.records) {
                                        req.records["internal_error"] = false;
                                      } else {
                                        req.records = {
                                          internal_error: false,
                                        };
                                      }

                                      next();
                                    }
                                  })
                                  .catch((error) => {
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              } else {
                                req.records = {
                                  internal_error: true,
                                  message: "detais error",
                                };
                                _mysql.rollBackTransaction(() => {
                                  next();
                                });
                              }
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "Header error",
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;

                  case "ID":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                        shift_status,open_date,  refunded_cash,created_date, created_by, updated_date, updated_by,hospital_id)\
                        VALUE(?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          result[0]["hims_f_cash_handover_header_id"],
                          req.userIdentity.algaeh_d_app_user_id,
                          "O",
                          new Date(),
                          collected_cash,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id,
                        ],
                        printQuery: true,
                      })
                      .then((handoverDetails) => {
                        if (handoverDetails.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                              where hims_f_cash_handover_detail_id=?;\
                              update hims_f_receipt_header set cash_handover_detail_id=? where\
                              hims_f_receipt_header_id=?;",
                              values: [
                                handoverDetails.insertId,
                                handoverDetails.insertId,
                                req.body.receipt_header_id,
                              ],
                              printQuery: true,
                            })
                            .then((updateRecept) => {
                              if (
                                req.connection == null ||
                                req.adv_refnd == "Y"
                              ) {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  if (req.adv_refnd !== "Y") {
                                    req.records = updateRecept;
                                  }
                                  next();
                                });
                              } else {
                                if (req.records) {
                                  req.records["internal_error"] = false;
                                } else {
                                  req.records = {
                                    internal_error: false,
                                  };
                                }

                                next();
                              }
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "detais error",
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;
                  case "UD":
                    collected_cash += parseFloat(result[0].refunded_cash);

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_cash_handover_detail set refunded_cash=?,updated_date=?,updated_by=? where record_status='A' \
                      and hims_f_cash_handover_detail_id=?;\
                      update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                       update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                        values: [
                          collected_cash,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          req.body.receipt_header_id,
                        ],
                        printQuery: true,
                      })
                      .then((updateResult) => {
                        if (req.connection == null || req.adv_refnd == "Y") {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            if (req.adv_refnd !== "Y") {
                              req.records = updateRecept;
                            }
                            next();
                          });
                        } else {
                          if (req.records) {
                            req.records["internal_error"] = false;
                          } else {
                            req.records = {
                              internal_error: false,
                            };
                          }

                          next();
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                    break;
                }
              } else {
                //   console.log("one :");
                expected_card = new LINQ(inputParam.receiptdetails)
                  .Where((w) => w.pay_type == "CD")
                  .Sum((s) => parseFloat(s.amount));

                expected_cheque = new LINQ(inputParam.receiptdetails)
                  .Where((w) => w.pay_type == "CH")
                  .Sum((s) => parseFloat(s.amount));

                no_of_cheques = new LINQ(inputParam.receiptdetails)
                  .Where((w) => w.pay_type == "CH")
                  .ToArray().length;

                //  console.log("whichQuery:", whichQuery);
                switch (whichQuery) {
                  case "IHD":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO `hims_f_cash_handover_header` ( shift_id, daily_handover_date,\
                              created_date, created_by, updated_date, updated_by,hospital_id)\
                            VALUE(?,?,?,?,?,?,?)",
                        values: [
                          inputParam.shift_id,
                          new Date(),
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id,
                        ],
                        printQuery: true,
                      })
                      .then((headerRes) => {
                        //  console.log("two :");
                        if (headerRes.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                              shift_status,open_date,   collected_cash,expected_card,  expected_cheque, \
                              no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                              values: [
                                headerRes.insertId,
                                req.userIdentity.algaeh_d_app_user_id,
                                "O",
                                new Date(),

                                collected_cash,
                                expected_card,
                                expected_cheque,
                                no_of_cheques,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.hospital_id,
                              ],
                              printQuery: true,
                            })
                            .then((handoverDetails) => {
                              // console.log("three :");
                              if (handoverDetails.insertId > 0) {
                                _mysql
                                  .executeQuery({
                                    query:
                                      "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                                    update hims_f_receipt_header set cash_handover_detail_id=? where\
                                         hims_f_receipt_header_id=?;",
                                    values: [
                                      handoverDetails.insertId,
                                      handoverDetails.insertId,
                                      req.body.receipt_header_id,
                                    ],
                                    printQuery: true,
                                  })
                                  .then((updateRecept) => {
                                    // console.log("here :", "catt");
                                    if (
                                      req.connection == null ||
                                      req.adv_refnd == "Y"
                                    ) {
                                      // console.log("four here :");
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        if (req.adv_refnd !== "Y") {
                                          req.records = updateRecept;
                                        }
                                        next();
                                      });
                                    } else {
                                      // console.log("here :", "dog");
                                      if (req.records) {
                                        req.records["internal_error"] = false;
                                      } else {
                                        req.records = {
                                          internal_error: false,
                                        };
                                      }

                                      next();
                                    }
                                  })
                                  .catch((error) => {
                                    // console.log("error1 :", error);
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              } else {
                                req.records = {
                                  internal_error: true,
                                  message: "detais error",
                                };
                                _mysql.rollBackTransaction(() => {
                                  next();
                                });
                              }
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "Header error",
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;

                  case "ID":
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO `hims_f_cash_handover_detail` ( cash_handover_header_id, casher_id,\
                      shift_status,open_date,  collected_cash, expected_card,  expected_cheque, \
                      no_of_cheques,created_date, created_by, updated_date, updated_by,hospital_id)\
                      VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                          result[0]["hims_f_cash_handover_header_id"],
                          req.userIdentity.algaeh_d_app_user_id,
                          "O",
                          new Date(),
                          collected_cash,
                          expected_card,
                          expected_cheque,
                          no_of_cheques,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          req.userIdentity.hospital_id,
                        ],
                      })
                      .then((handoverDetails) => {
                        //console.log("apple :");
                        if (handoverDetails.insertId > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                              where hims_f_cash_handover_detail_id=?;\
                              update hims_f_receipt_header set cash_handover_detail_id=? where\
                                hims_f_receipt_header_id=?;",
                              values: [
                                handoverDetails.insertId,
                                handoverDetails.insertId,
                                req.body.receipt_header_id,
                              ],
                              printQuery: true,
                            })
                            .then((updateRecept) => {
                              // console.log("ball :");
                              if (
                                req.connection == null ||
                                req.adv_refnd == "Y"
                              ) {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  if (req.adv_refnd !== "Y") {
                                    req.records = updateRecept;
                                  }

                                  next();
                                });
                              } else {
                                if (req.records) {
                                  req.records["internal_error"] = false;
                                } else {
                                  req.records = {
                                    internal_error: false,
                                  };
                                }

                                next();
                              }
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          req.records = {
                            internal_error: true,
                            message: "detais error",
                          };
                          _mysql.rollBackTransaction(() => {
                            next();
                          });
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });

                    break;
                  case "UD":
                    expected_card += parseFloat(result[0].expected_card);
                    collected_cash += parseFloat(result[0].collected_cash);
                    expected_cheque += parseFloat(result[0].expected_cheque);
                    no_of_cheques += parseFloat(result[0].no_of_cheques);
                    console.log("12345");
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_cash_handover_detail set collected_cash=?,expected_card=?,\
                          expected_cheque=?,no_of_cheques=?,updated_date=?,updated_by=? where record_status='A' \
                        and hims_f_cash_handover_detail_id=?;\
                        update hims_f_cash_handover_detail set expected_cash=collected_cash-refunded_cash\
                                    where hims_f_cash_handover_detail_id=?;\
                         update hims_f_receipt_header set cash_handover_detail_id=? where hims_f_receipt_header_id=?;",
                        values: [
                          collected_cash,
                          expected_card,
                          expected_cheque,
                          no_of_cheques,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          result[0]["hims_f_cash_handover_detail_id"],
                          req.body.receipt_header_id,
                        ],
                        printQuery: true,
                      })
                      .then((updateResult) => {
                        // console.log("last :", req.adv_refnd);
                        // console.log("last 1 :", req.connection);
                        if (req.connection == null || req.adv_refnd == "Y") {
                          // console.log("BOOSSS :");
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            if (req.adv_refnd !== "Y") {
                              req.records = updateRecept;
                            }
                            next();
                          });
                        } else {
                          if (req.records) {
                            req.records["internal_error"] = false;
                          } else {
                            req.records = {
                              internal_error: false,
                            };
                          }

                          next();
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });

                        //  console.log("er3 :", error);
                      });
                    break;
                }
              }
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          req.records = {
            internal_error: true,
            message: "No receipt details",
          };
          _mysql.rollBackTransaction(() => {
            next();
          });
        }
      } else {
        req.records = {
          internal_error: true,
          message: "Current user is not a Cashier",
        };
        _mysql.rollBackTransaction(() => {
          next();
        });
      }
    } catch (e) {
      // console.log("error:", e);
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  getBillDetailsFunction: (req, res, next, resolve) => {
    try {
      getBillDetailsFunctionality(req, res, next, resolve);
    } catch (e) {
      next(e);
    }
  },

  getPakageDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    // utilities.logger().log("getPakageDetails ");

    try {
      let inputParam = req.query;

      // utilities.logger().log("inputParam: ", inputParam);

      _mysql
        .executeQuery({
          query:
            "SELECT PH.package_service_id,PD.hims_d_package_detail_id,PD.service_id,PD.service_amount \
            FROM hims_d_package_header PH, hims_d_package_detail PD where PH.hims_d_package_header_id=PD.package_header_id and  \
            PH.package_service_id=?;",
          values: [inputParam.package_service_id],
          printQuery: true,
        })
        .then((package_details) => {
          _mysql.releaseConnection();
          req.records = package_details;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(error);
    }
  },

  patientPackageAdvanceRefund: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };

      if (
        inputParam.receiptdetails == null ||
        inputParam.receiptdetails.length == 0
      ) {
        next(
          utilities
            .httpStatus()
            .generateError(
              httpStatus.badRequest,
              "Please select atleast one service."
            )
        );
      }
      let Module_Name = "";
      //Advance
      if (inputParam.pay_type == "R") {
        Module_Name = "RECEIPT";
      } else if (inputParam.pay_type == "P") {
        Module_Name = "REFUND";
      }
      req["adv_refnd"] = "Y";

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: [Module_Name],
          table_name: "hims_f_app_numgen",
        })
        .then((generatedNumbers) => {
          req.body["bill_number"] = generatedNumbers[Module_Name];
          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
                  created_by, created_date, updated_by, updated_date, shift_id, pay_type,hospital_id) \
                  VALUES (?,?,?,?,?,?,?,?,?,?)",
              values: [
                generatedNumbers[Module_Name],
                new Date(),
                inputParam.total_amount,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                inputParam.shift_id,
                inputParam.pay_type,
                req.userIdentity.hospital_id,
              ],
              printQuery: true,
            })
            .then((headerRcptResult) => {
              req.connection = {
                connection: _mysql.connection,
                isTransactionConnection: _mysql.isTransactionConnection,
                pool: _mysql.pool,
              };

              if (
                headerRcptResult.insertId != null &&
                headerRcptResult.insertId != ""
              ) {
                req.body.receipt_header_id = headerRcptResult.insertId;
                const receptSample = [
                  "card_check_number",
                  "expiry_date",
                  "pay_type",
                  "amount",
                  "created_by",
                  "updated_by",
                ];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_f_receipt_details(??) VALUES ?",
                    values: inputParam.receiptdetails,
                    includeValues: receptSample,
                    extraValues: {
                      hims_f_receipt_header_id: headerRcptResult.insertId,
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((RcptDetailsRecords) => {
                    _mysql
                      .executeQuery({
                        query:
                          "INSERT  INTO hims_f_patient_pakage_advance ( hims_f_patient_id, hims_f_receipt_header_id,\
                            transaction_type, advance_amount, package_id,created_by, \
                            created_date, updated_by, update_date,  hospital_id) VALUES (?,?,?,?,?,?,?,?,?,?) ;\
                            SELECT advance_amount,balance_amount FROM hims_f_package_header WHERE hims_f_package_header_id=?",
                        values: [
                          inputParam.hims_f_patient_id,
                          headerRcptResult.insertId,
                          inputParam.transaction_type,
                          inputParam.advance_amount,
                          inputParam.package_id,
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                          new Date(),
                          req.userIdentity.hospital_id,
                          inputParam.package_id,
                        ],
                        printQuery: true,
                      })
                      .then((Insert_Advance) => {
                        let existingAdvance =
                          Insert_Advance[1][0].advance_amount;
                        let balance_amount =
                          Insert_Advance[1][0].balance_amount;
                        let utilize_amount =
                          Insert_Advance[1][0].utilize_amount;

                        let strQuery = "";
                        if (existingAdvance != null) {
                          if (inputParam.transaction_type == "AD") {
                            inputParam.balance_amount =
                              parseFloat(inputParam.advance_amount) +
                              parseFloat(balance_amount);
                            inputParam.advance_amount =
                              parseFloat(inputParam.advance_amount) +
                              parseFloat(existingAdvance);

                            strQuery +=
                              " , advance_amount='" +
                              inputParam.advance_amount +
                              "' , balance_amount ='" +
                              inputParam.balance_amount +
                              "'";
                          } else if (inputParam.transaction_type == "RF") {
                            strQuery +=
                              ", `closed`='Y', closed_type='R', closed_remarks = '" +
                              inputParam.closed_remarks +
                              "'";
                          }
                        }

                        _mysql
                          .executeQuery({
                            query:
                              "UPDATE  `hims_f_package_header` SET `updated_by`=?, `updated_date`=?" +
                              strQuery +
                              " WHERE `hims_f_package_header_id`=?",
                            values: [
                              req.userIdentity.algaeh_d_app_user_id,
                              new Date(),
                              inputParam.package_id,
                            ],
                            printQuery: true,
                          })
                          .then((update_advance) => {
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            //   req.records = {
                            //     receipt_number: generatedNumbers[Module_Name],
                            //     total_advance_amount: inputParam.advance_amount,
                            //   };
                            //   next();
                            // });
                            req.records = {
                              receipt_number: generatedNumbers[Module_Name],
                              total_advance_amount: inputParam.advance_amount,
                            };
                            next();
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePatientPackage: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    try {
      let inputParam = req.body;

      // if (inputParam.consultation == "Y") {
      //   for (let i = 0; i < inputParam.package_details.length; i++) {
      //     inputParam.package_details[i].visit_id = inputParam.visit_id;
      //     inputParam.package_details[i].doctor_id = inputParam.doctor_id;
      //   }
      // }
      req.body.incharge_or_provider = req.body.doctor_id;
      req.body.billed = "N";
      let qry = "";
      for (let i = 0; i < inputParam.package_details.length; i++) {
        if (inputParam.consultation == "Y") {
          inputParam.package_details[i].visit_id = inputParam.visit_id;
          inputParam.package_details[i].doctor_id = inputParam.doctor_id;
        }
        qry += mysql.format(
          "UPDATE `hims_f_package_detail` SET utilized_qty=?, available_qty=?,utilized_date=?,utilized_by=? \
          where hims_f_package_detail_id=?;",
          [
            inputParam.package_details[i].utilized_qty,
            inputParam.package_details[i].available_qty,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.package_details[i].hims_f_package_detail_id,
          ]
        );
      }

      _mysql
        .executeQuery({
          query: qry,
          forceWithTransactionConnection: req.connection == null ? true : false,
          printQuery: true,
        })
        .then((results) => {
          _mysql
            .executeQuery({
              query:
                "SELECT * FROM hims_f_package_detail  where package_header_id\
                  in(select package_header_id   FROM hims_f_package_detail  where package_header_id=?\
                  group by package_header_id having sum(available_qty)=0);",
              values: [inputParam.hims_f_package_header_id],
              printQuery: true,
            })
            .then((pack_results) => {
              let strQuery = "";
              if (pack_results.length > 0) {
                strQuery = ", `closed`='Y', closed_type='D' ";
              }
              _mysql
                .executeQuery({
                  query:
                    "update hims_f_package_header set balance_amount= ?, actual_utilize_amount=?,utilize_amount=?" +
                    strQuery +
                    " where hims_f_package_header_id=? ",
                  values: [
                    inputParam.balance_amount,
                    inputParam.actual_utilize_amount,
                    inputParam.utilize_amount,
                    inputParam.hims_f_package_header_id,
                  ],
                  printQuery: true,
                })
                .then((update_header) => {
                  if (req.connection == null) {
                    // utilities.logger().log("connection : ");
                    req.connection = {
                      connection: _mysql.connection,
                      isTransactionConnection: _mysql.isTransactionConnection,
                      pool: _mysql.pool,
                    };
                  }

                  const _services = _.filter(
                    inputParam.package_details,
                    (f) => {
                      return (
                        f.service_type_id == 2 ||
                        f.service_type_id == 5 ||
                        f.service_type_id == 11
                      );
                    }
                  );

                  const _inv_services = _.filter(
                    inputParam.package_details,
                    (f) => {
                      return f.service_type_id == 4;
                    }
                  );
                  insertOrderServices({
                    services: _services,
                    _mysql: _mysql,
                    next: next,
                    inputParam: inputParam,
                    req: req,
                  })
                    .then((Order_Services) => {
                      if (_inv_services.length > 0) {
                        let IncludeValues = [
                          "patient_id",
                          "visit_id",
                          "doctor_id",
                          "service_type_id",
                          "services_id",
                          "trans_package_detail_id",
                          "quantity",
                          "inventory_item_id",
                          "inventory_location_id",
                          "inventory_uom_id",
                        ];

                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO hims_f_ordered_inventory(??) VALUES ?",
                            values: _inv_services,
                            includeValues: IncludeValues,
                            extraValues: {
                              unit_cost: 0,

                              gross_amount: 0,
                              discount_amout: 0,
                              discount_percentage: 0,
                              net_amout: 0,
                              copay_percentage: 0,
                              copay_amount: 0,
                              deductable_amount: 0,
                              deductable_percentage: 0,

                              patient_tax: 0,
                              company_tax: 0,
                              total_tax: 0,
                              patient_resp: 0,
                              patient_payable: 0,
                              comapany_resp: 0,
                              company_payble: 0,
                              sec_deductable_percentage: 0,
                              sec_deductable_amount: 0,
                              sec_company_res: 0,
                              sec_company_tax: 0,
                              sec_company_paybale: 0,
                              sec_copay_percntage: 0,
                              sec_copay_amount: 0,
                              created_by: req.userIdentity.algaeh_d_app_user_id,
                              created_date: new Date(),
                              updated_by: req.userIdentity.algaeh_d_app_user_id,
                              updated_date: new Date(),
                              hospital_id: req.userIdentity.hospital_id,
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: true,
                          })
                          .then((inv_order_detail) => {
                            req.records = inv_order_detail;
                            next();
                          })
                          .catch((error) => {
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      } else {
                        req.records = {};

                        next();
                      }
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
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by:Irfan
  getBillDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      console.log("getBillDetails");
      console.log("req.body", req.body);
      if (req.body.length > 0) {
        const input = req.body;
        const decimal_places = req.userIdentity.decimal_places;
        const outputArray = [];

        const promo_code = input[0].promo_code;
        const zeroBill = input.find((item) => {
          return item.zeroBill == true;
        });

        if (zeroBill == undefined) {
          const service_ids = input.map((val) => {
            return val.hims_d_services_id;
          });

          const is_insurance = input.filter((item) => {
            return item.insured == "Y";
          });

          let strQuery = "";

          // console.log("input.promo_code", req.body);
          if (is_insurance.length > 0) {
            const network_office_ids = is_insurance.map((item) => {
              return item.primary_network_office_id;
            });

            const insurance_provider_ids = is_insurance.map((item) => {
              return item.primary_insurance_provider_id;
            });

            const network_ids = is_insurance.map((item) => {
              return item.primary_network_id;
            });

            strQuery = `select hims_d_insurance_network_office_id,price_from ,copay_consultation,copay_percent,copay_percent_rad,copay_percent_trt,\
                 copay_percent_dental, copay_optical, copay_medicine, preapp_limit, deductible, deductible_lab,deductible_rad, \
               deductible_trt, deductible_medicine,deductable_type from hims_d_insurance_network_office where hospital_id=${req.userIdentity.hospital_id}\
               and hims_d_insurance_network_office_id in (${network_office_ids});\
               select SI.insurance_id ,SI.services_id,IP.company_service_price_type,copay_status,copay_amt,deductable_status,\
               deductable_amt,pre_approval,covered,net_amount,gross_amt, cpt_code, IP.insurance_type \
               from hims_d_services_insurance SI inner join hims_d_insurance_provider IP on\
               IP.hims_d_insurance_provider_id=SI.insurance_id where SI.hospital_id=${req.userIdentity.hospital_id}\
               and SI.insurance_id in (${insurance_provider_ids}) and\
               SI.services_id in (${service_ids})  and SI.record_status='A' and IP.record_status='A';\
               select SIN.network_id ,SIN.services_id,IP.insurance_provider_name, IP.company_service_price_type, NET.network_type,\
               copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
               net_amount,gross_amt from  hims_d_services_insurance_network SIN\
               inner join hims_d_insurance_network NET on NET.hims_d_insurance_network_id=SIN.network_id\
               inner join hims_d_insurance_provider IP on SIN.insurance_id=IP.hims_d_insurance_provider_id \
               where SIN.hospital_id=${req.userIdentity.hospital_id} and SIN.network_id in (${network_ids})\
               AND SIN.services_id in (${service_ids}) and SIN.record_status='A' and NET.record_status='A';`;

            console.log(
              "input[0].sub_department_id",
              input[0].sub_department_id
            );
            if (input[0].sub_department_id != null) {
              strQuery += `select department_type from hims_d_sub_department where hims_d_sub_department_id=${input[0].sub_department_id}`;
            } else {
              strQuery += `select 1=1`;
            }
          } else if (promo_code != null) {
            strQuery = `select S.hims_d_services_id, PD.avail_type, offer_value, valid_to_from, valid_to_date, offer_code from hims_d_promotion P 
            inner join hims_d_promotion_detail PD on P.hims_d_promo_id=PD.hims_d_promo_id
            inner join hims_d_services S on S.service_type_id=PD.service_type_id
            where S.hims_d_services_id in (${service_ids});`;
          }
          // req.userIdentity.hospital_id,
          // hospital_id=? and
          _mysql
            .executeQuery({
              query: `select hims_d_services_id, service_code, cpt_code, service_name, arabic_service_name, service_desc, \
            sub_department_id, service_type_id, procedure_type, standard_fee, followup_free_fee, followup_paid_fee, \
            discount, vat_applicable, vat_percent, service_status, physiotherapy_service, ST.service_type from hims_d_services S\
            inner join hims_d_service_type ST on S.service_type_id = ST.hims_d_service_type_id where hims_d_services_id in (?); ${strQuery} `,
              values: [service_ids],
              printQuery: true,
            })
            .then((result) => {
              _mysql.releaseConnection();

              const allServices = strQuery == "" ? result : result[0];
              const allPolicy = strQuery == "" ? [] : result[1];
              const allCompany_price = strQuery == "" ? [] : result[2];
              const allPolicy_price = strQuery == "" ? [] : result[3];
              const sub_dept_details = strQuery == "" ? [] : result[4];
              const promo_data = promo_code == null ? [] : result[1];
              let apr_amount_bulk = 0;
              // let total_approal_amount = 0;
              for (let i = 0; i < input.length; i++) {
                let servicesDetails = input[i];

                const records = allServices.find(
                  (f) =>
                    f.hims_d_services_id === servicesDetails.hims_d_services_id
                );

                //Promotions Functionlaity
                if (promo_data.length > 0) {
                  const promotion_dis = promo_data.find(
                    (f) =>
                      f.hims_d_services_id ===
                      servicesDetails.hims_d_services_id
                  );

                  if (promotion_dis !== undefined) {
                    if (
                      servicesDetails.promo_code === promotion_dis.offer_code
                    ) {
                      var from = Date.parse(promotion_dis.valid_to_from);
                      var to = Date.parse(promotion_dis.valid_to_date);
                      var today_date = Date.parse(
                        moment(new Date()).format("YYYY-MM-DD")
                      );

                      if (today_date <= to && today_date >= from) {
                        // console.log("2");
                        servicesDetails.discount_amout =
                          promotion_dis.avail_type === "A"
                            ? promotion_dis.offer_value
                            : 0;
                        servicesDetails.discount_percentage =
                          promotion_dis.avail_type === "P"
                            ? promotion_dis.offer_value
                            : 0;
                      } else {
                        _mysql.releaseConnection();
                        req.records = {
                          invalid_input: true,
                          message:
                            "Enterted Promo Code either not valid nor Expired",
                        };

                        next();
                        return;
                      }
                    } else {
                      _mysql.releaseConnection();
                      req.records = {
                        invalid_input: true,
                        message:
                          "Enterted Promo Code either not valid nor Expired",
                      };

                      next();
                      return;
                    }
                  }
                }

                let unit_cost =
                  servicesDetails.unit_cost == undefined
                    ? 0
                    : parseFloat(servicesDetails.unit_cost);

                let from_pos = servicesDetails.from_pos;

                // let zeroBill =
                //   servicesDetails.zeroBill == undefined
                //     ? false
                //     : servicesDetails.zeroBill;

                let FollowUp =
                  servicesDetails.FollowUp == undefined
                    ? false
                    : servicesDetails.FollowUp;
                let gross_amount = 0,
                  net_amout = 0,
                  gross_total = 0;

                let patient_resp = 0,
                  patient_payable = 0;

                let copay_percentage = 0,
                  copay_amount = 0,
                  sec_copay_percntage = 0,
                  sec_copay_amount = 0;

                let comapany_resp = 0,
                  company_payble = 0,
                  sec_company_res = 0,
                  sec_company_paybale = 0;

                let patient_tax = 0,
                  company_tax = 0,
                  sec_company_tax = 0,
                  total_tax = 0,
                  s_patient_tax = 0;

                let after_dect_amout = 0,
                  deductable_percentage = 0,
                  deductable_amount = 0;

                let sec_deductable_percentage = 0,
                  sec_deductable_amount = 0;
                // let conversion_factor =
                //   servicesDetails.conversion_factor == undefined
                //     ? 0
                //     : servicesDetails.conversion_factor;

                let quantity =
                  servicesDetails.quantity == undefined
                    ? 1
                    : parseFloat(servicesDetails.quantity);

                let discount_amout =
                  servicesDetails.discount_amout == undefined
                    ? 0
                    : parseFloat(servicesDetails.discount_amout);

                let discount_percentage =
                  servicesDetails.discount_percentage == undefined
                    ? 0
                    : parseFloat(servicesDetails.discount_percentage);

                let insured =
                  servicesDetails.insured == undefined
                    ? "N"
                    : servicesDetails.insured;

                console.log("servicesDetails.insured", servicesDetails.insured);
                console.log("insured", insured);

                // let sec_insured =
                //   servicesDetails.sec_insured == undefined
                //     ? "N"
                //     : servicesDetails.sec_insured;

                let bulkProcess =
                  servicesDetails.bulkProcess == undefined
                    ? "N"
                    : servicesDetails.bulkProcess;
                let approval_amt =
                  servicesDetails.approval_amt == undefined
                    ? 0
                    : servicesDetails.approval_amt;
                let approval_limit_yesno =
                  servicesDetails.approval_limit_yesno == undefined
                    ? "N"
                    : servicesDetails.approval_limit_yesno;

                let apprv_status =
                  servicesDetails.apprv_status == undefined
                    ? "NR"
                    : servicesDetails.apprv_status;

                let approved_amount =
                  servicesDetails.approved_amount == undefined
                    ? 0
                    : parseFloat(servicesDetails.approved_amount);

                let pre_approval =
                  servicesDetails.pre_approval == undefined
                    ? "N"
                    : servicesDetails.pre_approval;

                let vat_applicable = servicesDetails.vat_applicable;
                let preapp_limit_exceed = "N";
                let ser_net_amount = 0;
                let ser_gross_amt = 0;
                let icd_code = "";
                let covered = "Y";
                let billed =
                  servicesDetails.billed == undefined
                    ? "N"
                    : servicesDetails.billed;
                let preapp_limit_amount =
                  servicesDetails.preapp_limit_amount == undefined
                    ? 0
                    : servicesDetails.preapp_limit_amount;
                // insurance_price_list
                let policydtls = {};

                if (insured == "Y") {
                  let prices;
                  const cur_policy = allPolicy.find((p) => {
                    return (
                      p.hims_d_insurance_network_office_id ==
                      input[i]["primary_network_office_id"]
                    );
                  });

                  // console.log("allCompany_price", allCompany_price)
                  if (
                    cur_policy != undefined &&
                    cur_policy["price_from"] == "S"
                  ) {
                    prices = allCompany_price.find((item) => {
                      return (
                        item.insurance_id ==
                          input[i]["primary_insurance_provider_id"] &&
                        item.services_id == input[i]["hims_d_services_id"]
                      );
                    });
                  }
                  // console.log("prices", prices)

                  if (
                    cur_policy != undefined &&
                    cur_policy["price_from"] == "P"
                  ) {
                    prices = allPolicy_price.find((item) => {
                      return (
                        item.network_id == input[i]["primary_network_id"] &&
                        item.services_id == input[i]["hims_d_services_id"]
                      );
                    });
                  }

                  policydtls = { ...cur_policy, ...prices };
                }

                covered =
                  policydtls != null
                    ? policydtls.covered != null
                      ? policydtls.covered
                      : "N"
                    : "N";

                if (
                  covered == "N" ||
                  (pre_approval == "Y" && apprv_status == "RJ")
                ) {
                  insured = "N";
                }

                if (approval_limit_yesno == "Y") {
                  pre_approval = "Y";
                }

                if (pre_approval == "N") {
                  pre_approval =
                    policydtls !== null ? policydtls.pre_approval : "N";
                }

                icd_code =
                  policydtls.cpt_code !== null
                    ? policydtls.cpt_code
                    : records.cpt_code;

                console.log(
                  "policydtls.company_service_price_type",
                  policydtls.company_service_price_type
                );
                if (insured == "Y" && policydtls.covered == "Y") {
                  if (FollowUp === true) {
                    ser_net_amount = 0;
                    ser_gross_amt = 0;
                    unit_cost = 0;
                  } else {
                    // console.log("insurance_provider_ids", policydtls)
                    ser_net_amount = policydtls.net_amount;
                    ser_gross_amt = policydtls.gross_amt;
                    if (policydtls.company_service_price_type == "N") {
                      unit_cost = parseFloat(policydtls.net_amount);
                    } else {
                      unit_cost = parseFloat(policydtls.gross_amt);
                    }
                  }

                  gross_total = policydtls.gross_amt;
                  console.log("unit_cost", unit_cost);
                  // if (conversion_factor != 0) {
                  //   unit_cost = unit_cost * conversion_factor;
                  // }
                  gross_amount = quantity * unit_cost;
                  gross_amount = utilities.decimalPoints(
                    gross_amount,
                    decimal_places
                  );
                  if (discount_amout > 0) {
                    discount_percentage = (discount_amout / gross_amount) * 100;
                  } else if (discount_percentage > 0) {
                    discount_amout = (gross_amount * discount_percentage) / 100;
                    discount_amout = utilities.decimalPoints(
                      discount_amout,
                      decimal_places
                    );
                  }
                  net_amout =
                    parseFloat(gross_amount) - parseFloat(discount_amout);
                  net_amout = utilities.decimalPoints(
                    net_amout,
                    decimal_places
                  );
                  // console.log("copay_status", policydtls.copay_status);
                  //Patient And Company
                  if (policydtls.copay_status == "Y") {
                    copay_amount = policydtls.copay_amt;
                    copay_percentage =
                      (parseFloat(copay_amount) / parseFloat(net_amout)) * 100;
                  } else {
                    if (
                      appsettings.hims_d_service_type.service_type_id
                        .Consultation == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_consultation;

                      if (sub_dept_details[0].department_type == "D") {
                        copay_percentage = policydtls.copay_percent_dental;
                      }
                      if (sub_dept_details[0].department_type == "O") {
                        copay_percentage = policydtls.copay_optical;
                      }

                      deductable_percentage = policydtls.deductible;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Procedure == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent_trt;
                      deductable_percentage = policydtls.deductible_trt;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Provider == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .InventoryItem == records.service_type_id
                    ) {
                      //Not there
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Lab ==
                      records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent;
                      deductable_percentage = policydtls.deductible_lab;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .NursingCare == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Miscellaneous == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Anesthesia == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Bed ==
                      records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.OT ==
                      records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Radiology == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_percent_rad;
                      deductable_percentage = policydtls.deductible_rad;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .Pharmacy == records.service_type_id
                    ) {
                      copay_percentage = policydtls.copay_medicine;
                      deductable_percentage = policydtls.deductible_medicine;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id
                        .NonService == records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    } else if (
                      appsettings.hims_d_service_type.service_type_id.Package ==
                      records.service_type_id
                    ) {
                      //Not There
                      copay_percentage = policydtls.copay_percent;
                    }

                    console.log("deductable_percentage", deductable_percentage);
                    console.log("deductable_type", policydtls.deductable_type);
                    if (policydtls.deductable_type) {
                      if (policydtls.deductable_type === "AMOUNT") {
                        deductable_amount =
                          deductable_percentage !== null
                            ? parseFloat(deductable_percentage)
                            : 0;
                      } else {
                        deductable_amount =
                          deductable_percentage !== null
                            ? (parseFloat(gross_total) *
                                parseFloat(deductable_percentage)) /
                              100
                            : 0;
                      }
                    } else {
                      deductable_amount =
                        deductable_percentage !== null
                          ? (parseFloat(net_amout) *
                              parseFloat(deductable_percentage)) /
                            100
                          : 0;
                    }

                    deductable_amount = utilities.decimalPoints(
                      deductable_amount,
                      decimal_places
                    );

                    console.log("deductable_amount", deductable_amount);

                    after_dect_amout =
                      parseFloat(net_amout) - parseFloat(deductable_amount);

                    console.log("after_dect_amout", after_dect_amout);
                    console.log("copay_percentage", copay_percentage);
                    copay_amount =
                      (parseFloat(after_dect_amout) *
                        parseFloat(copay_percentage)) /
                      100;
                    copay_amount = utilities.decimalPoints(
                      copay_amount,
                      decimal_places
                    );

                    console.log("copay_amount", copay_amount);
                  }
                  console.log("net_amout", net_amout);
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", typeof patient_resp);
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", typeof copay_amount);
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", typeof deductable_amount);

                  // console.log("patient_resp", patient_resp);
                  // console.log("copay_amount", copay_amount);
                  // console.log("deductable_amount", deductable_amount);
                  patient_resp =
                    parseFloat(copay_amount) + parseFloat(deductable_amount);

                  comapany_resp =
                    parseFloat(net_amout) - parseFloat(patient_resp);
                  comapany_resp = utilities.decimalPoints(
                    comapany_resp,
                    decimal_places
                  );

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax =
                      (parseFloat(patient_resp) *
                        parseFloat(records.vat_percent)) /
                      100;

                    patient_tax = utilities.decimalPoints(
                      patient_tax,
                      decimal_places
                    );
                  }

                  if (records.vat_applicable == "Y") {
                    s_patient_tax =
                      (parseFloat(patient_resp) *
                        parseFloat(records.vat_percent)) /
                      100;

                    s_patient_tax = utilities.decimalPoints(
                      patient_tax,
                      decimal_places
                    );
                  }

                  if (records.vat_applicable == "Y") {
                    company_tax =
                      (parseFloat(comapany_resp) *
                        parseFloat(records.vat_percent)) /
                      100;
                    company_tax = utilities.decimalPoints(
                      company_tax,
                      decimal_places
                    );
                  }
                  total_tax = parseFloat(patient_tax) + parseFloat(company_tax);
                  // total_tax = total_tax.toFixed(decimal_places);
                  patient_payable =
                    parseFloat(patient_resp) + parseFloat(patient_tax);
                  // patient_payable = patient_payable.toFixed(decimal_places);

                  if (approved_amount !== 0 && approved_amount < unit_cost) {
                    let diff_val =
                      parseFloat(approved_amount) - parseFloat(comapany_resp);
                    patient_payable =
                      parseFloat(patient_payable) + parseFloat(diff_val);
                    patient_resp =
                      parseFloat(patient_resp) + parseFloat(diff_val);
                    comapany_resp =
                      parseFloat(comapany_resp) - parseFloat(diff_val);

                    patient_payable = utilities.decimalPoints(
                      patient_payable,
                      decimal_places
                    );
                    patient_resp = utilities.decimalPoints(
                      patient_resp,
                      decimal_places
                    );
                    comapany_resp = utilities.decimalPoints(
                      comapany_resp,
                      decimal_places
                    );
                  }

                  company_payble =
                    parseFloat(net_amout) - parseFloat(patient_resp);

                  company_payble =
                    parseFloat(company_payble) + parseFloat(company_tax);

                  company_payble = utilities.decimalPoints(
                    company_payble,
                    decimal_places
                  );

                  preapp_limit_amount = parseFloat(policydtls.preapp_limit);

                  if (policydtls.preapp_limit !== 0) {
                    if (bulkProcess == "Y") {
                      apr_amount_bulk =
                        parseFloat(apr_amount_bulk) +
                        parseFloat(company_payble);

                      approval_amt =
                        parseFloat(approval_amt) + parseFloat(apr_amount_bulk);
                    } else {
                      approval_amt =
                        parseFloat(approval_amt) + parseFloat(company_payble);
                    }
                    if (
                      preapp_limit_amount > 0 &&
                      approval_amt > preapp_limit_amount
                    ) {
                      preapp_limit_exceed = "Y";
                    }
                  }

                  //If primary and secondary exists
                } else {
                  if (FollowUp === true) {
                    unit_cost =
                      unit_cost != 0
                        ? parseFloat(unit_cost)
                        : parseFloat(records.followup_free_fee);
                  } else {
                    if (
                      is_insurance.length > 0 &&
                      policydtls.insurance_type === "C"
                    ) {
                      if (policydtls.company_service_price_type == "N") {
                        unit_cost = parseFloat(policydtls.net_amount);
                      } else {
                        unit_cost =
                          unit_cost != 0
                            ? unit_cost
                            : parseFloat(policydtls.gross_amt);
                      }
                    } else {
                      unit_cost =
                        from_pos == "Y"
                          ? parseFloat(unit_cost)
                          : unit_cost != 0
                          ? parseFloat(unit_cost)
                          : parseFloat(records.standard_fee);
                    }
                  }
                  // if (FollowUp === true) {
                  //   unit_cost =
                  //     unit_cost != 0
                  //       ? parseFloat(unit_cost)
                  //       : parseFloat(records.followup_free_fee);
                  // } else {
                  //   unit_cost =
                  //     from_pos == "Y"
                  //       ? parseFloat(unit_cost)
                  //       : unit_cost != 0
                  //         ? parseFloat(unit_cost)
                  //         : parseFloat(records.standard_fee);
                  // }

                  // if (conversion_factor != 0) {
                  //   unit_cost = unit_cost * conversion_factor;
                  // }
                  gross_amount = quantity * parseFloat(unit_cost);

                  gross_amount = utilities.decimalPoints(
                    gross_amount,
                    decimal_places
                  );

                  if (discount_amout > 0) {
                    discount_percentage =
                      (parseFloat(discount_amout) / parseFloat(gross_amount)) *
                      100;
                  } else if (discount_percentage > 0) {
                    discount_amout =
                      (parseFloat(gross_amount) *
                        parseFloat(discount_percentage)) /
                      100;
                    discount_amout = utilities.decimalPoints(
                      discount_amout,
                      decimal_places
                    );
                  }
                  net_amout =
                    parseFloat(gross_amount) - parseFloat(discount_amout);
                  patient_resp = parseFloat(net_amout);

                  if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                    patient_tax =
                      (parseFloat(patient_resp) *
                        parseFloat(records.vat_percent)) /
                      100;

                    patient_tax = utilities.decimalPoints(
                      patient_tax,
                      decimal_places
                    );
                    total_tax = parseFloat(patient_tax);
                  }

                  if (records.vat_applicable === "Y") {
                    s_patient_tax =
                      (parseFloat(patient_resp) *
                        parseFloat(records.vat_percent)) /
                      100;

                    s_patient_tax = utilities.decimalPoints(
                      s_patient_tax,
                      decimal_places
                    );
                  }

                  patient_payable =
                    parseFloat(patient_resp) + parseFloat(patient_tax);
                }

                let out = extend(
                  {
                    hims_f_billing_details_id: null,
                    hims_f_billing_header_id: null,
                    service_type_id: null,
                    services_id: null,
                    quantity: 0,
                    unit_cost: 0,
                    insurance_yesno: null,
                    gross_amount: 0,
                    discount_amout: 0,
                    discount_percentage: 0,
                    net_amout: 0,
                    copay_percentage: 0,
                    copay_amount: 0,
                    deductable_amount: 0,
                    deductable_percentage: 0,
                    tax_inclusive: "N",
                    patient_tax: 0,
                    s_patient_tax: 0,
                    company_tax: 0,
                    total_tax: 0,
                    patient_resp: 0,
                    patient_payable: 0,
                    comapany_resp: 0,
                    company_payble: 0,
                    sec_deductable_percentage: 0,
                    sec_deductable_amount: 0,
                    sec_company_res: 0,
                    sec_company_tax: 0,
                    sec_company_paybale: 0,
                    sec_copay_percntage: 0,
                    sec_copay_amount: 0,
                    test_id: null,
                    created_date: new Date(),
                  },
                  {
                    hims_f_billing_details_id:
                      servicesDetails.hims_f_billing_details_id,
                    hims_f_billing_header_id:
                      servicesDetails.hims_f_billing_header_id,
                    deductable_type: policydtls.deductable_type,
                    service_type_id: records.service_type_id,
                    service_name: records.service_name,
                    service_type: records.service_type,
                    insurance_service_name: records.service_name,
                    services_id: records.hims_d_services_id,
                    physiotherapy_service: records.physiotherapy_service,
                    quantity: quantity,
                    unit_cost: unit_cost,
                    gross_amount: gross_amount,
                    discount_amout: discount_amout,
                    discount_percentage: discount_percentage,
                    net_amout: net_amout,
                    patient_resp: patient_resp,
                    patient_payable: patient_payable,
                    copay_percentage: copay_percentage,
                    copay_amount: copay_amount,

                    comapany_resp: comapany_resp,
                    company_payble: company_payble,
                    patient_tax: patient_tax,
                    s_patient_tax: s_patient_tax,
                    company_tax: company_tax,
                    sec_company_tax: sec_company_tax,
                    total_tax: total_tax,

                    sec_copay_percntage: sec_copay_percntage,
                    sec_copay_amount: sec_copay_amount,
                    sec_company_res: sec_company_res,
                    sec_company_paybale: sec_company_paybale,
                    pre_approval: insured == "Y" ? pre_approval : "N",
                    insurance_yesno: insured,
                    preapp_limit_exceed: preapp_limit_exceed,
                    approval_amt: approval_amt,
                    preapp_limit_amount: preapp_limit_amount,
                    approval_limit_yesno: approval_limit_yesno,
                    ser_net_amount: ser_net_amount,
                    ser_gross_amt: ser_gross_amt,
                    icd_code: icd_code,

                    sec_deductable_percentage: sec_deductable_percentage,
                    sec_deductable_amount: sec_deductable_amount,
                    deductable_percentage: deductable_percentage,
                    deductable_amount: deductable_amount,
                    item_id: servicesDetails.item_id,
                    expiry_date: servicesDetails.expirydt,
                    batchno: servicesDetails.batchno,
                    qtyhand: servicesDetails.qtyhand,
                    grnno: servicesDetails.grnno,
                    uom_id: servicesDetails.sales_uom,
                    item_category: servicesDetails.item_category_id,
                    item_group_id: servicesDetails.item_group_id,
                    package_id: servicesDetails.package_id,
                    package_visit_type: servicesDetails.package_visit_type,
                    package_type: servicesDetails.package_type,
                    actual_amount: servicesDetails.actual_amount,
                    pack_expiry_date: servicesDetails.expiry_date,
                    hims_f_ordered_services_id:
                      servicesDetails.hims_f_ordered_services_id,
                    ordered_package_id: servicesDetails.ordered_package_id,
                    billed: billed,
                    test_id: servicesDetails.test_id,
                    test_type: "R",
                    created_date: new Date(),
                  }
                );

                outputArray.push(out);

                if (i == input.length - 1) {
                  let total_approal_amount = _.maxBy(outputArray, (f) => {
                    return f.approval_amt;
                  });
                  // console.log("total_approal_amount: ", total_approal_amount)
                  req.records = {
                    billdetails: outputArray,
                    approval_amt: total_approal_amount.approval_amt,
                  };
                  next();
                }
              }
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          let out = [
            {
              hims_f_billing_details_id: null,
              hims_f_billing_header_id: null,
              service_type_id: zeroBill.service_type_id,
              service_name: "service_name",
              services_id: zeroBill.hims_d_services_id,
              quantity: 1,
              unit_cost: 0,
              insurance_yesno: null,
              gross_amount: 0,
              discount_amout: 0,
              discount_percentage: 0,
              net_amout: 0,
              copay_percentage: 0,
              copay_amount: 0,
              deductable_amount: 0,
              deductable_percentage: 0,
              tax_inclusive: "N",
              patient_tax: 0,
              company_tax: 0,
              total_tax: 0,
              patient_resp: 0,
              patient_payable: 0,
              comapany_resp: 0,
              company_payble: 0,

              sec_deductable_percentage: 0,
              sec_deductable_amount: 0,
              sec_company_res: 0,
              sec_company_tax: 0,
              sec_company_paybale: 0,
              sec_copay_percntage: 0,
              sec_copay_amount: 0,
            },
          ];

          req.records = { billdetails: out };
          next();
          return;
        }
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid Input",
        };

        next();
        return;
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(error);
    }
  },
  getEmployeeAndDepartments: (req, res, next) => {
    const _mysql = new algaehMysql();
    return new Promise((resolve, reject) => {
      try {
        let strQuery = "";
        if (req.query.services_id != null) {
          strQuery += "and services_id = '" + req.query.services_id + "'";
        }
        if (req.query.employee_id != null) {
          strQuery += "and employee_id = '" + req.query.employee_id + "'";
        }
        _mysql
          .executeQuery({
            query:
              "SELECT E.hims_d_employee_id as employee_id, E.sub_department_id, E.services_id,SD.department_id,SD.department_type from hims_d_employee E  left join \
              hims_d_sub_department SD on E.sub_department_id= SD.hims_d_sub_department_id  \
              Where E.record_status='A' " +
              strQuery,
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
            resolve(result);
          })
          .catch((e) => {
            next(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  closePackage: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "update hims_f_package_header set closed='Y', closed_type='C', closed_remarks=? where hims_f_package_header_id=? ",
          values: [req.body.closed_remarks, req.body.hims_f_package_header_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      reject(e);
      next(e);
    }
  },

  //created by:IRFAN
  addtoDayEnd_backup_8_feb_2020: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;

      const _mysql = new algaehMysql(_options);
      // const utilities = new algaehUtilities();

      _mysql
        .executeQuery({
          query:
            "select product_type from  hims_d_organization where hims_d_organization_id=1\
          and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
          printQuery: true,
        })
        .then((product_type) => {
          if (product_type.length == 1) {
            const inputParam = req.body;
            const servicesIds = ["0"];
            if (inputParam.billdetails && inputParam.billdetails.length > 0) {
              inputParam.billdetails.forEach((item) => {
                servicesIds.push(item.services_id);
              });
            }

            _mysql
              .executeQuery({
                query:
                  "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
            account in ('OP_DEP','CIH_OP','OUTPUT_TAX','OP_REC','CARD_SETTL');\
            SELECT hims_d_services_id,service_name,head_id,child_id,\
            insurance_head_id,insurance_child_id FROM hims_d_services where hims_d_services_id in(?);",
                values: [servicesIds],
                printQuery: true,
              })
              .then((Result) => {
                const controls = Result[0];
                const serviceData = Result[1];

                const OP_DEP = controls.find((f) => {
                  return f.account == "OP_DEP";
                });

                const CIH_OP = controls.find((f) => {
                  return f.account == "CIH_OP";
                });
                const OUTPUT_TAX = controls.find((f) => {
                  return f.account == "OUTPUT_TAX";
                });
                const OP_REC = controls.find((f) => {
                  return f.account == "OP_REC";
                });
                const CARD_SETTL = controls.find((f) => {
                  return f.account == "CARD_SETTL";
                });

                let voucher_type = "";
                let narration = "";
                let amount = 0;

                const EntriesArray = [];
                if (inputParam.transaction_type == "AD") {
                  voucher_type = "receipt";

                  narration =
                    " Collected Advance From Patient:" +
                    inputParam.patient_code;

                  amount = inputParam.total_amount;

                  EntriesArray.push({
                    payment_date: new Date(),
                    head_id: OP_DEP.head_id,
                    child_id: OP_DEP.child_id,
                    debit_amount: 0,
                    payment_type: "CR",
                    credit_amount: inputParam.total_amount,
                    hospital_id: req.userIdentity.hospital_id,
                  });

                  inputParam.receiptdetails.forEach((m) => {
                    if (m.pay_type == "CD") {
                      narration = narration + ",Received By CARD:" + m.amount;

                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: CARD_SETTL.head_id,
                        child_id: CARD_SETTL.child_id,
                        debit_amount: m.amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    } else {
                      narration = narration + ",Received By CASH:" + m.amount;
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: CIH_OP.head_id,
                        child_id: CIH_OP.child_id,
                        debit_amount: m.amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }
                  });
                } else if (inputParam.transaction_type == "RF") {
                  voucher_type = "payment";

                  narration = " Refund to Patient:" + inputParam.patient_code;
                  amount = inputParam.total_amount;

                  // DECREASE PATIENT PAYABLE

                  EntriesArray.push({
                    payment_date: new Date(),
                    head_id: OP_DEP.head_id,
                    child_id: OP_DEP.child_id,
                    debit_amount: inputParam.total_amount,
                    payment_type: "DR",
                    credit_amount: 0,
                    hospital_id: req.userIdentity.hospital_id,
                  });

                  // DECREASE CASH IN HAND
                  EntriesArray.push({
                    payment_date: new Date(),
                    head_id: CIH_OP.head_id,
                    child_id: CIH_OP.child_id,
                    debit_amount: 0,
                    payment_type: "CR",
                    credit_amount: amount,
                    hospital_id: req.userIdentity.hospital_id,
                  });
                } else {
                  voucher_type = "sales";

                  amount = inputParam.receiveable_amount;
                  narration = "Patient:" + inputParam.patient_code;

                  //BOOKING INCOME AND TAX
                  serviceData.forEach((curService) => {
                    narration =
                      narration +
                      ", Booking Income for " +
                      curService.service_name;

                    const bill = inputParam.billdetails.find((f) => {
                      if (f.services_id == curService.hims_d_services_id)
                        return f;
                    });

                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: curService.head_id,
                      child_id: curService.child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: bill.patient_resp,
                      hospital_id: req.userIdentity.hospital_id,
                    });

                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: OUTPUT_TAX.head_id,
                      child_id: OUTPUT_TAX.child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: bill.patient_tax,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  });

                  //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
                  if (inputParam.advance_adjust > 0) {
                    narration =
                      narration +
                      ", Adjusting Advance  Amount of " +
                      inputParam.advance_adjust;
                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: OP_DEP.head_id,
                      child_id: OP_DEP.child_id,
                      debit_amount: inputParam.advance_adjust,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }
                  //PROVING OP SERVICE ON CREDIT
                  if (inputParam.credit_amount > 0) {
                    narration =
                      narration +
                      ", Providng OP Service On Credit for Amount " +
                      inputParam.credit_amount;

                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: OP_REC.head_id,
                      child_id: OP_REC.child_id,
                      debit_amount: inputParam.credit_amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }

                  //INCREASING CASH IN CAND AND BANK
                  inputParam.receiptdetails.forEach((m) => {
                    if (m.pay_type == "CD") {
                      narration = narration + ",Received By CARD:" + m.amount;

                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: CARD_SETTL.head_id,
                        child_id: CARD_SETTL.child_id,
                        debit_amount: m.amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    } else {
                      narration = narration + ",Received By CASH:" + m.amount;
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: CIH_OP.head_id,
                        child_id: CIH_OP.child_id,
                        debit_amount: m.amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }
                  });
                }

                _mysql
                  .executeQueryWithTransaction({
                    query:
                      "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                  document_number,from_screen,narration,entered_by,entered_date) \
                  VALUES (?,?,?,?,?,?,?,?,?)",
                    values: [
                      new Date(),
                      amount,
                      voucher_type,
                      inputParam.receipt_header_id,
                      inputParam.receipt_number,
                      inputParam.ScreenCode,
                      narration,
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                    ],
                    printQuery: true,
                  })
                  .then((headerDayEnd) => {
                    const month = moment().format("M");
                    const year = moment().format("YYYY");
                    const IncludeValuess = [
                      "payment_date",
                      "head_id",
                      "child_id",
                      "debit_amount",
                      "payment_type",
                      "credit_amount",
                      "hospital_id",
                    ];

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                        values: EntriesArray,
                        includeValues: IncludeValuess,
                        bulkInsertOrUpdate: true,
                        extraValues: {
                          year: year,
                          month: month,
                          day_end_header_id: headerDayEnd.insertId,
                        },
                        printQuery: true,
                      })
                      .then((subResult) => {
                        // console.log("FOUR");
                        next();
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            next();
          }
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  getBillsForVisit: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select hims_f_billing_header_id, bill_number, bill_date, sub_total_amount from hims_f_billing_header where visit_id =? `,
          values: [req.query.visit_id],
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by:IRFAN
  generateAccountingEntry: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;

      const _mysql = new algaehMysql(_options);
      // const utilities = new algaehUtilities();
      const inputParam = req.body;
      const { closeConnection } = inputParam;
      if (req.body.consultation == "N") {
        next();
        return;
      }

      _mysql
        .executeQuery({
          query:
            "select product_type from  hims_d_organization where hims_d_organization_id=1\
          and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
          printQuery: true,
        })
        .then((product_type) => {
          if (product_type.length == 1) {
            const servicesIds = ["0"];
            if (inputParam.billdetails && inputParam.billdetails.length > 0) {
              inputParam.billdetails.forEach((item) => {
                servicesIds.push(item.services_id);
              });
            }

            console.log("inputParam.receiptdetails", inputParam.receiptdetails);
            let bank_card_id = inputParam.receiptdetails.find(
              (f) => f.pay_type == "CD"
            );

            console.log("bank_card_id === ", bank_card_id);
            let strQuery = "select 1=1";
            if (bank_card_id !== undefined) {
              strQuery =
                "select * from hims_d_bank_card where hims_d_bank_card_id=" +
                bank_card_id.bank_card_id;
            }

            // let strqry = "";

            // let sub_insurance_id;
            // if (inputParam.primary_sub_id > 0) {
            //   sub_insurance_id = inputParam.primary_sub_id;
            // } else if (inputParam.sub_insurance_provider_id > 0) {
            //   sub_insurance_id = inputParam.sub_insurance_provider_id;
            // }

            // if (inputParam.insured == "Y" && sub_insurance_id > 0) {
            //   strqry = ` select insurance_sub_name, head_id, child_id from hims_d_insurance_sub
            //    where hims_d_insurance_sub_id=${sub_insurance_id} limit 1;`;
            // }

            _mysql
              .executeQuery({
                query:
                  "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
            account in ('OP_DEP','CIH_OP','OUTPUT_TAX','OP_REC','CARD_SETTL', 'OP_CTRL', 'INPUT_TAX', 'SALES_DISCOUNT');\
            SELECT hims_d_services_id,service_name,head_id,child_id FROM hims_d_services where hims_d_services_id in(?);\
            select cost_center_type, cost_center_required from finance_options limit 1;" +
                  strQuery,
                values: [servicesIds],
                printQuery: true,
              })
              .then((Result) => {
                const controls = Result[0];
                const serviceData = Result[1];
                const card_data = Result[3];
                // const insurance_data = Result[3];

                const OP_DEP = controls.find((f) => {
                  return f.account == "OP_DEP";
                });

                const CIH_OP = controls.find((f) => {
                  return f.account == "CIH_OP";
                });
                const OUTPUT_TAX = controls.find((f) => {
                  return f.account == "OUTPUT_TAX";
                });
                const OP_REC = controls.find((f) => {
                  return f.account == "OP_REC";
                });
                const CARD_SETTL = controls.find((f) => {
                  return f.account == "CARD_SETTL";
                });
                const OP_CTRL = controls.find((f) => {
                  return f.account == "OP_CTRL";
                });

                const INPUT_TAX = controls.find((f) => {
                  return f.account == "INPUT_TAX";
                });

                const SALES_DISCOUNT = controls.find((f) => {
                  return f.account == "SALES_DISCOUNT";
                });

                let voucher_type = "";
                let narration = "";
                let amount = 0;

                const EntriesArray = [];
                if (inputParam.transaction_type == "AD") {
                  voucher_type = "receipt";

                  narration =
                    " Collected Advance From Patient:" +
                    inputParam.patient_code;

                  amount = inputParam.total_amount;

                  EntriesArray.push({
                    payment_date: new Date(),
                    head_id: OP_DEP.head_id,
                    child_id: OP_DEP.child_id,
                    debit_amount: 0,
                    payment_type: "CR",
                    credit_amount: inputParam.total_amount,
                    hospital_id: req.userIdentity.hospital_id,
                  });

                  inputParam.receiptdetails.forEach((m) => {
                    if (m.pay_type == "CD") {
                      narration = narration + ",Received By CARD:" + m.amount;

                      let service_charge =
                        (parseFloat(m.amount) *
                          parseFloat(card_data[0].service_charge)) /
                        100;
                      let vat_charge =
                        (parseFloat(service_charge) *
                          parseFloat(card_data[0].vat_percentage)) /
                        100;

                      const final_amount =
                        parseFloat(m.amount) -
                        parseFloat(service_charge) -
                        parseFloat(vat_charge);
                      if (final_amount > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: CARD_SETTL.head_id,
                          child_id: CARD_SETTL.child_id,
                          debit_amount: final_amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                      if (service_charge > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: card_data[0].head_id,
                          child_id: card_data[0].child_id,
                          debit_amount: service_charge,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                      if (vat_charge > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: INPUT_TAX.head_id,
                          child_id: INPUT_TAX.child_id,
                          debit_amount: vat_charge,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                    } else {
                      narration = narration + ",Received By CASH:" + m.amount;

                      if (parseFloat(m.amount) > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: CIH_OP.head_id,
                          child_id: CIH_OP.child_id,
                          debit_amount: m.amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                    }
                  });
                } else if (inputParam.transaction_type == "RF") {
                  voucher_type = "payment";

                  narration = " Refund to Patient:" + inputParam.patient_code;
                  amount = inputParam.total_amount;

                  // DECREASE PATIENT PAYABLE

                  if (inputParam.total_amount > 0) {
                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: OP_DEP.head_id,
                      child_id: OP_DEP.child_id,
                      debit_amount: inputParam.total_amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }

                  // DECREASE CASH IN HAND
                  if (parseFloat(amount) > 0) {
                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: CIH_OP.head_id,
                      child_id: CIH_OP.child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: amount,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }
                } else {
                  voucher_type = "sales";

                  amount = inputParam.receiveable_amount;
                  narration = "Patient:" + inputParam.patient_code;

                  //BOOKING INCOME AND TAX
                  serviceData.forEach((curService) => {
                    narration =
                      narration +
                      ", Booking Income for " +
                      curService.service_name;

                    const bill = inputParam.billdetails.filter((f) => {
                      if (f.services_id == curService.hims_d_services_id)
                        return f;
                    });

                    const credit_amount = _.sumBy(bill, (s) =>
                      parseFloat(s.net_amout)
                    );

                    if (credit_amount > 0) {
                      EntriesArray.push({
                        payment_date: inputParam.bill_date,
                        head_id: curService.head_id,
                        child_id: curService.child_id,
                        debit_amount: 0,
                        payment_type: "CR",
                        credit_amount: credit_amount,
                        hospital_id: req.userIdentity.hospital_id,
                      });
                    }

                    // if (parseFloat(bill.patient_tax) > 0) {
                    //   EntriesArray.push({
                    //     payment_date: new Date(),
                    //     head_id: OUTPUT_TAX.head_id,
                    //     child_id: OUTPUT_TAX.child_id,
                    //     debit_amount: 0,
                    //     payment_type: "CR",
                    //     credit_amount: bill.patient_tax,
                    //     hospital_id: req.userIdentity.hospital_id,
                    //   });
                    // }
                  });

                  //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
                  if (inputParam.advance_adjust > 0) {
                    narration =
                      narration +
                      ", Adjusting Advance  Amount of " +
                      inputParam.advance_adjust;
                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: OP_DEP.head_id,
                      child_id: OP_DEP.child_id,
                      debit_amount: inputParam.advance_adjust,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }

                  if (inputParam.pack_advance_adjust > 0) {
                    // narration =
                    //   narration +
                    //   ", Adjusting Advance  Amount of " +
                    //   inputParam.pack_advance_amount;
                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: OP_DEP.head_id,
                      child_id: OP_DEP.child_id,
                      debit_amount: inputParam.pack_advance_adjust,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }
                  //PROVIDING OP SERVICE ON CREDIT
                  if (inputParam.credit_amount > 0) {
                    narration =
                      narration +
                      ", Provided OP Service On Credit of Amount " +
                      inputParam.credit_amount;

                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: OP_REC.head_id,
                      child_id: OP_REC.child_id,
                      debit_amount: inputParam.credit_amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }

                  //INCREASING CASH IN CAND AND BANK
                  inputParam.receiptdetails.forEach((m) => {
                    if (m.pay_type == "CD") {
                      narration = narration + ",Received By CARD:" + m.amount;

                      let service_charge =
                        (parseFloat(m.amount) *
                          parseFloat(card_data[0].service_charge)) /
                        100;
                      let vat_charge =
                        (parseFloat(service_charge) *
                          parseFloat(card_data[0].vat_percentage)) /
                        100;

                      // console.log("service_charge", service_charge)
                      // console.log("vat_charge", vat_charge)
                      const final_amount =
                        parseFloat(m.amount) -
                        parseFloat(service_charge) -
                        parseFloat(vat_charge);
                      if (final_amount > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: CARD_SETTL.head_id,
                          child_id: CARD_SETTL.child_id,
                          debit_amount: final_amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                      if (service_charge > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: card_data[0].head_id,
                          child_id: card_data[0].child_id,
                          debit_amount: service_charge,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                      if (vat_charge > 0) {
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: INPUT_TAX.head_id,
                          child_id: INPUT_TAX.child_id,
                          debit_amount: vat_charge,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                      // EntriesArray.push({
                      //   payment_date: new Date(),
                      //   head_id: CARD_SETTL.head_id,
                      //   child_id: CARD_SETTL.child_id,
                      //   debit_amount: m.amount,
                      //   payment_type: "DR",
                      //   credit_amount: 0,
                      //   hospital_id: req.userIdentity.hospital_id,
                      // });
                    } else {
                      if (parseFloat(m.amount) > 0) {
                        narration = narration + ",Received By CASH:" + m.amount;
                        EntriesArray.push({
                          payment_date: inputParam.bill_date,
                          head_id: CIH_OP.head_id,
                          child_id: CIH_OP.child_id,
                          debit_amount: m.amount,
                          payment_type: "DR",
                          credit_amount: 0,
                          hospital_id: req.userIdentity.hospital_id,
                        });
                      }
                    }
                  });

                  //insurance company payable
                  if (
                    inputParam.insured == "Y" &&
                    parseFloat(inputParam.company_payble) > 0
                  ) {
                    // narration =
                    //   narration +
                    //   `, insurance (${insurance_data[0]["insurance_sub_name"]}) receivable: ${inputParam.company_payble}`;

                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: OP_CTRL.head_id,
                      child_id: OP_CTRL.child_id,
                      debit_amount: inputParam.company_payble,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }

                  //TAX part

                  if (parseFloat(inputParam.total_tax) > 0) {
                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: OUTPUT_TAX.head_id,
                      child_id: OUTPUT_TAX.child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: inputParam.total_tax,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }
                  if (inputParam.sheet_discount_amount > 0) {
                    EntriesArray.push({
                      payment_date: inputParam.bill_date,
                      head_id: SALES_DISCOUNT.head_id,
                      child_id: SALES_DISCOUNT.child_id,
                      debit_amount: inputParam.sheet_discount_amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
                    });
                  }
                }

                if (EntriesArray.length > 0) {
                  let strQuery = "";

                  if (
                    Result[2][0].cost_center_required === "Y" &&
                    Result[2][0].cost_center_type === "P"
                  ) {
                    strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
                    inner join hims_d_project P on D.project_id=P.hims_d_project_id \
                    inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
                    division_id= ${req.userIdentity.hospital_id} limit 1;`;
                  }
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                  document_number,from_screen,narration,entered_by,entered_date) \
                  VALUES (?,?,?,?,?,?,?,?,?);" +
                        strQuery,
                      values: [
                        new Date(inputParam.bill_date),
                        amount,
                        voucher_type,
                        inputParam.hims_f_billing_header_id,
                        inputParam.bill_number,
                        inputParam.ScreenCode,
                        narration,
                        closeConnection
                          ? inputParam.created_by
                          : req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                      ],
                      printQuery: true,
                    })
                    .then((header_result) => {
                      let project_id = null;

                      let headerDayEnd = [];
                      if (header_result.length > 1) {
                        headerDayEnd = header_result[0];
                        project_id = header_result[1][0].project_id;
                      } else {
                        headerDayEnd = header_result;
                      }

                      const month = moment().format("M");
                      const year = moment().format("YYYY");
                      const IncludeValuess = [
                        "payment_date",
                        "head_id",
                        "child_id",
                        "debit_amount",
                        "payment_type",
                        "credit_amount",
                        "hospital_id",
                      ];

                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                          values: EntriesArray,
                          includeValues: IncludeValuess,
                          bulkInsertOrUpdate: true,
                          extraValues: {
                            year: year,
                            month: month,
                            day_end_header_id: headerDayEnd.insertId,
                            project_id: project_id,
                            sub_department_id: req.body.sub_department_id,
                          },
                          printQuery: true,
                        })
                        .then((subResult) => {
                          console.log("closeConnection", closeConnection);
                          if (closeConnection) {
                            console.log("111");
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                            });
                          }
                          next();
                        })
                        .catch((error) => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                        });
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                } else {
                  if (closeConnection) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                    });
                  }
                  next();
                }
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            if (closeConnection) {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
              });
            }
            next();
          }
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
};

//Not in Use
function getBillDetailsFunctionality(req, res, next, resolve) {
  const _mysql = new algaehMysql();
  try {
    let service_ids = null;
    // let questions = "?";

    // const utilities = new algaehUtilities();

    if (Array.isArray(req.body)) {
      let len = req.body.length;
      // service_ids = new LINQ(req.body).Select(g => g.hims_d_services_id);
      service_ids = req.body.map((val) => {
        return val.hims_d_services_id;
      });

      // for (let i = 1; i < len; i++) {
      //   questions += ",?";
      // }
    }

    _mysql
      .executeQuery({
        query:
          "SELECT * FROM `hims_d_services` WHERE `hims_d_services_id` IN (?) AND record_status='A'",
        values: [service_ids],

        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();

        let outputArray = [];
        for (let m = 0; m < result.length; m++) {
          let servicesDetails = { ...req.body[m] };

          // let records = result[m];
          let records = _.find(
            result,
            (f) => f.hims_d_services_id === servicesDetails.hims_d_services_id
          );
          const utilities = new algaehUtilities();
          // utilities.logger().log("result: ", records.hims_d_services_id);
          // utilities.logger().log("body: ", servicesDetails.hims_d_services_id);

          // utilities.logger().log("service_type_id: ", records.service_type_id);
          // utilities
          //   .logger()
          //   .log("hims_d_services_id: ", servicesDetails.service_type_id);

          req.body[m].service_type_id = records.service_type_id;
          req.body[m].services_id = records.hims_d_services_id;

          //Calculation Declarations

          // utilities.logger().log("unit_cost: ", servicesDetails.unit_cost);
          let unit_cost =
            servicesDetails.unit_cost == undefined
              ? 0
              : servicesDetails.unit_cost;

          let from_pos = servicesDetails.from_pos;

          let zeroBill =
            servicesDetails.zeroBill == undefined
              ? false
              : servicesDetails.zeroBill;

          let FollowUp =
            servicesDetails.FollowUp == undefined
              ? false
              : servicesDetails.FollowUp;
          let gross_amount = 0,
            net_amout = 0,
            sec_unit_cost = 0;

          let patient_resp = 0,
            patient_payable = 0;

          let copay_percentage = 0,
            copay_amount = 0,
            sec_copay_percntage = 0,
            sec_copay_amount = 0;

          let comapany_resp = 0,
            company_payble = 0,
            sec_company_res = 0,
            sec_company_paybale = 0;

          let patient_tax = 0,
            company_tax = 0,
            sec_company_tax = 0,
            total_tax = 0;

          let after_dect_amout = 0,
            deductable_percentage = 0,
            deductable_amount = 0;

          let sec_deductable_percentage = 0,
            sec_deductable_amount = 0;
          let conversion_factor =
            servicesDetails.conversion_factor == undefined
              ? 0
              : servicesDetails.conversion_factor;
          // utilities.logger().log("conversion_factor: ", conversion_factor);
          let quantity =
            servicesDetails.quantity == undefined
              ? 1
              : servicesDetails.quantity;

          let discount_amout =
            servicesDetails.discount_amout == undefined
              ? 0
              : servicesDetails.discount_amout;

          let discount_percentage =
            servicesDetails.discount_percentage == undefined
              ? 0
              : servicesDetails.discount_percentage;

          let insured =
            servicesDetails.insured == undefined
              ? "N"
              : servicesDetails.insured;

          // utilities.logger().log("insured: ", insured);

          let sec_insured =
            servicesDetails.sec_insured == undefined
              ? "N"
              : servicesDetails.sec_insured;

          let approval_amt =
            servicesDetails.approval_amt == undefined
              ? 0
              : servicesDetails.approval_amt;
          let approval_limit_yesno =
            servicesDetails.approval_limit_yesno == undefined
              ? "N"
              : servicesDetails.approval_limit_yesno;

          let apprv_status =
            servicesDetails.apprv_status == undefined
              ? "NR"
              : servicesDetails.apprv_status;

          let approved_amount =
            servicesDetails.approved_amount == undefined
              ? 0
              : servicesDetails.approved_amount;

          let pre_approval =
            servicesDetails.pre_approval == undefined
              ? "N"
              : servicesDetails.pre_approval;

          let vat_applicable = servicesDetails.vat_applicable;
          let preapp_limit_exceed = "N";
          let ser_net_amount = 0;
          let ser_gross_amt = 0;
          let icd_code = "";
          let covered = "Y";
          let preapp_limit_amount =
            servicesDetails.preapp_limit_amount == undefined
              ? 0
              : servicesDetails.preapp_limit_amount;

          if (zeroBill === true) {
            let out = {
              hims_f_billing_details_id: null,
              hims_f_billing_header_id: null,
              service_type_id: records.service_type_id,
              service_name: records.service_name,
              services_id: servicesDetails.hims_d_services_id,
              quantity: 1,
              unit_cost: 0,
              insurance_yesno: null,
              gross_amount: 0,
              discount_amout: 0,
              discount_percentage: 0,
              net_amout: 0,
              copay_percentage: 0,
              copay_amount: 0,
              deductable_amount: 0,
              deductable_percentage: 0,
              tax_inclusive: "N",
              patient_tax: 0,
              company_tax: 0,
              total_tax: 0,
              patient_resp: 0,
              patient_payable: 0,
              comapany_resp: 0,
              company_payble: 0,

              sec_deductable_percentage: 0,
              sec_deductable_amount: 0,
              sec_company_res: 0,
              sec_company_tax: 0,
              sec_company_paybale: 0,
              sec_copay_percntage: 0,
              sec_copay_amount: 0,
            };
            outputArray.push(out);
            _mysql.releaseConnection();
            req.records = { billdetails: outputArray };
            next();
            return;
          }

          new Promise((resolve, reject) => {
            try {
              // utilities.logger().log("insured: ", insured);
              // utilities.logger().log("sec_insured: ", sec_insured);
              if (insured == "Y") {
                // let callInsurance =

                req.body[m].insurance_id =
                  req.body[m].primary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id =
                  req.body[m].primary_network_office_id;
                req.body[m].network_id = req.body[m].primary_network_id;

                insuranceServiceDetails(req.body[m], next, _mysql, resolve);
              } else if (sec_insured == "Y") {
                req.body[m].insurance_id =
                  req.body[m].secondary_insurance_provider_id;
                req.body[m].hims_d_insurance_network_office_id =
                  req.body[m].secondary_network_office_id;
                req.body[m].network_id = req.body[m].secondary_network_id;

                insuranceServiceDetails(req.body[m], next, _mysql, resolve);
              } else {
                resolve({});
              }
            } catch (e) {
              _mysql.releaseConnection();
              reject(e);
            }
          })
            .then((policydtls) => {
              //utilities.logger().log("policydtls: ", policydtls);

              //utilities.logger().log("covered: ", policydtls.covered);
              covered =
                policydtls != null
                  ? policydtls.covered != null
                    ? policydtls.covered
                    : "N"
                  : "N";
              // utilities.logger().log("covered: ", covered);
              // utilities.logger().log("pre_approval: ", pre_approval);
              // utilities.logger().log("apprv_status: ", apprv_status);
              if (
                covered == "N" ||
                (pre_approval == "Y" && apprv_status == "RJ")
              ) {
                insured = "N";
              }

              // utilities
              //   .logger()
              //   .log("approval_limit_yesno: ", approval_limit_yesno);
              if (approval_limit_yesno == "Y") {
                pre_approval = "Y";
              }

              if (pre_approval == "N") {
                pre_approval =
                  policydtls !== null ? policydtls.pre_approval : "N";
              }

              icd_code =
                policydtls.cpt_code !== null
                  ? policydtls.cpt_code
                  : records.cpt_code;

              if (insured == "Y" && policydtls.covered == "Y") {
                ser_net_amount = policydtls.net_amount;
                ser_gross_amt = policydtls.gross_amt;

                if (policydtls.company_service_price_type == "N") {
                  unit_cost =
                    unit_cost != 0 ? unit_cost : policydtls.net_amount;
                } else {
                  unit_cost = unit_cost != 0 ? unit_cost : policydtls.gross_amt;
                }

                // if (conversion_factor != 0) {
                //   unit_cost = unit_cost * conversion_factor;
                // }
                gross_amount = quantity * unit_cost;

                if (discount_amout > 0) {
                  discount_percentage = (discount_amout / gross_amount) * 100;
                } else if (discount_percentage > 0) {
                  discount_amout = (gross_amount * discount_percentage) / 100;
                  discount_amout = discount_amout.toFixed(2);
                }
                net_amout = gross_amount - discount_amout;

                //Patient And Company
                if (policydtls.copay_status == "Y") {
                  copay_amount = policydtls.copay_amt;
                  copay_percentage = (copay_amount / net_amout) * 100;
                } else {
                  // utilities
                  //   .logger()
                  //   .log("service_type_id: ", records.service_type_id);
                  if (
                    appsettings.hims_d_service_type.service_type_id
                      .Consultation == records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_consultation;
                    deductable_percentage = policydtls.deductible;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Procedure ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent_trt;
                    deductable_percentage = policydtls.deductible_trt;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Provider ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .InventoryItem == records.service_type_id
                  ) {
                    //Not there
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Lab ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent;
                    deductable_percentage = policydtls.deductible_lab;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NursingCare == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Miscellaneous == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Anesthesia == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Bed ==
                    records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.OT ==
                    records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Radiology ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_percent_rad;
                    deductable_percentage = policydtls.deductible_rad;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Pharmacy ==
                    records.service_type_id
                  ) {
                    copay_percentage = policydtls.copay_medicine;
                    deductable_percentage = policydtls.deductible_medicine;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NonService == records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Package ==
                    records.service_type_id
                  ) {
                    //Not There
                    copay_percentage = policydtls.copay_percent;
                  }

                  deductable_amount = (net_amout * deductable_percentage) / 100;
                  after_dect_amout = net_amout - deductable_amount;
                  copay_amount = (after_dect_amout * copay_percentage) / 100;
                  copay_amount = copay_amount.toFixed(2);
                }

                patient_resp = copay_amount + deductable_amount;
                comapany_resp = (net_amout - patient_resp).toFixed(2);

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = (
                    (patient_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                }

                if (records.vat_applicable == "Y") {
                  company_tax = (
                    (comapany_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                }
                total_tax = (patient_tax + company_tax).toFixed(2);

                patient_payable = (patient_resp + patient_tax).toFixed(2);

                // console.log("approved_amount: ", approved_amount);
                // console.log("unit_cost: ", unit_cost);

                if (approved_amount !== 0 && approved_amount < unit_cost) {
                  let diff_val = approved_amount - comapany_resp;
                  patient_payable = (patient_payable + diff_val).toFixed(2);
                  patient_resp = (patient_resp + diff_val).toFixed(2);
                  comapany_resp = comapany_resp - diff_val;
                }

                company_payble = net_amout - patient_resp;

                company_payble = (company_payble + company_tax).toFixed(2);

                preapp_limit_amount = policydtls.preapp_limit;
                if (policydtls.preapp_limit !== 0) {
                  approval_amt = approval_amt + company_payble;
                  if (approval_amt > policydtls.preapp_limit) {
                    preapp_limit_exceed = "Y";
                  }
                }
                // utilities.logger().log("patient_payable: ", patient_payable);
                //If primary and secondary exists
                if (sec_insured == "Y") {
                  req.body[m].insurance_id =
                    req.body[m].secondary_insurance_provider_id;
                  req.body[m].hims_d_insurance_network_office_id =
                    req.body[m].secondary_network_office_id;
                  req.body[m].network_id = req.body[m].secondary_network_id;
                  //Secondary Insurance
                  return new Promise((resolve, reject) => {
                    try {
                      // let callInsurance =
                      insuranceServiceDetails(
                        req.body[m],
                        req.db,
                        next,
                        connection,
                        resolve
                      );
                      //if (callInsurance != null) resolve(callInsurance);
                    } catch (e) {
                      reject(e);
                    }
                  });
                }
              } else {
                if (FollowUp === true) {
                  unit_cost =
                    unit_cost != 0 ? unit_cost : records.followup_free_fee;
                } else {
                  if (insured == "Y") {
                    unit_cost = policydtls.gross_amt;
                  } else {
                    unit_cost =
                      from_pos == "Y"
                        ? unit_cost
                        : unit_cost != 0
                        ? unit_cost
                        : records.standard_fee;
                  }
                }

                // if (conversion_factor != 0) {
                //   unit_cost = unit_cost * conversion_factor;
                // }
                gross_amount = quantity * unit_cost;

                if (discount_amout > 0) {
                  discount_percentage = (discount_amout / gross_amount) * 100;
                } else if (discount_percentage > 0) {
                  discount_amout = (gross_amount * discount_percentage) / 100;
                  discount_amout = discount_amout.toFixed(2);
                }
                net_amout = gross_amount - discount_amout;
                patient_resp = net_amout;

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = (
                    (patient_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                  total_tax = patient_tax;
                }

                // patient_payable = net_amout + patient_tax;
                patient_payable = patient_resp + patient_tax.toFixed(2);
              }
            })
            .then((secpolicydtls) => {
              if (secpolicydtls != null) {
                // debugFunction("secpolicydtls");
                //secondary Insurance
                sec_unit_cost = patient_resp;

                //Patient And Company
                if (secpolicydtls.copay_status == "Y") {
                  // debugFunction("secpolicydtls Y");
                  sec_copay_amount = secpolicydtls.copay_amt;
                  sec_copay_percntage =
                    (sec_copay_amount / sec_unit_cost) * 100;
                } else {
                  // debugFunction("secpolicydtls N");
                  if (
                    appsettings.hims_d_service_type.service_type_id
                      .Consultation == records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_consultation;
                    sec_deductable_percentage = secpolicydtls.deductible;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Procedure ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent_trt;
                    sec_deductable_percentage = secpolicydtls.deductible_trt;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Provider ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .InventoryItem == records.service_type_id
                  ) {
                    //Not there
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Lab ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent;
                    sec_deductable_percentage = secpolicydtls.deductible_lab;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NursingCare == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Miscellaneous == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .Anesthesia == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Bed ==
                    records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.OT ==
                    records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Radiology ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_percent_rad;
                    sec_deductable_percentage = secpolicydtls.deductible_rad;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Pharmacy ==
                    records.service_type_id
                  ) {
                    sec_copay_percntage = secpolicydtls.copay_medicine;
                    sec_deductable_percentage =
                      secpolicydtls.deductible_medicine;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id
                      .NonService == records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  } else if (
                    appsettings.hims_d_service_type.service_type_id.Package ==
                    records.service_type_id
                  ) {
                    //Not There
                    sec_copay_percntage = secpolicydtls.copay_percent;
                  }

                  sec_deductable_amount =
                    (sec_unit_cost * sec_deductable_percentage) / 100;
                  after_dect_amout = sec_unit_cost - deductable_amount;

                  sec_copay_amount =
                    (after_dect_amout * sec_copay_percntage) / 100;

                  sec_copay_amount = sec_copay_amount.toFixed(2);
                }

                patient_resp = sec_copay_amount + sec_deductable_amount;
                sec_company_res = sec_unit_cost - patient_resp;

                if (vat_applicable == "Y" && records.vat_applicable == "Y") {
                  patient_tax = (
                    (patient_resp * records.vat_percent) /
                    100
                  ).toFixed(2);
                }

                if (records.vat_applicable == "Y") {
                  sec_company_tax = (
                    (sec_company_res * records.vat_percent) /
                    100
                  ).toFixed(2);
                }
                total_tax = patient_tax + company_tax + sec_company_res;

                patient_payable = patient_resp + patient_tax.toFixed(2);
                sec_company_paybale =
                  sec_unit_cost - patient_resp + sec_company_tax;
              }
              // utilities
              //   .logger()
              //   .log(
              //     "hims_d_services_id: ",
              //     servicesDetails.hims_d_services_id
              //   );
              // utilities
              //   .logger()
              //   .log("service_type_id: ", records.service_type_id);

              // utilities
              //   .logger()
              //   .log("hims_d_services_id: ", records.hims_d_services_id);

              discount_percentage = discount_percentage.toFixed(3);
              let out = extend(
                {
                  hims_f_billing_details_id: null,
                  hims_f_billing_header_id: null,
                  service_type_id: null,
                  services_id: null,
                  quantity: 0,
                  unit_cost: 0,
                  insurance_yesno: null,
                  gross_amount: 0,
                  discount_amout: 0,
                  discount_percentage: 0,
                  net_amout: 0,
                  copay_percentage: 0,
                  copay_amount: 0,
                  deductable_amount: 0,
                  deductable_percentage: 0,
                  tax_inclusive: "N",
                  patient_tax: 0,
                  company_tax: 0,
                  total_tax: 0,
                  patient_resp: 0,
                  patient_payable: 0,
                  comapany_resp: 0,
                  company_payble: 0,
                  // sec_company: 0,
                  sec_deductable_percentage: 0,
                  sec_deductable_amount: 0,
                  sec_company_res: 0,
                  sec_company_tax: 0,
                  sec_company_paybale: 0,
                  sec_copay_percntage: 0,
                  sec_copay_amount: 0,
                },
                {
                  service_type_id: records.service_type_id,
                  service_name: records.service_name,
                  services_id: records.hims_d_services_id,
                  quantity: quantity,
                  unit_cost: unit_cost,
                  gross_amount: gross_amount,
                  discount_amout: discount_amout,
                  discount_percentage: discount_percentage,
                  net_amout: net_amout,
                  patient_resp: patient_resp,
                  patient_payable: patient_payable,
                  copay_percentage: copay_percentage,
                  copay_amount: copay_amount,

                  comapany_resp: comapany_resp,
                  company_payble: company_payble,
                  patient_tax: patient_tax,
                  company_tax: company_tax,
                  sec_company_tax: sec_company_tax,
                  total_tax: total_tax,

                  sec_copay_percntage: sec_copay_percntage,
                  sec_copay_amount: sec_copay_amount,
                  sec_company_res: sec_company_res,
                  sec_company_paybale: sec_company_paybale,
                  pre_approval: insured == "Y" ? pre_approval : "N",
                  insurance_yesno: insured,
                  preapp_limit_exceed: preapp_limit_exceed,
                  approval_amt: approval_amt,
                  preapp_limit_amount: preapp_limit_amount,
                  approval_limit_yesno: approval_limit_yesno,
                  ser_net_amount: ser_net_amount,
                  ser_gross_amt: ser_gross_amt,
                  icd_code: icd_code,

                  sec_deductable_percentage: sec_deductable_percentage,
                  sec_deductable_amount: sec_deductable_amount,
                  deductable_percentage: deductable_percentage,
                  deductable_amount: deductable_amount,
                  item_id: servicesDetails.item_id,
                  expiry_date: servicesDetails.expirydt,
                  batchno: servicesDetails.batchno,
                  qtyhand: servicesDetails.qtyhand,
                  grnno: servicesDetails.grnno,
                  uom_id: servicesDetails.sales_uom,
                  item_category: servicesDetails.item_category_id,
                  item_group_id: servicesDetails.item_group_id,
                  package_id: servicesDetails.package_id,
                  package_visit_type: servicesDetails.package_visit_type,
                  package_type: servicesDetails.package_type,
                  actual_amount: servicesDetails.actual_amount,
                  pack_expiry_date: servicesDetails.expiry_date,
                }
              );

              outputArray.push(out);
            })
            .then(() => {
              if (m == result.length - 1) {
                _mysql.releaseConnection();
                return resolve({ billdetails: outputArray });
              }
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(
                utilities.httpStatus().generateError(httpStatus.badRequest, e)
              );
            });
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
function insuranceServiceDetails(body, next, _mysql, resolve) {
  try {
    let input = { ...body };

    const utilities = new algaehUtilities();

    _mysql
      .executeQuery({
        query:
          "select price_from ,copay_consultation,copay_percent,copay_percent_rad,copay_percent_trt,\
          copay_percent_dental,copay_medicine, preapp_limit, deductible, deductible_lab,deductible_rad, deductible_trt, \
          deductible_medicine from hims_d_insurance_network_office where hims_d_insurance_network_office_id=?",
        values: [input.hims_d_insurance_network_office_id],
        printQuery: true,
      })
      .then((resultOffic) => {
        if (resultOffic != null && resultOffic[0].price_from == "S") {
          _mysql
            .executeQuery({
              query:
                "select Inp.company_service_price_type,copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
              net_amount,gross_amt, cpt_code from hims_d_services_insurance sI inner join hims_d_insurance_provider Inp on\
              Inp.hims_d_insurance_provider_id=sI.insurance_id where sI.insurance_id =? and sI.service_type_id =? and \
              sI.services_id =?  and sI.record_status='A' and Inp.record_status='A'",
              values: [
                input.insurance_id,
                input.service_type_id,
                input.services_id,
              ],
              printQuery: true,
            })
            .then((result_s) => {
              // utilities.logger().log("result_s: ", result_s);
              // utilities.logger().log("resultOffic: ", resultOffic);
              let result = { ...result_s[0], ...resultOffic[0] };
              return resolve(result);
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        }
        if (resultOffic != null && resultOffic[0].price_from == "P") {
          _mysql
            .executeQuery({
              query:
                "select Inp.insurance_provider_name, Inp.company_service_price_type, net.network_type, \
            copay_status,copay_amt,deductable_status,deductable_amt,pre_approval,covered,\
            net_amount,gross_amt from (( hims_d_services_insurance_network Sin\
            inner join hims_d_insurance_network net on net.hims_d_insurance_network_id=Sin.network_id) \
             inner join hims_d_insurance_provider Inp on Sin.insurance_id=Inp.hims_d_insurance_provider_id  )\
             where  Sin.network_id=? AND Sin.services_id=? and service_type_id=? and  Sin.record_status='A' and net.record_status='A'",
              values: [
                input.network_id,
                input.services_id,
                input.service_type_id,
              ],
              printQuery: true,
            })
            .then((result_p) => {
              let result = { ...result_p, ...resultOffic };
              return resolve(result);
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  } catch (e) {
    next(e);
  }
}
function insertOrderServices(options) {
  return new Promise((resolve, reject) => {
    try {
      const _mysql = options._mysql;
      const _services = options.services;
      const inputParam = options.inputParam;
      const req = options.req;
      const utilities = new algaehUtilities();
      if (_services.length > 0) {
        let IncludeValues = [
          "patient_id",
          "visit_id",
          "doctor_id",
          "service_type_id",
          "services_id",
          "trans_package_detail_id",
          "unit_cost",
          "gross_amount",
          "net_amout",
          "patient_resp",
          "patient_payable",
        ];

        _mysql
          .executeQuery({
            query: "INSERT INTO hims_f_ordered_services(??) VALUES ?",
            values: _services,
            includeValues: IncludeValues,
            extraValues: {
              quantity: 1,
              discount_amout: 0,
              discount_percentage: 0,
              copay_percentage: 0,
              copay_amount: 0,
              deductable_amount: 0,
              deductable_percentage: 0,

              patient_tax: 0,
              company_tax: 0,
              total_tax: 0,
              comapany_resp: 0,
              company_payble: 0,
              sec_deductable_percentage: 0,
              sec_deductable_amount: 0,
              sec_company_res: 0,
              sec_company_tax: 0,
              sec_company_paybale: 0,
              sec_copay_percntage: 0,
              sec_copay_amount: 0,
              created_by: req.userIdentity.algaeh_d_app_user_id,
              created_date: new Date(),
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              updated_date: new Date(),
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((order_detail) => {
            let patient_id;
            let doctor_id;
            let visit_id;
            let services = new LINQ(inputParam.package_details)
              .Select((s) => {
                patient_id = s.patient_id;
                doctor_id = s.doctor_id;
                visit_id = s.visit_id;
                return s.services_id;
              })
              .ToArray();

            let servicesForPreAproval = [];

            servicesForPreAproval.push(patient_id);
            servicesForPreAproval.push(doctor_id);
            servicesForPreAproval.push(visit_id);
            servicesForPreAproval.push(services);

            _mysql
              .executeQuery({
                query:
                  "SELECT hims_f_ordered_services_id,services_id,created_date, service_type_id, test_type from hims_f_ordered_services\
                   where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
                values: servicesForPreAproval,
                printQuery: true,
              })
              .then((ordered_services) => {
                req.body.billdetails = ordered_services;
                resolve();
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                  reject(error);
                });
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              options.next(error);
              reject(error);
            });
          });
      } else {
        req.body.billdetails = [];
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
